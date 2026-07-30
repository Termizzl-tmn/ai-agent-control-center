import { useState } from 'react'
import { ROLE_META, ROLE_HEX } from '../lib/agentMeta'
import { StatusBadge } from './StatusBadge'
import { EditableTrigger } from './EditableTrigger'
import type { Agent } from '../../main/ipc/types'
import { ipc } from '../lib/ipc'
import { useAgentStore } from '../store/agentStore'

interface Props {
  agent: Agent
  selected: boolean
}

const PROGRESS_VAL: Record<Agent['status'], number> = {
  idle:    0,
  running: 55,
  success: 100,
  error:   0,
}

const PROGRESS_COLOR: Record<Agent['status'], string> = {
  idle:    'var(--status-idle)',
  running: 'var(--status-running)',
  success: 'var(--status-done)',
  error:   'var(--status-error)',
}

export function AgentCard({ agent, selected }: Props) {
  const { selectAgent, updateAgentStatus, updateAgent } = useAgentStore()
  const meta = ROLE_META[agent.role]
  const roleColor = ROLE_HEX[agent.role]
  const [hover, setHover] = useState(false)

  async function saveSchedule(value: string) {
    const updated = await ipc?.updateAgent(agent.id, { cronSchedule: value })
    if (updated) updateAgent(updated)
  }

  async function saveWatchPath(value: string) {
    const updated = await ipc?.updateAgent(agent.id, { watchPath: value })
    if (updated) updateAgent(updated)
  }

  async function handleRun() {
    if (!ipc) return
    const prev = agent.status
    updateAgentStatus(agent.id, 'running')
    try {
      await ipc.runAgent(agent.id)
    } catch {
      updateAgentStatus(agent.id, prev)
    }
  }

  async function handleKill() {
    await ipc?.killAgent(agent.id)
    updateAgentStatus(agent.id, 'idle')
  }

  const isRunning = agent.status === 'running'
  const shortId   = `AGT-${agent.id.slice(0, 6).toUpperCase()}`
  const progress  = PROGRESS_VAL[agent.status]
  const barColor  = PROGRESS_COLOR[agent.status]

  return (
    <div
      onClick={() => selectAgent(agent.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 14,
        background: selected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        borderTop: `1px solid ${selected || hover ? roleColor : 'var(--ds-border)'}`,
        borderRight: `1px solid ${selected || hover ? roleColor : 'var(--ds-border)'}`,
        borderBottom: `1px solid ${selected || hover ? roleColor : 'var(--ds-border)'}`,
        borderLeft: `2px solid ${roleColor}`,
        borderRadius: 'var(--radius)',
        boxShadow: selected
          ? `0 0 0 1px ${roleColor}55, 0 0 14px ${roleColor}33`
          : '0 1px 0 rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.35)',
        cursor: 'pointer',
        transition: 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10, minWidth: 0 }}>
          <span style={{ fontSize: 22, lineHeight: 1, flexShrink: 0 }}>{meta?.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.12em',
              color: 'var(--text-muted)',
              marginBottom: 2,
            }}>{shortId}</div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 700,
              fontSize: '15px',
              letterSpacing: '-0.02em',
              color: 'var(--text-primary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>{agent.name}</div>
          </div>
        </div>
        <StatusBadge status={agent.status} size="sm" />
      </div>

      {/* Description */}
      {agent.description && (
        <p style={{
          margin: 0,
          fontFamily: 'var(--font-body)',
          fontSize: '12px',
          lineHeight: 1.4,
          color: 'var(--text-secondary)',
        }}>{agent.description}</p>
      )}

      {/* Triggers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <EditableTrigger
          icon="⏱"
          value={agent.cronSchedule}
          inputPlaceholder="*/30 * * * *"
          emptyLabel="No schedule"
          activeColor="#00E5A0"
          onSave={saveSchedule}
        />
        <EditableTrigger
          icon="👁"
          value={agent.watchPath}
          inputPlaceholder="C:\path\to\watch"
          emptyLabel="No watch folder"
          activeColor="#4D9FFF"
          onSave={saveWatchPath}
        />
      </div>

      {/* Progress bar + button */}
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{
          width: '100%', height: 4,
          background: 'var(--bg-sunken)',
          border: '1px solid var(--ds-border)',
          borderRadius: '999px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: barColor,
            borderRadius: '999px',
            boxShadow: progress > 0 ? `0 0 8px ${barColor}, 0 0 2px ${barColor}` : 'none',
            transition: 'width 400ms cubic-bezier(.4,0,.2,1)',
          }} />
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); isRunning ? handleKill() : handleRun() }}
          disabled={!isRunning && agent.mode === 'pty' && !agent.command}
          style={{
            width: '100%',
            padding: '5px 0',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            fontWeight: 500,
            textTransform: 'uppercase',
            letterSpacing: '0.12em',
            borderRadius: 'calc(var(--radius) - 2px)',
            border: `1px solid ${isRunning ? 'var(--status-error)' : roleColor}55`,
            background: isRunning ? 'rgba(255,77,109,0.12)' : `${roleColor}18`,
            color: isRunning ? 'var(--status-error)' : roleColor,
            cursor: 'pointer',
            transition: 'background 140ms ease',
          }}
        >
          {isRunning ? '■ Stop' : '▶ Run'}
        </button>
      </div>
    </div>
  )
}
