"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";

// Las preguntas llegan por props desde el servidor: importar lib/data.ts aquí
// metería todo el contenido del sitio (bios, rider, formatos) en el bundle.
export function Faq({ items }: { items: Array<{ q: string; a: string }> }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-dark-primary py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionHeading
          overline="DUDAS FRECUENTES"
          title={
            // El acento no se parte: sin `whitespace-nowrap`, en escritorio
            // «contratar» se quedaba solo en la segunda línea.
            <>
              Preguntas frecuentes{" "}
              <span className="whitespace-nowrap text-gradient">antes de contratar</span>
            </>
          }
          className="mb-12"
        />

        <div className="space-y-3">
          {items.map((f, i) => {
            const isOpen = open === i;
            const buttonId = `faq-button-${i}`;
            const panelId = `faq-panel-${i}`;
            return (
              <Reveal
                key={f.q}
                y={12}
                duration={0.4}
                delay={i * 0.04}
                margin="0px"
                className="rounded-2xl border border-border-dark bg-dark-secondary overflow-hidden"
              >
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-dark-tertiary focus-visible:outline-offset-[-2px] md:px-8"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span className="text-base font-semibold text-text-primary md:text-lg">
                      {f.q}
                    </span>
                    <Plus
                      size={20}
                      aria-hidden="true"
                      className={`flex-shrink-0 text-accent-orange transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    />
                  </button>
                </h3>
                {/* La respuesta está siempre en el HTML, también plegada: cuando
                    sólo se montaba al abrir, los buscadores y los asistentes de
                    IA no leían más que la primera. Se pliega con CSS: la fila
                    de la rejilla pasa de 0fr a 1fr (una altura "auto" que sí
                    admite transición) y, cerrada, queda con visibility: hidden,
                    de modo que ni el lector de pantalla ni el tabulador entran
                    en ella. Con prefers-reduced-motion el cambio es inmediato:
                    lo impone la regla global de globals.css. */}
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  className={`grid transition-[grid-template-rows,opacity,visibility] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "invisible grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <p className="px-6 pb-5 text-sm text-text-secondary leading-relaxed md:px-8 md:text-base">
                      {f.a}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
