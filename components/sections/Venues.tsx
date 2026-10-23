import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { site } from "@/lib/data";

export function Venues() {
  return (
    <section id="venues" className="relative bg-dark-primary py-20 md:py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <SectionHeading
          overline="DONDE HA PINCHADO"
          title={
            <>
              Clubs y festivales que <span className="text-gradient">confían</span>
            </>
          }
        />

        <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {site.venues.map((v, i) => (
            <Reveal
              as="li"
              key={v.name + v.year}
              delay={i * 0.07}
              y={20}
              className="card-lift relative aspect-video overflow-hidden rounded-2xl border border-border-dark group"
            >
              {v.img ? (
                <>
                  {/* El nombre y la ciudad van en texto justo debajo: la foto
                      no aporta nada nuevo al lector de pantalla. */}
                  <Image
                    src={v.img}
                    alt=""
                    fill
                    className="object-cover saturate-[0.55] brightness-90 transition-all duration-700 group-hover:scale-105 group-hover:saturate-100 group-hover:brightness-100"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </>
              ) : (
                // Sin foto de la sala: tratamiento tipográfico en vez de una
                // imagen que rompa la coherencia de la rejilla.
                <>
                  <div className="absolute inset-0 bg-dark-secondary" />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-x-8 -bottom-16 h-40 gradient-glow opacity-70"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center font-display text-7xl uppercase text-white/5 md:text-8xl"
                  >
                    {v.name.slice(0, 2)}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                </>
              )}

              <span className="absolute top-3 right-3 rounded-full border border-white/15 bg-black/50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-sm">
                {v.year}
              </span>

              <div className="absolute bottom-4 left-4 right-4">
                <h3 className="font-display text-xl uppercase md:text-2xl text-white">
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
