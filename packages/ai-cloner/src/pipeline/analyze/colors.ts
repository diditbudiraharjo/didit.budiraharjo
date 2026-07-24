import type { ColorAnalysis, ElementStyleSample } from "../../types.js";
import { countFrequency } from "../../utils/frequency.js";
import { isNeutral, isTransparent } from "../../utils/color.js";

/** Step 11: color analysis - a frequency-ranked palette plus a best-guess primary/background/text. */
export function analyzeColors(elements: ElementStyleSample[]): ColorAnalysis {
  const textColors = countFrequency(elements.filter((e) => e.text.length > 0).map((e) => e.color));
  const backgroundColors = countFrequency(
    elements.map((e) => e.backgroundColor).filter((c) => !isTransparent(c)),
  );
  const borderColors = countFrequency(
    elements.filter((e) => Number(e.borderWidth.replace("px", "")) > 0).map((e) => e.borderColor).filter((c) => !isTransparent(c)),
  );

  const palette = [
    ...textColors.map((c) => ({ ...c, role: "text" as const })),
    ...backgroundColors.map((c) => ({ ...c, role: "background" as const })),
    ...borderColors.map((c) => ({ ...c, role: "border" as const })),
  ].sort((a, b) => b.count - a.count);

  const primaryCandidate =
    [...backgroundColors, ...textColors].find((c) => !isNeutral(c.value)) ?? null;

  return {
    palette,
    primary: primaryCandidate?.value ?? null,
    background: backgroundColors[0]?.value ?? null,
    text: textColors[0]?.value ?? null,
  };
}
