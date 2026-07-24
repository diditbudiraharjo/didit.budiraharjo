// Shape of a single crawled page, as written to crawl/json/<page>.json.
export interface PageRecord {
  url: string;
  title: string;
  markdown: string;
  html: string;
  metadata: Record<string, unknown>;
  links: string[];
}
