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

        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {site.venues.map((v, i) => (
            <motion.div
              key={v.name + v.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="card-lift relative aspect-video overflow-hidden rounded-2xl border border-border-dark group"
            >
              {v.img ? (
                <>
                  <Image
                    src={v.img}
                    alt={`${v.name}, ${v.city}`}
                    fill
                    className="object-cover saturate-[0.55] brightness-90 transition-all duration-700 group-hover:scale-105 group-hover:saturate-100 group-hover:brightness-100"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </>
              ) : (
                // Sin foto de la sala: tratamiento tipográfico en vez de una
                // imagen que rompa la coherencia de la rejilla.
                <>
                  <div className="absolute inset-0 bg-dark-secondary" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-x-8 -bottom-16 h-40 gradient-glow opacity-70"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center font-display text-7xl uppercase text-white/5 md:text-8xl"
                  >
                    {v.name.slice(0, 2)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </>
              )}

              <span className="absolute top-3 right-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                {v.year}
              </span>

              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-display text-xl uppercase md:text-2xl text-white">
                  {v.name}
                </div>
                <div className="mt-1 text-xs uppercase tracking-[0.15em] text-accent-orange">
                  {v.city}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
