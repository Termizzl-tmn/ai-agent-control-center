# AgentFlow — Progress

> Weerapat Srisawat (Ter) · Electron + Nextron + Next.js 14 + PixiJS v8 + Claude API

---

## Phase 1 — Core MVP

Status: COMPLETE · Completed 2026-07-10

### Infrastructure

- [x] SQLite singleton (`main/db.ts`) — migrations, 7 default agents seeded on first launch
- [x] `pty` mode executor (`main/executor.ts`) — node-pty shell, p-queue concurrency 3, kill support
- [x] `claude` mode executor (`main/claudeExecutor.ts`) — Anthropic SDK streaming, AbortController per agent
- [x] IPC handler registry (`main/ipc/index.ts`) — all channels wired, routes by `agent.mode`, `sendToRenderer` guard
- [x] IPC types (`main/ipc/types.ts`) — `Agent`, `TaskRun`, `LogEntry`, `IPC` const, `RunCallbacks`
- [x] Preload bridge (`main/preload.ts`) — contextBridge with typed methods only
- [x] Filesystem watcher (`main/watcher.ts`) — chokidar FSWatcher per directory

### Renderer

- [x] Global IPC push listeners (`pages/_app.tsx`) — TASK_OUTPUT / TASK_DONE / LOG_ENTRY registered once
- [x] Zustand store (`store/agentStore.ts`) — agents, logs, terminalOutput, selectedAgentId + actions
- [x] Dashboard (`pages/index.tsx`) — AgentCard grid, Office / Logs / Terminal tabs
- [x] Pipeline page (`pages/pipeline.tsx`) — async data init, DS fonts in header
- [x] Settings page (`pages/settings.tsx`) — API key + model selector, saved to electron-store
- [x] PipelineView (`components/PipelineView.tsx`) — ReactFlow wired to live Zustand data, DS fonts, click-to-select, colored animated edges
- [x] PixelOffice canvas (`components/pixi/OfficeScene.tsx`) — Canvas 2D office floor, 7 agents, walk cycles, status glow rings

### Design System

- [x] CSS tokens — dark palette, spacing, radius, border
- [x] Fonts — Syne (headings), DM Mono (labels/code), DM Sans (body)
- [x] Agent role colors + borders applied throughout (AgentCard, PipelineView, OfficeScene)

### End-to-End Flows Verified

- Launch → 7 agents seeded and visible in Dashboard + Office canvas
- Run agent → streams output (pty shell or Claude API) to terminal panel in real time
- Agent status propagates live → AgentCard badge, OfficeScene glow, PipelineView edge color
- Kill → aborts cleanly (exit 130 for Claude, SIGKILL for pty)
- Pipeline view → animated green edges when a stage is running, click node to select agent
- Settings → API key + model persisted across launches

---

## Phase 2 — Power Features

Status: IN PROGRESS

- [x] Drag-and-drop pipeline builder — save and reuse workflow templates
- [x] Scheduled agents — cron-based triggers via node-cron
- [x] Auto-trigger on file change — filesystem watcher → agent run
- [ ] Slack / LINE alert dispatch via Alert Agent
- [ ] Agent performance metrics — avg run time, token usage, success rate
- [ ] GitHub integration — PR events trigger Code / Test Agent

---

## Phase 3 — TBD

Status: NOT PLANNED

---

Last updated: 2026-07-30 (evening)
