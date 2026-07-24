import type { ElementStyleSample, SpacingAnalysis } from "../../types.js";

const PX_RE = /(-?\d+(?:\.\d+)?)px/g;

function extractPxValues(value: string): number[] {
  return [...value.matchAll(PX_RE)].map((m) => Number(m[1])).filter((n) => n > 0);
}

function tallyValues(values: number[]): { px: number; count: number }[] {
  const counts = new Map<number, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()]
    .map(([px, count]) => ({ px, count }))
    .sort((a, b) => b.count - a.count);
}

/** Step 12: spacing analysis - a frequency-ranked margin/padding value list plus an inferred spacing scale. */
export function analyzeSpacing(elements: ElementStyleSample[]): SpacingAnalysis {
  const marginValues = tallyValues(elements.flatMap((e) => extractPxValues(e.margin)));
  const paddingValues = tallyValues(elements.flatMap((e) => extractPxValues(e.padding)));

  const scale = [...new Set([...marginValues, ...paddingValues].map((v) => v.px))]
    .sort((a, b) => a - b)
    .slice(0, 12);

  const smallFrequent = [...marginValues, ...paddingValues]
    .filter((v) => v.px > 0 && v.px <= 16)
    .sort((a, b) => b.count - a.count)[0];

  return { marginValues, paddingValues, scale, baseUnit: smallFrequent?.px ?? null };
}
