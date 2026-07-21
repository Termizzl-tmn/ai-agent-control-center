import React from 'react';

/**
 * AgentFlow Panel — surface container with optional mono title bar, meta slot
 * and CRT scanline texture. The structural building block for every screen.
 */
export function Panel({ title, meta, children, scanlines = false, padding = 16, accent, style, bodyStyle }) {
  return (
    <section style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      borderTop: accent ? `2px solid ${accent}` : '1px solid var(--border)',
      boxShadow: 'var(--shadow-card)',
      overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
      ...style,
    }}>
      {(title || meta) && (
        <header style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)',
            color: 'var(--text-muted)',
          }}>{title}</span>
          {meta && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', color: 'var(--text-muted)',
            }}>{meta}</span>
          )}
        </header>
      )}
      <div
        className={scanlines ? 'af-scanlines' : undefined}
        style={{ position: 'relative', padding, flex: 1, minHeight: 0, ...bodyStyle }}
      >
        {children}
        {scanlines && (
          <span style={{
            content: '""', position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'var(--scanlines)', mixBlendMode: 'overlay',
          }} />
        )}
      </div>
    </section>
  );
}
