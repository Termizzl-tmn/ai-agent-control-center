import type { AgentStatus } from '../../main/ipc/types'

interface StatusConfig {
  color: string
  bg: string
  label: string
}

const STATUS: Record<string, StatusConfig> = {
  idle:    { color: 'var(--status-idle)',    bg: 'var(--status-idle-bg)',    label: 'Idle' },
  running: { color: 'var(--status-running)', bg: 'var(--status-running-bg)', label: 'Running' },
  success: { color: 'var(--status-done)',    bg: 'var(--status-done-bg)',    label: 'Done' },
  error:   { color: 'var(--status-error)',   bg: 'var(--status-error-bg)',   label: 'Error' },
}

interface Props {
  status: AgentStatus
  size?: 'sm' | 'md'
}

export function StatusBadge({ status, size = 'sm' }: Props) {
  const s = STATUS[status] ?? STATUS.idle
  const dotPx = size === 'sm' ? 5 : 6
  const pad   = size === 'sm' ? '2px 7px' : '3px 9px'
  const fs    = size === 'sm' ? '10px' : '11px'

  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: pad,
      background: s.bg,
      border: `1px solid ${s.color}55`,
      borderRadius: '999px',
      fontFamily: 'var(--font-mono)',
      fontSize: fs,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.06em',
      color: s.color,
      whiteSpace: 'nowrap',
    }}>
      <span style={{
        width: dotPx,
        height: dotPx,
        borderRadius: '999px',
        background: s.color,
        boxShadow: `0 0 6px ${s.color}`,
        flexShrink: 0,
        animation: status === 'running' ? 'af-pulse 1.1s ease-in-out infinite' : 'none',
      }} />
      {s.label}
    </span>
  )
}
