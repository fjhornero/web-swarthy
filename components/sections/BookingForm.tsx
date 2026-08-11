"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { submitBooking, type BookingFields } from "@/app/actions/booking";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition focus:border-accent-red focus:bg-white/8 focus:ring-1 focus:ring-accent-red/40";

const selectClass = inputClass + " appearance-none cursor-pointer";

export function BookingForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;

    const fields: BookingFields = {
      nombre: fd.get("nombre") as string,
      email: fd.get("email") as string,
      telefono: fd.get("telefono") as string,
      tipoEvento: fd.get("tipoEvento") as string,
      fecha: fd.get("fecha") as string,
      ciudad: fd.get("ciudad") as string,
      aforo: fd.get("aforo") as string,
      formato: fd.get("formato") as string,
      mensaje: fd.get("mensaje") as string,
      consentimiento: fd.get("consentimiento") === "on",
      web: fd.get("web") as string,
    };

    startTransition(async () => {
      const res = await submitBooking(fields);
      setResult(res);
      if (res?.success) form.reset();
    });
  }

  if (result?.success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-8 py-12 text-center"
      >
        <CheckCircle size={48} className="text-accent-orange" />
        <h3 className="font-display text-3xl uppercase text-text-primary">
          ¡Solicitud enviada!
        </h3>
        <p className="max-w-sm text-sm text-text-secondary">
          Swarthy ha recibido tu mensaje. Te responde en menos de 48h con propuesta y disponibilidad.
        </p>
        <button
          onClick={() => setResult(null)}
          className="mt-2 text-xs uppercase tracking-widest text-accent-orange hover:underline"
        >
          Enviar otra solicitud
        </button>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 text-left"
    >
      {/* honeypot anti-spam: oculto para humanos, los bots lo rellenan */}
      <input
        type="text"
        name="web"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-nombre" className="text-xs uppercase tracking-widest text-text-secondary">
            Nombre / Empresa *
          </label>
          <input
            id="booking-nombre"
            name="nombre"
            type="text"
            required
            maxLength={120}
            autoComplete="name"
            placeholder="Tu nombre o sala"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-email" className="text-xs uppercase tracking-widest text-text-secondary">
            Email de contacto *
          </label>
          <input
            id="booking-email"
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder="promotor@sala.com"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-telefono" className="text-xs uppercase tracking-widest text-text-secondary">
            Teléfono / WhatsApp
          </label>
          <input
            id="booking-telefono"
            name="telefono"
            type="tel"
            maxLength={40}
            autoComplete="tel"
            placeholder="+34 600 000 000"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-aforo" className="text-xs uppercase tracking-widest text-text-secondary">
            Aforo estimado
          </label>
          <select id="booking-aforo" name="aforo" defaultValue="" className={selectClass}>
            <option value="">Selecciona…</option>
            <option value="Menos de 150">Menos de 150</option>
            <option value="150 - 300">150 — 300</option>
            <option value="300 - 600">300 — 600</option>
            <option value="600 - 1.000">600 — 1.000</option>
            <option value="Más de 1.000">Más de 1.000</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-tipo" className="text-xs uppercase tracking-widest text-text-secondary">
            Tipo de evento *
          </label>
          <select id="booking-tipo" name="tipoEvento" required defaultValue="" className={selectClass}>
            <option value="" disabled>Selecciona…</option>
            <option value="Club / Discoteca">Club / Discoteca</option>
            <option value="Festival">Festival</option>
            <option value="Evento privado">Evento privado</option>
            <option value="Boda">Boda</option>
            <option value="Evento corporativo">Evento corporativo</option>
            <option value="Otro">Otro</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-formato" className="text-xs uppercase tracking-widest text-text-secondary">
            Formato de set *
          </label>
          <select id="booking-formato" name="formato" required defaultValue="" className={selectClass}>
            <option value="" disabled>Selecciona…</option>
            <option value="Set Club (90-120 min)">Set Club — 90/120 min</option>
            <option value="Peak Time (2-3h)">Peak Time — 2/3h</option>
            <option value="All Night Long (5-7h)">All Night Long — 5/7h</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-fecha" className="text-xs uppercase tracking-widest text-text-secondary">
            Fecha del evento *
          </label>
          <input
            id="booking-fecha"
            name="fecha"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-ciudad" className="text-xs uppercase tracking-widest text-text-secondary">
            Ciudad *
          </label>
          <input
            id="booking-ciudad"
            name="ciudad"
            type="text"
            required
            maxLength={120}
            placeholder="Madrid, Barcelona…"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="booking-mensaje" className="text-xs uppercase tracking-widest text-text-secondary">
            Mensaje adicional
          </label>
          <textarea
            id="booking-mensaje"
            name="mensaje"
            rows={3}
            maxLength={2000}
            placeholder="Horario estimado, aforo, rider específico o cualquier detalle…"
            className={inputClass + " resize-none"}
          />
        </div>
      </div>

      <ConsentCheckbox id="booking-consent" />

      <AnimatePresence>
        {result?.error && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 text-sm text-red-400"
          >
            <AlertCircle size={14} />
            {result.error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={isPending}
        className="group mt-6 inline-flex w-full items-center justify-center gap-3 gradient-primary px-8 py-4 text-sm font-semibold text-white rounded-full shadow-glow-strong transition-all hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isPending ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Enviando…
          </>
        ) : (
          <>
            <Send size={18} />
            Solicitar fecha
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </>
        )}
      </button>

      <p className="mt-4 text-center text-xs text-text-secondary/60">
        Respuesta en menos de 48h · Sin agencia · Sin intermediarios
      </p>
    </form>
  );
}
