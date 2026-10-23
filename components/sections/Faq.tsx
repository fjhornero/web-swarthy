"use client";

import { m, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-dark-primary py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <SectionHeading
          overline="DUDAS FRECUENTES"
          title={
            <>
              Preguntas y <span className="text-gradient">respuestas</span>
            </>
          }
          className="mb-12"
        />

        <div className="space-y-3">
          {site.faq.map((f, i) => {
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
                {/* El contenedor del panel existe siempre para que aria-controls
                    apunte a un id real; AnimatePresence monta y desmonta el
                    contenido animando la altura. */}
                <div id={panelId} role="region" aria-labelledby={buttonId}>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <m.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 pb-5 text-sm text-text-secondary leading-relaxed md:px-8 md:text-base">
                          {f.a}
                        </p>
                      </m.div>
                    )}
                  </AnimatePresence>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
