const YT_CHANNEL_ID = "UCssrEHx7wZR0jvlABi46TNQ";
const YT_HANDLE = "swarthy_dj";
const SC_USER_ID = "1764128";

// Un upstream colgado bloquearía la regeneración ISR de la home (page.tsx
// espera a los cuatro feeds) y, en el build, lo tumbaría entero.
const FEED_TIMEOUT_MS = 8_000;
// Cota al cuerpo que se parsea: las páginas de canal de YouTube pesan ~1 MB
// y no hay motivo para procesar respuestas mucho mayores.
const MAX_BODY_CHARS = 3_000_000;
// Tope de elementos que devuelve cada feed. Es una cota defensiva (un feed
// manipulado no puede inflar el render), no lo que se pinta: qué sesiones y
// cuántas llegan a la página lo decide lib/mixes.ts. Tiene que ser holgado:
// en SoundCloud las sesiones largas quedan por detrás de las últimas
// producciones, y con un tope de 8 no llegaba ninguna a la web.
export const FEED_LIMIT = 30;

// Identificadores tal y como los define cada plataforma. Se validan antes de
// interpolarlos en la URL del iframe para que un feed manipulado no pueda
// alterar la ruta del embed.
const YT_VIDEO_ID = /^[\w-]{11}$/;
const SC_TRACK_ID = /^\d+$/;
const SC_TRACK_URL = /^https:\/\/(soundcloud\.com|on\.soundcloud\.com)\//;
const SC_ARTWORK_URL = /^https:\/\/[a-z0-9-]+\.sndcdn\.com\//;

// "1:01:52" o "56:45". Los dos puntos son obligatorios para no confundir con
// una duración cualquier número suelto que aparezca en una insignia.
const CLOCK = /^\d{1,3}(?::\d{2}){1,2}$/;
// YouTube da la antigüedad en el idioma pedido (`hl=es`): "hace 2 meses",
// "Emitido hace 3 semanas".
const AGE_LABEL = /\bhace\b/i;

// YouTube limita (429/403) las peticiones de RSS desde IPs de datacenter
// cuando no llevan un User-Agent de navegador. Sin esto el feed llega vacío
// en producción y la sección cae al enlace de fallback.
const FEED_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept: "application/atom+xml, application/xml, text/xml; q=0.9, */*; q=0.8",
};

export interface VideoItem {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  /** ISO 8601. Sólo lo da el RSS, que cubre las últimas subidas; vacío en el resto. */
  publishedAt: string;
  /**
   * Antigüedad relativa tal y como la muestra YouTube ("hace 2 meses"). Sólo la
   * trae la página del canal, que no expone la fecha exacta.
   */
  publishedLabel?: string;
  /** Duración en segundos. Sólo la trae la página del canal. */
  durationSec?: number;
}

export interface TrackItem {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  /** Carátula del track; ausente si el item del RSS no trae itunes:image */
  artwork?: string;
  /** Duración en segundos; ausente si el item no trae itunes:duration */
  durationSec?: number;
}

/** "1:01:52" o "56:45" → segundos. `undefined` si no tiene forma de duración. */
export function parseDuration(value: string | undefined): number | undefined {
  const text = value?.trim() ?? "";
  if (!CLOCK.test(text)) return undefined;
  const seconds = text.split(":").reduce((total, part) => total * 60 + Number(part), 0);
  return seconds > 0 ? seconds : undefined;
}

/**
 * Dos fuentes que se complementan:
 *
 * - La pestaña `/videos` del canal lista sólo vídeos largos (los shorts tienen
 *   pestaña propia), hasta 30 de una vez y con su duración. No da la fecha
 *   exacta, sólo la antigüedad relativa.
 * - El RSS da la fecha exacta, pero sólo de las 15 últimas subidas y mezclando
 *   shorts, que en este canal son la mayoría: como fuente única dejaba la
 *   sección con dos o tres sesiones.
 *
 * La lista sale de la página y el RSS sólo pone fecha a los vídeos que conoce.
 * Si la página falla (YouTube reorganiza ese JSON a menudo) se sirve lo que dé
 * el RSS, sin duración; y si YouTube vuelve a retirar el RSS, como ya hizo una
 * vez, la página sigue bastando.
 */
export async function getLatestYouTubeVideos(): Promise<VideoItem[]> {
  const [fromPage, fromRss] = await Promise.all([
    getYouTubeVideosFromChannelPage(),
    getYouTubeVideosFromRss(),
  ]);
  if (fromPage.length === 0) return fromRss;

  const dates = new Map(fromRss.map((video) => [video.id, video.publishedAt]));
  return fromPage.map((video) => ({ ...video, publishedAt: dates.get(video.id) ?? "" }));
}

