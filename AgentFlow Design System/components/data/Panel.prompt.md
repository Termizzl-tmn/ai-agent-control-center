One-line: The structural surface block — titled panel with optional scanlines and an accent top-border. Wrap logs, grids, stats, anything.

```jsx
<Panel title="Activity Log" meta="142 entries" scanlines>
  …log lines…
</Panel>
<Panel title="Test Agent" accent="var(--role-qa)" padding={20}>…</Panel>
```

`title`/`meta` render the header bar; omit both for a bare card. `accent` adds a 2px colored top border (use a role color for featured cards).
