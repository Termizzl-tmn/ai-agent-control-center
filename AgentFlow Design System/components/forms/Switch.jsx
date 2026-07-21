import React from 'react';

/**
 * AgentFlow Switch — sharp-ish toggle. On = neon green; off = sunken track.
 */
export function Switch({ checked = false, onChange, label, accent = 'var(--status-running)', disabled = false, style }) {
  return (
    <label style={{
      display: 'inline-flex', alignItems: 'center', gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style,
    }}>
      <span
        onClick={() => { if (!disabled && onChange) onChange(!checked); }}
        style={{
          position: 'relative',
          width: 38, height: 20,
          flexShrink: 0,
          background: checked ? accent : 'var(--bg-sunken)',
          border: `1px solid ${checked ? accent : 'var(--border-strong)'}`,
          borderRadius: 'var(--radius-pill)',
          transition: 'background 140ms ease, border-color 140ms ease',
          boxShadow: checked ? `0 0 8px ${accent}66` : 'none',
        }}
      >
        <span style={{
          position: 'absolute',
          top: 2, left: checked ? 19 : 2,
          width: 14, height: 14,
          borderRadius: 'var(--radius-pill)',
          background: checked ? 'var(--text-inverse)' : 'var(--text-secondary)',
          transition: 'left 140ms cubic-bezier(.4,0,.2,1)',
        }} />
      </span>
      {label && (
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)',
        }}>{label}</span>
      )}
    </label>
  );
}
