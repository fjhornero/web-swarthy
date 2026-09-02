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

- `app/page.tsx` — async server component that fetches the YouTube + SoundCloud feeds (`lib/feeds.ts`, revalidated hourly) and composes the sections in order: Hero → Stats → About → Dates → Mixes → Releases → Formats → Venues → Testimonials → Socials → Faq → Contact → FinalCta. It also fetches the Spotify discography (`lib/spotify.ts`, revalidated hourly). Reorder by editing this file alone; sections do not depend on each other (FinalCta embeds BookingForm). `Dates` and `Testimonials` render nothing while `site.dates` / `site.testimonials` are empty, so the page degrades to its previous shape.
- `app/privacidad/page.tsx` — GDPR privacy policy. It is the legal basis for the two forms, both of which require an explicit consent checkbox (`components/ConsentCheckbox.tsx`) that the server actions re-validate.
- `app/press-kit/page.tsx` — EPK: short/long bio, quick facts, technical rider and downloadable artwork, all driven by `site.press`.
- `lib/dates.ts` — `upcomingDates()` drops past gigs and sorts ascending. Shared by `app/page.tsx` and `lib/json-ld.ts` so the agenda and the `MusicEvent` schema never disagree. Filtering happens on the server on purpose: doing it inside the client component would risk a hydration mismatch across a midnight boundary.
- `app/layout.tsx` — loads two Google fonts (`Bebas Neue` → display, `Inter` → body) and exposes them as `--font-bebas` and `--font-inter`. Also carries the full SEO surface: metadata + OpenGraph/Twitter (`/images/og.jpg`), JSON-LD (`MusicGroup`, `WebSite`, `Service`, `FAQPage` built from `site.faq`) and the Plausible analytics script (`data-domain="djswarthy.es"`).
- `app/actions/booking.ts` / `app/actions/contact.ts` — server actions that forward form submissions to a Telegram chat via `lib/telegram.ts` (needs `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` env vars). Both validate/trim fields server-side and silently accept honeypot (`web` field) submissions.
- `lib/feeds.ts` — regex-parses the public YouTube RSS and SoundCloud RSS feeds (no API keys). Sends a browser User-Agent because YouTube 429s datacenter IPs otherwise. Returns `[]` on any failure; `Mixes` falls back to plain channel links. `Mixes` renders the newest item of each platform plus a grid of up to 6 more, interleaved so one platform never dominates. Every player is a **facade**: the thumbnail is a button and the `<iframe>` is only mounted on click, so YouTube/SoundCloud third-party cookies are never set on a plain visit. YouTube serves thumbnails from `i.ytimg.com` *and* `i1/i2/i3/i4.ytimg.com`, hence the `*.ytimg.com` `remotePattern` in `next.config.ts`.
- `lib/spotify.ts` — public artist data for `site.spotifyArtistId`. Two paths: the official Web API via **Client Credentials** (`SPOTIFY_CLIENT_ID` + `SPOTIFY_CLIENT_SECRET`) to list albums and singles with artwork, and the credential-free **public oEmbed** for the artist's name and photo. Without credentials it returns `[]` and `Releases` falls back to the profile player, which already lists the top tracks. The token is cached in module memory because a POST `fetch` never enters Next's Data Cache.
- `components/MediaFacade.tsx` — the facade shared by `Mixes` and `Releases`: a clickable cover (16:9 or 1:1) that only mounts the `<iframe>` after the click, so YouTube/SoundCloud/Spotify never set third-party cookies on a plain visit. Any new player must go through it.
- `components/sections/Releases.tsx` — the `#spotify` section: a grid of releases with a per-album embed, or the artist profile player as fallback.
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
- `site.whatsapp` is empty, so the WhatsApp CTA in `FinalCta` does not render. Fill it with an international number, digits only (e.g. `34600123456`).
- `site.dates` and `site.testimonials` are empty; their sections stay hidden until real gigs/quotes are added. **Never fill them with placeholder content** — testimonials are social proof and fake dates would emit wrong `MusicEvent` schema.
- Keeper has no venue photo (`Venue.img` is optional and it falls back to a typographic card). The previous image was a scanned VIP consumption card and clashed with the rest of the grid.
- The press kit lists downloadable images but no rider PDF; `site.press.rider` renders the same content as HTML instead.
- `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` are optional (see `.env.example`): without them the Spotify section degrades to the artist profile player instead of the album grid. Adding a new embed host means widening `frame-src` in the CSP **and** `images.remotePatterns` in `next.config.ts`.
