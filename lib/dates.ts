// Selección de fechas próximas. Vive fuera de data.ts porque lo consumen tanto
// la página (para la sección de agenda) como el JSON-LD, y ambos tienen que ver
// exactamente la misma lista.

import { site, type GigDate } from "./data";

/** Zona horaria de referencia de la agenda: los bolos son en España. */
export const AGENDA_TIME_ZONE = "Europe/Madrid";

// "sv-SE" formatea como ISO (YYYY-MM-DD), lo que permite comparar cadenas sin
// pasar por Date y sin depender de la zona horaria del servidor (el contenedor
// corre en UTC y un bolo de hoy desaparecería o aparecería con horas de desfase).
const isoDayFormatter = new Intl.DateTimeFormat("sv-SE", {
  timeZone: AGENDA_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;

/** Día de hoy en Europe/Madrid, como YYYY-MM-DD. */
export function todayIso(now: Date = new Date()): string {
  return isoDayFormatter.format(now);
}

/** True si la cadena es un día ISO válido (YYYY-MM-DD y fecha real). */
export function isIsoDay(value: string): boolean {
  if (!ISO_DAY.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

/**
 * Fechas de hoy en adelante, ordenadas de más próxima a más lejana.
 * Se compara por día para que el bolo del propio día siga apareciendo.
 */
export function upcomingDates(now: Date = new Date()): GigDate[] {
  const today = todayIso(now);

  return site.dates
    .filter((gig) => isIsoDay(gig.date) && gig.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}
