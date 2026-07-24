export interface Config {
  firecrawlApiKey: string;
  maxPages: number;
  timeoutMs: number;
  viewport: { width: number; height: number };
}

export function loadConfig(): Config {
  const firecrawlApiKey = process.env.FIRECRAWL_API_KEY;
  if (!firecrawlApiKey) {
    throw new Error(
      "FIRECRAWL_API_KEY is not set. Get a key at https://www.firecrawl.dev and set it " +
        "in the environment (see packages/ai-cloner/.env.example).",
    );
  }

  return {
    firecrawlApiKey,
    maxPages: Number(process.env.AI_CLONER_MAX_PAGES) || 50,
    timeoutMs: 45_000,
    viewport: { width: 1440, height: 900 },
  };
}
