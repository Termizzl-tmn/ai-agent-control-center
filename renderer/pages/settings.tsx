import { useEffect, useState } from 'react'
import { ipc, type AppSettings } from '../lib/ipc'

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({
    anthropicApiKey: '', model: 'claude-sonnet-4-6',
    slackWebhookUrl: '', lineChannelAccessToken: '', lineTargetId: '',
    githubToken: '',
  })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showKey, setShowKey] = useState(false)
  const [showLineToken, setShowLineToken] = useState(false)
  const [showGithubToken, setShowGithubToken] = useState(false)
  const [testing, setTesting] = useState<'slack' | 'line' | null>(null)
  const [testResult, setTestResult] = useState<{ ok: boolean; message: string } | null>(null)

  useEffect(() => {
    ipc?.getSettings().then(setSettings)
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setSaveError(null)
    try {
      const updated = await ipc?.setSettings(settings)
      if (updated) setSettings(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  async function handleTest(channel: 'slack' | 'line') {
    setTesting(channel)
    setTestResult(null)
    try {
      await ipc?.setSettings(settings)
      const result = await ipc?.testAlert()
      if (!result) return
      const status = channel === 'slack' ? result.slack : result.line
      const label = channel === 'slack' ? 'Slack' : 'LINE'
      if (status === 'sent') {
        setTestResult({ ok: true, message: `${label} test alert sent.` })
      } else if (status === 'skipped') {
        setTestResult({ ok: false, message: `${label === 'Slack' ? 'Slack webhook URL' : 'LINE token/target'} is empty.` })
      } else {
        setTestResult({ ok: false, message: result.errors.join(' | ') || `${label} test failed.` })
      }
    } finally {
      setTesting(null)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-tight">AgentFlow</span>
          <span className="text-xs text-muted-foreground">Settings</span>
        </div>
        <a href="/" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
          ← Dashboard
        </a>
      </header>

      <div className="flex-1 overflow-y-auto p-8 max-w-2xl mx-auto w-full">
        <h1 className="text-xl font-bold mb-6">Settings</h1>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Claude API */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Claude API
            </h2>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Anthropic API Key
              </label>
              <div className="flex gap-2">
                <input
                  type={showKey ? 'text' : 'password'}
                  value={settings.anthropicApiKey}
                  onChange={e => setSettings(s => ({ ...s, anthropicApiKey: e.target.value }))}
                  placeholder="sk-ant-..."
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#00B4D8]"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(v => !v)}
                  className="px-3 py-2 text-xs text-muted-foreground border border-border rounded hover:border-foreground/30 transition-colors"
                >
                  {showKey ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Stored locally in electron-store. Never sent anywhere except Anthropic.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Model
              </label>
              <select
                value={settings.model}
                onChange={e => setSettings(s => ({ ...s, model: e.target.value }))}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm text-foreground focus:outline-none focus:border-[#00B4D8]"
              >
                <option value="claude-sonnet-4-6">claude-sonnet-4-6 (default)</option>
                <option value="claude-haiku-4-5-20251001">claude-haiku-4-5-20251001 (fast)</option>
                <option value="claude-opus-4-8">claude-opus-4-8 (powerful)</option>
              </select>
            </div>
          </section>

          {/* Alerts — Slack / LINE */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Alerts — Slack / LINE
            </h2>
            <p className="text-xs text-muted-foreground">
              When the Alert Agent finishes a run, its output is dispatched to any channel configured below.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Slack Webhook URL
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.slackWebhookUrl}
                  onChange={e => setSettings(s => ({ ...s, slackWebhookUrl: e.target.value }))}
                  placeholder="https://hooks.slack.com/services/..."
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#00B4D8]"
                />
                <button
                  type="button"
                  onClick={() => handleTest('slack')}
                  disabled={testing === 'slack' || !settings.slackWebhookUrl}
                  className="px-3 py-2 text-xs text-muted-foreground border border-border rounded hover:border-foreground/30 transition-colors disabled:opacity-50"
                >
                  {testing === 'slack' ? 'Sending…' : 'Test'}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Create one via Slack → Apps → Incoming Webhooks.
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                LINE Channel Access Token
              </label>
              <div className="flex gap-2">
                <input
                  type={showLineToken ? 'text' : 'password'}
                  value={settings.lineChannelAccessToken}
                  onChange={e => setSettings(s => ({ ...s, lineChannelAccessToken: e.target.value }))}
                  placeholder="Long-lived channel access token"
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#00B4D8]"
                />
                <button
                  type="button"
                  onClick={() => setShowLineToken(v => !v)}
                  className="px-3 py-2 text-xs text-muted-foreground border border-border rounded hover:border-foreground/30 transition-colors"
                >
                  {showLineToken ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                LINE Target (user or group ID)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={settings.lineTargetId}
                  onChange={e => setSettings(s => ({ ...s, lineTargetId: e.target.value }))}
                  placeholder="U4af4980629..."
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#00B4D8]"
                />
                <button
                  type="button"
                  onClick={() => handleTest('line')}
                  disabled={testing === 'line' || !settings.lineChannelAccessToken || !settings.lineTargetId}
                  className="px-3 py-2 text-xs text-muted-foreground border border-border rounded hover:border-foreground/30 transition-colors disabled:opacity-50"
                >
                  {testing === 'line' ? 'Sending…' : 'Test'}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Requires a LINE Messaging API channel (LINE Developers Console) — LINE Notify is discontinued.
              </p>
            </div>

            {testResult && (
              <p className={`text-xs ${testResult.ok ? 'text-[#00E5A0]' : 'text-[#FF4D6D]'}`}>
                {testResult.message}
              </p>
            )}
          </section>

          {/* GitHub */}
          <section className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              GitHub
            </h2>
            <p className="text-xs text-muted-foreground">
              Set a repo on any agent card ("🔀 owner/repo") to poll it for open PR changes — new
              or updated PRs trigger that agent's run automatically, with the PR title, branch,
              and description passed in as context.
            </p>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Personal Access Token
              </label>
              <div className="flex gap-2">
                <input
                  type={showGithubToken ? 'text' : 'password'}
                  value={settings.githubToken}
                  onChange={e => setSettings(s => ({ ...s, githubToken: e.target.value }))}
                  placeholder="github_pat_..."
                  className="flex-1 bg-background border border-border rounded px-3 py-2 text-sm font-mono text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-[#00B4D8]"
                />
                <button
                  type="button"
                  onClick={() => setShowGithubToken(v => !v)}
                  className="px-3 py-2 text-xs text-muted-foreground border border-border rounded hover:border-foreground/30 transition-colors"
                >
                  {showGithubToken ? 'Hide' : 'Show'}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Fine-grained PAT with read-only "Pull requests" access is enough for public or private repos.
                Leave blank to poll public repos at GitHub's lower unauthenticated rate limit.
              </p>
            </div>
          </section>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium bg-[#00B4D8] text-[#060B16] rounded hover:bg-[#00B4D8]/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Settings'}
            </button>
            {saved && <span className="text-xs text-[#00E5A0]">Saved.</span>}
            {saveError && <span className="text-xs text-[#FF4D6D]">{saveError}</span>}
          </div>
        </form>
      </div>
    </div>
  )
}
