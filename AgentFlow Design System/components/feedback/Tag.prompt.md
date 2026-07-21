One-line: Square-cornered micro-chip for log levels, bug severities and inline labels — sharper and smaller than StatusBadge.

```jsx
<Tag severity="HIGH" />        {/* red */}
<Tag severity="MED" />         {/* amber */}
<Tag tone="brand">PTY</Tag>
<Tag tone="done">PASS</Tag>
```

Use `severity` for bug lists (HIGH/MED/LOW auto-color); use `tone` + children for everything else.
