// AgentFlow app — shared chrome (top bar + sidebar) and seed data.
// Composes DS components; exposes everything on window for sibling scripts.

const DS = window.AgentFlowDesignSystem_98d862;

function Logo({ size = 18 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
      <span style={{
        width: 22, height: 22, display: 'grid', placeItems: 'center',
        background: 'var(--brand)', color: 'var(--text-inverse)',
        borderRadius: 4, fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 14,
        boxShadow: 'var(--glow-brand)',
      }}>A</span>
      <span style={{
        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: size,
        letterSpacing: '-0.02em', color: 'var(--text-primary)',
      }}>AgentFlow</span>
    </div>
  );
}

function TopBar({ online = true, right }) {
  return (
    <header style={{
      height: 48, flexShrink: 0,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px',
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border)',
    }}>
      <Logo />
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        {right}
        <DS.StatusBadge status={online ? 'running' : 'idle'} label={online ? 'System Online' : 'Offline'} />
      </div>
    </header>
  );
}

const NAV = [
  { id: 'dashboard', label: 'Dashboard', glyph: '◧' },
  { id: 'office', label: 'Office', glyph: '🏢' },
  { id: 'pipeline', label: 'Pipeline', glyph: '⛓' },
  { id: 'agent', label: 'Agents', glyph: '💻' },
  { id: 'qa', label: 'QA View', glyph: '🧪' },
  { id: 'settings', label: 'Settings', glyph: '⚙' },
];

function SideNav({ active, onNavigate }) {
  return (
    <nav style={{
      width: 64, flexShrink: 0,
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
      padding: '12px 0',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
    }}>
      {NAV.map((n) => {
        const on = active === n.id;
        return (
          <button key={n.id} onClick={() => onNavigate(n.id)} title={n.label} style={{
            width: 44, height: 44, display: 'grid', placeItems: 'center',
            background: on ? 'var(--bg-elevated)' : 'transparent',
            border: `1px solid ${on ? 'var(--brand)' : 'transparent'}`,
            borderRadius: 'var(--radius-sm)',
            color: on ? 'var(--brand)' : 'var(--text-muted)',
            fontSize: 18, cursor: 'pointer',
            boxShadow: on ? '0 0 10px rgba(0,180,216,0.25)' : 'none',
            transition: 'all 120ms ease',
          }}>{n.glyph}</button>
        );
      })}
    </nav>
  );
}

// ---- Seed data ----
const AGENTS = [
  { agentId: 'AGT-001', name: 'Spec Agent', role: 'po', status: 'done', progress: 100, tasksDone: 6, tasksTotal: 6, description: 'Writes specs and acceptance criteria from the backlog.' },
  { agentId: 'AGT-007', name: 'Planner Agent', role: 'pm', status: 'waiting', progress: 40, tasksDone: 2, tasksTotal: 5, description: 'Sequences sprints and assigns work to delivery agents.' },
  { agentId: 'AGT-014', name: 'Code Agent', role: 'dev', status: 'running', progress: 72, tasksDone: 10, tasksTotal: 14, description: 'Handles code generation and PR summaries.' },
  { agentId: 'AGT-021', name: 'Test Agent', role: 'qa', status: 'running', progress: 58, tasksDone: 8, tasksTotal: 14, description: 'Generates Playwright tests and triages bugs.' },
];

const PIPELINE = [
  { id: 'fetch', name: 'Data Fetcher', role: 'pm', status: 'done', lastRun: '4 min ago' },
  { id: 'analyze', name: 'Analyzer', role: 'techlead', status: 'done', lastRun: '2 min ago' },
  { id: 'write', name: 'Report Writer', role: 'dev', status: 'running', lastRun: null },
  { id: 'notify', name: 'Notifier', role: 'notifier', status: 'idle', lastRun: null },
];

const LOG = [
  { time: '09:41:02', level: 'info', agent: 'Code', message: 'Fetching records from API…' },
  { time: '09:41:05', level: 'warn', agent: 'Code', message: 'Rate limit warning: 80% of quota used' },
  { time: '09:41:07', level: 'info', agent: 'Test', message: 'Generating Playwright tests for auth module' },
  { time: '09:41:09', level: 'info', agent: 'Spec', message: 'Acceptance criteria committed (6/6)' },
  { time: '09:41:12', level: 'error', agent: 'Code', message: 'Connection refused: localhost:5432 — retrying (1/3)' },
];

// Full 7-role roster for the pixel office.
const OFFICE_AGENTS = [
  { id: 'AGT-001', name: 'Spec Agent', role: 'po', status: 'done' },
  { id: 'AGT-007', name: 'Planner Agent', role: 'pm', status: 'waiting' },
  { id: 'AGT-009', name: 'Arch Agent', role: 'techlead', status: 'idle' },
  { id: 'AGT-014', name: 'Code Agent', role: 'dev', status: 'running' },
  { id: 'AGT-021', name: 'Test Agent', role: 'qa', status: 'running' },
  { id: 'AGT-028', name: 'Deploy Agent', role: 'devops', status: 'idle' },
  { id: 'AGT-033', name: 'Notifier', role: 'notifier', status: 'done' },
];

Object.assign(window, { Logo, TopBar, SideNav, NAV, AGENTS, PIPELINE, LOG, OFFICE_AGENTS });
