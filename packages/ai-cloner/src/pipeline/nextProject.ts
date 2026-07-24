import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { fragmentToJsx } from "@website-cloner/core";
import type { DownloadedAsset, NextProjectPageInput, NextProjectSectionInput } from "../types.js";
import { isNeutral, isTransparent } from "../utils/color.js";

/**
 * Next.js App Router pages are real routes at real paths (e.g. /about), not a client-side
 * SPA sharing one root document - but `public/` assets are still always served from site
 * root. A relative "assets/xxx" reference baked into JSX resolves against the *current
 * route*, not the site root, and 404s on any non-home page - so JSX needs root-absolute
 * "/assets/xxx" references instead (CSS is unaffected: url() in a stylesheet resolves
 * against that stylesheet's own location, not the current page).
 */
function toRootAbsoluteAssetPaths(html: string): string {
  return html.replace(/(?<!\/)assets\//g, "/assets/");
}

function pascalCase(segment: string): string {
  return segment
    .split(/[^a-zA-Z0-9]+/)
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join("");
}

function sectionComponentName(sectionId: string): string {
  return `${pascalCase(sectionId)}Section`;
}

function pageComponentPath(slug: string): string {
  return slug === "home" ? "app/page.tsx" : `app/${slug}/page.tsx`;
}

/** Aggregates every section's color analysis across the whole site into global design tokens. */
function aggregateColorTokens(pages: NextProjectPageInput[]) {
  const totals = new Map<string, { count: number; role: "text" | "background" | "border" }>();
  for (const page of pages) {
    for (const section of page.sections) {
      for (const c of section.analysis.colors.palette) {
        if (isTransparent(c.value)) continue;
        const existing = totals.get(c.value);
        if (existing) existing.count += c.count;
        else totals.set(c.value, { count: c.count, role: c.role });
      }
    }
  }

  const ranked = [...totals.entries()]
    .map(([value, meta]) => ({ value, ...meta }))
    .sort((a, b) => b.count - a.count);

  const background = ranked.find((c) => c.role === "background")?.value ?? "#ffffff";
  const foreground = ranked.find((c) => c.role === "text")?.value ?? "#111111";
  const brand = ranked.find((c) => !isNeutral(c.value))?.value ?? foreground;
  const palette = ranked.filter((c) => c.value !== background && c.value !== foreground).slice(0, 8);

  return { brand, background, foreground, palette };
}

function aggregateFontFamily(pages: NextProjectPageInput[]): string {
  const counts = new Map<string, number>();
  for (const page of pages) {
    for (const section of page.sections) {
      for (const f of section.analysis.typography.fontFamilies) {
        counts.set(f.value, (counts.get(f.value) ?? 0) + f.count);
      }
    }
  }
  const top = [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
  return top ?? "ui-sans-serif, system-ui, sans-serif";
}

function aggregateSpacingScale(pages: NextProjectPageInput[]): number[] {
  const values = new Set<number>();
  for (const page of pages) {
    for (const section of page.sections) {
      for (const px of section.analysis.spacing.scale) values.add(px);
    }
  }
  return [...values].sort((a, b) => a - b).slice(0, 10);
}

function buildTailwindConfig(pages: NextProjectPageInput[]): string {
  const colors = aggregateColorTokens(pages);
  const fontFamily = aggregateFontFamily(pages);
  const spacingScale = aggregateSpacingScale(pages);

  const paletteEntries = colors.palette
    .map((c, i) => `        "accent-${i + 1}": ${JSON.stringify(c.value)},`)
    .join("\n");
  const spacingEntries = spacingScale
    .map((px, i) => `        "token-${i + 1}": ${JSON.stringify(`${px}px`)},`)
    .join("\n");

  return [
    `import type { Config } from "tailwindcss";`,
    "",
    `const config: Config = {`,
    `  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],`,
    `  theme: {`,
    `    extend: {`,
    `      colors: {`,
    `        brand: ${JSON.stringify(colors.brand)},`,
    `        surface: ${JSON.stringify(colors.background)},`,
    `        ink: ${JSON.stringify(colors.foreground)},`,
    paletteEntries,
    `      },`,
    `      fontFamily: {`,
    `        sans: [${fontFamily.split(",").map((f) => JSON.stringify(f.trim())).join(", ")}],`,
    `      },`,
    `      spacing: {`,
    spacingEntries,
    `      },`,
    `    },`,
    `  },`,
    `  plugins: [],`,
    `};`,
    "",
    `export default config;`,
    "",
  ]
    .filter((line) => line !== "")
    .join("\n");
}

function buildSectionComponent(section: NextProjectSectionInput): string {
  const componentName = sectionComponentName(section.id);
  const jsxBody = fragmentToJsx(toRootAbsoluteAssetPaths(section.html)) || "      {/* (empty section) */}";

  return [
    `"use client";`,
    "",
    `import { motion } from "framer-motion";`,
    "",
    `export default function ${componentName}() {`,
    `  return (`,
    `    <motion.div`,
    `      initial={{ opacity: 0, y: 24 }}`,
    `      whileInView={{ opacity: 1, y: 0 }}`,
    `      viewport={{ once: true, amount: 0.2 }}`,
    `      transition={{ duration: 0.6, ease: "easeOut" }}`,
    `    >`,
    jsxBody,
    `    </motion.div>`,
    `  );`,
    `}`,
    "",
  ].join("\n");
}

function buildPageComponent(page: NextProjectPageInput): string {
  // app/page.tsx (home) sits one level above next-app/; app/<slug>/page.tsx sits two.
  const importPrefix = page.slug === "home" ? "../components/sections" : "../../components/sections";
  const imports = page.sections
    .map(
      (s) =>
        `import ${sectionComponentName(s.id)} from "${importPrefix}/${page.slug}/${sectionComponentName(s.id)}";`,
    )
    .join("\n");
  const elements = page.sections.map((s) => `      <${sectionComponentName(s.id)} />`).join("\n");

  return [
    imports,
    "",
    `export const metadata = { title: ${JSON.stringify(page.title)} };`,
    "",
    `export default function Page() {`,
    `  return (`,
    `    <>`,
    elements,
    `    </>`,
    `  );`,
    `}`,
    "",
  ].join("\n");
}

/** Steps 17-19: generates a full Next.js App Router project (Tailwind + Framer Motion) from every analyzed page/section. */
export async function generateNextProject(
  siteTitle: string,
  pages: NextProjectPageInput[],
  assets: DownloadedAsset[],
  siteOutDir: string,
): Promise<Map<string, Buffer | string>> {
  const files = new Map<string, Buffer | string>();

  for (const page of pages) {
    for (const section of page.sections) {
      files.set(
        `next-app/components/sections/${page.slug}/${sectionComponentName(section.id)}.tsx`,
        buildSectionComponent(section),
      );
    }
    files.set(`next-app/${pageComponentPath(page.slug)}`, buildPageComponent(page));
  }

  const cssAssets = assets.filter((a) => a.category === "css");
  const cssLinks = cssAssets.map((a) => `        <link rel="stylesheet" href="/${a.localPath}" />`).join("\n");

  files.set(
    "next-app/app/layout.tsx",
    [
      `import type { ReactNode } from "react";`,
      `import "./globals.css";`,
      "",
      `export const metadata = { title: ${JSON.stringify(siteTitle)} };`,
      "",
      `export default function RootLayout({ children }: { children: ReactNode }) {`,
      `  return (`,
      `    <html lang="en">`,
      `      <head>`,
      cssLinks,
      `      </head>`,
      `      <body>{children}</body>`,
      `    </html>`,
      `  );`,
      `}`,
      "",
    ]
      .filter((l) => l !== "")
      .join("\n"),
  );

  files.set("next-app/app/globals.css", `@import "tailwindcss";\n`);
  files.set("next-app/tailwind.config.ts", buildTailwindConfig(pages));
  files.set(
    "next-app/postcss.config.mjs",
    `const config = { plugins: ["@tailwindcss/postcss"] };\n\nexport default config;\n`,
  );
  files.set(
    "next-app/next.config.ts",
    `import type { NextConfig } from "next";\n\nconst nextConfig: NextConfig = {};\n\nexport default nextConfig;\n`,
  );
  files.set(
    "next-app/tsconfig.json",
    JSON.stringify(
      {
        compilerOptions: {
          target: "ES2022",
          lib: ["dom", "dom.iterable", "esnext"],
          allowJs: true,
          skipLibCheck: true,
          strict: true,
          noEmit: true,
          esModuleInterop: true,
          module: "esnext",
          moduleResolution: "bundler",
          resolveJsonModule: true,
          isolatedModules: true,
          jsx: "preserve",
          incremental: true,
          plugins: [{ name: "next" }],
          paths: { "@/*": ["./*"] },
        },
        include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
        exclude: ["node_modules"],
      },
      null,
      2,
    ) + "\n",
  );
  files.set(
    "next-app/package.json",
    JSON.stringify(
      {
        name: "ai-cloned-site",
        private: true,
        version: "0.0.1",
        scripts: { dev: "next dev", build: "next build", start: "next start" },
        dependencies: {
          next: "^15.0.0",
          react: "^18.3.1",
          "react-dom": "^18.3.1",
          "framer-motion": "^12.0.0",
        },
        devDependencies: {
          "@tailwindcss/postcss": "^4.0.0",
          tailwindcss: "^4.0.0",
          typescript: "^5.6.3",
          "@types/node": "^22.9.0",
          "@types/react": "^18.3.12",
          "@types/react-dom": "^18.3.1",
        },
      },
      null,
      2,
    ) + "\n",
  );

  for (const asset of assets) {
    const content = await readFile(join(siteOutDir, asset.localPath));
    files.set(`next-app/public/${asset.localPath}`, content);
  }

  return files;
}
