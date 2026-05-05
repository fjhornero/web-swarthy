import type { MetadataRoute } from "next";

const SITE_URL = "https://djswarthy.es";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date("2025-04-01"),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
