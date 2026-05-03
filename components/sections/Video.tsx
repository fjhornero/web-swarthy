"use client";

import { motion } from "framer-motion";
import { Play } from "lucide-react";
import Image from "next/image";

export function Video() {
  return (
    <section className="relative bg-dark-primary py-20 md:py-28">
      <div className="relative mx-auto max-w-5xl px-5 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="text-center"
        >
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ MIRA CÓMO SUENA
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Una noche con <span className="text-gradient">SWARTHY</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-text-secondary">
            Tres minutos de teaser editado con momentos reales de sus últimas
            residencias.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mt-12 relative aspect-video overflow-hidden rounded-2xl border border-border-dark bg-dark-secondary group cursor-pointer"
        >
          <Image
            src="/images/hero.jpg"
            alt="Vídeo de presentación"
            fill
            className="object-cover saturate-0 brightness-50 transition-all group-hover:saturate-100 group-hover:brightness-75"
            sizes="(max-width: 1024px) 100vw, 1024px"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 -m-4 gradient-primary opacity-30 blur-2xl rounded-full" />
              <div className="relative h-20 w-20 md:h-24 md:w-24 rounded-full gradient-primary flex items-center justify-center shadow-glow-strong transition-transform group-hover:scale-110">
                <Play size={32} className="ml-1 fill-white text-white" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 text-xs uppercase tracking-[0.2em] text-text-secondary">
            VER VÍDEO DE PRESENTACIÓN · 3:14
          </div>
        </motion.div>
      </div>
    </section>
  );
}