async function getYouTubeVideosFromRss(): Promise<VideoItem[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`,
      {
        headers: FEED_HEADERS,
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
      }
    );
    if (!res.ok) return [];
    const xml = (await res.text()).slice(0, MAX_BODY_CHARS);

    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const videos: VideoItem[] = [];
    // Un id repetido en el feed acabaría como clave de React duplicada.
    const seen = new Set<string>();
    let m;

    while ((m = entryRegex.exec(xml)) !== null) {
      const entry = m[1];
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<media:title>([^<]+)<\/media:title>/);
      const linkMatch = entry.match(/<link[^>]+href="([^"]+)"/);
      const pubMatch = entry.match(/<published>([^<]+)<\/published>/);
      const thumbMatch = entry.match(/<media:thumbnail[^>]+url="([^"]+)"/);

      if (!idMatch || !YT_VIDEO_ID.test(idMatch[1]) || seen.has(idMatch[1])) continue;
      // Los shorts se descartan aquí, antes de aplicar el tope: son la mayoría
      // de las subidas y, recortando primero, desplazaban a las sesiones.
      if (linkMatch?.[1].includes("/shorts/")) continue;

      const id = idMatch[1];
      seen.add(id);

      videos.push({
        id,
        title: decodeHtmlEntities(titleMatch?.[1] ?? ""),
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: thumbMatch?.[1] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        publishedAt: pubMatch?.[1] ?? "",
      });
      if (videos.length >= FEED_LIMIT) break;
    }

    return videos;
  } catch {
    return [];
  }
}

/**
 * La página `/@handle/videos` embebe un JSON (`ytInitialData`) con la rejilla
 * de vídeos ya ordenada de más reciente a más antiguo. Se recorre el árbol
 * buscando nodos `lockupViewModel` en lugar de navegar por la ruta exacta de
 * pestañas, porque YouTube reorganiza esa jerarquía con frecuencia.
 */
async function getYouTubeVideosFromChannelPage(): Promise<VideoItem[]> {
  try {
    const res = await fetch(`https://www.youtube.com/@${YT_HANDLE}/videos?hl=es&gl=ES`, {
      headers: {
        ...FEED_HEADERS,
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "es-ES,es;q=0.9",
        // Evita el muro de consentimiento que YouTube sirve a las IPs europeas
        // sin cookies, que devolvería un HTML sin ytInitialData.
        Cookie: "SOCS=CAI; CONSENT=YES+cb",
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
    });
    if (!res.ok) return [];

    const html = (await res.text()).slice(0, MAX_BODY_CHARS);
    const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
    if (!match) return [];

    const videos: VideoItem[] = [];
    const seen = new Set<string>();

    for (const lockup of collectLockups(JSON.parse(match[1]))) {
      const id = lockup.contentId;
      if (!id || !YT_VIDEO_ID.test(id) || seen.has(id)) continue;
      seen.add(id);

      const meta = lockup.metadata?.lockupMetadataViewModel;
      // El JSON es de un tercero y su forma no está garantizada: un título que
      // no fuese texto acabaría como hijo de React y rompería el render.
      const title = meta?.title?.content;
      if (typeof title !== "string" || !title) continue;

      // La fila de metadatos es "N visualizaciones • hace X" y las dos partes
      // traen etiqueta accesible, así que la antigüedad se reconoce por su
      // texto ("hace…") y no por su posición: quedarse con la primera parte
      // etiquetada pintaba el número de visualizaciones como si fuera la fecha.
      // Se prefiere la etiqueta accesible ("hace 1 mes") a la visible ("hace 1 m").
      const rows = meta?.metadata?.contentMetadataViewModel?.metadataRows ?? [];
      const age = rows
        .flatMap((row) => row.metadataParts ?? [])
        .flatMap((part) => [part.accessibilityLabel, part.text?.accessibilityLabel, part.text?.content])
        .find((label): label is string => typeof label === "string" && AGE_LABEL.test(label));

      videos.push({
        id,
        title,
        url: `https://www.youtube.com/watch?v=${id}`,
        thumbnail: findThumbnail(lockup.contentImage, id) ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        publishedAt: "",
        publishedLabel: age,
        durationSec: findDuration(lockup.contentImage),
      });
      if (videos.length >= FEED_LIMIT) break;
    }

    return videos;
  } catch {
    return [];
  }
}

interface LockupViewModel {
  contentId?: string;
  contentType?: string;
  /** Miniatura y sus insignias superpuestas (entre ellas, la duración) */
  contentImage?: unknown;
  metadata?: {
    lockupMetadataViewModel?: {
      title?: { content?: string };
      metadata?: {
        contentMetadataViewModel?: {
          metadataRows?: Array<{
            metadataParts?: Array<{
              text?: { content?: string; accessibilityLabel?: string };
              accessibilityLabel?: string;
            }>;
          }>;
        };
      };
    };
  };
}

