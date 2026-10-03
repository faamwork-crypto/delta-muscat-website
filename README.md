# Delta Muscat Steel & Aluminium — Corporate Website

A premium, bilingual (English / Arabic) corporate website for **Delta Muscat Steel & Aluminium** —
a manufacturer of custom pergolas, parking shades, shade structures and architectural metal
decoration, based in Rusayl Industrial City, Muscat, Sultanate of Oman.

Built with **Next.js 16 (App Router) · TypeScript · Tailwind CSS 4**. No other runtime dependencies.

---

## Quick start

> The bundled portable Node.js runtime lives in `.tools/node` (Windows). If you have Node.js ≥ 20
> installed system-wide, ignore the `PATH` prefix and use `npm` / `npx` directly.

```bat
:: one-time setup
set "PATH=%CD%\.tools\node;%PATH%"
npm install

:: development server (http://localhost:3000)
npm run dev

:: production build + serve
npm run build
npm start
```

Regenerate placeholder artwork (only needed after editing `scripts/generate-assets.mjs`):

```bat
node scripts\generate-assets.mjs
```

## Smoke check

1. `npm run build && npm start`, then open <http://localhost:3100> — the root redirects to `/en`
   (or `/ar` if the browser's `Accept-Language` prefers Arabic).
2. Check the key routes return 200: `/en`, `/ar`, `/en/solutions/pergolas`, `/en/sectors`,
   `/en/contact`, `/sitemap.xml`, `/robots.txt`.
3. Toggle the language button (`العربية` / `ENGLISH`) — direction flips to RTL and the Arabic
   typefaces load.
4. At ≤ 1024 px the burger menu opens a full-screen navigation with accordions.
5. On `/en/solutions/pergolas`, drag the louver slider (closed ↔ open).
6. On `/en/contact`, submit the empty form — a validation message appears; a valid submit opens
   the visitor's email app with the request pre-filled.

## Project structure

```
src/
  app/
    [locale]/            ← all pages, one route tree per locale (en | ar)
      layout.tsx         ← <html lang dir>, per-locale fonts, Organization JSON-LD
      page.tsx           ← homepage
      about|process|materials|gallery|contact|sectors|solutions/
    proxy.ts             ← locale redirect for locale-less paths (Next 16 "middleware")
    sitemap.ts, robots.ts, icon.svg, not-found
  components/
    home/                ← homepage sections (Hero, Intro, WhyDelta, …)
    Header, Footer, PageHero, MediaCard, Reveal, LouverDemo, ContactForm, GalleryGrid…
  i18n/
    config.ts            ← locales, dir(), helpers
    dictionaries/en.ts   ← source of truth for ALL copy (EN)
    dictionaries/ar.ts   ← full Arabic translation (typed against EN)
    fonts/en.ts, ar.ts   ← Marcellus + IBM Plex Sans / Noto Kufi Arabic + IBM Plex Sans Arabic
  lib/
    site.ts              ← verified company facts (phones, email, address, CR number)
    images.ts            ← central map of placeholder artwork
    seo.ts               ← per-page metadata, canonical + hreflang + OG
scripts/generate-assets.mjs  ← generates all placeholder SVG artwork + OG image
public/
  images/<category>/…    ← placeholder imagery (SVG, drop-in replaceable)
  brand/                 ← logo exports
```

## Content & i18n

- **All copy lives in the two dictionaries** (`src/i18n/dictionaries/{en,ar}.ts`). Edit text there —
  components only reference dictionary keys.
- The Arabic dictionary is type-checked against the English one (`ar: Dictionary`), so a missing or
  misnamed section fails the build instead of silently rendering empty.
- Company facts (phones, fax, email, addresses, CR number) are centralised in `src/lib/site.ts`.
  Nothing on the site is invented: no certifications, statistics, client names, awards or warranty
  claims are stated anywhere.

## Imagery

- **Official photos** (hero, pergola/pool, shade sail, factory & showroom, material samples) were
  sourced from the company's own demo site and live in `public/images/photos/`, mapped centrally in
  `src/lib/images.ts`. The official logo PNGs are in `public/brand/`, and the official OG image is
  `public/images/og/og-default.jpg`.
- **Generated SVG illustrations** remain only where no real photo exists for the topic (parking
  shades card, sector tiles, gallery concepts) so nothing is misrepresented.
- To replace any image: overwrite the file (same path/name) or update its single entry in
  `src/lib/images.ts`. Original unprocessed downloads are kept in `downloads/demo-images/`
  (git-ignored); `scripts/fetch-demo-images.mjs` can re-fetch them, and
  `scripts/preview-demo-images.mjs` transcodes previews.

## Design system

- **Palette** (`@theme` in `src/app/globals.css`): warm off-white paper `#F7F4EE`, sand
  `#E5DCCB`, ink `#1C1B18`, graphite `#232220/#191917`, bronze `#A87C4F` (+ `bronze-ink` AA-safe
  variant for small text).
- **Type**: Marcellus (display serif) + IBM Plex Sans (body) for EN; Noto Kufi Arabic + IBM Plex
  Sans Arabic for AR — all **self-hosted** via `@fontsource` packages (imported in
  `src/app/globals.css`), so builds never depend on Google Fonts being reachable.
- **Motion**: IntersectionObserver scroll-reveals, CSS-only hero entrance; everything honours
  `prefers-reduced-motion`.
- Layout is logical-property based (`ms-/me-/ps-/pe-/start-/end-`), so the whole site mirrors for
  RTL automatically.

## Documented assumptions

1. **Contact form** has no backend — submission opens the visitor's email client with the request
   pre-filled (same behaviour as the company's current site). Wire `ContactForm.tsx` to an API
   route / form service when available.
2. **Project gallery shows concept studies**, clearly labelled; it does not present fictional
   projects as completed work. Replace with real photography at handover.
3. The **company URL** defaults to the existing deployment domain; override with
   `NEXT_PUBLIC_SITE_URL` for canonical/OG tags.
4. Working hours and social media profiles were **not published** by the company, so they are
   omitted rather than invented.
5. The demo site's `muscat-coast.webp` (baked-in quote overlay) and branded marketing images
   (e.g. the sample-box card with overlay text) were used selectively or left out accordingly.
6. A portable Node.js runtime is vendored in `.tools/node` for this machine only (git-ignored);
   delete it and use a system Node ≥ 20 if you prefer.

## SEO & accessibility

- Unique title + meta description per page, canonical URLs, `hreflang` EN/AR alternates,
  Open Graph + Twitter cards, generated `sitemap.xml` and `robots.txt`.
- `Organization` JSON-LD with the company's real address and registration.
- Semantic landmarks, skip-to-content link, keyboard-operable menus/accordions with `aria-expanded`,
  `role="dialog"` mobile menu, visible focus rings, AA-contrast text tokens, `prefers-reduced-motion`
  support.
