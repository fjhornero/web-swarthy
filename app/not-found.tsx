import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

// Sin este fichero Next sirve su 404 por defecto, en blanco y sin marca.
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-dark-primary px-5 pt-32 pb-24 text-center md:px-8"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 gradient-glow opacity-40"
        />
        <div className="relative">
          <p className="mb-3 text-xs uppercase tracking-[0.2em] text-accent-orange">
            Error 404
          </p>
          <h1 className="font-display text-6xl uppercase leading-[0.95] md:text-8xl">
            Esta pista <span className="text-gradient">no existe</span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-base text-text-secondary md:text-lg">
            La página que buscas no está o ha cambiado de sitio. Vuelve a la
            portada para escuchar los últimos sets o pedir una fecha.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full gradient-primary px-7 py-4 text-sm font-semibold text-white shadow-glow-strong transition-transform hover:scale-105"
            >
              Volver a la portada
            </Link>
            <Link
              href="/#booking"
              className="inline-flex items-center gap-2 rounded-full border border-border-dark bg-dark-secondary/50 px-7 py-4 text-sm font-semibold text-text-primary transition-colors hover:bg-dark-secondary"
            >
              Solicitar una fecha
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
