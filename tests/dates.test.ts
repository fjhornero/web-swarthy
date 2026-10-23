import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/data", () => ({
  site: {
    dates: [
      { date: "2026-01-10", venue: "Pasada", city: "Madrid", country: "ES" },
      { date: "2026-12-31", venue: "Futura B", city: "Madrid", country: "ES" },
      { date: "2026-10-23", venue: "Hoy", city: "Madrid", country: "ES" },
      { date: "2026-11-05", venue: "Futura A", city: "Madrid", country: "ES" },
      { date: "31/12/2026", venue: "Formato malo", city: "Madrid", country: "ES" },
      { date: "2026-02-30", venue: "Día inexistente", city: "Madrid", country: "ES" },
    ],
  },
}));

import { isIsoDay, todayIso, upcomingDates } from "@/lib/dates";

describe("todayIso", () => {
  it("devuelve el día en Europe/Madrid aunque el proceso corra en otra zona", () => {
    // 23:30 UTC del 22 de octubre = 01:30 del 23 en Madrid (CEST).
    expect(todayIso(new Date("2026-10-22T23:30:00Z"))).toBe("2026-10-23");
    // 21:30 UTC = 23:30 en Madrid: sigue siendo día 22.
    expect(todayIso(new Date("2026-10-22T21:30:00Z"))).toBe("2026-10-22");
  });
});

describe("isIsoDay", () => {
  it("acepta sólo YYYY-MM-DD con fecha real", () => {
    expect(isIsoDay("2026-10-23")).toBe(true);
    expect(isIsoDay("2026-02-30")).toBe(false);
    expect(isIsoDay("31/12/2026")).toBe(false);
    expect(isIsoDay("2026-10-23T00:00:00Z")).toBe(false);
    expect(isIsoDay("")).toBe(false);
  });
});

describe("upcomingDates", () => {
  it("filtra pasadas e inválidas, conserva el bolo de hoy y ordena ascendente", () => {
    const result = upcomingDates(new Date("2026-10-23T12:00:00Z"));
    expect(result.map((g) => g.venue)).toEqual(["Hoy", "Futura A", "Futura B"]);
  });

  it("el bolo de hoy sigue apareciendo hasta medianoche en Madrid", () => {
    // 21:59 UTC del 23 = 23:59 en Madrid: todavía es hoy.
    expect(upcomingDates(new Date("2026-10-23T21:59:00Z"))[0].venue).toBe("Hoy");
    // 22:00 UTC del 23 = 00:00 del 24 en Madrid: ya pasó.
    expect(upcomingDates(new Date("2026-10-23T22:00:00Z"))[0].venue).toBe("Futura A");
  });
});
