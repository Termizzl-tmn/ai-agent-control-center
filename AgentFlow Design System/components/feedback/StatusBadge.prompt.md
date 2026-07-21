One-line: The canonical agent-status pill — colored dot + uppercase mono label, dot pulses when `running`. Use everywhere agent state appears.

```jsx
<StatusBadge status="running" />
<StatusBadge status="waiting" />
<StatusBadge status="done" size="sm" />
<StatusBadge status="error" label="API Error" />
```

Statuses: `running` (neon green, pulsing) · `waiting` (amber) · `idle` (gray) · `done` (blue) · `error` (red). `success` aliases `done`. Sizes `sm | md | lg`.
