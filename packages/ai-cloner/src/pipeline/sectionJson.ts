import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { SectionCapture, SectionJson } from "../types.js";
import { analyzeSection } from "./analyze/index.js";
import { generateSectionPrompt } from "./prompt.js";

/**
 * Steps 15-16: analyzes one section and saves the AI Analyzer output - layout.json,
 * colors.json, typography.json, animation.json, spacing.json, component.json, and
 * prompt.json - to <pageOutDir>/sections/<section.id>/analysis/.
 */
export async function buildSectionJson(section: SectionCapture, pageOutDir: string): Promise<SectionJson> {
  const analysis = analyzeSection(section.elements);
  const prompt = generateSectionPrompt(section.id, section.tag, section.rect, analysis);

  const sectionJson: SectionJson = {
    id: section.id,
    index: section.index,
    tag: section.tag,
    selector: section.selector,
    rect: section.rect,
    screenshot: `screenshots/${section.id}.png`,
    analysis,
    prompt,
  };

  const analysisDir = join(pageOutDir, "sections", section.id, "analysis");
  await mkdir(analysisDir, { recursive: true });

  const writeJson = (fileName: string, data: unknown) =>
    writeFile(join(analysisDir, fileName), JSON.stringify(data, null, 2));

  await Promise.all([
    writeJson("layout.json", analysis.layout),
    writeJson("colors.json", analysis.colors),
    writeJson("typography.json", analysis.typography),
    writeJson("animation.json", analysis.animation),
    writeJson("spacing.json", analysis.spacing),
    writeJson("component.json", analysis.components),
    writeJson("prompt.json", {
      id: section.id,
      tag: section.tag,
      selector: section.selector,
      rect: section.rect,
      prompt,
    }),
  ]);

  return sectionJson;
}
