import type {
  AnimationAnalysis,
  ColorAnalysis,
  LayoutAnalysis,
  Rect,
  SpacingAnalysis,
  TypographyAnalysis,
  UiComponentAnalysis,
} from "../types.js";

/** One section's worth of pure design-spec data - never the site's original markup or text. */
export interface SectionAnalysisBundle {
  id: string;
  tag: string;
  rect: Rect;
  layout: LayoutAnalysis;
  colors: ColorAnalysis;
  typography: TypographyAnalysis;
  animation: AnimationAnalysis;
  spacing: SpacingAnalysis;
  components: UiComponentAnalysis;
  prompt: string;
}

export interface PageAnalysisBundle {
  slug: string;
  sections: SectionAnalysisBundle[];
}

export interface SiteAnalysisInput {
  pages: PageAnalysisBundle[];
}
