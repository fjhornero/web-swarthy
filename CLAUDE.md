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

- `app/page.tsx` — composes 17 sections in order: Hero → Video → About → Journey → Mixes → Features → HowTo → Formats → Stats → Venues → Testimonials → Value → Guarantee → PressKit → Socials → Faq → FinalCta. Reorder by editing this file alone; sections do not depend on each other.
- `app/layout.tsx` — loads two Google fonts (`Bebas Neue` → display, `Inter` → body) and exposes them as `--font-bebas` and `--font-inter`.
- `app/globals.css` — Tailwind v4 `@theme` block declares the design tokens. Renaming a token here renames the utility class everywhere. Custom utilities defined in `@layer utilities` are the brand primitives:
  - `gradient-primary` — the rojo→naranja diagonal gradient (`#e11d48 → #f97316`) used on CTAs, badges, step circles, value-stack footer.
  - `text-gradient` — same gradient applied to text via `background-clip: text`. Used on every section heading's accent word.
  - `gradient-glow` / `gradient-glow-orange` — the radial red/orange halo used as ambient background glow behind hero, stats, press-kit, final CTA.
  - `shadow-glow` / `shadow-glow-strong` — the colored drop-shadow under primary buttons and featured cards.
  - `pulse-dot` — the keyframe used by "live" badge dots.
  - `card-lift` — uniform hover-lift for cards (mixes, venues, socials).
- `lib/data.ts` — single source of truth for all placeholder content (hero copy, nextGig, bio + stats, journey 4 steps, mixes, features, howTo, formats with includes lists, KPIs, venues, testimonials, value stack, pressKit, socials, FAQ). Sections import from here; replacing copy never touches component files.
- `components/sections/*` — one file per section. Client components when they animate via Framer Motion (most of them); server components when purely static.
- `components/Navbar.tsx`, `components/Footer.tsx` — chrome.
- `components/ui/Countdown.tsx` — live `DD : HH : MM : SS` counter to a target Date. Used in the Hero with `site.nextGig.iso` as target.
- `public/images/` — placeholder photography (Behance refs); `public/logo-isotype.png` and `public/logo-wordmark.png` are the artist's logos. The isotype is rendered with `className="invert"` (black silhouette → white).

### Brand mapping (reference → this site)

The reference is a **course landing**; this is an **artist site**. Every section reuses the *form* of the reference but the *content* maps differently:

| Reference section | Here |
|---|---|
| Course launch countdown | Countdown to next gig |
| Course offering cards | 3 destacados sets |
| Course features icons | "Por qué Swarthy" |
| 3-step enrollment | 3-step booking flow |
| Course tiers comparison | Set formats (Club / Peak Time / All Night Long) |
| Alumni grid (with clubs) | Venues / festivals where he played |
| ROI calc / value stack | "Qué incluye el cachet" |
| 30-day guarantee | "Respuesta en 48h + EPK + contrato" |
| Free PDF guide download | EPK / press kit download |

**Do not drift back to "club neon" or "editorial cinematic" aesthetics** — both were tried and rejected. The locked direction is the reference URL above.

## Deployment

Target server: `ssh root@212.227.41.45` (existing nginx + certbot + n8n stack). The compose **does not publish ports to the host** — nginx reaches the container over a shared Docker network (default `nginx_default`; verify and edit `docker-compose.yml` before first deploy).

- `Dockerfile` — multi-stage (deps → builder → runner). `node:20-alpine`, runs as non-root, executes `node server.js` from the `standalone` output.
- `docker-compose.yml` — single `web` service joined to external `proxy` network. Healthcheck against `localhost:3000`.
- `deploy/nginx-djswarthy.conf` — sample vhost: HTTP→HTTPS redirect, www → apex canonicalization, `proxy_pass http://web-swarthy:3000`.
- `deploy/README.md` — first-deploy and update walkthrough.

## Domains

`djswarthy.es` (canonical) and `www.djswarthy.es` (redirects to apex). Both A-records must point to `212.227.41.45` before certbot can issue the cert.

## Not yet wired

- Booking and form actions are visual only (`mailto:` links + alerts). No SMTP, no n8n webhook, no backend route.
- All copy in `lib/data.ts` is placeholder. Bio, mixes, tour dates, testimonials, venues, FAQ — all fictitious until the artist provides real material.
- No analytics, no sitemap.xml, no robots.txt, custom favicon still default.
- No CI/CD — deploys are manual `git pull && docker compose up -d --build` over SSH.
- Press-kit PDF (`href="#"`) needs a real file in `public/`.
