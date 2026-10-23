import type { MetadataRoute } from "next";
import { SITE_URL, CONTENT_UPDATED_AT } from "@/lib/site";

// /privacidad no va en el sitemap: es una página legal con `noindex` y no
// aporta nada a la indexación. Sigue enlazada desde el footer y los formularios.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date(CONTENT_UPDATED_AT);

  return [
    {
      url: SITE_URL,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/press-kit`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
