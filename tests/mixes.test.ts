import { describe, expect, it } from "vitest";
import {
  PRODUCTIONS_LIMIT,
  SETS_LIMIT,
  formatDuration,
  isSet,
  mixStyle,
  splitMixes,
  toMixCard,
} from "@/lib/mixes";
import type { TrackItem, VideoItem } from "@/lib/feeds";

const video = (id: string, title: string, durationSec?: number): VideoItem => ({
  id,
  title,
  url: `https://www.youtube.com/watch?v=${id}`,
  thumbnail: `https://i.ytimg.com/vi/${id}/hq720.jpg`,
  publishedAt: "",
  durationSec,
});

const track = (id: string, title: string, durationSec?: number): TrackItem => ({
  id,
  title,
  url: `https://soundcloud.com/x/${id}`,
  publishedAt: "",
  durationSec,
});

const HOUR = 3600;

describe("isSet", () => {
  it("reconoce los títulos reales de sets del canal", () => {
    expect(isSet("Uplifting Trance Mix 2026 🔊 62 Min Non-Stop | Allen Watts")).toBe(true);
    expect(isSet("This Uplifting Trance Mix - Will Give you 2026")).toBe(true);
    expect(isSet("Remember Session 90s")).toBe(true);
    expect(isSet("Live @ Mondo Disko")).toBe(true);
  });

  it("deja fuera producciones y versiones", () => {
    expect(isSet("Crystal Pulse")).toBe(false);
    expect(isSet("Euphoria Rising")).toBe(false);
    expect(isSet("Never Give Up -  Cover Swarthy")).toBe(false);
    // "Remix" y las versiones de pista no son sets aunque contengan "mix".
    expect(isSet("Children (Swarthy Remix)")).toBe(false);
    expect(isSet("Swarthy - New Beginning (Original mix)")).toBe(false);
    expect(isSet("Euphoria Rising (Extended Mix)")).toBe(false);
  });

  it("sin duración, si el título dice cuántos minutos dura se le aplica el umbral", () => {
    expect(isSet("Trance Mix 2026 | 20 Min Melodic Session - DJ Swarthy")).toBe(true);
    expect(isSet("Psytrance Mix 2026 | 48 Min at 143 BPM Non-Stop")).toBe(true);
    // Un avance de tres minutos no es una sesión aunque se llame "mix".
    expect(isSet("New mix out now | 3 min teaser")).toBe(false);
  });

  it("con duración manda la duración, diga lo que diga el título", () => {
    // Sesiones reales de SoundCloud que el título no delata.
    expect(isSet("Dj Swarthy -  TranceMision Vol03", 3704)).toBe(true);
    expect(isSet("Dj Swarthy - Trance Agosto 2025", 4147)).toBe(true);
    expect(isSet("TOP CLASSIC TRANCE ANTHEMS", 2141)).toBe(true);
    // Y una pista de cuatro minutos titulada como "mix".
    expect(isSet("Celtic Trance | Epic Melodic Trance Mix 2026", 253)).toBe(false);
    expect(isSet("Swarthy -  Break the Silence", 479)).toBe(false);
  });
});

describe("mixStyle", () => {
  it("agrupa los títulos reales por familia de estilo", () => {
    expect(mixStyle("Uplifting Trance Mix 2026 🔊 62 Min Non-Stop")).toBe("trance");
    expect(mixStyle("Psytrance Mix 2026 | 48 Min at 143 BPM Non-Stop")).toBe("trance");
    expect(mixStyle("Dj Swarthy -  TranceMision Vol03")).toBe("trance");
    expect(mixStyle("Trance Classics Mix | Darude, ATB, Tiësto | 2 Hours")).toBe("clasicos");
    expect(mixStyle("90s Trance Classics Mix | Fragma, Zhi-Vago")).toBe("clasicos");
    expect(mixStyle("Hard Trance & Remember Mix | KI/KI, Billy Gillies")).toBe("clasicos");
    expect(mixStyle("Puturrufu Session Remenber")).toBe("clasicos");
    expect(mixStyle("TOP CLASSIC TRANCE ANTHEMS")).toBe("clasicos");
    // "Melodic" no convierte en trance una sesión de house.
    expect(mixStyle("Afro House Mix 2026 | Best Afro & Melodic House Tracks")).toBe("house");
    expect(mixStyle("Kubernetes Set")).toBe("otros");
    expect(mixStyle("Enero 2018  Latino  - Swarthy")).toBe("otros");
  });

  it("\"disco\" sólo cuenta como palabra entera", () => {
    expect(mixStyle("Nu Disco & Funky Session")).toBe("house");
    expect(mixStyle("Trance Discovery Vol. 1")).toBe("trance");
  });
});

describe("formatDuration", () => {
  it("formatea en horas y minutos", () => {
    expect(formatDuration(3712)).toBe("1 h 02 min");
    expect(formatDuration(2931)).toBe("49 min");
    expect(formatDuration(2 * HOUR)).toBe("2 h");
    // 59 min 40 s redondea a la hora en punto, no a "0 h 60 min".
    expect(formatDuration(HOUR - 20)).toBe("1 h");
    expect(formatDuration(6933)).toBe("1 h 56 min");
  });
});

