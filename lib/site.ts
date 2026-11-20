// Constantes de identidad del sitio. Viven aparte de lib/json-ld.ts para que
// robots.ts, sitemap.ts y las páginas secundarias no arrastren el grafo
// JSON-LD (y con él lib/data.ts y lib/dates.ts) sólo por leer la URL base.

export const SITE_URL = "https://djswarthy.es";
export const SITE_NAME = "DJ Swarthy";
/** Retrato vertical: lo usa el JSON-LD y el press kit. La imagen social
 *  1200x630 se genera aparte en app/opengraph-image.tsx. */
export const OG_IMAGE = "/images/og.jpg";

/** Campos de `openGraph` que no cambian de una ruta a otra. Next no mezcla
 *  `openGraph` en profundidad: el de una página sustituye entero al del
 *  layout, así que la ruta que declare el suyo tiene que partir de aquí o se
 *  queda sin og:site_name ni og:locale. */
export const OPEN_GRAPH_BASE = {
  type: "website",
  siteName: SITE_NAME,
  locale: "es_ES",
} as const;

/** Lo mismo para `twitter`: la página que declara su título y su descripción
 *  perdería el formato de tarjeta y la cuenta del artista. */
export const TWITTER_BASE = {
  card: "summary_large_image",
  creator: "@DjSwarthy",
} as const;

/** Tokens de verificación de propiedad: el `content` de la etiqueta meta que
 *  dan Google Search Console y Bing Webmaster Tools. Son públicos (van en el
 *  HTML de todas las páginas). Vacío = el layout no emite esa etiqueta. */
export const GOOGLE_SITE_VERIFICATION: string = "";
export const BING_SITE_VERIFICATION: string = "";

/** Enumera una lista dentro de una frase: «Trance, progressive, tech house y
 *  remember» (el primero tal cual, el resto en minúsculas). El pie y el
 *  manifest le pasan `site.genres` en vez de repetir los estilos a mano, que
 *  es como se quedaron sin «progressive». Recibe la lista por parámetro para
 *  que este fichero siga sin importar lib/data.ts. */
export function sentenceList(items: readonly string[]): string {
  return new Intl.ListFormat("es", { type: "conjunction" }).format(
    items.map((item, i) => (i === 0 ? item : item.toLowerCase()))
  );
}

/** Fecha de la última revisión del contenido estático (copy, FAQ, legal).
 *  Actualizar a mano cuando cambie el contenido: alimenta `lastModified` del
 *  sitemap, que sería mentira si fuese `new Date()` en cada petición. */
export const CONTENT_UPDATED_AT = "2026-11-20";
