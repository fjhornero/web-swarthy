"use client";

import Image from "next/image";
import { useState } from "react";
import { Play } from "lucide-react";

/**
 * Portada clicable que sólo monta el reproductor tras el clic. Evita cargar
 * los iframes de YouTube/SoundCloud/Spotify —y sus cookies de terceros— en
 * visitas donde nadie le da al play.
 */
export function MediaFacade({
  thumbnail,
  title,
  compact,
  ratio = "video",
  sizes,
  children,
}: {
  thumbnail?: string;
  title: string;
  compact?: boolean;
  /** Proporción de la portada: 16:9 para vídeo, 1:1 para carátulas */
  ratio?: "video" | "square";
  sizes?: string;
  children: React.ReactNode;
}) {
  const [playing, setPlaying] = useState(false);

  if (playing) return <>{children}</>;

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      aria-label={`Reproducir ${title}`}
      className={`group relative block w-full overflow-hidden ${
        ratio === "square" ? "aspect-square" : "aspect-video"
      }`}
    >
      {thumbnail ? (
        <Image
          src={thumbnail}
          alt=""
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes={
            sizes ??
            (compact
              ? "(max-width: 640px) 100vw, 33vw"
              : "(max-width: 768px) 100vw, 50vw")
          }
        />
      ) : (
        <div className="absolute inset-0 bg-dark-secondary" />
      )}
      <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/15" />
      <span
        className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full gradient-primary shadow-glow-strong transition-transform group-hover:scale-110 ${
          compact ? "h-12 w-12" : "h-16 w-16"
        }`}
      >
        <Play size={compact ? 18 : 24} className="ml-0.5 fill-white text-white" />
      </span>
    </button>
  );
}
