"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { site } from "@/lib/data";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-dark-primary min-h-screen pt-32 pb-20 md:pt-40 md:pb-28 flex flex-col justify-center"
    >
      {/* glow rojo difuso de fondo */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 left-1/2 -translate-x-1/2 w-[120vw] h-[120vw] max-w-[1400px] max-h-[1400px] gradient-glow"
      />

      <div className="relative mx-auto max-w-5xl px-5 text-center md:px-8">
        {/* overline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border-dark bg-dark-secondary/50 px-4 py-1.5 text-xs uppercase tracking-[0.2em] text-text-secondary"
        >
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inset-0 rounded-full bg-accent-red pulse-dot" />
            <span className="absolute inset-0 rounded-full bg-accent-red" />
          </span>
          {site.hero.overline}
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl uppercase leading-[0.95] tracking-tight md:text-7xl lg:text-8xl"
        >
          MUSIC IS THE <span className="text-gradient">ANSWER</span>
        </motion.h1>

        {/* sub */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg"
        >
          {site.hero.subheadline}
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={site.hero.primaryCta.href}
            className="group inline-flex items-center gap-2 gradient-primary px-7 py-4 text-sm font-semibold text-white rounded-full shadow-glow-strong transition-transform hover:scale-105"
          >
            <Play size={16} className="fill-white" />
            {site.hero.primaryCta.label.replace("▶ ", "")}
          </Link>
          <Link
            href={site.hero.secondaryCta.href}
            className="group inline-flex items-center gap-2 border border-border-dark bg-dark-secondary/50 px-7 py-4 text-sm font-semibold text-text-primary rounded-full transition-colors hover:bg-dark-secondary"
          >
            {site.hero.secondaryCta.label}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Ecualizador animado */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6 }}
          className="mt-16 flex flex-col items-center gap-4"
        >
          <Equalizer />
          <span className="text-[10px] uppercase tracking-[0.4em] text-text-secondary">
            Madrid · España
          </span>
        </motion.div>
      </div>
    </section>
  );
}

const BAR_DELAYS = [0, 0.15, 0.3, 0.1, 0.25, 0.05, 0.35, 0.2, 0.4, 0.08, 0.28, 0.18, 0.38, 0.12, 0.22, 0.32, 0.06, 0.42];
const BAR_DURATIONS = [0.7, 0.9, 0.6, 1.1, 0.8, 0.65, 0.95, 0.75, 1.0, 0.85, 0.7, 0.9, 0.6, 1.05, 0.8, 0.7, 0.95, 0.65];

function Equalizer() {
  return (
    <div className="flex items-end justify-center gap-1 h-16 w-full max-w-sm">
      {BAR_DELAYS.map((delay, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 64,
            borderRadius: 3,
            background: "linear-gradient(to top, #e11d48, #f97316)",
            transformOrigin: "bottom",
            animation: `eq-bar ${BAR_DURATIONS[i]}s ease-in-out ${delay}s infinite`,
            boxShadow: "0 0 8px rgba(225,29,72,0.4)",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}
