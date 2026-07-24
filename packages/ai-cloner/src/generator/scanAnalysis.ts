import { readdir, readFile } from "node:fs/promises";
import { basename, dirname, join, sep } from "node:path";
import type { PageAnalysisBundle, SectionAnalysisBundle, SiteAnalysisInput } from "./types.js";

const REQUIRED_FILES = ["layout.json", "colors.json", "typography.json", "animation.json", "spacing.json", "component.json", "prompt.json"];

async function findAnalysisDirs(root: string): Promise<string[]> {
  const found: string[] = [];

  async function walk(dir: string) {
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      const full = join(dir, entry.name);
      if (entry.name === "analysis") {
        found.push(full);
      } else {
        await walk(full);
      }
    }
  }

  await walk(root);
  return found.sort();
}

async function readSectionBundle(analysisDir: string): Promise<SectionAnalysisBundle> {
  const [layout, colors, typography, animation, spacing, components, promptFile] = await Promise.all(
    REQUIRED_FILES.map((f) => readFile(join(analysisDir, f), "utf8").then((t) => JSON.parse(t))),
  );

  return {
    id: promptFile.id ?? basename(dirname(analysisDir)),
    tag: promptFile.tag ?? "section",
    rect: promptFile.rect ?? { x: 0, y: 0, width: 0, height: 0 },
    layout,
    colors,
    typography,
    animation,
    spacing,
    components,
    prompt: promptFile.prompt ?? "",
  };
}

/** Extracts the page slug from an .../pages/<slug>/sections/<id>/analysis path, defaulting to "home". */
function pageSlugFor(analysisDir: string): string {
  const segments = analysisDir.split(sep);
  const pagesIndex = segments.lastIndexOf("pages");
  if (pagesIndex !== -1 && segments[pagesIndex + 1]) return segments[pagesIndex + 1]!;
  return "home";
}

function sectionOrder(id: string): number {
  const match = /(\d+)/.exec(id);
  return match ? Number(match[1]) : 0;
}

/**
 * AI Generator input step: recursively scans `root` for every analysis/ folder (as written
 * by the AI Analyzer - layout.json, colors.json, typography.json, animation.json,
 * spacing.json, component.json, prompt.json) and reconstructs the page/section structure
 * from folder names alone. Never reads page.html, dom.json, or any other file that carries
 * the original site's markup or text - only these seven analysis files.
 */
export async function scanAnalysis(root: string): Promise<SiteAnalysisInput> {
  const analysisDirs = await findAnalysisDirs(root);
  if (analysisDirs.length === 0) {
    throw new Error(`No analysis/ folders found under ${root}. Run the AI Analyzer first.`);
  }

  const pageMap = new Map<string, SectionAnalysisBundle[]>();
  for (const dir of analysisDirs) {
    const bundle = await readSectionBundle(dir);
    const slug = pageSlugFor(dir);
    const sections = pageMap.get(slug) ?? [];
    sections.push(bundle);
    pageMap.set(slug, sections);
  }

  const pages: PageAnalysisBundle[] = [...pageMap.entries()].map(([slug, sections]) => ({
    slug,
    sections: sections.sort((a, b) => sectionOrder(a.id) - sectionOrder(b.id)),
  }));

  return { pages: pages.sort((a, b) => (a.slug === "home" ? -1 : b.slug === "home" ? 1 : a.slug.localeCompare(b.slug))) };
}
