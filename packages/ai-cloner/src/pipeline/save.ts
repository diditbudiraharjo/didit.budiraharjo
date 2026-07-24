import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
import type { DomNode } from "../types.js";
import { htmlToMarkdown } from "./markdown.js";

export interface SavedPageFiles {
  htmlPath: string;
  domPath: string;
  markdownPath: string;
}

/** Steps 5-7: writes a page's cleaned HTML, structural DOM tree (JSON), and Markdown to disk. */
export async function savePageFiles(
  pageOutDir: string,
  html: string,
  domTree: DomNode,
  title: string,
): Promise<SavedPageFiles> {
  await mkdir(pageOutDir, { recursive: true });

  const htmlPath = "page.html";
  const domPath = "dom.json";
  const markdownPath = "page.md";

  await writeFile(join(pageOutDir, htmlPath), html);
  await writeFile(join(pageOutDir, domPath), JSON.stringify(domTree, null, 2));
  await writeFile(join(pageOutDir, markdownPath), htmlToMarkdown(html, title));

  return { htmlPath, domPath, markdownPath };
}
