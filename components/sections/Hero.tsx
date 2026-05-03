"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, ArrowRight } from "lucide-react";
import { site } from "@/lib/data";
import { Countdown } from "@/components/ui/Countdown";

export function Hero() {
  return (
    <section
      id="top"
      className="relative isolate overflow-hidden bg-dark-primary pt-32 pb-20 md:pt-40 md:pb-28"
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

        {/* avatar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mx-auto mb-8 relative h-32 w-32 md:h-40 md:w-40"
        >
          <div className="absolute inset-0 -m-2 rounded-full gradient-primary opacity-60 blur-2xl" />
          <div className="relative h-full w-full overflow-hidden rounded-full border-2 border-border-dark bg-dark-secondary">
            <Image
              src="/images/portrait.jpg"
              alt="DJ Swarthy"
              fill
              className="object-cover saturate-0"
              sizes="160px"
              priority
            />
          </div>
        </motion.div>

        {/* headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-5xl uppercase leading-[0.95] tracking-tight md:text-7xl lg:text-8xl"
        >
          PINCHA TU NOCHE<br />
          COMO UN <span className="text-gradient">PROFESIONAL</span>
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

        {/* Countdown a próximo gig */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-14 mx-auto max-w-2xl"
        >
          <div className="rounded-2xl border border-border-dark bg-dark-secondary/40 backdrop-blur-sm p-6 md:p-8">
            <div className="mb-4 flex items-center justify-center gap-2 text-xs uppercase tracking-[0.2em] text-accent-orange">
              <span>★</span> PRÓXIMA FECHA <span>★</span>
            </div>
            <div className="text-center mb-2">
              <span className="font-display text-3xl md:text-4xl text-text-primary">
                {site.nextGig.venue}
              </span>
              <span className="ml-3 text-sm text-text-secondary">
                {site.nextGig.city}
              </span>
            </div>
            <div className="mt-6 flex justify-center">
              <Countdown target={new Date(site.nextGig.iso)} size="md" />
            </div>
            <div className="mt-6 text-center text-xs text-text-secondary">
              <span className="text-accent-orange font-semibold">
                Quedan {site.nextGig.seatsLeft} entradas
              </span>{" "}
              · de {site.nextGig.seatsTotal}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
