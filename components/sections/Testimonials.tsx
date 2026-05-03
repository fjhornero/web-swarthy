"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { site } from "@/lib/data";

export function Testimonials() {
  return (
    <section className="relative bg-dark-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ LO QUE DICEN
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Promotores y <span className="text-gradient">prensa</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {site.testimonials.map((t, i) => (
            <motion.figure
              key={t.author}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="rounded-2xl border border-border-dark bg-dark-primary p-6 md:p-8"
            >
              <Quote className="text-accent-red mb-4" size={28} />
              <blockquote className="text-base leading-relaxed text-text-primary md:text-lg">
                {t.quote}
              </blockquote>
              <figcaption className="mt-6 pt-4 border-t border-border-dark">
                <div className="font-semibold text-text-primary">
                  {t.author}
                </div>
                <div className="text-sm text-text-secondary">{t.role}</div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
