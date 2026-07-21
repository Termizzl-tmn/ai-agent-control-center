# CLAUDE.md — AgentFlow
> AI Agent Control Center · Desktop App · Electron + Next.js + PixiJS v8

This file is read by Claude Code at the start of every session.
Follow all instructions here before writing any code.

---

## Project Identity

**AgentFlow** is a solo desktop application that gives a developer full visibility
and control over AI agent workflows across the software development lifecycle.
It is NOT a SaaS product. It is NOT a web app. It runs locally on one machine.

- **Owner:** Weerapat Srisawat (Ter)
- **Stack:** Electron 31 + Nextron 9 + Next.js 14 (pages router) + PixiJS v8 + Claude API
- **DB:** SQLite via better-sqlite3 (raw SQL, inline migrations in `main/db.ts`)
- **Proposals/Design:** `AgentFlow-Proposal-v0.3.0.md`, `DESIGN.md`, `DESIGN-PIXEL.md` (root)

---

## Architecture Overview

```
Electron Main Process (Node.js)
  ├── executor.ts        — node-pty shell agents (pty mode)
  ├── claudeExecutor.ts  — Anthropic SDK streaming agents (claude mode)
  ├── db.ts              — better-sqlite3 singleton, inline migrations, seed data
  ├── watcher.ts         — chokidar filesystem watcher
  └── ipc/index.ts       — ipcMain.handle() registrations + sendToRenderer()

IPC Bridge (main/preload.ts)
  └── exposes window.ipc — typed methods, returns cleanup fns for push channels

Electron Renderer (Next.js pages router)
  ├── pages/_app.tsx     — IPC push listeners registered once here (survive nav)
  ├── pages/index.tsx    — Dashboard: agent cards + tabs (Office / Logs / Terminal)
  ├── pages/pipeline.tsx — Pipeline view (ReactFlow)
  ├── pages/settings.tsx — API key + model config
  └── store/agentStore.ts — Zustand: agents, logs, terminalOutput, selectedAgentId

PixiJS v8 Scene (renderer/components/pixi/)
  ├── OfficeScene.tsx  — Application init, floor/labels, sprite lifecycle
  ├── AgentSprite.ts   — Container: placeholder Graphics + optional AnimatedSprite
  └── sceneConfig.ts   — TILE, SCALE, SCENE_W/H, ROLE_HOME, ROLE_COLOR, tileToPixel
```

**Critical flow:**
```
Agent runs in Main → onOutput/onDone callbacks → sendToRenderer() →
IPC push → _app.tsx listeners → agentStore actions →
React re-renders + AgentSprite.setState()
```

**Agent modes:**

- `pty` — runs `agent.command` in a node-pty shell, streams raw output
- `claude` — sends `agent.command` as system prompt to Claude API, streams text

---

## Directory Structure (actual)

```
ai-agent-control-center/
├── main/
│   ├── background.ts        ← Electron entry, single-instance lock, createWindow
│   ├── executor.ts          ← pty mode: node-pty + p-queue, processes Map
│   ├── claudeExecutor.ts    ← claude mode: Anthropic SDK streaming, AbortController Map
│   ├── db.ts                ← better-sqlite3 singleton, migrate(), seedDefaultAgents()
│   ├── watcher.ts           ← chokidar FSWatcher per directory
│   ├── preload.ts           ← contextBridge → window.ipc
│   └── ipc/
│       ├── index.ts         ← registerIpcHandlers(), sendToRenderer(), addLog()
│       └── types.ts         ← Agent, TaskRun, LogEntry, AgentStatus, AgentRole,
│                               AgentMode, RunCallbacks, IPC const, helpers
├── renderer/
│   ├── pages/
│   │   ├── _app.tsx         ← global IPC listener useEffect (onTaskOutput/Done/LogEntry)
│   │   ├── index.tsx        ← Dashboard (AgentCard grid + Office/Logs/Terminal tabs)
│   │   ├── pipeline.tsx     ← PipelineView (ReactFlow, dynamic import)
│   │   └── settings.tsx     ← API key, model selector
│   ├── components/
│   │   ├── pixi/
│   │   │   ├── OfficeScene.tsx  ← PixiJS React wrapper (useEffect, dynamic imported)
│   │   │   ├── AgentSprite.ts   ← placeholder Graphics + optional AnimatedSprite
│   │   │   └── sceneConfig.ts   ← scene constants and layout
│   │   ├── AgentCard.tsx        ← run/kill buttons, status badge, role border
│   │   ├── LogPanel.tsx         ← activity log list from agentStore
│   │   ├── PipelineView.tsx     ← ReactFlow with useMemo buildGraph + memo AgentNode
│   │   ├── StatusBadge.tsx      ← inline status pill
│   │   └── TerminalPanel.tsx    ← streaming terminal output for selected agent
│   ├── lib/
│   │   ├── ipc.ts           ← window.ipc accessor, AppSettings type, Window augment
│   │   ├── agentMeta.ts     ← ROLE_META (icon/label/color), ROLE_BORDER (Tailwind)
│   │   └── utils.ts         ← cn() helper
│   ├── store/
│   │   └── agentStore.ts    ← agents, logs, terminalOutput, selectedAgentId + actions
│   └── globals.d.ts
├── scripts/
│   └── patch-winpty.js      ← patches winpty.gyp before node-pty rebuild (postinstall)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Coding Rules

### General

- **TypeScript strict mode** — no `any`, no implicit types
- All files use named exports (no default exports except pages)
- Max function length: 50 lines — extract if longer
- No comments explaining *what* the code does — only *why* if non-obvious
- Prefer `async/await` over `.then()` chains

### IPC Rules (CRITICAL)

- All IPC channels MUST be defined in `main/ipc/types.ts` in the `IPC` const first
- Channel naming: `domain:action` — e.g. `agent:list`, `task:run`, `settings:get`
- Main Process NEVER accesses renderer state directly
- Renderer NEVER calls Node.js APIs directly — always via `window.ipc`
- Preload exposes ONLY what is needed — no wildcard exposure
- Push channels (main → renderer) return a cleanup function from preload

```ts
// main/ipc/types.ts — add channel to IPC const first
export const IPC = {
  MY_ACTION: 'my:action',
  // ...
} as const

