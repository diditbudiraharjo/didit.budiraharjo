#!/usr/bin/env node
import ora, { type Ora } from "ora";
import { resolve, join } from "node:path";
import { mkdir, writeFile } from "node:fs/promises";
import { writeFilesToDisk } from "@website-cloner/core";
import { loadConfig } from "./config.js";
import { discoverPages } from "./pipeline/crawl.js";
import { renderPage } from "./pipeline/render.js";
import { downloadPageAssets, downloadInlineCss } from "./pipeline/assets.js";
import { savePageFiles } from "./pipeline/save.js";
import { buildSectionJson } from "./pipeline/sectionJson.js";
import { generateNextProject } from "./pipeline/nextProject.js";
import { buildNextProject } from "./pipeline/buildProject.js";
import { stripSectionMarkers, extractSectionHtmlByIndex } from "./pipeline/sections.js";
import { domainSlug, urlToSlug } from "./utils/slug.js";
import type {
  DownloadedAsset,
  NextProjectPageInput,
  NextProjectSectionInput,
  PageOutput,
  PageRender,
  SectionJson,
} from "./types.js";

const url = process.argv[2];

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

if (!url) {
  fail("Usage: clone-site <url>\n\nExample: clone-site https://example.com");
}
try {
  new URL(url);
} catch {
  fail(`"${url}" is not a valid URL.`);
}

async function runStep<T>(label: string, work: (spinner: Ora) => Promise<T>): Promise<T> {
  const spinner = ora(label).start();
  try {
    const result = await work(spinner);
    spinner.succeed(label);
    return result;
  } catch (err) {
    spinner.fail(label);
    throw err instanceof Error ? err : new Error(String(err));
  }
}

async function main() {
  const config = loadConfig();
  const outputDir = resolve(process.cwd(), "output");
  const siteOutDir = join(outputDir, domainSlug(url));
  await mkdir(siteOutDir, { recursive: true });

  console.log(`\nclone-site  →  ${url}\n`);

  const pageRenders: PageRender[] = [];

  await runStep("Crawl Website", async (spinner) => {
    const pageUrls = await discoverPages(url, config.firecrawlApiKey, config.maxPages);
    for (const [i, pageUrl] of pageUrls.entries()) {
      spinner.text = `Crawl Website (${i + 1}/${pageUrls.length}) ${pageUrl}`;
      const pageOutDir = join(siteOutDir, "pages", urlToSlug(pageUrl));
      const render = await renderPage(pageUrl, pageOutDir, {
        timeoutMs: config.timeoutMs,
        viewport: config.viewport,
      });
      pageRenders.push(render);
    }
    return pageRenders.length;
  });

  const assetsByUrl = new Map<string, DownloadedAsset>();
  const pageOutputs: PageOutput[] = [];
  const nextProjectPages: NextProjectPageInput[] = [];
  let siteTitle = domainSlug(url);
  const rewrittenHtmlByUrl = new Map<string, string>();

  await runStep("Download Asset", async () => {
    for (const render of pageRenders) {
      const rewritten = await downloadPageAssets(render.html, render.url, render.captured, siteOutDir, assetsByUrl);
      await downloadInlineCss(render.inlineCss, render.url, render.captured, siteOutDir, assetsByUrl);
      rewrittenHtmlByUrl.set(render.url, rewritten);
    }
  });

  const screenshotCount = pageRenders.reduce((sum, r) => sum + r.sections.length, 0);
  await runStep(`Screenshot (${screenshotCount} section(s))`, async () => {
    // Captured during the Crawl Website step (one page visit yields DOM + section
    // screenshots together) - files already exist on disk at this point.
  });

  const allSectionJsons: SectionJson[][] = [];
  await runStep("Analyze Layout", async () => {
    for (const [i, render] of pageRenders.entries()) {
      if (i === 0 && render.title) siteTitle = render.title;
      const slug = urlToSlug(render.url);
      const pageOutDir = join(siteOutDir, "pages", slug);
      const rewrittenHtml = rewrittenHtmlByUrl.get(render.url)!;
      const finalHtml = stripSectionMarkers(rewrittenHtml);
      const saved = await savePageFiles(pageOutDir, finalHtml, render.domTree, render.title);

      const sectionJsons: SectionJson[] = [];
      const nextSections: NextProjectSectionInput[] = [];
      for (const section of render.sections) {
        const sectionJson = await buildSectionJson(section, pageOutDir);
        sectionJsons.push(sectionJson);
        const rewrittenSectionHtml = stripSectionMarkers(extractSectionHtmlByIndex(rewrittenHtml, section.index));
        nextSections.push({
          id: section.id,
          tag: section.tag,
          html: rewrittenSectionHtml,
          analysis: sectionJson.analysis,
        });
      }
      allSectionJsons.push(sectionJsons);

      pageOutputs.push({
        url: render.url,
        slug,
        title: render.title,
        htmlPath: saved.htmlPath,
        domPath: saved.domPath,
        markdownPath: saved.markdownPath,
        sections: sectionJsons,
      });
      nextProjectPages.push({ slug, title: render.title, url: render.url, sections: nextSections });
    }
  });

  await runStep("Analyze Animation", async () => {
    // Computed together with layout/typography/color/spacing above (one pass per section);
    // ticked separately here since it's a distinct, real part of that analysis.
  });

  await runStep("Generate Prompt", async () => {
    // Written to pages/<slug>/sections/<section-id>/analysis/prompt.json above.
  });

  const nextAppDir = join(siteOutDir, "next-app");

  await runStep("Generate NextJS", async () => {
    const nextFiles = await generateNextProject(siteTitle, nextProjectPages, [...assetsByUrl.values()], siteOutDir);
    await writeFilesToDisk(nextFiles, siteOutDir);
  });

  await runStep("Generate Tailwind", async () => {
    // tailwind.config.ts (theme populated from the extracted colors/fonts/spacing) was
    // written as part of Generate NextJS above.
  });

  await runStep("Generate Framer Motion", async () => {
    // Motion-wrapped section components were written as part of Generate NextJS above.
  });

  await runStep("Build Project", () => buildNextProject(nextAppDir));

  const totalSections = pageOutputs.reduce((sum, p) => sum + p.sections.length, 0);
  await writeFile(
    join(siteOutDir, "manifest.json"),
    JSON.stringify({ siteUrl: url, outputDir: siteOutDir, pages: pageOutputs }, null, 2),
  );

  console.log(`\nDone. ${pageOutputs.length} page(s), ${totalSections} section(s).`);
  console.log(`  Output:  ${siteOutDir}`);
  console.log(`  Next.js: cd ${nextAppDir} && npm run dev`);
}

main().catch((err) => {
  console.error(`\n${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
