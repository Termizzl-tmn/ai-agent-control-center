One-line: The flagship dashboard tile — one agent's id, name, role accent, live status and progress in a single role-tinted card.

```jsx
<AgentCard agentId="AGT-014" name="Code Agent" role="dev" status="running"
  description="Handles code generation and PR summaries"
  progress={72} tasksDone={10} tasksTotal={14} selected onClick={...} />
```

Roles: `po · pm · techlead · dev · qa · devops · notifier` (each sets the left-border color + icon). `selected` lights the role glow. Lay several out in a 2-col grid for the dashboard.
