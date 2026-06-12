"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#about", label: "Sobre Swarthy" },
  { href: "#mixes", label: "Sets" },
  { href: "#formats", label: "Formatos" },
  { href: "#venues", label: "Clubs" },
  { href: "#faq", label: "FAQ" },
  { href: "#contacto", label: "Contacto" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-dark-primary/85 backdrop-blur-md border-b border-border-dark"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <Link href="#top" className="flex items-center gap-3">
          <Image
            src="/logo-isotype.png"
            alt="Swarthy"
            width={36}
            height={36}
            className="invert"
            priority
          />
          <span className="font-display text-2xl tracking-wider">SWARTHY</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
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
          href="#booking"
          className="hidden md:inline-flex items-center gap-2 gradient-primary px-5 py-2.5 text-sm font-semibold text-white rounded-full shadow-glow transition-transform hover:scale-105"
        >
          Contratar
        </Link>

        <button
          aria-label="Abrir menú"
          className="md:hidden text-text-primary"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border-dark bg-dark-primary">
          <nav className="flex flex-col px-5 py-2">
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
              href="#booking"
              onClick={() => setOpen(false)}
              className="my-4 gradient-primary px-5 py-3 text-center text-sm font-semibold text-white rounded-full"
            >
              Contratar
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
