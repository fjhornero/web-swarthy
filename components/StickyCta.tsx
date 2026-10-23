"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useEffect, useState } from "react";

export function StickyCta() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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
