import { contextBridge, ipcRenderer } from 'electron'
import { IPC } from './ipc/types'

contextBridge.exposeInMainWorld('ipc', {
  // Agent CRUD
  listAgents: () => ipcRenderer.invoke(IPC.AGENT_LIST),
  createAgent: (data: Parameters<typeof ipcRenderer.invoke>[1]) =>
    ipcRenderer.invoke(IPC.AGENT_CREATE, data),
  updateAgent: (id: string, patch: object) =>
    ipcRenderer.invoke(IPC.AGENT_UPDATE, id, patch),
  deleteAgent: (id: string) => ipcRenderer.invoke(IPC.AGENT_DELETE, id),

  // Task execution
  runAgent: (agentId: string) => ipcRenderer.invoke(IPC.TASK_RUN, agentId),
  killAgent: (agentId: string) => ipcRenderer.invoke(IPC.TASK_KILL, agentId),
  onTaskOutput: (cb: (data: { runId: string; agentId: string; chunk: string }) => void) => {
    const handler = (_e: Electron.IpcRendererEvent, data: { runId: string; agentId: string; chunk: string }) => cb(data)
    ipcRenderer.on(IPC.TASK_OUTPUT, handler)
    return () => ipcRenderer.removeListener(IPC.TASK_OUTPUT, handler)
  },
  onTaskDone: (cb: (data: { runId: string; agentId: string; exitCode: number }) => void) => {
    const handler = (_e: Electron.IpcRendererEvent, data: { runId: string; agentId: string; exitCode: number }) => cb(data)
    ipcRenderer.on(IPC.TASK_DONE, handler)
    return () => ipcRenderer.removeListener(IPC.TASK_DONE, handler)
  },

  // Logs
  listLogs: (agentId?: string) => ipcRenderer.invoke(IPC.LOG_LIST, agentId),
  onLogEntry: (cb: (entry: object) => void) => {
    const handler = (_e: Electron.IpcRendererEvent, entry: object) => cb(entry)
    ipcRenderer.on(IPC.LOG_ENTRY, handler)
    return () => ipcRenderer.removeListener(IPC.LOG_ENTRY, handler)
  },

  // File watcher
  startWatch: (dir: string) => ipcRenderer.invoke(IPC.WATCH_START, dir),
  stopWatch: (dir: string) => ipcRenderer.invoke(IPC.WATCH_STOP, dir),
  onWatchEvent: (cb: (data: { event: string; path: string }) => void) => {
    const handler = (_e: Electron.IpcRendererEvent, data: { event: string; path: string }) => cb(data)
    ipcRenderer.on(IPC.WATCH_EVENT, handler)
    return () => ipcRenderer.removeListener(IPC.WATCH_EVENT, handler)
  },

  // Settings
  getSettings: () => ipcRenderer.invoke(IPC.SETTINGS_GET),
  setSettings: (patch: Record<string, string>) => ipcRenderer.invoke(IPC.SETTINGS_SET, patch),

  // Pipeline templates
  listPipelines: () => ipcRenderer.invoke(IPC.PIPELINE_LIST),
  savePipeline: (payload: object) => ipcRenderer.invoke(IPC.PIPELINE_SAVE, payload),
  deletePipeline: (id: string) => ipcRenderer.invoke(IPC.PIPELINE_DELETE, id),
})
