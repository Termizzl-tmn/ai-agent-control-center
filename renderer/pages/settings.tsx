import { useEffect, useState } from 'react'
import { ipc, type AppSettings } from '../lib/ipc'

export default function Settings() {
  const [settings, setSettings] = useState<AppSettings>({ anthropicApiKey: '', model: 'claude-sonnet-4-6' })
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showKey, setShowKey] = useState(false)

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
