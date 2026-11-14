"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { usePlayer } from "@/components/ActivePlayer";

/**
 * Portada clicable que sólo monta el reproductor tras el clic. Evita cargar
 * los iframes de YouTube/SoundCloud/Spotify —y sus cookies de terceros— en
 * visitas donde nadie le da al play.
 */
export function MediaFacade({
  thumbnail,
  title,
  compact,
  mini,
  ratio = "video",
  sizes,
  children,
}: {
  thumbnail?: string;
  title: string;
  compact?: boolean;
  /** Botón de play más pequeño en móvil, para miniaturas de fila compacta */
  mini?: boolean;
  /** Proporción de la portada: 16:9 para vídeo, 1:1 para carátulas */
  ratio?: "video" | "square";
  sizes?: string;
  children: React.ReactNode;
}) {
  const { id, playing, play, playerRef } = usePlayer(title);

  if (playing) {
    return (
      <div ref={playerRef} data-player={id}>
        {children}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={play}
      data-player={id}
      aria-label={`Reproducir ${title}`}
      className={`group relative block w-full overflow-hidden focus-visible:outline-offset-[-3px] ${
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
        className={`absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/40 backdrop-blur-sm transition-[transform,background-color] group-hover:scale-110 group-hover:bg-accent-red ${
          mini ? "h-9 w-9 sm:h-12 sm:w-12" : compact ? "h-12 w-12" : "h-16 w-16"
        }`}
      >
        <Play
          className={`ml-0.5 fill-white text-white ${
            mini ? "h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" : compact ? "h-[18px] w-[18px]" : "h-6 w-6"
          }`}
          aria-hidden="true"
        />
      </span>
    </button>
  );
}
