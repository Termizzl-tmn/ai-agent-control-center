One-line: AgentFlow's sharp-cornered, uppercase-mono button for all actions — use `primary` (neon green) for run/confirm, `brand` (cyan) for save, `danger` for destructive.

```jsx
<Button variant="primary" icon="▶">Run All</Button>
<Button variant="brand">Save Settings</Button>
<Button variant="secondary">Config</Button>
<Button variant="ghost" size="sm">Clear</Button>
<Button variant="danger">Stop</Button>
```

Variants: `primary | brand | secondary | ghost | danger`. Sizes: `sm | md | lg`. Pass `icon` for a leading glyph; `disabled` dims to 40%. Labels render UPPERCASE via DM Mono — write them in normal case.
