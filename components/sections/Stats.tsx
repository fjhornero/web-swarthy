import { Reveal } from "@/components/motion/Reveal";
import { site } from "@/lib/data";

// Por debajo de esto no se presume de sesiones publicadas: o los feeds no han
// respondido o hay tan pocas que la cifra resta en vez de sumar.
const MIN_SESSIONS = 10;

export function Stats({ sessions = 0 }: { sessions?: number }) {
  const stats = site.stats.map((s) =>
    s.live === "sessions" && sessions >= MIN_SESSIONS
      ? { value: String(sessions), label: "Sesiones para escuchar" }
      : s
  );

  return (
    <section
      aria-label="Cifras de Swarthy"
      className="relative bg-dark-primary border-y border-border-dark"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <dl className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal
              key={s.label}
              delay={i * 0.08}
              margin="-40px"
              className={`flex flex-col-reverse items-center gap-1 px-4 py-8 text-center md:py-10 ${
                i % 2 === 0 ? "border-r border-border-dark" : ""
              } md:[&:not(:last-child)]:border-r ${
                i < 2 ? "border-b border-border-dark md:border-b-0" : ""
              }`}
            >
              {/* Dentro de un <dl> cada div sólo admite pares dt→dd; el orden
                  visual (valor arriba, etiqueta abajo) lo da flex-col-reverse. */}
              <dt className="text-xs uppercase tracking-[0.15em] text-text-secondary md:text-sm">
                {s.label}
              </dt>
              <dd className="m-0 font-display text-4xl uppercase leading-none text-text-primary md:text-5xl">
                {s.value}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
