"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import { site } from "@/lib/data";

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative bg-dark-primary py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <div className="text-center mb-12">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ DUDAS FRECUENTES
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Preguntas y <span className="text-gradient">respuestas</span>
          </h2>
        </div>

        <div className="space-y-3">
          {site.faq.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="rounded-2xl border border-border-dark bg-dark-secondary overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-dark-tertiary md:px-8"
                  aria-expanded={isOpen}
                >
                  <span className="text-base font-semibold text-text-primary md:text-lg">
                    {f.q}
                  </span>
                  <Plus
                    size={20}
                    className={`flex-shrink-0 text-accent-orange transition-transform duration-300 ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <p className="px-6 pb-5 text-sm text-text-secondary leading-relaxed md:px-8 md:text-base">
                        {f.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
