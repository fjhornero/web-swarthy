"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import type { GigDate } from "@/lib/data";

interface DatesProps {
  /** Ya filtradas y ordenadas en el servidor (ver app/page.tsx) */
  dates: GigDate[];
}

const dayFormatter = new Intl.DateTimeFormat("es-ES", { day: "2-digit" });
const monthFormatter = new Intl.DateTimeFormat("es-ES", { month: "short" });
const yearFormatter = new Intl.DateTimeFormat("es-ES", { year: "numeric" });

export function Dates({ dates }: DatesProps) {
  // Sin fechas confirmadas es mejor no enseñar una agenda vacía: la sección
  // entera desaparece y el usuario sigue hacia los sets.
  if (dates.length === 0) return null;

  return (
    <section id="fechas" className="relative bg-dark-primary py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <div className="mb-14 text-center">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ AGENDA
          </div>
          <h2 className="font-display text-4xl uppercase md:text-6xl">
            Próximas <span className="text-gradient">fechas</span>
          </h2>
        </div>

        <ul className="space-y-3">
          {dates.map((gig, i) => {
            const d = new Date(gig.date);
            const soldOut = gig.status === "agotada";

            return (
              <motion.li
                key={`${gig.date}-${gig.venue}`}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="card-lift flex flex-col gap-4 rounded-2xl border border-border-dark bg-dark-secondary p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
              >
                {/* bloque de fecha */}
                <div className="flex shrink-0 items-baseline gap-2 sm:w-24 sm:flex-col sm:items-center sm:gap-0">
                  <span className="font-display text-4xl leading-none text-gradient">
                    {dayFormatter.format(d)}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                    {monthFormatter.format(d).replace(".", "")} {yearFormatter.format(d)}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-display text-2xl uppercase leading-none">
                      {gig.venue}
                    </h3>
                    {soldOut && (
                      <span className="rounded-full border border-accent-red/40 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-accent-red">
                        Entradas agotadas
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-text-secondary">
                    <MapPin size={13} className="text-accent-orange" />
                    {gig.city}
                    {gig.note && <span className="text-text-secondary/70">· {gig.note}</span>}
                  </p>
                </div>

                {gig.ticketsUrl && !soldOut ? (
                  <Link
                    href={gig.ticketsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
                  >
                    <Ticket size={15} />
                    Entradas
                  </Link>
                ) : (
                  <span className="inline-flex shrink-0 items-center gap-2 text-xs uppercase tracking-[0.15em] text-text-secondary">
                    <CalendarDays size={13} className="text-accent-orange" />
                    {soldOut ? "Sold out" : "Confirmada"}
                  </span>
                )}
              </motion.li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
