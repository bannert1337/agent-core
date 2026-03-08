# Agent Core

## Why Agent Core?

This is a disciplined fork of [oh-my-openagent](https://github.com/code-yeongyu/oh-my-openagent) (formerly oh-my-opencode), created to return the project to its original promise: a robust, transparent, and genuinely open-source agent harness.

The upstream project has increasingly prioritized rapid "vibe-coding" and commercialization over code quality and community trust. This fork exists to provide a stable alternative focused on engineering rigor.

### What we're fixing

**1. Quality over velocity**
The original codebase has accumulated significant technical debt through AI-generated code merged without adequate review. We are systematically auditing, testing, and stabilizing core functionality. No features ship without verification.

**2. Community, not product**
We reject the pivot to a proprietary, for-profit "Sisyphus Labs" product. This fork remains fully open-source under permissive licensing with no "waitlists," paywalls, or dual-track development. The code you see is the code you get.

**3. Honest engineering**
We will not make unsubstantiated performance claims or marketing hyperbole. All benchmarks will be reproducible, all architectures documented, and all limitations acknowledged transparently.

### Our commitments

- **No vibe-coding**: All contributions undergo human review and testing
- **No commercial capture**: This project will never gate features behind a SaaS or "enterprise" tier
- **Stability first**: Breaking changes are avoided; when necessary, they are documented and migrated properly
- **Attribution**: We acknowledge the original work while correcting its trajectory

If you need an agent harness that treats reliability as a feature, not an afterthought, this is your core.

## Installation

Read the [Installation Guide](docs/guide/installation.md)

## Highlights

### 🪄 `ultrawork`

You're actually reading this? Wild.

Install. Type `ultrawork` (or `ulw`). Done.

Everything below, every feature, every optimization, you don't need to know it. It just works.

Even only with following subscriptions, ultrawork will work well (this project is not affiliated, this is just personal recommendation):

- [ChatGPT Subscription ($20)](https://chatgpt.com/)
- [Kimi Code Subscription ($0.99) (*only this month)](https://www.kimi.com/kimiplus/sale)
- [GLM Coding Plan ($10)](https://z.ai/subscribe)
- If you are eligible for pay-per-token, using kimi and gemini models won't cost you that much.

|       | Feature                                                  | What it does                                                                                                                                                                                                     |
| :---: | :------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|   🤖   | **Discipline Agents**                                    | Sisyphus orchestrates Hephaestus, Oracle, Librarian, Explore. A full AI dev team in parallel.                                                                                                                    |
|   ⚡   | **`ultrawork` / `ulw`**                                  | One word. Every agent activates. Doesn't stop until done.                                                                                                                                                        |
|   🚪   | **[IntentGate](https://factory.ai/news/terminal-bench)** | Analyzes true user intent before classifying or acting. No more literal misinterpretations.                                                                                                                      |
|   🔗   | **Hash-Anchored Edit Tool**                              | `LINE#ID` content hash validates every change. Zero stale-line errors. Inspired by [oh-my-pi](https://github.com/can1357/oh-my-pi). [The Harness Problem →](https://blog.can.ac/2026/02/12/the-harness-problem/) |
|   🛠️   | **LSP + AST-Grep**                                       | Workspace rename, pre-build diagnostics, AST-aware rewrites. IDE precision for agents.                                                                                                                           |
|   🧠   | **Background Agents**                                    | Fire 5+ specialists in parallel. Context stays lean. Results when ready.                                                                                                                                         |
|   📚   | **Built-in MCPs**                                        | Exa (web search), Context7 (official docs), Grep.app (GitHub search). Always on.                                                                                                                                 |
|   🔁   | **Ralph Loop / `/ulw-loop`**                             | Self-referential loop. Doesn't stop until 100% done.                                                                                                                                                             |
|   ✅   | **Todo Enforcer**                                        | Agent goes idle? System yanks it back. Your task gets done, period.                                                                                                                                              |
|   💬   | **Comment Checker**                                      | No AI slop in comments. Code reads like a senior wrote it.                                                                                                                                                       |
|   🖥️   | **Tmux Integration**                                     | Full interactive terminal. REPLs, debuggers, TUIs. All live.                                                                                                                                                     |
|   🔌   | **Claude Code Compatible**                               | Your hooks, commands, skills, MCPs, and plugins? All work here.                                                                                                                                                  |
|   🎯   | **Skill-Embedded MCPs**                                  | Skills carry their own MCP servers. No context bloat.                                                                                                                                                            |
|   📋   | **Prometheus Planner**                                   | Interview-mode strategic planning before any execution.                                                                                                                                                          |
|   🔍   | **`/init-deep`**                                         | Auto-generates hierarchical `AGENTS.md` files throughout your project. Great for both token efficiency and your agent's performance                                                                              |

### Discipline Agents

**Sisyphus** (`claude-opus-4-6` / **`kimi-k2.5`** / **`glm-5`** ) is your main orchestrator. He plans, delegates to specialists, and drives tasks to completion with aggressive parallel execution. He does not stop halfway.

**Hephaestus** (`gpt-5.3-codex`) is your autonomous deep worker. Give him a goal, not a recipe. He explores the codebase, researches patterns, and executes end-to-end without hand-holding. *The Legitimate Craftsman.*

**Prometheus** (`claude-opus-4-6` / **`kimi-k2.5`** / **`glm-5`** ) is your strategic planner. Interview mode: it questions, identifies scope, and builds a detailed plan before a single line of code is touched.

Every agent is tuned to its model's specific strengths. No manual model-juggling. [Learn more →](docs/guide/overview.md)

> Anthropic [blocked OpenCode because of us.](https://x.com/thdxr/status/2010149530486911014) That's why Hephaestus is called "The Legitimate Craftsman." The irony is intentional.
>
> We run best on Opus, but Kimi K2.5 + GPT-5.3 Codex already beats vanilla Claude Code. Zero config needed.

### Agent Orchestration

When Sisyphus delegates to a subagent, it doesn't pick a model. It picks a **category**. The category maps automatically to the right model:

| Category             | What it's for                      |
| :------------------- | :--------------------------------- |
| `visual-engineering` | Frontend, UI/UX, design            |
| `deep`               | Autonomous research + execution    |
| `quick`              | Single-file changes, typos         |
| `ultrabrain`         | Hard logic, architecture decisions |

Agent says what kind of work. Harness picks the right model. You touch nothing.

### Claude Code Compatibility

You dialed in your Claude Code setup. Good.

Every hook, command, skill, MCP, plugin works here unchanged. Full compatibility, including plugins.

### World-Class Tools for Your Agents

LSP, AST-Grep, Tmux, MCP actually integrated, not duct-taped together.

- **LSP**: `lsp_rename`, `lsp_goto_definition`, `lsp_find_references`, `lsp_diagnostics`. IDE precision for every agent
- **AST-Grep**: Pattern-aware code search and rewriting across 25 languages
- **Tmux**: Full interactive terminal. REPLs, debuggers, TUI apps. Your agent stays in session
- **MCP**: Web search, official docs, GitHub code search. All baked in

### Skill-Embedded MCPs

MCP servers eat your context budget. We fixed that.

Skills bring their own MCP servers. Spin up on-demand, scoped to task, gone when done. Context window stays clean.

### Codes Better. Hash-Anchored Edits

The harness problem is real. Most agent failures aren't the model. It's the edit tool.

> *"None of these tools give the model a stable, verifiable identifier for the lines it wants to change... They all rely on the model reproducing content it already saw. When it can't - and it often can't - the user blames the model."*
>
> <br/>- [Can Bölük, The Harness Problem](https://blog.can.ac/2026/02/12/the-harness-problem/)

Inspired by [oh-my-pi](https://github.com/can1357/oh-my-pi), we implemented **Hashline**. Every line the agent reads comes back tagged with a content hash:

```
11#VK| function hello() {
22#XJ|   return "world";
33#MB| }
```

The agent edits by referencing those tags. If the file changed since the last read, the hash won't match and the edit is rejected before corruption. No whitespace reproduction. No stale-line errors.

Grok Code Fast 1: **6.7% → 68.3%** success rate. Just from changing the edit tool.

### Deep Initialization. `/init-deep`

Run `/init-deep`. It generates hierarchical `AGENTS.md` files:

```
project/
├── AGENTS.md              ← project-wide context
├── src/
│   ├── AGENTS.md          ← src-specific context
│   └── components/
│       └── AGENTS.md      ← component-specific context
```

Agents auto-read relevant context. Zero manual management.

### Planning. Prometheus

Complex task? Don't prompt and pray.

`/start-work` calls Prometheus. **Interviews you like a real engineer**, identifies scope and ambiguities, builds a verified plan before touching code. Agent knows what it's building before it starts.

### Skills

Skills aren't just prompts. Each brings:

- Domain-tuned system instructions
- Embedded MCP servers, on-demand
- Scoped permissions. Agents stay in bounds

Built-ins: `playwright` (browser automation), `git-master` (atomic commits, rebase surgery), `frontend-ui-ux` (design-first UI).

Add your own: `.opencode/skills/*/SKILL.md` or `~/.config/opencode/skills/*/SKILL.md`.

**Want the full feature breakdown?** See the **[Features Documentation](docs/reference/features.md)** for agents, hooks, tools, MCPs, and everything else in detail.

---

> **New to Agent Core?** Read the **[Overview](docs/guide/overview.md)** to understand what you have, or check the **[Orchestration Guide](docs/guide/orchestration.md)** for how agents collaborate.

## Uninstallation

To remove oh-my-opencode:

1. **Remove the plugin from your OpenCode config**

   Edit `~/.config/opencode/opencode.json` (or `opencode.jsonc`) and remove `"oh-my-opencode"` from the `plugin` array:

   ```bash
   # Using jq
   jq '.plugin = [.plugin[] | select(. != "oh-my-opencode")]' \
       ~/.config/opencode/opencode.json > /tmp/oc.json && \
       mv /tmp/oc.json ~/.config/opencode/opencode.json
   ```

2. **Remove configuration files (optional)**

   ```bash
   # Remove user config
   rm -f ~/.config/opencode/oh-my-opencode.json ~/.config/opencode/oh-my-opencode.jsonc

   # Remove project config (if exists)
   rm -f .opencode/oh-my-opencode.json .opencode/oh-my-opencode.jsonc
   ```

3. **Verify removal**

   ```bash
   opencode --version
   # Plugin should no longer be loaded
   ```

## Features

Features you'll think should've always existed. Once you use them, you can't go back.

See full [Features Documentation](docs/reference/features.md).

**Quick Overview:**

- **Agents**: Sisyphus (the main agent), Prometheus (planner), Oracle (architecture/debugging), Librarian (docs/code search), Explore (fast codebase grep), Multimodal Looker
- **Background Agents**: Run multiple agents in parallel like a real dev team
- **LSP & AST Tools**: Refactoring, rename, diagnostics, AST-aware code search
- **Hash-anchored Edit Tool**: `LINE#ID` references validate content before applying every change. Surgical edits, zero stale-line errors
- **Context Injection**: Auto-inject AGENTS.md, README.md, conditional rules
- **Claude Code Compatibility**: Full hook system, commands, skills, agents, MCPs
- **Built-in MCPs**: websearch (Exa), context7 (docs), grep_app (GitHub search)
- **Session Tools**: List, read, search, and analyze session history
- **Productivity Features**: Ralph Loop, Todo Enforcer, Comment Checker, Think Mode, and more
- **Model Setup**: Agent-model matching is built into the [Installation Guide](docs/guide/installation.md#step-5-understand-your-model-setup)

## Configuration

Opinionated defaults, adjustable if you insist.

See [Configuration Documentation](docs/reference/configuration.md).

**Quick Overview:**

- **Config Locations**: `.opencode/oh-my-opencode.jsonc` or `.opencode/oh-my-opencode.json` (project), `~/.config/opencode/oh-my-opencode.jsonc` or `~/.config/opencode/oh-my-opencode.json` (user)
- **JSONC Support**: Comments and trailing commas supported
- **Agents**: Override models, temperatures, prompts, and permissions for any agent
- **Built-in Skills**: `playwright` (browser automation), `git-master` (atomic commits)
- **Sisyphus Agent**: Main orchestrator with Prometheus (Planner) and Metis (Plan Consultant)
- **Background Tasks**: Configure concurrency limits per provider/model
- **Categories**: Domain-specific task delegation (`visual`, `business-logic`, custom)
- **Hooks**: 25+ built-in hooks, all configurable via `disabled_hooks`
- **MCPs**: Built-in websearch (Exa), context7 (docs), grep_app (GitHub search)
- **LSP**: Full LSP support with refactoring tools
- **Experimental**: Aggressive truncation, auto-resume, and more

## Author's Note

**Want the philosophy?** Read the [Ultrawork Manifesto](docs/manifesto.md).

---

I burned through $24K in LLM tokens on personal projects. Tried every tool. Configured everything to death. OpenCode won.

Every problem I hit, the fix is baked into this plugin. Install and go.

If OpenCode is Debian/Arch, OmO is Ubuntu/[Omarchy](https://omarchy.org/).

Heavy influence from [AmpCode](https://ampcode.com) and [Claude Code](https://code.claude.com/docs/overview). Features ported, often improved. Still building. It's **Open**Code.

Other harnesses promise multi-model orchestration. We ship it. Stability too. And features that actually work.

I'm this project's most obsessive user:

- Which model has the sharpest logic?
- Who's the debugging god?
- Who writes the best prose?
- Who dominates frontend?
- Who owns backend?
- What's fastest for daily driving?
- What are competitors shipping?

This plugin is the distillation. Take the best. Got improvements? PRs welcome.

**Stop agonizing over harness choices.**
**I'll research, steal the best, and ship it here.**

Sounds arrogant? Have a better way? Contribute. You're welcome.

No affiliation with any project/model mentioned. Just personal experimentation.

99% of this project was built with OpenCode. I don't really know TypeScript. **But I personally reviewed and largely rewrote this doc.**