describe("splitMixes", () => {
  it("destaca el set más reciente de cada plataforma y aparta las producciones", () => {
    const { featured, sets, productions } = splitMixes(
      [video("v1", "Trance Mix 1"), video("v2", "Trance Mix 2")],
      [track("t1", "Crystal Pulse"), track("t2", "Progressive Set"), track("t3", "Cover X")]
    );
    expect(featured.map((e) => e.item.id)).toEqual(["v1", "t2"]);
    expect(sets.map((e) => e.item.id)).toEqual(["v2"]);
    expect(productions.map((e) => e.item.id)).toEqual(["t1", "t3"]);
  });

  it("si una plataforma no tiene sets, la otra ocupa los dos destacados", () => {
    const { featured, productions } = splitMixes(
      [video("v1", "Mix A"), video("v2", "Mix B")],
      [track("t1", "Crystal Pulse")]
    );
    expect(featured.map((e) => e.item.id)).toEqual(["v1", "v2"]);
    expect(productions.map((e) => e.item.id)).toEqual(["t1"]);
  });

  it("sin feeds no destaca nada", () => {
    expect(splitMixes([], [])).toEqual({ featured: [], sets: [], productions: [] });
  });

  it("clasifica por duración el feed real de SoundCloud: pistas delante, sesiones detrás", () => {
    const { featured, sets, productions } = splitMixes(
      [video("v1", "Afro House Mix 2026", 3405), video("v2", "DJ Swarthy - New Beginning (Official Audio)", 205)],
      [
        track("t1", "Crystal Pulse", 267),
        track("t2", "Never Give Up -  Cover Swarthy", 239),
        track("t3", "TOP CLASSIC TRANCE ANTHEMS", 2141),
        track("t4", "Dj Swarthy -  TranceMision Vol03", 3704),
      ]
    );
    expect(featured.map((e) => e.item.id)).toEqual(["v1", "t3"]);
    expect(sets.map((e) => e.item.id)).toEqual(["t4"]);
    expect(productions.map((e) => e.item.id)).toEqual(["v2", "t1", "t2"]);
  });

  it("acota lo que llega a la página", () => {
    const { featured, sets, productions } = splitMixes(
      Array.from({ length: 40 }, (_, i) => video(`set${i}`, `Sesión ${i}`, HOUR)),
      Array.from({ length: 20 }, (_, i) => track(`p${i}`, `Pista ${i}`, 200))
    );
    expect(featured).toHaveLength(2);
    expect(sets).toHaveLength(SETS_LIMIT);
    expect(productions).toHaveLength(PRODUCTIONS_LIMIT);
  });
});

describe("toMixCard", () => {
  it("aplana un vídeo con duración, estilo y antigüedad relativa", () => {
    const card = toMixCard({
      kind: "video",
      item: { ...video("dQw4w9WgXcQ", "Trance Classics Mix | 2 Hours", 6902), publishedLabel: "hace 2 meses" },
    });
    expect(card).toEqual({
      key: "video:dQw4w9WgXcQ",
      kind: "video",
      id: "dQw4w9WgXcQ",
      title: "Trance Classics Mix | 2 Hours",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      thumbnail: "https://i.ytimg.com/vi/dQw4w9WgXcQ/hq720.jpg",
      duration: "1 h 55 min",
      style: "clasicos",
      date: "hace 2 meses",
    });
  });

  it("prefiere la fecha exacta y la formatea en la zona horaria de Madrid", () => {
    // 23:30 UTC del 31 de diciembre ya es 1 de enero en Madrid.
    const card = toMixCard({
      kind: "video",
      item: { ...video("v1", "Mix"), publishedAt: "2026-12-31T23:30:00+00:00", publishedLabel: "hace 1 día" },
    });
    expect(card.date).toBe("1 ene 2027");
    expect(card.duration).toBeUndefined();
  });

  it("aplana un track de SoundCloud con su carátula y la fecha del RSS", () => {
    const card = toMixCard({
      kind: "track",
      item: {
        ...track("123", "Dj Swarthy - Trance Agosto 2025", 4147),
        publishedAt: "Sun, 20 Sep 2026 07:10:46 +0000",
        artwork: "https://i1.sndcdn.com/artworks-x-t3000x3000.jpg",
      },
    });
    expect(card).toMatchObject({
      key: "track:123",
      thumbnail: "https://i1.sndcdn.com/artworks-x-t3000x3000.jpg",
      duration: "1 h 09 min",
      style: "trance",
      date: "20 sept 2026",
    });
  });

  it("sin fecha ni antigüedad no inventa nada", () => {
    expect(toMixCard({ kind: "track", item: track("1", "Sesión Shya", HOUR) }).date).toBeUndefined();
  });
});
