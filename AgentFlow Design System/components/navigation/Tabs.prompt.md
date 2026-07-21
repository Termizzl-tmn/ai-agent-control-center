One-line: View switcher (underline) or log-filter chips (bracketed) — the navigation primitive for tab bars and `[ALL] [INFO] [WARN]` filters.

```jsx
<Tabs tabs={['Office','Activity Log','Terminal']} value={tab} onChange={setTab} />
<Tabs variant="filter" tabs={['ALL','INFO','WARN','ERROR']} value={f} onChange={setF}
  accent="var(--role-qa)" />
```

`variant="underline"` for primary view tabs; `variant="filter"` for compact `[ … ]` chips. `accent` recolors the active state (use a role color in role views).
