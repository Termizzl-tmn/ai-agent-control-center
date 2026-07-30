import { useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ipc } from '../lib/ipc'
import { useAgentStore } from '../store/agentStore'

const PipelineView = dynamic(
  () => import('../components/PipelineView').then(m => ({ default: m.PipelineView })),
  { ssr: false }
)

export default function Pipeline() {
  const { setAgents } = useAgentStore()

  useEffect(() => {
    async function init() {
      const agents = await ipc?.listAgents()
      if (agents) setAgents(agents)
    }
    void init()
  }, [])

  return (
    <div className="flex flex-col h-screen bg-background text-foreground overflow-hidden">
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
          }}>Pipeline</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="/builder"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--text-muted)',
            }}
            className="hover:text-foreground transition-colors"
          >
            Builder
          </a>
          <a
            href="/"
            style={{
              fontFamily: 'var(--font-mono)', fontSize: 10,
              textTransform: 'uppercase', letterSpacing: '0.12em',
              color: 'var(--text-muted)',
            }}
            className="hover:text-foreground transition-colors"
          >
            ← Dashboard
          </a>
        </div>
      </header>

      <div className="flex-1 overflow-hidden">
        <PipelineView />
      </div>
    </div>
  )
}
