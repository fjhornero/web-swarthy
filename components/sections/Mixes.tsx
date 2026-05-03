"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Headphones } from "lucide-react";
import { site } from "@/lib/data";

export function Mixes() {
  return (
    <section
      id="mixes"
      className="relative bg-dark-secondary py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ SETS DESTACADOS
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Tres sets que <span className="text-gradient">cuentan quién es</span>
          </h2>
          <p className="mt-4 max-w-xl mx-auto text-text-secondary">
            Una grabación de residencia, un mix de estudio y un live. Pinchazos
            de aguja incluidos.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {site.mixes.map((m, i) => (
            <motion.article
              key={m.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`card-lift relative overflow-hidden rounded-2xl border bg-dark-primary group ${
                m.featured
                  ? "border-accent-red/40 shadow-glow"
                  : "border-border-dark hover:border-text-secondary/40"
              }`}
            >
              {m.featured && (
                <div className="absolute top-4 right-4 z-10 px-3 py-1 rounded-full gradient-primary text-[10px] font-semibold uppercase tracking-wider text-white shadow-glow">
                  Más escuchado
                </div>
              )}

              <Link href={m.url}>
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={m.cover}
                    alt={m.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/30 to-transparent" />

                  <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div className="h-16 w-16 rounded-full gradient-primary flex items-center justify-center shadow-glow-strong">
                      <Play size={20} className="ml-0.5 fill-white text-white" />
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 p-5">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-accent-orange">
                      {m.tag}
                    </span>
                    <h3 className="font-display mt-1 text-2xl uppercase md:text-3xl">
                      {m.title}
                    </h3>
                  </div>
                </div>

                <div className="grid grid-cols-3 divide-x divide-border-dark border-t border-border-dark">
                  <Stat label="AÑO" value={m.year} />
                  <Stat label="DURACIÓN" value={m.length} />
                  <Stat label="PLAYS" value={m.plays} icon />
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="#mixes"
            className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary"
          >
            Ver todos los sets <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: boolean;
}) {
  return (
    <div className="px-4 py-4 text-center">
      <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-text-primary">
        {icon && <Headphones size={12} className="text-accent-orange" />}
        {value}
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.15em] text-text-secondary">
        {label}
      </div>
    </div>
  );
}
