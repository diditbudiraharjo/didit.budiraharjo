import type { SectionAnalysisBundle } from "../types.js";

export function heroBlock(section: SectionAnalysisBundle): string {
  const showSecondaryCta = section.components.buttons >= 2;

  return [
    `<div className="flex flex-col items-center gap-6 py-20 text-center">`,
    `  <SectionHeading`,
    `    eyebrow="Welcome"`,
    `    title="Build something great"`,
    `    subtitle="A fast, modern foundation for whatever you're building next."`,
    `    align="center"`,
    `  />`,
    `  <div className="flex flex-wrap items-center justify-center gap-4">`,
    `    <Button variant="primary">Get Started</Button>`,
    showSecondaryCta ? `    <Button variant="secondary">Learn More</Button>` : "",
    `  </div>`,
    `</div>`,
  ]
    .filter((line) => line !== "")
    .join("\n");
}
