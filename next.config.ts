import type { NextConfig } from "next";

// script-src permite 'unsafe-inline' a propósito: Next.js (App Router) inyecta
// sus propios <script> inline para transmitir el payload de hidratación de
// React (self.__next_f.push(...)), con contenido distinto en cada respuesta.
// No se pueden cubrir con un hash estático, y un nonce por request exigiría
// leer headers() en el layout, lo que fuerza renderizado dinámico y rompe la
// revalidación estática horaria de la home. Sin 'unsafe-inline' aquí, esos
// scripts quedan bloqueados y React nunca hidrata (la página se queda en
// negro: las animaciones de Framer Motion arrancan en opacity:0 y solo el JS
// del cliente las anima a visible).
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://plausible.io`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data:`,
  `font-src 'self'`,
  `connect-src 'self' https://plausible.io`,
  `frame-src https://www.youtube-nocookie.com https://w.soundcloud.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'self'`,
  `upgrade-insecure-requests`,
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
