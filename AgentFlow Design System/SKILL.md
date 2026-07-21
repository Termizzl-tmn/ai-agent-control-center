---
name: agentflow-design
description: Use this skill to generate well-branded interfaces and assets for AgentFlow (an AI Agent Control Center desktop app), either for production or throwaway prototypes/mocks/etc. Contains essential design guidelines, colors, type, fonts, and UI components for prototyping — the "Retro Terminal meets Pixel Office" dark aesthetic.
user-invocable: true
---

Read the `readme.md` file within this skill, and explore the other available files (`styles.css`, `tokens/*`, `components/*`, `guidelines/*`).

If creating visual artifacts (slides, mocks, throwaway prototypes, etc), copy assets out and create static HTML files for the user to view — link `styles.css`, load `_ds_bundle.js`, and mount components from `window.AgentFlowDesignSystem_98d862`. If working on production code, copy assets and read the rules here to become an expert in designing with this brand.

If the user invokes this skill without any other guidance, ask them what they want to build or design, ask some questions, and act as an expert designer who outputs HTML artifacts _or_ production code, depending on the need.

Core rules of thumb: dark theme only; color is reserved for status (running/waiting/idle/done/error); Syne for display, DM Mono for UPPERCASE labels/logs, DM Sans for body; tight corners, borders over shadows, neon glow on active elements; CRT scanlines + grid-dot textures; agent roles use emoji glyphs.
