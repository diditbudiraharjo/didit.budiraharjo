#!/usr/bin/env node
import { Command } from "commander";
import { resolve } from "node:path";
import { scrapeSite, generateProject, writeFilesToDisk } from "@website-cloner/core";

const program = new Command();

program
  .name("website-cloner")
  .description("Scrapes a live website and rebuilds it as an editable React project.")
  .version("0.1.0");

program
  .command("clone")
  .description("Clone a URL into a static preview and an editable React project")
  .argument("<url>", "URL of the site to clone")
  .option("-o, --out <dir>", "output directory", "./cloned-site")
  .option("-t, --timeout <ms>", "navigation timeout in milliseconds", "30000")
  .action(async (url: string, opts: { out: string; timeout: string }) => {
    const outDir = resolve(process.cwd(), opts.out);
    console.log(`Cloning ${url} ...`);

    const scrape = await scrapeSite(url, { timeoutMs: Number(opts.timeout) });
    console.log(
      `Captured "${scrape.pageTitle || "(untitled)"}" — ${scrape.assets.length} asset(s), ` +
        `${(scrape.css.length / 1024).toFixed(1)} KB of CSS.`,
    );

    const files = generateProject(scrape);
    await writeFilesToDisk(files, outDir);

    console.log(`\nDone. Wrote ${files.size} files to ${outDir}`);
    console.log(`  Preview:   open ${outDir}/preview/index.html in a browser`);
    console.log(`  React app: cd ${outDir}/react-app && npm install && npm run dev`);
  });

program.parseAsync(process.argv).catch((err) => {
  console.error("Clone failed:", err instanceof Error ? err.message : err);
  process.exitCode = 1;
});
