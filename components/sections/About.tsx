import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Overline } from "@/components/Overline";
import { QuickFacts } from "@/components/QuickFacts";
import { site } from "@/lib/data";

export function About() {
  return (
    <section
      id="about"
      className="relative bg-dark-secondary py-20 md:py-28"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16 items-center">
          <Reveal x={-30} y={0} duration={0.8} margin="-100px" className="relative">
            <div className="absolute -inset-4 gradient-primary opacity-20 blur-3xl rounded-full" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-border-dark">
              <Image
                src="/images/portrait-bw.webp"
                alt="Retrato en blanco y negro de DJ Swarthy"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </Reveal>

          <Reveal x={30} y={0} duration={0.8} margin="-100px">
            <Overline>{site.about.headline}</Overline>
            {/* El espacio antes del salto es para quien extrae el texto sin
                maquetar (un buscador, un resumen automático): no ve el <br>
                y sin él leería «Madrid:19». Los espacios duros hacen que en
                tablet, donde la columna es estrecha, la segunda línea se
                parta por «19 años / en la cabina» en vez de dejar «cabina»
                sola. */}
            <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl">
              <span className="text-gradient">DJ en Madrid:</span>{" "}
              <br />
              19 años en&nbsp;la&nbsp;cabina
            </h2>
            <div className="mt-6 space-y-4">
              {/* Primero los hechos y después la historia: la frase que dice
                  quién es, dónde está y en qué salas ha pinchado (la bio corta
                  del press kit) abre la sección, en blanco para distinguirla
                  del relato. */}
              <p className="text-base leading-relaxed text-text-primary md:text-lg">
                {site.about.intro}
              </p>
              {site.about.body.split("\n\n").map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-text-secondary md:text-lg">
                  {para}
                </p>
              ))}
            </div>
            <Link
              href="/press-kit"
              className="group mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-border-dark bg-dark-primary px-6 text-sm font-semibold text-text-primary transition-colors hover:border-text-secondary"
            >
              Ver press kit y rider técnico
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
                aria-hidden="true"
              />
            </Link>
          </Reveal>
        </div>

        {/* Los mismos hechos en lista, a lo ancho y debajo de las dos
            columnas: dentro de la del texto la alargaban el doble que el
            retrato. El título es pequeño a propósito: es un bloque de la
            sección, no una sección nueva. */}
        <Reveal y={24} className="mt-12 md:mt-16">
          <h3 className="mb-4 font-sans text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
            DJ Swarthy en datos
          </h3>
          <QuickFacts />
        </Reveal>
      </div>
    </section>
  );
}
