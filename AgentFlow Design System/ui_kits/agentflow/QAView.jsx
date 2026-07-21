// AgentFlow — QA Engineer role view.
const DSqa = window.AgentFlowDesignSystem_98d862;

const ROLE_TABS = [
  { id: 'po', label: 'PO' }, { id: 'pm', label: 'PM' }, { id: 'tl', label: 'Tech Lead' },
  { id: 'dev', label: 'Developer' }, { id: 'qa', label: 'QA' }, { id: 'devops', label: 'DevOps' },
];

const BUGS = [
  { sev: 'HIGH', text: 'Auth token not invalidated on logout' },
  { sev: 'MED', text: 'Race condition in async task queue' },
  { sev: 'LOW', text: 'Missing error boundary in sidebar' },
];

const RESULTS = [
  { name: 'auth.login.spec.ts', status: 'done', dur: '1.24s', by: 'Test Agent' },
  { name: 'auth.logout.spec.ts', status: 'error', dur: '0.98s', by: 'Test Agent' },
  { name: 'queue.concurrency.spec.ts', status: 'waiting', dur: '—', by: 'Test Agent' },
  { name: 'sidebar.render.spec.ts', status: 'done', dur: '0.41s', by: 'Dev Agent' },
  { name: 'api.ratelimit.spec.ts', status: 'done', dur: '2.07s', by: 'Test Agent' },
];
const RES_LABEL = { done: 'PASS', error: 'FAIL', waiting: 'PENDING' };

function QAView() {
  const [role, setRole] = React.useState('qa');
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, padding: 20, overflow: 'auto', height: '100%', boxSizing: 'border-box' }}>
      <DSqa.Tabs tabs={ROLE_TABS} value={role} onChange={setRole} accent="var(--role-qa)" style={{ flexShrink: 0 }} />

      {/* Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, flexShrink: 0 }}>
        <DSqa.StatCard label="Test Coverage" value="84%" accent="var(--role-qa)" bar={84} />
        <DSqa.StatCard label="Tests Generated" value="142" />
        <DSqa.StatCard label="Bugs Found" value="7" accent="var(--status-error)" />
        <DSqa.StatCard label="Flaky Tests" value="2" accent="var(--status-waiting)" />
      </div>

      {/* Featured agent + bugs */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
        <DSqa.Panel accent="var(--role-qa)" padding={16} style={{ borderLeft: '2px solid var(--role-qa)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-muted)' }}>AGT-021 · 🧪 QA</div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 22, color: 'var(--text-primary)', marginTop: 3 }}>Test Agent</div>
            </div>
            <DSqa.StatusBadge status="running" />
          </div>
          <div style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-secondary)', margin: '12px 0' }}>
            Generating Playwright tests for the <strong style={{ color: 'var(--text-primary)' }}>auth module</strong> — 8 / 14 tasks done.
          </div>
          <DSqa.ProgressBar value={58} status="waiting" />
          <div style={{ marginTop: 14, background: 'var(--bg-sunken)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '6px 4px' }}>
            <DSqa.LogLine time="09:41:07" level="info" message="Spawned 4 test workers" />
            <DSqa.LogLine time="09:41:10" level="warn" message="authGuard() fixture missing — stubbed" />
            <DSqa.LogLine time="09:41:14" level="info" message="auth.login → PASS (1.24s)" current />
          </div>
        </DSqa.Panel>

        <DSqa.Panel title="Bug Summary" meta="3 open">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {BUGS.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: i < BUGS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <DSqa.Tag severity={b.sev} />
                <span style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-primary)' }}>{b.text}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--role-qa)', cursor: 'pointer', whiteSpace: 'nowrap' }}>View →</span>
              </div>
            ))}
          </div>
        </DSqa.Panel>
      </div>

      {/* Results table */}
      <DSqa.Panel title="Test Results" meta={`${RESULTS.length} tests`} padding={0}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: 12 }}>
          <thead>
            <tr style={{ textAlign: 'left', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.1em' }}>
              {['Test Name', 'Status', 'Duration', 'Triggered by'].map(h => (
                <th key={h} style={{ padding: '9px 16px', fontWeight: 500, fontSize: 10, borderBottom: '1px solid var(--border)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {RESULTS.map((r, i) => (
              <tr key={i} style={{ borderBottom: i < RESULTS.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <td style={{ padding: '9px 16px', color: 'var(--text-primary)' }}>{r.name}</td>
                <td style={{ padding: '9px 16px' }}><DSqa.Tag tone={r.status === 'done' ? 'done' : r.status === 'error' ? 'error' : 'waiting'}>{RES_LABEL[r.status]}</DSqa.Tag></td>
                <td style={{ padding: '9px 16px', color: 'var(--text-secondary)' }}>{r.dur}</td>
                <td style={{ padding: '9px 16px', color: 'var(--text-muted)' }}>{r.by}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </DSqa.Panel>
    </div>
  );
}

Object.assign(window, { QAView });
