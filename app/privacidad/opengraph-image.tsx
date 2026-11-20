import OpenGraphImage from "../opengraph-image";

// La misma imagen social que la portada. Hace falta un fichero propio porque
// el `openGraph` de esta página sustituye entero al del layout y, con él, la
// imagen que el layout recibe de app/opengraph-image.tsx: sin esto, el enlace
// se compartía sin imagen.
export { alt, size, contentType } from "../opengraph-image";

// La configuración de segmento se declara aquí y no se reexporta: Next la lee
// de este fichero con análisis estático, no del módulo importado. Estática,
// como la de la raíz: se genera una vez en el build.
export const dynamic = "force-static";

export default OpenGraphImage;
