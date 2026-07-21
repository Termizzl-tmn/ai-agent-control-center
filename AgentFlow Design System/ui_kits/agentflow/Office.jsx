// AgentFlow — Pixel Office screen. Live animated office + agent roster.
const DSo = window.AgentFlowDesignSystem_98d862;

const ROLE_GLYPH = { po: '📋', pm: '📅', techlead: '🏗️', dev: '💻', qa: '🧪', devops: '⚙️', notifier: '🔔' };

function Office({ onOpenAgent }) {
  const agents = window.OFFICE_AGENTS;
  const [sel, setSel] = React.useState(null);
  const selected = sel && agents.find(a => a.id === sel.id);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16, padding: 20, height: '100%', boxSizing: 'border-box', minHeight: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, minHeight: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexShrink: 0 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 24, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>The Office</div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.12em', marginTop: 3 }}>7 agents · live scene</div>
          </div>
          <DSo.StatusBadge status="running" label="2 Running" />
        </div>
        <div style={{ flex: 1, minHeight: 0 }}>
          <DSo.PixelOffice agents={agents} height="100%" selectedId={selected && selected.id} onSelectAgent={setSel} style={{ height: '100%' }} />
        </div>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
          ▸ Click a character to inspect. Idle agents wander to the coffee machine. Typing = running · ? bubble = waiting · ! = error.
        </div>
      </div>

      {/* Roster / inspector */}
      <DSo.Panel title={selected ? 'Agent' : 'Roster'} style={{ minHeight: 0 }} bodyStyle={{ overflow: 'auto' }}>
        {!selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {agents.map(a => (
              <button key={a.id} onClick={() => setSel(a)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '8px 10px', textAlign: 'left',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', cursor: 'pointer',
              }}>
                <span style={{ fontSize: 16 }}>{ROLE_GLYPH[a.role]}</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>{a.name}</span>
                  <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>{a.id}</span>
                </span>
                <DSo.StatusBadge status={a.status} size="sm" label="" />
              </button>
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <button onClick={() => setSel(null)} style={{ alignSelf: 'flex-start', background: 'none', border: 'none', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.1em', cursor: 'pointer', padding: 0 }}>‹ All agents</button>
            <div style={{ fontSize: 30 }}>{ROLE_GLYPH[selected.role]}</div>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.12em' }}>{selected.id}</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--text-primary)', marginTop: 2 }}>{selected.name}</div>
            </div>
            <DSo.StatusBadge status={selected.status} />
            <div style={{ height: 1, background: 'var(--border)' }} />
            <DSo.Button variant="brand" onClick={() => onOpenAgent && onOpenAgent(selected)}>Open Detail</DSo.Button>
          </div>
        )}
      </DSo.Panel>
    </div>
  );
}

Object.assign(window, { Office });
