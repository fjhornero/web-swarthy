/** Etiqueta pequeña sobre cada título de sección ("★ FORMATOS"). La estrella es
 *  decorativa y se oculta a los lectores de pantalla. */
export function Overline({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange ${className}`}>
      <span aria-hidden="true">★ </span>
      {children}
    </p>
  );
}
