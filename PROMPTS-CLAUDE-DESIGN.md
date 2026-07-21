# PROMPTS-CLAUDE-DESIGN.md — AgentFlow UI Mockup
> Claude Design Prompt Guide · AgentFlow · v0.1.0

---

## Claude Design คืออะไร

Claude Design (claude.ai/design) เป็น Anthropic Labs product ที่ให้สร้าง
UI prototypes, wireframes, mockups ผ่าน conversation — powered by Claude Opus 4.7
ผลลัพธ์เป็น interactive HTML ที่คลิกได้ ไม่ใช่ภาพนิ่ง
และ handoff ให้ Claude Code implement ต่อได้ด้วย single instruction

**เหมาะกับ AgentFlow:**
- Mockup Dashboard, Pipeline Builder, Log View, Settings
- ใช้ DESIGN.md เป็น design system reference ได้เลย
- Handoff → Claude Code → Next.js + Tailwind

---

## วิธีเริ่มต้น

1. ไปที่ [claude.ai/design](https://claude.ai/design)
2. เริ่ม project ใหม่
3. วาง **System Context** (section ด้านล่าง) เป็น message แรกก่อนเสมอ
4. จากนั้น prompt แต่ละ screen ได้เลย

---

## System Context (วางเป็น message แรกทุกครั้ง)

```
I'm building AgentFlow — a desktop app (Electron + Next.js) that is an
AI Agent Control Center for software development teams.

Design System:
- Theme: Dark only
- Background base: #060B16
- Surface: #0D1120
- Elevated/selected: #131929
- Border/divider: #1E2538
- Text primary: #E2E8F8
- Text muted: #4A5068
- Accent running: #00E5A0 (neon green)
- Accent waiting: #F5C542 (amber)
- Accent done: #4D9FFF (blue)
- Accent error: #FF4D6D (red)
- Brand: #00B4D8

Typography:
- Headings: Syne 700/800
- Labels/timestamps: DM Mono 400/500 (UPPERCASE, letter-spacing)
- Body: DM Sans 400/500

Style: "Retro Terminal meets Pixel Office" — information-dense,
pixel-art aesthetic borders, monospace labels, neon status indicators.
No rounded corners on status elements. Developer tool feel.

Agent roles: PO, PM, Tech Lead, Developer, QA, DevOps, Notifier
Agent statuses: RUNNING (green), WAITING (amber), IDLE (gray),
DONE (blue), ERROR (red)
```

---

## Screen 1 — Main Dashboard

```
Design the main dashboard screen for AgentFlow.

Layout (top to bottom):
1. Header (48px): Logo "AgentFlow" left, "● SYSTEM ONLINE" badge
   in #00E5A0 right, settings icon
2. Stats row (80px): 4 cards — "Active Agents: 2 of 7",
   "Completed: 1", "Tasks Done: 16/32", "Status: ON TRACK"
3. Pipeline Overview panel (180px): horizontal flow
   [Data Fetcher] →→ [Analyzer] →→ [Report Writer] →→ [Notifier]
   each node has status badge, connected by arrows
4. Agent Cards grid 2×2 (each card shows):
   - agent ID in DM Mono muted top-left
   - agent name in Syne bold
   - role description small muted
   - colored status badge top-right with pulsing dot if RUNNING
   - progress bar 4px height
   - "10/14 tasks" and "72%" in DM Mono
5. Activity Log (200px): monospace log lines
   "09:41:02 │ info    │ Fetching records from API..."
   "09:41:05 │ warn    │ Rate limit warning: 80%..."
   timestamp muted, severity colored

Apply the design system from context.
Make it feel like a real developer monitoring tool.
```

**Refinement prompts:**
```
Make the agent cards more compact, reduce internal padding
```
```
The status badges need to be more prominent — pill shape, colored bg
```
```
Add a subtle scanline texture to the background panels
```
```
The progress bars should glow slightly matching their status color
```

---

## Screen 2 — Pipeline Builder

```
Design the Pipeline Builder screen for AgentFlow.

Layout:
- Left sidebar (220px): "Agent Palette" — draggable cards
  for each agent role (PO, PM, Tech Lead, Developer, QA,
  DevOps, Notifier), each with small colored dot + name
- Main canvas (dark, #060B16): drag-and-drop node editor
  Current pipeline: [PO Agent: IDLE] ──→ [Dev Agent: ● RUNNING]
  ──→ [QA Agent: WAITING] ──→ [Notifier: IDLE]
  Nodes are cards with agent name + status badge + mini progress bar
  Selected node (Dev Agent) has neon green border glow
  Arrows between nodes: dashed when waiting, solid when active
- Top toolbar: "Pipeline: My Dev Pipeline" editable name,
  "▶ Run All" button in #00E5A0, "⏸ Pause" button, "Clear" button
- Right panel (collapsed, 40px): "Properties ›" hint visible on edge

Canvas feel: dark grid dots in background, nodes float above
```

**Refinement prompts:**
```
The canvas needs to feel more like an infinite workspace — darker, more depth
```
```
Make the node connections feel more dynamic — animated arrow suggestion
```
```
Add a "Last run: 2 min ago" timestamp below each completed node
```

---

## Screen 3 — Agent Detail View

```
Design an Agent Detail screen for AgentFlow — showing Code Agent.

Layout:
- Top header section:
  Large "Code Agent" title in Syne 800
  Role: "Handles code generation and PR summaries" muted
  Status badge "● RUNNING" in green, large progress bar 65%
  3 action buttons: [⏸ Pause] [↺ Retry] [⚙ Config]
  Run time: "Runtime: 4m 12s" in DM Mono muted

- Middle section (2 columns):
  Left col — Task List:
    ✓ Analyze codebase structure (muted, done)
    ✓ Generate PR summary (muted, done)
    → Generate unit tests (green, CURRENT — highlighted)
    ○ Refactor auth module (dim, pending)
    ○ Update API docs (dim, pending)

  Right col — Stats cards:
    "Tokens used: 12,450 / 50,000" with usage bar
    "Avg run time: 3m 24s"
    "Success rate: 94%"
    "Claude calls: 7"

- Bottom — Activity Log (full width, 200px):
  Filter tabs: [ALL] [INFO] [WARN] [ERROR]
  Monospace log entries with line-number-style left gutter
  Latest entry highlighted with left border in #00E5A0
  Auto-scroll indicator at bottom right
```

**Refinement prompts:**
```
Make the task list feel more like a terminal checklist
```
```
The stats cards need more visual weight — darker bg, subtle border
```
```
Add a token usage sparkline chart to the right column
```

---

## Screen 4 — Role View (QA Mode)

```
Design a QA Engineer role view for AgentFlow.

Context: Filtered view showing only QA-relevant data.

Layout:
- Role switcher tabs at top (horizontal):
  [PO] [PM] [Tech Lead] [Developer] [● QA ←selected] [DevOps]
  Selected tab has amber #D97706 bottom border

- QA Metrics row (4 cards):
  "Test Coverage: 84%" in amber
  "Tests Generated: 142"
  "Bugs Found: 7" in red #FF4D6D
  "Flaky Tests: 2" in amber

- Test Agent card (large, featured, 2/3 width):
  Amber #D97706 left border accent
  Currently: "● RUNNING — Generating Playwright tests for auth module"
  Progress 58%, 8/14 tasks done
  Live log preview (last 3 lines)

- Right column (1/3 width): Bug summary — card list
  Each bug: severity badge (HIGH/MED/LOW), 1-line description, "View →"
  [HIGH] Auth token not invalidated on logout
  [MED] Race condition in async queue
  [LOW] Missing error boundary in sidebar

- Bottom: Test Results table
  Columns: Test Name | Status | Duration | Triggered by
  Mix of PASS (green), FAIL (red), PENDING (amber) rows
  Monospace font for test names
```

---

## Screen 5 — Settings

```
Design a Settings screen for AgentFlow desktop app.

Layout: Left nav + right content panel

Left nav sections (highlighted: Claude API):
  ● Claude API
  ○ Agent Defaults
  ○ Notifications
  ○ Appearance
  ○ Danger Zone

Right content — Claude API section:
  "API Key" label (DM Mono uppercase muted)
  Input field: "sk-ant-••••••••••••••••" with 👁 toggle + "Test" button

  "Model" label
  Dropdown: "claude-sonnet-4-6 (recommended)" with chevron

  "Max Tokens per Agent Run" label
  Slider: ──────●──── 4,096 tokens (range 1k-16k)

  "Temperature" label
  Slider: ●──────────  0.2 (range 0-1)

  "Request Timeout" label
  Input: "30" seconds

  Divider

  "Notifications" section:
  Row: [Slack] toggle ON  │ Webhook URL input (visible)
  Row: [LINE]  toggle OFF │ (collapsed)
  Row: [Email] toggle OFF │ (collapsed)

  Divider

  "Appearance" section:
  "Theme" → [Dark ●] [Light ○] toggle
  "Pixel Art Scene" → toggle ON "Show office scene in dashboard"
  "Font Size" → [Small] [Medium ●] [Large]

  Danger Zone (red border):
  [Reset All Agent Data] [Clear Run History]
  Warning text: "These actions cannot be undone"
```

---

## Handoff → Claude Code

เมื่อ mockup พร้อมแล้ว ใช้ prompt นี้ใน Claude Design เพื่อ handoff:

```
Package this design as a handoff bundle for Claude Code.
Target stack: Next.js 15 App Router, TypeScript, Tailwind CSS v4,
shadcn/ui components.
Include: color tokens as CSS variables, component structure,
Tailwind config values for the custom colors, and
implementation notes for the agent status real-time updates
via Electron IPC.
```

---

## Tips การใช้ Claude Design

- **Comment inline** ได้โดยตรงบน element — ไม่ต้องเขียน prompt ยาวๆ
- **Custom sliders** — Claude Design สร้าง adjustment knobs ให้ทดลอง
  ปรับ spacing/color/layout แบบ live ได้
- **Web capture** — จับ screenshot จาก app จริงแล้วให้ Claude Design
  match style ได้
- **Import DESIGN.md** — upload file ตรงๆ เป็น context ได้เลย
- **Share link** — ได้ internal URL สำหรับแชร์ใน org
- **Export** → HTML standalone / PPTX / PDF / Canva

---

## Workflow สรุป

```
1. วาง System Context → Claude Design เข้าใจ design system
        ↓
2. Prompt Screen 1 (Dashboard) → refine จนพอใจ
        ↓
3. Prompt Screen 2–5 ทีละ screen
        ↓
4. Handoff bundle → Claude Code
        ↓
5. Claude Code implement Next.js + Tailwind
        ↓
6. เชื่อม IPC → real-time agent status
```

---

*AgentFlow · Claude Design · Weerapat Srisawat (Ter) · 2026*
