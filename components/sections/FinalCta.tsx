"use client";

import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { BookingForm } from "./BookingForm";

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

      <div className="relative mx-auto max-w-2xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center mb-10"
        >
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ ¿LISTO?
          </div>
          <h2 className="font-display text-5xl uppercase leading-[0.95] md:text-7xl">
            Reserva una{" "}
            <span className="text-gradient">noche</span>
            <br />
            que se recuerde.
          </h2>
          <p className="mt-6 text-base md:text-lg text-text-secondary">
            Trato directo con Swarthy. Sin agencia, sin intermediarios.
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs uppercase tracking-[0.15em] text-text-secondary">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} className="text-accent-orange" />
              Respuesta en 48h
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={12} className="text-accent-orange" />
              Madrid · Toda España
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15 }}
        >
          <BookingForm />
        </motion.div>
      </div>
    </section>
  );
}
