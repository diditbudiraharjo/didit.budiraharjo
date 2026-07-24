import { chromium, type Response as PWResponse } from "playwright-core";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import type { ClonedAsset, CloneOptions, ScrapeResult } from "./types.js";

const CHROMIUM_CANDIDATES = [
  process.env.CHROMIUM_EXECUTABLE_PATH,
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
];

function resolveChromiumPath(): string | undefined {
  for (const candidate of CHROMIUM_CANDIDATES) {
    if (candidate && existsSync(candidate)) return candidate;
  }
  return undefined;
}

interface CapturedResponse {
  buffer: Buffer;
  contentType: string;
}

interface BrowserSnapshot {
  title: string;
  baseUri: string;
  html: string;
  styleTexts: string[];
  stylesheetHrefs: string[];
}

const EXT_BY_MIME: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/svg+xml": "svg",
  "image/webp": "webp",
  "image/avif": "avif",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
  "font/woff2": "woff2",
  "font/woff": "woff",
  "font/ttf": "ttf",
  "font/otf": "otf",
  "application/font-woff2": "woff2",
  "application/font-woff": "woff",
  "application/x-font-ttf": "ttf",
  "text/css": "css",
};

function extFromContentType(contentType: string): string | undefined {
  const bare = contentType.split(";")[0]?.trim().toLowerCase();
  return bare ? EXT_BY_MIME[bare] : undefined;
}

function extFromUrl(url: string): string | undefined {
  try {
    const pathname = new URL(url).pathname;
    const match = /\.([a-z0-9]{2,5})$/i.exec(pathname);
    return match?.[1]?.toLowerCase();
  } catch {
    return undefined;
  }
}

function assetFileName(url: string, contentType: string): string {
  const hash = createHash("sha1").update(url).digest("hex").slice(0, 10);
  const ext = extFromContentType(contentType) ?? extFromUrl(url) ?? "bin";
  return `${hash}.${ext}`;
}

/** Loads `url` in headless Chromium and returns cleaned HTML, combined CSS, and downloaded assets. */
export async function scrapeSite(
  url: string,
  options: CloneOptions = {},
): Promise<ScrapeResult> {
  const timeoutMs = options.timeoutMs ?? 30_000;
  const viewport = options.viewport ?? { width: 1440, height: 900 };
  const executablePath = resolveChromiumPath();
  const proxyServer = process.env.HTTPS_PROXY || process.env.https_proxy;

  const browser = await chromium.launch({
    executablePath,
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    proxy: proxyServer ? { server: proxyServer } : undefined,
  });

  const captured = new Map<string, CapturedResponse>();

  try {
    const context = await browser.newContext({
      viewport,
      userAgent:
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
        "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 WebsiteCloner/0.1",
    });
    const page = await context.newPage();

    page.on("response", (response: PWResponse) => {
      void captureResponse(response, captured);
    });

    await page.goto(url, { waitUntil: "networkidle", timeout: timeoutMs }).catch(async () => {
      // Some sites never go fully idle (polling, websockets). Fall back to "load".
      await page.goto(url, { waitUntil: "load", timeout: timeoutMs });
    });

    // Nudge lazy-loaded content (images with loading="lazy", infinite scroll blocks) into view.
    await autoScroll(page);
    await page.waitForTimeout(500);

    const snapshot: BrowserSnapshot = await page.evaluate(() => {
      document.querySelectorAll("script, noscript").forEach((el) => el.remove());
      document.querySelectorAll("*").forEach((el) => {
        [...el.attributes].forEach((attr) => {
          if (/^on/i.test(attr.name)) el.removeAttribute(attr.name);
        });
      });
      return {
        title: document.title,
        baseUri: document.baseURI,
        html: document.documentElement.outerHTML,
        styleTexts: [...document.querySelectorAll("style")].map((s) => s.textContent ?? ""),
        stylesheetHrefs: [...document.querySelectorAll('link[rel~="stylesheet"]')].map(
          (l) => (l as HTMLLinkElement).href,
        ),
      };
    });

    const finalUrl = page.url();
    await context.close();

    const assets = new Map<string, ClonedAsset>();
    const download = makeDownloader(captured, assets);

    const cssChunks: string[] = [];
    for (const styleText of snapshot.styleTexts) {
      cssChunks.push(await inlineCssUrls(styleText, finalUrl, download));
    }
    for (const href of snapshot.stylesheetHrefs) {
      const fetched = await download(href);
      if (!fetched) continue;
      const cssText = fetched.data.toString("utf8");
      cssChunks.push(await inlineCssUrls(cssText, href, download));
    }

    const html = await rewriteHtmlAssetUrls(snapshot.html, snapshot.baseUri, download);

    return {
      sourceUrl: finalUrl,
      pageTitle: snapshot.title,
      html,
      css: cssChunks.filter((c) => c.trim().length > 0).join("\n\n"),
      assets: [...assets.values()],
    };
  } finally {
    await browser.close();
  }
}

async function captureResponse(response: PWResponse, captured: Map<string, CapturedResponse>) {
  try {
    const request = response.request();
    const resourceType = request.resourceType();
    if (!["stylesheet", "image", "font", "media"].includes(resourceType)) return;
    if (!response.ok()) return;
    const headers = response.headers();
    const contentType = headers["content-type"] ?? "";
    const buffer = await response.body();
    captured.set(response.url(), { buffer, contentType });
  } catch {
    // Response body can be unavailable (redirects, aborted requests) - safe to skip.
  }
}

type Downloader = (rawUrl: string) => Promise<ClonedAsset | undefined>;

