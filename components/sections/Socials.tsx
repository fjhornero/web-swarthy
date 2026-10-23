import Link from "next/link";
import { Music, Youtube, Disc3, Facebook, Twitter, Music2, Twitch, AudioLines } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { NewTabHint } from "@/components/NewTabHint";
import { site } from "@/lib/data";

const iconMap: Record<string, React.ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>> = {
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
    <section className="relative bg-dark-secondary py-16 md:py-20" aria-labelledby="socials-title">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-10">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            <span aria-hidden="true">★ </span>SÍGUEME
          </p>
          <h2 id="socials-title" className="font-display text-3xl uppercase md:text-5xl">
            Comunidad <span className="text-gradient">SWARTHY</span>
          </h2>
        </div>

        <ul className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {site.socials.map((s, i) => {
            const Icon = iconMap[s.label] ?? Music;
            return (
              <Reveal as="li" key={s.label} delay={i * 0.05} margin="0px">
                <Link
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-lift flex items-center gap-3 rounded-xl border border-border-dark bg-dark-primary px-4 py-3 transition-colors hover:border-accent-red/50"
                >
                  <Icon size={20} className="text-accent-orange" aria-hidden />
                  <span className="text-sm font-medium">{s.label}</span>
                  <NewTabHint />
                  <span className="ml-auto text-text-secondary" aria-hidden="true">↗</span>
                </Link>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
