# website-cloner

Pipeline scaffold for cloning a website into a rebuilt Next.js project. Each
stage reads from the previous stage's directory and writes into its own.

```
website-cloner/
├── assets/            downloaded static assets, organized by type
│   ├── images/
│   ├── fonts/
│   ├── videos/
│   ├── icons/
│   └── svg/
│
├── crawl/             raw output captured from the source site
│   ├── html/          raw page HTML
│   ├── markdown/      HTML converted to markdown
│   ├── json/          structured page/metadata dumps (see `PageRecord` in config/schema.ts)
│   ├── dom/           serialized DOM trees
│   ├── screenshots/   full-page and viewport captures
│   ├── requests/      captured network requests
│   └── css/           extracted stylesheets
│
├── analysis/          derived analysis of the crawled site
│   ├── ui/             component and pattern inventory
│   ├── prompts/         generated prompts for rebuilding sections
│   ├── animation/       motion and transition notes
│   ├── typography/      font stacks and type scale
│   ├── colors/          color palette extraction
│   └── layout/          grid, spacing, and breakpoint notes
│
├── output/
│   └── nextjs-project/  generated Next.js reproduction of the site
│
└── config/             pipeline configuration (crawl targets, options)
```

## Pipeline

1. **crawl** — fetch pages and assets from the target site.
2. **analysis** — derive UI, layout, typography, color, and animation
   specs from the crawl output.
3. **output** — generate the `nextjs-project/` reproduction from the
   analysis.

`config/` holds settings shared across stages (e.g. crawl targets, output
options) and `schema.ts`, which defines `PageRecord` — the shape of each
JSON file written to `crawl/json/`:

```ts
interface PageRecord {
  url: string;
  title: string;
  markdown: string;
  html: string;
  metadata: Record<string, unknown>;
  links: string[];
}
```
