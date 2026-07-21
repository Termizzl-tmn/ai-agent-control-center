# AgentFlow — Project Proposal
> v0.3.0 · Pixel Art Edition · Confidential 2026

**Author:** Weerapat Srisawat (Ter) | **Version:** 0.3.0 — Pixel Art Edition
**Stack:** Electron · Next.js · PixiJS v8 · Claude API | **Timeline:** 3 months (MVP)

---

> **📋 What changed in v0.3.0**
> Added PixiJS v8 as the pixel art rendering layer for the office scene.
> Added Claude Design workflow for UI mockup (replaces Google Stitch).
> Added Leonardo.ai prompt guides for sprite generation.
> Added pixijs-skills integration for Claude Code.
> Added DESIGN-PIXEL.md, PROMPTS-PIXEL.md, PROMPTS-CLAUDE-DESIGN.md to project docs.
> All architecture, IPC, and agent role decisions from v0.2.0 remain unchanged.

---

## 1. Project Overview

AgentFlow is a desktop application (Electron + Next.js) that gives a solo developer full visibility and control over AI agent workflows across the entire software development lifecycle — from product planning through delivery.

v0.3.0 adds a **Pixel Art Office Scene** powered by PixiJS v8 — agents are represented as animated 16×16 pixel art characters that move around a virtual office, with their animation state (idle, walk, action, error, done) directly reflecting real-time agent status from the IPC layer.

---

## 2. Why Electron (unchanged from v0.2.0)

| Requirement | Next.js (Web) | Electron (Desktop) |
|---|---|---|
| filesystem access | ❌ Browser sandbox | ✅ Full Node.js fs |
| Run terminal / scripts | ❌ Not possible | ✅ child_process / node-pty |
| Watch agent log files | ❌ Needs local daemon | ✅ fs.watch / chokidar |
| Offline usage | ❌ Needs server running | ✅ Works offline |
| PixiJS canvas rendering | ✅ Works | ✅ Works (WebGL in Electron) |
| Zero infra cost (solo) | ⚠️ Vercel + Redis + DB | ✅ SQLite local |

> **💡 Key Insight:** Electron Main Process = full Node.js power (fs, terminal, IPC). Next.js Renderer = the React UI you already know. PixiJS runs in Electron's Chromium WebGL context natively.

---

## 3. System Architecture

### Main Process (Node.js)

- Spawns and manages agent processes via `child_process` / `node-pty`
- Reads/writes local filesystem, watches logs via chokidar
- Calls Claude API via Anthropic SDK with streaming
- Manages SQLite via Prisma (agent history, workflow configs)
- Pushes real-time agent status to Renderer via Electron IPC

### Renderer Process (Next.js + PixiJS)

- Next.js App Router — Dashboard, Pipeline Builder, Logs, Settings pages
- PixiJS v8 canvas — Pixel Art Office Scene embedded in Dashboard
- Zustand — real-time agent state from IPC → UI + PixiJS scene
- React Flow — drag-and-drop pipeline builder

### IPC Bridge (Electron preload.js)

- Typed API surface between Main ↔ Renderer
- Agent status events flow: `Main → IPC → Zustand → PixiJS AnimatedSprite.setState()`
- TypeScript interfaces shared in `shared/types/`

### PixiJS Scene Layer

- PixiJS v8 Application embedded as React component in Dashboard
- Assets loaded via `Assets.load()` — JSON atlas + PNG spritesheet per agent
- RenderLayer system: floor → objects → agents → HUD
- AnimatedSprite state machine: idle / walk / action / error / done
- `scaleMode: nearest` — pixel-perfect rendering at 3x scale (48×48)

---

## 4. Technology Stack

### Desktop Runtime

| Technology | Version | Role |
|---|---|---|
| Electron | 32.x | Desktop shell — OS access, window management |
| Nextron | 9.x | Electron + Next.js scaffold |
| electron-builder | 25.x | Package .dmg / .exe |
| node-pty | 1.x | Real terminal sessions in app |

