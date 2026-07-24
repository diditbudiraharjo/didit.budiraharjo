import Firecrawl from "firecrawl";

/**
 * Step 2: discover every page on the site using Firecrawl's map endpoint (fast link
 * discovery via sitemap + on-page links, no content scraping - Playwright does the
 * actual rendering in the next step).
 */
export async function discoverPages(
  siteUrl: string,
  apiKey: string,
  maxPages: number,
): Promise<string[]> {
  const firecrawl = new Firecrawl({ apiKey });
  const { hostname } = new URL(siteUrl);

  const result = await firecrawl.map(siteUrl, {
    sitemap: "include",
    limit: maxPages,
  });

  const urls = result.links
    .map((link) => link.url)
    .filter((url): url is string => Boolean(url))
    .filter((url) => {
      try {
        return new URL(url).hostname === hostname;
      } catch {
        return false;
      }
    });

  const unique = [...new Set([siteUrl, ...urls])];
  return unique.slice(0, maxPages);
}
