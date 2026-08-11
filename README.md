# didit.budiraharjo

Personal Claude Code configuration for this environment.

## Contents

- `.mcp.json` — project-scoped MCP servers (ComfyUI Cloud, Context7, Sequential Thinking)
- `.claude/commands/sc/` — [SuperClaude Framework](https://github.com/SuperClaude-Org/SuperClaude_Framework) slash commands (`/sc:*`)
- `.claude/agents/` — SuperClaude specialist subagents (architect, security-engineer, python-expert, etc.)
- `.claude/skills/` — SuperClaude skills (pm, deep-research, brainstorm, troubleshoot, confidence-check, token-efficiency)

## SuperClaude Framework

Vendored from SuperClaude-Org/SuperClaude_Framework v4.3.0 (commands + agents + skills only — this
mirrors what `superclaude install` copies to `~/.claude/`, checked into this repo instead so it
travels with the project). Framework hooks (auto-run `/pm` on session start, etc.) were left out
since they change session behavior by default; see the upstream repo's `plugins/superclaude/hooks/`
if you want them.

Once this repo is open as a Claude Code project, commands are available as `/sc:implement`,
`/sc:brainstorm`, `/sc:analyze`, etc. — run `/sc` for the full list.
