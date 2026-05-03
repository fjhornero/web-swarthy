"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/data";

export function Stats() {
  return (
    <section className="relative bg-dark-secondary py-20 md:py-24 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 gradient-glow opacity-40"
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6 text-center">
          {site.kpis.map((k, i) => (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <div className="font-display text-5xl md:text-7xl text-gradient leading-none">
                {k.value}
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.2em] text-text-secondary">
                {k.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
