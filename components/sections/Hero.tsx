import Link from "next/link";
import { CalendarCheck, Play } from "lucide-react";
import { site } from "@/lib/data";

const GENRES = ["Trance", "Progressive", "Tech House", "House", "Nu Disco", "Remember"];

// Server component: la entrada se anima con CSS (clase `fade-up`) y no con
// Framer Motion, de modo que texto y CTAs se pintan aunque el JS tarde.
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-dark-primary min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col justify-center"
    >
      {/* glow rojo difuso de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] max-w-[1400px] max-h-[1400px] gradient-glow"
      />

      <div className="relative mx-auto max-w-5xl px-5 text-center md:px-8">
        {/* overline */}
        <p
          className="fade-up mb-6 inline-flex items-center gap-2 rounded-full border border-border-dark bg-dark-secondary/50 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-text-secondary"
        >
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inset-0 rounded-full bg-accent-red pulse-dot" />
            <span className="absolute inset-0 rounded-full bg-accent-red" />
          </span>
          {site.hero.overline}
        </p>

        {/* headline — es el elemento LCP: sin animación de opacidad a propósito.
            El prefijo sólo para lectores de pantalla pone la entidad y la
            intención ("DJ en Madrid") en el h1 sin tocar el diseño. */}
        <h1 className="font-display text-5xl uppercase leading-[0.95] tracking-tight md:text-7xl lg:text-8xl">
          <span className="sr-only">DJ Swarthy, DJ en Madrid. </span>
          <span lang="en">
            MUSIC IS THE <span className="text-gradient">ANSWER</span>
          </span>
        </h1>

        {/* sub */}
        <p
          className="fade-up mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg"
          style={{ animationDelay: "0.2s" }}
        >
          {site.hero.subheadline}
        </p>

        {/* trust bar — géneros */}
        <ul
          className="fade-up mt-8 flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-text-secondary"
          style={{ animationDelay: "0.35s" }}
          aria-label="Estilos"
        >
          {GENRES.map((g, i, arr) => (
            <li key={g} className="inline-flex items-center gap-2">
              <span className="text-text-primary">{g}</span>
              {i < arr.length - 1 && (
                <span className="text-accent-red/60" aria-hidden="true">
                  ·
                </span>
              )}
            </li>
          ))}
        </ul>

        {/* CTAs */}
        <div
          className="fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animationDelay: "0.3s" }}
        >
          <Link
            href={site.hero.primaryCta.href}
            className="group inline-flex items-center gap-2 gradient-primary px-7 py-4 text-sm font-semibold text-white rounded-full shadow-glow-strong transition-transform hover:scale-105"
          >
            <CalendarCheck size={16} aria-hidden="true" />
            {site.hero.primaryCta.label}
          </Link>
          <Link
            href={site.hero.secondaryCta.href}
            className="group inline-flex items-center gap-2 border border-border-dark bg-dark-secondary/50 px-7 py-4 text-sm font-semibold text-text-primary rounded-full transition-colors hover:bg-dark-secondary"
          >
            <Play size={16} className="fill-current" aria-hidden="true" />
            {site.hero.secondaryCta.label}
          </Link>
        </div>

        {/* Ecualizador animado */}
        <div
          className="fade-up mt-16 flex flex-col items-center gap-4"
          style={{ animationDelay: "0.5s" }}
        >
          <Equalizer />
          <span className="text-[10px] uppercase tracking-[0.4em] text-text-secondary">
            Madrid · España
          </span>
        </div>
      </div>
    </section>
  );
}

const BAR_DELAYS = [0, 0.15, 0.3, 0.1, 0.25, 0.05, 0.35, 0.2, 0.4, 0.08, 0.28, 0.18, 0.38, 0.12, 0.22, 0.32, 0.06, 0.42];
const BAR_DURATIONS = [0.7, 0.9, 0.6, 1.1, 0.8, 0.65, 0.95, 0.75, 1.0, 0.85, 0.7, 0.9, 0.6, 1.05, 0.8, 0.7, 0.95, 0.65];

function Equalizer() {
  return (
    <div className="flex items-end justify-center gap-1 h-16 w-full max-w-sm" aria-hidden="true">
      {BAR_DELAYS.map((delay, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 64,
            borderRadius: 3,
            background: "linear-gradient(to top, #e11d48, #f97316)",
            transformOrigin: "bottom",
            animation: `eq-bar ${BAR_DURATIONS[i]}s ease-in-out ${delay}s infinite`,
            boxShadow: "0 0 8px rgba(225,29,72,0.4)",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}
