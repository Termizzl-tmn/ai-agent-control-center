import React from 'react';

const STATUS = {
  running: { color: 'var(--status-running)', bg: 'var(--status-running-bg)', label: 'Running' },
  waiting: { color: 'var(--status-waiting)', bg: 'var(--status-waiting-bg)', label: 'Waiting' },
  idle:    { color: 'var(--status-idle)',    bg: 'var(--status-idle-bg)',    label: 'Idle' },
  done:    { color: 'var(--status-done)',    bg: 'var(--status-done-bg)',    label: 'Done' },
  error:   { color: 'var(--status-error)',   bg: 'var(--status-error-bg)',   label: 'Error' },
  /* aliases matching the codebase AgentStatus enum */
  success: { color: 'var(--status-done)',    bg: 'var(--status-done-bg)',    label: 'Done' },
};

/**
 * AgentFlow StatusBadge — pill with a status dot. Dot pulses when running.
 * Statuses: running | waiting | idle | done | error (success aliases done).
 */
export function StatusBadge({ status = 'idle', size = 'md', label, style }) {
  const s = STATUS[status] || STATUS.idle;
  const text = label || s.label;
  const pulsing = status === 'running';
  const sizes = {
    sm: { pad: '2px 7px', font: 'var(--text-2xs)', dot: 5 },
    md: { pad: '3px 9px', font: 'var(--text-xs)', dot: 6 },
    lg: { pad: '5px 12px', font: 'var(--text-sm)', dot: 8 },
  };
  const z = sizes[size] || sizes.md;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: z.pad,
      background: s.bg,
      border: `1px solid ${s.color}55`,
      borderRadius: 'var(--radius-pill)',
      fontFamily: 'var(--font-mono)', fontSize: z.font, fontWeight: 500,
      textTransform: 'uppercase', letterSpacing: 'var(--tracking-wide)',
      color: s.color, whiteSpace: 'nowrap', ...style,
    }}>
      <span style={{
        width: z.dot, height: z.dot, borderRadius: 'var(--radius-pill)',
        background: s.color,
        boxShadow: `0 0 6px ${s.color}`,
        animation: pulsing ? 'af-pulse 1.1s ease-in-out infinite' : 'none',
      }} />
      {text}
      <style>{`@keyframes af-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.7)}}`}</style>
    </span>
  );
}
