import React from 'react';

/**
 * AgentFlow Tabs — underline tab strip (cyan/role active border) for views,
 * and filter chips. `variant="filter"` renders compact bracketed filter pills.
 */
export function Tabs({ tabs = [], value, onChange, variant = 'underline', accent = 'var(--status-running)', style }) {
  const norm = tabs.map((t) => (typeof t === 'string' ? { id: t, label: t } : t));

  if (variant === 'filter') {
    return (
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', ...style }}>
        {norm.map((t) => {
          const active = t.id === value;
          return (
            <button key={t.id} onClick={() => onChange && onChange(t.id)} style={{
              padding: '4px 10px',
              background: active ? 'var(--bg-elevated)' : 'transparent',
              border: `1px solid ${active ? accent : 'var(--border)'}`,
              borderRadius: 'var(--radius-xs)',
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)',
              color: active ? accent : 'var(--text-muted)',
              cursor: 'pointer', transition: 'all 120ms ease',
            }}>{`[ ${t.label} ]`}</button>
          );
        })}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', gap: 2, borderBottom: '1px solid var(--border)', ...style }}>
      {norm.map((t) => {
        const active = t.id === value;
        return (
          <button key={t.id} onClick={() => onChange && onChange(t.id)} style={{
            position: 'relative',
            padding: '9px 14px',
            background: 'transparent', border: 'none',
            borderBottom: `2px solid ${active ? accent : 'transparent'}`,
            marginBottom: -1,
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)',
            color: active ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer', transition: 'color 120ms ease, border-color 120ms ease',
          }}>{t.label}</button>
        );
      })}
    </div>
  );
}
