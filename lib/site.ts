// Constantes de identidad del sitio. Viven aparte de lib/json-ld.ts para que
// robots.ts, sitemap.ts y las páginas secundarias no arrastren el grafo
// JSON-LD (y con él lib/data.ts y lib/dates.ts) sólo por leer la URL base.

export const SITE_URL = "https://djswarthy.es";
export const SITE_NAME = "DJ Swarthy";
/** Retrato vertical: lo usa el JSON-LD y el press kit. La imagen social
 *  1200x630 se genera aparte en app/opengraph-image.tsx. */
export const OG_IMAGE = "/images/og.jpg";

/** Fecha de la última revisión del contenido estático (copy, FAQ, legal).
 *  Actualizar a mano cuando cambie el contenido: alimenta `lastModified` del
 *  sitemap, que sería mentira si fuese `new Date()` en cada petición. */
export const CONTENT_UPDATED_AT = "2026-10-23";
