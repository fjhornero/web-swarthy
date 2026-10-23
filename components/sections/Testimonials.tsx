import { Quote } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/data";

export function Testimonials() {
  // Sin testimonios reales la sección no se renderiza. Nunca rellenar con
  // texto de relleno: es prueba social y sólo vale si es verificable.
  if (site.testimonials.length === 0) return null;

  return (
    <section id="testimonios" className="relative bg-dark-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          overline="LO QUE DICEN"
          title={
            <>
              Promotores que <span className="text-gradient">repiten</span>
            </>
          }
        />

        <div className="grid gap-5 md:grid-cols-3">
          {site.testimonials.map((t, i) => (
            <Reveal
              as="figure"
              key={t.author + t.role}
              delay={i * 0.08}
              y={20}
              className="card-lift flex h-full flex-col rounded-2xl border border-border-dark bg-dark-primary p-6"
            >
              <Quote size={22} className="mb-4 shrink-0 text-accent-orange" aria-hidden="true" />
              <blockquote className="flex-1 text-base leading-relaxed text-text-secondary">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 border-t border-border-dark pt-4">
                <span className="block text-sm font-semibold text-text-primary">
                  {t.author}
                </span>
                <span className="mt-0.5 block text-xs uppercase tracking-[0.15em] text-text-secondary">
                  {t.role}
                </span>
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
