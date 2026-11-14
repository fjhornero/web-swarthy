"use client";

import Link from "next/link";

/** Evento con el que un enlace le dice al formulario de booking qué dejar elegido. */
export const BOOKING_PREFILL_EVENT = "booking:prefill";

/** Valores de los desplegables del formulario; deben coincidir con sus `<option>`. */
export interface BookingPrefill {
  formato?: string;
  tipoEvento?: string;
}

/**
 * Enlace al formulario de booking que además deja ya elegido el formato o el
 * tipo de evento. Sin esto, quien pulsaba "Solicitar este formato" llegaba a
 * un desplegable en blanco y tenía que volver a elegir lo que acababa de pedir.
 *
 * Va por evento del DOM y no por la URL: leer un parámetro de búsqueda en el
 * formulario obligaría a `useSearchParams`, que saca del prerrenderizado todo
 * lo que cuelga de él. Sin JavaScript sigue siendo un ancla normal a #booking.
 */
export function BookingLink({
  prefill,
  className,
  children,
}: {
  prefill: BookingPrefill;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href="/#booking"
      className={className}
      onClick={() =>
        window.dispatchEvent(
          new CustomEvent<BookingPrefill>(BOOKING_PREFILL_EVENT, { detail: prefill })
        )
      }
    >
      {children}
    </Link>
  );
}
