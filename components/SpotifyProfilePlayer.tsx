"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { usePlayer } from "@/components/ActivePlayer";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import type { SpotifyArtistCard } from "@/lib/spotify";

/**
 * Tarjeta del perfil: foto a su resolución real (el oEmbed sólo da 320px, y
 * ampliarla a todo el ancho la dejaba borrosa) y un botón que monta el
 * reproductor. Mismo trato que MediaFacade —el iframe no existe hasta el
 * clic— pero con presentación horizontal en vez de portada gigante.
 */
export function SpotifyProfilePlayer({
  artist,
  artistId,
}: {
  artist: SpotifyArtistCard | null;
  /** Id de artista en Spotify. Por props y no desde lib/data.ts: importarlo
   *  aquí arrastraría todo el contenido del sitio al bundle de cliente. */
  artistId: string;
}) {
  const name = artist?.name ?? "DJ Swarthy";
  // Mismo grupo que las fachadas: si suena un set y se abre Spotify (o al
  // revés), el anterior se cierra en vez de sonar los dos a la vez.
  const { id, playing, play, playerRef } = usePlayer(`${name} en Spotify`);

  if (playing) {
    // El embed pinta su propio fondo redondeado: sin este colchón sus esquinas
    // chocan con el borde de la tarjeta.
    return (
      <div ref={playerRef} data-player={id} className="p-4 sm:p-5">
        <SpotifyEmbed
          src={`https://open.spotify.com/embed/artist/${artistId}?theme=0`}
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
          onClick={play}
          data-player={id}
          className="mt-5 inline-flex items-center gap-2 rounded-full border border-border-dark bg-dark-primary px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:bg-dark-secondary"
        >
          <Play size={16} className="fill-white text-white" aria-hidden="true" />
          Escuchar ahora
        </button>
      </div>
    </div>
  );
}
