"use client";

import { createContext, useContext, useState } from "react";

/**
 * Qué fachada tiene montado su reproductor. Sólo puede haber una: al pulsar
 * otra, la anterior vuelve a su portada y, al desmontarse su iframe, deja de
 * sonar. Sin esto, dos mezclas sonaban a la vez.
 */
const ActivePlayerContext = createContext<{
  activeId: string | null;
  setActiveId: (id: string) => void;
} | null>(null);

export function ActivePlayerProvider({ children }: { children: React.ReactNode }) {
  const [activeId, setActiveId] = useState<string | null>(null);
  return (
    <ActivePlayerContext.Provider value={{ activeId, setActiveId }}>
      {children}
    </ActivePlayerContext.Provider>
  );
}

export function useActivePlayer() {
  return useContext(ActivePlayerContext);
}
