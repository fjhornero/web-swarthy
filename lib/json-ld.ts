// JSON-LD estructurado usado por app/layout.tsx.
//
// Se construye en cada render (función, no constante de módulo): el nodo de
// eventos depende de la fecha de hoy y, calculado una sola vez al cargar el
// módulo, seguiría anunciando bolos ya pasados hasta el siguiente despliegue
// mientras la agenda visible (revalidada cada hora) ya los habría quitado.

import { site } from "./data";
import { upcomingDates } from "./dates";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "./site";

export { SITE_URL, SITE_NAME, OG_IMAGE } from "./site";

const ARTIST_ID = `${SITE_URL}/#artist`;

function eventNodes(now: Date) {
  // Un nodo Event por fecha confirmada. Sin fechas no se emite ninguno: un
  // MusicEvent vacío o caducado es peor que no declararlo.
  return upcomingDates(now).map((gig) => ({
    "@type": "MusicEvent",
    name: `DJ Swarthy en ${gig.venue}`,
    startDate: gig.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    performer: { "@id": ARTIST_ID },
    organizer: { "@id": ARTIST_ID },
    image: `${SITE_URL}${OG_IMAGE}`,
    location: {
      "@type": "MusicVenue",
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
}

export function buildJsonLd(now: Date = new Date()) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "MusicGroup",
        "@id": ARTIST_ID,
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
        email: site.bookingEmail,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "es-ES",
        publisher: { "@id": ARTIST_ID },
      },
      {
        "@type": "Service",
        "@id": `${SITE_URL}/#booking-service`,
        url: `${SITE_URL}/#booking`,
        name: "Contratación DJ Swarthy",
        provider: { "@id": ARTIST_ID },
        areaServed: { "@type": "Country", name: "España" },
        serviceType: "DJ Booking",
        description:
          "Servicio de DJ profesional para clubs, festivales, eventos privados y bodas en Madrid y resto de España.",
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: site.faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      ...eventNodes(now),
    ],
  };
}

/**
 * Serializa para un <script type="application/ld+json">. Se escapa `<` para
 * que ningún texto del contenido (FAQ, nombres de sala…) pueda cerrar la
 * etiqueta script aunque alguien escriba "</script>" en lib/data.ts.
 */
export function buildJsonLdString(now: Date = new Date()): string {
  return JSON.stringify(buildJsonLd(now)).replace(/</g, "\\u003c");
}