// main/ipc/index.ts — guard all webContents.send with sendToRenderer
function sendToRenderer(win: BrowserWindow, channel: string, payload: unknown) {
  if (!win.isDestroyed()) win.webContents.send(channel, payload)
}

// renderer/lib/ipc.ts — augment Window type, use window.ipc
export const ipc = typeof window !== 'undefined' ? window.ipc : null
```

### PixiJS Rules (CRITICAL)

- ALWAYS set `TextureSource.defaultOptions.scaleMode = 'nearest'` after `app.init()`
- Load sprites via `Assets.load('path/to/agent.json')` — NOT raw PNG
- Use `AnimatedSprite` from `sheet.animations['key']` — NOT manual frame calc
- NEVER use `requestAnimationFrame` directly — use `app.ticker`
- Destroy sprites when removing from scene: `sprite.destroy()`
- Agent sprites render at `scale.set(3)` — 16×16 native → 48×48 display
- Scene is 960×576 (20 cols × 12 rows × 16px × 3x scale)
- Placeholder sprites use PixiJS `Graphics` API — gracefully replaced by real sheets

```ts
// Correct PixiJS v8 init pattern (from OfficeScene.tsx)
import { Application, TextureSource } from 'pixi.js'

const app = new Application()
await app.init({ width: SCENE_W, height: SCENE_H, background: 0x060B16, antialias: false })
TextureSource.defaultOptions.scaleMode = 'nearest'  // ← MUST be set after init
```

### Agent Execution Rules

- `pty` mode: runs via `executor.ts` → `runAgent()` → node-pty shell
- `claude` mode: runs via `claudeExecutor.ts` → `runClaudeAgent()` → Anthropic streaming
- `agent.command` is the shell command (pty) or system prompt (claude)
- Both use `RunCallbacks` from `main/ipc/types.ts` — `onOutput(chunk)` + `onDone(exitCode)`
- `p-queue` (concurrency: 3) wraps pty runs — claude runs are unqueued (AbortController)
- Status must be one of: `'idle' | 'running' | 'success' | 'error'`
- Every agent run is inserted into `task_runs` before execution; updated on done
- Every status change updates the `agents` table and pushes an IPC log entry

### Zustand Rules

- Single store: `agentStore` — agents, logs, terminalOutput, selectedAgentId
- IPC push listeners registered ONCE in `_app.tsx` `useEffect([], [])` — never in pages
- Use `useAgentStore.getState()` (not hook) inside callbacks to avoid stale closures
- Never mutate state directly — use store actions

### Database Rules

- All DB access in `main/db.ts` via the `getDb()` singleton
- Never access SQLite from Renderer — only via IPC
- Schema migrations are inline in `migrate()` — no Prisma, no migration files
- `task_runs` and `logs` are append-only — no deletes (agents cascade)
- Default agents are seeded once on first launch; `upgradeSeededAgents()` patches stale rows

---

## Design System (Summary)

Full spec in `DESIGN.md` and `DESIGN-PIXEL.md` (project root)

### Colors (Dark Theme — primary)

```text
bg-base:       #060B16   (main background)
bg-surface:    #0D1120   (cards, panels)
bg-elevated:   #131929   (selected, hover)
border:        #1E2538

running:  #00E5A0   (neon green)
success:  #4D9FFF   (blue)
error:    #FF4D6D   (red)
idle:     #4A5068   (muted)
brand:    #00B4D8
```

### Fonts

```
Syne 700/800   → headings, agent names
DM Mono 400    → labels (UPPERCASE), timestamps, logs, IDs
DM Sans 400    → body text
```

### Pixel Art

```
Native:  16×16 px
Display: 48×48 px (3x scale) via SCALE = 3 in sceneConfig.ts
scaleMode: nearest (NEVER bilinear)
```

---

## Agent Roles Quick Reference

| Role | AgentRole | Shirt color | Icon |
| --- | --- | --- | --- |
| Backlog (PO) | `backlog` | `#7C3AED` | 📋 |
| Planning (PM) | `planning` | `#0284C7` | 📅 |
| Architect (Tech Lead) | `architect` | `#059669` | 🏗️ |
| Developer | `code` | `#00E5A0` | 💻 |
| QA | `test` | `#D97706` | 🧪 |
| DevOps | `pipeline` | `#DC2626` | ⚙️ |
| Notifier | `alert` | `#6B7280` | 🔔 |

