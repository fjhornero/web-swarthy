// Selección de fechas próximas. Vive fuera de data.ts porque lo consumen tanto
// la página (para la sección de agenda) como el JSON-LD, y ambos tienen que ver
// exactamente la misma lista.

import { site, type GigDate } from "./data";

/**
 * Fechas de hoy en adelante, ordenadas de más próxima a más lejana.
 * Se compara a medianoche para que el bolo del propio día siga apareciendo.
 */
export function upcomingDates(): GigDate[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return site.dates
    .filter((gig) => {
      const d = new Date(gig.date);
      return !isNaN(d.getTime()) && d.getTime() >= today.getTime();
    })
    .sort((a, b) => a.date.localeCompare(b.date));
}
