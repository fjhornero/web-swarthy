import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/data";

export function Venues() {
  return (
    <section id="venues" className="relative bg-dark-primary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          overline="TRAYECTORIA"
          title={
            <>
              Salas donde ha <span className="text-gradient">pinchado</span>
            </>
          }
        />

        {/* Dos columnas ya en móvil: seis tarjetas apiladas eran dos pantallas
            de scroll antes de llegar a la música. */}
        <ul className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-3">
          {site.venues.map((v, i) => (
            <Reveal
              as="li"
              key={v.name + v.year}
              delay={i * 0.07}
              y={20}
              className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border-dark sm:aspect-video"
            >
              {v.img ? (
                <>
                  {/* El nombre y la ciudad van en texto justo debajo: la foto
                      no aporta nada nuevo al lector de pantalla. */}
                  <Image
                    src={v.img}
                    alt=""
                    fill
                    className="object-cover saturate-[0.55] brightness-90"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </>
              ) : (
                // Sin foto de la sala: en vez de un hueco, el nombre repetido
                // en contorno como en un cartel. Así la tarjeta parece una
                // decisión y no una imagen que falta.
                <>
                  <div className="absolute inset-0 bg-dark-secondary" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-x-8 -bottom-16 h-40 gradient-glow opacity-70"
                  />
                  <div
                    aria-hidden
                    className="text-outline absolute inset-0 flex -rotate-6 scale-125 flex-col justify-center gap-1 whitespace-nowrap font-display text-5xl uppercase leading-none sm:text-6xl"
                  >
                    {[0, 1, 2].map((row) => (
                      <span key={row} className={row % 2 ? "-ml-14" : "-ml-2"}>
                        {`${v.name} · `.repeat(4)}
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                </>
              )}

              <span className="absolute top-2 right-2 rounded-full border border-white/15 bg-black/50 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-sm sm:top-3 sm:right-3 sm:px-2.5 sm:py-1 sm:text-xs">
                {v.year}
              </span>

              <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4">
                <h3 className="font-display text-lg uppercase text-white sm:text-xl md:text-2xl">
                  {v.name}
                </h3>
                <div className="mt-1 text-xs uppercase tracking-[0.15em] text-accent-orange">
                  {v.city}
                </div>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