All 7 are seeded automatically on first launch in `claude` mode with system prompts.

---

## Sprite Animation States

| State | Key | animationSpeed | Loop | Trigger |
| --- | --- | --- | --- | --- |
| idle | `{role}_idle` | 0.07 | true | No task |
| walk | `{role}_walk` | 0.13 | true | Moving |
| action | `{role}_action` | 0.10 | true | Running task |
| error | `{role}_error` | 0.20 | false | API error |
| done | `{role}_done` | 0.10 | false | Task complete |

`AgentStatus → SpriteState` mapping: `running→action`, `success→done`, `error→error`, `idle→idle`

Placeholder (no sprite sheet): uses `Graphics` shapes with per-role shirt color.
Upgrade path: drop `{role}-agent.json` + atlas PNG into `assets/sprites/agents/` — `AgentSprite` loads it automatically via `tryLoadSheet()`.

---

## Claude API Config

- Model: `claude-sonnet-4-6` (default) — configurable in Settings page
- Available models: `claude-sonnet-4-6`, `claude-haiku-4-5-20251001`, `claude-opus-4-8`
- Max tokens: 4,096 per agent run
- Streaming: always enabled — text events drive `onOutput` callbacks
- API key stored in electron-store (`settings` store) — never in SQLite or env

---

## Common Tasks

### Add a new agent role

1. Add to `AgentRole` union in `main/ipc/types.ts`
2. Add default agent entry to `DEFAULT_AGENTS` in `main/db.ts`
3. Add to `ROLE_META` and `ROLE_BORDER` in `renderer/lib/agentMeta.ts`
4. Add to `ROLE_COLOR` and `ROLE_HOME` in `renderer/components/pixi/sceneConfig.ts`
5. Add zone highlight + desk label in `OfficeScene.tsx` → `buildFloor()` / `buildDeskLabels()`
6. Add to `PIPELINE_ROLES` in `renderer/components/PipelineView.tsx`
7. (Optional) Drop `{role}-agent.json` + PNG into `assets/sprites/agents/`

### Add a new IPC channel

1. Add name to `IPC` const in `main/ipc/types.ts`
2. Register `ipcMain.handle()` or use `sendToRenderer()` in `main/ipc/index.ts`
3. Expose in `main/preload.ts` via `contextBridge`
4. Add type to `Window.ipc` augment in `renderer/lib/ipc.ts`
5. Call via `ipc?.methodName()` in Renderer

### Add a new page

1. Create `renderer/pages/newpage.tsx` (default export)
2. Link from header nav in existing pages
3. No API routes needed — all data via IPC

---

## What NOT to do

- ❌ Do NOT use `localStorage` or `sessionStorage` — use SQLite via IPC
- ❌ Do NOT call `fs`, `path`, `child_process` from Renderer — Main only
- ❌ Do NOT use Canvas 2D `drawImage` for sprites — use PixiJS `AnimatedSprite`
- ❌ Do NOT use `requestAnimationFrame` directly — use `app.ticker`
- ❌ Do NOT add cloud dependencies (Vercel, Redis, Supabase) — zero infra
- ❌ Do NOT expose full Node.js API in preload — only specific typed methods
- ❌ Do NOT skip `TextureSource.defaultOptions.scaleMode = 'nearest'` — sprites will blur
- ❌ Do NOT call `win.webContents.send()` directly — always use `sendToRenderer()`
- ❌ Do NOT register IPC push listeners in individual pages — only in `_app.tsx`
- ❌ Do NOT add Prisma — DB is better-sqlite3 with raw SQL
- ❌ Do NOT use the `any` type — use `unknown` + narrowing or proper types
- ❌ Do NOT start Phase 2 features before Phase 1 MVP is complete

---

## Useful Commands

```bash
npm run dev      # Start Electron + Next.js (hot reload)
npm run build    # Build for production (nextron build)
npx tsc --noEmit # TypeScript strict check (no typecheck script yet)
```

---

## Key Dependencies (actual installed versions)

```json
{
  "electron": "^31.0.0",
  "nextron": "^9.0.0",
  "next": "^14.2.0",
  "react": "^18.3.0",
  "pixi.js": "^8.19.0",
  "@anthropic-ai/sdk": "^0.105.0",
  "better-sqlite3": "^11.0.0",
  "electron-store": "^8.2.0",
  "p-queue": "^6.6.2",
  "chokidar": "^3.6.0",
  "zustand": "^5.0.14",
  "reactflow": "^11.11.4",
  "node-pty": "^1.1.0",
  "typescript": "^6.0.3",
  "tailwindcss": "^3.4.19"
}
```

---

AgentFlow · CLAUDE.md · Weerapat Srisawat (Ter) · 2026
