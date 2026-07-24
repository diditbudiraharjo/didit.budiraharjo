function humanize(slug: string): string {
  return slug
    .split("-")
    .filter(Boolean)
    .map((w) => w[0]!.toUpperCase() + w.slice(1))
    .join(" ");
}

export function pageTitle(siteTitle: string, slug: string): string {
  return slug === "home" ? siteTitle : `${humanize(slug)} · ${siteTitle}`;
}

export function pageDescription(siteTitle: string, slug: string): string {
  return slug === "home"
    ? `${siteTitle} - built with Next.js, Tailwind CSS, and Framer Motion.`
    : `${humanize(slug)} page of ${siteTitle}.`;
}

/** SEO step: app/robots.ts + app/sitemap.ts, real Next.js metadata route handlers. */
export function buildSeoFiles(siteTitle: string, pageSlugs: string[]): Map<string, string> {
  const files = new Map<string, string>();

  files.set(
    "app/robots.ts",
    [
      `import type { MetadataRoute } from "next";`,
      "",
      `const SITE_URL = process.env.SITE_URL ?? "https://example.com";`,
      "",
      `export default function robots(): MetadataRoute.Robots {`,
      `  return {`,
      `    rules: { userAgent: "*", allow: "/" },`,
      `    sitemap: \`\${SITE_URL}/sitemap.xml\`,`,
      `  };`,
      `}`,
      "",
    ].join("\n"),
  );

  const routes = pageSlugs.map((slug) => (slug === "home" ? "" : `/${slug}`));
  files.set(
    "app/sitemap.ts",
    [
      `import type { MetadataRoute } from "next";`,
      "",
      `const SITE_URL = process.env.SITE_URL ?? "https://example.com";`,
      `const ROUTES = ${JSON.stringify(routes)};`,
      "",
      `export default function sitemap(): MetadataRoute.Sitemap {`,
      `  return ROUTES.map((route) => ({`,
      `    url: \`\${SITE_URL}\${route}\`,`,
      `    lastModified: new Date(),`,
      `  }));`,
      `}`,
      "",
    ].join("\n"),
  );

  return files;
}
