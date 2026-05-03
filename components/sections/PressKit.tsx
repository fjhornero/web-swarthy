"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { site } from "@/lib/data";

export function PressKit() {
  return (
    <section className="relative bg-dark-primary py-20 md:py-28 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 gradient-glow opacity-50"
      />

      <div className="relative mx-auto max-w-3xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="rounded-2xl border border-accent-red/40 bg-dark-secondary/80 backdrop-blur-sm p-8 md:p-12 text-center shadow-glow-strong"
        >
          <div className="mx-auto mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl gradient-primary shadow-glow">
            <FileText size={28} className="text-white" />
          </div>

          <div className="text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ DESCARGA GRATUITA
          </div>
          <h2 className="font-display mt-2 text-4xl uppercase md:text-5xl">
            {site.pressKit.title}
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-text-secondary">
            {site.pressKit.description}
          </p>

          <Link
            href={site.pressKit.href}
            className="mt-8 inline-flex items-center gap-3 gradient-primary px-7 py-4 text-sm font-semibold text-white rounded-full shadow-glow-strong transition-transform hover:scale-105"
          >
            <Download size={18} />
            Descargar EPK · PDF
          </Link>

          <div className="mt-4 text-xs text-text-secondary">
            {site.pressKit.fileLabel} · 4.2 MB
          </div>
        </motion.div>
      </div>
    </section>
  );
}
