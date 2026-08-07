// JSON-LD estructurado + su hash SHA-256, compartido entre app/layout.tsx
// (para renderizarlo) y next.config.ts (para autorizarlo en la CSP vía hash).
//
// Usamos un hash en vez de un nonce por request a propósito: un nonce exige
// leer headers() en el layout, lo que fuerza renderizado dinámico en toda la
// app y rompe la revalidación estática horaria de la home (ver app/page.tsx).
// El contenido de este script es 100% estático por build, así que un hash es
// la opción correcta — sigue siendo válido en las páginas servidas desde caché.

import crypto from "node:crypto";
import { site } from "./data";

export const SITE_URL = "https://djswarthy.es";
export const SITE_NAME = "DJ Swarthy";
export const OG_IMAGE = "/images/og.jpg";

export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicGroup",
      "@id": `${SITE_URL}#artist`,
      name: "DJ Swarthy",
      alternateName: ["Swarthy", "Dj Swarthy"],
      url: SITE_URL,
      image: `${SITE_URL}${OG_IMAGE}`,
      description:
        "DJ con más de 19 años pinchando trance, progressive, tech house, house, nu disco y remember. Booking abierto en Madrid y toda España.",
      genre: ["Trance", "Progressive", "Tech House", "House", "Nu Disco", "Remember"],
      sameAs: site.socials.map((s) => s.url),
      address: {
        "@type": "PostalAddress",
        addressLocality: "Madrid",
        addressRegion: "Madrid",
        addressCountry: "ES",
      },
      areaServed: [
        { "@type": "City", name: "Madrid" },
        { "@type": "Country", name: "España" },
      ],
      email: "djswarthy@gmail.com",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "es-ES",
      publisher: { "@id": `${SITE_URL}#artist` },
    },
    {
      "@type": "Service",
      name: "Contratación DJ Swarthy",
      provider: { "@id": `${SITE_URL}#artist` },
      areaServed: { "@type": "Country", name: "España" },
      serviceType: "DJ Booking",
      description:
        "Servicio de DJ profesional para clubs, festivales, eventos privados y bodas en Madrid y resto de España.",
    },
    {
      "@type": "FAQPage",
      "@id": `${SITE_URL}#faq`,
      mainEntity: site.faq.map(({ q, a }) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: a },
      })),
    },
  ],
};

export const jsonLdString = JSON.stringify(jsonLd);

export const jsonLdScriptHash = `'sha256-${crypto
  .createHash("sha256")
  .update(jsonLdString)
  .digest("base64")}'`;
