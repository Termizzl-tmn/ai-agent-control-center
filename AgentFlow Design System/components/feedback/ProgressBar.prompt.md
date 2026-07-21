One-line: 4px glowing progress track — pair it with agent cards and detail headers; the glow matches the agent's status color.

```jsx
<ProgressBar value={72} status="running" />
<ProgressBar value={65} status="done" height={6} showLabel />
<ProgressBar value={40} status="waiting" />
```

`status` drives the fill + neon glow (`running | waiting | done | error | brand | idle`). Use the token-equivalent of the agent's current status.
