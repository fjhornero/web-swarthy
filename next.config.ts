import type { NextConfig } from "next";

// script-src permite 'unsafe-inline' a propósito: Next.js (App Router) inyecta
// sus propios <script> inline para transmitir el payload de hidratación de
// React (self.__next_f.push(...)), con contenido distinto en cada respuesta.
// No se pueden cubrir con un hash estático, y un nonce por request exigiría
// leer headers() en el layout, lo que fuerza renderizado dinámico y rompe la
// revalidación estática horaria de la home. Sin 'unsafe-inline' aquí, esos
// scripts quedan bloqueados y React nunca hidrata.
const csp = [
  `default-src 'self'`,
  `script-src 'self' 'unsafe-inline' https://plausible.io`,
  `style-src 'self' 'unsafe-inline'`,
  `img-src 'self' data:`,
  `font-src 'self'`,
  `connect-src 'self' https://plausible.io`,
  `frame-src https://www.youtube-nocookie.com https://w.soundcloud.com https://open.spotify.com`,
  `object-src 'none'`,
  `base-uri 'self'`,
  `form-action 'self'`,
  `frame-ancestors 'self'`,
  `upgrade-insecure-requests`,
].join("; ");

// Las cabeceras de seguridad se fijan aquí y sólo aquí: nginx (deploy/) las
// deja pasar tal cual. Si se duplicasen en nginx con valores distintos, el
// navegador recibiría dos y el resultado dependería de cada implementación.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()",
  },
  // HSTS: el navegador no la aplica sobre http, así que es seguro emitirla
  // siempre; nginx redirige a https antes de que llegue aquí. Un año sin
  // `preload` para poder revertir si algún subdominio dejara de servir TLS.
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Content-Security-Policy", value: csp },
];

const nextConfig: NextConfig = {
  output: "standalone",
  // No anunciar el framework en cada respuesta (X-Powered-By).
  poweredByHeader: false,
  // Miniaturas de los feeds de YouTube, SoundCloud y Spotify. Se sirven optimizadas
  // desde /_next/image (mismo origen), así que no hace falta abrir img-src.
  images: {
    remotePatterns: [
      // YouTube reparte las miniaturas entre i.ytimg.com e i1/i2/i3/i4.ytimg.com
      { protocol: "https", hostname: "*.ytimg.com", pathname: "/vi/**" },
      { protocol: "https", hostname: "*.sndcdn.com" },
      // Carátulas de Spotify (i.scdn.co) y foto de artista del oEmbed
      // (image-cdn-ak.spotifycdn.com y sus variantes por región)
      { protocol: "https", hostname: "*.scdn.co" },
      { protocol: "https", hostname: "*.spotifycdn.com" },
    ],
    // Las miniaturas de vídeos y carátulas no cambian: un día de caché evita
    // re-optimizarlas (sharp en el servidor ARM) con cada revalidación.
    minimumCacheTTL: 86400,
  },
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
