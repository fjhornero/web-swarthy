"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Music, Youtube, Disc3, Facebook, Twitter, Music2, Twitch, AudioLines } from "lucide-react";
import { site } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Spotify: AudioLines,
  SoundCloud: Disc3,
  YouTube: Youtube,
  Facebook: Facebook,
  X: Twitter,
  TikTok: Music2,
  Twitch: Twitch,
};

export function Socials() {
  return (
    <section className="relative bg-dark-secondary py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-10">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ SÍGUEME
          </div>
          <h2 className="font-display text-3xl uppercase md:text-5xl">
            Comunidad <span className="text-gradient">SWARTHY</span>
          </h2>
        </div>

        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {site.socials.map((s, i) => {
            const Icon = iconMap[s.label] ?? Music;
            const isPending = s.url === "#";
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
              >
                <Link
                  href={s.url}
                  target={isPending ? undefined : "_blank"}
                  rel="noopener noreferrer"
                  className={`card-lift flex items-center gap-3 rounded-xl border border-border-dark bg-dark-primary px-4 py-3 transition-colors hover:border-accent-red/50 ${isPending ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <Icon size={20} className="text-accent-orange" />
                  <span className="text-sm font-medium">{s.label}</span>
                  <span className="ml-auto text-text-secondary">{isPending ? "…" : "↗"}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
