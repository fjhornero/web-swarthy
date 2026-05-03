"use client";

import { motion } from "framer-motion";
import { Mail, FileCheck, Music } from "lucide-react";
import { site } from "@/lib/data";

const icons = [Mail, FileCheck, Music];

export function HowTo() {
  return (
    <section className="relative bg-dark-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ CÓMO CONTRATAR
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Tres pasos hasta la <span className="text-gradient">cabina</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-text-secondary">
            Sin agencia, sin intermediarios. Trato directo y respuesta en menos
            de 48h.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {site.howTo.map((s, i) => {
            const Icon = icons[i];
            return (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="relative rounded-2xl border border-border-dark bg-dark-primary p-8"
              >
                <div className="absolute -top-4 left-8 px-3 py-1 rounded-full gradient-primary text-xs font-semibold text-white">
                  PASO {s.step}
                </div>
                <Icon size={28} className="text-accent-orange mb-4" />
                <h3 className="font-display text-2xl uppercase md:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                  {s.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
