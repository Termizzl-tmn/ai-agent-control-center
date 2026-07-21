# AgentFlow Design System

> "Retro Terminal meets Pixel Office" — the design system for **AgentFlow**, an
> AI Agent Control Center desktop app (Electron + Next.js + PixiJS).
> Author: Weerapat Srisawat (Ter). Built from the AgentFlow codebase + proposal.

---

## What AgentFlow is

AgentFlow is a **desktop app** that gives a solo developer full visibility and
control over AI agent workflows across the software lifecycle — from product
planning through delivery. Seven agent roles (PO, PM, Tech Lead, Developer, QA,
DevOps, Notifier) run as managed processes; their real-time status (running,
waiting, idle, done, error) streams over Electron IPC into the UI — agent cards,
a React-Flow pipeline, activity logs, a terminal panel, and a PixiJS pixel-art
"office scene" where each agent is an animated 16×16 sprite.

The product feel is a **developer monitoring tool**: information-dense,
monospace labels, neon status indicators, sharp corners on status elements, CRT
scanline texture. Dark theme only.

### Sources this system was built from
- **Codebase** (read-only, mounted): `ai-agent-control-center/` — Electron + Next.js renderer
  (`renderer/components/*`, `renderer/pages/*`, `renderer/lib/agentMeta.ts`, `main/ipc/types.ts`).
- `ai-agent-control-center/DESIGN.md` — base color tokens & layout specs.
- `ai-agent-control-center/DESIGN-PIXEL.md` — pixel-art spec, per-role colors, status→sprite mapping.
- `ai-agent-control-center/AgentFlow-Proposal-v0.3.0.md` — product overview, stack, design identity.
- `ai-agent-control-center/PROMPTS-CLAUDE-DESIGN.md` — the canonical **System Context** (colors, fonts, style) and the 5 target screens.

