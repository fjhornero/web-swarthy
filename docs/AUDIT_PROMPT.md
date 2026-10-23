# Prompt: auditoría y mejora con agentes

Prompt reutilizable para lanzar, desde Claude Code, una auditoría completa de esta web
con agentes especializados en paralelo y aplicar las mejoras en una rama con PR.
Copiar el bloque de abajo tal cual en una sesión nueva (o adaptar la lista de
dimensiones si sólo interesa una).

---

```text
Haz una auditoría profunda del repositorio web-swarthy (Next.js 15 App Router, React 19,
Tailwind v4, Framer Motion; landing de un DJ con dos formularios que van a Telegram y
despliegue en un servidor propio con nginx + Docker). Lee primero CLAUDE.md: documenta
la arquitectura, las decisiones ya tomadas y lo que NO debe cambiar (estética fijada,
'unsafe-inline' en la CSP justificado, agenda y testimonios vacíos hasta tener datos
reales, fachadas de reproductores que no cargan iframes hasta el clic).

FASE 1 — Orientación (tú, sin agentes)
- Ejecuta `graphify query "<pregunta>"` si existe graphify-out/graph.json.
- Lee el código completo (es pequeño): app/, components/, lib/, tests/, next.config.ts,
  Dockerfile, docker-compose.yml, deploy/, .github/workflows/.
- Lanza `npm run lint`, `npm run typecheck`, `npm test` y `npm run build`; anota los
  tamaños de "First Load JS" como línea base.

FASE 2 — Agentes revisores en paralelo (sólo lectura; que NO editen nada)
Lanza en un mismo mensaje cuatro o cinco agentes, cada uno con su brief, la lista
exacta de ficheros, las decisiones que no deben discutir, y este formato de salida:
lista ordenada P0→P3 con fichero:línea, problema en una frase, escenario concreto de
fallo o coste, y el fix exacto (código si es corto). Que descarten lo que no puedan
confirmar en el código.
  1. Seguridad (ecc:security-reviewer): server actions (validación en runtime, payloads
     que no son string, inyección en el HTML de Telegram), rate limit y cabeceras de
     confianza, CSP y cabeceras de seguridad frente a lo que realmente carga la página,
     timeouts en fetch salientes, parsers de feeds (ReDoS, URLs sin validar),
     secretos en Docker/CI, hardening del contenedor y de nginx, supply chain.
  2. Accesibilidad WCAG 2.2 AA (ecc:a11y-architect): jerarquía de encabezados,
     landmarks, menú móvil (Escape, foco, altura), acordeón FAQ, anuncios de
     error/éxito en formularios (role=alert/status, foco), honeypot, elementos
     decorativos, enlaces en pestaña nueva, contraste de cada combinación
     token/opacidad real, texto diminuto, prefers-reduced-motion también en
     Framer Motion, foco visible y no obstruido, idioma de las frases en inglés.
  3. SEO técnico y on-page (ecc:seo-specialist): title/description (longitud e
     intención), H1 con la entidad, OpenGraph/Twitter (imagen 1200×630 por
     convención de ficheros), JSON-LD (que se construya por render, escape de `<`,
     eventos sólo reales), sitemap/robots, canónicas y openGraph de subpáginas,
     noindex de páginas legales, preconnects inútiles, anclas absolutas en la
     navegación compartida por varias rutas.
  4. React / Next / rendimiento (ecc:react-reviewer): hydration mismatches
     (Date, zona horaria, window), sobre-serialización de props al cliente,
     componentes "use client" que podrían ser de servidor (patrón Reveal +
     LazyMotion `m`), `cache: "no-store"` que vuelva dinámica una ruta estática,
     fetch sin timeout, Promise.all sin red de seguridad, form.reset tras await,
     listeners de scroll, next/image (sizes, priority), opciones de next.config.
  5. (Opcional) Infra/CI (ecc:code-reviewer): Dockerfile (versión de Node con
     soporte, usuario no root), compose (init, cap_drop, límites, logs), nginx
     (cabeceras duplicadas, http2, keepalive, limit_req), workflows (permissions,
     interpolación de secrets en scripts remotos, rollback que no deja la web caída).

FASE 3 — Consolidación y ejecución (tú)
- Cruza los informes con tu lectura; descarta lo que contradiga CLAUDE.md o el diseño
  fijado y anótalo como decisión consciente.
- Crea la rama `task/<nombre>` (nunca push directo a main) y aplica las mejoras por
  capas: datos/SEO estructurado → libs de servidor (validación, timeouts) →
  componentes (a11y, animación ligera, server components) → infra/CI → tests → docs.
- Verifica: lint, typecheck, tests, build (compara "First Load JS" con la base),
  `next start` + curl de cabeceras, /opengraph-image, /sitemap.xml, /robots.txt,
  una ruta inexistente, y abre la home en el navegador para comprobar que la consola
  no muestra errores de hidratación.
- Actualiza CLAUDE.md con lo que cambie de arquitectura, `graphify update .`,
  commit con mensaje en español y PR con resumen por capas (hallazgos, cambios,
  verificación, decisiones no aplicadas y por qué).
- Guarda en el context lake un resumen de la auditoría y del PR.

Reglas: responde en español; no inventes contenido (fechas, testimonios, cifras);
no toques secretos ni .env.local; no cambies la dirección visual; cada cambio debe
ser verificable con los comandos del CI.
```
