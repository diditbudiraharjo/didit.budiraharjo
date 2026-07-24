import type { ElementStyleSample, UiComponentAnalysis } from "../../types.js";

const NAMED_PATTERNS: [string, RegExp][] = [
  ["navbar", /\bnav(bar)?\b/i],
  ["hero", /\bhero\b/i],
  ["card-grid", /\bcard(s)?\b/i],
  ["footer", /\bfooter\b/i],
  ["modal", /\bmodal|dialog\b/i],
  ["carousel", /\bcarousel|slider|swiper\b/i],
  ["accordion", /\baccordion\b/i],
  ["tabs", /\btabs?\b/i],
  ["badge", /\bbadge|tag|pill\b/i],
  ["avatar", /\bavatar\b/i],
  ["dropdown", /\bdropdown|menu\b/i],
  ["tooltip", /\btooltip|popover\b/i],
  ["pricing-table", /\bpricing\b/i],
  ["testimonial", /\btestimonial\b/i],
];

const BUTTON_CLASS_RE = /\bbtn\b|\bbutton\b/i;
const CARD_CLASS_RE = /\bcard\b/i;
const NAV_CLASS_RE = /\bnav(bar)?\b/i;

/** Step 14: heuristic UI component detection from tag names, roles, and class-name patterns. */
export function analyzeComponents(elements: ElementStyleSample[]): UiComponentAnalysis {
  const classString = (e: ElementStyleSample) => e.classes.join(" ");

  const buttons = elements.filter(
    (e) => e.tag === "button" || (e.tag === "a" && BUTTON_CLASS_RE.test(classString(e))),
  ).length;
  const cards = elements.filter((e) => CARD_CLASS_RE.test(classString(e))).length;
  const navs = elements.filter((e) => e.tag === "nav" || NAV_CLASS_RE.test(classString(e))).length;
  const forms = elements.filter((e) => e.tag === "form").length;
  const inputs = elements.filter((e) => ["input", "select", "textarea"].includes(e.tag)).length;
  const images = elements.filter((e) => ["img", "svg", "picture"].includes(e.tag)).length;
  const headings = elements.filter((e) => /^h[1-6]$/.test(e.tag)).length;
  const links = elements.filter((e) => e.tag === "a").length;
  const lists = elements.filter((e) => ["ul", "ol"].includes(e.tag)).length;

  const allClasses = elements.map(classString).join(" ");
  const detected = NAMED_PATTERNS.filter(([, pattern]) => pattern.test(allClasses)).map(([name]) => name);

  return { buttons, cards, navs, forms, inputs, images, headings, links, lists, detected };
}
