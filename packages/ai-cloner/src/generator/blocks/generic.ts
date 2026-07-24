import type { SectionAnalysisBundle } from "../types.js";

/** Fallback block for sections that don't match a more specific archetype - still built from the real extracted layout/typography/image counts, just less bespoke in structure. */
export function genericBlock(section: SectionAnalysisBundle): string {
  const hasImage = section.components.images > 0;
  const align = section.layout.columns > 1 ? "left" : "center";

  return [
    `<div className="py-16">`,
    `  <SectionHeading`,
    `    title="A closer look"`,
    `    subtitle="Details that matter, presented clearly."`,
    `    align="${align}"`,
    `  />`,
    hasImage ? `  <div className="mt-8 aspect-video w-full rounded-2xl bg-surface-2" />` : "",
    `</div>`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}
