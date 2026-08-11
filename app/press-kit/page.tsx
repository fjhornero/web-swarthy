import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Download, Mail } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { site } from "@/lib/data";
import { SITE_URL } from "@/lib/json-ld";

export const metadata: Metadata = {
  title: "Press kit",
  description:
    "Dossier de prensa de DJ Swarthy: biografía, rider técnico, fotografías en alta resolución, logotipos y contacto de booking.",
  alternates: { canonical: `${SITE_URL}/press-kit` },
};

export default function PressKitPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-dark-primary pb-24 pt-32 md:pt-40">
        <div className="mx-auto max-w-4xl px-5 md:px-8">
          <div className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            ★ PRESS KIT
          </div>
          <h1 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl">
            Dossier de <span className="text-gradient">prensa</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            Todo lo que necesitas para anunciar una fecha con Swarthy: biografía,
            rider técnico, material gráfico y contacto directo. Si te falta algo,
            pídelo y te llega el mismo día.
          </p>

          <div className="mt-12 grid gap-10 md:grid-cols-[280px_1fr] md:gap-12">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-dark">
              <Image
                src="/images/portrait-bw.webp"
                alt="Retrato de DJ Swarthy"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 280px"
                priority
              />
            </div>

            <div>
              <h2 className="font-display text-2xl uppercase md:text-3xl">
                Bio corta
              </h2>
              <p className="mt-3 leading-relaxed text-text-secondary">
                {site.press.bioShort}
              </p>

              <h2 className="mt-10 font-display text-2xl uppercase md:text-3xl">
                Bio larga
              </h2>
              <div className="mt-3 space-y-4">
                {site.about.body.split("\n\n").map((para, i) => (
                  <p key={i} className="leading-relaxed text-text-secondary">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <section className="mt-16">
            <h2 className="font-display text-2xl uppercase md:text-3xl">
              Datos rápidos
            </h2>
            <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-border-dark bg-border-dark sm:grid-cols-2">
              <FactRow term="Nombre artístico" value="DJ Swarthy" />
              <FactRow term="Base" value="Madrid, España" />
              <FactRow
                term="Estilos"
                value="Trance · Progressive · Tech House · House · Nu Disco · Remember"
              />
              <FactRow
                term="Formatos"
                value={site.formats.map((f) => f.name).join(" · ")}
              />
              <FactRow
                term="Salas"
                value={site.venues.map((v) => v.name).join(", ")}
              />
              <FactRow term="Contacto booking" value={site.bookingEmail} />
            </dl>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl uppercase md:text-3xl">
              Rider técnico
            </h2>
            <p className="mt-3 text-sm text-text-secondary">
              Setup estándar. Si tu cabina monta otra cosa, se adapta sin
              problema — sólo hay que avisar con antelación.
            </p>
            <ul className="mt-5 space-y-3">
              {site.press.rider.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-border-dark bg-dark-secondary px-5 py-4 text-sm text-text-secondary"
                >
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full gradient-primary" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16">
            <h2 className="font-display text-2xl uppercase md:text-3xl">
              Material gráfico
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {site.press.assets.map((asset) => (
                <a
                  key={asset.href}
                  href={asset.href}
                  download
                  className="card-lift flex items-center gap-3 rounded-xl border border-border-dark bg-dark-secondary px-5 py-4 text-sm transition-colors hover:border-accent-red/50"
                >
                  <Download size={16} className="shrink-0 text-accent-orange" />
                  {asset.label}
                </a>
              ))}
            </div>
          </section>

          <section className="mt-16 rounded-2xl border border-border-dark bg-dark-secondary p-8 text-center">
            <h2 className="font-display text-3xl uppercase md:text-4xl">
              ¿Necesitas algo más?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-text-secondary">
              Fotos de directo, vídeos, logos en vectorial o una bio a medida para
              tu nota de prensa: se envía en el día.
            </p>
            <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href={`mailto:${site.bookingEmail}`}
                className="inline-flex items-center gap-2 rounded-full gradient-primary px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
              >
                <Mail size={16} />
                {site.bookingEmail}
              </a>
              <Link
                href="/#booking"
                className="inline-flex items-center gap-2 rounded-full border border-border-dark bg-dark-primary px-7 py-3.5 text-sm font-semibold text-text-primary transition-colors hover:border-text-secondary"
              >
                Solicitar una fecha
              </Link>
            </div>
          </section>

          <div className="mt-16 border-t border-border-dark pt-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-accent-orange hover:underline"
            >
              ← Volver a la portada
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function FactRow({ term, value }: { term: string; value: string }) {
  return (
    <div className="bg-dark-secondary px-5 py-4">
      <dt className="text-xs uppercase tracking-[0.15em] text-text-secondary">
        {term}
      </dt>
      <dd className="mt-1 text-sm text-text-primary">{value}</dd>
    </div>
  );
}