### Frontend (Renderer Process)

| Technology | Version | Role |
|---|---|---|
| Next.js | 15 (App Router) | React framework for all UI pages |
| TypeScript | 5.x | Type safety across IPC, agent schemas, PixiJS |
| Tailwind CSS | 4.x | Utility-first styling |
| shadcn/ui | latest | Accessible component library |
| **PixiJS v8** | **8.x** | **Pixel art office scene — WebGL/WebGPU renderer** |
| React Flow | 12.x | Drag-and-drop pipeline builder |
| Recharts | 2.x | Agent metrics charts |
| Zustand | 5.x | Real-time agent state → IPC → PixiJS |

### Backend (Main Process)

| Technology | Version | Role |
|---|---|---|
| Anthropic SDK | 0.27.x | Claude API — streaming, tool use, structured output |
| Vercel AI SDK | 4.x | Structured outputs, tool use helpers |
| SQLite + Prisma | 5.x | Local DB — history, workflow configs |
| p-queue | 8.x | In-process agent job queue |
| chokidar | 4.x | Watch filesystem for agent log changes |

### Developer Tooling

| Technology | Version | Role |
|---|---|---|
| Vitest | 2.x | Unit & integration tests |
| Playwright | 1.x | E2E tests for Electron app |
| **pixijs-skills** | **latest** | **Claude Code plugin for PixiJS v8 correct patterns** |
| ESLint + Prettier | latest | Code quality & formatting |
| GitHub Actions | — | CI: lint, test, build on push |

---

## 5. PixiJS v8 — Pixel Art Scene

The office scene is a PixiJS v8 Application rendered inside a React component on the Dashboard page. It uses a 16×16px tile grid, rendered at 3x scale (48×48px per tile), with WebGPU/WebGL auto-detection.

### Sprite Spec

| Spec | Value |
|---|---|
| Native frame size | 16×16 px |
| Render scale | 3x = 48×48 px (cards), 4x = 64×64 px (featured) |
| scaleMode | `nearest` (crisp pixels — no bilinear) |
| Spritesheet format | PNG + JSON atlas (PixiJS Spritesheet standard) |
| Animation states | 5: idle (3f), walk (4f), action (4f), error (2f), done (3f) |
| Loading | `Assets.load('agent.json')` → `AnimatedSprite` |
| Layers | RenderLayer: floor → objects → agents → HUD |

### Agent Status → Sprite State Mapping

```ts
// IPC event → Zustand → PixiJS AnimatedSprite
const stateMap = {
  running: 'action',   waiting: 'idle',
  walking: 'walk',     error:   'error',
  done:    'done',     idle:    'idle',
}
sprite.setState(stateMap[agentStatus])
```

### Claude Code Integration (pixijs-skills)

Install the official PixiJS skills plugin before coding the scene:

```bash
# In Claude Code
/plugin marketplace add pixijs/pixijs-skills

# Or universal (any AI agent)
npx skills add https://github.com/pixijs/pixijs-skills
```

---

## 6. Design System

### Visual Identity — "Retro Terminal meets Pixel Office"

| Token | Dark Value | Usage |
|---|---|---|
| `bg-base` | `#060B16` | Main background |
| `bg-surface` | `#0D1120` | Cards, panels |
| `color-running` | `#00E5A0` | Agent running / neon green |
| `color-waiting` | `#F5C542` | Agent waiting / amber |
| `color-done` | `#4D9FFF` | Agent done / blue |
| `color-error` | `#FF4D6D` | Agent error / red |
| `font-display` | Syne 700/800 | Headings, agent names |
| `font-mono` | DM Mono | Labels, timestamps, logs |

### Agent Visual Identity

