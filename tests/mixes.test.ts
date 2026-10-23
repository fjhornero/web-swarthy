import { describe, expect, it } from "vitest";
import { isSet, splitMixes } from "@/lib/mixes";
import type { TrackItem, VideoItem } from "@/lib/feeds";

const video = (id: string, title: string, isShort = false): VideoItem => ({
  id,
  title,
  url: `https://www.youtube.com/watch?v=${id}`,
  thumbnail: "",
  publishedAt: "",
  isShort,
});

const track = (id: string, title: string): TrackItem => ({
  id,
  title,
  url: `https://soundcloud.com/x/${id}`,
  publishedAt: "",
});

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
});

describe("splitMixes", () => {
  it("destaca el set más reciente de cada plataforma y aparta las producciones", () => {
    const { featured, sets, productions } = splitMixes(
      [video("v1", "Trance Mix 1"), video("v2", "Trance Mix 2"), video("s1", "Short mix", true)],
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
});
