---
name: free-llm-apis
description: Helps pick and wire up a free-tier LLM API instead of a paid one. Use this whenever the user wants to build or prototype something that calls an LLM (a chatbot, agent, script, app feature) and wants to avoid API costs, mentions "free LLM API," "no-cost API," "free tier," a limited budget/hobby project, or asks things like "what free LLM APIs are there" or "which provider should I use for this side project." Also use it when the user names a specific free-tier provider (Groq, Gemini/Google AI Studio, OpenRouter free models, Cerebras, Mistral free tier, Cloudflare Workers AI, Hugging Face Inference, NVIDIA NIM, Cohere trial, SambaNova, Together AI) and needs signup steps, rate limits, or example code. Covers both picking the right free provider for the task and writing the actual API call.
---

# Free LLM APIs

## Why this matters

Free LLM tiers exist on a spectrum from "genuinely free forever, just rate-limited" (Groq, Google AI Studio, Cerebras) to "trial credits that expire or need a card eventually" (Together AI, Cohere) to "aggregators that aren't the vendor and can vanish or throttle without notice" (long-tail OpenRouter-alikes). Recommending the wrong kind for the job wastes the user's time — either they hit a wall mid-build, or they over-engineer around limits that don't matter for a prototype. Pick deliberately, don't just default to whichever provider is best-known.

**Rate limits and free-tier terms change often** (providers tighten or loosen them, models get deprecated, services get retired — GitHub Models, for example, shut down in mid-2026). Treat every number in this skill, including `references/providers.md`, as "true as of when it was written, verify before committing to it for anything beyond a quick prototype." If the user's project matters — a real launch, not a weekend hack — do a live web search or check the provider's own docs page before locking in a choice.

## Step 1: Understand what the user actually needs

Ask (or infer from context) before recommending:

1. **Volume and pattern** — a one-off script, a demo hit occasionally, or something with real (if small) traffic? Free tiers are quoted in requests/minute, requests/day, and tokens/minute — a chatty agent loop that fires dozens of calls per task burns through per-minute caps fast even if the daily cap looks generous.
2. **Model quality bar** — does this need frontier-level reasoning, or is a solid open-weight model (Llama, Qwen, Gemma, DeepSeek) enough? Free tiers with the *best* models (Gemini 2.5 Pro, Mistral Large) tend to have the *tightest* limits; free tiers with generous limits (Groq, Cerebras) mostly serve open-weight models.
3. **Latency sensitivity** — Groq and Cerebras run on custom inference hardware (LPU/wafer-scale) and are dramatically faster token-for-token than typical GPU-hosted APIs. Worth leading with if the user cares about snappy UX (voice agents, live chat).
4. **Longevity** — throwaway hackathon project vs. something they'll keep running? For anything longer-lived, prefer a first-party vendor tier (Google, Mistral, Cohere, official Groq/Cerebras) over a third-party re-proxy aggregator, which can disappear or change terms unilaterally.
5. **Multi-provider tolerance** — is it fine to route across several free tiers to multiply effective quota (e.g. via OpenRouter's aggregated `:free` models, or hand-rolled fallback logic), or does the user want one simple provider?

## Step 2: Pick a provider

Quick defaults, from `references/providers.md` — read that file for full details, current rate limits, signup links, and per-provider code:

| If the user needs... | Reach for |
|---|---|
| Fastest inference, generous no-card free tier, good open models | **Groq** |
| Best free-tier model quality (Gemini Flash/Pro) | **Google AI Studio (Gemini API)** |
| Extremely fast inference, most generous token/day cap | **Cerebras Cloud** |
| One API key, many free open-weight models, easy fallback across providers | **OpenRouter** (`:free`-suffixed models) |
| Access to a top proprietary model (Mistral Large, Codestral) for evaluation | **Mistral La Plateforme** (free "Experiment" tier) |
| Edge deployment / already on Cloudflare | **Cloudflare Workers AI** |
| Broadest catalog of open-source models (not just chat) | **Hugging Face Inference Providers** |
| To try many models incl. proprietary frontier ones for dev/eval | **NVIDIA NIM (build.nvidia.com)** |
| Reranking, embeddings, or a specific Cohere feature to trial | **Cohere trial key** |
| Very high daily token cap for open models | **SambaNova Cloud** |

When unsure, or when the user wants resilience against any single provider's outage/limits, suggest **starting with Groq or Gemini for quality/speed, and wiring OpenRouter (or manual fallback across 2 providers) as a backup** — most of these APIs are OpenAI-compatible, so switching `base_url` and API key is a one-line change (see below).

## Step 3: Wire it up

Nearly every provider in `references/providers.md` exposes an **OpenAI-compatible** `/chat/completions` endpoint, so the same client code works across providers — only `base_url`, `api_key`, and `model` change:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.groq.com/openai/v1",   # swap per provider — see references/providers.md
    api_key="YOUR_API_KEY",                        # from an env var, never hardcoded
)

response = client.chat.completions.create(
    model="llama-3.3-70b-versatile",                # swap per provider
    messages=[{"role": "user", "content": "Hello!"}],
)
print(response.choices[0].message.content)
```

Practical notes:

- **Never hardcode the API key** — read it from an environment variable (`os.environ["GROQ_API_KEY"]`) and remind the user to add it to `.env` / their secrets manager, not commit it.
- **Handle 429s.** Free tiers exist to be rate-limited; a real integration should catch 429 responses and back off (exponential backoff, or queue+retry), not just fail. For anything beyond a quick script, this is worth building in from the start.
- **A couple of providers are not OpenAI-compatible out of the box** (e.g. Cohere's chat endpoint has its own shape, Google's native SDK differs from its OpenAI-compat endpoint) — `references/providers.md` flags these and shows the right call shape.
- If the user is building something that will call the LLM many times per task (an agent loop), multiply expected call volume by steps-per-task before checking it against a per-minute limit — this is the most common way a free tier that "sounded generous" turns out to be too tight.

## Step 4: Sanity-check before they build on it

Before the user commits real development time to a specific free tier, flag anything that matters for their case:
- Daily/monthly caps that reset on a rolling window vs. a fixed clock (affects burst usage)
- Whether the free tier is explicitly marked "not for production" (Cohere trial, Mistral Experiment, NVIDIA NIM eval) — fine for building/demoing, not for something end users depend on
- Context window caps that can be much smaller on the free tier than the paid tier (e.g. Cerebras)
- Whether a credit card is required (some "free" tiers require one on file even if unbilled — worth flagging since users asking for "free" often mean "no card")

For full per-provider detail — exact limits, signup steps, and copy-pasteable code — see `references/providers.md`.
