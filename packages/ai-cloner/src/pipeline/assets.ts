import { parse, defaultTreeAdapter, type DefaultTreeAdapterMap } from "parse5";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import type { AssetCategory, CapturedResponse, DownloadedAsset } from "../types.js";

type Node = DefaultTreeAdapterMap["node"];
type Element = DefaultTreeAdapterMap["element"];
type Document = DefaultTreeAdapterMap["document"];

function isElement(node: Node): node is Element {
  return defaultTreeAdapter.isElementNode(node);
}

function attr(el: Element, name: string): string | undefined {
  return el.attrs.find((a) => a.name === name)?.value;
}

function walkElements(node: Node, visit: (el: Element) => void) {
  if (isElement(node)) visit(node);
  if ("childNodes" in node) {
    (node.childNodes as Node[]).forEach((child) => walkElements(child, visit));
  }
}

const FONT_EXTENSIONS = /\.(woff2?|ttf|otf|eot)(\?.*)?$/i;
const CSS_EXTENSIONS = /\.css(\?.*)?$/i;
const SVG_EXTENSIONS = /\.svg(\?.*)?$/i;
const IMAGE_EXTENSIONS = /\.(png|jpe?g|gif|webp|avif|bmp|ico)(\?.*)?$/i;

function categorize(url: string, contentType: string): AssetCategory {
  const type = contentType.split(";")[0]?.trim().toLowerCase() ?? "";
  if (type === "text/css" || CSS_EXTENSIONS.test(url)) return "css";
  if (type.startsWith("font/") || type.includes("font") || FONT_EXTENSIONS.test(url)) return "fonts";
  if (type === "image/svg+xml" || SVG_EXTENSIONS.test(url)) return "svg";
  if (type.startsWith("image/") || IMAGE_EXTENSIONS.test(url)) return "images";
  return "images";
}

const EXT_BY_CONTENT_TYPE: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "image/svg+xml": "svg",
  "text/css": "css",
  "font/woff2": "woff2",
  "font/woff": "woff",
  "font/ttf": "ttf",
  "font/otf": "otf",
};

function extFromUrl(url: string): string | undefined {
  try {
    return /\.([a-z0-9]{2,5})(?:\?.*)?$/i.exec(new URL(url).pathname)?.[1]?.toLowerCase();
  } catch {
    return undefined;
  }
}

function fileNameFor(url: string, contentType: string): string {
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 10);
  const ext = EXT_BY_CONTENT_TYPE[contentType.split(";")[0]?.trim().toLowerCase() ?? ""] ?? extFromUrl(url) ?? "bin";
  return `${hash}.${ext}`;
}

type Fetcher = (absoluteUrl: string, forceCategory?: AssetCategory) => Promise<DownloadedAsset | undefined>;

function makeFetcher(
  captured: Map<string, CapturedResponse>,
  assetsByUrl: Map<string, DownloadedAsset>,
  siteOutDir: string,
): Fetcher {
  return async (absoluteUrl, forceCategory) => {
    const existing = assetsByUrl.get(absoluteUrl);
    if (existing) return existing;

    let buffer: Buffer;
    let contentType: string;
    const hit = captured.get(absoluteUrl);
    if (hit) {
      buffer = hit.buffer;
      contentType = hit.contentType;
    } else {
      try {
        const res = await fetch(absoluteUrl, { headers: { "user-agent": "Mozilla/5.0 AiWebsiteCloner/0.1" } });
        if (!res.ok) return undefined;
        contentType = res.headers.get("content-type") ?? "";
        buffer = Buffer.from(await res.arrayBuffer());
      } catch {
        return undefined;
      }
    }

    const category = forceCategory ?? categorize(absoluteUrl, contentType);
    const localPath = `assets/${category}/${fileNameFor(absoluteUrl, contentType)}`;
    const fullPath = join(siteOutDir, localPath);
    await mkdir(dirname(fullPath), { recursive: true });
    await writeFile(fullPath, buffer);

    const asset: DownloadedAsset = { sourceUrl: absoluteUrl, category, localPath, contentType };
    assetsByUrl.set(absoluteUrl, asset);
    return asset;
  };
}

const CSS_URL_RE = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;

/** Downloads and rewrites every url() found in `cssText`, relative to `cssSourceUrl`. */
async function rewriteCssUrls(cssText: string, cssSourceUrl: string, fetcher: Fetcher): Promise<string> {
  const matches = [...cssText.matchAll(CSS_URL_RE)];
  if (matches.length === 0) return cssText;

  let rewritten = cssText;
  for (const match of matches) {
    const original = match[2]!;
    if (original.startsWith("data:")) continue;
    try {
      const absolute = new URL(original, cssSourceUrl).toString();
      const downloaded = await fetcher(absolute);
      if (downloaded) {
        const fileName = downloaded.localPath.split("/").pop();
        rewritten = rewritten.split(match[0]).join(`url("../${downloaded.category}/${fileName}")`);
      }
    } catch {
      // Leave unresolvable url()s untouched.
    }
  }
  return rewritten;
}