> Note: the as-shipped codebase renders a generic slate dark theme. The **intended**
> identity in the proposal + System Context (neon status accents, Syne/DM Mono/DM Sans,
> #060B16 base) is the canonical system encoded here.

---

## CONTENT FUNDAMENTALS — how AgentFlow writes

- **Voice:** terse, technical, operator-facing. Reads like a status readout, not marketing.
- **Person:** mostly impersonal/imperative — labels and object-noun phrases ("Active Agents",
  "Max Tokens per Agent Run", "Run All", "Clear Run History"). Hints address the user as *you*
  sparingly ("Stored locally. Never sent anywhere except Anthropic.").
- **Casing:** UPPERCASE for mono labels, statuses, log levels, tags (`INFO`, `WARN`, `RUNNING`,
  `HIGH`). Title/sentence case for headings and body. Values stay literal (`claude-sonnet-4-6`,
  `sk-ant-…`, `12,450`).
- **Numbers everywhere, but meaningful:** counts and ratios ("2 of 7", "10/14 tasks", "72%",
  "Runtime: 4m 12s", "Tokens used: 12,450 / 50,000"). Never decorative.
- **Status language:** the five canonical words — Running, Waiting, Idle, Done, Error. Reuse them
  verbatim; don't invent synonyms.
- **Log lines:** `HH:MM:SS │ level │ [Agent] message` — present-progressive, lowercase message
  ("Fetching records from API…", "Rate limit warning: 80%").
- **Emoji:** used **only** as agent-role glyphs (📋 PO, 📅 PM, 🏗️ Tech Lead, 💻 Dev, 🧪 QA,
  ⚙️ DevOps, 🔔 Notifier) — inherited from the codebase `agentMeta.ts`. Never decorative emoji in prose.
- **Vibe:** confident, quiet, machine-adjacent. The interface is a cockpit; copy is the instrumentation.

---

## VISUAL FOUNDATIONS

- **Theme:** dark only. Surface ramp `#060B16` (base) → `#0D1120` (surface) → `#131929` (elevated),
  with `#04060D` sunken wells for inputs/terminals. Dividers `#1E2538`, hover borders `#2A3552`.
- **Color strategy:** neutral dark canvas; **color is reserved for status**. Five status accents
  (running `#00E5A0`, waiting `#F5C542`, idle `#4A5068`, done `#4D9FFF`, error `#FF4D6D`) plus a
  per-role palette and the brand cyan `#00B4D8`. A screen should read mostly monochrome with neon
  punctuation.
- **Type:** Syne (700/800, letter-spacing −0.02em) for display/headings/agent names; DM Mono
  (400/500, UPPERCASE, tracking 0.12em) for labels/timestamps/logs/buttons; DM Sans (400/500,
  line-height 1.5) for body/descriptions. Mono is load-bearing — it's the "terminal" half.
- **Backgrounds & texture:** flat dark fills, **no gradients** as decoration. Two signature
  textures: CRT **scanlines** (`--scanlines`, overlay on panels) and **grid dots**
  (`--grid-dots`, the pipeline/workspace canvas). Pixel-art office scene is rendered separately in PixiJS.
- **Corners:** tight. Radii 0–6px (`--radius-xs` 2 / `sm` 4 / `md` 6). Status elements stay sharp;
  only dots and pill badges are fully round (`--radius-pill`).
- **Borders over shadow:** depth comes from 1px borders, not blur. Elevation shadows are minimal
  (`--shadow-card`). Selected/active/featured elements get a **neon glow** instead — `--glow-*`
  shadows tinted to the status/role color (and used on progress-bar fills and status dots).
- **Cards:** `--bg-surface`, 1px `--border`, `--radius-md`, subtle card shadow. Agent cards add a
  2px role-colored **left border**; featured/selected cards swap the border to the role color and
  add a glow ring. Panels can carry a 2px accent **top** border.
- **Hover:** brightness +12% on buttons; border brightens to the role/accent color on cards. No
  large movement. **Press:** 1px downward nudge (`translateY(1px)`) — pixel "click" feel.
- **Animation:** restrained and functional. The running status dot **pulses** (`af-pulse`, ~1.1s).
  Progress bars ease width (400ms). Pipeline edges animate (dashed→flowing) when a node is running.
  No bounce, no decorative motion. Respect reduced-motion for entrance effects.
- **Transparency/blur:** status tint backgrounds use ~14% alpha of the accent over the dark surface;
  glassmorphism/blur is **not** part of the language.
- **Imagery vibe:** the only imagery is pixel art — 16×16 sprites rendered at 3–4× with
  `image-rendering: pixelated`, cool dark palette matching the UI. No photography. The `PixelOffice`
  component is the canonical realization (canvas, integer-scaled, CRT scanline + vignette overlay).

---

## ICONOGRAPHY

- **No icon font or SVG sprite ships in the codebase.** Agent roles are represented by **emoji**
  glyphs defined in `renderer/lib/agentMeta.ts` (📋 📅 🏗️ 💻 🧪 ⚙️ 🔔) — treat these as the
  canonical role marks and reuse them on cards, pipeline nodes, and the office scene.
- **Unicode glyphs as control icons:** the UI uses simple unicode for actions/affordances —
  `▶` run, `■`/`⏸` stop/pause, `↺` retry, `⚙` config, `▾` select chevron, `│` log separators,
  `→`/`──→` pipeline arrows, `●`/`○` status & radio dots, `✓` done, `›` collapse hints.
  Prefer these over importing an icon library — they match the terminal aesthetic.
- **Pixel art** is the brand's signature visual layer (`DESIGN-PIXEL.md`) and now ships as a real
  component: **`PixelOffice`** renders an animated canvas office where each agent is an original
  pixel character (12×18 art-px, dark-outlined) that sits at a desk, types when running, shows a
  `?` speech bubble when waiting, and walks to the coffee machine when idle — drawn in the AgentFlow
  dark+neon palette. Art is authored as canvas pixel data; **no external sprite binaries**.
  Design reference for the office/character concept: the open-source
  [pixel-agents](https://github.com/pixel-agents-hq/pixel-agents) project (its own character sprites
  are a third-party pack, *JIK-A-4 Metro City*, and are **not** used — AgentFlow's pixel art is original).
- **If a richer icon set is ever needed**, substitute a thin-stroke CDN set (e.g. Lucide) to match
  the monospace, low-weight feel — and flag the substitution. None is bundled by default.

> Substitution flagged: **fonts**. No font binaries exist in the codebase; Syne, DM Mono and DM Sans
> (all open-source) are loaded from Google Fonts in `tokens/fonts.css`. Swap to self-hosted woff2 for offline use.

---

## INDEX — what's in this system

**Foundations**
- `styles.css` — global entry (import this). `@import`s the token files below.
- `tokens/colors.css` — surfaces, text, brand, 5 status accents (+ tint bgs), 7 role colors, aliases.
- `tokens/typography.css` — families, weights, scale, tracking + `.af-*` helper classes.
- `tokens/spacing.css` — spacing, radii, borders, elevation shadows, status glows, scanline/grid textures.
- `tokens/fonts.css` — Google Fonts import (Syne, DM Mono, DM Sans).
- `guidelines/*.html` — foundation specimen cards (Colors, Type, Spacing) shown in the Design System tab.

**Components** (`window.AgentFlowDesignSystem_98d862.<Name>`)
- Forms — `Button`, `Input`, `Select`, `Slider`, `Switch` (`components/forms/`)
- Feedback — `StatusBadge`, `ProgressBar`, `Tag` (`components/feedback/`)
- Data — `Panel`, `StatCard`, `AgentCard`, `LogLine` (`components/data/`)
- Navigation — `Tabs` (underline + filter chips) (`components/navigation/`)
- Scene — `PixelOffice` — animated canvas pixel-art office; agents become characters that sit, type, wait (`?` bubble) and walk (`components/scene/`)

Each component dir has `<Name>.jsx`, `<Name>.d.ts`, `<Name>.prompt.md`, and a `*.card.html` demo.

**UI kit** — `ui_kits/agentflow/`: Dashboard (with live office strip), **Pixel Office**, Pipeline
Builder, Agent Detail, QA Role View, Settings.

**Skill** — `SKILL.md` (Agent Skills compatible).

---

## Usage

```html
<link rel="stylesheet" href="styles.css" />
<script src="_ds_bundle.js"></script>
<script type="text/babel">
  const { AgentCard, StatusBadge, Panel } = window.AgentFlowDesignSystem_98d862;
</script>
```
Reach for tokens directly in CSS: `color: var(--status-running)`, `font-family: var(--font-display)`.
