import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/data", () => ({
  site: {
    bookingEmail: "test@example.com",
    genres: ["Trance", "Remember"],
    socials: [{ label: "X", url: "https://x.com/test" }],
    press: { bioShort: "Bio de prueba con </script> dentro" },
    faq: [{ q: "¿Qué pasa con </script>?", a: "Nada" }],
    dates: [
      { date: "2026-01-01", venue: "Pasada", city: "Madrid", country: "ES" },
      { date: "2026-11-20", venue: "Sala Futura", city: "Madrid", country: "ES", ticketsUrl: "https://t.example/1", status: "agotada" },
    ],
  },
}));

import {
  baseNodes,
  buildJsonLd,
  buildJsonLdString,
  homeNodes,
  pressKitNodes,
  type JsonLdNode,
} from "@/lib/json-ld";
import { SITE_URL } from "@/lib/site";

const NOW = new Date("2026-10-23T12:00:00Z");
const ARTIST_ID = `${SITE_URL}/#artist`;

const types = (nodes: JsonLdNode[]) => nodes.map((n) => n["@type"]);

function byType(nodes: JsonLdNode[], type: string): JsonLdNode {
  const node = nodes.find((n) => n["@type"] === type);
  if (!node) throw new Error(`Falta el nodo ${type}`);
  return node;
}

/** Ancho y alto de un PNG o un JPEG, leídos de la cabecera del fichero. */
function imageSize(file: string): { width: number; height: number } {
  const bytes = readFileSync(file);
  // PNG: el primer bloque (IHDR) lleva ancho y alto en posiciones fijas.
  if (bytes.readUInt32BE(0) === 0x89504e47) {
    return { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  }
  // JPEG: se saltan segmentos hasta el SOFn (0xC0-0xCF salvo DHT, JPG y DAC).
  for (let i = 2; i < bytes.length; i += 2 + bytes.readUInt16BE(i + 2)) {
    const marker = bytes[i + 1];
    if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
      return { width: bytes.readUInt16BE(i + 7), height: bytes.readUInt16BE(i + 5) };
    }
  }
  throw new Error(`No se han podido leer las medidas de ${file}`);
}

/** Separa los `@id` que un grafo define de los que sólo cita ({ "@id": … } a secas). */
function idsOf(value: unknown, defined: string[] = [], cited: string[] = []) {
  if (Array.isArray(value)) {
    for (const item of value) idsOf(item, defined, cited);
  } else if (value !== null && typeof value === "object") {
    const node = value as Record<string, unknown>;
    const id = node["@id"];
    if (typeof id === "string") {
      (Object.keys(node).length === 1 ? cited : defined).push(id);
    }
    for (const child of Object.values(node)) idsOf(child, defined, cited);
  }
  return { defined, cited };
}

describe("baseNodes (layout, todas las rutas)", () => {
  it("sólo lleva la entidad: ni FAQPage, ni Service, ni MusicEvent", () => {
    expect(types(baseNodes())).toEqual(["MusicGroup", "WebSite"]);
  });

  it("toma los géneros, la descripción, los perfiles y el contacto de lib/data.ts", () => {
    const artist = byType(baseNodes(), "MusicGroup");
    expect(artist.genre).toEqual(["Trance", "Remember"]);
    expect(artist.description).toBe("Bio de prueba con </script> dentro");
    expect(artist.sameAs).toEqual(["https://x.com/test"]);
    expect(artist.contactPoint).toEqual({
      "@type": "ContactPoint",
      contactType: "booking",
      email: "test@example.com",
    });
  });

  it("no repite el nombre entre los nombres alternativos", () => {
    for (const node of baseNodes()) {
      const alternates = (node.alternateName as string[]).map((n) => n.toLowerCase());
      expect(alternates.length).toBeGreaterThan(0);
      expect(alternates).not.toContain(String(node.name).toLowerCase());
    }
  });

  it("declara logo e imagen con las medidas reales de los ficheros de public/", () => {
    const artist = byType(baseNodes(), "MusicGroup");
    for (const key of ["logo", "image"]) {
      const image = artist[key] as { "@type": string; url: string; width: number; height: number };
      expect(image["@type"]).toBe("ImageObject");
      expect(image.url.startsWith(`${SITE_URL}/`)).toBe(true);
      const file = join(process.cwd(), "public", image.url.slice(SITE_URL.length));
      expect(existsSync(file), `${key}: no existe ${file}`).toBe(true);
      expect({ width: image.width, height: image.height }).toEqual(imageSize(file));
    }
  });
});

describe("homeNodes (portada)", () => {
  it("lleva el servicio, la FAQ y un MusicEvent sólo por las fechas futuras, con su sold out", () => {
    const nodes = homeNodes(NOW);
    expect(types(nodes)).toEqual(["Service", "FAQPage", "MusicEvent"]);
    expect(byType(nodes, "MusicEvent")).toMatchObject({
      name: "DJ Swarthy en Sala Futura",
      startDate: "2026-11-20",
      offers: { availability: "https://schema.org/SoldOut" },
    });
  });

  it("no emite eventos cuando todas las fechas han pasado", () => {
    expect(types(homeNodes(new Date("2027-01-01T12:00:00Z")))).toEqual(["Service", "FAQPage"]);
  });

  it("vuelca la FAQ de lib/data.ts", () => {
    expect(byType(homeNodes(NOW), "FAQPage").mainEntity).toEqual([
      {
        "@type": "Question",
        name: "¿Qué pasa con </script>?",
        acceptedAnswer: { "@type": "Answer", text: "Nada" },
      },
    ]);
  });

  it("la url del servicio es la de la página, sin fragmento", () => {
    expect(byType(homeNodes(NOW), "Service").url).toBe(SITE_URL);
  });
});

describe("pressKitNodes (/press-kit)", () => {
  it("lleva las migas Inicio → Press kit y nada de FAQ, servicio ni eventos", () => {
    const nodes = pressKitNodes();
    expect(types(nodes)).toEqual(["BreadcrumbList"]);
    expect(nodes[0].itemListElement).toEqual([
      { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Press kit", item: `${SITE_URL}/press-kit` },
    ]);
  });
});

describe("referencias por @id", () => {
  it("toda referencia se resuelve dentro de base + página", () => {
    for (const page of [homeNodes(NOW), pressKitNodes()]) {
      const { defined, cited } = idsOf([...baseNodes(), ...page]);
      expect(cited.filter((id) => !defined.includes(id))).toEqual([]);
    }
  });

  it("la portada cita al artista, que sólo define el layout", () => {
    const home = idsOf(homeNodes(NOW));
    expect(home.cited).toContain(ARTIST_ID);
    expect(home.defined).not.toContain(ARTIST_ID);
    expect(idsOf(baseNodes()).defined).toContain(ARTIST_ID);
  });
});

describe("buildJsonLdString", () => {
  it("escapa < para que el contenido no pueda cerrar la etiqueta script", () => {
    // La bio (layout) y la FAQ (portada) del mock llevan un "</script>".
    for (const nodes of [baseNodes(), homeNodes(NOW)]) {
      const str = buildJsonLdString(nodes);
      expect(str).not.toContain("<");
      expect(str).toContain("\\u003c/script>");
      // El escape no altera el contenido: al leerlo vuelve el grafo original.
      expect(JSON.parse(str)).toEqual(buildJsonLd(nodes));
    }
  });
});
