"use client";

import { useEffect } from "react";
import Link from "next/link";

// Límite de error del App Router: si una sección revienta en el cliente, el
// usuario ve esto en lugar de una pantalla en blanco.
export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main
      id="main-content"
      className="flex min-h-screen flex-col items-center justify-center bg-dark-primary px-5 py-24 text-center md:px-8"
    >
      <p className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
        Algo ha fallado
      </p>
      <h1 className="font-display text-5xl uppercase leading-[0.95] md:text-7xl">
        Se ha cortado <span className="text-gradient">el sonido</span>
      </h1>
      <p className="mx-auto mt-6 max-w-md text-base text-text-secondary md:text-lg">
        Ha ocurrido un error inesperado al cargar la página. Puedes volver a
        intentarlo o ir a la portada.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-full gradient-primary px-7 py-4 text-sm font-semibold text-white shadow-glow-strong transition-transform hover:scale-105"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-border-dark bg-dark-secondary/50 px-7 py-4 text-sm font-semibold text-text-primary transition-colors hover:bg-dark-secondary"
        >
          Volver a la portada
        </Link>
      </div>
    </main>
  );
}