| Role | Shirt Color | Prop | Desk Object |
|---|---|---|---|
| PO | `#7C3AED` purple | Clipboard | Sticky notes stack |
| PM | `#0284C7` blue | Tablet | Gantt chart |
| Tech Lead | `#059669` green | Blueprint roll | Whiteboard |
| Developer | `#00E5A0` teal | Laptop | Dual monitors |
| QA | `#D97706` amber | Magnifying glass | Bug report clipboard |
| DevOps | `#DC2626` red | Wrench | Server rack |
| Notifier | `#6B7280` gray | Megaphone | Golden bell |

---

## 7. Design Workflow

### UI Mockup — Claude Design

All dashboard screens are prototyped in **Claude Design** (`claude.ai/design`) before implementation. The `PROMPTS-CLAUDE-DESIGN.md` file contains ready-to-use prompts for 5 screens: Dashboard, Pipeline Builder, Agent Detail, QA Role View, Settings.

- Start with System Context prompt to lock design system (colors, fonts, style)
- Prototype each screen via conversation + inline refinement
- Handoff bundle → Claude Code → Next.js + Tailwind implementation

### Pixel Art Sprites — Leonardo.ai

Agent sprites are generated via **Leonardo.ai** (Pixel Art model) following the `PROMPTS-PIXEL.md` guide, then assembled in Aseprite and exported as PixiJS-compatible JSON atlas + PNG.

| Step | Action |
|---|---|
| 1 — Concept | Generate concept sheet (512×512) — lock character design + seed |
| 2 — States | Generate 5 state strips (256×16 each) using same seed |
| 3 — Aseprite | Assemble strips → export PNG spritesheet + JSON atlas |
| 4 — PixiJS | `Assets.load('agent.json')` → `AnimatedSprite` → `scale.set(3)` |
| 5 — IPC | `onAgentStatus` → `setState()` → swap textures |

---

## 8. Project Documentation Files

| File | Purpose |
|---|---|
| `DESIGN.md` | UI design system — colors, typography, component specs, dark theme |
| `DESIGN-PIXEL.md` | Pixel art spec — grid, spritesheet format, AgentSprite class, RenderLayer |
| `PROMPTS-PIXEL.md` | Leonardo.ai prompts — concept sheets + 5 state strips for all 7 agents |
| `PROMPTS-CLAUDE-DESIGN.md` | Claude Design prompts — UI mockup for all 5 app screens |

---

## 9. Project Scaffold

```bash
npx create-nextron-app agentflow --example with-tailwindcss
cd agentflow && npm install pixi.js @anthropic-ai/sdk
npm run dev    # Electron + Next.js hot reload
```

### Directory Structure

| Path | Purpose |
|---|---|
| `main/background.ts` | Electron Main Process — IPC handlers, agent runner |
| `main/agents/` | Agent modules (BacklogAgent, CodeAgent, TestAgent…) |
| `main/ipc/` | IPC channel definitions (typed, shared with renderer) |
| `main/db/` | Prisma client, SQLite schema, migrations |
| `renderer/pages/` | Next.js pages — dashboard, pipeline, logs, settings |
| `renderer/components/pixi/` | PixiJS components — OfficeScene, AgentSprite, StatusBubble |
| `renderer/store/` | Zustand stores — agentStore, workflowStore |
| `shared/types/` | Shared TypeScript types — IPC contracts, agent schemas |
| `assets/sprites/agents/` | PNG spritesheets + JSON atlases (one per agent role) |
| `assets/sprites/tiles/` | Office tileset PNG + JSON |

---

## 10. Agent Role Architecture

| Role | Agent | Responsibilities | Key Tools |
|---|---|---|---|
| PO | Backlog Agent | User stories, acceptance criteria, backlog grooming | Claude API, Markdown |
| PM | Planning Agent | Sprint planning, milestones, dependency detection | fs, Claude API |
| Tech Lead | Architect Agent | System design review, ADR drafts, tech debt | fs, Claude API |
| Developer | Code Agent | Code generation, PR summaries, refactor | child_process, git, Claude API |
| QA | Test Agent | Test case gen, Playwright scripts, coverage | Playwright, Claude API |
| DevOps | Pipeline Agent | CI/CD status, deploy health, log watching | chokidar, child_process |
| Notifier | Alert Agent | Slack/LINE/email dispatch on configurable triggers | HTTP, Claude API |

