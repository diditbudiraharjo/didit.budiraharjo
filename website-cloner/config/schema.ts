// Shape of a single crawled page, as written to crawl/json/<page>.json.
export interface PageRecord {
  url: string;
  title: string;
  markdown: string;
  html: string;
  metadata: Record<string, unknown>;
  links: string[];
}

// Recognized section/component categories a page can be broken into.
export type SectionType =
  | "Navbar"
  | "Hero"
  | "Feature Card"
  | "Pricing Card"
  | "FAQ"
  | "Timeline"
  | "Footer"
  | "CTA"
  | "Gallery"
  | "Animated Background";

// Shape of a single UI section's analysis, as written to
// analysis/ui/<section>.json.
export interface SectionAnalysis {
  section: SectionType;
  layout: string;
  background: string;
  buttons: string[];
  cards: number;
  animation: string;
  typography: {
    heading: string;
    body: string;
  };
}
