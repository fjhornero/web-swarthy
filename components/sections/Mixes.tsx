import Link from "next/link";
import { Youtube, Music, ExternalLink } from "lucide-react";
import { MixLibrary } from "@/components/MixLibrary";
import { MixMeta, MixPlayer } from "@/components/MixCard";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { NewTabHint } from "@/components/NewTabHint";
import type { MixCardData } from "@/lib/mixes";

interface MixesProps {
  /** Hasta dos sesiones destacadas: la más reciente de cada plataforma */
  featured: MixCardData[];
  /** El resto de sesiones, para la rejilla filtrable por estilo */
  sets: MixCardData[];
}

const CHANNELS = [
  { label: "YouTube", href: "https://www.youtube.com/@swarthy_dj", cta: "Ver canal de YouTube", icon: Youtube },
  { label: "SoundCloud", href: "https://soundcloud.com/dj_swarthy", cta: "Ver perfil de SoundCloud", icon: Music },
];

// Aquí sólo hay sesiones: un promotor que llega quiere oír cómo pincha, no una
// producción. Las producciones y versiones viven en la sección de lanzamientos.
export function Mixes({ featured, sets }: MixesProps) {
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
        >
          <p className="mx-auto mt-4 max-w-xl text-text-secondary">
            Sesiones completas, para oír cómo construye una noche antes de
            contratarla. Filtra por estilo y dale al play.
          </p>
        </SectionHeading>

        {featured.length > 0 ? (
          <div
            className={`grid gap-5 md:gap-8 ${
              featured.length > 1 ? "md:grid-cols-2" : "mx-auto max-w-3xl"
            }`}
          >
            {featured.map((mix, i) => (
              <FeaturedCard key={mix.key} mix={mix} delay={i * 0.1} />
            ))}
          </div>
        ) : (
          // Sin feeds (YouTube y SoundCloud caídos a la vez) quedan los enlaces.
          <div className="grid gap-5 md:grid-cols-2 md:gap-8">
            {CHANNELS.map(({ label, href, cta, icon: Icon }, i) => (
              <Reveal
                key={label}
                y={30}
                duration={0.6}
                delay={i * 0.1}
                className="overflow-hidden rounded-2xl border border-border-dark bg-dark-primary"
              >
                <div className="flex items-center gap-2 border-b border-border-dark px-5 py-4">
                  <Icon size={18} className="text-accent-orange" aria-hidden="true" />
                  <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                    {label}
                  </span>
                </div>
                <div className="flex items-center justify-center p-12">
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-accent-orange hover:underline"
                  >
                    {cta} <ExternalLink size={14} aria-hidden="true" />
                    <NewTabHint />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        {sets.length > 0 && <MixLibrary mixes={sets} />}

        {featured.length > 0 && (
          <ul className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {CHANNELS.map(({ label, href, icon: Icon }) => (
              <li key={label}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center gap-2 text-sm text-accent-orange hover:underline"
                >
                  <Icon size={16} aria-hidden="true" />
                  Todo en {label} <ExternalLink size={13} aria-hidden="true" />
                  <NewTabHint />
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

function FeaturedCard({ mix, delay }: { mix: MixCardData; delay: number }) {
  const video = mix.kind === "video";
  return (
    <Reveal
      y={30}
      duration={0.6}
      delay={delay}
      className="overflow-hidden rounded-2xl border border-border-dark bg-dark-primary"
    >
      <MixPlayer mix={mix} />
      <div className="p-5">
        <p className="mb-2 text-xs uppercase tracking-[0.2em] text-accent-orange">
          {video ? "Vídeo · YouTube" : "Audio · SoundCloud"}
        </p>
        {/* font-sans: los títulos vienen de la plataforma, largos y con
            símbolos, y en la tipografía de titulares a este tamaño no se leen. */}
        <h3 className="line-clamp-2 font-sans text-base font-semibold leading-snug md:text-lg">
          {mix.title}
        </h3>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <MixMeta mix={mix} />
          <Link
            href={mix.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-accent-orange hover:underline"
          >
            {video ? "Ver en YouTube" : "Escuchar en SoundCloud"}{" "}
            <ExternalLink size={11} aria-hidden="true" />
            <NewTabHint />
          </Link>
        </div>
      </div>
    </Reveal>
  );
}
