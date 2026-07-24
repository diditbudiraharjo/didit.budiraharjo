import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { SectionCapture, SectionJson } from "../types.js";
import { analyzeSection } from "./analyze/index.js";
import { generateSectionPrompt } from "./prompt.js";

/** Steps 15-16: builds and saves the per-section JSON spec (analysis + AI prompt) for one section. */
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

  const dir = join(pageOutDir, "sections");
  await mkdir(dir, { recursive: true });
  await writeFile(join(dir, `${section.id}.json`), JSON.stringify(sectionJson, null, 2));
  await writeFile(join(dir, `${section.id}.prompt.txt`), prompt);

  return sectionJson;
}
