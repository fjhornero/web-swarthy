"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowRight, Clock, MapPin } from "lucide-react";
import { site } from "@/lib/data";

export function FinalCta() {
  return (
    <section
      id="booking"
      className="relative bg-dark-primary py-24 md:py-32 overflow-hidden"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 gradient-glow opacity-60"
      />

      <div className="relative mx-auto max-w-4xl px-5 text-center md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ ¿LISTO?
          </div>
          <h2 className="font-display text-5xl uppercase leading-[0.95] md:text-7xl lg:text-8xl">
            Reserva una{" "}
            <span className="text-gradient">noche</span>
            <br />
            que se recuerde.
          </h2>
          <p className="mt-6 max-w-xl mx-auto text-base md:text-lg text-text-secondary">
            Trato directo con Swarthy. Sin agencia, sin intermediarios.
            Respuesta en menos de 48h.
          </p>

          {/* trust bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.15em] text-text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} className="text-accent-orange" />
              Respuesta en 48h
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={12} className="text-accent-orange" />
              Madrid · Toda España
            </span>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={`mailto:${site.bookingEmail}?subject=Booking%20DJ%20Swarthy`}
              className="group inline-flex items-center gap-3 gradient-primary px-8 py-4 text-sm font-semibold text-white rounded-full shadow-glow-strong transition-transform hover:scale-105"
            >
              <Mail size={18} />
              Escribir a booking
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href={`mailto:${site.bookingEmail}`}
              className="text-sm text-text-secondary hover:text-text-primary transition-colors"
            >
              {site.bookingEmail}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
