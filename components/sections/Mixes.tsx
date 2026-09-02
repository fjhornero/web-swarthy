"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Youtube, Music, ExternalLink } from "lucide-react";
import { MediaFacade } from "@/components/MediaFacade";
import type { VideoItem, TrackItem } from "@/lib/feeds";

interface MixesProps {
  videos: VideoItem[];
  tracks: TrackItem[];
}

// Cuántos elementos extra se listan bajo los dos destacados.
const SECONDARY_LIMIT = 6;

// Las fechas llegan en formatos distintos (YouTube en ISO 8601, SoundCloud en
// RFC 2822), pero ambos los parsea Date. Las normalizamos a español para que
// las dos tarjetas muestren el mismo estilo.
const dateFormatter = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

function formatDate(raw: string): string {
  if (!raw) return "";
  const d = new Date(raw);
  return isNaN(d.getTime()) ? "" : dateFormatter.format(d);
}

export function Mixes({ videos, tracks }: MixesProps) {
  const [featuredVideo, ...restVideos] = videos.filter((v) => !v.isShort);
  const [featuredTrack, ...restTracks] = tracks.filter((t) => t.id);

  // Intercalamos vídeo/track para que la rejilla secundaria no quede agrupada
  // por plataforma cuando una de las dos tiene mucho más material.
  const secondary: Array<
    { kind: "video"; item: VideoItem } | { kind: "track"; item: TrackItem }
  > = [];
  for (let i = 0; i < Math.max(restVideos.length, restTracks.length); i++) {
    if (restVideos[i]) secondary.push({ kind: "video", item: restVideos[i] });
    if (restTracks[i]) secondary.push({ kind: "track", item: restTracks[i] });
  }

  return (
    <section id="mixes" className="relative bg-dark-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ ÚLTIMAS SESIONES
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Escucha y <span className="text-gradient">mira en directo</span>
          </h2>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <PlatformCard
            icon={<Youtube size={18} className="text-accent-orange" />}
            label="YouTube"
            delay={0}
          >
            {featuredVideo ? (
              <>
                <YouTubeFacade video={featuredVideo} />
                <MediaMeta
                  title={featuredVideo.title}
                  date={featuredVideo.publishedAt}
                  href={featuredVideo.url}
                  linkLabel="Ver en YouTube"
                />
              </>
            ) : (
              <FallbackCard
                href="https://www.youtube.com/@swarthy_dj"
                label="Ver canal de YouTube"
              />
            )}
          </PlatformCard>

          <PlatformCard
            icon={<Music size={18} className="text-accent-orange" />}
            label="SoundCloud"
            delay={0.1}
          >
            {featuredTrack ? (
              <>
                <SoundCloudFacade track={featuredTrack} />
                <MediaMeta
                  title={featuredTrack.title}
                  date={featuredTrack.publishedAt}
                  href={featuredTrack.url}
                  linkLabel="Escuchar en SoundCloud"
                />
              </>
            ) : (
              <FallbackCard
                href="https://soundcloud.com/dj_swarthy"
                label="Ver perfil de SoundCloud"
              />
            )}
          </PlatformCard>
        </div>

        {secondary.length > 0 && (
          <div className="mt-14">
            <h3 className="mb-6 text-xs uppercase tracking-[0.2em] text-text-secondary">
              Más sesiones
            </h3>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {secondary.slice(0, SECONDARY_LIMIT).map((entry, i) => (
                <motion.div
                  key={entry.kind + entry.item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: (i % 3) * 0.07 }}
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
                      {formatDate(entry.item.publishedAt)}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay }}
      className="overflow-hidden rounded-2xl border border-border-dark bg-dark-primary"
    >
      <div className="flex items-center gap-2 border-b border-border-dark px-5 py-4">
        {icon}
        <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">
          {label}
        </span>
      </div>
      {children}
    </motion.div>
  );
}

function MediaMeta({
  title,
  date,
  href,
  linkLabel,
}: {
  title: string;
  date: string;
  href: string;
  linkLabel: string;
}) {
  return (
    <div className="p-5">
      <p className="line-clamp-2 text-sm font-semibold leading-snug">{title}</p>
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-text-secondary">{formatDate(date)}</span>
        <Link
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-accent-orange hover:underline"
        >
          {linkLabel} <ExternalLink size={11} />
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
        {label} <ExternalLink size={14} />
      </Link>
    </div>
  );
}
