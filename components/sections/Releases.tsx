import Link from "next/link";
import { AudioLines, ExternalLink } from "lucide-react";
import { MediaFacade } from "@/components/MediaFacade";
import { SpotifyEmbed } from "@/components/SpotifyEmbed";
import { SpotifyProfilePlayer } from "@/components/SpotifyProfilePlayer";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { NewTabHint } from "@/components/NewTabHint";
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
        <SectionHeading
          overline="EN SPOTIFY"
          title={
            <>
              Sus <span className="text-gradient">lanzamientos</span>
            </>
          }
        >
          <p className="mx-auto mt-4 max-w-xl text-sm text-text-secondary">
            Producciones y ediciones propias, disponibles al completo en
            Spotify.
          </p>
        </SectionHeading>

        {hasReleases ? (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {releases.map((release, i) => (
              <Reveal
                as="li"
                key={release.id}
                y={24}
                delay={(i % 3) * 0.07}
                className="overflow-hidden rounded-2xl border border-border-dark bg-dark-secondary"
              >
                <article>
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
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
                      {release.name}
                    </h3>
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
                        Abrir<span className="sr-only"> {release.name} en Spotify</span>
                        <ExternalLink size={11} aria-hidden="true" />
                        <NewTabHint />
                      </Link>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </ul>
        ) : (
          <Reveal
            y={24}
            duration={0.6}
            className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border-dark bg-dark-secondary"
          >
            <div className="flex items-center gap-2 border-b border-border-dark px-5 py-4">
              <AudioLines size={18} className="text-accent-orange" aria-hidden="true" />
              <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                Reproductor oficial
              </span>
            </div>
            <SpotifyProfilePlayer artist={artist} />
          </Reveal>
        )}

        <div className="mt-10 text-center">
          <Link
            href={ARTIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-accent-orange hover:underline"
          >
            Ver perfil completo en Spotify <ExternalLink size={14} aria-hidden="true" />
            <NewTabHint />
          </Link>
        </div>
      </div>
    </section>
  );
}
