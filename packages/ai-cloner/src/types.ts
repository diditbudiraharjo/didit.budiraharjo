export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** A curated snapshot of one element's computed style, used as raw material for analysis. */
export interface ElementStyleSample {
  tag: string;
  classes: string[];
  text: string;
  rect: Rect;
  display: string;
  position: string;
  flexDirection: string;
  justifyContent: string;
  alignItems: string;
  gap: string;
  gridTemplateColumns: string;
  fontFamily: string;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
  letterSpacing: string;
  textAlign: string;
  color: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: string;
  borderRadius: string;
  boxShadow: string;
  margin: string;
  padding: string;
  transitionProperty: string;
  transitionDuration: string;
  transitionTimingFunction: string;
  animationName: string;
  animationDuration: string;
  opacity: string;
}

export interface SectionCapture {
  id: string;
  index: number;
  tag: string;
  selector: string;
  rect: Rect;
  html: string;
  elements: ElementStyleSample[];
}

export interface DomNode {
  tag: string;
  id?: string;
  classes?: string[];
  attrs?: Record<string, string>;
  textLength: number;
  children: DomNode[];
}

export interface CapturedResponse {
  buffer: Buffer;
  contentType: string;
}

export interface PageRender {
  url: string;
  title: string;
  html: string;
  domTree: DomNode;
  sections: SectionCapture[];
  captured: Map<string, CapturedResponse>;
  inlineCss: string[];
}

export type AssetCategory = "images" | "css" | "fonts" | "svg" | "icons";

export interface DownloadedAsset {
  sourceUrl: string;
  category: AssetCategory;
  localPath: string;
  contentType: string;
}

export interface AssetManifest {
  assets: DownloadedAsset[];
  html: string;
}

export interface LayoutAnalysis {
  containerDisplay: Record<string, number>;
  flexDirections: Record<string, number>;
  justifyContent: Record<string, number>;
  alignItems: Record<string, number>;
  gridColumnCounts: Record<string, number>;
  averageElementWidth: number;
  averageElementHeight: number;
  columns: number;
}

export interface TypographyAnalysis {
  fontFamilies: { value: string; count: number }[];
  fontSizes: { value: string; px: number; count: number }[];
  fontWeights: { value: string; count: number }[];
  lineHeights: { value: string; count: number }[];
  letterSpacings: { value: string; count: number }[];
  headingScale: string[];
}

export interface ColorAnalysis {
  palette: { value: string; count: number; role: "text" | "background" | "border" }[];
  primary: string | null;
  background: string | null;
  text: string | null;
}

export interface SpacingAnalysis {
  marginValues: { px: number; count: number }[];
  paddingValues: { px: number; count: number }[];
  scale: number[];
  baseUnit: number | null;
}

export interface AnimationAnalysis {
  transitions: { property: string; duration: string; timingFunction: string; count: number }[];
  keyframeAnimations: { name: string; duration: string; count: number }[];
  hasAnimation: boolean;
}

export interface UiComponentAnalysis {
  buttons: number;
  cards: number;
  navs: number;
  forms: number;
  inputs: number;
  images: number;
  headings: number;
  links: number;
  lists: number;
  detected: string[];
}

export interface SectionAnalysis {
  layout: LayoutAnalysis;
  typography: TypographyAnalysis;
  colors: ColorAnalysis;
  spacing: SpacingAnalysis;
  animation: AnimationAnalysis;
  components: UiComponentAnalysis;
}

export interface SectionJson {
  id: string;
  index: number;
  tag: string;
  selector: string;
  rect: Rect;
  screenshot: string;
  analysis: SectionAnalysis;
  prompt: string;
}

export interface PageOutput {
  url: string;
  slug: string;
  title: string;
  htmlPath: string;
  domPath: string;
  markdownPath: string;
  sections: SectionJson[];
}

export interface NextProjectSectionInput {
  id: string;
  tag: string;
  html: string;
  analysis: SectionAnalysis;
}

export interface NextProjectPageInput {
  slug: string;
  title: string;
  url: string;
  sections: NextProjectSectionInput[];
}

export interface PipelineOptions {
  url: string;
  outputDir: string;
  maxPages: number;
  timeoutMs: number;
  viewport: { width: number; height: number };
}

export interface PipelineResult {
  siteUrl: string;
  outputDir: string;
  pages: PageOutput[];
}
