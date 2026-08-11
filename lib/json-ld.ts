// JSON-LD estructurado usado por app/layout.tsx.

import { site } from "./data";
import { upcomingDates } from "./dates";

export const SITE_URL = "https://djswarthy.es";
export const SITE_NAME = "DJ Swarthy";
export const OG_IMAGE = "/images/og.jpg";

// Un nodo Event por fecha confirmada. Sin fechas no se emite ninguno: un
// MusicEvent vacío o caducado es peor que no declararlo.
const eventNodes = upcomingDates().map((gig) => ({
  "@type": "MusicEvent",
  name: `DJ Swarthy en ${gig.venue}`,
  startDate: gig.date,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  performer: { "@id": `${SITE_URL}#artist` },
  location: {
    "@type": "Place",
    name: gig.venue,
    address: {
      "@type": "PostalAddress",
      addressLocality: gig.city,
      addressCountry: gig.country,
    },
  },
  ...(gig.ticketsUrl && {
    offers: {
      "@type": "Offer",
      url: gig.ticketsUrl,
      availability:
        gig.status === "agotada"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock",
    },
  }),
}));

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
    ...eventNodes,
  ],
};

export const jsonLdString = JSON.stringify(jsonLd);
