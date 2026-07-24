import type { Page } from "playwright-core";
import { parse, serializeOuter, defaultTreeAdapter, type DefaultTreeAdapterMap } from "parse5";
import type { Rect } from "../types.js";

export const SECTION_MARK_ATTR = "data-ai-cloner-section";

export interface DetectedSection {
  id: string;
  index: number;
  tag: string;
  selector: string;
  rect: Rect;
}

/**
 * Step 8 (part 1): finds the page's top-level "sections" - explicit semantic landmarks
 * (<section>, <header>, <footer>, <nav>, <main>, <article>, <aside>) where none is nested
 * inside another already-selected one, falling back to direct body children with real
 * visible height when the page uses no semantic markup at all. Each match is tagged with a
 * unique marker attribute so later steps can re-select it as a live Playwright element.
 */
export async function detectSections(page: Page): Promise<DetectedSection[]> {
  return page.evaluate((markAttr) => {
    const LANDMARK_SELECTOR = "section, header, footer, nav, main, article, aside";
    const isVisible = (el: Element) => {
      const rect = el.getBoundingClientRect();
      return rect.width > 40 && rect.height > 40;
    };

    let candidates = [...document.querySelectorAll(LANDMARK_SELECTOR)].filter((el) => {
      if (!isVisible(el)) return false;
      return !el.parentElement?.closest(LANDMARK_SELECTOR);
    });

    if (candidates.length === 0 && document.body) {
      candidates = [...document.body.children].filter(
        (el) => isVisible(el) && el.getBoundingClientRect().height >= 80,
      );
    }
    if (candidates.length === 0 && document.body) {
      candidates = [document.body];
    }

    return candidates.map((el, index) => {
      el.setAttribute(markAttr, String(index));
      const rect = el.getBoundingClientRect();
      return {
        id: `section-${index + 1}`,
        index,
        tag: el.tagName.toLowerCase(),
        selector: `[${markAttr}="${index}"]`,
        rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
      };
    });
  }, SECTION_MARK_ATTR);
}

const SECTION_MARK_RE = new RegExp(`\\s${SECTION_MARK_ATTR}="\\d+"`, "g");

/** Strips the internal section-marker attribute back out of finalized HTML output. */
export function stripSectionMarkers(html: string): string {
  return html.replace(SECTION_MARK_RE, "");
}

/**
 * Re-extracts one section's outerHTML from a (possibly asset-rewritten) full-page HTML
 * string, by its marker attribute - used after asset download rewrites image/css/font
 * references, so JSX generation sees the corrected local asset paths rather than the
 * original live-page snapshot.
 */
export function extractSectionHtmlByIndex(html: string, index: number): string {
  const document = parse(html);
  let match: DefaultTreeAdapterMap["element"] | null = null;

  const walk = (node: DefaultTreeAdapterMap["node"]) => {
    if (match) return;
    if (defaultTreeAdapter.isElementNode(node)) {
      const attrValue = node.attrs.find((a) => a.name === SECTION_MARK_ATTR)?.value;
      if (attrValue === String(index)) {
        match = node;
        return;
      }
    }
    if ("childNodes" in node) {
      for (const child of node.childNodes as DefaultTreeAdapterMap["node"][]) walk(child);
    }
  };
  walk(document);

  return match ? serializeOuter(match) : "";
}
