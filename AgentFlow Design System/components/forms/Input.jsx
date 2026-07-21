import React from 'react';

/**
 * AgentFlow Input — sunken well, mono text, cyan focus border.
 * Optional uppercase mono label and a trailing addon (e.g. Show / Test button).
 */
export function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  mono = true,
  addon,
  hint,
  disabled = false,
  style,
  ...rest
}) {
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
      <span style={{ display: 'flex', gap: 8 }}>
        <span style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          background: 'var(--bg-sunken)',
          border: `1px solid ${focused ? 'var(--brand)' : 'var(--border)'}`,
          borderRadius: 'var(--radius-sm)',
          boxShadow: focused ? '0 0 0 1px rgba(0,180,216,0.35)' : 'none',
          transition: 'border-color 120ms ease, box-shadow 120ms ease',
        }}>
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              flex: 1,
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              padding: '9px 12px',
              color: 'var(--text-primary)',
              fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
              fontSize: 'var(--text-sm)',
            }}
            {...rest}
          />
        </span>
        {addon}
      </span>
      {hint && (
        <span style={{
          display: 'block',
          marginTop: 6,
          fontFamily: 'var(--font-body)',
          fontSize: 'var(--text-xs)',
          color: 'var(--text-muted)',
        }}>{hint}</span>
      )}
    </label>
  );
}
