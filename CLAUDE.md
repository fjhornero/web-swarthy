# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

Next.js 15 (App Router) + React 19 + TypeScript + Tailwind v4 + Framer Motion + lucide-react. `output: "standalone"` for the production Docker image.

## Commands

```bash
npm install                 # install deps
npm run dev                 # dev server (default port 3000)
npm run build               # production build (verifies TS + Tailwind)
npm run start               # serve production build
npm run lint                # eslint
```

If `npm run dev` (and `npx next ...`) returns a truncated "Errors: 1 | Warnings: 0" summary, the npx wrapper is swallowing output — call the binary directly: `./node_modules/.bin/next dev`.

## Architecture

Single long-scroll landing page modeled after the **DJSwarthy Academy** reference site (`https://fictional-octo-guacamole-rose.vercel.app/`). The visual identity (palette, typography, gradient, glow, structure) is copied from that reference; the content is rewritten as an **artist presentation site** (booking, sets, fechas) instead of a course landing.

- `app/page.tsx` — async server component that fetches the latest YouTube video + SoundCloud track (`lib/feeds.ts`, revalidated hourly) and composes 9 sections in order: Hero → About → Mixes → Formats → Venues → Socials → Faq → Contact → FinalCta. Reorder by editing this file alone; sections do not depend on each other (FinalCta embeds BookingForm).
- `app/layout.tsx` — loads two Google fonts (`Bebas Neue` → display, `Inter` → body) and exposes them as `--font-bebas` and `--font-inter`. Also carries the full SEO surface: metadata + OpenGraph/Twitter (`/images/og.jpg`), JSON-LD (`MusicGroup`, `WebSite`, `Service`, `FAQPage` built from `site.faq`) and the Plausible analytics script (`data-domain="djswarthy.es"`).
- `app/actions/booking.ts` / `app/actions/contact.ts` — server actions that forward form submissions to a Telegram chat via `lib/telegram.ts` (needs `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` env vars). Both validate/trim fields server-side and silently accept honeypot (`web` field) submissions.
- `lib/feeds.ts` — regex-parses the public YouTube RSS and SoundCloud RSS feeds (no API keys). Sends a browser User-Agent because YouTube 429s datacenter IPs otherwise. Returns `[]` on any failure; `Mixes` falls back to plain channel links.
- `app/sitemap.ts`, `app/robots.ts`, `app/api/health/route.ts` — sitemap, robots (disallows `/api/`), and the healthcheck endpoint used by docker-compose.
- `app/globals.css` — Tailwind v4 `@theme` block declares the design tokens. Renaming a token here renames the utility class everywhere. Custom utilities defined in `@layer utilities` are the brand primitives:
  - `gradient-primary` — the rojo→naranja diagonal gradient (`#e11d48 → #f97316`) used on CTAs, badges, step circles, value-stack footer.
  - `text-gradient` — same gradient applied to text via `background-clip: text`. Used on every section heading's accent word.
  - `gradient-glow` / `gradient-glow-orange` — the radial red/orange halo used as ambient background glow behind hero, contact and final CTA.
  - `shadow-glow` / `shadow-glow-strong` — the colored drop-shadow under primary buttons and featured cards.
  - `pulse-dot` — the keyframe used by "live" badge dots.
  - `card-lift` — uniform hover-lift for cards (venues, socials).
- `lib/data.ts` — single source of truth for the static content (hero copy, bio, formats with includes lists, venues, FAQ, socials). Sections import from here; replacing copy never touches component files.
- `components/sections/*` — one file per section, all client components animated with Framer Motion. `BookingForm` (inside FinalCta, anchor `#booking`) and `Contact` (anchor `#contacto`) submit to the Telegram server actions.
- `components/Navbar.tsx`, `components/Footer.tsx`, `components/StickyCta.tsx` — chrome. StickyCta is the mobile-only floating "Contratar" button linking to `#booking`.
- `public/images/` — venue photos + portrait; `public/logo-isotype.png` and `public/logo-wordmark.png` are the artist's logos. The isotype is rendered with `className="invert"` (black silhouette → white). `og.jpg` is the compressed OpenGraph image.

**Do not drift back to "club neon" or "editorial cinematic" aesthetics** — both were tried and rejected. The locked direction is the reference URL above.

## Deployment

Target server: `ssh root@212.227.41.45` (existing nginx + certbot + n8n stack). **nginx runs on the host, not in Docker** — the compose publishes the container only on the loopback (`127.0.0.1:3001 -> 3000`) and nginx `proxy_pass`es to it. The image is built and stored on that same server; there is no registry.

- `Dockerfile` — multi-stage (deps → builder → runner). `node:20-alpine`, runs as non-root, executes `node server.js` from the `standalone` output.
- `docker-compose.yml` — single `web` service joined to external `proxy` network. Healthcheck against `localhost:3000`.
- `deploy/nginx-djswarthy.conf` — sample vhost: HTTP→HTTPS redirect, www → apex canonicalization, `proxy_pass` to the published loopback port.
- `deploy/README.md` — first-deploy and update walkthrough, plus the GitHub secrets the pipeline needs.
- `.github/workflows/ci.yml` — lint + `tsc --noEmit` + `next build` on every PR and non-main push. Also exposed as `workflow_call`.
- `.github/workflows/deploy.yml` — on push to `main`: runs CI, then SSHes into the server, `git reset --hard` to the pushed SHA, `docker compose build && up -d`, polls `/api/health`, and **rolls back to the previous commit** if the healthcheck never goes green.

## Domains

`djswarthy.es` (canonical) and `www.djswarthy.es` (redirects to apex). Both A-records must point to `212.227.41.45` before certbot can issue the cert.

## Not yet wired

- Forms require `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in the container environment; without them submissions fail with a generic error.
- No EPK/press-kit download on the site (section was removed until a real PDF exists).
