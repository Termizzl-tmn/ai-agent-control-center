// AgentFlow — Settings screen.
const DSs = window.AgentFlowDesignSystem_98d862;

const SECTIONS = [
  { id: 'api', label: 'Claude API' },
  { id: 'defaults', label: 'Agent Defaults' },
  { id: 'notif', label: 'Notifications' },
  { id: 'appearance', label: 'Appearance' },
  { id: 'danger', label: 'Danger Zone' },
];

function Divider() { return <div style={{ height: 1, background: 'var(--border)', margin: '24px 0' }} />; }
function GroupTitle({ children }) {
  return <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 16, color: 'var(--text-primary)', marginBottom: 16 }}>{children}</div>;
}

function SegToggle({ options, value, onChange, accent = 'var(--brand)' }) {
  return (
    <div style={{ display: 'inline-flex', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
      {options.map(o => {
        const on = o === value;
        return (
          <button key={o} onClick={() => onChange(o)} style={{
            padding: '7px 14px', background: on ? 'var(--bg-elevated)' : 'transparent', border: 'none',
            borderRight: '1px solid var(--border)', color: on ? accent : 'var(--text-muted)',
            fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.08em', cursor: 'pointer',
          }}>{o}</button>
        );
      })}
    </div>
  );
}

function Row({ label, children }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '10px 0' }}>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--text-primary)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>{children}</div>
    </div>
  );
}

function Settings() {
  const [section, setSection] = React.useState('api');
  const [show, setShow] = React.useState(false);
  const [model, setModel] = React.useState('claude-sonnet-4-6');
  const [tokens, setTokens] = React.useState(4096);
  const [temp, setTemp] = React.useState(0.2);
  const [timeout, setTimeoutV] = React.useState('30');
  const [slack, setSlack] = React.useState(true);
  const [line, setLine] = React.useState(false);
  const [email, setEmail] = React.useState(false);
  const [theme, setTheme] = React.useState('Dark');
  const [pixel, setPixel] = React.useState(true);
  const [fontSize, setFontSize] = React.useState('Medium');

  return (
    <div style={{ display: 'flex', height: '100%', minHeight: 0 }}>
      {/* Left nav */}
      <aside style={{ width: 200, flexShrink: 0, borderRight: '1px solid var(--border)', background: 'var(--bg-surface)', padding: 14 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, textTransform: 'uppercase', letterSpacing: '.12em', color: 'var(--text-muted)', marginBottom: 14, paddingLeft: 10 }}>Settings</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {SECTIONS.map(s => {
            const on = section === s.id;
            const danger = s.id === 'danger';
            return (
              <button key={s.id} onClick={() => setSection(s.id)} style={{
                display: 'flex', alignItems: 'center', gap: 9, padding: '9px 10px', textAlign: 'left',
                background: on ? 'var(--bg-elevated)' : 'transparent',
                border: 'none', borderLeft: `2px solid ${on ? (danger ? 'var(--status-error)' : 'var(--brand)') : 'transparent'}`,
                borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
                color: on ? (danger ? 'var(--status-error)' : 'var(--text-primary)') : 'var(--text-muted)',
                fontFamily: 'var(--font-body)', fontSize: 13, cursor: 'pointer',
              }}>
                <span style={{ fontSize: 8, color: on ? (danger ? 'var(--status-error)' : 'var(--brand)') : 'var(--text-muted)' }}>{on ? '●' : '○'}</span>
                {s.label}
              </button>
            );
          })}
        </div>
      </aside>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, overflow: 'auto', padding: 28 }}>
        <div style={{ maxWidth: 560 }}>
          <GroupTitle>Claude API</GroupTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <DSs.Input label="API Key" type={show ? 'text' : 'password'} value="sk-ant-api03-x7Kq92mNvR4pLs8w"
              addon={<><DSs.Button size="md" variant="ghost" onClick={() => setShow(s => !s)}>{show ? 'Hide' : 'Show'}</DSs.Button><DSs.Button size="md">Test</DSs.Button></>} />
            <DSs.Select label="Model" value={model} onChange={e => setModel(e.target.value)}
              options={[{ value: 'claude-sonnet-4-6', label: 'claude-sonnet-4-6 (recommended)' }, { value: 'claude-opus-4-8', label: 'claude-opus-4-8 (powerful)' }, { value: 'claude-haiku-4-2', label: 'claude-haiku-4-2 (fast)' }]} />
            <DSs.Slider label="Max Tokens per Agent Run" value={tokens} min={1024} max={16384} step={512} onChange={e => setTokens(+e.target.value)} format={v => `${v.toLocaleString()} tokens`} />
            <DSs.Slider label="Temperature" value={temp} min={0} max={1} step={0.1} onChange={e => setTemp(+e.target.value)} accent="var(--status-running)" />
            <div style={{ maxWidth: 160 }}>
              <DSs.Input label="Request Timeout" value={timeout} onChange={e => setTimeoutV(e.target.value)} addon={<span style={{ alignSelf: 'center', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--text-muted)' }}>sec</span>} />
            </div>
          </div>

          <Divider />
          <GroupTitle>Notifications</GroupTitle>
          <Row label="Slack"><DSs.Switch checked={slack} onChange={setSlack} />{slack && <DSs.Input value="https://hooks.slack.com/services/T0…" mono style={{ width: 240 }} />}</Row>
          <Row label="LINE"><DSs.Switch checked={line} onChange={setLine} /></Row>
          <Row label="Email"><DSs.Switch checked={email} onChange={setEmail} /></Row>

          <Divider />
          <GroupTitle>Appearance</GroupTitle>
          <Row label="Theme"><SegToggle options={['Dark', 'Light']} value={theme} onChange={setTheme} /></Row>
          <Row label="Pixel Art Scene"><span style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'var(--text-muted)' }}>Show office scene in dashboard</span><DSs.Switch checked={pixel} onChange={setPixel} /></Row>
          <Row label="Font Size"><SegToggle options={['Small', 'Medium', 'Large']} value={fontSize} onChange={setFontSize} /></Row>

          <Divider />
          <div style={{ border: '1px solid rgba(255,77,109,0.4)', borderRadius: 'var(--radius-md)', padding: 18, background: 'var(--status-error-bg)' }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--status-error)', marginBottom: 6 }}>Danger Zone</div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'var(--text-secondary)', marginBottom: 14 }}>These actions cannot be undone.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <DSs.Button variant="danger">Reset All Agent Data</DSs.Button>
              <DSs.Button variant="danger">Clear Run History</DSs.Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { Settings });
