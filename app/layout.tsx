import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";

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

const SITE_URL = "https://djswarthy.es";
const SITE_NAME = "DJ Swarthy";
const OG_IMAGE = "/images/portrait-bw.png";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "DJ Swarthy — DJ Madrid · Trance, House, Tech House y Nu Disco · Booking",
    template: "%s | DJ Swarthy",
  },
  description:
    "DJ Swarthy: 19 años pinchando trance, progressive, tech house, house, nu disco y remember. DJ profesional en Madrid disponible para clubs, festivales y eventos privados. Contratación directa.",
  applicationName: SITE_NAME,
  authors: [{ name: "DJ Swarthy", url: SITE_URL }],
  generator: "Next.js",
  keywords: [
    "DJ Swarthy",
    "DJ Madrid",
    "contratar DJ Madrid",
    "DJ trance Madrid",
    "DJ progressive Madrid",
    "DJ tech house Madrid",
    "DJ house Madrid",
    "DJ remember Madrid",
    "DJ nu disco",
    "booking DJ España",
    "DJ profesional Madrid",
    "DJ eventos privados",
    "DJ bodas Madrid",
    "DJ fiestas Madrid",
    "DJ residente",
    "DJ todo terreno",
    "Music is the answer",
  ],
  referrer: "origin-when-cross-origin",
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
    images: [
      {
        url: OG_IMAGE,
        width: 868,
        height: 1209,
        alt: "DJ Swarthy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DJ Swarthy — DJ profesional en Madrid",
    description:
      "19 años pinchando trance, house, tech house y nu disco. Booking abierto para clubs, festivales y eventos.",
    images: [OG_IMAGE],
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
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/logo-isotype.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "MusicGroup",
      "@id": `${SITE_URL}#artist`,
      name: "DJ Swarthy",
      alternateName: ["Swarthy", "Dj Swarthy"],
      url: SITE_URL,
      image: `${SITE_URL}${OG_IMAGE}`,
      description:
        "DJ con más de 19 años pinchando trance, progressive, tech house, house, nu disco y remember. Booking abierto en Madrid y toda España.",
      genre: [
        "Trance",
        "Progressive",
        "Tech House",
        "House",
        "Nu Disco",
        "Remember",
      ],
      sameAs: [
        "https://soundcloud.com/dj_swarthy",
        "https://www.youtube.com/@dj-swarthy",
        "https://www.facebook.com/profile.php?id=100063486909762",
        "https://x.com/DjSwarthy",
      ],
      address: {
        "@type": "PostalAddress",
        addressLocality: "Madrid",
        addressRegion: "Madrid",
        addressCountry: "ES",
      },
      areaServed: [
        { "@type": "City", name: "Madrid" },
        { "@type": "Country", name: "España" },
      ],
      email: "djswarthy@gmail.com",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: "es-ES",
      publisher: { "@id": `${SITE_URL}#artist` },
    },
    {
      "@type": "Service",
      name: "Contratación DJ Swarthy",
      provider: { "@id": `${SITE_URL}#artist` },
      areaServed: { "@type": "Country", name: "España" },
      serviceType: "DJ Booking",
      description:
        "Servicio de DJ profesional para clubs, festivales, eventos privados y bodas en Madrid y resto de España.",
    },
  ],
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
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://w.soundcloud.com" />
        <link rel="dns-prefetch" href="https://i.ytimg.com" />
      </head>
      <body className="bg-dark-primary text-text-primary antialiased">
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
