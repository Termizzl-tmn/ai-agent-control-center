import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { ipc } from '../lib/ipc'
import { useAgentStore } from '../store/agentStore'
import { AgentCard } from '../components/AgentCard'
import { LogPanel } from '../components/LogPanel'
import { TerminalPanel } from '../components/TerminalPanel'
import type { AgentRole } from '../../main/ipc/types'

// Canvas requires DOM — no SSR
const PixelOffice = dynamic(
  () => import('../components/PixelOffice').then((m) => ({ default: m.PixelOffice })),
  { ssr: false }
)

type Tab    = 'office' | 'logs' | 'terminal'
type Preset = 'all' | 'po' | 'dev' | 'qa'

const TABS: { id: Tab; label: string }[] = [
  { id: 'office',   label: 'Office' },
  { id: 'logs',     label: 'Activity Log' },
  { id: 'terminal', label: 'Terminal' },
]

const PRESETS: { id: Preset; label: string; roles: AgentRole[] }[] = [
  { id: 'all', label: 'All', roles: [] },
  { id: 'po',  label: 'PO',  roles: ['backlog', 'planning'] },
  { id: 'dev', label: 'Dev', roles: ['architect', 'code'] },
  { id: 'qa',  label: 'QA',  roles: ['test', 'pipeline'] },
]

export default function Dashboard() {
  const { agents, setAgents, setLogs, selectedAgentId } = useAgentStore()
  const [activeTab, setActiveTab] = useState<Tab>('office')
  const [preset, setPreset]       = useState<Preset>('all')

  useEffect(() => {
    async function init() {
      const agents = await ipc?.listAgents()
      if (agents) setAgents(agents)
      const logs = await ipc?.listLogs()
      if (logs) setLogs(logs)
    }
    void init()
  }, [])

  const running = agents.filter((a) => a.status === 'running').length
  const errors  = agents.filter((a) => a.status === 'error').length

  const activePreset  = PRESETS.find((p) => p.id === preset)!
  const visibleAgents = activePreset.roles.length === 0
    ? agents
    : agents.filter((a) => activePreset.roles.includes(a.role))

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-3 border-b border-border shrink-0">
        <div className="flex items-center gap-3">
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 800,
            fontSize: 18, letterSpacing: '-0.02em',
          }}>AgentFlow</span>
          <span style={{
            fontFamily: 'var(--font-mono)', fontSize: 10,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'var(--text-muted)',
          }}>Control Center</span>
        </div>
        <div className="flex items-center gap-4" style={{ fontFamily: 'var(--font-mono)', fontSize: 11 }}>
          <span style={{ color: 'var(--text-muted)' }}>{agents.length} agents</span>
          {running > 0 && (
            <span style={{ color: 'var(--status-running)', fontWeight: 500 }}>{running} running</span>
          )}
          {errors > 0 && (
            <span style={{ color: 'var(--status-error)', fontWeight: 500 }}>
              {errors} error{errors > 1 ? 's' : ''}
            </span>
          )}
          <a href="/pipeline" className="hover:text-foreground transition-colors"
            style={{ color: 'var(--text-muted)' }}>Pipeline</a>
          <a href="/builder" className="hover:text-foreground transition-colors"
            style={{ color: 'var(--text-muted)' }}>Builder</a>
          <a href="/settings" className="hover:text-foreground transition-colors"
            style={{ color: 'var(--text-muted)' }}>Settings</a>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Agent grid */}
        <div className="flex flex-col w-[480px] shrink-0 border-r border-border overflow-hidden">
          {/* Preset switcher */}
          <div className="flex items-center gap-1 px-3 py-2 border-b border-border">
            {PRESETS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setPreset(id)}
                style={{
                  padding: '3px 12px',
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  borderRadius: 'calc(var(--radius) - 2px)',
                  border: 'none',
                  background: preset === id ? 'var(--bg-elevated)' : 'transparent',
                  color: preset === id ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                }}
              >
                {label}
              </button>
            ))}
            <span className="ml-auto" style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              color: 'var(--text-muted)', opacity: 0.5,
            }}>
              {visibleAgents.length}/{agents.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3 content-start">
            {visibleAgents.map((agent) => (
              <AgentCard
                key={agent.id}
                agent={agent}
                selected={selectedAgentId === agent.id}
              />
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-border shrink-0">
            {TABS.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  padding: '8px 16px',
                  fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
                  textTransform: 'uppercase', letterSpacing: '0.12em',
                  border: 'none', background: 'transparent',
                  borderBottom: activeTab === id
                    ? '2px solid var(--status-running)'
                    : '2px solid transparent',
                  color: activeTab === id ? 'var(--text-primary)' : 'var(--text-muted)',
                  cursor: 'pointer', transition: 'color 140ms ease',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-hidden">
            {activeTab === 'office'   && <PixelOffice />}
            {activeTab === 'logs'     && <LogPanel />}
            {activeTab === 'terminal' && <TerminalPanel />}
          </div>
        </div>
      </div>
    </div>
  )
}
