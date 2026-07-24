import type { SiteAnalysisInput } from "./types.js";
import { aggregateTokens } from "./aggregateTokens.js";
import { buildUiPrimitives } from "./primitives.js";
import { buildThemeFiles } from "./theme.js";
import { buildSectionComponent } from "./buildSectionComponent.js";
import { buildSeoFiles, pageDescription, pageTitle } from "./seo.js";

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

function pagePath(slug: string): string {
  return slug === "home" ? "app/page.tsx" : `app/${slug}/page.tsx`;
}

/**
 * AI Generator: assembles a complete, original Next.js + Tailwind + Framer Motion project
 * from a SiteAnalysisInput - never from the site's captured markup, since the generator
 * never receives it. Every section is synthesized from scratch by selectBlock().
 */
export function assembleProject(site: SiteAnalysisInput, siteTitle: string): Map<string, Buffer | string> {
  const files = new Map<string, Buffer | string>();
  const tokens = aggregateTokens(site);

  for (const [path, content] of buildUiPrimitives()) files.set(path, content);
  for (const [path, content] of buildThemeFiles()) files.set(path, content);
  for (const [path, content] of buildSeoFiles(siteTitle, site.pages.map((p) => p.slug))) files.set(path, content);

  for (const page of site.pages) {
    const importPrefix = page.slug === "home" ? "../components/sections" : "../../components/sections";
    const imports: string[] = [];
    const elements: string[] = [];

    for (const section of page.sections) {
      const name = sectionComponentName(section.id);
      files.set(`components/sections/${page.slug}/${name}.tsx`, buildSectionComponent(section, name));
      imports.push(`import { ${name} } from "${importPrefix}/${page.slug}/${name}";`);
      elements.push(`      <${name} />`);
    }

    files.set(
      pagePath(page.slug),
      [
        ...imports,
        "",
        `export const metadata = {`,
        `  title: ${JSON.stringify(pageTitle(siteTitle, page.slug))},`,
        `  description: ${JSON.stringify(pageDescription(siteTitle, page.slug))},`,
        `  openGraph: {`,
        `    title: ${JSON.stringify(pageTitle(siteTitle, page.slug))},`,
        `    description: ${JSON.stringify(pageDescription(siteTitle, page.slug))},`,
        `    type: "website",`,
        `  },`,
        `};`,
        "",
        `export default function Page() {`,
        `  return (`,
        `    <>`,
        ...elements,
        `    </>`,
        `  );`,
        `}`,
        "",
      ].join("\n"),
    );
  }

  files.set(
    "app/layout.tsx",
    [
      `import type { ReactNode } from "react";`,
      `import { ThemeProvider } from "../components/ThemeProvider";`,
      `import { ThemeScript } from "../components/ThemeScript";`,
      `import "./globals.css";`,
      "",
      `export const metadata = {`,
      `  title: { default: ${JSON.stringify(siteTitle)}, template: \`%s · ${siteTitle}\` },`,
      `  description: ${JSON.stringify(`${siteTitle} - built with Next.js, Tailwind CSS, and Framer Motion.`)},`,
      `};`,
      "",
      `export default function RootLayout({ children }: { children: ReactNode }) {`,
      `  return (`,
      `    <html lang="en" suppressHydrationWarning>`,
      `      <head>`,
      `        <ThemeScript />`,
      `      </head>`,
      `      <body className="bg-surface text-ink antialiased">`,
      `        <ThemeProvider>{children}</ThemeProvider>`,
      `      </body>`,
      `    </html>`,
      `  );`,
      `}`,
      "",
    ].join("\n"),
  );

  files.set(
    "app/globals.css",
    [
      `@import "tailwindcss";`,
      "",
      `@theme {`,
      `  --color-brand: ${tokens.light.brand};`,
      `  --color-surface: ${tokens.light.surface};`,
      `  --color-surface-2: ${tokens.light.surfaceAlt};`,
      `  --color-ink: ${tokens.light.ink};`,
      `  --color-muted: ${tokens.light.muted};`,
      `  --color-border: ${tokens.light.border};`,
      `  --font-sans: ${JSON.stringify(tokens.fontFamily)};`,
      `}`,
      "",
      `.dark {`,
      `  --color-brand: ${tokens.dark.brand};`,
      `  --color-surface: ${tokens.dark.surface};`,
      `  --color-surface-2: ${tokens.dark.surfaceAlt};`,
      `  --color-ink: ${tokens.dark.ink};`,
      `  --color-muted: ${tokens.dark.muted};`,
      `  --color-border: ${tokens.dark.border};`,
      `}`,
      "",
      `body {`,
      `  transition: background-color 0.2s ease, color 0.2s ease;`,
      `}`,
      "",
    ].join("\n"),
  );

  files.set(
    "package.json",
    JSON.stringify(
      {
        name: "ai-generated-site",
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
  files.set(
    "tsconfig.json",
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
    "next.config.ts",
    `import type { NextConfig } from "next";\n\nconst nextConfig: NextConfig = {};\n\nexport default nextConfig;\n`,
  );
  files.set(
    "postcss.config.mjs",
    `const config = { plugins: ["@tailwindcss/postcss"] };\n\nexport default config;\n`,
  );

  return files;
}
