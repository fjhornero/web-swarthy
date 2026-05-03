"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { site } from "@/lib/data";

export function About() {
  return (
    <section
      id="about"
      className="relative bg-dark-secondary py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-dark">
              <Image
                src="/images/portrait.jpg"
                alt="DJ Swarthy"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
              ★ {site.about.headline}
            </div>
            <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl">
              Quince años<br />
              <span className="text-gradient">en la cabina</span>
            </h2>
            <p className="mt-6 text-base leading-relaxed text-text-secondary md:text-lg">
              {site.about.body}
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 md:gap-6">
              {site.about.stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
                  className="rounded-xl border border-border-dark bg-dark-primary/60 p-4 text-center"
                >
                  <div className="font-display text-3xl md:text-4xl text-gradient">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-text-secondary">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
