# AgentFlow App — UI Kit

High-fidelity, interactive recreation of the **AgentFlow** desktop control center
(Electron + Next.js). Composes the design-system components from
`window.AgentFlowDesignSystem_98d862`.

Open `index.html`. Navigate with the left rail (Dashboard · Pipeline · Agents · QA · Settings).
The active screen persists to `localStorage` (`af_screen`).

## Screens
- **Dashboard.jsx** — stats row, pipeline overview flow, 2×2 agent-card grid, activity log. Click a card → Agent Detail.
- **PipelineBuilder.jsx** — agent palette, dark grid-dot canvas with floating nodes + bezier edges (dashed=waiting, solid=active), toolbar (Run All / Pause / Clear), collapsed properties edge.
- **AgentDetail.jsx** — Code Agent header (big Syne name, status, progress, actions), task checklist, stat cards + token sparkline, filterable activity log.
- **QAView.jsx** — role switcher (amber accent), QA metrics, featured Test Agent card with live log, bug summary list, test-results table.
- **Settings.jsx** — left section nav, Claude API form (key/model/sliders/timeout), notifications toggles, appearance segmented controls, red Danger Zone.
- **Shell.jsx** — shared TopBar, SideNav, Logo + seed data (AGENTS, PIPELINE, LOG).

## Notes
These are cosmetic recreations driven by static seed data — not wired to IPC. The pixel-art
"office scene" (PixiJS) from `DESIGN-PIXEL.md` is represented by role emoji glyphs, not real sprites.
