"use client";

import { m } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Elemento HTML que se renderiza (div por defecto) */
  as?: "div" | "li" | "article" | "figure";
  /** Retardo en segundos */
  delay?: number;
  duration?: number;
  /** Desplazamiento inicial en px (positivo = entra desde abajo / desde la derecha) */
  y?: number;
  x?: number;
  /** Margen del viewport a partir del cual se dispara */
  margin?: string;
};

/**
 * Animación de entrada al hacer scroll. Es el único componente cliente que
 * necesitan las secciones puramente presentacionales: el resto de su árbol
 * (textos de lib/data.ts, iconos, enlaces) se renderiza en el servidor y no
 * viaja en el bundle de JavaScript.
 */
export function Reveal({
  children,
  className,
  as = "div",
  delay = 0,
  duration = 0.5,
  y = 16,
  x = 0,
  margin = "-50px",
}: RevealProps) {
  const Component = m[as];
  return (
    <Component
      initial={{ opacity: 0, y, x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </Component>
  );
}
