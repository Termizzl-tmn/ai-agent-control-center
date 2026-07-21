// AgentFlow — Agent Detail screen (Code Agent).
const DSad = window.AgentFlowDesignSystem_98d862;

const TASKS = [
  { label: 'Analyze codebase structure', state: 'done' },
  { label: 'Generate PR summary', state: 'done' },
  { label: 'Generate unit tests', state: 'current' },
  { label: 'Refactor auth module', state: 'pending' },
  { label: 'Update API docs', state: 'pending' },
];

const DETAIL_LOG = [
  { time: '09:40:31', level: 'info', message: 'Agent boot — model claude-sonnet-4-6' },
  { time: '09:40:48', level: 'info', message: 'Analyzed 142 files, 28k LOC' },
  { time: '09:41:02', level: 'info', message: 'PR summary committed to #482' },
  { time: '09:41:07', level: 'warn', message: 'Test fixture missing for authGuard()' },
  { time: '09:41:12', level: 'info', message: 'Generating unit tests (8/14)…' },
];

function TaskRow({ t }) {
  const map = {
    done: { glyph: '✓', color: 'var(--text-muted)', text: 'var(--text-muted)', deco: 'line-through' },
    current: { glyph: '→', color: 'var(--status-running)', text: 'var(--text-primary)', deco: 'none' },
    pending: { glyph: '○', color: 'var(--text-muted)', text: 'var(--text-muted)', deco: 'none' },
  };
  const m = map[t.state];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 11, padding: '8px 10px',
      background: t.state === 'current' ? 'rgba(0,229,160,0.07)' : 'transparent',
      borderLeft: `2px solid ${t.state === 'current' ? 'var(--status-running)' : 'transparent'}`,
      fontFamily: 'var(--font-mono)', fontSize: 13,
    }}>
      <span style={{ color: m.color, width: 14 }}>{m.glyph}</span>
      <span style={{ color: m.text, textDecoration: m.deco, opacity: t.state === 'pending' ? 0.6 : 1 }}>{t.label}</span>
      {t.state === 'current' && <span style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--status-running)', textTransform: 'uppercase', letterSpacing: '.1em' }}>Current</span>}
    </div>
  );
}

function Sparkline({ data, color = 'var(--brand)' }) {
  const w = 200, h = 40, max = Math.max(...data);
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * w},${h - (d / max) * (h - 4) - 2}`).join(' ');
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block', marginTop: 8 }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" />
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={color} opacity="0.12" />
    </svg>
  );
}

function AgentDetail({ onBack }) {
  const [filter, setFilter] = React.useState('ALL');
  const shown = DETAIL_LOG.filter(l => filter === 'ALL' || l.level === filter.toLowerCase());
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, overflow: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, flexShrink: 0 }}>
        <button onClick={onBack} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', cursor: 'pointer', padding: 0 }}>‹ Back to Dashboard</button>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 20, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.12em', marginBottom: 4 }}>AGT-014 · 💻 Developer</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 44, letterSpacing: '-0.02em', color: 'var(--text-primary)', lineHeight: 1 }}>Code Agent</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--text-secondary)', marginTop: 8 }}>Handles code generation and PR summaries.</div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <DSad.Button variant="secondary" icon="⏸">Pause</DSad.Button>
            <DSad.Button variant="secondary" icon="↺">Retry</DSad.Button>
            <DSad.Button variant="secondary" icon="⚙">Config</DSad.Button>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <DSad.StatusBadge status="running" size="lg" />
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>Runtime: 4m 12s</span>
          <div style={{ flex: 1, maxWidth: 360 }}><DSad.ProgressBar value={65} status="running" height={6} showLabel /></div>
        </div>
      </div>

      {/* Two columns */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
        <DSad.Panel title="Task List" meta="2 / 5 done" padding={6}>
          {TASKS.map((t, i) => <TaskRow key={i} t={t} />)}
        </DSad.Panel>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start' }}>
          <DSad.StatCard label="Tokens used" value="12,450" sub="of 50,000" bar={25} accent="var(--brand)" style={{ gridColumn: '1 / -1' }} />
          <DSad.Panel padding={14} style={{ gridColumn: '1 / -1' }}>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-muted)' }}>Token rate / min</div>
            <Sparkline data={[3, 6, 4, 8, 7, 11, 9, 14, 12, 16]} color="var(--brand)" />
          </DSad.Panel>
          <DSad.StatCard label="Avg run time" value="3m 24s" />
          <DSad.StatCard label="Success rate" value="94%" accent="var(--status-done)" />
        </div>
      </div>

      {/* Log */}
      <DSad.Panel title="Activity Log" meta={<DSad.Tabs variant="filter" tabs={['ALL','INFO','WARN','ERROR']} value={filter} onChange={setFilter} />} scanlines padding={0}>
        <div style={{ padding: '8px 4px' }}>
          {shown.map((l, i) => <DSad.LogLine key={i} {...l} lineNo={i + 1} current={i === shown.length - 1} />)}
          <div style={{ textAlign: 'right', padding: '6px 12px', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--status-running)' }}>▾ auto-scroll</div>
        </div>
      </DSad.Panel>
    </div>
  );
}

Object.assign(window, { AgentDetail });
