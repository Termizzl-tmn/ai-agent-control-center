import React from 'react';

const TONES = {
  neutral: { color: 'var(--text-secondary)', border: 'var(--border-strong)', bg: 'var(--bg-elevated)' },
  brand:   { color: 'var(--brand)',          border: 'rgba(0,180,216,0.4)',  bg: 'rgba(0,180,216,0.10)' },
  running: { color: 'var(--status-running)',  border: 'rgba(0,229,160,0.4)',  bg: 'var(--status-running-bg)' },
  waiting: { color: 'var(--status-waiting)',  border: 'rgba(245,197,66,0.4)', bg: 'var(--status-waiting-bg)' },
  done:    { color: 'var(--status-done)',     border: 'rgba(77,159,255,0.4)', bg: 'var(--status-done-bg)' },
  error:   { color: 'var(--status-error)',    border: 'rgba(255,77,109,0.4)', bg: 'var(--status-error-bg)' },
};

const SEVERITY = { HIGH: 'error', MED: 'waiting', LOW: 'done' };

/**
 * AgentFlow Tag — small square-cornered chip. Severity helper maps
 * HIGH/MED/LOW to error/waiting/done tones.
 */
export function Tag({ children, tone = 'neutral', severity, style }) {
  const t = TONES[severity ? SEVERITY[severity] : tone] || TONES.neutral;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '2px 7px',
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-xs)',
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 500,
      textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)',
      color: t.color, whiteSpace: 'nowrap', ...style,
    }}>
      {severity || children}
    </span>
  );
}
