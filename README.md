# djswarthy.es

Web de presentación de **DJ Swarthy** (DJ y productor en Madrid): sets recientes de
YouTube y SoundCloud, discografía en Spotify, formatos de contratación, salas, FAQ y
dos formularios (booking y contacto) que llegan por Telegram.

Stack: Next.js 15 (App Router) · React 19 · TypeScript · Tailwind v4 · Framer Motion.

## Desarrollo

```bash
npm install
cp .env.example .env.local   # rellenar TELEGRAM_* (y opcionalmente SPOTIFY_*)
npm run dev                  # http://localhost:3000
```

Comprobaciones (las mismas que corre el CI):

```bash
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm test            # vitest (tests/)
npm run build       # build de producción
```

## Estructura

| Ruta | Qué hay |
| --- | --- |
| `app/page.tsx` | Home: compone las secciones y carga los feeds (revalidación horaria). |
| `app/press-kit`, `app/privacidad` | Dossier de prensa y política de privacidad. |
| `app/actions/*` | Server actions de los formularios → Telegram. |
| `app/opengraph-image.tsx` | Imagen social 1200×630 generada en el build. |
| `components/sections/*` | Una sección por fichero. |
| `lib/data.ts` | Todo el contenido estático (copy, formatos, salas, FAQ, redes). |
| `lib/feeds.ts`, `lib/spotify.ts` | Lectura de YouTube, SoundCloud y Spotify sin claves (Spotify opcional con credenciales). |
| `tests/` | Tests unitarios de la lógica de servidor. |
| `deploy/` | Vhost de nginx y guía de despliegue. |
| `docs/AUDIT_PROMPT.md` | Prompt para lanzar una auditoría con agentes. |

La guía detallada de arquitectura y decisiones está en [`CLAUDE.md`](CLAUDE.md); el
despliegue, en [`deploy/README.md`](deploy/README.md).

## Despliegue

Cada push a `main` pasa el CI y despliega en el servidor por SSH (`.github/workflows/deploy.yml`),
con rollback automático si el healthcheck no responde. Ver `deploy/README.md`.
