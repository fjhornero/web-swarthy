import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import "./globals.css";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { ActivePlayerProvider } from "@/components/ActivePlayer";
import { buildJsonLdString } from "@/lib/json-ld";
import { SITE_URL, SITE_NAME } from "@/lib/site";

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

// La imagen social (OpenGraph/Twitter, 1200x630) la genera app/opengraph-image.tsx
// por convención de ficheros: no se declara aquí.
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DJ Swarthy | DJ en Madrid · Contratar DJ para clubs y eventos",
    template: "%s | DJ Swarthy",
  },
  description:
    "DJ Swarthy, DJ en Madrid con 19 años de experiencia: trance, tech house, house y remember. Contrata un DJ para clubs, festivales, bodas y eventos privados.",
  applicationName: SITE_NAME,
  authors: [{ name: "DJ Swarthy", url: SITE_URL }],
  referrer: "strict-origin-when-cross-origin",
  creator: "DJ Swarthy",
  publisher: "DJ Swarthy",
  alternates: {
    canonical: SITE_URL,
  },
  category: "Music",
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "DJ Swarthy — DJ profesional en Madrid · Booking abierto",
    description:
      "DJ con 19 años de experiencia. Trance, house, tech house, nu disco y remember. Disponible para clubs, festivales y eventos privados.",
  },
  twitter: {
    card: "summary_large_image",
    title: "DJ Swarthy — DJ profesional en Madrid",
    description:
      "19 años pinchando trance, house, tech house y nu disco. Booking abierto para clubs, festivales y eventos.",
    creator: "@DjSwarthy",
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
        {/* Se construye en cada render: el nodo de eventos depende de la fecha. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJsonLdString() }}
        />
        {/* Sólo Plausible: los reproductores de YouTube/SoundCloud/Spotify son
            fachadas que no conectan con nadie hasta el clic, y las miniaturas
            se sirven desde /_next/image (mismo origen), así que preconectar
            con esos dominios en cada visita era trabajo inútil. */}
        <link rel="preconnect" href="https://plausible.io" />
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
          <ActivePlayerProvider>{children}</ActivePlayerProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
