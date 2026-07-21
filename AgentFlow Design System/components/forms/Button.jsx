import React from 'react';

/**
 * AgentFlow Button — sharp-cornered developer-tool button.
 * Variants: primary (neon green), brand (cyan), secondary, ghost, danger.
 */
export function Button({
  children,
  variant = 'secondary',
  size = 'md',
  icon,
  disabled = false,
  type = 'button',
  onClick,
  style,
  ...rest
}) {
  const sizes = {
    sm: { padding: '5px 10px', font: 'var(--text-xs)', gap: 6 },
    md: { padding: '8px 14px', font: 'var(--text-sm)', gap: 8 },
    lg: { padding: '11px 18px', font: 'var(--text-md)', gap: 8 },
  };
  const s = sizes[size] || sizes.md;

  const variants = {
    primary: {
      background: 'var(--status-running)',
      color: 'var(--text-inverse)',
      border: '1px solid var(--status-running)',
    },
    brand: {
      background: 'var(--brand)',
      color: 'var(--text-inverse)',
      border: '1px solid var(--brand)',
    },
    secondary: {
      background: 'var(--bg-elevated)',
      color: 'var(--text-primary)',
      border: '1px solid var(--border-strong)',
    },
    ghost: {
      background: 'transparent',
      color: 'var(--text-secondary)',
      border: '1px solid transparent',
    },
    danger: {
      background: 'var(--status-error-bg)',
      color: 'var(--status-error)',
      border: '1px solid rgba(255,77,109,0.4)',
    },
  };
  const v = variants[variant] || variants.secondary;

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: s.gap,
        padding: s.padding,
        fontFamily: 'var(--font-mono)',
        fontSize: s.font,
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        borderRadius: 'var(--radius-sm)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        transition: 'filter 120ms ease, transform 80ms ease',
        whiteSpace: 'nowrap',
        ...v,
        ...style,
      }}
      onMouseEnter={(e) => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.12)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.filter = 'none'; }}
      onMouseDown={(e) => { if (!disabled) e.currentTarget.style.transform = 'translateY(1px)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'none'; }}
      {...rest}
    >
      {icon && <span style={{ display: 'inline-flex', fontSize: '1.1em', lineHeight: 1 }}>{icon}</span>}
      {children}
    </button>
  );
}
