import type { Page } from "playwright-core";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

/** Step 8 (part 2): screenshots one already-detected section element to disk, PNG. */
export async function screenshotSection(
  page: Page,
  selector: string,
  outDir: string,
  id: string,
): Promise<string> {
  const relativePath = `screenshots/${id}.png`;
  const fullPath = join(outDir, relativePath);
  await mkdir(dirname(fullPath), { recursive: true });

  const handle = await page.$(selector);
  if (!handle) {
    throw new Error(`Section element not found for selector ${selector}`);
  }
  await handle.scrollIntoViewIfNeeded().catch(() => {});
  await handle.screenshot({ path: fullPath }).catch(async () => {
    // Some sections exceed Chromium's max screenshot dimensions - fall back to viewport-clipped.
    const box = await handle.boundingBox();
    if (!box) throw new Error(`Could not measure section for screenshot: ${selector}`);
    await page.screenshot({
      path: fullPath,
      clip: { x: box.x, y: box.y, width: Math.min(box.width, 8000), height: Math.min(box.height, 8000) },
    });
  });

  return relativePath;
}
