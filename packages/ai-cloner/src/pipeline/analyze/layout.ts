import type { ElementStyleSample, LayoutAnalysis } from "../../types.js";
import { countFrequency } from "../../utils/frequency.js";

function toRecord(entries: { value: string; count: number }[]): Record<string, number> {
  return Object.fromEntries(entries.map((e) => [e.value, e.count]));
}

/** Step 9: layout analysis - display/flex/grid usage, average element size, estimated columns. */
export function analyzeLayout(elements: ElementStyleSample[]): LayoutAnalysis {
  const containerDisplay = countFrequency(elements.map((e) => e.display));
  const flexElements = elements.filter((e) => e.display.includes("flex"));
  const gridElements = elements.filter((e) => e.display.includes("grid"));

  const sized = elements.filter((e) => e.rect.width > 0 && e.rect.height > 0);
  const averageElementWidth = sized.length
    ? Math.round(sized.reduce((sum, e) => sum + e.rect.width, 0) / sized.length)
    : 0;
  const averageElementHeight = sized.length
    ? Math.round(sized.reduce((sum, e) => sum + e.rect.height, 0) / sized.length)
    : 0;

  const gridColumnCounts = countFrequency(
    gridElements
      .map((e) => e.gridTemplateColumns)
      .filter((v) => v && v !== "none")
      .map((v) => String(v.trim().split(/\s+/).length)),
  );

  const root = elements[0];
  let columns = 1;
  if (root) {
    if (root.display.includes("grid") && root.gridTemplateColumns !== "none") {
      columns = root.gridTemplateColumns.trim().split(/\s+/).length;
    } else if (root.display.includes("flex") && root.flexDirection.startsWith("row")) {
      const topRowThreshold = root.rect.y + 10;
      const directChildrenInRow = elements
        .slice(1)
        .filter((e) => e.rect.y <= topRowThreshold && e.rect.width > 0);
      columns = Math.max(1, directChildrenInRow.length);
    }
  }

  return {
    containerDisplay: toRecord(containerDisplay),
    flexDirections: toRecord(countFrequency(flexElements.map((e) => e.flexDirection))),
    justifyContent: toRecord(countFrequency(flexElements.map((e) => e.justifyContent))),
    alignItems: toRecord(countFrequency(flexElements.map((e) => e.alignItems))),
    gridColumnCounts: toRecord(gridColumnCounts),
    averageElementWidth,
    averageElementHeight,
    columns,
  };
}
