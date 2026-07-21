import React from 'react';

const TINT = {
  running: 'var(--status-running)',
  waiting: 'var(--status-waiting)',
  done:    'var(--status-done)',
  error:   'var(--status-error)',
  brand:   'var(--brand)',
  idle:    'var(--status-idle)',
};

/**
 * AgentFlow ProgressBar — 4px track that glows in its status color.
 * Pass `value` 0..100. `status` picks the fill+glow color.
 */
export function ProgressBar({ value = 0, status = 'running', height = 4, showLabel = false, style }) {
  const color = TINT[status] || TINT.running;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div style={{ ...style }}>
      <div style={{
        position: 'relative',
        width: '100%', height,
        background: 'var(--bg-sunken)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-pill)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          width: `${v}%`,
          background: color,
          borderRadius: 'var(--radius-pill)',
          boxShadow: `0 0 8px ${color}, 0 0 2px ${color}`,
          transition: 'width 400ms cubic-bezier(.4,0,.2,1)',
        }} />
      </div>
      {showLabel && (
        <div style={{
          marginTop: 5,
          fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)', textAlign: 'right',
        }}>{v}%</div>
      )}
    </div>
  );
}
