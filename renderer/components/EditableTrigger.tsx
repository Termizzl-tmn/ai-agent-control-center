import { useState, useEffect } from 'react'

interface Props {
  icon: string
  value: string
  inputPlaceholder: string
  emptyLabel: string
  activeColor: string
  onSave: (value: string) => Promise<void>
}

export function EditableTrigger({ icon, value, inputPlaceholder, emptyLabel, activeColor, onSave }: Props) {
  const [editing, setEditing] = useState(false)
  const [input, setInput] = useState(value)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { setInput(value) }, [value])

  async function handleSave() {
    try {
      await onSave(input.trim())
      setError(null)
      setEditing(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid value')
    }
  }

  function handleCancel() {
    setInput(value)
    setError(null)
    setEditing(false)
  }

  return (
    <div onClick={(e) => e.stopPropagation()}>
      {editing ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={inputPlaceholder}
            style={{
              flex: 1, minWidth: 0, background: 'var(--bg-sunken)',
              border: '1px solid var(--ds-border)', borderRadius: 'calc(var(--radius) - 2px)',
              padding: '3px 8px', color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)', fontSize: 10,
            }}
          />
          <button onClick={handleSave} style={{
            border: 'none', background: 'transparent', color: 'var(--status-running)', cursor: 'pointer', fontSize: 12,
          }}>✓</button>
          <button onClick={handleCancel} style={{
            border: 'none', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 12,
          }}>✕</button>
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 8px',
            borderRadius: 999, border: `1px solid ${value ? `${activeColor}55` : 'var(--ds-border)'}`,
            background: value ? `${activeColor}14` : 'transparent',
            color: value ? activeColor : 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', fontSize: 9, cursor: 'pointer', maxWidth: '100%',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}
        >
          {icon} {value || emptyLabel}
        </button>
      )}
      {error && (
        <p style={{ margin: '2px 0 0', fontFamily: 'var(--font-mono)', fontSize: 9, color: 'var(--status-error)' }}>
          {error}
        </p>
      )}
    </div>
  )
}
