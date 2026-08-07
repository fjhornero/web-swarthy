import type { NextConfig } from "next";
import { jsonLdScriptHash } from "./lib/json-ld";

// Hash en vez de nonce: el JSON-LD es el único <script> inline de la app y su
// contenido es estático por build (ver lib/json-ld.ts). El script de Plausible
// se carga por src= externo, así que solo necesita estar en la allowlist de
// hosts, no en el hash. Esto mantiene la CSP compatible con la revalidación
// estática horaria de la home (un nonce por request la forzaría a dinámica).
const csp = [
  `default-src 'self'`,
  `script-src 'self' ${jsonLdScriptHash} https://plausible.io`,
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
