import { useAgentStore } from '../store/agentStore'
import { ROLE_META } from '../lib/agentMeta'
import type { Agent, AgentMetrics } from '../../main/ipc/types'

const COLUMNS = '1.6fr 0.7fr 0.9fr 0.9fr 1fr 1fr 0.9fr'

const EMPTY_METRICS: Omit<AgentMetrics, 'agentId'> = {
  totalRuns: 0, successRuns: 0, finishedRuns: 0, avgRunTimeMs: null,
  totalInputTokens: 0, totalOutputTokens: 0, lastRunAt: null,
}

function formatDuration(ms: number | null): string {
  if (ms == null) return '—'
  if (ms < 1000) return `${Math.round(ms)}ms`
  const totalSec = ms / 1000
  if (totalSec < 60) return `${totalSec.toFixed(1)}s`
  const min = Math.floor(totalSec / 60)
  const sec = Math.round(totalSec % 60)
  return `${min}m ${sec}s`
}

function formatRelative(ts: number | null): string {
  if (ts == null) return 'Never'
  const min = Math.floor((Date.now() - ts) / 60000)
  if (min < 1) return 'Just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  return `${Math.floor(hr / 24)}d ago`
}

function successColor(pct: number | null): string {
  if (pct == null) return 'var(--text-muted)'
  if (pct >= 80) return 'var(--status-running)'
  if (pct >= 50) return 'var(--status-waiting)'
  return 'var(--status-error)'
}

function HeaderRow() {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: COLUMNS, gap: 8, padding: '8px 16px',
      borderBottom: '1px solid var(--ds-border)', fontFamily: 'var(--font-mono)',
      fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)',
    }}>
      <span>Agent</span>
      <span>Runs</span>
      <span>Success</span>
      <span>Avg Time</span>
      <span>Input Tok</span>
      <span>Output Tok</span>
      <span>Last Run</span>
    </div>
  )
}

interface RowProps {
  agent: Agent
  metrics: AgentMetrics
}

function MetricsRow({ agent, metrics }: RowProps) {
  const meta = ROLE_META[agent.role]
  const successPct = metrics.finishedRuns > 0
    ? Math.round((metrics.successRuns / metrics.finishedRuns) * 100)
    : null

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: COLUMNS, gap: 8, padding: '8px 16px',
      borderBottom: '1px solid var(--ds-border)', fontFamily: 'var(--font-mono)',
      fontSize: 11, alignItems: 'center',
    }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)', minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
        <span>{meta.icon}</span>{agent.name}
      </span>
      <span style={{ color: 'var(--text-secondary)' }}>{metrics.totalRuns}</span>
      <span style={{ color: successColor(successPct), fontWeight: 500 }}>
        {successPct == null ? '—' : `${successPct}%`}
      </span>
      <span style={{ color: 'var(--text-secondary)' }}>{formatDuration(metrics.avgRunTimeMs)}</span>
      <span style={{ color: 'var(--text-secondary)' }}>{metrics.totalInputTokens.toLocaleString()}</span>
      <span style={{ color: 'var(--text-secondary)' }}>{metrics.totalOutputTokens.toLocaleString()}</span>
      <span style={{ color: 'var(--text-muted)' }}>{formatRelative(metrics.lastRunAt)}</span>
    </div>
  )
}

export function MetricsPanel() {
  const agents = useAgentStore((s) => s.agents)
  const metrics = useAgentStore((s) => s.metrics)

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border shrink-0">
        <h2 style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)',
        }}>
          Performance Metrics
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto af-scanlines">
        <HeaderRow />
        {agents.map((agent) => {
          const found = metrics.find((m) => m.agentId === agent.id)
          const rowMetrics: AgentMetrics = found ?? { agentId: agent.id, ...EMPTY_METRICS }
          return <MetricsRow key={agent.id} agent={agent} metrics={rowMetrics} />
        })}
      </div>
    </div>
  )
}
