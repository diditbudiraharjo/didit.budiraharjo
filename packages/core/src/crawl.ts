import { PlaywrightCrawler, Configuration } from "crawlee";
import { chromium, type Page } from "playwright";
import type { CrawlOptions, CrawlResult, ScrapeResult } from "./types.js";
import {
  attachResponseCapture,
  extractPageResult,
  resolveChromiumPath,
  resolveProxyServer,
  CLONER_USER_AGENT,
  type CapturedResponse,
} from "./scrape.js";

/**
 * Crawls same-origin pages starting from `startUrl` (breadth-first, following <a href> links),
 * returning one ScrapeResult per page visited, up to `options.maxPages`.
 */
export async function crawlSite(startUrl: string, options: CrawlOptions = {}): Promise<CrawlResult> {
  const maxPages = options.maxPages ?? 20;
  const timeoutMs = options.timeoutMs ?? 30_000;
  const viewport = options.viewport ?? { width: 1440, height: 900 };
  const strategy = options.sameOriginOnly === false ? "all" : "same-origin";
  const proxyServer = resolveProxyServer();

  const pages: ScrapeResult[] = [];
  const capturedByPage = new WeakMap<Page, Map<string, CapturedResponse>>();

  // Keep everything in-memory and isolated per crawl - no on-disk request-queue state to clean up.
  const config = new Configuration({ persistStorage: false, purgeOnStart: true });

  const crawler = new PlaywrightCrawler(
    {
      launchContext: {
        launcher: chromium,
        userAgent: CLONER_USER_AGENT,
        launchOptions: {
          executablePath: resolveChromiumPath(),
          args: ["--no-sandbox", "--disable-dev-shm-usage"],
        },
        proxyUrl: proxyServer,
      },
      maxRequestsPerCrawl: maxPages,
      requestHandlerTimeoutSecs: Math.ceil(timeoutMs / 1000) + 30,
      navigationTimeoutSecs: Math.ceil(timeoutMs / 1000),
      preNavigationHooks: [
        async ({ page }) => {
          capturedByPage.set(page, attachResponseCapture(page));
          await page.setViewportSize(viewport).catch(() => {});
        },
      ],
      requestHandler: async ({ page, enqueueLinks }) => {
        const captured = capturedByPage.get(page) ?? new Map<string, CapturedResponse>();
        const result = await extractPageResult(page, captured);
        pages.push(result);

        if (pages.length < maxPages) {
          await enqueueLinks({ strategy });
        }
      },
    },
    config,
  );

  await crawler.run([startUrl]);
  await crawler.teardown();

  return { startUrl, pages };
}
