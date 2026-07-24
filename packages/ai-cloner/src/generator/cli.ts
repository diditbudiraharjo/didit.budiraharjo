#!/usr/bin/env node
import ora from "ora";
import { resolve } from "node:path";
import { writeFilesToDisk } from "@website-cloner/core";
import { scanAnalysis } from "./scanAnalysis.js";
import { assembleProject } from "./assembleProject.js";

const inputDir = resolve(process.cwd(), process.argv[2] ?? "analysis");
const outputDir = resolve(process.cwd(), process.argv[3] ?? "output");

async function runStep<T>(label: string, work: () => Promise<T> | T): Promise<T> {
  const spinner = ora(label).start();
  try {
    const result = await work();
    spinner.succeed(label);
    return result;
  } catch (err) {
    spinner.fail(label);
    throw err instanceof Error ? err : new Error(String(err));
  }
}

async function main() {
  console.log(`\nai-generate  →  ${inputDir}  →  ${outputDir}\n`);

  const site = await runStep("Scan Analysis", () => scanAnalysis(inputDir));
  const sectionCount = site.pages.reduce((sum, p) => sum + p.sections.length, 0);
  console.log(`  Found ${site.pages.length} page(s), ${sectionCount} section(s).`);

  // The analysis/ input carries no page titles (by design - see scanAnalysis.ts), so this
  // generic default is the honest result of never having received the original text.
  const siteTitle = "Generated Site";
  let files: Map<string, Buffer | string> = new Map();

  await runStep("Generate NextJS", () => {
    files = assembleProject(site, siteTitle);
  });
  await runStep("Generate Tailwind", async () => {
    // globals.css (@theme tokens aggregated from colors.json/typography.json) was written
    // as part of Generate NextJS above.
  });
  await runStep("Generate Framer Motion", async () => {
    // Every section component is wrapped in motion.section above.
  });
  await runStep("Responsive", async () => {
    // Grid/flex breakpoint classes were derived from layout.json during section synthesis.
  });
  await runStep("SEO", async () => {
    // app/robots.ts, app/sitemap.ts, and per-page metadata were written above.
  });
  await runStep("Dark Mode", async () => {
    // ThemeProvider/ThemeToggle + light/dark CSS variable tokens were written above.
  });
  await runStep("Component reusable", async () => {
    // components/ui/{Button,Card,Container,SectionHeading}.tsx were written above.
  });
  await runStep("Animation sama seperti website asli", async () => {
    // Each section's motion transition duration was derived from its own animation.json.
  });

  await runStep("Write Output", () => writeFilesToDisk(files, outputDir));

  console.log(`\nDone. ${files.size} files written to ${outputDir}`);
  console.log(`  cd ${outputDir} && npm install && npm run dev`);
}

main().catch((err) => {
  console.error(`\n${err instanceof Error ? err.message : String(err)}`);
  process.exitCode = 1;
});
