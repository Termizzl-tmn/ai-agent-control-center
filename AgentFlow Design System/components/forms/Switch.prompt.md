One-line: Controlled toggle that glows neon-green when on — for settings rows like Slack/LINE/Email, pixel scene, theme.

```jsx
<Switch checked={slack} onChange={setSlack} label="Slack notifications" />
<Switch checked={pixel} onChange={setPixel} accent="var(--brand)" />
```

`onChange` receives the next boolean (not the event). Pass `label` for an inline caption, or omit it and put your own label in the row.
