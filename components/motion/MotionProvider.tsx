"use client";

import { LazyMotion, MotionConfig } from "framer-motion";

// Las features se cargan en un chunk aparte: el HTML inicial no espera a ellas.
const loadFeatures = () => import("./features").then((mod) => mod.default);

/**
 * Envuelve la app para que los componentes `m.*` tengan sus features. `strict`
 * hace fallar en desarrollo cualquier `motion.*` que se cuele (debe usarse `m`).
 * `reducedMotion="user"` respeta prefers-reduced-motion también en las
 * animaciones JS, que el bloque CSS de globals.css no alcanza.
 */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
