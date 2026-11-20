import type { MetadataRoute } from "next";
import { site } from "@/lib/data";
import { SITE_NAME, sentenceList } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Swarthy",
    // Los estilos salen de la lista única de lib/data.ts, no escritos a mano.
    description: `DJ Swarthy, DJ profesional en Madrid. ${sentenceList(site.genres)}.`,
    lang: "es",
    start_url: "/",
    display: "browser",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
