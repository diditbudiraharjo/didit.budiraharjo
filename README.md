# Website Cloner

Scrapes a live website and rebuilds it as an editable React project.

Renders the target URL in headless Chromium, captures the final DOM plus every
stylesheet, image, and font it loads, then produces two outputs:

- **`preview/`** — a self-contained static HTML clone (viewable as-is).
- **`react-app/`** — the same page rebuilt as an editable Vite + React project
  (JSX components, `className`/`style` props, etc).

## Packages

- `packages/core` — the scraping + codegen engine (Playwright, parse5).
- `packages/cli` — `website-cloner clone <url> -o <dir>`.
- `packages/server` — Express API (`POST /api/clone`) that scrapes on demand,
  serves a live preview, and zips the project for download.
- `packages/web` — Vite + React front end: paste a URL, see a live preview,
  download the project.

## Usage

```bash
npm install
npm run build

# CLI
npm run clone -- clone https://example.com -o ./cloned-site

# Web app (server on :8787, UI on :5173)
npm run dev
```

Generated projects are self-contained: `cd react-app && npm install && npm run dev`.
