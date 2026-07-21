import React, { memo, useMemo, useCallback } from 'react'
import ReactFlow, {
  Background,
  Controls,
  type Node,
  type Edge,
  Handle,
  Position,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { useAgentStore } from '../store/agentStore'
import { ROLE_META, ROLE_HEX } from '../lib/agentMeta'
import type { Agent, AgentRole } from '../../main/ipc/types'

const PIPELINE_ROLES: AgentRole[] = [
  'backlog', 'planning', 'architect', 'code', 'test', 'pipeline', 'alert',
]

const STATUS_COLOR: Record<string, string> = {
  idle:    '#4A5068',
  running: '#00E5A0',
  success: '#4D9FFF',
  error:   '#FF4D6D',
}

interface AgentNodeData { agent: Agent; isSelected: boolean }

const AgentNode = memo(function AgentNode({ data }: { data: AgentNodeData }) {
  const { agent, isSelected } = data
  const meta = ROLE_META[agent.role]
  const roleColor = ROLE_HEX[agent.role]
  const statusColor = STATUS_COLOR[agent.status] ?? '#4A5068'

  return (
    <>
      <Handle type="target" position={Position.Left}
        style={{ background: '#1E2538', border: `1px solid ${statusColor}` }} />
      <div style={{
        width: 140,
        background: 'var(--bg-surface)',
        border: `2px solid ${isSelected ? roleColor : statusColor}`,
        borderRadius: 'var(--radius)',
        padding: '10px 12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6,
        boxShadow: isSelected
          ? `0 0 0 1px ${roleColor}55, 0 0 16px ${roleColor}33`
          : agent.status === 'running'
            ? '0 0 12px rgba(0,229,160,0.25)'
            : '0 1px 0 rgba(0,0,0,0.4)',
        transition: 'border-color 140ms ease, box-shadow 140ms ease',
      }}>
        <span style={{ fontSize: 22, lineHeight: 1 }}>{meta.icon}</span>
        <div style={{ textAlign: 'center' }}>
          <p style={{
            margin: 0,
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: '-0.01em',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
          }}>{agent.name}</p>
          <p style={{
            margin: '2px 0 0',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--text-muted)',
          }}>{agent.role}</p>
        </div>
        <div style={{
          padding: '2px 8px',
          borderRadius: 999,
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          background: `${statusColor}20`,
          color: statusColor,
        }}>
          {agent.status}
        </div>
      </div>
      <Handle type="source" position={Position.Right}
        style={{ background: '#1E2538', border: `1px solid ${statusColor}` }} />
    </>
  )
})

const nodeTypes = { agent: AgentNode }

const NODE_W = 140
const H_GAP = 60

function buildGraph(agents: Agent[], selectedId: string | null): { nodes: Node[]; edges: Edge[] } {
  const byRole = Object.fromEntries(agents.map(a => [a.role, a]))

  const nodes: Node[] = PIPELINE_ROLES.map((role, i) => {
    const agent = byRole[role]
    if (!agent) return null
    return {
      id: agent.id,
      type: 'agent',
      position: { x: i * (NODE_W + H_GAP), y: 60 },
      data: { agent, isSelected: agent.id === selectedId } as AgentNodeData,
      draggable: false,
    }
  }).filter(Boolean) as Node[]

  const edges: Edge[] = []
  for (let i = 0; i < nodes.length - 1; i++) {
    const srcAgent = (nodes[i].data as AgentNodeData).agent
    const isRunning = srcAgent.status === 'running'
    edges.push({
      id: `e${i}`,
      source: nodes[i].id,
      target: nodes[i + 1].id,
      animated: isRunning,
      style: { stroke: isRunning ? '#00E5A0' : '#1E2538', strokeWidth: 2 },
    })
  }

  return { nodes, edges }
}

export function PipelineView() {
  const agents = useAgentStore(s => s.agents)
  const selectedAgentId = useAgentStore(s => s.selectedAgentId)
  const selectAgent = useAgentStore(s => s.selectAgent)

  const { nodes, edges } = useMemo(
    () => buildGraph(agents, selectedAgentId),
    [agents, selectedAgentId],
  )

  const onNodeClick = useCallback((_e: React.MouseEvent, node: Node) => {
    selectAgent(node.id)
  }, [selectAgent])

  return (
    <div style={{ width: '100%', height: '100%', background: 'var(--bg-base)' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'var(--bg-base)' }}
      >
        <Background color="#1E2538" gap={24} size={1} />
        <Controls
          style={{ background: 'var(--bg-surface)', border: '1px solid #1E2538', borderRadius: 8 }}
        />
      </ReactFlow>
    </div>
  )
}
