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
