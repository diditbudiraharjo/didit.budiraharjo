import type { SectionAnalysisBundle } from "../types.js";
import { NAV_LABELS } from "../placeholderContent.js";

export function navbarBlock(section: SectionAnalysisBundle): string {
  const linkCount = Math.min(Math.max(section.components.links || 4, 3), NAV_LABELS.length);
  const links = NAV_LABELS.slice(0, linkCount);

  return [
    `<nav className="flex items-center justify-between gap-4 py-4">`,
    `  <span className="text-lg font-bold text-ink">Brand</span>`,
    `  <div className="hidden items-center gap-6 md:flex">`,
    ...links.map((label) => `    <a href="#" className="text-sm font-medium text-ink transition-colors hover:text-brand">${label}</a>`),
    `  </div>`,
    `  <div className="flex items-center gap-3">`,
    `    <ThemeToggle />`,
    `    <Button variant="primary" className="hidden md:inline-flex">Get Started</Button>`,
    `  </div>`,
    `</nav>`,
  ].join("\n");
}
