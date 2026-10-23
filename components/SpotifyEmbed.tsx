/** Iframe del reproductor de Spotify (álbum o perfil de artista). */
export function SpotifyEmbed({
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
