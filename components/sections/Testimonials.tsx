"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { site } from "@/lib/data";

export function Testimonials() {
  // Sin testimonios reales la sección no se renderiza. Nunca rellenar con
  // texto de relleno: es prueba social y sólo vale si es verificable.
  if (site.testimonials.length === 0) return null;

  return (
    <section id="testimonios" className="relative bg-dark-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mb-14 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ LO QUE DICEN
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Promotores que <span className="text-gradient">repiten</span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {site.testimonials.map((t, i) => (
            <motion.figure
              key={t.author + t.role}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="card-lift flex h-full flex-col rounded-2xl border border-border-dark bg-dark-primary p-6"
            >
              <Quote size={22} className="mb-4 shrink-0 text-accent-orange" />
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
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
