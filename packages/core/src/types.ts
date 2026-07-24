export interface ClonedAsset {
  /** Original absolute URL of the asset. */
  sourceUrl: string;
  /** Path relative to the output root, e.g. "assets/logo-a1b2c3.png". */
  localPath: string;
  data: Buffer;
  contentType: string;
}

export interface ScrapeResult {
  sourceUrl: string;
  pageTitle: string;
  /** Full document HTML with asset URLs rewritten to local relative paths. */
  html: string;
  /** Combined CSS collected from <style> tags and stylesheet links, with url() rewritten. */
  css: string;
  assets: ClonedAsset[];
}

export interface CloneOptions {
  /** Timeout in ms for page navigation. Default 30000. */
  timeoutMs?: number;
  /** Viewport used while rendering. Default 1440x900. */
  viewport?: { width: number; height: number };
}

export interface GeneratedProject {
  /** Files to write, keyed by path relative to the output root. */
  files: Map<string, Buffer | string>;
}
