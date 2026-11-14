"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";

type Lang = "es" | "en";

interface Bio {
  short: string;
  /** Párrafos separados por una línea en blanco */
  long: string;
}

const LABELS: Record<Lang, { name: string; short: string; long: string; copy: string; copied: string }> = {
  es: { name: "Español", short: "Bio corta", long: "Bio larga", copy: "Copiar", copied: "Copiado" },
  en: { name: "English", short: "Short bio", long: "Long bio", copy: "Copy", copied: "Copied" },
};

/**
 * Las bios del press kit, en español e inglés y con botón de copiar. Quien
 * anuncia una fecha pega la bio en la web de la sala, en el evento de
 * Facebook o en una nota de prensa: se lo damos listo en vez de obligarle a
 * seleccionar el texto a mano, y en inglés para el promotor de fuera.
 */
export function PressBios({ bios }: { bios: Record<Lang, Bio> }) {
  const [lang, setLang] = useState<Lang>("es");
  const t = LABELS[lang];
  const bio = bios[lang];

  return (
    <div>
      <div
        role="group"
        aria-label="Idioma de la biografía"
        className="mb-6 inline-flex rounded-full border border-border-dark bg-dark-secondary p-1 print:hidden"
      >
        {(Object.keys(LABELS) as Lang[]).map((code) => (
          <button
            key={code}
            type="button"
            lang={code}
            aria-pressed={lang === code}
            onClick={() => setLang(code)}
            className={`min-h-9 rounded-full px-4 text-sm font-medium transition-colors ${
              lang === code
                ? "bg-white text-dark-primary"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {LABELS[code].name}
          </button>
        ))}
      </div>

      <div lang={lang}>
        <BioBlock title={t.short} text={bio.short} copy={t.copy} copied={t.copied} />
        <BioBlock title={t.long} text={bio.long} copy={t.copy} copied={t.copied} className="mt-10" />
      </div>
    </div>
  );
}

function BioBlock({
  title,
  text,
  copy,
  copied,
  className = "",
}: {
  title: string;
  text: string;
  copy: string;
  copied: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="font-display text-2xl uppercase md:text-3xl">{title}</h2>
        <CopyButton text={text} label={`${copy}: ${title}`} idle={copy} done={copied} />
      </div>
      <div className="mt-3 space-y-4">
        {text.split("\n\n").map((para, i) => (
          <p key={i} className="leading-relaxed text-text-secondary">
            {para}
          </p>
        ))}
      </div>
    </section>
  );
}

function CopyButton({
  text,
  label,
  idle,
  done,
}: {
  text: string;
  /** Nombre accesible completo ("Copiar: Bio corta") */
  label: string;
  idle: string;
  done: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Sin acceso al portapapeles (permiso denegado, contexto no seguro) no
      // se finge el éxito: el texto sigue ahí para seleccionarlo a mano.
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={label}
        className="inline-flex min-h-9 shrink-0 items-center gap-1.5 rounded-full border border-border-dark bg-dark-secondary px-3.5 text-xs font-semibold text-text-primary transition-colors hover:border-text-secondary print:hidden"
      >
        {copied ? (
          <Check size={13} className="text-success" aria-hidden="true" />
        ) : (
          <Copy size={13} className="text-accent-orange" aria-hidden="true" />
        )}
        {copied ? done : idle}
      </button>
      {/* La confirmación se anuncia desde fuera del botón: dentro, su
          aria-label fijo hace que muchos lectores ignoren el cambio de texto. */}
      <span role="status" className="sr-only">
        {copied ? done : ""}
      </span>
    </>
  );
}

/** Abre el diálogo de impresión, desde el que se guarda como PDF. */
export function PrintButton({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button type="button" onClick={() => window.print()} className={className}>
      {children}
    </button>
  );
}
