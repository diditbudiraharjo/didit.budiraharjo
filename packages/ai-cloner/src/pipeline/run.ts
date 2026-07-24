import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { writeFilesToDisk } from "@website-cloner/core";
import { discoverPages } from "./crawl.js";
import { renderPage } from "./render.js";
import { downloadPageAssets, downloadInlineCss } from "./assets.js";
import { savePageFiles } from "./save.js";
import { buildSectionJson } from "./sectionJson.js";
import { generateNextProject } from "./nextProject.js";
import { stripSectionMarkers, extractSectionHtmlByIndex } from "./sections.js";
import { domainSlug, urlToSlug } from "../utils/slug.js";
import type {
  DownloadedAsset,
  NextProjectPageInput,
  NextProjectSectionInput,
  PageOutput,
  PipelineOptions,
  PipelineResult,
  SectionJson,
} from "../types.js";

export interface RunPipelineOptions extends PipelineOptions {
  firecrawlApiKey: string;
  onProgress?: (message: string) => void;
}

/** Orchestrates all 20 workflow steps for one site, from URL input to a saved output folder. */
export async function runPipeline(options: RunPipelineOptions): Promise<PipelineResult> {
  const log = options.onProgress ?? (() => {});
  const siteOutDir = join(options.outputDir, domainSlug(options.url));
  await mkdir(siteOutDir, { recursive: true });

  log(`Discovering pages via Firecrawl...`);
  const pageUrls = await discoverPages(options.url, options.firecrawlApiKey, options.maxPages);
  log(`Found ${pageUrls.length} page(s).`);

  const assetsByUrl = new Map<string, DownloadedAsset>();
  const pageOutputs: PageOutput[] = [];
  const nextProjectPages: NextProjectPageInput[] = [];
  let siteTitle = domainSlug(options.url);

  for (const [i, pageUrl] of pageUrls.entries()) {
    const slug = urlToSlug(pageUrl);
    const pageOutDir = join(siteOutDir, "pages", slug);
    log(`[${i + 1}/${pageUrls.length}] Rendering ${pageUrl} ...`);

    const render = await renderPage(pageUrl, pageOutDir, {
      timeoutMs: options.timeoutMs,
      viewport: options.viewport,
    });
    if (i === 0 && render.title) siteTitle = render.title;

    log(`  Downloading assets...`);
    const rewrittenHtml = await downloadPageAssets(render.html, render.url, render.captured, siteOutDir, assetsByUrl);
    await downloadInlineCss(render.inlineCss, render.url, render.captured, siteOutDir, assetsByUrl);
    const finalHtml = stripSectionMarkers(rewrittenHtml);

    log(`  Saving HTML/DOM/Markdown...`);
    const saved = await savePageFiles(pageOutDir, finalHtml, render.domTree, render.title);

    log(`  Analyzing ${render.sections.length} section(s)...`);
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

  log(`Generating Next.js + Tailwind + Framer Motion project...`);
  const nextFiles = await generateNextProject(siteTitle, nextProjectPages, [...assetsByUrl.values()], siteOutDir);
  await writeFilesToDisk(nextFiles, siteOutDir);

  const result: PipelineResult = { siteUrl: options.url, outputDir: siteOutDir, pages: pageOutputs };
  await writeFile(join(siteOutDir, "manifest.json"), JSON.stringify(result, null, 2));
  log(`Done. Output written to ${siteOutDir}`);

  return result;
}
