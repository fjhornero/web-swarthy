import type { Metadata, Viewport } from "next";
import { Bebas_Neue, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "DJ Swarthy — Carta de presentación",
  description:
    "DJ residente, productor y selector. House, disco e italo con alma. Booking abierto en toda Europa.",
  metadataBase: new URL("https://djswarthy.es"),
  openGraph: {
    title: "DJ Swarthy",
    description: "DJ · Productor · Selector",
    url: "https://djswarthy.es",
    siteName: "DJ Swarthy",
    locale: "es_ES",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${bebas.variable} ${inter.variable}`}
    >
      <body className="bg-dark-primary text-text-primary antialiased">
        {children}
      </body>
    </html>
  );
}
