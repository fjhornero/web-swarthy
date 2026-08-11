"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/data";

export function Stats() {
  return (
    <section
      aria-label="Cifras de Swarthy"
      className="relative bg-dark-primary border-y border-border-dark"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {site.stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`flex flex-col-reverse items-center gap-1 px-4 py-8 text-center md:py-10 ${
                i % 2 === 0 ? "border-r border-border-dark" : ""
              } md:[&:not(:last-child)]:border-r ${
                i < 2 ? "border-b border-border-dark md:border-b-0" : ""
              }`}
            >
              {/* Dentro de un <dl> cada div sólo admite pares dt→dd; el orden
                  visual (valor arriba, etiqueta abajo) lo da flex-col-reverse. */}
              <dt className="text-xs uppercase tracking-[0.15em] text-text-secondary md:text-sm">
                {s.label}
              </dt>
              <dd className="m-0 font-display text-4xl uppercase leading-none text-gradient md:text-5xl">
                {s.value}
              </dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </section>
  );
}
