import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ActivePlayerProvider } from "@/components/ActivePlayer";
import { NowPlaying } from "@/components/NowPlaying";
import { baseNodes, buildJsonLdString } from "@/lib/json-ld";
import {
  SITE_URL,
  SITE_NAME,
  OPEN_GRAPH_BASE,
  TWITTER_BASE,
  GOOGLE_SITE_VERIFICATION,
  BING_SITE_VERIFICATION,
} from "@/lib/site";

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Un solo título y una sola descripción para el buscador y para las tarjetas
// de redes: quien recibe el enlace compartido lee lo mismo que quien lo
// encuentra buscando.
const title = "DJ Swarthy | DJ de trance y progressive en Madrid · Booking";
const description =
  "DJ Swarthy, DJ y productor en Madrid con más de 19 años en cabina: trance, progressive, tech house y remember. Pide propuesta para tu sala o evento.";

// Verificación de propiedad en Search Console y Bing: sólo se emite la
// etiqueta del token que esté relleno en lib/site.ts.
const verification: NonNullable<Metadata["verification"]> = {
  ...(GOOGLE_SITE_VERIFICATION && { google: GOOGLE_SITE_VERIFICATION }),
  ...(BING_SITE_VERIFICATION && { other: { "msvalidate.01": BING_SITE_VERIFICATION } }),
};

// La imagen social (OpenGraph/Twitter, 1200x630) la genera app/opengraph-image.tsx
// por convención de ficheros: no se declara aquí.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: title,
    template: "%s | DJ Swarthy",
  },
  description,
  applicationName: SITE_NAME,
  authors: [{ name: "DJ Swarthy", url: SITE_URL }],
  referrer: "strict-origin-when-cross-origin",
  creator: "DJ Swarthy",
  publisher: "DJ Swarthy",
  // "./" se resuelve contra la ruta de cada página (con metadataBase): una
  // página nueva sin canónica propia se declara a sí misma. Con la URL de la
  // portada fija aquí, declararía que su original es la home.
  alternates: {
    canonical: "./",
  },
  category: "Music",
  // Next no mezcla `openGraph` ni `twitter` con los de una página: los
  // sustituye enteros. Las rutas que declaran los suyos parten de las mismas
  // bases (lib/site.ts) para no perder og:site_name, og:locale ni la cuenta.
  openGraph: {
    ...OPEN_GRAPH_BASE,
    url: SITE_URL,
    title,
    description,
  },
  twitter: {
    ...TWITTER_BASE,
    title,
    description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
    ],
    shortcut: "/favicon.ico",
    apple: { url: "/apple-touch-icon.png", sizes: "180x180" },
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${bebas.variable} ${inter.variable}`}
    >
      <head>
        {/* Sólo la entidad (artista y sitio), que vale para todas las rutas.
            Lo que depende de la página (servicio, FAQ, fechas, migas) lo
            emite cada página en su propio script: desde aquí no se sabe qué
            ruta se pinta sin leer headers(), y eso volvería dinámica la home. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJsonLdString(baseNodes()) }}
        />
        {/* Sólo Plausible: los reproductores de YouTube/SoundCloud/Spotify son
            fachadas que no conectan con nadie hasta el clic, y las miniaturas
            se sirven desde /_next/image (mismo origen), así que preconectar
            con esos dominios en cada visita era trabajo inútil. */}
        <link rel="preconnect" href="https://plausible.io" />
        {/* Sin JavaScript nada hidrata y los bloques de Reveal se quedan como
            los sirve el servidor, con `opacity:0;transform:…` en línea: la
            portada en blanco del hero para abajo. Este estilo sólo se aplica
            cuando no hay scripts y los deja a la vista. El `;` del selector
            evita tocar un `opacity:0.5`. La CSP lo admite: style-src lleva
            'unsafe-inline' (next.config.ts). */}
        <noscript>
          <style>{`[style*="opacity:0;"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="bg-dark-primary text-text-primary antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-dark-secondary focus:px-5 focus:py-3 focus:text-sm focus:text-text-primary"
        >
          Saltar al contenido
        </a>
        <script
          defer
          data-domain="djswarthy.es"
          src="https://plausible.io/js/script.js"
        />
        <MotionProvider>
          <ActivePlayerProvider>
            {/* Antes del contenido: cuando aparece, sus dos botones quedan al
                principio del orden de tabulación y no detrás del pie. */}
            <NowPlaying />
            {children}
          </ActivePlayerProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
