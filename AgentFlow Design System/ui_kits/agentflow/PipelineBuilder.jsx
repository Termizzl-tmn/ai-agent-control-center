// AgentFlow — Pipeline Builder screen.
const DSp = window.AgentFlowDesignSystem_98d862;

const PALETTE = [
  { role: 'po', label: 'PO Agent', glyph: '📋' },
  { role: 'pm', label: 'PM Agent', glyph: '📅' },
  { role: 'techlead', label: 'Tech Lead', glyph: '🏗️' },
  { role: 'dev', label: 'Developer', glyph: '💻' },
  { role: 'qa', label: 'QA Agent', glyph: '🧪' },
  { role: 'devops', label: 'DevOps', glyph: '⚙️' },
  { role: 'notifier', label: 'Notifier', glyph: '🔔' },
];
const ROLEVAR = { po:'--role-po', pm:'--role-pm', techlead:'--role-techlead', dev:'--role-dev', qa:'--role-qa', devops:'--role-devops', notifier:'--role-notifier' };

const NODES = [
  { id: 'po', name: 'PO Agent', role: 'po', status: 'done', x: 40, y: 60, lastRun: '6 min ago' },
  { id: 'dev', name: 'Dev Agent', role: 'dev', status: 'running', x: 290, y: 150, lastRun: null },
  { id: 'qa', name: 'QA Agent', role: 'qa', status: 'waiting', x: 540, y: 80, lastRun: null },
  { id: 'notify', name: 'Notifier', role: 'notifier', status: 'idle', x: 540, y: 250, lastRun: null },
];
const EDGES = [['po','dev'],['dev','qa'],['dev','notify']];

function PaletteCard({ item }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9, padding: '9px 11px',
      background: 'var(--bg-elevated)', border: '1px solid var(--border)',
      borderLeft: `2px solid var(${ROLEVAR[item.role]})`, borderRadius: 'var(--radius-sm)',
      cursor: 'grab', userSelect: 'none',
    }}>
      <span style={{ fontSize: 16 }}>{item.glyph}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{item.label}</span>
      <span style={{ marginLeft: 'auto', color: 'var(--text-muted)', fontSize: 13 }}>⋮⋮</span>
    </div>
  );
}

function Node({ n, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      position: 'absolute', left: n.x, top: n.y, width: 178, cursor: 'pointer',
      background: selected ? 'var(--bg-elevated)' : 'var(--bg-surface)',
      border: `${selected ? 2 : 1}px solid ${selected ? 'var(--status-running)' : 'var(--border-strong)'}`,
      borderTop: `2px solid var(${ROLEVAR[n.role]})`,
      borderRadius: 'var(--radius-md)', padding: 12,
      boxShadow: selected ? 'var(--glow-running)' : 'var(--shadow-card)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 9 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{n.name}</span>
        <DSp.StatusBadge status={n.status} size="sm" label="" />
      </div>
      <DSp.ProgressBar value={n.status==='done'?100:n.status==='running'?64:n.status==='waiting'?30:0} status={n.status==='success'?'done':n.status} />
      <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
        {n.lastRun ? `Last run: ${n.lastRun}` : n.status === 'running' ? 'In progress…' : 'Not yet run'}
      </div>
    </div>
  );
}

function Edges({ sel }) {
  const cx = (n) => n.x + 89, cy = (n) => n.y + 44;
  const byId = Object.fromEntries(NODES.map(n => [n.id, n]));
  return (
    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
      {EDGES.map(([a,b]) => {
        const A = byId[a], B = byId[b];
        const active = A.status === 'done' || A.status === 'running';
        const x1 = A.x + 178, y1 = cy(A), x2 = B.x, y2 = cy(B);
        const mx = (x1 + x2) / 2;
        return (
          <g key={a+b}>
            <path d={`M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`}
              fill="none"
              stroke={active ? 'var(--status-running)' : 'var(--border-strong)'}
              strokeWidth="1.5"
              strokeDasharray={active ? '0' : '5 5'}
              opacity={active ? 0.9 : 0.6} />
            <circle cx={x2} cy={y2} r="3" fill={active ? 'var(--status-running)' : 'var(--text-muted)'} />
          </g>
        );
      })}
    </svg>
  );
}

function PipelineBuilder() {
  const [sel, setSel] = React.useState('dev');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      {/* Toolbar */}
      <div style={{
        height: 52, flexShrink: 0, display: 'flex', alignItems: 'center', gap: 14, padding: '0 16px',
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
      }}>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-muted)' }}>Pipeline:</span>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', borderBottom: '1px dashed var(--border-strong)', paddingBottom: 2 }}>My Dev Pipeline</span>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <DSp.Button variant="primary" icon="▶">Run All</DSp.Button>
          <DSp.Button variant="secondary" icon="⏸">Pause</DSp.Button>
          <DSp.Button variant="ghost">Clear</DSp.Button>
        </div>
      </div>

      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        {/* Palette */}
        <aside style={{ width: 220, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--bg-surface)', padding: 14, overflow: 'auto' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-muted)', marginBottom: 12 }}>Agent Palette</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {PALETTE.map(p => <PaletteCard key={p.role} item={p} />)}
          </div>
        </aside>

        {/* Canvas */}
        <div className="af-grid" style={{ position: 'relative', flex: 1, minWidth: 0, overflow: 'hidden', background: 'var(--bg-base)' }}>
          <div className="af-grid" style={{ position: 'absolute', inset: 0 }}></div>
          <Edges sel={sel} />
          {NODES.map(n => <Node key={n.id} n={n} selected={sel === n.id} onClick={() => setSel(n.id)} />)}
        </div>

        {/* Properties edge */}
        <div style={{ width: 40, flexShrink: 0, borderLeft: '1px solid var(--border)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ writingMode: 'vertical-rl', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.16em', color: 'var(--text-muted)' }}>Properties ›</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { PipelineBuilder });
