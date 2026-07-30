import { create } from 'zustand'
import type { Agent, LogEntry } from '../../main/ipc/types'

interface AgentStore {
  agents: Agent[]
  logs: LogEntry[]
  terminalOutput: Record<string, string>  // agentId → cumulative output
  selectedAgentId: string | null

  setAgents: (agents: Agent[]) => void
  setLogs: (logs: LogEntry[]) => void
  updateAgentStatus: (agentId: string, status: Agent['status']) => void
  updateAgent: (agent: Agent) => void
  appendOutput: (agentId: string, chunk: string) => void
  addLog: (entry: LogEntry) => void
  selectAgent: (id: string | null) => void
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  logs: [],
  terminalOutput: {},
  selectedAgentId: null,

  setAgents: (agents) => set({ agents }),

  // DB returns DESC (newest first); store keeps newest-first for display
  setLogs: (logs) => set({ logs }),

  updateAgentStatus: (agentId, status) =>
    set((s) => ({
      agents: s.agents.map((a) => (a.id === agentId ? { ...a, status } : a)),
    })),

  updateAgent: (agent) =>
    set((s) => ({
      agents: s.agents.map((a) => (a.id === agent.id ? agent : a)),
    })),

  appendOutput: (agentId, chunk) =>
    set((s) => ({
      terminalOutput: {
        ...s.terminalOutput,
        [agentId]: (s.terminalOutput[agentId] ?? '') + chunk,
      },
    })),

  // Real-time entries: prepend to keep newest-first
  addLog: (entry) =>
    set((s) => ({ logs: [entry, ...s.logs].slice(0, 500) })),

  selectAgent: (id) => set({ selectedAgentId: id }),
}))
