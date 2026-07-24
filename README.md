# Website Cloner

Scrapes a live website and rebuilds it as an editable React project.

Renders the target URL in headless Chromium, captures the final DOM plus every
stylesheet, image, and font it loads, then produces two outputs:

- **`preview/`** — a self-contained static HTML clone (viewable as-is).
- **`react-app/`** — the same page(s) rebuilt as an editable Vite + React
  project (JSX components, `className`/`style` props, etc).

Two modes:

- **Clone** — a single page.
- **Crawl** — follows same-origin `<a href>` links (via Crawlee) up to a page
  limit, producing a multi-page `preview/` (one folder per route) and a
  multi-page `react-app/` with `react-router-dom` routing.

## Packages

- `packages/core` — the scraping + crawling + codegen engine (Playwright,
  Crawlee, parse5).
- `packages/cli` — `website-cloner clone <url> -o <dir>` and
  `website-cloner crawl <url> -o <dir> --max-pages 20`.
- `packages/server` — Express API (`POST /api/clone`, `POST /api/crawl`) that
  scrapes/crawls on demand, serves a live preview, and zips the project for
  download.
- `packages/web` — Vite + React front end: paste a URL, pick single-page or
  crawl, see a live preview, download the project.
- `packages/ai-cloner` — a separate, deeper AI-driven pipeline: Firecrawl page
  discovery → Playwright render → categorized asset download (images/css/
  fonts/svg/icons) → HTML/DOM/Markdown save → per-section screenshots →
  layout/typography/color/spacing/animation/component analysis → per-section
  JSON + AI prompt → a generated Next.js + Tailwind + Framer Motion project.
  See `packages/ai-cloner/.env.example` (requires `FIRECRAWL_API_KEY`).
  Two bin entries: `ai-cloner clone <url> -o <dir>` (configurable), or the
  zero-config `clone-site <url>` — prints a live checklist (crawl, download
  assets, screenshot, analyze layout/animation, generate prompt, generate
  Next.js/Tailwind/Framer Motion, build) and actually runs `npm install` +
  `npm run build` on the generated project. Install globally with `npm
  install -g ./packages/ai-cloner` (after `npm run build`), or run directly:
  `node packages/ai-cloner/dist/cloneSite.js <url>`.

  A third bin entry, `ai-generate [analysisDir] [outputDir]` (defaults
  `./analysis` → `./output`), is the AI Generator: it reads *only* the
  `analysis/` folders produced above (layout/colors/typography/animation/
  spacing/component/prompt.json — never `page.html`, never the site's text)
  and synthesizes a brand-new Next.js + Tailwind v4 + Framer Motion site from
  those design specs alone — reusable `components/ui/` primitives, section
  archetypes picked from the detected component patterns (navbar/hero/card
  grid/footer/form/generic), responsive breakpoints derived from the layout
  analysis, a working dark-mode toggle (CSS-variable theme tokens with a
  role-aware light→dark derivation, not a lookup), and real `app/robots.ts`
  + `app/sitemap.ts`. Since the input never includes the original markup or
  copy, none of it can leak into the output — placeholder copy is
  synthesized deterministically instead. Run: `node
  packages/ai-cloner/dist/generator/cli.js <analysisDir> <outputDir>`.
- `packages/next-app` — a plain Next.js + Tailwind + Framer Motion scaffold
  (no cloning logic; a starting point for hand-built pages).

## Usage

```bash
npm install
npm run build

# CLI
npm run clone -- clone https://example.com -o ./cloned-site
npm run clone -- crawl https://example.com -o ./cloned-site --max-pages 20

# Web app (server on :8787, UI on :5173)
npm run dev
```

Generated projects are self-contained: `cd react-app && npm install && npm run dev`.
