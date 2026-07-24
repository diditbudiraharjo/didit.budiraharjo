import express from "express";
import cors from "cors";
import archiver from "archiver";
import { join } from "node:path";
import {
  scrapeSite,
  crawlSite,
  generateProject,
  generateMultiPageProject,
  writeFilesToDisk,
} from "@website-cloner/core";
import { createJob, getJob, jobsRoot, startJobReaper } from "./jobs.js";

const MAX_CRAWL_PAGES = 50;

const PORT = Number(process.env.PORT ?? 8787);

const app = express();
app.use(cors());
app.use(express.json());

function isValidHttpUrl(value: unknown): value is string {
  if (typeof value !== "string") return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

app.post("/api/clone", async (req, res) => {
  const { url } = req.body ?? {};
  if (!isValidHttpUrl(url)) {
    res.status(400).json({ error: "Provide a valid http(s) url in the request body." });
    return;
  }

  try {
    const scrape = await scrapeSite(url, { timeoutMs: 45_000 });
    const job = createJob(scrape.pageTitle || url, scrape.sourceUrl);
    const files = generateProject(scrape);
    await writeFilesToDisk(files, job.outDir);

    res.json({
      jobId: job.id,
      title: job.title,
      sourceUrl: job.sourceUrl,
      assetCount: scrape.assets.length,
      previewUrl: `/preview/${job.id}/index.html`,
      downloadUrl: `/api/clone/${job.id}/download`,
    });
  } catch (err) {
    console.error("Clone failed:", err);
    res.status(502).json({
      error: `Failed to clone ${url}: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
});

app.post("/api/crawl", async (req, res) => {
  const { url, maxPages } = req.body ?? {};
  if (!isValidHttpUrl(url)) {
    res.status(400).json({ error: "Provide a valid http(s) url in the request body." });
    return;
  }
  const pageLimit = Math.min(Math.max(1, Number(maxPages) || 20), MAX_CRAWL_PAGES);

  try {
    const crawl = await crawlSite(url, { timeoutMs: 45_000, maxPages: pageLimit });
    if (crawl.pages.length === 0) {
      res.status(502).json({ error: `Failed to crawl ${url}: no pages could be loaded.` });
      return;
    }

    const job = createJob(crawl.pages[0]!.pageTitle || url, crawl.startUrl);
    const files = generateMultiPageProject(crawl);
    await writeFilesToDisk(files, job.outDir);

    const assetCount = new Set(crawl.pages.flatMap((p) => p.assets.map((a) => a.localPath))).size;
    res.json({
      jobId: job.id,
      title: job.title,
      sourceUrl: job.sourceUrl,
      pageCount: crawl.pages.length,
      pages: crawl.pages.map((p) => ({ url: p.sourceUrl, title: p.pageTitle })),
      assetCount,
      previewUrl: `/preview/${job.id}/index.html`,
      downloadUrl: `/api/clone/${job.id}/download`,
    });
  } catch (err) {
    console.error("Crawl failed:", err);
    res.status(502).json({
      error: `Failed to crawl ${url}: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
});

app.use("/preview/:jobId", (req, res, next) => {
  const job = getJob(req.params.jobId);
  if (!job) {
    res.status(404).send("Unknown or expired job.");
    return;
  }
  express.static(join(job.outDir, "preview"))(req, res, next);
});

app.get("/api/clone/:jobId/download", (req, res) => {
  const job = getJob(req.params.jobId);
  if (!job) {
    res.status(404).json({ error: "Unknown or expired job." });
    return;
  }

  res.attachment(`cloned-site-${job.id}.zip`);
  const archive = archiver("zip", { zlib: { level: 9 } });
  archive.on("error", (err) => {
    console.error("Zip failed:", err);
    res.status(500).end();
  });
  archive.pipe(res);
  archive.directory(job.outDir, false);
  void archive.finalize();
});

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

startJobReaper();

app.listen(PORT, () => {
  console.log(`Website Cloner server listening on http://localhost:${PORT}`);
  console.log(`Job artifacts stored under ${jobsRoot()}`);
});
