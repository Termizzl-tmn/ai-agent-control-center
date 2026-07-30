import dynamic from 'next/dynamic'

const PipelineBuilder = dynamic(
  () => import('../components/PipelineBuilder').then((m) => ({ default: m.PipelineBuilder })),
  { ssr: false }
)

export default function Builder() {
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
          }}>Pipeline Builder</span>
        </div>
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
      </header>

      <div className="flex-1 overflow-hidden">
        <PipelineBuilder />
      </div>
    </div>
  )
}
