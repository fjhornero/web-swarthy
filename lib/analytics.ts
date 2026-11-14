// Eventos personalizados de Plausible (el script se carga en app/layout.tsx).
// Miden el embudo: cuánta gente le da al play y cuánta acaba pidiendo fecha.
// Para verlos en el panel hay que dar de alta cada nombre de evento como
// objetivo ("Goal"); mientras tanto se envían y Plausible los ignora.

type Plausible = (event: string, options?: { props?: Record<string, string> }) => void;

/** No hace nada si el script no ha cargado (bloqueador de anuncios, desarrollo). */
export function track(event: string, props?: Record<string, string>): void {
  if (typeof window === "undefined") return;
  const plausible = (window as Window & { plausible?: Plausible }).plausible;
  plausible?.(event, props ? { props } : undefined);
}