function makeDownloader(
  captured: Map<string, CapturedResponse>,
  assets: Map<string, ClonedAsset>,
): Downloader {
  return async (rawUrl: string) => {
    if (!rawUrl || rawUrl.startsWith("data:") || rawUrl.startsWith("blob:")) return undefined;
    let absoluteUrl: string;
    try {
      absoluteUrl = new URL(rawUrl).toString();
    } catch {
      return undefined;
    }

    const existing = assets.get(absoluteUrl);
    if (existing) return existing;

    let buffer: Buffer;
    let contentType: string;
    const hit = captured.get(absoluteUrl);
    if (hit) {
      buffer = hit.buffer;
      contentType = hit.contentType;
    } else {
      try {
        const res = await fetch(absoluteUrl, {
          headers: { "user-agent": "Mozilla/5.0 WebsiteCloner/0.1" },
        });
        if (!res.ok) return undefined;
        contentType = res.headers.get("content-type") ?? "";
        buffer = Buffer.from(await res.arrayBuffer());
      } catch {
        return undefined;
      }
    }

    const localPath = `assets/${assetFileName(absoluteUrl, contentType)}`;
    const asset: ClonedAsset = { sourceUrl: absoluteUrl, localPath, data: buffer, contentType };
    assets.set(absoluteUrl, asset);
    return asset;
  };
}

const CSS_URL_RE = /url\(\s*(['"]?)([^'")]+)\1\s*\)/g;
const CSS_IMPORT_RE = /@import\s+(?:url\(\s*['"]?([^'")]+)['"]?\s*\)|['"]([^'"]+)['"])[^;]*;/g;

async function inlineCssUrls(cssText: string, baseUrl: string, download: Downloader): Promise<string> {
  if (!cssText.trim()) return "";

  let result = cssText;

  // Inline one level of @import so the combined stylesheet is self-contained.
  const importMatches = [...result.matchAll(CSS_IMPORT_RE)];
  for (const match of importMatches) {
    const importUrl = match[1] ?? match[2];
    if (!importUrl) continue;
    try {
      const absolute = new URL(importUrl, baseUrl).toString();
      const asset = await download(absolute);
      const importedCss = asset ? asset.data.toString("utf8") : "";
      const processed = await inlineCssUrls(importedCss, absolute, download);
      result = result.replace(match[0], processed);
    } catch {
      result = result.replace(match[0], "");
    }
  }

  const urlMatches = [...result.matchAll(CSS_URL_RE)];
  for (const match of urlMatches) {
    const original = match[2]!;
    if (original.startsWith("data:") || original.startsWith("#")) continue;
    try {
      const absolute = new URL(original, baseUrl).toString();
      const asset = await download(absolute);
      if (asset) {
        result = result.split(match[0]).join(`url("${asset.localPath}")`);
      }
    } catch {
      // Leave the original url() untouched if it can't be resolved.
    }
  }

  return result;
}

const SRCSET_SPLIT_RE = /\s*,\s*(?=\S+\s)/;

async function rewriteHtmlAssetUrls(
  html: string,
  baseUrl: string,
  download: Downloader,
): Promise<string> {
  let result = html;

  const srcAttrRe = /\s(src|href|poster)="([^"]*)"/g;
  const srcMatches = [...result.matchAll(srcAttrRe)];
  for (const match of srcMatches) {
    const [full, attr, value] = match;
    if (!value || value.startsWith("data:") || value.startsWith("#") || value.startsWith("javascript:")) {
      continue;
    }
    if (attr === "href" && !/\.(png|jpe?g|gif|svg|webp|avif|ico)$/i.test(value)) continue;
    try {
      const absolute = new URL(value, baseUrl).toString();
      const asset = await download(absolute);
      if (asset) {
        result = result.replace(full!, ` ${attr}="${asset.localPath}"`);
      }
    } catch {
      // Unresolvable URL - leave as-is.
    }
  }

  const srcsetAttrRe = /\ssrcset="([^"]*)"/g;
  const srcsetMatches = [...result.matchAll(srcsetAttrRe)];
  for (const match of srcsetMatches) {
    const [full, value] = match;
    if (!value) continue;
    const entries = value.split(SRCSET_SPLIT_RE);
    const rewritten: string[] = [];
    for (const entry of entries) {
      const [rawUrl, descriptor] = entry.trim().split(/\s+/, 2);
      if (!rawUrl) continue;
      try {
        const absolute = new URL(rawUrl, baseUrl).toString();
        const asset = await download(absolute);
        rewritten.push([asset ? asset.localPath : rawUrl, descriptor].filter(Boolean).join(" "));
      } catch {
        rewritten.push(entry.trim());
      }
    }
    result = result.replace(full!, ` srcset="${rewritten.join(", ")}"`);
  }

  const inlineStyleRe = /\sstyle="([^"]*)"/g;
  const styleMatches = [...result.matchAll(inlineStyleRe)];
  for (const match of styleMatches) {
    const [full, value] = match;
    if (!value || !value.includes("url(")) continue;
    const rewritten = await inlineCssUrls(value, baseUrl, download);
    result = result.replace(full!, ` style="${rewritten.replace(/"/g, "&quot;")}"`);
  }

  return result;
}

async function autoScroll(page: import("playwright-core").Page): Promise<void> {
  await page
    .evaluate(async () => {
      const step = 800;
      const delayMs = 120;
      let previousHeight = 0;
      for (let i = 0; i < 12; i++) {
        window.scrollBy(0, step);
        await new Promise((resolve) => setTimeout(resolve, delayMs));
        const height = document.body.scrollHeight;
        if (height === previousHeight) break;
        previousHeight = height;
      }
      window.scrollTo(0, 0);
    })
    .catch(() => {
      // Non-essential - ignore scroll failures on unusual pages.
    });
}
