import { ipcMain, BrowserWindow } from 'electron'
import ElectronStore from 'electron-store'
import { IPC, Agent, TaskRun, LogEntry, toErrorMessage, exitCodeToStatus } from './types'
import { getDb } from '../db'
import { runAgent, killAgent } from '../executor'
import { runClaudeAgent, killClaudeAgent } from '../claudeExecutor'
import { startWatcher, stopWatcher } from '../watcher'
import { randomUUID } from 'crypto'

interface Settings {
  anthropicApiKey: string
  model: string
}

const settingsStore = new ElectronStore<Settings>({
  name: 'settings',
  defaults: { anthropicApiKey: '', model: 'claude-sonnet-4-6' },
})

function sendToRenderer(win: BrowserWindow, channel: string, payload: unknown) {
  if (!win.isDestroyed()) win.webContents.send(channel, payload)
}

export function registerIpcHandlers(win: BrowserWindow) {
  // --- Agent CRUD ---
  ipcMain.handle(IPC.AGENT_LIST, () => {
    return getDb().prepare('SELECT * FROM agents ORDER BY createdAt ASC').all()
  })

  ipcMain.handle(IPC.AGENT_CREATE, (_e, data: Omit<Agent, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const agent: Agent = {
      id: randomUUID(),
      status: 'idle',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      ...data,
    }
    getDb().prepare(
      'INSERT INTO agents (id, name, role, description, command, workingDir, mode, status, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)'
    ).run(agent.id, agent.name, agent.role, agent.description, agent.command, agent.workingDir, agent.mode, agent.status, agent.createdAt, agent.updatedAt)
    return agent
  })

  ipcMain.handle(IPC.AGENT_UPDATE, (_e, id: string, patch: Partial<Agent>) => {
    const PATCHABLE: ReadonlyArray<keyof Agent> = ['name', 'role', 'description', 'command', 'workingDir', 'mode', 'status']
    const safe = Object.fromEntries(
      Object.entries(patch).filter(([k]) => PATCHABLE.includes(k as keyof Agent))
    )
    const updated = { ...safe, updatedAt: Date.now() }
    const sets = Object.keys(updated).map(k => `${k} = ?`).join(', ')
    getDb().prepare(`UPDATE agents SET ${sets} WHERE id = ?`).run(...Object.values(updated), id)
    return getDb().prepare('SELECT * FROM agents WHERE id = ?').get(id)
  })

  ipcMain.handle(IPC.AGENT_DELETE, (_e, id: string) => {
    getDb().prepare('DELETE FROM agents WHERE id = ?').run(id)
    return { ok: true }
  })

  // --- Task execution ---
  ipcMain.handle(IPC.TASK_RUN, async (_e, agentId: string) => {
    const agent = getDb().prepare('SELECT * FROM agents WHERE id = ?').get(agentId) as Agent
    if (!agent) throw new Error(`Agent ${agentId} not found`)

    const run: TaskRun = {
      id: randomUUID(),
      agentId,
      startedAt: Date.now(),
      output: '',
    }

    getDb().prepare(
      'INSERT INTO task_runs (id, agentId, startedAt, output) VALUES (?,?,?,?)'
    ).run(run.id, run.agentId, run.startedAt, run.output)

    getDb().prepare('UPDATE agents SET status = ?, updatedAt = ? WHERE id = ?')
      .run('running', Date.now(), agentId)

    addLog(win, agentId, 'info', `Agent started (${agent.mode} mode)`)

    const callbacks = {
      onOutput: (chunk: string) => {
        run.output += chunk
        sendToRenderer(win, IPC.TASK_OUTPUT, { runId: run.id, agentId, chunk })
      },
      onDone: (exitCode: number) => {
        run.finishedAt = Date.now()
        run.exitCode = exitCode
        getDb().prepare(
          'UPDATE task_runs SET finishedAt = ?, exitCode = ?, output = ? WHERE id = ?'
        ).run(run.finishedAt, exitCode, run.output, run.id)
        getDb().prepare('UPDATE agents SET status = ?, updatedAt = ? WHERE id = ?')
          .run(exitCodeToStatus(exitCode), Date.now(), agentId)
        addLog(win, agentId, exitCode === 0 ? 'info' : 'error', `Agent finished (exit ${exitCode})`)
        sendToRenderer(win, IPC.TASK_DONE, { runId: run.id, agentId, exitCode })
      },
    }

    const handleUnexpectedError = (err: unknown) => {
      callbacks.onOutput(`\n[AgentFlow Error] ${toErrorMessage(err)}\n`)
      callbacks.onDone(1)
    }

    if (agent.mode === 'claude') {
      const { anthropicApiKey: apiKey, model } = settingsStore.store
      runClaudeAgent(agent, run, apiKey, model, callbacks).catch(handleUnexpectedError)
    } else {
      runAgent(agent, run, callbacks).catch(handleUnexpectedError)
    }

    return run
  })

  ipcMain.handle(IPC.TASK_KILL, (_e, agentId: string) => {
    const agent = getDb().prepare('SELECT * FROM agents WHERE id = ?').get(agentId) as Agent | undefined
    if (agent?.mode === 'claude') {
      killClaudeAgent(agentId)
    } else {
      killAgent(agentId)
    }
    getDb().prepare('UPDATE agents SET status = ?, updatedAt = ? WHERE id = ?')
      .run('idle', Date.now(), agentId)
    addLog(win, agentId, 'warn', 'Agent killed by user')
    return { ok: true }
  })

  // --- Logs ---
  ipcMain.handle(IPC.LOG_LIST, (_e, agentId?: string) => {
    return agentId
      ? getDb().prepare('SELECT * FROM logs WHERE agentId = ? ORDER BY timestamp DESC LIMIT 200').all(agentId)
      : getDb().prepare('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 200').all()
  })

  // --- File watcher ---
  ipcMain.handle(IPC.WATCH_START, (_e, dir: string) => {
    startWatcher(dir, (event, filePath) => {
      sendToRenderer(win, IPC.WATCH_EVENT, { event, path: filePath })
    })
    return { ok: true }
  })

  ipcMain.handle(IPC.WATCH_STOP, (_e, dir: string) => {
    stopWatcher(dir)
    return { ok: true }
  })

  // --- Settings ---
  ipcMain.handle(IPC.SETTINGS_GET, () => settingsStore.store)

  ipcMain.handle(IPC.SETTINGS_SET, (_e, patch: Partial<Settings>) => {
    for (const [k, v] of Object.entries(patch)) {
      settingsStore.set(k as keyof Settings, v as Settings[keyof Settings])
    }
    return settingsStore.store
  })
}

function addLog(win: BrowserWindow, agentId: string, level: LogEntry['level'], message: string) {
  const entry: LogEntry = {
    id: randomUUID(),
    agentId,
    level,
    message,
    timestamp: Date.now(),
  }
  getDb().prepare(
    'INSERT INTO logs (id, agentId, level, message, timestamp) VALUES (?,?,?,?,?)'
  ).run(entry.id, entry.agentId, entry.level, entry.message, entry.timestamp)
  sendToRenderer(win, IPC.LOG_ENTRY, entry)
}
