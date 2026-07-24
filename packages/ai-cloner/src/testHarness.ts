import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { writeFilesToDisk } from "@website-cloner/core";
import { renderPage } from "./pipeline/render.js";
import { downloadPageAssets, downloadInlineCss } from "./pipeline/assets.js";
import { savePageFiles } from "./pipeline/save.js";
import { buildSectionJson } from "./pipeline/sectionJson.js";
import { generateNextProject } from "./pipeline/nextProject.js";
import { stripSectionMarkers, extractSectionHtmlByIndex } from "./pipeline/sections.js";
import { domainSlug, urlToSlug } from "./utils/slug.js";
import type { DownloadedAsset, NextProjectPageInput, NextProjectSectionInput, PageOutput, SectionJson } from "./types.js";

// TEST-ONLY harness: exercises the exact same pipeline as run.ts/cli.ts, minus the Firecrawl
// discovery call (unreachable from this sandbox's network policy - discoverPages() itself is
// two lines wrapping firecrawl.map() and is not what needs validating here). Not part of the
// shipped package; not referenced by cli.ts.
const pageUrls = process.argv.slice(2);
if (pageUrls.length === 0) {
  console.error("usage: node dist/testHarness.js <url1> <url2> ...");
  process.exit(1);
}

const outputDir = resolve("./test-output");
function resolve(p: string) {
  return join(process.cwd(), p);
}

async function main() {
  const siteUrl = pageUrls[0]!;
  const siteOutDir = join(outputDir, domainSlug(siteUrl));
  await mkdir(siteOutDir, { recursive: true });

  const assetsByUrl = new Map<string, DownloadedAsset>();
  const pageOutputs: PageOutput[] = [];
  const nextProjectPages: NextProjectPageInput[] = [];
  let siteTitle = domainSlug(siteUrl);

  for (const [i, pageUrl] of pageUrls.entries()) {
    const slug = urlToSlug(pageUrl);
    const pageOutDir = join(siteOutDir, "pages", slug);
    console.log(`[${i + 1}/${pageUrls.length}] Rendering ${pageUrl} ...`);

    const render = await renderPage(pageUrl, pageOutDir, {
      timeoutMs: 30_000,
      viewport: { width: 1440, height: 900 },
    });
    if (i === 0 && render.title) siteTitle = render.title;
    console.log(`  title="${render.title}" sections=${render.sections.length}`);

    const rewrittenHtml = await downloadPageAssets(render.html, render.url, render.captured, siteOutDir, assetsByUrl);
    await downloadInlineCss(render.inlineCss, render.url, render.captured, siteOutDir, assetsByUrl);
    const finalHtml = stripSectionMarkers(rewrittenHtml);
    const saved = await savePageFiles(pageOutDir, finalHtml, render.domTree, render.title);

    const sectionJsons: SectionJson[] = [];
    const nextSections: NextProjectSectionInput[] = [];
    for (const section of render.sections) {
      const sectionJson = await buildSectionJson(section, pageOutDir);
      sectionJsons.push(sectionJson);
      const rewrittenSectionHtml = stripSectionMarkers(extractSectionHtmlByIndex(rewrittenHtml, section.index));
      nextSections.push({ id: section.id, tag: section.tag, html: rewrittenSectionHtml, analysis: sectionJson.analysis });
    }

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

  console.log("Generating Next.js project...");
  const nextFiles = await generateNextProject(siteTitle, nextProjectPages, [...assetsByUrl.values()], siteOutDir);
  await writeFilesToDisk(nextFiles, siteOutDir);

  await writeFile(
    join(siteOutDir, "manifest.json"),
    JSON.stringify({ siteUrl, outputDir: siteOutDir, pages: pageOutputs }, null, 2),
  );

  console.log(`Done. Output at ${siteOutDir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
