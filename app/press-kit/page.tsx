import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Download, ExternalLink, Mail, Printer } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { NewTabHint } from "@/components/NewTabHint";
import { PressBios, PrintButton } from "@/components/PressKit";
import { site } from "@/lib/data";
import { SITE_URL, CONTENT_UPDATED_AT } from "@/lib/site";

const description =
  "Dossier de prensa de DJ Swarthy: biografía en español e inglés, rider técnico, retrato, logotipos y contacto de booking.";

// openGraph se declara aquí porque Next no lo hereda del layout en profundidad:
// sin esto, compartir /press-kit mostraría la url y el título de la portada.
export const metadata: Metadata = {
  title: "Press kit",
  description,
  alternates: { canonical: `${SITE_URL}/press-kit` },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/press-kit`,
    title: "Press kit | DJ Swarthy",
    description,
  },
};

// Un dossier sin fecha no se sabe si está vigente. CONTENT_UPDATED_AT es un
// día sin hora: se formatea en UTC para que no baile según la zona del servidor.
const updatedAt = new Intl.DateTimeFormat("es-ES", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
}).format(new Date(CONTENT_UPDATED_AT));

// Dónde escucharle: los enlaces que un promotor pone en el evento o reenvía.
const LISTEN: Record<string, string> = {
  YouTube: "Sesiones completas en vídeo",
  SoundCloud: "Sesiones y producciones",
  Spotify: "Lanzamientos",
};
const listenLinks = site.socials.filter((s) => s.label in LISTEN);

export default function PressKitPage() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-dark-primary pb-24 pt-32 md:pt-40 print:pb-0 print:pt-0">
        <div className="mx-auto max-w-4xl px-5 md:px-8 print:max-w-none print:px-0">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            <span aria-hidden="true">★ </span>PRESS KIT
          </p>
          <h1 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl">
            Dossier de <span className="text-gradient">prensa</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-secondary md:text-lg">
            Todo lo que necesitas para anunciar una fecha con Swarthy: biografía,
            rider técnico, material gráfico y contacto directo. Si te falta algo,
            pídelo y te llega el mismo día.
          </p>
          <p className="mt-3 text-xs uppercase tracking-[0.15em] text-text-secondary">
            Actualizado el {updatedAt}
          </p>

          <div className="mt-8 flex flex-wrap gap-3 print:hidden">
            {/* El rider y la bio en papel o PDF, para la sala y el técnico. */}
            <PrintButton className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border-dark bg-dark-secondary px-5 text-sm font-semibold text-text-primary transition-colors hover:border-text-secondary">
              <Printer size={16} className="text-accent-orange" aria-hidden="true" />
              Imprimir o guardar en PDF
            </PrintButton>
            <Link
              href="/#booking"
              className="inline-flex min-h-11 items-center gap-2 rounded-full gradient-primary px-5 text-sm font-semibold text-white shadow-glow transition-transform hover:scale-105"
            >
              Solicitar una fecha
            </Link>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-[280px_1fr] md:gap-12 print:mt-6 print:grid-cols-[150px_1fr] print:gap-6">
            <div className="relative aspect-[4/5] self-start overflow-hidden rounded-2xl border border-border-dark">
              <Image
                src="/images/portrait-bw.webp"
                alt="Retrato de DJ Swarthy"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 280px"
                priority
              />
            </div>

            <PressBios
              bios={{
                es: { short: site.press.bioShort, long: site.about.body },
                en: { short: site.press.bioShortEn, long: site.press.bioLongEn },
              }}
            />
          </div>

          <section className="mt-16 break-inside-avoid print:mt-8">
            <h2 className="font-display text-2xl uppercase md:text-3xl">
              Datos rápidos
            </h2>
            <dl className="mt-5 grid gap-px overflow-hidden rounded-2xl border border-border-dark bg-border-dark sm:grid-cols-2">
              <FactRow term="Nombre artístico" value="DJ Swarthy" />
              <FactRow term="Base" value="Madrid, España" />
              <FactRow term="Estilos" value={site.genres.join(" · ")} />
              <FactRow term="Formatos" value={site.formats.map((f) => f.option).join(" · ")} />
              <FactRow term="Salas" value={site.venues.map((v) => v.name).join(", ")} />
              <FactRow
                term="Contacto booking"
                value={
                  <a href={`mailto:${site.bookingEmail}`} className="hover:text-accent-orange">
                    {site.bookingEmail}
                  </a>
                }
              />
            </dl>
          </section>

          <section className="mt-16 break-inside-avoid print:mt-8">
            <h2 className="font-display text-2xl uppercase md:text-3xl">
              Escúchalo
            </h2>
            <ul className="mt-5 grid gap-3 sm:grid-cols-3">
              {listenLinks.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="card-lift flex h-full flex-col rounded-xl border border-border-dark bg-dark-secondary px-5 py-4 transition-colors hover:border-accent-red/50"
                  >
                    <span className="flex items-center justify-between gap-2 text-sm font-semibold">
                      {s.label}
                      <ExternalLink size={13} className="text-accent-orange print:hidden" aria-hidden="true" />
                    </span>
                    <span className="mt-1 text-xs text-text-secondary">{LISTEN[s.label]}</span>
                    {/* La dirección a la vista: en papel un enlace no se puede pulsar. */}
                    <span className="mt-2 break-all text-xs text-text-secondary">
                      {s.url.replace(/^https:\/\/(www\.)?/, "")}
                    </span>
                    <NewTabHint />
                  </a>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 break-inside-avoid print:mt-8">
            <h2 className="font-display text-2xl uppercase md:text-3xl">
              Rider técnico
            </h2>
            <p className="mt-3 text-sm text-text-secondary">
              Setup estándar. Si tu cabina monta otra cosa, se adapta sin
              problema — sólo hay que avisar con antelación.
            </p>
            <ul className="mt-5 space-y-3 print:space-y-1.5">
              {site.press.rider.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 rounded-xl border border-border-dark bg-dark-secondary px-5 py-4 text-sm text-text-secondary print:border-0 print:px-0 print:py-0"
                >
                  {/* print-color-adjust: sin él, el punto (un fondo) no sale en papel. */}
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-orange [print-color-adjust:exact] [-webkit-print-color-adjust:exact]" />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 print:hidden">
            <h2 className="font-display text-2xl uppercase md:text-3xl">
              Material gráfico
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-3">
              {site.press.assets.map((asset) => (
                <li
                  key={asset.label}
                  className="flex flex-col overflow-hidden rounded-2xl border border-border-dark bg-dark-secondary"
                >
                  {/* Se ve lo que se descarga: un botón que sólo dice "PNG" obliga a bajarlo para saber qué es. */}
                  <div
                    className={`relative aspect-[4/3] ${
                      asset.previewOn === "light" ? "bg-white" : "bg-dark-primary"
                    }`}
                  >
                    <Image
                      src={asset.preview}
                      alt=""
                      fill
                      unoptimized={asset.preview.endsWith(".svg")}
                      className={
                        asset.previewFit === "cover" ? "object-cover object-top" : "object-contain p-6"
                      }
                      sizes="(max-width: 640px) 100vw, 280px"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-sans text-sm font-semibold">{asset.label}</h3>
                    <p className="mt-1 text-xs text-text-secondary">{asset.note}</p>
                    <div className="mt-auto flex flex-wrap gap-2 pt-4">
                      {asset.files.map((file) => (
                        <a
                          key={file.href}
                          href={file.href}
                          download={file.download}
                          className="inline-flex min-h-9 items-center gap-1.5 rounded-full border border-border-dark bg-dark-primary px-3.5 text-xs font-semibold text-text-primary transition-colors hover:border-accent-red/50"
                        >
                          <Download size={12} className="text-accent-orange" aria-hidden="true" />
                          <span className="sr-only">Descargar {asset.label} en </span>
                          {file.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-16 rounded-2xl border border-border-dark bg-dark-secondary p-8 text-center print:hidden">
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
                <Mail size={16} aria-hidden="true" />
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

          <div className="mt-16 border-t border-border-dark pt-8 print:hidden">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-accent-orange hover:underline"
            >
              <span aria-hidden="true">←</span> Volver a la portada
            </Link>
          </div>

          {/* Pie sólo para el papel: de dónde sale la hoja y a quién escribir. */}
          <p className="mt-10 hidden border-t border-border-dark pt-4 text-sm text-text-secondary print:block">
            DJ Swarthy · djswarthy.es/press-kit · {site.bookingEmail}
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

function FactRow({ term, value }: { term: string; value: React.ReactNode }) {
  return (
    <div className="bg-dark-secondary px-5 py-4">
      <dt className="text-xs uppercase tracking-[0.15em] text-text-secondary">
        {term}
      </dt>
      <dd className="mt-1 text-sm text-text-primary">{value}</dd>
    </div>
  );
}
