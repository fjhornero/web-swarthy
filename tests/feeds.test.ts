import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  FEED_LIMIT,
  getLatestSoundCloudTracks,
  getLatestYouTubeVideos,
  parseDuration,
} from "@/lib/feeds";

const fetchMock = vi.fn();

beforeEach(() => {
  vi.stubGlobal("fetch", fetchMock);
  fetchMock.mockReset();
});
afterEach(() => vi.unstubAllGlobals());

const ok = (body: string) => ({ ok: true, text: async () => body });
const notFound = { ok: false, status: 404, text: async () => "" };

function scItem(
  id: string,
  title = "Track",
  link = `https://soundcloud.com/dj_swarthy/t${id}`,
  art = "https://i1.sndcdn.com/artworks-x-t500x500.jpg",
  duration = "00:04:27"
) {
  return `<item><title><![CDATA[${title}]]></title><link>${link}</link><guid isPermaLink="false">tag:soundcloud,2010:tracks/${id}</guid><pubDate>Sun, 20 Sep 2026 10:00:00 +0000</pubDate><itunes:duration>${duration}</itunes:duration><itunes:image href="${art}"/></item>`;
}

describe("parseDuration", () => {
  it("convierte relojes a segundos", () => {
    expect(parseDuration("56:45")).toBe(56 * 60 + 45);
    expect(parseDuration("1:01:52")).toBe(3712);
    expect(parseDuration(" 01:55:33 ")).toBe(6933);
  });

  it("rechaza lo que no es una duración", () => {
    for (const value of [undefined, "", "4", "4K", "EN DIRECTO", "1:2", "00:00", "a:bc"]) {
      expect(parseDuration(value)).toBeUndefined();
    }
  });
});

