import { useAgentStore } from '../store/agentStore'

export function TerminalPanel() {
  const { selectedAgentId, terminalOutput, agents } = useAgentStore()
  const agent  = agents.find((a) => a.id === selectedAgentId)
  const output = selectedAgentId ? (terminalOutput[selectedAgentId] ?? '') : ''

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between px-4 py-2 border-b border-border">
        <h2 style={{
          fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 500,
          textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-muted)',
        }}>
          Terminal
          {agent && (
            <span style={{ color: 'var(--text-secondary)', marginLeft: 8 }}>· {agent.name}</span>
          )}
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-3" style={{
        background: 'var(--bg-sunken)',
        fontFamily: 'var(--font-mono)',
        fontSize: '11px',
      }}>
        {!selectedAgentId && (
          <p className="text-center pt-8" style={{ color: 'var(--text-muted)' }}>
            Select an agent to view output.
          </p>
        )}
        {selectedAgentId && !output && (
          <p className="text-center pt-8" style={{ color: 'var(--text-muted)' }}>
            No output yet. Run the agent to see output here.
          </p>
        )}
        {output && (
          <pre style={{
            color: 'var(--status-running)',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-all',
            margin: 0,
          }}>{output}</pre>
        )}
      </div>
    </div>
  )
}
