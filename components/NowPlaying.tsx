"use client";

import { useEffect, useState } from "react";
import { Play, X } from "lucide-react";
import { useActivePlayer } from "@/components/ActivePlayer";

const playerSelector = (id: string) => `[data-player="${CSS.escape(id)}"]`;

/**
 * Barra flotante del reproductor abierto. Un promotor le da al play y sigue
 * bajando a leer formatos y FAQ: la música sigue sonando (el iframe sigue
 * montado), pero sin esto no tenía forma de pararla ni de volver a ella sin
 * deshacer el scroll. Sólo aparece cuando el reproductor queda fuera de la
 * pantalla, y va bajo la cabecera para no pisar la barra de "Contratar".
 *
 * No dice "sonando": el reproductor vive en un iframe de terceros y la web no
 * sabe si el visitante lo ha pausado dentro.
 */
export function NowPlaying() {
  const player = useActivePlayer();
  const active = player?.active ?? null;
  // Id del reproductor que está fuera de pantalla. Guardar el id (y no un
  // booleano) evita que el estado de un reproductor anterior se cuele en el
  // siguiente mientras el observer del nuevo aún no ha respondido.
  const [offscreenId, setOffscreenId] = useState<string | null>(null);
  const activeId = active?.id;

  useEffect(() => {
    if (!activeId) return;
    const el = document.querySelector(playerSelector(activeId));
    if (!el) return;

    // Si llegan varias entradas juntas manda la última, que es el estado actual.
    const observer = new IntersectionObserver((entries) =>
      setOffscreenId(entries[entries.length - 1].isIntersecting ? null : activeId)
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      // Si el mismo reproductor se reabre después, no debe heredar el
      // "fuera de pantalla" de la vez anterior.
      setOffscreenId(null);
    };
  }, [activeId]);

  if (!player || !active || offscreenId !== active.id) return null;

  const goToPlayer = () => {
    const el = document.querySelector(playerSelector(active.id));
    el?.scrollIntoView({ block: "center" });
    // Al llegar, la barra se desmonta con este botón dentro: el foco pasa al
    // reproductor para que no caiga al <body>.
    el?.querySelector("iframe")?.focus({ preventScroll: true });
  };

  const close = () => {
    const { id } = active;
    player.stop(id);
    // Este botón desaparece con la barra: el foco pasa a la portada que
    // vuelve a ocupar el sitio del reproductor, sin mover el scroll.
    requestAnimationFrame(() =>
      document.querySelector<HTMLElement>(playerSelector(id))?.focus({ preventScroll: true })
    );
  };

  return (
    // El contenedor replica el de la cabecera para que la barra quede alineada
    // con el botón "Contratar"; no captura clics fuera de la propia barra.
    <div
      role="region"
      aria-label="Reproductor abierto"
      className="fade-up pointer-events-none fixed inset-x-0 top-[4.75rem] z-40 mx-auto flex max-w-7xl justify-end px-4 md:px-8 print:hidden"
    >
      <div className="pointer-events-auto flex w-full items-center gap-2 rounded-full border border-border-dark bg-dark-secondary/95 py-1.5 pl-4 pr-1.5 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.8)] backdrop-blur-md md:w-96">
        <Play size={13} className="shrink-0 fill-accent-orange text-accent-orange" aria-hidden="true" />
        <p className="min-w-0 flex-1 truncate text-sm text-text-primary">{active.title}</p>
        <button
          type="button"
          onClick={goToPlayer}
          className="inline-flex h-9 shrink-0 items-center rounded-full px-3 text-xs font-semibold uppercase tracking-[0.15em] text-accent-orange transition-colors hover:bg-dark-tertiary"
        >
          Ver<span className="sr-only"> el reproductor</span>
        </button>
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar el reproductor"
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-text-secondary transition-colors hover:bg-dark-tertiary hover:text-text-primary"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
