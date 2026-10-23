import Link from "next/link";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { NewTabHint } from "@/components/NewTabHint";
import { AGENDA_TIME_ZONE } from "@/lib/dates";
import type { GigDate } from "@/lib/data";

interface DatesProps {
  /** Ya filtradas y ordenadas en el servidor (ver app/page.tsx) */
  dates: GigDate[];
}

// Las fechas son días sin hora ("YYYY-MM-DD"): se formatean con la zona
// horaria fija de la agenda para que el día no cambie según dónde se renderice.
const dayFormatter = new Intl.DateTimeFormat("es-ES", { day: "2-digit", timeZone: AGENDA_TIME_ZONE });
const monthFormatter = new Intl.DateTimeFormat("es-ES", { month: "short", timeZone: AGENDA_TIME_ZONE });
const yearFormatter = new Intl.DateTimeFormat("es-ES", { year: "numeric", timeZone: AGENDA_TIME_ZONE });

export function Dates({ dates }: DatesProps) {
  // Sin fechas confirmadas es mejor no enseñar una agenda vacía: la sección
  // entera desaparece y el usuario sigue hacia los sets.
  if (dates.length === 0) return null;

  return (
    <section id="fechas" className="relative bg-dark-primary py-20 md:py-28">
      <div className="mx-auto max-w-4xl px-5 md:px-8">
        <SectionHeading
          overline="AGENDA"
          title={
            <>
              Próximas <span className="text-gradient">fechas</span>
            </>
          }
        />

        <ul className="space-y-3">
          {dates.map((gig, i) => {
            // Mediodía UTC: el mismo día en cualquier zona horaria razonable.
            const d = new Date(`${gig.date}T12:00:00Z`);
            const soldOut = gig.status === "agotada";

            return (
              <Reveal
                as="li"
                key={`${gig.date}-${gig.venue}`}
                delay={i * 0.06}
                className="card-lift flex flex-col gap-4 rounded-2xl border border-border-dark bg-dark-secondary p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
              >
                {/* bloque de fecha */}
                <time
                  dateTime={gig.date}
                  className="flex shrink-0 items-baseline gap-2 sm:w-24 sm:flex-col sm:items-center sm:gap-0"
                >
                  <span className="font-display text-4xl leading-none text-gradient">
                    {dayFormatter.format(d)}
                  </span>
                  <span className="text-xs uppercase tracking-[0.2em] text-text-secondary">
                    {monthFormatter.format(d).replace(".", "")} {yearFormatter.format(d)}
                  </span>
                </time>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h3 className="font-display text-2xl uppercase leading-none">
                      {gig.venue}
                    </h3>
                    {soldOut && (
                      <span className="rounded-full border border-accent-red/40 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.15em] text-rose-400">
                        Entradas agotadas
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-text-secondary">
                    <MapPin size={13} className="text-accent-orange" aria-hidden="true" />
                    {gig.city}
                    {gig.note && <span>· {gig.note}</span>}
                  </p>
                </div>

                {gig.ticketsUrl && !soldOut ? (
                  <Link
                    href={gig.ticketsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
                  >
                    <Ticket size={15} aria-hidden="true" />
                    Entradas
                    <NewTabHint />
                  </Link>
                ) : (
                  <span className="inline-flex shrink-0 items-center gap-2 text-xs uppercase tracking-[0.15em] text-text-secondary">
                    <CalendarDays size={13} className="text-accent-orange" aria-hidden="true" />
                    {soldOut ? <span lang="en">Sold out</span> : "Confirmada"}
                  </span>
                )}
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
