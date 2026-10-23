"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

// Rutas absolutas ("/#about" y no "#about"): la barra también se renderiza en
// /press-kit y /privacidad, donde un ancla relativa no apunta a nada.
const links = [
  { href: "/#venues", label: "Clubs" },
  { href: "/#mixes", label: "Sets" },
  { href: "/#formats", label: "Formatos" },
  { href: "/#about", label: "Sobre Swarthy" },
  { href: "/#spotify", label: "Música" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Escape cierra el menú y devuelve el foco al botón que lo abrió.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark-primary/85 backdrop-blur-md border-b border-border-dark"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="/#top" className="flex items-center gap-3" aria-label="DJ Swarthy, inicio">
          <Image
            src="/logo-isotype.png"
            alt=""
            width={36}
            height={36}
            className="invert"
            priority
          />
          <span className="font-display text-2xl tracking-wider" aria-hidden="true">
            SWARTHY
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm text-text-secondary transition-colors hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/#booking"
          className="hidden md:inline-flex items-center gap-2 gradient-primary px-5 py-2.5 text-sm font-semibold text-white rounded-full shadow-glow transition-transform hover:scale-105"
        >
          Contratar
        </Link>

        <button
          ref={toggleRef}
          type="button"
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          className="md:hidden -m-2 p-2 text-text-primary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
        </button>
      </div>

      {/* max-height + scroll: dentro de una cabecera fija, un panel más alto
          que el viewport (zoom 400 %, móvil apaisado) dejaría enlaces
          inalcanzables. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="md:hidden max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-border-dark bg-dark-primary"
      >
        <nav className="flex flex-col px-5 py-2" aria-label="Principal (móvil)">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="border-b border-border-dark py-4 text-sm text-text-secondary hover:text-text-primary"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#booking"
            onClick={() => setOpen(false)}
            className="my-4 gradient-primary px-5 py-3 text-center text-sm font-semibold text-white rounded-full"
          >
            Contratar
          </Link>
        </nav>
      </div>
    </header>
  );
}
