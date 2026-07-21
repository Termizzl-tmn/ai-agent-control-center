# AgentFlow Design System

> Reference file for Claude Design imports and handoff to Claude Code.
> Last updated: 2026-06-19

---

## Color Tokens (Dark Theme)

```css
--background:   224 71% 4%    /* #050a14  page bg */
--card:         224 71% 7%    /* #0a1220  card surface */
--border:       216 34% 17%   /* #1e2d45  dividers */
--foreground:   213 31% 91%   /* #dde6f5  primary text */
--muted-fg:     215 16% 57%   /* #7a8fa8  secondary text */
--primary:      210 40% 98%   /* #f7fafd  white-ish */
--destructive:  0   63% 31%   /* #7f1a1a  error red */
```

### Agent Role Accent Colors
| Role | Border | Glow |
|---|---|---|
| Backlog (PO) | `blue-800` | `blue-600` |
| Planning (PM) | `purple-800` | `purple-600` |
| Architect | `indigo-800` | `indigo-600` |
| Code (Dev) | `green-800` | `green-600` |
| Test (QA) | `yellow-800` | `yellow-600` |
| Pipeline (DevOps) | `orange-800` | `orange-600` |
| Alert | `red-800` | `red-600` |

### Status Colors
| Status | Background | Text |
|---|---|---|
| idle | `slate-700` | `slate-300` |
| running | `blue-900` (pulse) | `blue-300` |
| success | `green-900` | `green-300` |
| error | `red-900` | `red-300` |

---

## Typography

- **Font**: System monospace (Fira Code fallback)
- **Page title**: `text-lg font-bold tracking-tight`
- **Section label**: `text-xs font-semibold uppercase tracking-wider text-muted-fg`
- **Card name**: `text-sm font-semibold`
- **Card body**: `text-xs text-muted-fg leading-relaxed`
- **Log/terminal**: `font-mono text-xs`

---

## Layout — Dashboard (Phase 1)

```
┌─────────────────────────────────────────────────────┐
│  Header: AgentFlow  ·  Control Center        [meta] │  h-12
├───────────────────────┬─────────────────────────────┤
│                       │  [Activity Log] [Terminal]  │
│   Agent Grid          │─────────────────────────────│
│   2 cols × 4 rows     │                             │
│   w-[520px]           │   Right Panel               │
│                       │   flex-1                    │
│                       │                             │
└───────────────────────┴─────────────────────────────┘
```

**Agent Card** (per card):
```
┌──────────────────────────────┐  border-{role}
│  [icon]  Name      [status] │  p-4 rounded-lg
│          role               │
│  description text           │  text-xs muted
│                             │
│  [     Run / Stop      ]    │  full-width button
└──────────────────────────────┘
```

---

## Layout — Pipeline Builder (Phase 2)

```
┌─────────────────────────────────────────────────────┐
│  Header                                    [Save]   │
├──────────────────────────────────────────────────────│
│  [Sidebar: agent list]  │  React Flow Canvas        │
│  w-48                   │  flex-1                   │
│  drag source            │  nodes + edges            │
└─────────────────────────────────────────────────────┘
```

Node styles:
- Agent node: `bg-card border border-{role} rounded-lg p-3 w-48`
- Edge: animated dashed line in role accent color

---

## Layout — Log View (Activity tab)

```
┌─────────────────────────────────────────────────────┐
│  Activity Log  ·  {Agent Name}          {N entries} │
├─────────────────────────────────────────────────────┤
│  HH:MM:SS  [INFO]  [AgentName]  message text        │
│  HH:MM:SS  [WARN]  [AgentName]  message text        │
│  HH:MM:SS  [ERR ]  [AgentName]  message text        │
└─────────────────────────────────────────────────────┘
```

---

## Layout — PixiJS Office Scene (future)

```
┌─────────────────────────────────────────────────────┐
│                                                     │
│   [🏗️ Architect]     [💻 Code]    [🧪 Test]         │
│   desk zone          desk zone    desk zone         │
│                                                     │
│   [📋 Backlog]  [📅 Planning]  [⚙️ Pipeline]        │
│                                                     │
│   [🔔 Alert]  ← front-of-office / reception zone   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

Agents animate between: `idle → walking → working → done → idle`

---

## Component Checklist (for Claude Design mockup)

- [ ] Dashboard page (agent grid + log/terminal tabs)
- [ ] Agent card component (all 7 roles, all 4 statuses)
- [ ] Pipeline builder canvas (Phase 2)
- [ ] Agent configure modal (set command / Claude prompt)
- [ ] Role-based view switcher (PO / Dev / QA presets)
- [ ] PixiJS office scene overlay (Phase 2 / future)
