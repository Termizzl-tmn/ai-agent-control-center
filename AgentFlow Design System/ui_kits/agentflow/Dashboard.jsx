// AgentFlow — Main Dashboard screen.
const DSd = window.AgentFlowDesignSystem_98d862;

function PipelineFlow() {
  const roleColor = {
    pm: 'var(--role-pm)', techlead: 'var(--role-techlead)', dev: 'var(--role-dev)', notifier: 'var(--role-notifier)',
  };
  return (
    <div style={{ display: 'flex', alignItems: 'stretch', gap: 0 }}>
      {window.PIPELINE.map((n, i) => (
        <React.Fragment key={n.id}>
          <div style={{
            flex: 1, minWidth: 0,
            background: 'var(--bg-elevated)',
            border: `1px solid ${n.status === 'running' ? 'var(--status-running)' : 'var(--border)'}`,
            borderTop: `2px solid ${roleColor[n.role]}`,
            borderRadius: 'var(--radius-sm)',
            padding: '12px 14px',
            boxShadow: n.status === 'running' ? 'var(--glow-running)' : 'none',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 14,
              color: 'var(--text-primary)', marginBottom: 8, whiteSpace: 'nowrap',
              overflow: 'hidden', textOverflow: 'ellipsis',
            }}>{n.name}</div>
            <DSd.StatusBadge status={n.status} size="sm" />
            {n.lastRun && (
              <div style={{ marginTop: 8, fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--text-muted)' }}>
                Last run: {n.lastRun}
              </div>
            )}
          </div>
          {i < window.PIPELINE.length - 1 && (
            <div style={{
              flexShrink: 0, width: 36, display: 'grid', placeItems: 'center',
              color: n.status === 'done' ? 'var(--status-done)' : 'var(--text-muted)',
              fontSize: 16,
            }}>→</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

function Dashboard({ onOpenAgent }) {
  const DASH = window.AgentFlowDesignSystem_98d862;
  const running = window.AGENTS.filter(a => a.status === 'running').length;
  const done = window.AGENTS.filter(a => a.status === 'done').length;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, overflow: 'auto', height: '100%', boxSizing: 'border-box' }}>
      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, flexShrink: 0 }}>
        <DSd.StatCard label="Active Agents" value={`${running} / 7`} accent="var(--status-running)" />
        <DSd.StatCard label="Completed" value={String(done)} accent="var(--status-done)" />
        <DSd.StatCard label="Tasks Done" value="26 / 39" bar={67} accent="var(--brand)" />
        <DSd.StatCard label="Status" value="On Track" accent="var(--status-running)" />
      </div>

      {/* Live pixel office */}
      <DSd.Panel title="Live Office" meta="Click an agent" style={{ flexShrink: 0 }} padding={0} bodyStyle={{ padding: 0 }}>
        <DASH.PixelOffice agents={window.OFFICE_AGENTS} height={232} onSelectAgent={() => onOpenAgent && onOpenAgent()} style={{ border: 'none', borderRadius: 0 }} />
      </DSd.Panel>

      {/* Pipeline overview */}
      <DSd.Panel title="Pipeline Overview" meta="My Dev Pipeline" style={{ flexShrink: 0 }}>
        <PipelineFlow />
      </DSd.Panel>

      {/* Agents + log */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, minHeight: 0 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start' }}>
          {window.AGENTS.map(a => (
            <DSd.AgentCard key={a.agentId} {...a} selected={a.agentId === 'AGT-014'} onClick={() => onOpenAgent && onOpenAgent(a)} />
          ))}
        </div>
        <DSd.Panel title="Activity Log" meta={`${window.LOG.length} entries`} scanlines padding={0} style={{ minHeight: 0 }}>
          <div style={{ padding: '8px 4px', overflow: 'auto', maxHeight: 320 }}>
            {window.LOG.map((l, i) => (
              <DSd.LogLine key={i} {...l} lineNo={i + 1} current={i === window.LOG.length - 1} />
            ))}
          </div>
        </DSd.Panel>
      </div>
    </div>
  );
}

Object.assign(window, { Dashboard });
