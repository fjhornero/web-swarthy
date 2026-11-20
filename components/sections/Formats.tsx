import { Check } from "lucide-react";
import { BookingLink } from "@/components/BookingLink";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/data";

export function Formats() {
  return (
    <section
      id="formats"
      className="relative bg-dark-primary py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          overline="FORMATOS"
          title={
            <>
              {/* Espacios duros: el título ocupa dos líneas hasta tablet y el
                  nombre, con su preposición, no debe partirse entre ellas. */}
              Formatos para <span className="text-gradient">contratar</span> a&nbsp;DJ&nbsp;Swarthy
            </>
          }
        >
          <p className="mt-4 max-w-xl mx-auto text-text-secondary">
            Sets de 90 minutos a sesiones all-night-long para clubs, festivales
            y eventos privados en Madrid y toda España. Personalizado a la sala,
            al horario y al público.
          </p>
        </SectionHeading>

        <div className="grid gap-6 md:grid-cols-3">
          {site.formats.map((f, i) => (
            <Reveal
              key={f.name}
              as="article"
              delay={i * 0.1}
              duration={0.6}
              y={24}
              // flex-col + mt-auto en el botón: las tres tarjetas tienen listas
              // de distinta longitud y los CTAs quedaban a alturas diferentes.
              className={`relative flex flex-col rounded-2xl p-8 ${
                f.featured
                  ? "border-2 border-accent-red bg-dark-secondary shadow-glow-strong"
                  : "border border-border-dark bg-dark-secondary/60"
              }`}
            >
              {f.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-1 rounded-full gradient-primary text-xs font-bold uppercase tracking-wider text-white">
                  Recomendado para club
                </div>
              )}

              <h3 className="font-display text-3xl uppercase md:text-4xl">
                {f.name}
              </h3>
              <div
                className="mt-4 font-display text-4xl text-text-primary md:text-5xl"
              >
                {f.duration}
              </div>
              <div className="mt-1 text-xs uppercase tracking-[0.2em] text-text-secondary">
                Cachet a medida · propuesta en 48h
              </div>

              <ul className="mb-8 mt-6 space-y-3">
                {f.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-accent-orange"
                      aria-hidden="true"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              {/* Llega al formulario con este formato ya elegido. */}
              <BookingLink
                prefill={{ formato: f.option }}
                className={`mt-auto block w-full text-center px-5 py-3 text-sm font-semibold rounded-full transition-all ${
                  f.featured
                    ? "gradient-primary text-white shadow-glow hover:scale-[1.02]"
                    : "border border-border-dark bg-dark-primary text-text-primary hover:border-text-secondary"
                }`}
              >
                Solicitar este formato
                <span className="sr-only">: {f.name}</span>
              </BookingLink>
            </Reveal>
          ))}
        </div>

        {/* Los tres formatos hablan el idioma de un club. Quien organiza una
            boda o un evento de empresa no se reconoce en "Peak Time": esta
            franja le dice que también es para él (mismo contenido que la FAQ). */}
        <Reveal
          y={20}
          delay={0.15}
          className="mt-6 flex flex-col items-start gap-5 rounded-2xl border border-border-dark bg-dark-secondary/60 p-6 md:flex-row md:items-center md:justify-between md:gap-8 md:p-8"
        >
          <div>
            <h3 className="font-display text-2xl uppercase md:text-3xl">
              ¿Boda, evento privado o de empresa?
            </h3>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-secondary">
              Swarthy adapta el repertorio a la celebración: remember, pop
              electrónico y selección bailable transversal. Cuéntale qué
              celebras y recibe una propuesta a medida en menos de 48h.
            </p>
          </div>
          <BookingLink
            // El formato se vacía: son formatos de club y quien llega por aquí
            // no debe encontrarse elegido el de una tarjeta que pulsó antes.
            prefill={{ tipoEvento: "Evento privado", formato: "" }}
            className="shrink-0 rounded-full border border-border-dark bg-dark-primary px-6 py-3 text-sm font-semibold text-text-primary transition-colors hover:border-text-secondary"
          >
            Contar mi evento
          </BookingLink>
        </Reveal>
      </div>
    </section>
  );
}