---

## 11. Key Features by Phase

### Phase 1 — MVP (Month 1–2)

- Dashboard with live agent status cards via IPC (running, waiting, done, error)
- **Pixel Art Office Scene** — 7 agents walking and working in PixiJS canvas
- Pipeline view — sequential agent flow with React Flow
- Activity log per agent with severity filtering
- Manual trigger, pause, and retry from UI
- Claude API integration with streaming output
- Role-based views — PO, Dev, QA presets
- Terminal panel — embedded PTY output for running agents
- Local SQLite persistence — agent history, workflow configs

### Phase 2 — Enhanced (Month 3)

- Drag-and-drop pipeline builder — save and reuse workflow templates
- Scheduled agents — cron-based triggers via node-cron
- Filesystem watcher — auto-trigger agents when files change
- Slack / LINE alert dispatch via Alert Agent
- Agent performance metrics — avg run time, token usage, success rate
- GitHub integration — PR events trigger Code Agent or Test Agent

### Phase 3 — Future

- Full pixel office scene — pathfinding, agent conversations, speech bubbles
- Export workflow as shareable JSON template
- Multi-project support — switch between codebases
- Claude Code log integration — parse & visualize in-editor agent events
- OpenAI / Gemini as alternative LLM backends

---

## 12. Project Timeline

| Phase | Duration | Deliverables |
|---|---|---|
| Phase 0 — Setup | Week 1 | Nextron scaffold, SQLite + Prisma, IPC bridge, PixiJS init, CI |
| Phase 1 — Core | Week 2–4 | Agent runner, Claude API streaming, IPC → Zustand → UI |
| Phase 1 — Scene | Week 4–5 | PixiJS office scene, AgentSprite class, all 7 agent sprites |
| Phase 1 — Dashboard | Week 5–6 | Agent cards, log panel, role views, terminal PTY panel |
| Phase 2 — Builder | Week 7–9 | React Flow pipeline builder, workflow save/load, scheduling |
| Phase 2 — Integrations | Week 10 | GitHub webhook, Slack/LINE alerts, filesystem watcher |
| Polish & Package | Week 11–12 | Error handling, Vitest/Playwright tests, electron-builder .dmg |

---

## 13. Risks & Mitigations

| Risk | Level | Mitigation |
|---|---|---|
| Electron IPC complexity | Medium | Define typed IPC contracts in `shared/types/` from day 1 |
| node-pty native build issues | Medium | Use electron-rebuild, pin versions, test on target OS early |
| Pixel art sprite quality | Medium | Use free itch.io pack for Phase 1, custom sprites Phase 2+ |
| PixiJS WebGL in Electron | Low | Electron Chromium supports WebGL/WebGPU — tested pattern |
| Claude API token cost | Low | Cache in SQLite, set max_tokens budget per agent |
| Scope creep | High | Phase 1 locked — full pixel office scene is Phase 3 |

---

## 14. Success Metrics

MVP is considered successful when:

- All 7 agent roles are runnable end-to-end from the desktop app
- Pixel art sprites animate correctly reflecting real IPC agent status
- Agent status updates arrive in UI within 200ms via IPC
- PixiJS scene renders at stable 60fps in Electron window
- Filesystem and terminal access work reliably on macOS & Windows
- Workflow configs persist correctly in local SQLite across restarts
- App builds to a distributable `.dmg` / `.exe` via electron-builder
- At least one full PO → Dev → QA pipeline runs without manual intervention

---

*This is a living document. Stack and pixel art decisions are final for MVP. Phase 2+ subject to revision based on Phase 1 learnings.*

*AgentFlow · Weerapat Srisawat (Ter) · 2026*
