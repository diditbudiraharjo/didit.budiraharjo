#!/bin/bash
set -euo pipefail

# claude-mem is a plugin + local worker service, not a remote MCP server,
# so its install lives in the container's ~/.claude home rather than in
# this repo's .mcp.json. Each web session gets a fresh container, so
# re-run the (idempotent) installer on every SessionStart.
if [ "${CLAUDE_CODE_REMOTE:-}" != "true" ]; then
  exit 0
fi

npx -y claude-mem@latest install \
  --ide claude-code \
  --provider claude \
  --runtime worker < /dev/null

# Installer skips worker autostart when run non-interactively; start it explicitly.
# A brief pause avoids a race with the installer's own worker shutdown/cleanup.
sleep 2
npx -y claude-mem@latest start < /dev/null
