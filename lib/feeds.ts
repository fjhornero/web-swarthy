const YT_CHANNEL_ID = "UCssrEHx7wZR0jvlABi46TNQ";
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
  publishedAt: string;
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

export async function getLatestYouTubeVideos(): Promise<VideoItem[]> {
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
