"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { AudioLines, ExternalLink, Play } from "lucide-react";
import { MediaFacade } from "@/components/MediaFacade";
import { site } from "@/lib/data";
import type { SpotifyArtistCard, SpotifyRelease } from "@/lib/spotify";

interface ReleasesProps {
  releases: SpotifyRelease[];
  artist: SpotifyArtistCard | null;
}

const ARTIST_URL = `https://open.spotify.com/artist/${site.spotifyArtistId}`;

// album_group de la API → etiqueta visible
const typeLabels: Record<string, string> = {
  album: "Álbum",
  single: "Single",
  compilation: "Recopilatorio",
  appears_on: "Colaboración",
};

export function Releases({ releases, artist }: ReleasesProps) {
  const hasReleases = releases.length > 0;

  return (
    <section id="spotify" className="relative bg-dark-primary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-14 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ EN SPOTIFY
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Sus <span className="text-gradient">lanzamientos</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-text-secondary">
            Producciones y ediciones propias, disponibles al completo en
            Spotify.
          </p>
        </div>

        {hasReleases ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {releases.map((release, i) => (
              <motion.article
                key={release.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
                className="overflow-hidden rounded-2xl border border-border-dark bg-dark-secondary"
              >
                <MediaFacade
                  thumbnail={release.artwork}
                  title={release.name}
                  ratio="square"
                  compact
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                >
                  <SpotifyEmbed
                    src={`https://open.spotify.com/embed/album/${release.id}?theme=0`}
                    title={release.name}
                    height={352}
                  />
                </MediaFacade>

                <div className="p-5">
                  <p className="line-clamp-2 text-sm font-semibold leading-snug">
                    {release.name}
                  </p>
                  <div className="mt-3 flex items-center justify-between text-xs text-text-secondary">
                    <span>
                      {typeLabels[release.type] ?? "Lanzamiento"}
                      {release.releaseDate && ` · ${release.releaseDate.slice(0, 4)}`}
                      {release.totalTracks > 1 && ` · ${release.totalTracks} temas`}
                    </span>
                    <Link
                      href={release.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-accent-orange hover:underline"
                    >
                      Abrir <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border-dark bg-dark-secondary"
          >
            <div className="flex items-center gap-2 border-b border-border-dark px-5 py-4">
              <AudioLines size={18} className="text-accent-orange" />
              <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                Reproductor oficial
              </span>
            </div>
            <ProfilePlayer artist={artist} />
          </motion.div>
        )}

        <div className="mt-10 text-center">
          <Link
            href={ARTIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent-orange hover:underline"
          >
            Ver perfil completo en Spotify <ExternalLink size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}

/**
 * Tarjeta del perfil: foto a su resolución real (el oEmbed sólo da 320px, y
 * ampliarla a todo el ancho la dejaba borrosa) y un botón que monta el
 * reproductor. Mismo trato que MediaFacade —el iframe no existe hasta el
 * clic— pero con presentación horizontal en vez de portada gigante.
 */
function ProfilePlayer({ artist }: { artist: SpotifyArtistCard | null }) {
  const [playing, setPlaying] = useState(false);
  const name = artist?.name ?? "DJ Swarthy";

  if (playing) {
    // El embed pinta su propio fondo redondeado: sin este colchón sus esquinas
    // chocan con el borde de la tarjeta.
    return (
      <div className="p-4 sm:p-5">
        <SpotifyEmbed
          src={`https://open.spotify.com/embed/artist/${site.spotifyArtistId}?theme=0`}
          title={`${name} en Spotify`}
          height={420}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-6 p-6 sm:flex-row sm:gap-8 sm:p-8">
      {artist?.image && (
        <Image
          src={artist.image}
          alt=""
          width={160}
          height={160}
          className="h-40 w-40 shrink-0 rounded-xl object-cover"
        />
      )}
      <div className="text-center sm:text-left">
        <h3 className="font-display text-3xl uppercase md:text-4xl">{name}</h3>
        <p className="mt-2 text-sm text-text-secondary">
          Sus temas publicados, en el reproductor oficial de Spotify.
        </p>
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="mt-5 inline-flex items-center gap-2 rounded-full gradient-primary px-6 py-3 text-sm font-semibold shadow-glow transition-transform hover:scale-105"
        >
          <Play size={16} className="fill-white text-white" />
          Escuchar ahora
        </button>
      </div>
    </div>
  );
}

function SpotifyEmbed({
  src,
  title,
  height,
}: {
  src: string;
  title: string;
  height: number;
}) {
  return (
    <iframe
      src={src}
      title={title}
      loading="lazy"
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      className="w-full border-0"
      style={{ height }}
    />
  );
}
