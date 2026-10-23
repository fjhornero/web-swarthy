import type { VideoItem, TrackItem } from "@/lib/feeds";

// Separa los sets (lo que un promotor quiere oír para saber cómo pincha) de
// las producciones y versiones, que los feeds mezclan. No hay metadato que lo
// diga, así que se decide por el título: "mix", "set", "session", "live",
// "b2b", "non-stop" o una duración ("62 Min") marcan un set.
const SET_PATTERN = /\b(mix|mixes|set|session|sesi[oó]n|live|b2b|non-stop)\b|\d+\s?min\b/i;
// "(Original mix)", "Extended Mix"… son versiones de una pista, no sets.
const TRACK_VERSION_PATTERN = /\b(original|extended|radio|club|dub|vocal|instrumental)\s+mix\b/i;

export function isSet(title: string): boolean {
  return SET_PATTERN.test(title) && !TRACK_VERSION_PATTERN.test(title);
}

export type MixEntry =
  | { kind: "video"; item: VideoItem }
  | { kind: "track"; item: TrackItem };

export interface SplitMixes {
  /** Hasta dos sets destacados: el más reciente de cada plataforma. */
  featured: MixEntry[];
  /** El resto de sets, intercalados por plataforma. */
  sets: MixEntry[];
  productions: MixEntry[];
}

/**
 * Los feeds llegan ya ordenados del más reciente al más antiguo dentro de cada
 * plataforma. Se intercalan vídeo/track para que una plataforma con mucho más
 * material no acapare la rejilla.
 */
export function splitMixes(videos: VideoItem[], tracks: TrackItem[]): SplitMixes {
  const video: MixEntry[] = videos
    .filter((v) => !v.isShort)
    .map((item) => ({ kind: "video", item }));
  const track: MixEntry[] = tracks
    .filter((t) => t.id)
    .map((item) => ({ kind: "track", item }));
  const set = (e: MixEntry) => isSet(e.item.title);

  // Si una plataforma no tiene ningún set, su hueco de destacado lo ocupa el
  // siguiente set de la otra en lugar de una tarjeta vacía.
  const sets = interleave(video.filter(set), track.filter(set));
  return {
    featured: sets.slice(0, 2),
    sets: sets.slice(2),
    productions: interleave(
      video.filter((e) => !set(e)),
      track.filter((e) => !set(e))
    ),
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
