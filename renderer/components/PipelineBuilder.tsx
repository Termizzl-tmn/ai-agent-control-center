import { useCallback, useEffect, useState, type DragEvent } from 'react'
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  Handle,
  Position,
  type Node,
  type Edge,
  type Connection,
  type NodeTypes,
} from 'reactflow'
import 'reactflow/dist/style.css'
import { ipc } from '../lib/ipc'
import { ROLE_META, ROLE_HEX } from '../lib/agentMeta'
import type {
  AgentRole,
  PipelineTemplate,
  PipelineNode as TemplateNode,
  PipelineEdgeDef as TemplateEdge,
} from '../../main/ipc/types'

const ALL_ROLES: AgentRole[] = ['backlog', 'planning', 'architect', 'code', 'test', 'pipeline', 'alert']
const DRAG_TYPE = 'application/agentflow-role'
const EDGE_STYLE = { stroke: '#1E2538', strokeWidth: 2 }

interface BuilderNodeData { role: AgentRole }

function BuilderNode({ data }: { data: BuilderNodeData }) {
  const meta = ROLE_META[data.role]
  const color = ROLE_HEX[data.role]
  return (
    <>
      <Handle type="target" position={Position.Left} style={{ background: '#1E2538', border: `1px solid ${color}` }} />
      <div style={{
        width: 130, background: 'var(--bg-surface)', border: `2px solid ${color}`,
        borderRadius: 'var(--radius)', padding: '8px 10px', display: 'flex',
        alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 18 }}>{meta.icon}</span>
        <span style={{
          fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase',
          letterSpacing: '0.08em', color: 'var(--text-primary)',
        }}>{meta.label.replace(' Agent', '')}</span>
      </div>
      <Handle type="source" position={Position.Right} style={{ background: '#1E2538', border: `1px solid ${color}` }} />
    </>
  )
}

const nodeTypes: NodeTypes = { builder: BuilderNode }

function toPipelinePayload(nodes: Node<BuilderNodeData>[], edges: Edge[]): { nodes: TemplateNode[]; edges: TemplateEdge[] } {
  return {
    nodes: nodes.map((n) => ({ id: n.id, role: n.data.role, x: n.position.x, y: n.position.y })),
    edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target })),
  }
}

function fromTemplate(template: PipelineTemplate): { nodes: Node<BuilderNodeData>[]; edges: Edge[] } {
  return {
    nodes: template.nodes.map((n) => ({ id: n.id, type: 'builder', position: { x: n.x, y: n.y }, data: { role: n.role } })),
    edges: template.edges.map((e) => ({ id: e.id, source: e.source, target: e.target, style: EDGE_STYLE })),
  }
}

async function refreshTemplates(setTemplates: (t: PipelineTemplate[]) => void) {
  const list = await ipc?.listPipelines()
  if (list) setTemplates(list)
}

function onDragStartRole(e: DragEvent, role: AgentRole) {
  e.dataTransfer.setData(DRAG_TYPE, role)
  e.dataTransfer.effectAllowed = 'move'
}

function Sidebar({ onDragStart }: { onDragStart: (e: DragEvent, role: AgentRole) => void }) {
  return (
    <div style={{
      width: 160, borderRight: '1px solid var(--ds-border)', padding: 12,
      display: 'flex', flexDirection: 'column', gap: 8, overflowY: 'auto',
    }}>
      <p style={{
        fontFamily: 'var(--font-mono)', fontSize: 10, textTransform: 'uppercase',
        letterSpacing: '0.12em', color: 'var(--text-muted)', margin: '0 0 4px',
      }}>
        Drag onto canvas
      </p>
      {ALL_ROLES.map((role) => {
        const meta = ROLE_META[role]
        const color = ROLE_HEX[role]
        return (
          <div
            key={role}
            draggable
            onDragStart={(e) => onDragStart(e, role)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px',
              border: `1px solid ${color}55`, borderRadius: 'var(--radius)',
              background: `${color}12`, cursor: 'grab',
              fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--text-primary)',
            }}
          >
            <span>{meta.icon}</span>
            <span>{meta.label.replace(' Agent', '')}</span>
          </div>
        )
      })}
    </div>
  )
}

