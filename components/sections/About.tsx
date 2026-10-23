import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/Reveal";
import { Overline } from "@/components/Overline";
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
            <h2 className="font-display text-4xl uppercase leading-[0.95] md:text-6xl">
              19 años<br />
              <span className="text-gradient">en la cabina</span>
            </h2>
            <div className="mt-6 space-y-4">
              {site.about.body.split("\n\n").map((para, i) => (
                <p key={i} className="text-base leading-relaxed text-text-secondary md:text-lg">
                  {para}
                </p>
              ))}
            </div>
            <Link
              href="/press-kit"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold text-accent-orange hover:underline"
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
      </div>
    </section>
  );
}
