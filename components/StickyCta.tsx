"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";

export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Se oculta mientras los formularios o el pie están en pantalla: encima de
    // #booking tapaba el consentimiento y el botón de enviar, y en Android
    // subía con el teclado sobre el campo activo.
    const covered = new Set<Element>();
    const update = () =>
      setVisible(window.scrollY > window.innerHeight * 0.6 && covered.size === 0);

    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) covered.add(entry.target);
        else covered.delete(entry.target);
      }
      update();
    });
    document
      .querySelectorAll("#booking, #contacto, footer")
      .forEach((el) => observer.observe(el));

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-4 inset-x-4 z-40 md:hidden transition-[transform,opacity,visibility] duration-300 ${
        // `invisible` (visibility:hidden) lo saca del orden de tabulación: con
        // sólo opacity-0 el enlace seguía recibiendo el foco sin verse.
        visible
          ? "translate-y-0 opacity-100"
          : "invisible translate-y-20 opacity-0 pointer-events-none"
      }`}
    >
      <Link
        href="/#booking"
        className="flex items-center justify-center gap-2 gradient-primary px-6 py-4 text-sm font-semibold text-white rounded-full shadow-glow-strong"
      >
        <Mail size={16} aria-hidden="true" />
        Contratar a Swarthy
      </Link>
    </div>
  );
}
