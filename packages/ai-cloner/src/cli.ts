#!/usr/bin/env node
import { Command } from "commander";
import { resolve } from "node:path";
import { loadConfig } from "./config.js";
import { runPipeline } from "./pipeline/run.js";

const program = new Command();

program
  .name("ai-cloner")
  .description(
    "Crawls a site with Firecrawl, renders every page with Playwright, downloads its assets, " +
      "analyzes each section's design, and generates a Next.js + Tailwind + Framer Motion clone.",
  )
  .version("0.1.0")
  .argument("<url>", "URL of the site to clone")
  .option("-o, --out <dir>", "output directory", "./output")
  .option("-m, --max-pages <n>", "maximum number of pages to discover via Firecrawl")
  .option("-t, --timeout <ms>", "per-page navigation timeout in milliseconds")
  .action(async (url: string, opts: { out: string; maxPages?: string; timeout?: string }) => {
    const config = loadConfig();
    const outputDir = resolve(process.cwd(), opts.out);
    const maxPages = opts.maxPages ? Number(opts.maxPages) : config.maxPages;
    const timeoutMs = opts.timeout ? Number(opts.timeout) : config.timeoutMs;

    console.log(`AI Website Cloner`);
    console.log(`  URL:        ${url}`);
    console.log(`  Output:     ${outputDir}`);
    console.log(`  Max pages:  ${maxPages}\n`);

    const result = await runPipeline({
      url,
      outputDir,
      maxPages,
      timeoutMs,
      viewport: config.viewport,
      firecrawlApiKey: config.firecrawlApiKey,
      onProgress: (message) => console.log(message),
    });

    const totalSections = result.pages.reduce((sum, p) => sum + p.sections.length, 0);
    console.log(`\nCloned ${result.pages.length} page(s), ${totalSections} section(s).`);
    console.log(`Output: ${result.outputDir}`);
    console.log(`  Pages:     ${result.outputDir}/pages/<slug>/{page.html,dom.json,page.md,sections/,screenshots/}`);
    console.log(`  Next.js:   cd ${result.outputDir}/next-app && npm install && npm run dev`);
  });

program.parseAsync(process.argv).catch((err) => {
  console.error("ai-cloner failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
