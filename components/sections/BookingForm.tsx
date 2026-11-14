"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { submitBooking, type BookingFields } from "@/app/actions/booking";
import { BOOKING_PREFILL_EVENT, type BookingPrefill } from "@/components/BookingLink";
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
  legendClass,
  selectClass,
} from "@/components/forms/primitives";
import { track } from "@/lib/analytics";
import { todayIso } from "@/lib/dates";

interface BookingFormProps {
  /** Opciones del desplegable de formato: `option` de cada formato de lib/data.ts */
  formats: string[];
  /** Email de booking, como alternativa a rellenar el formulario */
  email: string;
}

export function BookingForm({ formats, email }: BookingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);
  // El mínimo del selector de fecha se fija tras montar: calculado en el
  // render, servidor y cliente verían días distintos (hora del build vs. hora
  // del visitante) y React avisaría de un hydration mismatch.
  const [minDate, setMinDate] = useState<string>();
  useEffect(() => {
    setMinDate(todayIso());
  }, []);

  // Los dos desplegables que un enlace de la página puede dejar elegidos
  // ("Solicitar este formato", "Contar mi evento"): van controlados para
  // poder fijarlos desde fuera. Ver BookingLink.
  const [tipoEvento, setTipoEvento] = useState("");
  const [formato, setFormato] = useState("");
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const prefill = (e as CustomEvent<BookingPrefill>).detail;
      if (prefill?.tipoEvento !== undefined) setTipoEvento(prefill.tipoEvento);
      if (prefill?.formato !== undefined) setFormato(prefill.formato);
    };
    window.addEventListener(BOOKING_PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(BOOKING_PREFILL_EVENT, onPrefill);
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
      sala: field(fd, "sala"),
      franja: field(fd, "franja"),
      presupuesto: field(fd, "presupuesto"),
      formato: field(fd, "formato"),
      mensaje: field(fd, "mensaje"),
      consentimiento: fd.get("consentimiento") === "on",
      web: field(fd, "web"),
    };

    startTransition(async () => {
      try {
        const res = await submitBooking(fields);
        setResult(res);
        if (res?.success) {
          // Sólo el hecho de que se ha enviado: nada de lo rellenado sale hacia
          // la analítica (lo promete la política de privacidad).
          track("Booking enviado");
          setTipoEvento("");
          setFormato("");
        }
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
      >
        {/* Lo que un promotor suele pedir a continuación, ya a mano. */}
        <p className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
          <Link href="/#mixes" className="text-accent-orange hover:underline">
            Escuchar sus sesiones
          </Link>
          <Link href="/press-kit" className="text-accent-orange hover:underline">
            Ver press kit y rider
          </Link>
        </p>
      </FormSuccess>
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

      {/* Tres bloques con título en vez de doce campos seguidos: primero lo
          que define la fecha (cuándo, dónde, qué), que es lo que el promotor
          tiene a mano y lo que decide si hay hueco; después quién la pide. */}
      <fieldset>
        <legend className={legendClass}>1 · El evento</legend>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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

          <SelectField
            id="booking-tipo"
            name="tipoEvento"
            label="Tipo de evento"
            required
            value={tipoEvento}
            onChange={setTipoEvento}
          >
            <option value="" disabled>Selecciona…</option>
            <option value="Club / Discoteca">Club / Discoteca</option>
            <option value="Festival">Festival</option>
            <option value="Evento privado">Evento privado</option>
            <option value="Boda">Boda</option>
            <option value="Evento corporativo">Evento corporativo</option>
            <option value="Otro">Otro</option>
          </SelectField>

          <SelectField id="booking-aforo" name="aforo" label="Aforo estimado">
            <option value="">Selecciona…</option>
            <option value="Menos de 150">Menos de 150</option>
            <option value="150 - 300">150 — 300</option>
            <option value="300 - 600">300 — 600</option>
            <option value="600 - 1.000">600 — 1.000</option>
            <option value="Más de 1.000">Más de 1.000</option>
          </SelectField>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label htmlFor="booking-sala" className={labelClass}>
              Sala o nombre del evento
            </label>
            <input
              id="booking-sala"
              name="sala"
              type="text"
              maxLength={120}
              placeholder="Sala, festival o celebración"
              className={inputClass}
            />
          </div>

          <SelectField
            id="booking-formato"
            name="formato"
            label="Formato de set"
            value={formato}
            onChange={setFormato}
          >
            <option value="">No lo sé, recomiéndame</option>
            {formats.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>

          <SelectField id="booking-franja" name="franja" label="Franja del set">
            <option value="">Selecciona…</option>
            <option value="Warm-up">Warm-up</option>
            <option value="Peak time">Peak time</option>
            <option value="Cierre">Cierre</option>
            <option value="Toda la noche">Toda la noche</option>
            <option value="Evento de día">Evento de día</option>
          </SelectField>
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className={legendClass}>2 · Tus datos</legend>
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
        </div>
      </fieldset>

      <fieldset className="mt-8">
        <legend className={legendClass}>
          3 · Detalles{" "}
          <span className="font-normal normal-case tracking-normal text-text-secondary">
            (opcional)
          </span>
        </legend>
        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="booking-presupuesto" className={labelClass}>
              Presupuesto orientativo
            </label>
            <input
              id="booking-presupuesto"
              name="presupuesto"
              type="text"
              maxLength={120}
              placeholder="Cifra, rango o «prefiero propuesta»"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="booking-mensaje" className={labelClass}>
              Mensaje adicional
            </label>
            <textarea
              id="booking-mensaje"
              name="mensaje"
              rows={3}
              maxLength={2000}
              placeholder="Line-up, estilo de la noche, equipo en cabina o cualquier detalle…"
              className={inputClass + " resize-none"}
            />
          </div>
        </div>
      </fieldset>

      <ConsentCheckbox id="booking-consent" />

      <FormError error={result?.error} />

      <SubmitButton pending={isPending} label="Solicitar fecha" />

      <p className="mt-4 text-center text-xs text-text-secondary">
        Respuesta en menos de 48h · Sin agencia · Sin intermediarios
      </p>
      {/* Hay promotores que no rellenan formularios: el correo, a la vista. */}
      <p className="mt-2 text-center text-xs text-text-secondary">
        ¿Prefieres el correo?{" "}
        <a href={`mailto:${email}`} className="text-accent-orange hover:underline">
          {email}
        </a>
      </p>
    </form>
  );
}

/** Select con chevron decorativo: `appearance-none` quita la flecha nativa y
 *  sin ella el control se confunde con un campo de texto. Con `value` y
 *  `onChange` es controlado; sin ellos, se gobierna solo. */
function SelectField({
  id,
  name,
  label,
  required,
  value,
  onChange,
  children,
}: {
  id: string;
  name: string;
  label: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  children: React.ReactNode;
}) {
  const control =
    value === undefined
      ? { defaultValue: "" }
      : { value, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => onChange?.(e.target.value) };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
        {required && <Required />}
      </label>
      <div className="relative">
        <select id={id} name={name} required={required} className={selectClass} {...control}>
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
