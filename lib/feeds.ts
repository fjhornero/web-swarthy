const YT_CHANNEL_ID = "UCssrEHx7wZR0jvlABi46TNQ";
const YT_HANDLE = "swarthy_dj";
const SC_USER_ID = "1764128";

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
  /** ISO 8601 cuando viene del RSS; vacío cuando se raspa la página del canal. */
  publishedAt: string;
  /**
   * Antigüedad relativa tal y como la muestra YouTube ("hace 9 días"). Sólo la
   * trae el raspado de la página del canal, que no expone la fecha exacta.
   */
  publishedLabel?: string;
  isShort: boolean;
}

export interface TrackItem {
  id: string;
  title: string;
  url: string;
  publishedAt: string;
  /** Carátula del track; ausente si el item del RSS no trae itunes:image */
  artwork?: string;
}

/**
 * YouTube retiró los feeds RSS públicos: `/feeds/videos.xml` responde 404 para
 * cualquier canal. Se mantiene como fuente primaria por si vuelve a estar
 * disponible, pero el camino real es ahora el raspado de la página del canal.
 */
export async function getLatestYouTubeVideos(): Promise<VideoItem[]> {
  const fromRss = await getYouTubeVideosFromRss();
  if (fromRss.length > 0) return fromRss;
  return getYouTubeVideosFromChannelPage();
}

async function getYouTubeVideosFromRss(): Promise<VideoItem[]> {
  try {
    const res = await fetch(
      `https://www.youtube.com/feeds/videos.xml?channel_id=${YT_CHANNEL_ID}`,
      { headers: FEED_HEADERS, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const xml = await res.text();

    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const videos: VideoItem[] = [];
    let m;

    while ((m = entryRegex.exec(xml)) !== null) {
      const entry = m[1];
      const idMatch = entry.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = entry.match(/<media:title>([^<]+)<\/media:title>/);
      const linkMatch = entry.match(/<link[^>]+href="([^"]+)"/);
      const pubMatch = entry.match(/<published>([^<]+)<\/published>/);
      const thumbMatch = entry.match(/<media:thumbnail[^>]+url="([^"]+)"/);

      if (!idMatch) continue;

      const id = idMatch[1];
      const url = linkMatch?.[1] ?? "";
      const isShort = url.includes("/shorts/");

      videos.push({
        id,
        title: decodeHtmlEntities(titleMatch?.[1] ?? ""),
        url,
        thumbnail: thumbMatch?.[1] ?? `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
        publishedAt: pubMatch?.[1] ?? "",
        isShort,
      });
    }

    return videos;
  } catch {
    return [];
  }
}

/**
 * Fuente de respaldo: la página `/@handle/videos` embebe un JSON (`ytInitialData`)
 * con la rejilla de vídeos ya ordenada de más reciente a más antiguo. Se recorre
 * el árbol buscando nodos `lockupViewModel` en lugar de navegar por la ruta
 * exacta de pestañas, porque YouTube reorganiza esa jerarquía con frecuencia.
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
    });
    if (!res.ok) return [];

    const html = await res.text();
    const match = html.match(/var ytInitialData = (\{[\s\S]*?\});<\/script>/);
    if (!match) return [];

    const videos: VideoItem[] = [];
    const seen = new Set<string>();

    for (const lockup of collectLockups(JSON.parse(match[1]))) {
      const id = lockup.contentId;
      if (!id || seen.has(id)) continue;
      seen.add(id);

      const meta = lockup.metadata?.lockupMetadataViewModel;
      const rows = meta?.metadata?.contentMetadataViewModel?.metadataRows ?? [];
      // La fila de metadatos es "N visualizaciones • hace X"; la antigüedad es
      // el único fragmento que trae accessibilityLabel.
      const age = rows
        .flatMap((row) => row.metadataParts ?? [])
        .find((part) => part.text?.accessibilityLabel ?? part.accessibilityLabel)?.text?.content;

      videos.push({
        id,
        title: meta?.title?.content ?? "",
        url: `https://www.youtube.com/watch?v=${id}`,
        // Las miniaturas del JSON llevan parámetros firmados que caducan; la
        // ruta sin firmar es estable y sirve el mismo 16:9 de 720p.
        thumbnail: `https://i.ytimg.com/vi/${id}/hq720.jpg`,
        publishedAt: "",
        publishedLabel: age,
        // La pestaña /videos no incluye shorts: tienen su propia pestaña.
        isShort: false,
      });
    }

    return videos;
  } catch {
    return [];
  }
}

interface LockupViewModel {
  contentId?: string;
  contentType?: string;
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

export async function getLatestSoundCloudTracks(): Promise<TrackItem[]> {
  try {
    const res = await fetch(
      `https://feeds.soundcloud.com/users/soundcloud:users:${SC_USER_ID}/sounds.rss`,
      { headers: FEED_HEADERS, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const xml = await res.text();

    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    const tracks: TrackItem[] = [];
    let m;

    while ((m = itemRegex.exec(xml)) !== null) {
      const item = m[1];
      const titleMatch = item.match(/<title>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/);
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
      const guidMatch = item.match(/<guid[^>]*>([^<]+)<\/guid>/);
      const dateMatch = item.match(/<pubDate>([^<]+)<\/pubDate>/);
      const artworkMatch = item.match(/<itunes:image[^>]+href="([^"]+)"/);

      if (!titleMatch) continue;

      const guid = guidMatch?.[1] ?? "";
      const idMatch = guid.match(/tracks\/(\d+)/);

      tracks.push({
        id: idMatch?.[1] ?? "",
        title: titleMatch[1].trim(),
        url: linkMatch?.[1]?.trim() ?? "",
        publishedAt: dateMatch?.[1]?.trim() ?? "",
        artwork: artworkMatch?.[1],
      });
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
