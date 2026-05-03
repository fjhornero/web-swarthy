"use client";

import { motion } from "framer-motion";
import { Disc3, Wand2, Headphones, Zap } from "lucide-react";
import { site } from "@/lib/data";

const iconMap = {
  vinyl: Disc3,
  wand: Wand2,
  headphones: Headphones,
  zap: Zap,
} as const;

export function Features() {
  return (
    <section className="relative bg-dark-primary py-20 md:py-28 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 right-0 -translate-y-1/2 w-[60vw] h-[60vw] gradient-glow-orange"
      />

      <div className="relative mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ POR QUÉ SWARTHY
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Lo que hace que la noche{" "}
            <span className="text-gradient">se recuerde</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {site.features.map((f, i) => {
            const Icon = iconMap[f.icon as keyof typeof iconMap] ?? Disc3;
            return (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="card-lift rounded-2xl border border-border-dark bg-dark-secondary/60 p-6 hover:border-accent-red/40"
              >
                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl gradient-primary shadow-glow">
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-display text-xl uppercase md:text-2xl">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {f.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
