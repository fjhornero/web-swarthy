"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { site } from "@/lib/data";

export function Venues() {
  return (
    <section id="venues" className="relative bg-dark-primary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="text-center mb-14">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ DONDE HA PINCHADO
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Clubs y festivales que <span className="text-gradient">confían</span>
          </h2>
        </div>

        <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
          {site.venues.map((v, i) => (
            <motion.div
              key={v.name + v.year}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="card-lift relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-dark group"
            >
              <Image
                src={v.img}
                alt={v.name}
                fill
                className="object-cover saturate-[0.8] transition-all duration-700 group-hover:scale-105 group-hover:saturate-100"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-primary via-dark-primary/40 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4">
                <div className="text-[10px] uppercase tracking-[0.2em] text-accent-orange">
                  {v.year}
                </div>
                <div className="font-display mt-1 text-xl uppercase md:text-2xl">
                  {v.name}
                </div>
                <div className="text-sm text-text-secondary">
                  {v.city}, {v.country}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
