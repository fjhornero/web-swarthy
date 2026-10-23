import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { FEED_LIMIT, getLatestSoundCloudTracks, getLatestYouTubeVideos } from "@/lib/feeds";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => vi.unstubAllGlobals());

const ok = (body: string) => ({ ok: true, text: async () => body });

function scItem(id: string, title = "Track", link = `https://soundcloud.com/dj_swarthy/t${id}`, art = "https://i1.sndcdn.com/artworks-x-t500x500.jpg") {
  return `<item><title><![CDATA[${title}]]></title><link>${link}</link><guid isPermaLink="false">tag:soundcloud,2010:tracks/${id}</guid><pubDate>Sun, 20 Sep 2026 10:00:00 +0000</pubDate><itunes:image href="${art}"/></item>`;
}

describe("getLatestSoundCloudTracks", () => {
  it("parsea el RSS, decodifica entidades y valida id, enlace y carátula", async () => {
    const xml = `<rss><channel>${scItem("111", "Crystal &amp; Pulse")}${scItem("abc")}${scItem("222", "Mala", "javascript:alert(1)", "https://evil.example/x.jpg")}</channel></rss>`;
    fetchMock.mockResolvedValue(ok(xml));
    const tracks = await getLatestSoundCloudTracks();
    expect(tracks.map((t) => t.id)).toEqual(["111", "222"]);
    expect(tracks[0].title).toBe("Crystal & Pulse");
    expect(tracks[0].artwork).toMatch(/sndcdn\.com/);
    expect(tracks[1].url).toBe("https://soundcloud.com/dj_swarthy");
    expect(tracks[1].artwork).toBeUndefined();
  });

  it("limita el número de items y devuelve [] si falla la red", async () => {
    const xml = `<rss><channel>${Array.from({ length: 20 }, (_, i) => scItem(String(1000 + i))).join("")}</channel></rss>`;
    fetchMock.mockResolvedValue(ok(xml));
    expect((await getLatestSoundCloudTracks()).length).toBe(FEED_LIMIT);

    fetchMock.mockRejectedValue(new Error("boom"));
    expect(await getLatestSoundCloudTracks()).toEqual([]);
  });

  it("pasa un timeout a fetch", async () => {
    fetchMock.mockResolvedValue(ok("<rss/>"));
    await getLatestSoundCloudTracks();
    expect(fetchMock.mock.calls[0][1].signal).toBeInstanceOf(AbortSignal);
  });
});

describe("getLatestYouTubeVideos", () => {
  it("usa el RSS cuando está disponible y descarta ids que no son de vídeo", async () => {
    const entry = (id: string, short = false) =>
      `<entry><yt:videoId>${id}</yt:videoId><media:title>T &amp; T</media:title><link rel="alternate" href="https://www.youtube.com/${short ? "shorts/" : "watch?v="}${id}"/><published>2026-10-12T10:00:00+00:00</published><media:thumbnail url="https://i1.ytimg.com/vi/${id}/hqdefault.jpg"/></entry>`;
    fetchMock.mockResolvedValueOnce(ok(`<feed>${entry("dQw4w9WgXcQ")}${entry("../../evil")}${entry("abcdefghijk", true)}</feed>`));
    const videos = await getLatestYouTubeVideos();
    expect(videos.map((v) => v.id)).toEqual(["dQw4w9WgXcQ", "abcdefghijk"]);
    expect(videos[0].title).toBe("T & T");
    expect(videos[0].url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(videos[1].isShort).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("cae al raspado de la página del canal cuando el RSS responde 404", async () => {
    const lockup = (id: string) =>
      `{"lockupViewModel":{"contentId":"${id}","contentType":"LOCKUP_CONTENT_TYPE_VIDEO","metadata":{"lockupMetadataViewModel":{"title":{"content":"Mix ${id}"},"metadata":{"contentMetadataViewModel":{"metadataRows":[{"metadataParts":[{"text":{"content":"1 M de visualizaciones"}},{"text":{"content":"hace 9 días","accessibilityLabel":"hace 9 días"}}]}]}}}}}}`;
    const html = `<html><script>var ytInitialData = {"contents":[${lockup("dQw4w9WgXcQ")},${lockup("bad id!")}]};</script></html>`;
    fetchMock.mockResolvedValueOnce({ ok: false, status: 404, text: async () => "" });
    fetchMock.mockResolvedValueOnce(ok(html));
    const videos = await getLatestYouTubeVideos();
    expect(videos).toHaveLength(1);
    expect(videos[0]).toMatchObject({
      id: "dQw4w9WgXcQ",
      title: "Mix dQw4w9WgXcQ",
      publishedLabel: "hace 9 días",
      thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg",
    });
  });
});