function btnStyle(color: string) {
  return {
    padding: '5px 12px', borderRadius: 'calc(var(--radius) - 2px)',
    border: `1px solid ${color}55`, background: `${color}18`, color,
    fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500,
    textTransform: 'uppercase' as const, letterSpacing: '0.1em', cursor: 'pointer',
  }
}

interface ToolbarProps {
  name: string
  setName: (v: string) => void
  templates: PipelineTemplate[]
  activeId: string | null
  onSave: () => void
  onLoad: (t: PipelineTemplate) => void
  onNew: () => void
  onDelete: () => void
}

function Toolbar({ name, setName, templates, activeId, onSave, onLoad, onNew, onDelete }: ToolbarProps) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
      borderBottom: '1px solid var(--ds-border)', fontFamily: 'var(--font-mono)', fontSize: 11,
    }}>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{
          background: 'var(--bg-surface)', border: '1px solid var(--ds-border)',
          borderRadius: 'calc(var(--radius) - 2px)', padding: '5px 10px',
          color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 11, width: 200,
        }}
      />
      <button onClick={onSave} style={btnStyle('#00E5A0')}>Save</button>
      <button onClick={onNew} style={btnStyle('#4A5068')}>New</button>
      {activeId && <button onClick={onDelete} style={btnStyle('#FF4D6D')}>Delete</button>}

      <select
        onChange={(e) => {
          const t = templates.find((t) => t.id === e.target.value)
          if (t) onLoad(t)
        }}
        value={activeId ?? ''}
        style={{
          marginLeft: 'auto', background: 'var(--bg-surface)', border: '1px solid var(--ds-border)',
          borderRadius: 'calc(var(--radius) - 2px)', padding: '5px 10px',
          color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', fontSize: 11,
        }}
      >
        <option value="">Load template…</option>
        {templates.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </div>
  )
}

function BuilderCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState<BuilderNodeData>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Record<string, never>>([])
  const [templates, setTemplates] = useState<PipelineTemplate[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [name, setName] = useState('Untitled Pipeline')
  const { screenToFlowPosition } = useReactFlow()

  useEffect(() => { void refreshTemplates(setTemplates) }, [])

  const onConnect = useCallback(
    (conn: Connection) => setEdges((es) => addEdge({ ...conn, style: EDGE_STYLE }, es)),
    [setEdges],
  )

  const onDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    const role = e.dataTransfer.getData(DRAG_TYPE) as AgentRole
    if (!role) return
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    setNodes((ns) => [...ns, { id: crypto.randomUUID(), type: 'builder', position, data: { role } }])
  }, [screenToFlowPosition, setNodes])

  function onDragOver(e: DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  async function handleSave() {
    const payload = { id: activeId ?? undefined, name, ...toPipelinePayload(nodes, edges) }
    const saved = await ipc?.savePipeline(payload)
    if (!saved) return
    setActiveId(saved.id)
    await refreshTemplates(setTemplates)
  }

  function handleLoad(template: PipelineTemplate) {
    const { nodes: n, edges: e } = fromTemplate(template)
    setActiveId(template.id)
    setName(template.name)
    setNodes(n)
    setEdges(e)
  }

  function handleNew() {
    setActiveId(null)
    setName('Untitled Pipeline')
    setNodes([])
    setEdges([])
  }

  async function handleDelete() {
    if (!activeId) return
    await ipc?.deletePipeline(activeId)
    handleNew()
    await refreshTemplates(setTemplates)
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Sidebar onDragStart={onDragStartRole} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Toolbar
          name={name} setName={setName} templates={templates} activeId={activeId}
          onSave={handleSave} onLoad={handleLoad} onNew={handleNew} onDelete={handleDelete}
        />
        <div style={{ flex: 1 }}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            deleteKeyCode={['Backspace', 'Delete']}
            fitView
            proOptions={{ hideAttribution: true }}
            style={{ background: 'var(--bg-base)' }}
          >
            <Background color="#1E2538" gap={24} size={1} />
            <Controls style={{ background: 'var(--bg-surface)', border: '1px solid #1E2538', borderRadius: 8 }} />
          </ReactFlow>
        </div>
      </div>
    </div>
  )
}

export function PipelineBuilder() {
  return (
    <ReactFlowProvider>
      <BuilderCanvas />
    </ReactFlowProvider>
  )
}
