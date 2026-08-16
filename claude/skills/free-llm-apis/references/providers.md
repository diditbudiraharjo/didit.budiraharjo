# Free LLM API Providers — Reference

Compiled from provider docs and market surveys as of **August 2026**. Free-tier terms and rate limits change frequently and are not consistently documented by vendors — treat the numbers below as directional, and check the linked docs page for anything beyond a quick prototype. Where a source only offered a rough figure, that's noted.

Jump to: [Google AI Studio](#google-ai-studio--gemini-api) · [Groq](#groq) · [Cerebras](#cerebras-cloud) · [OpenRouter](#openrouter) · [Mistral](#mistral-la-plateforme) · [Cloudflare Workers AI](#cloudflare-workers-ai) · [Hugging Face](#hugging-face-inference-providers) · [NVIDIA NIM](#nvidia-nim-buildnvidiacom) · [Cohere](#cohere-trial-key) · [SambaNova](#sambanova-cloud) · [Together AI](#together-ai) · [Long-tail aggregators](#long-tail-aggregators--proxies) · [Retired](#retired--discontinued)

---

## Google AI Studio / Gemini API

**Best for:** highest-quality model on any free tier (Gemini Flash, and limited Pro access).

- **Sign up:** [aistudio.google.com](https://aistudio.google.com) → "Get API key". Google account only, no card required for the free tier.
- **Free limits (approximate, per-model):**
  - Gemini 2.5 Flash: ~15 RPM, ~250 RPD, up to 1M TPM
  - Gemini 2.5 Flash-Lite: ~30 RPM, ~1,000 RPD (the most generous free option in the lineup)
  - Gemini 2.5 Pro: ~5 RPM, ~50–100 RPD (tight — treat Pro as "occasional use," not a workhorse)
  - Every model is bounded by RPM, TPM, *and* RPD simultaneously — the tightest one is the real cap.
- **Notes:** Free-tier prompts/outputs may be used by Google to improve products (unlike paid tier) — mention this if the user cares about data privacy. Check current numbers at [ai.google.dev/gemini-api/docs/rate-limits](https://ai.google.dev/gemini-api/docs/rate-limits).
- **Base URL (OpenAI-compatible):** `https://generativelanguage.googleapis.com/v1beta/openai/`
- **Base URL (native SDK, recommended for full feature access):** use `google-genai` Python package.

```python
from openai import OpenAI

client = OpenAI(
    api_key="YOUR_GEMINI_API_KEY",
    base_url="https://generativelanguage.googleapis.com/v1beta/openai/",
)
response = client.chat.completions.create(
    model="gemini-2.5-flash",
    messages=[{"role": "user", "content": "Hello!"}],
)
```

---

## Groq

**Best for:** speed + generous no-card free tier for open-weight models.

- **Sign up:** [console.groq.com](https://console.groq.com) → API Keys. No credit card required for the free tier.
- **Free limits:** applied per organization (adding API keys does not raise them). Most models: ~30 RPM / ~6,000 TPM / ~14,400 RPD. Some models get different multiples (e.g. larger models are capped lower, some small models get higher TPM). Check [console.groq.com](https://console.groq.com/docs/rate-limits) for live per-model numbers.
- **Models:** Llama 3.1/3.3/4, Mixtral, Gemma 2, Qwen 3, Kimi K2, GPT-OSS 120B, and others — roster shifts as new open models ship.
- **Why it stands out:** runs on Groq's LPU hardware, so latency/throughput is noticeably better than typical GPU-hosted inference — good pick when the user cares about snappy UX.
- **Base URL:** `https://api.groq.com/openai/v1`

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_GROQ_API_KEY", base_url="https://api.groq.com/openai/v1")
response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",
    messages=[{"role": "user", "content": "Hello!"}],
)
```

---

## Cerebras Cloud

**Best for:** fastest raw inference + the largest daily token allowance among "no card needed" tiers.

- **Sign up:** [cloud.cerebras.ai](https://cloud.cerebras.ai). No credit card required to start.
- **Free limits (approximate):** ~1M tokens/day, ~14,400 requests/day per model, ~15 RPM / ~30K TPM. **Context window is capped at 8K on the free tier** (much larger on paid) — flag this if the user needs long context.
- **Models:** Llama 3.3 70B, Llama 4 Scout, Qwen 3 235B, GPT-OSS 120B, and others.
- **Note:** if the account goes fully idle/unused, API access can pause until a Pay-as-you-go purchase reactivates it — keys and settings stay intact either way.
- **Base URL:** `https://api.cerebras.ai/v1`

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_CEREBRAS_API_KEY", base_url="https://api.cerebras.ai/v1")
response = client.chat.completions.create(
    model="llama-3.3-70b",
    messages=[{"role": "user", "content": "Hello!"}],
)
```

---

## OpenRouter

**Best for:** one key, many free open-weight models, easy fallback/multi-model routing.

- **Sign up:** [openrouter.ai](https://openrouter.ai). No card required to use `:free` models.
- **Free limits:** models with a `:free` suffix in the model ID (e.g. `meta-llama/llama-3.3-70b-instruct:free`, `deepseek/deepseek-r1:free`) are capped at ~20 RPM regardless of account. Daily cap depends on lifetime spend: ~50 requests/day with $0 purchased, ~1,000/day once the account has purchased $10+ in credits at any point (a one-time top-up permanently raises the daily cap even if never spent down further).
- **Notes:** the free roster changes often (dozens of models at any time, drawn from many upstream providers) — check [openrouter.ai/models?max_price=0](https://openrouter.ai/models) for the live list. Because OpenRouter proxies other vendors' free/discounted capacity, an individual free model can disappear or get throttled upstream without much notice — good for prototyping and fallback chains, less ideal as a sole dependency for something long-lived.
- **Base URL:** `https://openrouter.ai/api/v1`

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_OPENROUTER_API_KEY", base_url="https://openrouter.ai/api/v1")
response = client.chat.completions.create(
    model="meta-llama/llama-3.3-70b-instruct:free",
    messages=[{"role": "user", "content": "Hello!"}],
)
```

---

## Mistral La Plateforme

**Best for:** trying a genuinely frontier-class proprietary model (Mistral Large, Codestral) for free.

- **Sign up:** [console.mistral.ai](https://console.mistral.ai) → the free "Experiment" tier is the default before you add billing.
- **Free limits:** rate-limited access to *all* models including Mistral Large and Codestral (roughly a monthly token ceiling in the billions-of-tokens range per some reports, but Mistral no longer documents an exact public number — check the Admin Console → Limits page for your account's actual RPM/TPM). Explicitly positioned for evaluation, not production traffic.
- **Also worth knowing:** Mistral runs a startup credits program (can be worth tens of thousands of dollars in credits) — mention if the user is building something startup-shaped, not just a hobby project.
- **Base URL:** `https://api.mistral.ai/v1`

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_MISTRAL_API_KEY", base_url="https://api.mistral.ai/v1")
response = client.chat.completions.create(
    model="mistral-small-latest",
    messages=[{"role": "user", "content": "Hello!"}],
)
```

---

## Cloudflare Workers AI

**Best for:** projects already living on Cloudflare / edge deployment.

- **Sign up:** any Cloudflare account (the free Workers plan includes this) at [dash.cloudflare.com](https://dash.cloudflare.com) → Workers AI.
- **Free limits:** 10,000 "Neurons" (Cloudflare's normalized compute unit) per day, shared across **all** models on the account — resets daily at 00:00 UTC. Larger models burn the pool much faster than small ones, so a 70B model might only get you a handful of requests/day while a small model gets many more.
- **Models:** 50+ open models (Llama, Mistral, Gemma, Qwen, plus image/embedding/etc. models) run at the edge.
- **Base URL / access:** via REST (`https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/{model}`) or the Workers AI binding inside a Worker — not a drop-in OpenAI base_url swap; check [developers.cloudflare.com/workers-ai](https://developers.cloudflare.com/workers-ai/) for the exact call shape.

---

## Hugging Face Inference Providers

**Best for:** widest catalog of open-source models, including ones no other host serves.

- **Sign up:** [huggingface.co](https://huggingface.co) → Settings → Access Tokens.
- **Free limits:** every account gets a small monthly credit pool for Inference Providers (reported as low as ~$0.10/month on the free plan — enough for light testing, not sustained use); PRO ($9/mo) raises this to ~$2/month across providers. Beyond the credit, usage is pay-as-you-go at the underlying provider's rate.
- **Notes:** this is a router in front of many upstream inference providers (including some also listed here, like Groq/Cerebras/SambaNova), so pricing and limits per model vary by which backend is serving it.
- **Base URL:** `https://router.huggingface.co/v1` (OpenAI-compatible chat completions)

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_HF_TOKEN", base_url="https://router.huggingface.co/v1")
response = client.chat.completions.create(
    model="meta-llama/Llama-3.3-70B-Instruct",
    messages=[{"role": "user", "content": "Hello!"}],
)
```

---

## NVIDIA NIM (build.nvidia.com)

**Best for:** trying 100+ models (open and some proprietary) from one account for dev/eval work.

- **Sign up:** [build.nvidia.com](https://build.nvidia.com) via the free NVIDIA Developer Program. No credit card for the free tier.
- **Free limits:** ~40 RPM; historically credit-based (~1,000 inference credits on signup) though reports suggest the credit ceiling has loosened over time — verify current terms in your account dashboard.
- **Notes:** explicitly licensed for development, testing, research, and evaluation — **not** for production traffic without an NVIDIA AI Enterprise agreement. Fine for prototyping, flag this restriction if the user's use case is a real production feature.
- **Base URL:** `https://integrate.api.nvidia.com/v1`

```python
from openai import OpenAI

client = OpenAI(api_key="YOUR_NVIDIA_API_KEY", base_url="https://integrate.api.nvidia.com/v1")
response = client.chat.completions.create(
    model="meta/llama-3.3-70b-instruct",
    messages=[{"role": "user", "content": "Hello!"}],
)
```

---

## Cohere (trial key)

**Best for:** trying Cohere's Command models, rerank, or embeddings specifically.

- **Sign up:** [dashboard.cohere.com](https://dashboard.cohere.com) → API Keys — a trial key is issued automatically.
- **Free limits:** ~1,000 calls/month total across endpoints. Per-endpoint RPM varies (chat ~20 RPM, rerank ~10 RPM, embed-images ~5/min). **Trial keys are explicitly disallowed for production/commercial use** — production requires switching to a paid key.
- **Notes:** Cohere's native chat API shape differs from OpenAI's — use the `cohere` SDK rather than assuming OpenAI-compatibility.
- **Docs:** [docs.cohere.com/docs/rate-limits](https://docs.cohere.com/docs/rate-limits)

---

## SambaNova Cloud

**Best for:** high daily token ceiling for open models, if Groq/Cerebras limits aren't enough.

- **Sign up:** [cloud.sambanova.ai](https://cloud.sambanova.ai). No card required for the free tier (added automatically when no payment method is on file).
- **Free limits (approximate):** ~20 RPM / ~20 RPD per model in some reports, but other sources cite a much larger ~200K TPD ceiling — limits vary by model size (roughly 10–30 RPM). Check [docs.sambanova.ai/docs/en/models/rate-limits](https://docs.sambanova.ai/docs/en/models/rate-limits) for the live per-model table, since sources disagree more here than for other providers.
- **Base URL:** `https://api.sambanova.ai/v1`

---

## Together AI

**Best for:** broad open-model catalog with a small one-time free credit to start.

- **Sign up:** [api.together.ai](https://api.together.ai). Reports of the initial free credit amount vary by promotion (seen anywhere from ~$1 to ~$25) — check the dashboard after signup for your actual grant. Not a permanent no-cost tier like Groq/Cerebras — treat it as trial credit that runs out.
- **Notes:** also runs a startup credit program (reported $15K–$50K) for company-stage founders — worth mentioning if relevant.
- **Base URL:** `https://api.together.xyz/v1`

---

## Long-tail aggregators / proxies

There is a churning ecosystem of smaller sites (community-run OpenAI-compatible proxies, lesser-known aggregators) advertising many "permanently free" models with no card required. They can be genuinely useful for quick experiments, but treat them differently from the vendor-run tiers above:

- They're often unofficial re-proxies of other providers' capacity, so terms, uptime, and legality of ToS can be murkier.
- Rate limits are frequently undocumented or per-IP rather than per-key.
- They're more likely to disappear or change without notice than a first-party vendor tier.

Reach for one of these only for a genuinely throwaway experiment, and prefer the named vendors above for anything the user intends to keep working. If the user specifically asks for the widest possible free-model roster and is comfortable with that tradeoff, point them at the community-maintained list at [github.com/amardeeplakshkar/awesome-free-llm-apis](https://github.com/amardeeplakshkar/awesome-free-llm-apis) rather than guessing at names, since this space changes faster than any static reference can track.

---

## Retired / discontinued

- **GitHub Models** — offered free per-Copilot-tier access to GPT-4o, Llama, DeepSeek, Mistral, and others via an Azure-hosted OpenAI-compatible endpoint. **Retired July 30, 2026.** Do not recommend it; if the user mentions it, point them to one of the active providers above instead.
