import { useState, type FormEvent } from "react";

interface CloneResult {
  jobId: string;
  title: string;
  sourceUrl: string;
  assetCount: number;
  previewUrl: string;
  downloadUrl: string;
  pageCount?: number;
  pages?: { url: string; title: string }[];
}

type Status = "idle" | "loading" | "error";
type Mode = "clone" | "crawl";

export default function App() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<Mode>("clone");
  const [maxPages, setMaxPages] = useState(20);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CloneResult | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setStatus("loading");
    setError(null);
    setResult(null);

    try {
      const endpoint = mode === "crawl" ? "/api/crawl" : "/api/clone";
      const body = mode === "crawl" ? { url: url.trim(), maxPages } : { url: url.trim() };
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? `Request failed (${res.status})`);
      setResult(data as CloneResult);
      setStatus("idle");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Website Cloner</h1>
        <p>Paste a URL. Get a live preview and an editable React project.</p>
      </header>

      <div className="mode-toggle">
        <button
          type="button"
          className={mode === "clone" ? "mode-button active" : "mode-button"}
          onClick={() => setMode("clone")}
        >
          Single page
        </button>
        <button
          type="button"
          className={mode === "crawl" ? "mode-button active" : "mode-button"}
          onClick={() => setMode("crawl")}
        >
          Crawl whole site
        </button>
      </div>

      <form className="clone-form" onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        {mode === "crawl" && (
          <input
            type="number"
            className="max-pages-input"
            min={1}
            max={50}
            value={maxPages}
            onChange={(e) => setMaxPages(Number(e.target.value))}
            title="Maximum pages to crawl"
          />
        )}
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? (mode === "crawl" ? "Crawling…" : "Cloning…") : mode === "crawl" ? "Crawl" : "Clone"}
        </button>
      </form>

      {status === "loading" && (
        <p className="status-note">
          {mode === "crawl"
            ? "Crawling same-origin pages in a headless browser and downloading assets — this can take a while."
            : "Rendering the page in a headless browser and downloading assets — this can take up to a minute."}
        </p>
      )}

      {status === "error" && error && <p className="error-note">{error}</p>}

      {result && (
        <section className="result">
          <div className="result-meta">
            <div>
              <h2>{result.title || "(untitled)"}</h2>
              <a href={result.sourceUrl} target="_blank" rel="noreferrer">
                {result.sourceUrl}
              </a>
              <span className="asset-count">
                {result.pageCount
                  ? `${result.pageCount} page(s), ${result.assetCount} asset(s) captured`
                  : `${result.assetCount} asset(s) captured`}
              </span>
            </div>
            <a className="download-button" href={result.downloadUrl} download>
              Download project (.zip)
            </a>
          </div>
          {result.pages && result.pages.length > 1 && (
            <ul className="page-list">
              {result.pages.map((p) => (
                <li key={p.url}>{p.title || p.url}</li>
              ))}
            </ul>
          )}
          <iframe
            className="preview-frame"
            src={result.previewUrl}
            title={`Preview of ${result.title}`}
          />
        </section>
      )}
    </div>
  );
}
