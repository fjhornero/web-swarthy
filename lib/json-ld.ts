// JSON-LD estructurado usado por app/layout.tsx.

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
