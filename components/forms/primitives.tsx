"use client";

import { useEffect, useRef } from "react";
import { m, AnimatePresence } from "framer-motion";
import { AlertCircle, CheckCircle, Loader2, Send } from "lucide-react";

// Estilos compartidos por los dos formularios (booking y contacto).
// border-white/40: el borde es la única pista visual del límite del campo y
// con /10 quedaba en ~1.5:1 de contraste (WCAG 1.4.11 pide 3:1).
// text-base en móvil: Safari iOS amplía la página al enfocar cualquier campo
// de menos de 16 px.
export const inputClass =
  "w-full rounded-xl border border-white/40 bg-white/5 px-4 py-3 text-base md:text-sm text-text-primary placeholder:text-text-secondary outline-none transition focus:border-accent-red focus:bg-white/8 focus:ring-1 focus:ring-accent-red/40";

export const selectClass = inputClass + " appearance-none cursor-pointer pr-10";

export const labelClass = "text-xs uppercase tracking-widest text-text-secondary";

/** Asterisco de campo obligatorio: visual, con la leyenda explicándolo. */
export function Required() {
  return <span aria-hidden="true"> *</span>;
}

export function RequiredLegend() {
  return (
    <p className="mb-4 text-xs text-text-secondary">
      Los campos marcados con * son obligatorios.
    </p>
  );
}

/** Campo trampa anti-spam: oculto para humanos, los bots lo rellenan. */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
      <input type="text" name="web" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function FormError({ error }: { error?: string }) {
  return (
    <AnimatePresence>
      {error && (
        <m.p
          role="alert"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mt-4 flex items-center gap-2 text-sm text-red-400"
        >
          <AlertCircle size={14} aria-hidden="true" />
          {error}
        </m.p>
      )}
    </AnimatePresence>
  );
}

/**
 * Pantalla de éxito. Recibe el foco al montarse: el botón de enviar que
 * tenía el foco desaparece con el formulario y, sin esto, el foco caería
 * al <body> y el lector de pantalla no anunciaría nada.
 */
export function FormSuccess({
  title,
  text,
  resetLabel,
  onReset,
}: {
  title: string;
  text: string;
  resetLabel: string;
  onReset: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, []);

  return (
    <m.div
      ref={ref}
      role="status"
      tabIndex={-1}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-8 py-12 text-center outline-none"
    >
      <CheckCircle size={48} className="text-accent-orange" aria-hidden="true" />
      <h3 className="font-display text-3xl uppercase text-text-primary">{title}</h3>
      <p className="max-w-sm text-sm text-text-secondary">{text}</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-2 text-xs uppercase tracking-widest text-accent-orange hover:underline"
      >
        {resetLabel}
      </button>
    </m.div>
  );
}

/** Botón de envío. aria-disabled (y no disabled) para no perder el foco
 *  mientras se envía; el onSubmit del formulario ignora reenvíos. */
export function SubmitButton({ pending, label }: { pending: boolean; label: string }) {
  return (
    <button
      type="submit"
      aria-disabled={pending}
      className="group mt-6 inline-flex w-full items-center justify-center gap-3 gradient-primary px-8 py-4 text-sm font-semibold text-white rounded-full shadow-glow-strong transition-all hover:scale-105 aria-disabled:opacity-60 aria-disabled:cursor-not-allowed aria-disabled:hover:scale-100"
    >
      {pending ? (
        <>
          <Loader2 size={18} className="animate-spin" aria-hidden="true" />
          Enviando…
        </>
      ) : (
        <>
          <Send size={18} aria-hidden="true" />
          {label}
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
        </>
      )}
    </button>
  );
}

export const NETWORK_ERROR = "Error de conexión. Revisa tu red e inténtalo de nuevo.";

/** Lee un campo de FormData como string ("" si falta o es un fichero). */
export function field(fd: FormData, name: string): string {
  const v = fd.get(name);
  return typeof v === "string" ? v : "";
}
