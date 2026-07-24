import TurndownService from "turndown";

const turndown = new TurndownService({
  headingStyle: "atx",
  codeBlockStyle: "fenced",
  bulletListMarker: "-",
});
turndown.remove(["script", "style", "noscript", "svg" as "style"]);

/** Step 7: converts a page's cleaned HTML into readable Markdown. */
export function htmlToMarkdown(html: string, title: string): string {
  const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html)?.[1] ?? html;
  const markdown = turndown.turndown(body).replace(/\n{3,}/g, "\n\n").trim();
  return `# ${title}\n\n${markdown}\n`;
}
