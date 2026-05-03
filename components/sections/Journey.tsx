"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/data";

export function Journey() {
  return (
    <section className="relative bg-dark-primary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-center mb-14 md:mb-20"
        >
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ TU NOCHE CON SWARTHY
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            El camino al <span className="text-gradient">peak time</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-text-secondary">
            Cuatro fases. Una pista que sube. Un cierre que se recuerda.
          </p>
        </motion.div>

        <div className="relative">
          {/* línea de timeline desktop */}
          <div
            aria-hidden
            className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border-dark to-transparent"
          />

          <div className="grid gap-8 md:grid-cols-4 md:gap-6">
            {site.journey.map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative text-center"
              >
                <div className="relative mx-auto mb-6 h-20 w-20 flex items-center justify-center">
                  <div className="absolute inset-0 gradient-primary opacity-30 blur-xl rounded-full" />
                  <div className="relative h-20 w-20 rounded-full gradient-primary flex items-center justify-center font-display text-3xl text-white shadow-glow">
                    {s.step}
                  </div>
                </div>
                <h3 className="font-display text-2xl uppercase md:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {s.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
