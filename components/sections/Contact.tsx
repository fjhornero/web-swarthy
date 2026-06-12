"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { submitContact, type ContactFields } from "@/app/actions/contact";

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-text-primary placeholder:text-text-secondary/50 outline-none transition focus:border-accent-red focus:bg-white/8 focus:ring-1 focus:ring-accent-red/40";

export function Contact() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ success: boolean; error?: string } | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const form = e.currentTarget;

    const fields: ContactFields = {
      nombre: fd.get("nombre") as string,
      email: fd.get("email") as string,
      mensaje: fd.get("mensaje") as string,
    };

    startTransition(async () => {
      const res = await submitContact(fields);
      setResult(res);
      if (res?.success) form.reset();
    });
  }

  return (
    <section id="contacto" className="relative py-24 md:py-32 overflow-hidden">
      <div className="gradient-glow absolute inset-0 opacity-20 pointer-events-none" />

      <div className="relative mx-auto max-w-2xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-accent-red/30 bg-accent-red/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-accent-red">
            Contacto
          </span>
          <h2 className="font-display text-4xl uppercase leading-tight text-text-primary md:text-5xl">
            ¿Tienes alguna{" "}
            <span className="text-gradient">pregunta?</span>
          </h2>
          <p className="mt-4 text-text-secondary">
            Para cualquier consulta que no sea una contratación directa — prensa, colaboraciones, contenido o lo que necesites.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {result?.success ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 px-8 py-12 text-center"
            >
              <CheckCircle size={48} className="text-accent-orange" />
              <h3 className="font-display text-3xl uppercase text-text-primary">
                ¡Mensaje enviado!
              </h3>
              <p className="max-w-sm text-sm text-text-secondary">
                Swarthy ha recibido tu mensaje y te responderá lo antes posible.
              </p>
              <button
                onClick={() => setResult(null)}
                className="mt-2 text-xs uppercase tracking-widest text-accent-orange hover:underline"
              >
                Enviar otro mensaje
              </button>
            </motion.div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8 text-left"
            >
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-widest text-text-secondary">
                      Nombre *
                    </label>
                    <input
                      name="nombre"
                      type="text"
                      required
                      placeholder="Tu nombre"
                      className={inputClass}
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs uppercase tracking-widest text-text-secondary">
                      Email *
                    </label>
                    <input
                      name="email"
                      type="email"
                      required
                      placeholder="tu@email.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs uppercase tracking-widest text-text-secondary">
                    Mensaje *
                  </label>
                  <textarea
                    name="mensaje"
                    rows={5}
                    required
                    placeholder="Cuéntanos en qué podemos ayudarte…"
                    className={inputClass + " resize-none"}
                  />
                </div>
              </div>

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
                    Enviar mensaje
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
