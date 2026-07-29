# OmniRoute

[OmniRoute](https://github.com/diegosouzapw/OmniRoute) is a self-hosted AI gateway: a local CLI/server that
proxies coding-tool traffic (Claude Code, Cursor, Cline, Copilot, etc.) across many third-party AI providers,
with routing, fallback, and response compression. It runs as its own standalone process — it is not a library
vendored into this site's codebase.

## Install

```bash
npm install -g omniroute
omniroute
```

- Dashboard: `http://localhost:20128`
- API: `http://localhost:20128/v1`

## Point a coding tool at it

```txt
Base URL: http://localhost:20128/v1
API Key:  [copy from Dashboard → Endpoints]
Model:    auto
```

Verify:

```bash
curl http://localhost:20128/v1/models -H "Authorization: Bearer YOUR_KEY"
```

## Note on provider terms

OmniRoute aggregates the free tiers of many providers. Its own documentation flags a subset of those
providers as ToS-sensitive for this kind of use (see `docs/reference/FREE_TIERS.md` in the upstream repo).
Review a provider's terms before connecting it through OmniRoute.

## Links

- Source: https://github.com/diegosouzapw/OmniRoute
- Docs / full README: https://github.com/diegosouzapw/OmniRoute#readme