describe("getLatestSoundCloudTracks", () => {
  it("parsea el RSS, decodifica entidades y valida id, enlace y carátula", async () => {
    const xml = `<rss><channel>${scItem("111", "Crystal &amp; Pulse")}${scItem("abc")}${scItem("222", "Mala", "javascript:alert(1)", "https://evil.example/x.jpg", "no")}</channel></rss>`;
    fetchMock.mockResolvedValue(ok(xml));
    const tracks = await getLatestSoundCloudTracks();
    expect(tracks.map((t) => t.id)).toEqual(["111", "222"]);
    expect(tracks[0].title).toBe("Crystal & Pulse");
    expect(tracks[0].artwork).toMatch(/sndcdn\.com/);
    expect(tracks[0].durationSec).toBe(267);
    expect(tracks[1].url).toBe("https://soundcloud.com/dj_swarthy");
    expect(tracks[1].artwork).toBeUndefined();
    expect(tracks[1].durationSec).toBeUndefined();
  });

  it("llega a las sesiones largas que van detrás de las últimas producciones", async () => {
    // El feed real: primero una decena de pistas de 3-8 min y después las
    // sesiones de una hora. Con el tope antiguo (8) no llegaba ninguna.
    const items = [
      ...Array.from({ length: 9 }, (_, i) => scItem(String(100 + i), `Pista ${i}`)),
      scItem("900", "TranceMision Vol03", undefined, undefined, "01:01:44"),
    ];
    fetchMock.mockResolvedValue(ok(`<rss><channel>${items.join("")}</channel></rss>`));
    const tracks = await getLatestSoundCloudTracks();
    expect(tracks.at(-1)).toMatchObject({ id: "900", durationSec: 3704 });
  });

  it("no repite un track que el feed traiga dos veces", async () => {
    fetchMock.mockResolvedValue(ok(`<rss><channel>${scItem("111")}${scItem("111")}${scItem("222")}</channel></rss>`));
    expect((await getLatestSoundCloudTracks()).map((t) => t.id)).toEqual(["111", "222"]);
  });

  it("limita el número de items y devuelve [] si falla la red", async () => {
    const xml = `<rss><channel>${Array.from({ length: FEED_LIMIT + 10 }, (_, i) => scItem(String(1000 + i))).join("")}</channel></rss>`;
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
  const rssEntry = (id: string, short = false) =>
    `<entry><yt:videoId>${id}</yt:videoId><media:title>T &amp; T</media:title><link rel="alternate" href="https://www.youtube.com/${short ? "shorts/" : "watch?v="}${id}"/><published>2026-10-12T10:00:00+00:00</published><media:thumbnail url="https://i1.ytimg.com/vi/${id}/hqdefault.jpg"/></entry>`;

  // Formato actual de la página del canal: las dos partes de la fila de
  // metadatos (visualizaciones y antigüedad) llevan etiqueta accesible, y la
  // duración va en una insignia sobre la miniatura.
  const lockup = (
    id: string,
    duration = "1:01:52",
    thumbnail = `https://i.ytimg.com/vi/${id}/hq720.jpg?sqp=firmado&rs=caduca`
  ) =>
    JSON.stringify({
      lockupViewModel: {
        contentId: id,
        contentType: "LOCKUP_CONTENT_TYPE_VIDEO",
        contentImage: {
          thumbnailViewModel: {
            image: { sources: [{ url: thumbnail, width: 360, height: 202 }] },
            overlays: [
              {
                thumbnailBottomOverlayViewModel: {
                  badges: [{ thumbnailBadgeViewModel: { animatedText: "Reproduciendo", text: duration } }],
                },
              },
            ],
          },
        },
        metadata: {
          lockupMetadataViewModel: {
            title: { content: `Mix ${id}` },
            metadata: {
              contentMetadataViewModel: {
                metadataRows: [
                  {
                    metadataParts: [
                      { text: { content: "121" }, accessibilityLabel: "121 visualizaciones" },
                      { text: { content: "hace 1 m" }, accessibilityLabel: "hace 1 mes" },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    });
  const channelPage = (...lockups: string[]) =>
    `<html><script>var ytInitialData = {"contents":[${lockups.join(",")}]};</script></html>`;

  /** Enruta por URL: las dos fuentes se piden a la vez. Sin cuerpo, responde 404. */
  function mockSources({ rss, page }: { rss?: string; page?: string }) {
    fetchMock.mockImplementation(async (url: string) => {
      const body = url.includes("/feeds/videos.xml") ? rss : page;
      return body === undefined ? notFound : ok(body);
    });
  }

  it("lista los vídeos de la página del canal con duración y antigüedad", async () => {
    mockSources({ page: channelPage(lockup("dQw4w9WgXcQ"), lockup("bad id!")) });
    const videos = await getLatestYouTubeVideos();
    expect(videos).toHaveLength(1);
    expect(videos[0]).toEqual({
      id: "dQw4w9WgXcQ",
      title: "Mix dQw4w9WgXcQ",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg",
      durationSec: 3712,
      // La etiqueta accesible: ni "hace 1 m" ni el número de visualizaciones.
      publishedLabel: "hace 1 mes",
      publishedAt: "",
    });
  });

  it("entiende también el formato antiguo de la fila de metadatos", async () => {
    const old = `{"lockupViewModel":{"contentId":"dQw4w9WgXcQ","contentType":"LOCKUP_CONTENT_TYPE_VIDEO","metadata":{"lockupMetadataViewModel":{"title":{"content":"Mix"},"metadata":{"contentMetadataViewModel":{"metadataRows":[{"metadataParts":[{"text":{"content":"1 M de visualizaciones"}},{"text":{"content":"hace 9 días","accessibilityLabel":"hace 9 días"}}]}]}}}}}}`;
    mockSources({ page: channelPage(old) });
    const [video] = await getLatestYouTubeVideos();
    expect(video.publishedLabel).toBe("hace 9 días");
    expect(video.durationSec).toBeUndefined();
    // Sin miniatura declarada, la que existe para cualquier vídeo.
    expect(video.thumbnail).toBe("https://i.ytimg.com/vi/dQw4w9WgXcQ/hqdefault.jpg");
  });

  it("usa la miniatura que declara YouTube y sólo si es de ese mismo vídeo", async () => {
    const id = "dQw4w9WgXcQ";
    const thumbnailOf = async (url: string) => {
      mockSources({ page: channelPage(lockup(id, "33:21", url)) });
      return (await getLatestYouTubeVideos())[0].thumbnail;
    };
    const fallback = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

    // Un vídeo que no se subió en HD no tiene hq720: pedirla daba 404.
    expect(await thumbnailOf(`https://i.ytimg.com/vi/${id}/hqdefault.jpg?sqp=x&rs=y`)).toBe(fallback);
    expect(await thumbnailOf(`https://i3.ytimg.com/vi/${id}/sddefault.jpg`)).toBe(
      `https://i.ytimg.com/vi/${id}/sddefault.jpg`
    );
    // Otro dominio, otro vídeo o una ruta rara no se aceptan.
    expect(await thumbnailOf(`https://evil.example/vi/${id}/hq720.jpg`)).toBe(fallback);
    expect(await thumbnailOf("https://i.ytimg.com/vi/abcdefghijk/hq720.jpg")).toBe(fallback);
    expect(await thumbnailOf(`https://i.ytimg.com/vi/${id}/../../x.jpg`)).toBe(fallback);
  });

  it("descarta vídeos repetidos y títulos que no son texto", async () => {
    const weird = JSON.stringify({
      lockupViewModel: {
        contentId: "abcdefghijk",
        contentType: "LOCKUP_CONTENT_TYPE_VIDEO",
        metadata: { lockupMetadataViewModel: { title: { content: { runs: ["no es texto"] } } } },
      },
    });
    mockSources({
      page: channelPage(lockup("dQw4w9WgXcQ"), lockup("dQw4w9WgXcQ"), weird),
      rss: `<feed>${rssEntry("dQw4w9WgXcQ")}${rssEntry("dQw4w9WgXcQ")}</feed>`,
    });
    expect((await getLatestYouTubeVideos()).map((v) => v.id)).toEqual(["dQw4w9WgXcQ"]);

    // El RSS como única fuente tampoco repite.
    mockSources({ rss: `<feed>${rssEntry("dQw4w9WgXcQ")}${rssEntry("dQw4w9WgXcQ")}</feed>` });
    expect(await getLatestYouTubeVideos()).toHaveLength(1);
  });

  it("pone la fecha exacta del RSS a los vídeos que éste conoce", async () => {
    mockSources({
      page: channelPage(lockup("dQw4w9WgXcQ"), lockup("abcdefghijk", "48:51")),
      rss: `<feed>${rssEntry("dQw4w9WgXcQ")}</feed>`,
    });
    const videos = await getLatestYouTubeVideos();
    expect(videos.map((v) => v.publishedAt)).toEqual(["2026-10-12T10:00:00+00:00", ""]);
    expect(videos.map((v) => v.durationSec)).toEqual([3712, 2931]);
  });

  it("si la página falla sirve el RSS, con los shorts descartados antes del tope", async () => {
    // Las subidas reales del canal: más shorts que sesiones. Recortando antes
    // de filtrar, la sesión del final se quedaba fuera.
    const shorts = Array.from({ length: FEED_LIMIT + 5 }, (_, i) =>
      rssEntry(`short${String(i).padStart(6, "0")}`, true)
    );
    mockSources({
      rss: `<feed>${rssEntry("../../evil")}${shorts.join("")}${rssEntry("dQw4w9WgXcQ")}</feed>`,
    });
    const videos = await getLatestYouTubeVideos();
    expect(videos.map((v) => v.id)).toEqual(["dQw4w9WgXcQ"]);
    expect(videos[0].title).toBe("T & T");
    expect(videos[0].url).toBe("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    expect(videos[0].durationSec).toBeUndefined();
  });

  it("devuelve [] si fallan las dos fuentes", async () => {
    mockSources({});
    expect(await getLatestYouTubeVideos()).toEqual([]);

    fetchMock.mockRejectedValue(new Error("boom"));
    expect(await getLatestYouTubeVideos()).toEqual([]);
  });
});
