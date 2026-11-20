import Image from "next/image";
import Link from "next/link";
import { NewTabHint } from "@/components/NewTabHint";
import { site } from "@/lib/data";
import { sentenceList } from "@/lib/site";

const footerLinks = [
  { href: "/#venues", label: "Clubs" },
  { href: "/#mixes", label: "Sets" },
  { href: "/#formats", label: "Formatos" },
  { href: "/#about", label: "Sobre Swarthy" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#booking", label: "Booking" },
  { href: "/press-kit", label: "Press kit" },
];

export function Footer() {
  return (
    <footer className="border-t border-border-dark bg-dark-secondary print:hidden">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/#top" className="flex items-center gap-3" aria-label="DJ Swarthy, inicio">
              <Image src="/logo-isotype-white.svg" alt="" width={48} height={48} unoptimized />
              <span className="font-display text-3xl tracking-wider" aria-hidden="true">
                SWARTHY
              </span>
            </Link>
            {/* Los estilos salen de la lista única de lib/data.ts: escritos a
                mano se quedaron sin «progressive» cuando entró en ella. */}
            <p className="mt-4 max-w-xs text-sm text-text-secondary">
              DJ profesional en Madrid. {sentenceList(site.genres)}.
              Booking abierto para clubs, festivales y eventos privados.
            </p>
            <p className="mt-3 text-xs text-text-secondary">
              <span className="uppercase tracking-[0.2em]">Madrid</span> · España
            </p>
          </div>

          <nav className="md:col-span-3" aria-labelledby="footer-nav-title">
            <h2 id="footer-nav-title" className="text-xs uppercase tracking-[0.2em] text-text-secondary">
              Navegación
            </h2>
            {/* py-1.5 en cada enlace: en móvil el dedo necesita más que la
                altura de una línea de texto. */}
            <ul className="mt-2 text-sm">
              {footerLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="inline-block py-1.5 hover:text-accent-orange">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="md:col-span-4" aria-labelledby="footer-social-title">
            <h2 id="footer-social-title" className="text-xs uppercase tracking-[0.2em] text-text-secondary">
              Sígueme
            </h2>
            <ul className="mt-2 grid grid-cols-2 gap-x-2 text-sm">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1.5 text-text-primary hover:text-accent-orange"
                  >
                    {s.label} <span aria-hidden="true">↗</span>
                    <NewTabHint />
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`mailto:${site.bookingEmail}`}
              className="mt-4 inline-block py-1.5 text-sm text-text-secondary hover:text-accent-orange"
            >
              {site.bookingEmail}
            </Link>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border-dark pt-6 text-xs uppercase tracking-[0.2em] text-text-secondary md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} DJ SWARTHY</span>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/privacidad" className="inline-block py-1.5 hover:text-accent-orange">
              Privacidad
            </Link>
            <span>djswarthy.es</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
