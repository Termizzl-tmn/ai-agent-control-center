One-line: A single terminal-style activity-log row — `time │ LEVEL │ [agent] message`, severity-colored. Stack many inside a `Panel`.

```jsx
<LogLine time="09:41:02" level="info" agent="Code" message="Fetching records from API…" lineNo={1} />
<LogLine time="09:41:05" level="warn" message="Rate limit warning: 80%" lineNo={2} />
<LogLine time="09:41:09" level="error" message="Connection refused" current lineNo={3} />
```

`level`: `info | warn | error | success`. `current` marks the latest line with a neon left border. Pass `lineNo` for the line-number gutter.
