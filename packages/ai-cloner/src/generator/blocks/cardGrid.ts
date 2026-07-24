import type { SectionAnalysisBundle } from "../types.js";
import { responsiveGridCols } from "../tokens.js";
import { CARD_BODIES, CARD_TITLES, pick } from "../placeholderContent.js";

export function cardGridBlock(section: SectionAnalysisBundle): string {
  const count = Math.min(Math.max(section.components.cards || 3, 2), 6);
  const columns = section.layout.columns > 1 ? section.layout.columns : Math.min(count, 3);
  const gridCols = responsiveGridCols(columns);

  const cards = Array.from({ length: count }, (_, i) => {
    const title = pick(CARD_TITLES, i);
    const body = pick(CARD_BODIES, i);
    return [
      `        <Card key="${i}">`,
      `          <h3 className="text-lg font-semibold text-ink">${title}</h3>`,
      `          <p className="mt-2 text-sm text-muted">${body}</p>`,
      `        </Card>`,
    ].join("\n");
  });

  return [
    `<div className="py-16">`,
    `  <SectionHeading title="What you get" subtitle="Everything included, nothing extra." align="center" />`,
    `  <div className={\`mt-10 grid gap-6 ${gridCols}\`}>`,
    ...cards,
    `  </div>`,
    `</div>`,
  ].join("\n");
}
