import type { Agent, LogEntry, PipelineTemplate, DispatchResult, AgentMetrics } from '../../main/ipc/types'

export interface AppSettings {
  anthropicApiKey: string
  model: string
  slackWebhookUrl: string
  lineChannelAccessToken: string
  lineTargetId: string
  githubToken: string
}

declare global {
  interface Window {
    ipc: {
      listAgents: () => Promise<Agent[]>
      createAgent: (data: Omit<Agent, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<Agent>
      updateAgent: (id: string, patch: Partial<Agent>) => Promise<Agent>
      deleteAgent: (id: string) => Promise<{ ok: boolean }>

      runAgent: (agentId: string) => Promise<{ id: string; agentId: string; startedAt: number; output: string } | null>
      killAgent: (agentId: string) => Promise<{ ok: boolean }>
      onTaskOutput: (cb: (data: { runId: string; agentId: string; chunk: string }) => void) => () => void
      onTaskDone: (cb: (data: { runId: string; agentId: string; exitCode: number }) => void) => () => void

      listLogs: (agentId?: string) => Promise<LogEntry[]>
      onLogEntry: (cb: (entry: LogEntry) => void) => () => void

      startWatch: (dir: string) => Promise<{ ok: boolean }>
      stopWatch: (dir: string) => Promise<{ ok: boolean }>
      onWatchEvent: (cb: (data: { event: string; path: string }) => void) => () => void

      getSettings: () => Promise<AppSettings>
      setSettings: (patch: Partial<AppSettings>) => Promise<AppSettings>

      listPipelines: () => Promise<PipelineTemplate[]>
      savePipeline: (payload: { id?: string; name: string; nodes: PipelineTemplate['nodes']; edges: PipelineTemplate['edges'] }) => Promise<PipelineTemplate>
      deletePipeline: (id: string) => Promise<{ ok: boolean }>

      testAlert: () => Promise<DispatchResult>

      listMetrics: () => Promise<AgentMetrics[]>
    }
  }
}

export const ipc = typeof window !== 'undefined' ? window.ipc : null
