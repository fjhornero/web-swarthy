"use client";

import { useEffect, useState, useTransition } from "react";
import { ChevronDown } from "lucide-react";
import { submitBooking, type BookingFields } from "@/app/actions/booking";
import { ConsentCheckbox } from "@/components/ConsentCheckbox";
import {
  FormError,
  FormSuccess,
  Honeypot,
  NETWORK_ERROR,
  Required,
  RequiredLegend,
  SubmitButton,
  field,
  inputClass,
  labelClass,
  selectClass,
} from "@/components/forms/primitives";
import { todayIso } from "@/lib/dates";

export function BookingForm() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  // El mínimo del selector de fecha se fija tras montar: calculado en el
  // render, servidor y cliente verían días distintos (hora del build vs. hora
  // del visitante) y React avisaría de un hydration mismatch.
  const [minDate, setMinDate] = useState<string>();
  useEffect(() => {
    setMinDate(todayIso());
  }, []);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;
    const fd = new FormData(e.currentTarget);

    const fields: BookingFields = {
      nombre: field(fd, "nombre"),
      email: field(fd, "email"),
      telefono: field(fd, "telefono"),
      tipoEvento: field(fd, "tipoEvento"),
      fecha: field(fd, "fecha"),
      ciudad: field(fd, "ciudad"),
      aforo: field(fd, "aforo"),
      formato: field(fd, "formato"),
      mensaje: field(fd, "mensaje"),
      consentimiento: fd.get("consentimiento") === "on",
      web: field(fd, "web"),
    };

    startTransition(async () => {
      try {
        setResult(await submitBooking(fields));
      } catch {
        // La action ha fallado antes de responder (red caída, 500): sin esto
        // el usuario se quedaría sin feedback.
        setResult({ success: false, error: NETWORK_ERROR });
      }
    });
  }

  if (result?.success) {
    return (
      <FormSuccess
        title="¡Solicitud enviada!"
        text="Swarthy ha recibido tu mensaje. Te responde en menos de 48h con propuesta y disponibilidad."
        resetLabel="Enviar otra solicitud"
        onReset={() => setResult(null)}
      />
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 text-left"
      aria-label="Solicitud de contratación"
    >
      <Honeypot />
      <RequiredLegend />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-nombre" className={labelClass}>
            Nombre / Empresa<Required />
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
          <label htmlFor="booking-email" className={labelClass}>
            Email de contacto<Required />
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
          <label htmlFor="booking-telefono" className={labelClass}>
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

        <SelectField id="booking-aforo" name="aforo" label="Aforo estimado">
          <option value="">Selecciona…</option>
          <option value="Menos de 150">Menos de 150</option>
          <option value="150 - 300">150 — 300</option>
          <option value="300 - 600">300 — 600</option>
          <option value="600 - 1.000">600 — 1.000</option>
          <option value="Más de 1.000">Más de 1.000</option>
        </SelectField>

        <SelectField id="booking-tipo" name="tipoEvento" label="Tipo de evento" required>
          <option value="" disabled>Selecciona…</option>
          <option value="Club / Discoteca">Club / Discoteca</option>
          <option value="Festival">Festival</option>
          <option value="Evento privado">Evento privado</option>
          <option value="Boda">Boda</option>
          <option value="Evento corporativo">Evento corporativo</option>
          <option value="Otro">Otro</option>
        </SelectField>

        <SelectField id="booking-formato" name="formato" label="Formato de set" required>
          <option value="" disabled>Selecciona…</option>
          <option value="Set Club (90-120 min)">Set Club — 90/120 min</option>
          <option value="Peak Time (2-3h)">Peak Time — 2/3h</option>
          <option value="All Night Long (5-7h)">All Night Long — 5/7h</option>
        </SelectField>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-fecha" className={labelClass}>
            Fecha del evento<Required />
          </label>
          <input
            id="booking-fecha"
            name="fecha"
            type="date"
            required
            min={minDate}
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="booking-ciudad" className={labelClass}>
            Ciudad<Required />
          </label>
          <input
            id="booking-ciudad"
            name="ciudad"
            type="text"
            required
            maxLength={120}
            autoComplete="address-level2"
            placeholder="Madrid, Barcelona…"
            className={inputClass}
          />
        </div>

        <div className="flex flex-col gap-1.5 sm:col-span-2">
          <label htmlFor="booking-mensaje" className={labelClass}>
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

      <FormError error={result?.error} />

      <SubmitButton pending={isPending} label="Solicitar fecha" />

      <p className="mt-4 text-center text-xs text-text-secondary">
        Respuesta en menos de 48h · Sin agencia · Sin intermediarios
      </p>
    </form>
  );
}

/** Select con chevron decorativo: `appearance-none` quita la flecha nativa y
 *  sin ella el control se confunde con un campo de texto. */
function SelectField({
  id,
  name,
  label,
  required,
  children,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <Required />}
      </label>
      <div className="relative">
        <select id={id} name={name} required={required} defaultValue="" className={selectClass}>
          {children}
        </select>
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary"
        />
      </div>
    </div>
  );
}
