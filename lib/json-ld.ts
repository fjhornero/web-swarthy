// JSON-LD estructurado, repartido por página: cada ruta declara sólo lo que
// enseña, que es lo que piden los buscadores.
//
//   baseNodes()      → app/layout.tsx: el artista y el sitio, en todas las rutas.
//   homeNodes()      → app/page.tsx: el servicio de booking, la FAQ y las fechas.
//   pressKitNodes()  → app/press-kit/page.tsx: las migas de pan.
//
// Antes el layout emitía el grafo entero y /press-kit y /privacidad declaraban
// una FAQ y un servicio que no muestran. El layout no puede elegir por ruta:
// para saber cuál se está pintando tendría que leer `headers()`, y eso
// volvería dinámica la home estática. Por eso cada página emite lo suyo en su
// propio <script>.
//
// Todo son funciones, no constantes de módulo: el grafo se construye en cada
// render. Los eventos dependen de la fecha de hoy y, calculados una sola vez al
// cargar el módulo, seguirían anunciando bolos ya pasados hasta el siguiente
// despliegue mientras la agenda visible (revalidada cada hora) ya los habría
// quitado.

import { site } from "./data";
import { upcomingDates } from "./dates";
import { SITE_URL, SITE_NAME, OG_IMAGE } from "./site";

export { SITE_URL, SITE_NAME, OG_IMAGE } from "./site";

/** Un nodo del grafo: un objeto de schema.org con su `@type`. */
export type JsonLdNode = Record<string, unknown>;

// Los nodos de cada página apuntan al artista por `@id` en vez de repetirlo.
// La referencia se resuelve aunque el artista viaje en otro <script>: quien
// lee el marcado une por `@id` todos los bloques JSON-LD de la página.
const ARTIST_ID = `${SITE_URL}/#artist`;

type ImageFile = { path: string; width: number; height: number };

// Medidas reales de los ficheros de public/. tests/json-ld.test.ts las compara
// con la cabecera de cada fichero: si se sustituye alguno (sigue pendiente un
// retrato en alta), el test avisa de que hay que actualizarlas aquí.
const LOGO: ImageFile = { path: "/logo-isotype-black.png", width: 1024, height: 1024 };
const PORTRAIT: ImageFile = { path: OG_IMAGE, width: 864, height: 1110 };

function imageObject({ path, width, height }: ImageFile) {
  return { "@type": "ImageObject", url: `${SITE_URL}${path}`, width, height };
}

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

/**
 * La entidad: quién es el artista y de quién es el sitio. Es lo único cierto
 * en todas las rutas, y por eso es lo único que emite el layout.
 */
export function baseNodes(): JsonLdNode[] {
  return [
    {
      "@type": "MusicGroup",
      "@id": ARTIST_ID,
      name: "DJ Swarthy",
      // Las otras formas en que se le busca, sin repetir `name`: una variante
      // que sólo cambia las mayúsculas no añade nada.
      alternateName: ["Swarthy", "DJSwarthy", "Swarthy DJ"],
      url: SITE_URL,
      // El isotipo negro con transparencia: un logo se enseña sobre blanco.
      logo: imageObject(LOGO),
      image: imageObject(PORTRAIT),
      // La bio corta del press kit, no otro texto que mantener a mano. Sin
      // `foundingDate`: el año de inicio no está en lib/data.ts.
      description: site.press.bioShort,
      genre: site.genres,
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
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "booking",
        email: site.bookingEmail,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      // Los otros nombres del sitio, el dominio entre ellos.
      alternateName: ["DJSwarthy", "djswarthy.es"],
      inLanguage: "es-ES",
      publisher: { "@id": ARTIST_ID },
    },
  ];
}

/**
 * Lo que sólo enseña la portada: el servicio de contratación, la FAQ y las
 * próximas fechas. Lo emite app/page.tsx.
 */
export function homeNodes(now: Date = new Date()): JsonLdNode[] {
  return [
    {
      "@type": "Service",
      "@id": `${SITE_URL}/#booking-service`,
      // La página que describe el servicio, sin `#booking`: un fragmento no
      // es otra dirección.
      url: SITE_URL,
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
  ];
}

/** Las migas de pan de /press-kit (Inicio → Press kit). Las emite su página. */
export function pressKitNodes(): JsonLdNode[] {
  const url = `${SITE_URL}/press-kit`;
  return [
    {
      "@type": "BreadcrumbList",
      "@id": `${url}#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Press kit", item: url },
      ],
    },
  ];
}

/** Envuelve los nodos de una pieza en su documento JSON-LD. */
export function buildJsonLd(nodes: JsonLdNode[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}

/**
 * Serializa para un <script type="application/ld+json">. Se escapa `<` para
 * que ningún texto del contenido (FAQ, bio, nombres de sala…) pueda cerrar la
 * etiqueta script aunque alguien escriba "</script>" en lib/data.ts.
 */
export function buildJsonLdString(nodes: JsonLdNode[]): string {
  return JSON.stringify(buildJsonLd(nodes)).replace(/</g, "\\u003c");
}
