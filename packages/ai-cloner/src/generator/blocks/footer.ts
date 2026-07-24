import type { SectionAnalysisBundle } from "../types.js";
import { FOOTER_COLUMN_TITLES, FOOTER_LINKS, pick } from "../placeholderContent.js";

export function footerBlock(_section: SectionAnalysisBundle): string {
  const columns = FOOTER_COLUMN_TITLES.map((title, i) => {
    const links = [pick(FOOTER_LINKS, i * 2), pick(FOOTER_LINKS, i * 2 + 1)];
    return [
      `      <div>`,
      `        <h4 className="text-sm font-semibold text-ink">${title}</h4>`,
      `        <ul className="mt-3 space-y-2">`,
      ...links.map((l) => `          <li><a href="#" className="text-sm text-muted transition-colors hover:text-ink">${l}</a></li>`),
      `        </ul>`,
      `      </div>`,
    ].join("\n");
  });

  return [
    `<footer className="border-t border-border py-12">`,
    `  <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">`,
    ...columns,
    `  </div>`,
    `  <p className="mt-10 text-sm text-muted">© {new Date().getFullYear()} Brand. All rights reserved.</p>`,
    `</footer>`,
  ].join("\n");
}
