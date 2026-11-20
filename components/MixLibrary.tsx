"use client";

import { useMemo, useRef, useState } from "react";
import { MixCard } from "@/components/MixCard";
import { MIX_STYLES, type MixCardData, type MixStyle } from "@/lib/mixes";

// Cuántas sesiones se ven antes de pulsar "Ver las N": dos filas en escritorio.
// Las demás van en el HTML igualmente, plegadas.
const INITIAL_COUNT = 6;

type Filter = MixStyle | "all";

/**
 * Todas las sesiones, filtrables por estilo. Responde con audio a la primera
 * pregunta de un promotor ("¿pincha lo mío?"): quien monta una noche de
 * remember filtra y escucha sólo eso.
 */
export function MixLibrary({ mixes }: { mixes: MixCardData[] }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // Sólo se ofrecen los estilos que tienen alguna sesión publicada.
  const styles = useMemo(
    () =>
      (Object.keys(MIX_STYLES) as MixStyle[])
        .map((style) => ({ style, count: mixes.filter((mix) => mix.style === style).length }))
        .filter(({ count }) => count > 0),
    [mixes]
  );

  const filtered = filter === "all" ? mixes : mixes.filter((mix) => mix.style === filter);
  const collapsible = filtered.length > INITIAL_COUNT;

  const toggleExpanded = () => {
    // Al plegar desde el final de la lista, la página se quedaría muy por
    // debajo de la rejilla: se vuelve a su cabecera.
    if (expanded) topRef.current?.scrollIntoView({ block: "start" });
    setExpanded((value) => !value);
  };

  return (
    <div ref={topRef} className="mt-14">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h3 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-text-secondary">
          Todas las sesiones
        </h3>

        {styles.length > 1 && (
          // En móvil los filtros van en una fila que se desliza (el corte del
          // último avisa de que hay más) en vez de apilarse en tres renglones.
          <div
            role="group"
            aria-label="Filtrar sesiones por estilo"
            className="-mx-5 flex gap-2 overflow-x-auto px-5 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:p-0 [&::-webkit-scrollbar]:hidden"
          >
            <FilterChip active={filter === "all"} count={mixes.length} onClick={() => setFilter("all")}>
              Todas
            </FilterChip>
            {styles.map(({ style, count }) => (
              <FilterChip
                key={style}
                active={filter === style}
                count={count}
                onClick={() => setFilter(style)}
              >
                {MIX_STYLES[style]}
              </FilterChip>
            ))}
          </div>
        )}
      </div>

      {/* Anuncia el resultado del filtro a quien no ve cambiar la rejilla. */}
      <p role="status" className="sr-only">
        {filtered.length} {filtered.length === 1 ? "sesión" : "sesiones"}
        {filter !== "all" && ` de ${MIX_STYLES[filter]}`}
      </p>

      {/* Todas las sesiones del filtro están en el HTML, no sólo las primeras:
          así las leen los buscadores y los asistentes de IA sin pulsar "Ver
          las N". Las que pasan de INITIAL_COUNT se pliegan con `hidden`
          (display: none), y por eso sus miniaturas, que son `lazy`, no se
          descargan hasta que se despliegan. */}
      <ul className="grid gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
        {filtered.map((mix, i) => {
          const folded = !expanded && i >= INITIAL_COUNT;
          return (
            <li key={mix.key} className={folded ? "hidden" : undefined}>
              {/* La `key` cambia cuando la tarjeta se pliega: React la monta
                  de nuevo y la instancia anterior se lleva su iframe
                  (usePlayer suelta el reproductor al desmontarse). Sin esto,
                  una sesión abierta seguiría sonando dentro de una tarjeta que
                  ya no se ve, al pulsar "Ver menos" o al volver de un filtro
                  a "Todas". */}
              <MixCard key={folded ? "folded" : "shown"} mix={mix} />
            </li>
          );
        })}
      </ul>

      {collapsible && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={toggleExpanded}
            aria-expanded={expanded}
            className="inline-flex min-h-11 items-center rounded-full border border-border-dark bg-dark-primary px-6 text-sm font-semibold text-text-primary transition-colors hover:border-text-secondary"
          >
            {expanded ? "Ver menos" : `Ver las ${filtered.length} sesiones`}
          </button>
        </div>
      )}
    </div>
  );
}

// El filtro activo va en blanco y no con el gradiente: el gradiente está
// reservado para las acciones de booking.
function FilterChip({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean;
  count: number;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`inline-flex h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-sm font-medium transition-colors md:h-9 ${
        active
          ? "border-white bg-white text-dark-primary"
          : "border-border-dark bg-dark-primary/60 text-text-secondary hover:border-text-secondary hover:text-text-primary"
      }`}
    >
      {children}
      <span className="text-xs tabular-nums">{count}</span>
    </button>
  );
}
