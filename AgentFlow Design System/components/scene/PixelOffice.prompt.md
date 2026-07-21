One-line: AgentFlow's signature **pixel-art office** — agents become characters that sit at desks, type/read by status, show a "?" bubble when waiting, and walk around the room. The "Pixel Office" half of the brand.

```jsx
const [sel, setSel] = React.useState(null);
<PixelOffice
  agents={[
    { id: 'a1', name: 'Spec Agent',  role: 'po',       status: 'done' },
    { id: 'a2', name: 'Planner',     role: 'pm',       status: 'waiting' },
    { id: 'a3', name: 'Arch Agent',  role: 'techlead', status: 'idle' },
    { id: 'a4', name: 'Code Agent',  role: 'dev',      status: 'running' },
    { id: 'a5', name: 'Test Agent',  role: 'qa',       status: 'running' },
    { id: 'a6', name: 'Deploy',      role: 'devops',   status: 'idle' },
    { id: 'a7', name: 'Notifier',    role: 'notifier', status: 'done' },
  ]}
  height={380}
  selectedId={sel?.id}
  onSelectAgent={(a) => setSel(a)}
/>
```

- **Status → behavior:** `running` types (green screen, pulsing dot), `done` reads (blue), `idle` sits (gray, may wander to the coffee machine), `waiting` shows a `?` speech bubble (amber), `error` shows a `!` bubble (red).
- Up to **7 agents**, mapped to desks in order. Drop in fewer for a smaller team.
- Set `onSelectAgent` to make characters clickable (pairs naturally with opening an Agent Detail view); pass `selectedId` to ring the active one.
- `animated={false}` freezes the loop (e.g. for print/PDF). Original canvas pixel art — no external sprite assets.
