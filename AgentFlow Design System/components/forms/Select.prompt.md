One-line: Native dropdown restyled as a sunken AgentFlow field — for model pickers, theme choices, anything single-select.

```jsx
<Select label="Model" value={model} onChange={e=>setModel(e.target.value)}
  options={[
    { value: 'claude-sonnet-4-6', label: 'claude-sonnet-4-6 (recommended)' },
    { value: 'claude-opus-4-8', label: 'claude-opus-4-8 (powerful)' },
  ]} />
```

`options` accepts plain strings or `{value,label}` objects.
