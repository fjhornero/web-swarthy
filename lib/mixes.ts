import type { VideoItem, TrackItem } from "@/lib/feeds";

// Separa las sesiones (lo que un promotor quiere oír para saber cómo pincha)
// de las producciones y versiones, que los feeds mezclan.
//
// Con duración manda la duración: una pista suelta no llega a diez minutos (la
// más larga publicada ronda los ocho) y una sesión, por corta que sea, los
// pasa de largo. Decidirlo por el título dejaba fuera sesiones de una hora
// como "TranceMision Vol03" o "Trance Agosto 2025", que no dicen "mix" ni "set".
const SET_MIN_SECONDS = 10 * 60;
// Sin duración (el RSS de YouTube como única fuente) se cae al título. Si el
// propio título dice cuánto dura ("62 Min Non-Stop") se le aplica el mismo
// umbral, de modo que un "3 min teaser" no pase por sesión; si no, bastan
// "mix", "set", "session", "live", "b2b" o "non-stop".
const TITLE_MINUTES = /(\d+)\s?min\b/i;
const SET_WORDS = /\b(mix|mixes|set|session|sesi[oó]n|live|b2b|non-stop)\b/i;
// "(Original mix)", "Extended Mix"… son versiones de una pista, no sets.
const TRACK_VERSION_PATTERN = /\b(original|extended|radio|club|dub|vocal|instrumental)\s+mix\b/i;

export function isSet(title: string, durationSec?: number): boolean {
  if (durationSec !== undefined) return durationSec >= SET_MIN_SECONDS;
  if (TRACK_VERSION_PATTERN.test(title)) return false;

  const minutes = title.match(TITLE_MINUTES);
  if (minutes) return Number(minutes[1]) * 60 >= SET_MIN_SECONDS;
  return SET_WORDS.test(title);
}

/** Familias de estilo por las que se filtran las sesiones, en el orden de los filtros. */
export const MIX_STYLES = {
  trance: "Trance",
  clasicos: "Clásicos y remember",
  house: "House",
  otros: "Otros estilos",
} as const;

export type MixStyle = keyof typeof MIX_STYLES;

// No hay metadato de género: se deduce del título. El orden importa: "Trance
// Classics Mix" es una sesión de clásicos y "Afro & Melodic House" es house
// aunque contenga "melodic". "disco" va como palabra entera para que
// "Trance Discovery" no acabe en house.
const STYLE_PATTERNS: ReadonlyArray<readonly [MixStyle, RegExp]> = [
  ["clasicos", /classics?|cl[aá]sic|anthems|reme[mn]ber|\b(?:[89]0|00)s\b|old\s?school/i],
  ["house", /house|\bdisco\b|afro/i],
  ["trance", /trance|uplifting|progressive|melodic|psy/i],
];

export function mixStyle(title: string): MixStyle {
  return STYLE_PATTERNS.find(([, pattern]) => pattern.test(title))?.[0] ?? "otros";
}

/** 3712 → "1 h 02 min"; 2931 → "49 min". */
export function formatDuration(seconds: number): string {
  const totalMinutes = Math.max(1, Math.round(seconds / 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  return minutes === 0 ? `${hours} h` : `${hours} h ${String(minutes).padStart(2, "0")} min`;
}

export type MixEntry =
  | { kind: "video"; item: VideoItem }
  | { kind: "track"; item: TrackItem };

// Cuántas sesiones (además de las destacadas) y cuántas producciones llegan a
// la página. La rejilla de sesiones es un componente cliente que recibe la
// lista entera como props, así que este tope es también el del payload.
export const SETS_LIMIT = 28;
export const PRODUCTIONS_LIMIT = 6;

export interface SplitMixes {
  /** Hasta dos sesiones destacadas: la más reciente de cada plataforma. */
  featured: MixEntry[];
  /** El resto de sesiones, intercaladas por plataforma. */
  sets: MixEntry[];
  productions: MixEntry[];
}

/**
 * Los feeds llegan ya ordenados del más reciente al más antiguo dentro de cada
 * plataforma. Se intercalan vídeo/track para que una plataforma con mucho más
 * material no acapare la rejilla.
 */
export function splitMixes(videos: VideoItem[], tracks: TrackItem[]): SplitMixes {
  const video: MixEntry[] = videos.map((item) => ({ kind: "video", item }));
  const track: MixEntry[] = tracks
    .filter((t) => t.id)
    .map((item) => ({ kind: "track", item }));
  const set = (e: MixEntry) => isSet(e.item.title, e.item.durationSec);

  // Si una plataforma no tiene ningún set, su hueco de destacado lo ocupa el
  // siguiente set de la otra en lugar de una tarjeta vacía.
  const sets = interleave(video.filter(set), track.filter(set));
  return {
    featured: sets.slice(0, 2),
    sets: sets.slice(2, 2 + SETS_LIMIT),
    productions: interleave(
      video.filter((e) => !set(e)),
      track.filter((e) => !set(e))
    ).slice(0, PRODUCTIONS_LIMIT),
  };
}

function interleave<T>(a: T[], b: T[]): T[] {
  const out: T[] = [];
  for (let i = 0; i < Math.max(a.length, b.length); i++) {
    if (a[i]) out.push(a[i]);
    if (b[i]) out.push(b[i]);
  }
  return out;
}

/**
 * Lo que necesita una tarjeta para pintarse. Plano y con los textos ya
 * formateados en el servidor: la rejilla filtrable es un componente cliente y
 * formatear fechas allí arriesgaría un desajuste de hidratación.
 */
export interface MixCardData {
  /** Único entre plataformas: `video:ID` o `track:ID` */
  key: string;
  kind: MixEntry["kind"];
  id: string;
  title: string;
  /** Enlace a la plataforma de origen */
  url: string;
  thumbnail?: string;
  /** "1 h 02 min"; ausente si el feed no dio duración */
  duration?: string;
  style: MixStyle;
  /** Fecha exacta ("12 oct 2026") o antigüedad relativa ("hace 2 meses") */
  date?: string;
}

// Las fechas llegan en formatos distintos (YouTube en ISO 8601, SoundCloud en
// RFC 2822), pero ambos los parsea Date. Se formatean en una zona horaria
// fija: se renderiza en el servidor y la etiqueta no debe depender de dónde
// corra el contenedor.
const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "Europe/Madrid",
});

function formatDate(raw: string): string | undefined {
  if (!raw) return undefined;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? undefined : dateFormatter.format(d).replace(".", "");
}

export function toMixCard(entry: MixEntry): MixCardData {
  const { item } = entry;
  return {
    key: `${entry.kind}:${item.id}`,
    kind: entry.kind,
    id: item.id,
    title: item.title,
    url: item.url,
    thumbnail: entry.kind === "video" ? entry.item.thumbnail : entry.item.artwork,
    duration: item.durationSec ? formatDuration(item.durationSec) : undefined,
    style: mixStyle(item.title),
    // Sin fecha exacta (YouTube sólo la da para las últimas subidas) se usa la
    // antigüedad relativa en lugar de dejar la tarjeta sin dato.
    date:
      formatDate(item.publishedAt) ??
      (entry.kind === "video" ? entry.item.publishedLabel : undefined),
  };
}
