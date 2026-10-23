import Link from "next/link";
import { Youtube, Music, ExternalLink } from "lucide-react";
import { MediaFacade } from "@/components/MediaFacade";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { NewTabHint } from "@/components/NewTabHint";
import type { VideoItem, TrackItem } from "@/lib/feeds";
import { splitMixes, type MixEntry } from "@/lib/mixes";

interface MixesProps {
  videos: VideoItem[];
  tracks: TrackItem[];
}

// Cuántos elementos se listan en cada rejilla bajo los destacados.
const SECONDARY_LIMIT = 6;

// Las fechas llegan en formatos distintos (YouTube en ISO 8601, SoundCloud en
// RFC 2822), pero ambos los parsea Date. Se formatean en una zona horaria
// fija: el componente se renderiza en el servidor y la etiqueta no debe
// depender de dónde corra el contenedor. Cuando YouTube se raspa de la
// página del canal no hay fecha exacta, sólo la antigüedad relativa, así que
// las tarjetas caen a esa etiqueta en lugar de quedarse sin dato.
const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Europe/Madrid",
});

function formatDate(raw: string, fallbackLabel?: string): string {
  if (!raw) return fallbackLabel ?? "";
  const d = new Date(raw);
  return isNaN(d.getTime()) ? fallbackLabel ?? "" : dateFormatter.format(d);
}

export function Mixes({ videos, tracks }: MixesProps) {
  // Los destacados son siempre sets: el CTA del hero promete "último set" y
  // un promotor que llega aquí quiere oír cómo pincha, no una producción.
  const { featured, sets, productions } = splitMixes(videos, tracks);

  return (
    <section id="mixes" className="relative bg-dark-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          overline="ÚLTIMAS SESIONES"
          title={
            <>
              Escucha y <span className="text-gradient">mira en directo</span>
            </>
          }
        />

        {featured.length > 0 ? (
          <div className={`grid gap-8 ${featured.length > 1 ? "md:grid-cols-2" : ""}`}>
            {featured.map((entry, i) => (
              <FeaturedCard key={entry.kind + entry.item.id} entry={entry} delay={i * 0.1} />
            ))}
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            <PlatformCard icon={YOUTUBE_ICON} label="YouTube" delay={0}>
              <FallbackCard
                href="https://www.youtube.com/@swarthy_dj"
                label="Ver canal de YouTube"
              />
            </PlatformCard>
            <PlatformCard icon={SOUNDCLOUD_ICON} label="SoundCloud" delay={0.1}>
              <FallbackCard
                href="https://soundcloud.com/dj_swarthy"
                label="Ver perfil de SoundCloud"
              />
            </PlatformCard>
          </div>
        )}

        <MixGrid heading="Más sesiones" entries={sets} />
        <MixGrid heading="Producciones y versiones" entries={productions} />
      </div>
    </section>
  );
}

const YOUTUBE_ICON = <Youtube size={18} className="text-accent-orange" aria-hidden="true" />;
const SOUNDCLOUD_ICON = <Music size={18} className="text-accent-orange" aria-hidden="true" />;

function FeaturedCard({ entry, delay }: { entry: MixEntry; delay: number }) {
  if (entry.kind === "video") {
    const video = entry.item;
    return (
      <PlatformCard icon={YOUTUBE_ICON} label="YouTube" delay={delay}>
        <YouTubeFacade video={video} />
        <MediaMeta
          title={video.title}
          date={video.publishedAt}
          dateLabel={video.publishedLabel}
          href={video.url}
          linkLabel="Ver en YouTube"
        />
      </PlatformCard>
    );
  }
  const track = entry.item;
  return (
    <PlatformCard icon={SOUNDCLOUD_ICON} label="SoundCloud" delay={delay}>
      <SoundCloudFacade track={track} />
      <MediaMeta
        title={track.title}
        date={track.publishedAt}
        href={track.url}
        linkLabel="Escuchar en SoundCloud"
      />
    </PlatformCard>
  );
}

function MixGrid({ heading, entries }: { heading: string; entries: MixEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div className="mt-14">
      <h3 className="mb-6 text-xs uppercase tracking-[0.2em] text-text-secondary">
        {heading}
      </h3>
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {entries.slice(0, SECONDARY_LIMIT).map((entry, i) => (
          <Reveal
            as="li"
            key={entry.kind + entry.item.id}
            y={20}
            delay={(i % 3) * 0.07}
            className="overflow-hidden rounded-2xl border border-border-dark bg-dark-primary"
          >
            {entry.kind === "video" ? (
              <YouTubeFacade video={entry.item} compact />
            ) : (
              <SoundCloudFacade track={entry.item} compact />
            )}
            <div className="p-4">
              <p className="line-clamp-2 text-sm font-medium leading-snug">
                {entry.item.title}
              </p>
              <span className="mt-2 block text-xs text-text-secondary">
                {formatDate(
                  entry.item.publishedAt,
                  entry.kind === "video" ? entry.item.publishedLabel : undefined
                )}
              </span>
            </div>
          </Reveal>
        ))}
      </ul>
    </div>
  );
}

function PlatformCard({
  icon,
  label,
  delay,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  delay: number;
  children: React.ReactNode;
}) {
  return (
    <Reveal
      y={30}
      duration={0.6}
      delay={delay}
      className="overflow-hidden rounded-2xl border border-border-dark bg-dark-primary"
    >
      <div className="flex items-center gap-2 border-b border-border-dark px-5 py-4">
        {icon}
        <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">
          {label}
        </span>
      </div>
      {children}
    </Reveal>
  );
}

function MediaMeta({
  title,
  date,
  dateLabel,
  href,
  linkLabel,
}: {
  title: string;
  date: string;
  dateLabel?: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="p-5">
      <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{title}</h3>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-text-secondary">
          {formatDate(date, dateLabel)}
        </span>
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-accent-orange hover:underline"
        >
          {linkLabel} <ExternalLink size={11} aria-hidden="true" />
          <NewTabHint />
        </Link>
      </div>
    </div>
  );
}

function YouTubeFacade({ video, compact }: { video: VideoItem; compact?: boolean }) {
  return (
    <MediaFacade thumbnail={video.thumbnail} title={video.title} compact={compact}>
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.id}?rel=0&autoplay=1`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className="absolute inset-0 h-full w-full"
        />
      </div>
    </MediaFacade>
  );
}

function SoundCloudFacade({ track, compact }: { track: TrackItem; compact?: boolean }) {
  return (
    <MediaFacade thumbnail={track.artwork} title={track.title} compact={compact}>
      <iframe
        scrolling="no"
        allow="autoplay"
        src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${track.id}&color=%23e11d48&auto_play=true&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`}
        className="w-full"
        style={{ height: compact ? 180 : 300 }}
        title={track.title}
      />
    </MediaFacade>
  );
}

function FallbackCard({ href, label }: { href: string; label: string }) {
  return (
    <div className="flex items-center justify-center p-12">
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-accent-orange hover:underline"
      >
        {label} <ExternalLink size={14} aria-hidden="true" />
        <NewTabHint />
      </Link>
    </div>
  );
}
