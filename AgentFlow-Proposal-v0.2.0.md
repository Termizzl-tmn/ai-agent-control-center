PROJECT PROPOSAL  ·  V0.2.0 — ELECTRON EDITION

**AgentFlow**

AI Agent Control Center for Software Development Teams

Desktop Application  ·  Electron \+ Next.js \+ Claude API

| Author | Weerapat Srisawat (Ter) | Version | 0.2.0 — Electron Edition |
| :---- | :---- | :---- | :---- |

| Stack | Electron · Next.js · TypeScript · Claude API | Timeline | 3 months (MVP) |
| :---- | :---- | :---- | :---- |

| 📋  What changed in v0.2.0 Stack updated from Web-based (Next.js \+ Vercel) → Desktop App (Electron \+ Next.js). Reason: solo dev tool that requires direct filesystem & terminal access — requirements that browser sandbox cannot satisfy. All agent architecture, role design, and feature scope remain unchanged. |
| :---- |

## **1\. Project Overview**

AgentFlow is a desktop application built with Electron that gives a solo developer full visibility and control over AI agent workflows across the entire software development lifecycle — from product planning through delivery.

Unlike browser-based tools, AgentFlow runs natively on your machine with direct access to the local filesystem, terminal processes, and Claude Code logs. It acts as mission control for all your AI agents without needing a cloud server.

## **2\. Why Electron over Web-based**

| Requirement | Next.js (Web) | Electron (Desktop) |
| :---- | :---- | :---- |
| filesystem access | ❌  Browser sandbox | ✅  Full Node.js fs |
| Run terminal / scripts | ❌  Not possible | ✅  child\_process / node-pty |
| Watch agent log files | ❌  Needs local daemon | ✅  fs.watch natively |
| Offline usage | ❌  Needs server running | ✅  Works offline |
| Solo dev (no infra cost) | ⚠️  Needs Vercel \+ Redis \+ DB | ✅  Zero infra, SQLite local |
| React/Next.js UI | ✅  Native | ✅  Next.js as renderer |
| Distribute to others | ✅  URL share | ⚠️  .dmg/.exe install |

| 💡  Key Insight Electron Main Process \= full Node.js power (fs, terminal, IPC). Next.js Renderer \= the React UI you already know. You get the best of both worlds — native OS access \+ modern frontend DX. |
| :---- |

## **3\. System Architecture**

AgentFlow uses a two-process Electron model:

### **Main Process  (Node.js — full OS access)**

* Spawns and manages agent processes via child\_process / node-pty

* Reads/writes local filesystem (configs, logs, project files)

* Calls Claude API via Anthropic SDK

* Manages SQLite database via Prisma (agent history, workflow configs)

* Sends real-time updates to Renderer via Electron IPC

### **Renderer Process  (Next.js \+ React — UI layer)**

* Dashboard, pipeline builder, log viewer, role-based views

* Listens to IPC events for live agent status updates

* Sends user actions (trigger, pause, retry) back to Main via IPC

* No direct OS access — all system calls go through IPC bridge

### **IPC Bridge  (Electron preload.js)**

* Exposes a safe, typed API surface between Main ↔ Renderer

* Prevents renderer from accessing Node.js APIs directly (security)

* TypeScript interfaces shared between both processes

## **4\. Technology Stack**

### **Desktop Runtime**

| Technology | Version | Role |
| :---- | :---- | :---- |
| Electron | 32.x | Desktop shell — OS access, window management |
| Nextron | 9.x | Electron \+ Next.js boilerplate (scaffold) |
| electron-builder | 25.x | Package & distribute .dmg / .exe |
| node-pty | 1.x | Spawn real terminal sessions inside the app |

### **Frontend (Renderer Process)**

| Technology | Version | Role |
| :---- | :---- | :---- |
| Next.js | 15 (App Router) | React framework for all UI pages |
| TypeScript | 5.x | Type safety across IPC contracts & agent schemas |
| Tailwind CSS | 4.x | Utility-first styling |
| shadcn/ui | latest | Accessible, customizable component library |
| React Flow | 12.x | Drag-and-drop agent pipeline builder |
| Recharts | 2.x | Agent metrics & performance charts |
| Zustand | 5.x | Real-time agent state management |

### **Backend (Main Process)**

| Technology | Version | Role |
| :---- | :---- | :---- |
| Anthropic SDK | 0.27.x | Claude API calls with streaming & tool use |
| Vercel AI SDK | 4.x | Structured outputs, tool use helpers |
| SQLite \+ Prisma | 5.x | Local DB — agent history, workflow configs (zero infra) |
| p-queue | 8.x | In-process agent job queue (no Redis needed) |
| chokidar | 4.x | Watch filesystem for agent log changes |

### **Developer Tooling**

| Technology | Version | Role |
| :---- | :---- | :---- |
| Vitest | 2.x | Unit & integration tests for agent logic |
| Playwright | 1.x | E2E tests for Electron app |
| ESLint \+ Prettier | latest | Code quality & formatting |
| GitHub Actions | — | CI: lint, test, build on push |
| electron-builder | 25.x | Build .dmg (macOS) / .exe (Windows) artifacts |

