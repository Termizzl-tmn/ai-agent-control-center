import chokidar, { FSWatcher } from 'chokidar'
import fs from 'fs'
import type { BrowserWindow } from 'electron'
import { getDb } from './db'
import type { Agent } from './ipc/types'
import { addLog } from './ipc/utils'
import { runAgentById } from './taskRunner'

const DEBOUNCE_MS = 2000

const watchers = new Map<string, FSWatcher>()
const debounceTimers = new Map<string, NodeJS.Timeout>()

export function isValidWatchPath(dir: string): boolean {
  try {
    return fs.statSync(dir).isDirectory()
  } catch {
    return false
  }
}

export function unwatchAgentPath(agentId: string) {
  const watcher = watchers.get(agentId)
  if (watcher) {
    watcher.close()
    watchers.delete(agentId)
  }
  const timer = debounceTimers.get(agentId)
  if (timer) {
    clearTimeout(timer)
    debounceTimers.delete(agentId)
  }
}

export function watchAgentPath(win: BrowserWindow, agent: Agent) {
  unwatchAgentPath(agent.id)
  if (!agent.watchPath || !isValidWatchPath(agent.watchPath)) return

  const watcher = chokidar.watch(agent.watchPath, {
    ignored: /(^|[\/\\])\..|(node_modules)/,
    persistent: true,
    ignoreInitial: true,
  })

  const trigger = (event: string, filePath: string) => {
    const existing = debounceTimers.get(agent.id)
    if (existing) clearTimeout(existing)
    debounceTimers.set(agent.id, setTimeout(() => {
      debounceTimers.delete(agent.id)
      addLog(win, agent.id, 'info', `File change detected (${event}: ${filePath}) — triggering run`)
      runAgentById(win, agent.id).catch((err: unknown) => {
        addLog(win, agent.id, 'error', `File-triggered run failed to start: ${err instanceof Error ? err.message : String(err)}`)
      })
    }, DEBOUNCE_MS))
  }

  watcher
    .on('add', (p) => trigger('add', p))
    .on('change', (p) => trigger('change', p))
    .on('unlink', (p) => trigger('unlink', p))

  watchers.set(agent.id, watcher)
}

export function initFileWatchTriggers(win: BrowserWindow) {
  const agents = getDb().prepare("SELECT * FROM agents WHERE watchPath != ''").all() as Agent[]
  for (const agent of agents) watchAgentPath(win, agent)
}
