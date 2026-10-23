import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/data", () => ({
  site: {
    bookingEmail: "test@example.com",
    socials: [{ label: "X", url: "https://x.com/test" }],
    faq: [{ q: "¿Qué pasa con </script>?", a: "Nada" }],
    dates: [
      { date: "2026-01-01", venue: "Pasada", city: "Madrid", country: "ES" },
      { date: "2026-11-20", venue: "Sala Futura", city: "Madrid", country: "ES", ticketsUrl: "https://t.example/1", status: "agotada" },
    ],
  },
}));

import { buildJsonLd, buildJsonLdString } from "@/lib/json-ld";

describe("buildJsonLd", () => {
  it("emite un MusicEvent sólo por las fechas futuras y refleja el sold out", () => {
    const graph = buildJsonLd(new Date("2026-10-23T12:00:00Z"))["@graph"] as Array<Record<string, unknown>>;
    const events = graph.filter((n) => n["@type"] === "MusicEvent");
    expect(events).toHaveLength(1);
    expect(events[0]).toMatchObject({
      name: "DJ Swarthy en Sala Futura",
      startDate: "2026-11-20",
      offers: { availability: "https://schema.org/SoldOut" },
    });
  });

  it("no emite eventos cuando todas las fechas han pasado", () => {
    const graph = buildJsonLd(new Date("2027-01-01T12:00:00Z"))["@graph"] as Array<Record<string, unknown>>;
    expect(graph.some((n) => n["@type"] === "MusicEvent")).toBe(false);
  });

  it("escapa < para que el contenido no pueda cerrar la etiqueta script", () => {
    const str = buildJsonLdString(new Date("2026-10-23T12:00:00Z"));
    expect(str).not.toContain("</script>");
    expect(str).toContain("\\u003c/script>");
    expect(JSON.parse(str)["@context"]).toBe("https://schema.org");
  });
});
