One-line: Config slider with a neon-filled track, glowing thumb and live mono readout — for max-tokens, temperature, timeouts.

```jsx
<Slider label="Max Tokens per Agent Run" value={tokens} min={1024} max={16384} step={512}
  onChange={e=>setTokens(+e.target.value)} format={v=>`${v.toLocaleString()} tokens`} />
<Slider label="Temperature" value={temp} min={0} max={1} step={0.1}
  onChange={e=>setTemp(+e.target.value)} accent="var(--status-running)" />
```

`format` controls the readout; `accent` recolors the fill + thumb.
