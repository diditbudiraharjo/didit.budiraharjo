import { chromium, type Page, type Response as PWResponse } from "playwright-core";
import { resolveChromiumPath, resolveProxyServer, CLONER_USER_AGENT } from "@website-cloner/core";
import { detectSections, SECTION_MARK_ATTR } from "./sections.js";
import { sampleSectionStyles } from "./styleSample.js";
import { screenshotSection } from "./screenshots.js";
import type { CapturedResponse, DomNode, PageRender, SectionCapture } from "../types.js";

const CAPTURED_RESOURCE_TYPES = ["stylesheet", "image", "font", "media"];
const MAX_DOM_NODES = 4000;

/**
 * Step 3 (+ raw material for steps 4-8): renders one URL in headless Chromium, capturing
 * everything downstream steps need from a single page load - the full DOM, a structural DOM
 * tree, every stylesheet/image/font response the page issued (for the asset-download step),
 * and one SectionCapture (with screenshot + style samples) per detected section.
 */
export async function renderPage(
  url: string,
  pageOutDir: string,
  options: { timeoutMs: number; viewport: { width: number; height: number } },
): Promise<PageRender> {
  const proxyServer = resolveProxyServer();
  const browser = await chromium.launch({
    executablePath: resolveChromiumPath(),
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    proxy: proxyServer ? { server: proxyServer } : undefined,
  });

  try {
    const context = await browser.newContext({ viewport: options.viewport, userAgent: CLONER_USER_AGENT });
    const page = await context.newPage();
    const captured = new Map<string, CapturedResponse>();

    page.on("response", (response: PWResponse) => {
      void captureResponse(response, captured);
    });

    await page
      .goto(url, { waitUntil: "networkidle", timeout: options.timeoutMs })
      .catch(async () => {
        await page.goto(url, { waitUntil: "load", timeout: options.timeoutMs });
      });

    await autoScroll(page);
    await page.waitForTimeout(500);

    const title = await page.title();
    // captureSections() marks each section element with a data-attribute (so downstream
    // steps can re-locate it by index after asset-path rewriting) - it must run before
    // page.content() so that marker is actually present in the captured HTML snapshot.
    const sections = await captureSections(page, pageOutDir);
    const html = await page.content();
    const domTree = await captureDomTree(page);
    const inlineCss = await page.evaluate(() =>
      [...document.querySelectorAll("style")].map((s) => s.textContent ?? "").filter((t) => t.trim()),
    );

    return { url: page.url(), title, html, domTree, sections, captured, inlineCss };
  } finally {
    await browser.close();
  }
}

async function captureResponse(response: PWResponse, captured: Map<string, CapturedResponse>) {
  try {
    const resourceType = response.request().resourceType();
    if (!CAPTURED_RESOURCE_TYPES.includes(resourceType)) return;
    if (!response.ok()) return;
    const contentType = response.headers()["content-type"] ?? "";
    const buffer = await response.body();
    captured.set(response.url(), { buffer, contentType });
  } catch {
    // Body can be unavailable for redirected/aborted requests - safe to skip.
  }
}

async function captureDomTree(page: Page): Promise<DomNode> {
  return page.evaluate(
    ({ maxNodes, markAttr }) => {
      let count = 0;
      function walk(el: Element): DomNode | null {
        if (count >= maxNodes) return null;
        count++;
        const children: DomNode[] = [];
        for (const child of el.children) {
          const node = walk(child);
          if (node) children.push(node);
        }
        const textLength = [...el.childNodes]
          .filter((n) => n.nodeType === Node.TEXT_NODE)
          .reduce((sum, n) => sum + (n.textContent?.trim().length ?? 0), 0);
        const classes = [...el.classList];
        const attrs: Record<string, string> = {};
        for (const attr of el.attributes) {
          if (attr.name === "class" || attr.name === "id" || attr.name === markAttr) continue;
          attrs[attr.name] = attr.value;
        }
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || undefined,
          classes: classes.length ? classes : undefined,
          attrs: Object.keys(attrs).length ? attrs : undefined,
          textLength,
          children,
        };
      }
      return (
        walk(document.documentElement) ?? {
          tag: "html",
          textLength: 0,
          children: [],
        }
      );
    },
    { maxNodes: MAX_DOM_NODES, markAttr: SECTION_MARK_ATTR },
  );
}

async function captureSections(page: Page, pageOutDir: string): Promise<SectionCapture[]> {
  const detected = await detectSections(page);
  const sections: SectionCapture[] = [];

  for (const section of detected) {
    const handle = await page.$(section.selector);
    const html = handle ? await handle.evaluate((el) => el.outerHTML) : "";
    const elements = await sampleSectionStyles(page, section.selector);
    await screenshotSection(page, section.selector, pageOutDir, section.id);

    sections.push({
      id: section.id,
      index: section.index,
      tag: section.tag,
      selector: section.selector,
      rect: section.rect,
      html,
      elements,
    });
  }

  return sections;
}

async function autoScroll(page: Page): Promise<void> {
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
    .catch(() => {});
}