## **5\. Project Scaffold**

Bootstrap with one command using Nextron:

| npx create-nextron-app agentflow \--example with-tailwindcss cd agentflow && npm install npm run dev    \# opens Electron \+ Next.js hot reload |
| :---- |

Recommended directory structure after scaffold:

| Path | Purpose |
| :---- | :---- |
| main/background.ts | Electron Main Process entry — IPC handlers, agent runner |
| main/agents/ | Agent modules (BacklogAgent, CodeAgent, TestAgent …) |
| main/ipc/ | IPC channel definitions (typed, shared with renderer) |
| main/db/ | Prisma client, SQLite schema, migrations |
| renderer/pages/ | Next.js pages — dashboard, pipeline, logs, settings |
| renderer/components/ | React components — AgentCard, LogPanel, FlowBuilder |
| renderer/store/ | Zustand stores — agentStore, workflowStore |
| shared/types/ | Shared TypeScript types between Main & Renderer |

## **6\. Agent Role Architecture**

| Role | Agent | Responsibilities | Key Tools |
| :---- | :---- | :---- | :---- |
| PO | Backlog Agent | User stories, acceptance criteria, backlog grooming | Claude API, Markdown write |
| PM | Planning Agent | Sprint planning, milestones, dependency detection | fs, calendar, Claude API |
| Tech Lead | Architect Agent | System design review, ADR drafts, tech debt | fs, Claude API |
| Developer | Code Agent | Code generation, PR summaries, refactor | child\_process, git, Claude API |
| QA | Test Agent | Test case gen, Cypress/Playwright scripts, coverage | child\_process, Playwright, Claude API |
| DevOps | Pipeline Agent | CI/CD status, deploy health, log watching | chokidar, child\_process |
| Notifier | Alert Agent | Slack/LINE/email dispatch on configurable triggers | HTTP, Claude API |

## **7\. Key Features by Phase**

### **Phase 1 — MVP  (Month 1–2)**

* Dashboard with live agent status (running, waiting, done, error) via IPC

* Pipeline view — sequential agent flow with dependency arrows (React Flow)

* Activity log per agent with severity filtering

* Manual trigger, pause, and retry from UI

* Claude API integration with streaming output

* Role-based views — PO, Dev, QA presets

* Terminal panel — embedded PTY output for running agents

* Local SQLite persistence — agent history, workflow configs

### **Phase 2 — Enhanced  (Month 3\)**

* Drag-and-drop pipeline builder — save and reuse workflow templates

* Scheduled agents — cron-based triggers via node-cron

* Filesystem watcher — auto-trigger agents when files change

* Slack / LINE alert dispatch via Alert Agent

* Agent performance metrics — avg run time, token usage, success rate

* GitHub integration — PR events trigger Code Agent or Test Agent

### **Phase 3 — Future**

* Export workflow as shareable JSON template

* Multi-project support — switch between codebases

* Claude Code log integration — parse & visualize in-editor agent events

* OpenAI / Gemini as alternative LLM backends

## **8\. Project Timeline**

| Phase | Duration | Deliverables |
| :---- | :---- | :---- |
| Phase 0 — Setup | Week 1 | Nextron scaffold, SQLite \+ Prisma, IPC bridge setup, CI |
| Phase 1 — Core | Week 2–4 | Agent runner (Main), Claude API, IPC → Zustand → UI |
| Phase 1 — Dashboard | Week 5–6 | Agent cards, log panel, role views, terminal PTY panel |
| Phase 2 — Builder | Week 7–9 | React Flow pipeline builder, workflow save/load, scheduling |
| Phase 2 — Integrations | Week 10 | GitHub webhook, Slack/LINE alerts, filesystem watcher |
| Polish & Package | Week 11–12 | Error handling, Vitest/Playwright tests, electron-builder .dmg |

## **9\. Risks & Mitigations**

| Risk | Level | Mitigation |
| :---- | :---- | :---- |
| Electron IPC complexity | Medium | Define typed IPC contracts in shared/types/ from day 1 |
| node-pty native build issues | Medium | Use electron-rebuild, pin versions, test on target OS early |
| Claude API token cost (solo) | Low | Cache results in SQLite, set max\_tokens budget per agent |
| Scope creep | High | Phase 1 feature list is locked — Phase 2 only after MVP ships |
| Electron app size | Low | Use electron-builder compression; \~150MB is acceptable |

## **10\. Success Metrics**

MVP is considered successful when:

* All 7 agent roles are runnable end-to-end from the desktop app

* Agent status updates arrive in UI within 200ms via IPC

* Filesystem and terminal access work reliably on macOS & Windows

* Workflow configs persist correctly in local SQLite across restarts

* App builds to a distributable .dmg / .exe via electron-builder

* At least one full PO → Dev → QA pipeline runs without manual intervention

*This is a living document. Stack decisions are final for MVP scope. Phase 2+ is subject to revision based on Phase 1 learnings.*