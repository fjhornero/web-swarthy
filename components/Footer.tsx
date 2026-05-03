import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/data";

export function Footer() {
  return (
    <footer className="border-t border-border-dark bg-dark-secondary">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="#top" className="flex items-center gap-3">
              <Image
                src="/logo-isotype.png"
                alt="Swarthy"
                width={48}
                height={48}
                className="invert"
              />
              <span className="font-display text-3xl tracking-wider">
                SWARTHY
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-text-secondary">
              {site.tagline}. Booking abierto en toda Europa.
            </p>
          </div>

          <div className="md:col-span-3">
            <h3 className="text-xs uppercase tracking-[0.2em] text-text-secondary">
              Navegación
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#about" className="hover:text-accent-orange">Sobre Swarthy</Link></li>
              <li><Link href="#mixes" className="hover:text-accent-orange">Sets</Link></li>
              <li><Link href="#formats" className="hover:text-accent-orange">Formatos</Link></li>
              <li><Link href="#faq" className="hover:text-accent-orange">FAQ</Link></li>
              <li><Link href="#booking" className="hover:text-accent-orange">Booking</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <h3 className="text-xs uppercase tracking-[0.2em] text-text-secondary">
              Sígueme
            </h3>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-sm">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <Link
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text-primary hover:text-accent-orange"
                  >
                    {s.label} ↗
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href={`mailto:${site.bookingEmail}`}
              className="mt-6 inline-block text-sm text-text-secondary hover:text-accent-orange"
            >
              {site.bookingEmail}
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border-dark pt-6 text-xs uppercase tracking-[0.2em] text-text-secondary md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} DJ SWARTHY</span>
          <span>djswarthy.es</span>
        </div>
      </div>
    </footer>
  );
}
