One-line: Sunken-well text input with an uppercase mono label and cyan focus glow — the standard field for settings, API keys, and numeric config.

```jsx
<Input label="Anthropic API Key" type="password" value={key} onChange={e=>setKey(e.target.value)}
  placeholder="sk-ant-..." addon={<Button size="md">Test</Button>}
  hint="Stored locally. Never sent anywhere except Anthropic." />
```

Set `mono={false}` for prose fields. Pass `addon` for an inline action (Show/Test). `hint` renders muted body text below.
