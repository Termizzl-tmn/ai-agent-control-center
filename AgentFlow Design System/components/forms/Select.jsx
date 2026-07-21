import React from 'react';

/**
 * AgentFlow Select — native dropdown styled as a sunken field with chevron.
 */
export function Select({ label, value, onChange, options = [], disabled = false, style, ...rest }) {
  const [focused, setFocused] = React.useState(false);
  return (
    <label style={{ display: 'block', ...style }}>
      {label && (
        <span style={{
          display: 'block',
          marginBottom: 6,
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: 'var(--tracking-label)',
          color: 'var(--text-muted)',
        }}>{label}</span>
      )}
      <span style={{ position: 'relative', display: 'block' }}>
        <select
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            appearance: 'none',
            WebkitAppearance: 'none',
            background: 'var(--bg-sunken)',
            border: `1px solid ${focused ? 'var(--brand)' : 'var(--border)'}`,
            boxShadow: focused ? '0 0 0 1px rgba(0,180,216,0.35)' : 'none',
            borderRadius: 'var(--radius-sm)',
            padding: '9px 34px 9px 12px',
            color: 'var(--text-primary)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-sm)',
            outline: 'none',
            cursor: 'pointer',
            transition: 'border-color 120ms ease, box-shadow 120ms ease',
          }}
          {...rest}
        >
          {options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o;
            return <option key={opt.value} value={opt.value}>{opt.label}</option>;
          })}
        </select>
        <span style={{
          position: 'absolute',
          right: 12,
          top: '50%',
          transform: 'translateY(-50%)',
          pointerEvents: 'none',
          color: 'var(--text-muted)',
          fontSize: 11,
        }}>▾</span>
      </span>
    </label>
  );
}