/** Rewrites url()s referenced from inside one already-downloaded external CSS file, in place. */
async function processCssAsset(
  asset: DownloadedAsset,
  cssSourceUrl: string,
  fetcher: Fetcher,
  siteOutDir: string,
): Promise<void> {
  const fullPath = join(siteOutDir, asset.localPath);
  const cssText = await readFile(fullPath, "utf8");
  const rewritten = await rewriteCssUrls(cssText, cssSourceUrl, fetcher);
  if (rewritten !== cssText) await writeFile(fullPath, rewritten);
}

/**
 * Step 4 (inline <style> tags): these have no URL of their own to fetch - the content is
 * already in hand from render.ts - but they're just as much a "public asset" as a linked
 * stylesheet, and any url() they contain still needs downloading/rewriting. Writes one CSS
 * file per non-empty inline block and returns the resulting DownloadedAsset entries so they
 * get deduped and linked the same way as external stylesheets.
 */
export async function downloadInlineCss(
  inlineCssTexts: string[],
  baseUrl: string,
  captured: Map<string, CapturedResponse>,
  siteOutDir: string,
  assetsByUrl: Map<string, DownloadedAsset>,
): Promise<DownloadedAsset[]> {
  const fetcher = makeFetcher(captured, assetsByUrl, siteOutDir);
  const results: DownloadedAsset[] = [];

  for (const cssText of inlineCssTexts) {
    const syntheticUrl = `inline-style:${createHash("sha1").update(cssText).digest("hex").slice(0, 16)}`;
    const existing = assetsByUrl.get(syntheticUrl);
    if (existing) {
      results.push(existing);
      continue;
    }

    const localPath = `assets/css/${fileNameForInline(cssText)}`;
    const fullPath = join(siteOutDir, localPath);
    await mkdir(dirname(fullPath), { recursive: true });
    const rewritten = await rewriteCssUrls(cssText, baseUrl, fetcher);
    await writeFile(fullPath, rewritten);

    const asset: DownloadedAsset = { sourceUrl: syntheticUrl, category: "css", localPath, contentType: "text/css" };
    assetsByUrl.set(syntheticUrl, asset);
    results.push(asset);
  }

  return results;
}

function fileNameForInline(cssText: string): string {
  return `inline-${createHash("sha1").update(cssText).digest("hex").slice(0, 10)}.css`;
}

interface PendingReplacement {
  original: string;
  assetPromise: Promise<DownloadedAsset | undefined>;
  isStylesheet: boolean;
}

const ICON_REL_RE = /\bicon\b/i;

function collectPendingReplacements(
  document: Document,
  baseUrl: string,
  fetcher: Fetcher,
): PendingReplacement[] {
  const pending: PendingReplacement[] = [];
  const resolve = (value: string) => {
    try {
      return new URL(value, baseUrl).toString();
    } catch {
      return undefined;
    }
  };

  const queue = (rawValue: string | undefined, forceCategory?: AssetCategory, isStylesheet = false) => {
    if (!rawValue || rawValue.startsWith("data:") || rawValue.startsWith("#")) return;
    const absolute = resolve(rawValue);
    if (!absolute) return;
    pending.push({ original: rawValue, assetPromise: fetcher(absolute, forceCategory), isStylesheet });
  };

  walkElements(document, (el) => {
    if (el.tagName === "link") {
      const rel = attr(el, "rel") ?? "";
      const isIcon = ICON_REL_RE.test(rel);
      const isStylesheet = /\bstylesheet\b/i.test(rel);
      if (isIcon || isStylesheet) queue(attr(el, "href"), isIcon ? "icons" : undefined, isStylesheet);
    } else if (el.tagName === "img" || el.tagName === "source") {
      queue(attr(el, "src"));
      const srcset = attr(el, "srcset");
      if (srcset) {
        for (const entry of srcset.split(",")) {
          queue(entry.trim().split(/\s+/)[0]);
        }
      }
    } else if (el.tagName === "image" || el.tagName === "use") {
      queue(attr(el, "href") ?? attr(el, "xlink:href"));
    }
  });

  return pending;
}

/**
 * Step 4: downloads every public asset a page references (images, css, fonts, svg, icons)
 * into siteOutDir/assets/<category>/, deduping across pages via the shared assetsByUrl map,
 * and returns this page's HTML with every reference rewritten to the local, downloaded path.
 */
export async function downloadPageAssets(
  html: string,
  baseUrl: string,
  captured: Map<string, CapturedResponse>,
  siteOutDir: string,
  assetsByUrl: Map<string, DownloadedAsset>,
): Promise<string> {
  const fetcher = makeFetcher(captured, assetsByUrl, siteOutDir);
  const document = parse(html);
  const pending = collectPendingReplacements(document, baseUrl, fetcher);

  let rewritten = html;
  for (const { original, assetPromise, isStylesheet } of pending) {
    const asset = await assetPromise;
    if (!asset) continue;
    rewritten = rewritten.split(`"${original}"`).join(`"${asset.localPath}"`);
    rewritten = rewritten.split(`'${original}'`).join(`'${asset.localPath}'`);
    if (isStylesheet) {
      await processCssAsset(asset, new URL(original, baseUrl).toString(), fetcher, siteOutDir);
    }
  }

  return rewritten;
}
