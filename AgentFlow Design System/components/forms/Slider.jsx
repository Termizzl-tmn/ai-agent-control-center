import React from 'react';

/**
 * AgentFlow Slider — range input with neon-filled track and mono value readout.
 */
export function Slider({
  label,
  value = 0,
  min = 0,
  max = 100,
  step = 1,
  onChange,
  format,
  accent = 'var(--brand)',
  disabled = false,
  style,
}) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = format ? format(value) : value;
  return (
    <div style={{ ...style }}>
      {(label || display !== undefined) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
          {label && (
            <span style={{
              fontFamily: 'var(--font-mono)', fontSize: 'var(--text-xs)', fontWeight: 500,
              textTransform: 'uppercase', letterSpacing: 'var(--tracking-label)', color: 'var(--text-muted)',
            }}>{label}</span>
          )}
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--text-primary)',
          }}>{display}</span>
        </div>
      )}
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        onChange={onChange}
        style={{
          width: '100%',
          height: 4,
          appearance: 'none',
          WebkitAppearance: 'none',
          borderRadius: 'var(--radius-pill)',
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          background: `linear-gradient(to right, ${accent} 0%, ${accent} ${pct}%, var(--border) ${pct}%, var(--border) 100%)`,
        }}
        className="af-slider"
      />
      <style>{`
        .af-slider::-webkit-slider-thumb{
          -webkit-appearance:none;appearance:none;width:14px;height:14px;border-radius:var(--radius-pill);
          background:${accent};border:2px solid var(--bg-base);
          box-shadow:0 0 8px ${accent};cursor:pointer;margin-top:0;
        }
        .af-slider::-moz-range-thumb{
          width:14px;height:14px;border-radius:var(--radius-pill);background:${accent};
          border:2px solid var(--bg-base);box-shadow:0 0 8px ${accent};cursor:pointer;
        }
      `}</style>
    </div>
  );
}
