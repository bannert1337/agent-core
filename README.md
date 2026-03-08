# Agent Core

A disciplined fork of [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) focused on engineering rigor, community ownership, and transparent development.

## Why Agent Core?

The upstream project has increasingly prioritized rapid "vibe-coding" and commercialization over code quality and community trust. This fork exists to provide a stable alternative that returns to the original promise: a robust, transparent, and genuinely open-source agent harness.

### What we are fixing

**1. Quality over velocity**

The original codebase has accumulated significant technical debt through AI-generated code merged without adequate review. We are systematically auditing, testing, and stabilizing core functionality. No features ship without verification.

**2. Community, not product**

This fork rejects the pivot to a proprietary, for-profit product. It remains fully open-source under AGPL-3.0 with no waitlists, paywalls, or dual-track development. The code you see is the code you get.

**3. Honest engineering**

We do not make unsubstantiated performance claims or marketing hyperbole. All benchmarks are reproducible, all architectures are documented, and all limitations are acknowledged transparently.

### Our commitments

- **No vibe-coding**: All contributions undergo human review and testing
- **No commercial capture**: This project will never gate features behind a SaaS or enterprise tier
- **Stability first**: Breaking changes are avoided; when necessary, they are documented and migrated properly
- **Attribution**: We acknowledge the original work while correcting its trajectory

If you need an agent harness that treats reliability as a feature, not an afterthought, this is your core.

## Installation

See the [Installation Guide](docs/guide/installation.md) for setup instructions.

## Features

### Multi-Agent Orchestration

Agent Core provides specialized agents for different tasks:

| Agent | Purpose |
|-------|---------|
| **Sisyphus** | Main orchestrator. Plans, delegates, and drives tasks to completion with parallel execution |
| **Hephaestus** | Autonomous deep worker for end-to-end research and implementation |
| **Prometheus** | Strategic planner using interview mode to identify scope before execution |
| **Oracle** | Architecture decisions, code review, and debugging consultation |
| **Librarian** | Documentation lookup and multi-repo analysis |
| **Explore** | Fast codebase exploration and contextual search |

Each agent is tuned to specific model strengths with automatic fallback chains.

### Development Tools

**LSP Integration**
- Workspace-wide rename, goto definition, find references
- Pre-build diagnostics via `lsp_diagnostics`
- IDE-level precision for agent-driven refactoring

**AST-Grep**
- Pattern-aware code search across 25 languages
- AST-aware rewrites with `ast_grep_replace`

**Tmux Integration**
- Full interactive terminal for REPLs, debuggers, and TUIs
- Background agents spawn in separate tmux panes
- Persistent sessions for long-running tasks

### Hash-Anchored Edit Tool

The edit tool uses `LINE#ID` format with content hash validation:

```
11#VK| function hello() {
22#XJ|   return "world";
33#MB| }
```

Agents edit by referencing these tags. If the file changed since the last read, the hash mismatch rejects the edit before corruption occurs. This eliminates stale-line errors and whitespace reproduction issues.

### Background Agents

Run multiple specialists in parallel:

```typescript
task({
  category: "deep",
  prompt: "Research authentication patterns",
  run_in_background: true
});
```

Context stays lean. Results are available when needed via `background_output()`.

### Built-in MCPs

- **websearch**: Web search powered by Exa AI
- **context7**: Official documentation lookup for libraries and frameworks
- **grep_app**: Code search across public GitHub repositories

### Skill System

Skills provide domain-specific expertise with embedded MCP servers:

- **git-master**: Atomic commits, rebase strategies, history archaeology
- **playwright**: Browser automation and testing
- **frontend-ui-ux**: Design-first UI implementation

Skills carry their own MCP servers. They spin up on-demand, scoped to the task, and terminate when done. This keeps the context window clean.

### Planning with Prometheus

Complex tasks benefit from structured planning. Prometheus interviews you like a real engineer, identifies scope and ambiguities, and builds a verified plan before any code is touched. Execute plans via `/start-work`.

### Claude Code Compatibility

All Claude Code hooks, commands, skills, MCPs, and plugins work without modification. Existing configurations in `.claude/` directories are automatically detected and loaded.

## Configuration

Configuration uses JSONC (JSON with comments) at project or user level:

| Location | Path |
|----------|------|
| Project | `.opencode/agent-core.jsonc` |
| User (macOS/Linux) | `~/.config/opencode/agent-core.jsonc` |
| User (Windows) | `%APPDATA%\opencode\agent-core.jsonc` |

> Note: `oh-my-opencode.jsonc` is still supported as a fallback.

See the [Configuration Reference](docs/reference/configuration.md) for all available options.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on:

- Development setup with Bun
- Code style and conventions
- Adding agents, hooks, tools, or MCPs
- Pull request process

## License

This project is a modified version of oh-my-opencode, originally created by YeonGyu Kim.

Agent Core is licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See [LICENSE](LICENSE) for the full text.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU Affero General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
