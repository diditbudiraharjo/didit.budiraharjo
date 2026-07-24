import { useState, type FormEvent } from "react";

interface CloneResult {
  jobId: string;
  title: string;
  sourceUrl: string;
  assetCount: number;
  previewUrl: string;
  downloadUrl: string;
}

type Status = "idle" | "loading" | "error";

export default function App() {
  const [url, setUrl] = useState("");
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
      const res = await fetch("/api/clone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
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

      <form className="clone-form" onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="https://example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Cloning…" : "Clone"}
        </button>
      </form>

      {status === "loading" && (
        <p className="status-note">
          Rendering the page in a headless browser and downloading assets — this can take up to a minute.
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
              <span className="asset-count">{result.assetCount} asset(s) captured</span>
            </div>
            <a className="download-button" href={result.downloadUrl} download>
              Download project (.zip)
            </a>
          </div>
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
