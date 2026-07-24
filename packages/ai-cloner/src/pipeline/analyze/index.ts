import type { ElementStyleSample, SectionAnalysis } from "../../types.js";
import { analyzeLayout } from "./layout.js";
import { analyzeTypography } from "./typography.js";
import { analyzeColors } from "./colors.js";
import { analyzeSpacing } from "./spacing.js";
import { analyzeAnimation } from "./animation.js";
import { analyzeComponents } from "./components.js";

/** Steps 9-14: runs the full layout/typography/color/spacing/animation/component analysis for one section. */
export function analyzeSection(elements: ElementStyleSample[]): SectionAnalysis {
  return {
    layout: analyzeLayout(elements),
    typography: analyzeTypography(elements),
    colors: analyzeColors(elements),
    spacing: analyzeSpacing(elements),
    animation: analyzeAnimation(elements),
    components: analyzeComponents(elements),
  };
}
