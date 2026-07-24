import type { ElementStyleSample, TypographyAnalysis } from "../../types.js";
import { countFrequency, parsePx } from "../../utils/frequency.js";

const HEADING_TAGS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);

/** Step 10: typography analysis - font families, size/weight/line-height/letter-spacing usage. */
export function analyzeTypography(elements: ElementStyleSample[]): TypographyAnalysis {
  const textElements = elements.filter((e) => e.text.length > 0);

  const fontSizeCounts = countFrequency(textElements.map((e) => e.fontSize));
  const fontSizes = fontSizeCounts.map((f) => ({
    value: f.value,
    px: parsePx(f.value) ?? 0,
    count: f.count,
  }));

  const headingSizes = [
    ...new Set(
      elements
        .filter((e) => HEADING_TAGS.has(e.tag))
        .map((e) => parsePx(e.fontSize))
        .filter((px): px is number => px !== null),
    ),
  ].sort((a, b) => b - a);

  return {
    fontFamilies: countFrequency(textElements.map((e) => e.fontFamily)),
    fontSizes,
    fontWeights: countFrequency(textElements.map((e) => e.fontWeight)),
    lineHeights: countFrequency(textElements.map((e) => e.lineHeight)),
    letterSpacings: countFrequency(textElements.map((e) => e.letterSpacing)),
    headingScale: headingSizes.map((px) => `${px}px`),
  };
}
