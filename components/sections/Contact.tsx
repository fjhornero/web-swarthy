"use client";

import { useState, useTransition } from "react";
import { Reveal } from "@/components/motion/Reveal";
import { Overline } from "@/components/Overline";
import { submitContact, type ContactFields } from "@/app/actions/contact";
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
} from "@/components/forms/primitives";

export function Contact() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isPending) return;
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;

    const fields: ContactFields = {
      nombre: field(fd, "nombre"),
      email: field(fd, "email"),
      mensaje: field(fd, "mensaje"),
      consentimiento: fd.get("consentimiento") === "on",
      web: field(fd, "web"),
    };

    startTransition(async () => {
      try {
        const res = await submitContact(fields);
        setResult(res);
        if (res?.success) form.reset();
      } catch {
        setResult({ success: false, error: NETWORK_ERROR });
      }
    });
  }

  return (
    <section id="contacto" className="relative py-24 md:py-32 overflow-hidden">
      <div className="gradient-glow absolute inset-0 opacity-20 pointer-events-none" aria-hidden />

      <div className="relative mx-auto max-w-2xl px-6">
        <Reveal y={24} duration={0.6} margin="0px" className="mb-12 text-center">
          <Overline>CONTACTO</Overline>
          <h2 className="font-display text-4xl uppercase leading-tight text-text-primary md:text-5xl">
            ¿Tienes alguna{" "}
            <span className="text-gradient">pregunta?</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            Para cualquier consulta que no sea una contratación directa — prensa, colaboraciones, contenido o lo que necesites.
          </p>
        </Reveal>

        <Reveal y={24} duration={0.6} delay={0.1} margin="0px">
          {result?.success ? (
            <FormSuccess
              title="¡Mensaje enviado!"
              text="Swarthy ha recibido tu mensaje y te responderá lo antes posible."
              resetLabel="Enviar otro mensaje"
              onReset={() => setResult(null)}
            />
          ) : (
            <form
              onSubmit={handleSubmit}
              className="relative rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 text-left"
              aria-label="Formulario de contacto"
            >
              <Honeypot />
              <RequiredLegend />

              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-nombre" className={labelClass}>
                      Nombre<Required />
                    </label>
                    <input
                      id="contact-nombre"
                      name="nombre"
                      type="text"
                      required
                      maxLength={120}
                      autoComplete="name"
                      placeholder="Tu nombre"
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="contact-email" className={labelClass}>
                      Email<Required />
                    </label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      maxLength={200}
                      autoComplete="email"
                      placeholder="tu@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label htmlFor="contact-mensaje" className={labelClass}>
                    Mensaje<Required />
                  </label>
                  <textarea
                    id="contact-mensaje"
                    name="mensaje"
                    rows={5}
                    required
                    maxLength={2000}
                    placeholder="Cuéntanos en qué podemos ayudarte…"
                    className={inputClass + " resize-none"}
                  />
                </div>
              </div>

              <ConsentCheckbox id="contact-consent" />

              <FormError error={result?.error} />

              <SubmitButton pending={isPending} label="Enviar mensaje" />
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
