export type AgentStatus = 'idle' | 'running' | 'success' | 'error'

export type AgentRole =
  | 'backlog'
  | 'planning'
  | 'architect'
  | 'code'
  | 'test'
  | 'pipeline'
  | 'alert'

export type AgentMode = 'pty' | 'claude'

export interface Agent {
  id: string
  name: string
  role: AgentRole
  description: string
  command: string
  workingDir: string
  mode: AgentMode
  status: AgentStatus
  cronSchedule: string
  createdAt: number
  updatedAt: number
}

export interface TaskRun {
  id: string
  agentId: string
  startedAt: number
  finishedAt?: number
  exitCode?: number
  output: string
}

export interface LogEntry {
  id: string
  agentId: string
  level: 'info' | 'warn' | 'error'
  message: string
  timestamp: number
}

export interface RunCallbacks {
  onOutput: (chunk: string) => void
  onDone: (exitCode: number) => void
}

export interface PipelineNode {
  id: string
  role: AgentRole
  x: number
  y: number
}

export interface PipelineEdgeDef {
  id: string
  source: string
  target: string
}

export interface PipelineTemplate {
  id: string
  name: string
  nodes: PipelineNode[]
  edges: PipelineEdgeDef[]
  createdAt: number
  updatedAt: number
}

export function toErrorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err)
}

export function exitCodeToStatus(code: number): AgentStatus {
  return code === 0 ? 'success' : 'error'
}

// IPC channel names
export const IPC = {
  // Agent CRUD
  AGENT_LIST: 'agent:list',
  AGENT_CREATE: 'agent:create',
  AGENT_UPDATE: 'agent:update',
  AGENT_DELETE: 'agent:delete',

  // Task execution
  TASK_RUN: 'task:run',
  TASK_KILL: 'task:kill',
  TASK_OUTPUT: 'task:output',   // push main → renderer
  TASK_DONE: 'task:done',       // push main → renderer

  // Logs
  LOG_LIST: 'log:list',
  LOG_ENTRY: 'log:entry',       // push main → renderer

  // File watcher
  WATCH_START: 'watch:start',
  WATCH_STOP: 'watch:stop',
  WATCH_EVENT: 'watch:event',   // push main → renderer

  // Settings (electron-store)
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',

  // Pipeline templates
  PIPELINE_LIST: 'pipeline:list',
  PIPELINE_SAVE: 'pipeline:save',
  PIPELINE_DELETE: 'pipeline:delete',
} as const

