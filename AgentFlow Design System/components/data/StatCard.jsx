import React from 'react';

/**
 * AgentFlow StatCard — mono label + large value, optional accent + delta/sub.
 * Used in the dashboard stats row and agent-detail metrics.
 */
export function StatCard({ label, value, sub, accent = 'var(--text-primary)', bar, style }) {
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      display: 'flex', flexDirection: 'column', gap: 6,
      ...style,
    }}>
      <span style={{
        fontFamily: 'var(--font-mono)', fontSize: 'var(--text-2xs)', fontWeight: 500,
        textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)',
        color: 'var(--text-muted)',
      }}>{label}</span>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 800,
        fontSize: 'var(--text-2xl)', lineHeight: 1, letterSpacing: 'var(--tracking-tight)',
        color: accent,
      }}>{value}</span>
      {bar !== undefined && (
        <div style={{
          marginTop: 2, height: 3, width: '100%',
          background: 'var(--bg-sunken)', borderRadius: 'var(--radius-pill)', overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', width: `${Math.max(0, Math.min(100, bar))}%`,
            background: accent, boxShadow: `0 0 6px ${accent}`,
            borderRadius: 'var(--radius-pill)',
          }} />
        </div>
      )}
      {sub && (
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)',
        }}>{sub}</span>
      )}
    </div>
  );
}
