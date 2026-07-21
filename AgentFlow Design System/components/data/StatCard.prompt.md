One-line: Dashboard/metric tile — uppercase mono label over a big Syne number, with an optional glowing usage bar. Use in stat rows.

```jsx
<StatCard label="Active Agents" value="2 / 7" accent="var(--status-running)" />
<StatCard label="Test Coverage" value="84%" accent="var(--status-waiting)" bar={84} />
<StatCard label="Tokens used" value="12,450" sub="of 50,000" bar={25} accent="var(--brand)" />
```

`accent` colors the value + bar (use a status token to signal state). Keep `value` short.
