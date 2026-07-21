import React from 'react';
import { StatusBadge } from '../feedback/StatusBadge.jsx';
import { ProgressBar } from '../feedback/ProgressBar.jsx';

const ROLE = {
  po:        { color: 'var(--role-po)',       icon: '📋' },
  pm:        { color: 'var(--role-pm)',       icon: '📅' },
  techlead:  { color: 'var(--role-techlead)', icon: '🏗️' },
  dev:       { color: 'var(--role-dev)',      icon: '💻' },
  qa:        { color: 'var(--role-qa)',       icon: '🧪' },
  devops:    { color: 'var(--role-devops)',   icon: '⚙️' },
  notifier:  { color: 'var(--role-notifier)', icon: '🔔' },
};

const PROGRESS_STATUS = { running: 'running', waiting: 'waiting', done: 'done', success: 'done', error: 'error', idle: 'idle' };

/**
 * AgentFlow AgentCard — the dashboard's primary unit. Role-tinted card with
 * agent id, name, role line, status badge, glowing progress bar and task count.
 * Composes StatusBadge + ProgressBar.
 */
export function AgentCard({
  agentId = 'AGT-000',
  name = 'Agent',
  role = 'dev',
  description,
  status = 'idle',
  progress = 0,
  tasksDone,
  tasksTotal,
  selected = false,
  onClick,
  style,
}) {
  const r = ROLE[role] || ROLE.dev;
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex', flexDirection: 'column', gap: 10,
        padding: 14,
        background: selected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
        border: `1px solid ${selected || hover ? r.color : 'var(--border)'}`,
        borderLeft: `2px solid ${r.color}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: selected ? `0 0 0 1px ${r.color}55, 0 0 14px ${r.color}33` : 'var(--shadow-card)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 140ms ease, box-shadow 140ms ease, background 140ms ease',
        ...style,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ display: 'flex', gap: 10, minWidth: 0 }}>
          <span style={{ fontSize: 22, lineHeight: 1, filter: 'saturate(1.1)' }}>{r.icon}</span>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)',
              textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)',
              color: 'var(--text-muted)', marginBottom: 2,
            }}>{agentId}</div>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--text-md)',
              letterSpacing: 'var(--tracking-tight)', color: 'var(--text-primary)',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{name}</div>
          </div>
        </div>
        <StatusBadge status={status} size="sm" />
      </div>

      {description && (
        <p style={{
          margin: 0, fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)',
          lineHeight: 1.4, color: 'var(--text-secondary)',
        }}>{description}</p>
      )}

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 7 }}>
        <ProgressBar value={progress} status={PROGRESS_STATUS[status] || 'idle'} />
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)',
        }}>
          <span>{tasksTotal != null ? `${tasksDone ?? 0}/${tasksTotal} tasks` : ''}</span>
          <span style={{ color: 'var(--text-secondary)' }}>{progress}%</span>
        </div>
      </div>
    </div>
  );
}
