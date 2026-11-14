"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { track } from "@/lib/analytics";

export interface ActivePlayer {
  id: string;
  /** Lo que se ha puesto a sonar: lo enseña la barra flotante (NowPlaying) */
  title: string;
}

/**
 * Qué fachada tiene montado su reproductor. Sólo puede haber una: al pulsar
 * otra, la anterior vuelve a su portada y, al desmontarse su iframe, deja de
 * sonar. Sin esto, dos mezclas sonaban a la vez.
 */
const ActivePlayerContext = createContext<{
  active: ActivePlayer | null;
  play: (player: ActivePlayer) => void;
  /** Cierra el reproductor `id`. No hace nada si entretanto ya suena otro. */
  stop: (id: string) => void;
} | null>(null);

export function ActivePlayerProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ActivePlayer | null>(null);
  const stop = useCallback(
    (id: string) => setActive((current) => (current?.id === id ? null : current)),
    []
  );
  const value = useMemo(() => ({ active, play: setActive, stop }), [active, stop]);

  return <ActivePlayerContext.Provider value={value}>{children}</ActivePlayerContext.Provider>;
}

export function useActivePlayer() {
  return useContext(ActivePlayerContext);
}

/**
 * Estado de un reproductor concreto dentro del grupo "sólo uno a la vez".
 * `playerRef` va en el contenedor del iframe y `id` en su atributo
 * `data-player`, que es el ancla con la que NowPlaying lo localiza.
 */
export function usePlayer(title: string) {
  const id = useId();
  const group = useContext(ActivePlayerContext);
  // Fuera del provider (no debería pasar) cada reproductor se gobierna solo.
  const [localPlaying, setLocalPlaying] = useState(false);
  const playing = group ? group.active?.id === id : localPlaying;
  const playerRef = useRef<HTMLDivElement>(null);

  // El botón enfocado desaparece al montar el reproductor: se pasa el foco al
  // iframe para que un usuario de teclado no lo pierda.
  useEffect(() => {
    if (playing) playerRef.current?.querySelector("iframe")?.focus();
  }, [playing]);

  // Si el reproductor se desmonta mientras suena (la rejilla de sesiones lo
  // hace al cambiar de filtro), su iframe se va con él: hay que soltar también
  // el estado global, o la barra flotante anunciaría algo que ya no existe.
  const stop = group?.stop;
  useEffect(() => () => stop?.(id), [stop, id]);

  const play = () => {
    track("Reproducir", { titulo: title });
    if (group) group.play({ id, title });
    else setLocalPlaying(true);
  };

  return { id, playing, play, playerRef };
}
