"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";

// Rutas absolutas ("/#about" y no "#about"): la barra también se renderiza en
// /press-kit y /privacidad, donde un ancla relativa no apunta a nada. Siguen el
// orden de las secciones de la home; el press kit, que es otra página, al final.
const links = [
  { href: "/#venues", label: "Clubs" },
  { href: "/#mixes", label: "Sets" },
  { href: "/#formats", label: "Formatos" },
  { href: "/#about", label: "Sobre Swarthy" },
  { href: "/#spotify", label: "Música" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contacto", label: "Contacto" },
  { href: "/press-kit", label: "Press kit" },
];

const sectionId = (href: string) => href.split("#")[1];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  // Sección de la home que cruza el centro de la pantalla
  const [activeSection, setActiveSection] = useState<string | null>(null);
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

  // En una página larga de una sola ruta, el enlace resaltado es lo único que
  // dice dónde se está. La franja observada es una línea a media pantalla, así
  // que sólo puede haber una sección activa a la vez.
  useEffect(() => {
    if (pathname !== "/") return;
    const sections = links
      .map((l) => document.getElementById(sectionId(l.href) ?? ""))
      .filter((el) => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const { id } = entry.target;
          if (entry.isIntersecting) setActiveSection(id);
          // Al salir hacia una zona sin enlace (hero, booking) no queda nada marcado.
          else setActiveSection((current) => (current === id ? null : current));
        }
      },
      { rootMargin: "-45% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const isCurrent = (href: string) =>
    href.startsWith("/#")
      ? pathname === "/" && activeSection === sectionId(href)
      : pathname === href;
  // "location" para un ancla dentro de la página, "page" para otra ruta.
  const ariaCurrent = (href: string) =>
    isCurrent(href) ? (href.startsWith("/#") ? "location" : "page") : undefined;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 print:hidden ${
        scrolled || open
          ? "bg-dark-primary/85 backdrop-blur-md border-b border-border-dark"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <Link href="/#top" className="flex shrink-0 items-center gap-3" aria-label="DJ Swarthy, inicio">
          {/* SVG con transparencia real: el PNG original es una silueta sobre
              blanco y, invertido, dejaba un cuadrado negro sobre el glow. */}
          <Image src="/logo-isotype-white.svg" alt="" width={36} height={36} unoptimized priority />
          <span className="font-display text-2xl tracking-wider" aria-hidden="true">
            SWARTHY
          </span>
        </Link>

        {/* Desde `lg`: ocho enlaces más el CTA no caben a 768 px (se montaban
            sobre el logo), así que la tablet en vertical usa el menú plegado. */}
        <nav className="hidden items-center gap-6 lg:flex xl:gap-8" aria-label="Principal">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={ariaCurrent(l.href)}
              className={`whitespace-nowrap text-sm transition-colors hover:text-text-primary ${
                isCurrent(l.href) ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* El CTA se queda a la vista en tablet aunque los enlaces se plieguen:
            entre 768 y 1024 px no hay barra flotante de "Contratar". */}
        <div className="flex shrink-0 items-center gap-4">
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
            className="lg:hidden -m-2 p-2 text-text-primary"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} aria-hidden="true" /> : <Menu size={24} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* max-height + scroll: dentro de una cabecera fija, un panel más alto
          que el viewport (zoom 400 %, móvil apaisado) dejaría enlaces
          inalcanzables. */}
      <div
        id="mobile-menu"
        hidden={!open}
        className="lg:hidden max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain border-t border-border-dark bg-dark-primary"
      >
        <nav className="mx-auto flex max-w-7xl flex-col px-5 py-2 md:px-8" aria-label="Principal (móvil)">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={ariaCurrent(l.href)}
              onClick={() => setOpen(false)}
              className={`border-b border-border-dark py-4 text-sm hover:text-text-primary ${
                isCurrent(l.href) ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/#booking"
            onClick={() => setOpen(false)}
            className="my-4 gradient-primary px-5 py-3 text-center text-sm font-semibold text-white rounded-full md:hidden"
          >
            Contratar
          </Link>
        </nav>
      </div>
    </header>
  );
}
