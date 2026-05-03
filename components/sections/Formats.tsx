"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { site } from "@/lib/data";

export function Formats() {
  return (
    <section
      id="formats"
      className="relative bg-dark-primary py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ FORMATOS
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Elige el formato de <span className="text-gradient">tu noche</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-text-secondary">
            Sets de 90 minutos a sesiones all-night-long. Personalizado a la
            sala, al horario y al público.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {site.formats.map((f, i) => (
            <motion.div
              key={f.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative rounded-2xl p-8 ${
                f.featured
                  ? "border-2 border-accent-red bg-dark-secondary shadow-glow-strong"
                  : "border border-border-dark bg-dark-secondary/60"
              }`}
            >
              {f.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full gradient-primary text-[10px] font-bold uppercase tracking-wider text-white">
                  Más popular
                </div>
              )}

              <div className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                {f.duration}
              </div>
              <h3 className="font-display mt-2 text-3xl uppercase md:text-4xl">
                {f.name}
              </h3>
              <div
                className={`mt-4 font-display text-4xl ${
                  f.featured ? "text-gradient" : "text-text-primary"
                }`}
              >
                {f.price}
              </div>

              <ul className="mt-6 space-y-3">
                {f.includes.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-2 text-sm text-text-secondary"
                  >
                    <Check
                      size={16}
                      className="mt-0.5 flex-shrink-0 text-accent-orange"
                    />
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="#booking"
                className={`mt-8 block w-full text-center px-5 py-3 text-sm font-semibold rounded-full transition-all ${
                  f.featured
                    ? "gradient-primary text-white shadow-glow hover:scale-[1.02]"
                    : "border border-border-dark bg-dark-primary text-text-primary hover:border-text-secondary"
                }`}
              >
                Solicitar este formato
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
