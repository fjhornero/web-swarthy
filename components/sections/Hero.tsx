import Image from "next/image";
import Link from "next/link";
import { CalendarCheck, Play } from "lucide-react";
import { site } from "@/lib/data";

// Server component: la entrada se anima con CSS (clase `fade-up`) y no con
// Framer Motion, de modo que texto y CTAs se pintan aunque el JS tarde.
//
// Composición: la misma que la imagen social (app/opengraph-image.tsx). El
// nombre es el titular, el lema va debajo y el retrato queda limpio: a la
// derecha en escritorio y arriba en móvil, sin texto encima de la cara.
export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-dark-primary pb-12 pt-28 md:justify-center md:pb-24 md:pt-36"
    >
      {/* glow rojo difuso, detrás del bloque de texto */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 left-1/2 h-[120vw] max-h-[1400px] w-[120vw] max-w-[1400px] -translate-x-1/2 gradient-glow md:left-[28%]"
      />

      {/* Retrato. Decorativo (el que lleva alt está en About), pero es lo más
          grande del primer pantallazo y por tanto el LCP: va con `priority`
          para que se precargue en vez de esperar a la carga diferida, y con
          `fetchPriority` explícito porque en Next 15 `priority` ya no lo pone
          ni en la etiqueta ni en la precarga. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[68svh] opacity-70 [mask-image:linear-gradient(to_bottom,black_45%,transparent)] md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-[56%] md:opacity-90 md:[mask-image:linear-gradient(to_left,black_55%,transparent)]"
      >
        <Image
          src="/images/portrait-bw.webp"
          alt=""
          fill
          priority
          fetchPriority="high"
          // En tablet la columna del retrato es estrecha y alta: se encuadra
          // hacia la izquierda de la foto para que la cara quede a la derecha,
          // lejos del texto.
          className="object-cover object-top md:object-[20%_0%] lg:object-top"
          sizes="(max-width: 768px) 100vw, 56vw"
        />
      </div>
      {/* funde el pie del retrato con la sección siguiente */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-40 bg-gradient-to-t from-dark-primary to-transparent md:block"
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-8">
        <div className="mx-auto max-w-xl text-center md:mx-0 md:max-w-[36rem] md:text-left lg:max-w-[44rem]">
          {/* overline */}
          <p className="fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-border-dark bg-dark-secondary/60 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-text-secondary md:mb-5">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inset-0 rounded-full bg-accent-red pulse-dot" />
              <span className="absolute inset-0 rounded-full bg-accent-red" />
            </span>
            {site.hero.overline}
          </p>

          {/* Titular: sin animación de opacidad a propósito, para que se pinte
              con el primer render. */}
          <h1 className="whitespace-nowrap font-display text-[clamp(3.75rem,21vw,5.5rem)] uppercase leading-[0.85] tracking-tight md:text-8xl lg:text-9xl xl:text-[10.5rem]">
            {site.hero.name}
          </h1>

          <p
            lang="en"
            className="fade-up mt-2 font-display text-3xl uppercase leading-none text-gradient md:mt-3 md:text-4xl lg:text-5xl xl:text-6xl"
            style={{ animationDelay: "0.1s" }}
          >
            {site.hero.slogan}
          </p>

          {/* sub. Los anchos máximos por tramo evitan que el párrafo se meta
              en la cara del retrato, que en tablet queda más cerca del texto. */}
          <p
            className="fade-up mx-auto mt-5 max-w-xl text-base leading-relaxed text-text-secondary md:mx-0 md:mt-6 md:max-w-xs md:text-lg lg:max-w-md xl:max-w-xl"
            style={{ animationDelay: "0.2s" }}
          >
            {site.hero.subheadline}
          </p>

          {/* estilos. En móviles bajos se ocultan para que el titular no suba
              hasta taparle la cara al retrato; siguen en el subtítulo y en Sets. */}
          <ul
            className="fade-up mt-6 flex flex-wrap items-center justify-center gap-2 md:max-w-xs md:justify-start lg:max-w-md xl:max-w-none max-md:[@media(max-height:720px)]:hidden"
            style={{ animationDelay: "0.3s" }}
            aria-label="Estilos"
          >
            {site.genres.map((genre) => (
              <li
                key={genre}
                className="rounded-full border border-border-dark bg-dark-secondary/60 px-3 py-1 text-xs text-text-secondary"
              >
                {genre}
              </li>
            ))}
          </ul>

          {/* CTAs */}
          <div
            className="fade-up mx-auto mt-8 flex max-w-sm flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:items-center sm:justify-center sm:gap-4 md:mx-0 md:justify-start"
            style={{ animationDelay: "0.4s" }}
          >
            <Link
              href={site.hero.primaryCta.href}
              className="inline-flex items-center justify-center gap-2 gradient-primary px-7 py-4 text-sm font-semibold text-white rounded-full shadow-glow-strong transition-transform hover:scale-105"
            >
              <CalendarCheck size={16} aria-hidden="true" />
              {site.hero.primaryCta.label}
            </Link>
            <Link
              href={site.hero.secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 border border-border-dark bg-dark-secondary/70 px-7 py-4 text-sm font-semibold text-text-primary rounded-full transition-colors hover:bg-dark-secondary"
            >
              <Play size={16} className="fill-current" aria-hidden="true" />
              {site.hero.secondaryCta.label}
            </Link>
          </div>

          {/* Ecualizador animado: sólo donde sobra altura */}
          <div
            className="fade-up mt-12 hidden md:block"
            style={{ animationDelay: "0.5s" }}
          >
            <Equalizer />
          </div>
        </div>
      </div>
    </section>
  );
}

const BAR_DELAYS = [0, 0.15, 0.3, 0.1, 0.25, 0.05, 0.35, 0.2, 0.4, 0.08, 0.28, 0.18, 0.38, 0.12, 0.22, 0.32, 0.06, 0.42];
const BAR_DURATIONS = [0.7, 0.9, 0.6, 1.1, 0.8, 0.65, 0.95, 0.75, 1.0, 0.85, 0.7, 0.9, 0.6, 1.05, 0.8, 0.7, 0.95, 0.65];

function Equalizer() {
  return (
    <div className="flex h-12 items-end gap-1" aria-hidden="true">
      {BAR_DELAYS.map((delay, i) => (
        <div
          key={i}
          style={{
            width: 5,
            height: 48,
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
