"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { site } from "@/lib/data";

export function About() {
  return (
    <section
      id="about"
      className="relative bg-dark-secondary py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-4 gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-dark">
              <Image
                src="/images/portrait-bw.png"
                alt="DJ Swarthy"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
              ★ {site.about.headline}
            </div>
            <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl">
              19 años<br />
              <span className="text-gradient">en la cabina</span>
            </h2>
            <div className="mt-6 space-y-4">
              {site.about.body.split("\n\n").map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-text-secondary md:text-lg">
                  {para}
                </p>
              ))}
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
