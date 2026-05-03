"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Youtube, Music, ExternalLink } from "lucide-react";
import type { VideoItem, TrackItem } from "@/lib/feeds";

interface MixesProps {
  latestVideo?: VideoItem;
  latestTrack?: TrackItem;
}

export function Mixes({ latestVideo, latestTrack }: MixesProps) {
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
          {/* YouTube */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-border-dark bg-dark-primary overflow-hidden"
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border-dark">
              <Youtube size={18} className="text-accent-orange" />
              <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">YouTube</span>
            </div>

            {latestVideo ? (
              <>
                <div className="relative aspect-video w-full">
                  <iframe
                    src={`https://www.youtube.com/embed/${latestVideo.id}?rel=0`}
                    title={latestVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
                <div className="p-5">
                  <p className="font-semibold text-sm leading-snug line-clamp-2">
                    {latestVideo.title}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-text-secondary">
                      {latestVideo.publishedAt.slice(0, 10)}
                    </span>
                    <Link
                      href={latestVideo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-accent-orange hover:underline"
                    >
                      Ver en YouTube <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <FallbackCard
                href="https://www.youtube.com/@dj-swarthy"
                label="Ver canal de YouTube"
              />
            )}
          </motion.div>

          {/* SoundCloud */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-border-dark bg-dark-primary overflow-hidden"
          >
            <div className="flex items-center gap-2 px-5 py-4 border-b border-border-dark">
              <Music size={18} className="text-accent-orange" />
              <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">SoundCloud</span>
            </div>

            {latestTrack?.id ? (
              <>
                <div className="w-full">
                  <iframe
                    scrolling="no"
                    frameBorder="no"
                    allow="autoplay"
                    src={`https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${latestTrack.id}&color=%23e11d48&auto_play=false&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=false&visual=true`}
                    className="w-full"
                    style={{ height: 300 }}
                    title={latestTrack.title}
                  />
                </div>
                <div className="p-5">
                  <p className="font-semibold text-sm leading-snug line-clamp-2">
                    {latestTrack.title}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs text-text-secondary">
                      {latestTrack.publishedAt.slice(0, 16)}
                    </span>
                    <Link
                      href={latestTrack.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-accent-orange hover:underline"
                    >
                      Escuchar en SoundCloud <ExternalLink size={11} />
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <FallbackCard
                href="https://soundcloud.com/dj_swarthy"
                label="Ver perfil de SoundCloud"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
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
