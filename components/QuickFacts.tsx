import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { site } from "@/lib/data";

// Datos rápidos del artista como lista de definiciones: lo que un promotor —o
// un buscador que resume la página— tiene que poder citar sin leerse la bio:
// quién es, dónde está, qué pincha, dónde ha pinchado, qué se contrata y cómo.
// Aquí no se escribe ningún dato: todo sale de `site`, así que la lista cambia
// sola cuando cambia lib/data.ts. Mismo lenguaje visual que los "Datos
// rápidos" del press kit (app/press-kit/page.tsx), con las filas en
// `dark-primary` porque la sección que la aloja (About) ya es `dark-secondary`.
//
// Server component: importa `site`, así que no debe usarse desde un componente
// cliente (arrastraría todo lib/data.ts al bundle).
export function QuickFacts() {
  const { facts } = site.about;

  return (
    <dl className="grid gap-px overflow-hidden rounded-2xl border border-border-dark bg-border-dark sm:grid-cols-2 lg:grid-cols-3">
      <Fact term="Quién">{facts.who}</Fact>
      <Fact term="Dónde">{facts.where}</Fact>
      <Fact term="Trayectoria">{facts.career}</Fact>
      <Fact term="Estilos">{site.genres.join(" · ")}</Fact>
      <Fact term="Salas">{site.venues.map((v) => v.name).join(", ")}</Fact>
      {/* `option` es el nombre del formato con su duración, ya en una línea. */}
      <Fact term="Formatos">{site.formats.map((f) => f.option).join(" · ")}</Fact>
      {/* El séptimo dato ocupa la fila entera: suelto en una rejilla de dos o
          tres columnas dejaría una celda vacía, y lo que asoma por un hueco es
          el color de las líneas (el fondo del <dl>). */}
      <Fact term="Cómo contratar" className="sm:col-span-full">
        {/* Texto corto y flecha en línea: cabe en una línea hasta en un móvil
            de 320 px y, si algún día se parte, la flecha sigue a la última
            palabra en vez de quedarse flotando a un lado. */}
        <Link href="/#booking" className="text-accent-orange hover:underline">
          Con el formulario de booking
          <ArrowRight size={14} className="ml-1.5 inline" aria-hidden="true" />
        </Link>
      </Fact>
    </dl>
  );
}

function Fact({
  term,
  children,
  className = "",
}: {
  term: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-dark-primary px-5 py-4 ${className}`}>
      <dt className="text-xs uppercase tracking-[0.15em] text-text-secondary">
        {term}
      </dt>
      <dd className="mt-1 text-sm text-text-primary">{children}</dd>
    </div>
  );
}
