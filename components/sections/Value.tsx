"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { site } from "@/lib/data";

export function Value() {
  return (
    <section className="relative bg-dark-primary py-20 md:py-28">
      <div className="mx-auto max-w-3xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-12"
        >
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ QUÉ INCLUYE EL CACHET
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Todo lo que <span className="text-gradient">te llevas</span>
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-2xl border border-border-dark bg-dark-secondary overflow-hidden"
        >
          <ul className="divide-y divide-border-dark">
            {site.value.items.map((it) => (
              <li
                key={it.label}
                className="flex items-center justify-between px-6 py-4 md:px-8"
              >
                <div className="flex items-center gap-3 text-sm md:text-base">
                  <Check size={16} className="text-success flex-shrink-0" />
                  <span className="text-text-primary">{it.label}</span>
                </div>
                <span
                  className={`text-sm font-semibold ${
                    it.value === "Incluido"
                      ? "text-success"
                      : "text-text-secondary"
                  }`}
                >
                  {it.value}
                </span>
              </li>
            ))}
          </ul>

          <div className="gradient-primary px-6 py-5 md:px-8">
            <div className="flex items-center justify-between">
              <span className="text-sm uppercase tracking-wider text-white/90">
                {site.value.total.label}
              </span>
              <span className="font-display text-3xl md:text-4xl text-white">
                {site.value.total.value}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
