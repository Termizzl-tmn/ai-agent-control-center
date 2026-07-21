import React from 'react';

const LEVEL = {
  info: { color: 'var(--text-secondary)', tag: 'INFO', tagColor: 'var(--text-muted)' },
  warn: { color: 'var(--status-waiting)', tag: 'WARN', tagColor: 'var(--status-waiting)' },
  error: { color: 'var(--status-error)',  tag: 'ERR ', tagColor: 'var(--status-error)' },
  success: { color: 'var(--status-running)', tag: 'OK  ', tagColor: 'var(--status-running)' },
};

/**
 * AgentFlow LogLine — one monospace activity-log row: time │ level │ [agent] message.
 * `current` highlights the row with a neon left border (latest entry).
 */
export function LogLine({ time, level = 'info', agent, message, lineNo, current = false, style }) {
  const l = LEVEL[level] || LEVEL.info;
  return (
    <div style={{
      display: 'flex', alignItems: 'baseline', gap: 10,
      padding: '2px 8px 2px 10px',
      borderLeft: current ? '2px solid var(--status-running)' : '2px solid transparent',
      background: current ? 'rgba(0,229,160,0.06)' : 'transparent',
      fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', lineHeight: 1.7,
      ...style,
    }}>
      {lineNo != null && (
        <span style={{ color: 'var(--text-muted)', opacity: 0.5, minWidth: 28, textAlign: 'right', userSelect: 'none' }}>
          {String(lineNo).padStart(3, '0')}
        </span>
      )}
      <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>{time}</span>
      <span style={{ color: 'var(--text-muted)' }}>│</span>
      <span style={{ color: l.tagColor, flexShrink: 0, whiteSpace: 'pre' }}>{l.tag}</span>
      <span style={{ color: 'var(--text-muted)' }}>│</span>
      {agent && <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>[{agent}]</span>}
      <span style={{ color: l.color, wordBreak: 'break-word' }}>{message}</span>
    </div>
  );
}
