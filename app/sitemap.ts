import type { MetadataRoute } from "next";

const SITE_URL = "https://djswarthy.es";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

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
    {
      url: `${SITE_URL}/privacidad`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];
}