/** Recorre el JSON en profundidad y devuelve los lockups de vídeo en orden. */
function collectLockups(node: unknown): LockupViewModel[] {
  const found: LockupViewModel[] = [];

  const walk = (value: unknown) => {
    if (Array.isArray(value)) {
      value.forEach(walk);
      return;
    }
    if (value === null || typeof value !== "object") return;

    const record = value as Record<string, unknown>;
    const lockup = record.lockupViewModel as LockupViewModel | undefined;
    if (lockup?.contentType === "LOCKUP_CONTENT_TYPE_VIDEO") found.push(lockup);

    Object.values(record).forEach(walk);
  };

  walk(node);
  return found;
}

/**
 * La duración va en una insignia sobre la miniatura ("1:01:52"). Igual que con
 * los lockups, se busca cualquier `text` con forma de reloj en lugar de seguir
 * la ruta exacta de overlays, que YouTube cambia a menudo.
 */
function findDuration(node: unknown): number | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findDuration(child);
      if (found) return found;
    }
    return undefined;
  }
  if (node === null || typeof node !== "object") return undefined;

  for (const [key, value] of Object.entries(node)) {
    const found =
      key === "text" && typeof value === "string" ? parseDuration(value) : findDuration(value);
    if (found) return found;
  }
  return undefined;
}

/**
 * Miniatura que YouTube declara para el vídeo. Casi todos tienen `hq720.jpg`,
 * pero los que no se subieron en HD sólo `hqdefault.jpg`: pedir a ciegas la de
 * 720p dejaba esa tarjeta con la imagen rota. Se toma la ruta que trae el JSON
 * sin sus parámetros firmados (caducan; la ruta sin firmar es estable) y sólo
 * si es de ytimg.com y de este mismo vídeo. Como en el resto del fichero, se
 * busca en profundidad en vez de seguir la ruta exacta de claves.
 */
function findThumbnail(node: unknown, id: string): string | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findThumbnail(child, id);
      if (found) return found;
    }
    return undefined;
  }
  if (node === null || typeof node !== "object") return undefined;

  for (const [key, value] of Object.entries(node)) {
    if (key === "url" && typeof value === "string") {
      const match = value.match(/^https:\/\/[a-z0-9]+\.ytimg\.com(\/vi\/([\w-]{11})\/[\w-]+\.jpg)(?:\?|$)/);
      if (match && match[2] === id) return `https://i.ytimg.com${match[1]}`;
    } else {
      const found = findThumbnail(value, id);
      if (found) return found;
    }
  }
  return undefined;
}

export async function getLatestSoundCloudTracks(): Promise<TrackItem[]> {
  try {
    const res = await fetch(
      `https://feeds.soundcloud.com/users/soundcloud:users:${SC_USER_ID}/sounds.rss`,
      {
        headers: FEED_HEADERS,
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(FEED_TIMEOUT_MS),
      }
    );
    if (!res.ok) return [];
    const xml = (await res.text()).slice(0, MAX_BODY_CHARS);

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const tracks: TrackItem[] = [];
    const seen = new Set<string>();
    let m;

    while ((m = itemRegex.exec(xml)) !== null) {
      const item = m[1];
      const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
      const guidMatch = item.match(/<guid[^>]*>([^<]+)<\/guid>/);
      const dateMatch = item.match(/<pubDate>([^<]+)<\/pubDate>/);
      const artworkMatch = item.match(/<itunes:image[^>]+href="([^"]+)"/);
      const durationMatch = item.match(/<itunes:duration>([^<]+)<\/itunes:duration>/);

      if (!titleMatch) continue;

      const guid = guidMatch?.[1] ?? "";
      const id = guid.match(/tracks\/(\d+)/)?.[1] ?? "";
      if (!SC_TRACK_ID.test(id) || seen.has(id)) continue;
      seen.add(id);

      const url = linkMatch?.[1]?.trim() ?? "";
      const artwork = artworkMatch?.[1];

      tracks.push({
        id,
        title: decodeHtmlEntities(titleMatch[1].trim()),
        url: SC_TRACK_URL.test(url) ? url : `https://soundcloud.com/dj_swarthy`,
        publishedAt: dateMatch?.[1]?.trim() ?? "",
        artwork: artwork && SC_ARTWORK_URL.test(artwork) ? artwork : undefined,
        durationSec: parseDuration(durationMatch?.[1]),
      });
      if (tracks.length >= FEED_LIMIT) break;
    }

    return tracks;
  } catch {
    return [];
  }
}

function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}
