import { useState } from 'react'
import { useAgentStore } from '../store/agentStore'
import type { LogEntry } from '../../main/ipc/types'

type LevelFilter = 'all' | LogEntry['level']

const LEVEL_FILTERS: { id: LevelFilter; label: string }[] = [
  { id: 'all',   label: 'All' },
  { id: 'info',  label: 'Info' },
  { id: 'warn',  label: 'Warn' },
  { id: 'error', label: 'Error' },
]

const LEVEL_COLOR: Record<LogEntry['level'], string> = {
  info:  'var(--text-secondary)',
  warn:  'var(--status-waiting)',
  error: 'var(--status-error)',
}

const LEVEL_TAG_COLOR: Record<LogEntry['level'], string> = {
  info:  'var(--text-muted)',
  warn:  'var(--status-waiting)',
  error: 'var(--status-error)',
}

const LEVEL_TAG: Record<LogEntry['level'], string> = {
  info:  'INFO',
  warn:  'WARN',
  error: 'ERR ',
}

function formatTime(ts: number) {
  return new Date(ts).toLocaleTimeString('en-US', {
    hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
  })
}

export function LogPanel() {
  const { logs, agents, selectedAgentId } = useAgentStore()
  const [levelFilter, setLevelFilter] = useState<LevelFilter>('all')

  function agentName(id: string) {
    return agents.find((a) => a.id === id)?.name ?? id.slice(0, 8)
  }

  const byAgent = selectedAgentId
    ? logs.filter((l) => l.agentId === selectedAgentId)
    : logs

  const filtered = levelFilter === 'all'
    ? byAgent
    : byAgent.filter((l) => l.level === levelFilter)

  const lastIdx = filtered.length - 1

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
        <h2 style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)',
        }}>
          Activity Log
          {selectedAgentId && (
            <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>
              · {agentName(selectedAgentId)}
            </span>
          )}
        </h2>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
          {filtered.length} entries
        </span>
      </div>

      {/* Level filter bar */}
      <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border shrink-0">
        {LEVEL_FILTERS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setLevelFilter(id)}
            style={{
              padding: '2px 10px',
              fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              borderRadius: 'calc(var(--radius) - 2px)',
              border: 'none',
              background: levelFilter === id ? 'var(--bg-elevated)' : 'transparent',
              color: levelFilter === id ? 'var(--text-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Log rows */}
      <div className="flex-1 overflow-y-auto af-scanlines">
        {filtered.length === 0 && (
          <p className="text-center pt-8" style={{
            fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-muted)',
          }}>
            No log entries yet.
          </p>
        )}
        {filtered.map((entry, i) => {
          const isCurrent = i === lastIdx
          return (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                gap: 8,
                padding: '2px 12px 2px 10px',
                borderLeft: isCurrent
                  ? '2px solid var(--status-running)'
                  : '2px solid transparent',
                background: isCurrent ? 'rgba(0,229,160,0.05)' : 'transparent',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                lineHeight: 1.7,
              }}
            >
              <span style={{
                color: 'var(--text-muted)', flexShrink: 0,
                minWidth: 28, textAlign: 'right', userSelect: 'none', opacity: 0.5,
              }}>
                {String(i + 1).padStart(3, '0')}
              </span>
              <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                {formatTime(entry.timestamp)}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>│</span>
              <span style={{ color: LEVEL_TAG_COLOR[entry.level], flexShrink: 0, whiteSpace: 'pre' }}>
                {LEVEL_TAG[entry.level]}
              </span>
              <span style={{ color: 'var(--text-muted)' }}>│</span>
              {!selectedAgentId && (
                <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>
                  [{agentName(entry.agentId)}]
                </span>
              )}
              <span style={{ color: LEVEL_COLOR[entry.level], wordBreak: 'break-word' }}>
                {entry.message}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
