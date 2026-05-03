"use client";

import { motion } from "framer-motion";
import { Shield, Clock, FileText } from "lucide-react";

export function Guarantee() {
  const items = [
    {
      icon: Clock,
      title: "RESPUESTA EN 48H",
      body: "Si nos escribes hoy, mañana o pasado tienes propuesta cerrada en tu correo.",
    },
    {
      icon: Shield,
      title: "CONTRATO POR ESCRITO",
      body: "Cachet, técnica y horarios cerrados. Sin sorpresas, sin letra pequeña.",
    },
    {
      icon: FileText,
      title: "EPK COMPLETO",
      body: "Bio, fotos, rider técnico y enlaces a sets en un único PDF descargable.",
    },
  ];

  return (
    <section className="relative bg-dark-secondary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ COMPROMISO
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Trato directo, <span className="text-gradient">cero ruido</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className="text-center rounded-2xl border border-border-dark bg-dark-primary p-8"
            >
              <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full gradient-primary shadow-glow">
                <it.icon size={24} className="text-white" />
              </div>
              <h3 className="font-display text-xl uppercase md:text-2xl">
                {it.title}
              </h3>
              <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                {it.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
