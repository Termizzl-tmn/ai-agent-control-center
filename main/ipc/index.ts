import { ipcMain, BrowserWindow } from 'electron'
import { IPC, Agent, PipelineNode, PipelineEdgeDef, PipelineTemplate } from './types'
import { getDb } from '../db'
import { startWatcher, stopWatcher } from '../watcher'
import { randomUUID } from 'crypto'
import { settingsStore, type Settings } from '../settingsStore'
import { sendToRenderer, addLog } from './utils'
import { runAgentById, killAgentById } from '../taskRunner'
import { scheduleAgent, unscheduleAgent, isValidCron } from '../scheduler'
import { watchAgentPath, unwatchAgentPath, isValidWatchPath } from '../fileWatchTrigger'
import { dispatchAlert } from '../alertDispatcher'
import { pollAgentRepo, unpollAgentRepo, isValidGithubRepo, isValidGithubRepoFormat } from '../githubTrigger'

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
      'INSERT INTO agents (id, name, role, description, command, workingDir, mode, status, cronSchedule, watchPath, githubRepo, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)'
    ).run(agent.id, agent.name, agent.role, agent.description, agent.command, agent.workingDir, agent.mode, agent.status, agent.cronSchedule, agent.watchPath, agent.githubRepo, agent.createdAt, agent.updatedAt)
    return agent
  })

  ipcMain.handle(IPC.AGENT_UPDATE, async (_e, id: string, patch: Partial<Agent>) => {
    if (patch.cronSchedule && !isValidCron(patch.cronSchedule)) {
      throw new Error(`Invalid cron expression: ${patch.cronSchedule}`)
    }
    if (patch.watchPath && !isValidWatchPath(patch.watchPath)) {
      throw new Error(`Not a directory: ${patch.watchPath}`)
    }
    if (patch.githubRepo) {
      if (!isValidGithubRepoFormat(patch.githubRepo)) {
        throw new Error(`Expected "owner/repo" format: ${patch.githubRepo}`)
      }
      if (!(await isValidGithubRepo(patch.githubRepo))) {
        throw new Error(`Repo not found or not accessible: ${patch.githubRepo}`)
      }
    }

    const PATCHABLE: ReadonlyArray<keyof Agent> = ['name', 'role', 'description', 'command', 'workingDir', 'mode', 'status', 'cronSchedule', 'watchPath', 'githubRepo']
    const safe = Object.fromEntries(
      Object.entries(patch).filter(([k]) => PATCHABLE.includes(k as keyof Agent))
    )
    const updated = { ...safe, updatedAt: Date.now() }
    const sets = Object.keys(updated).map(k => `${k} = ?`).join(', ')
    getDb().prepare(`UPDATE agents SET ${sets} WHERE id = ?`).run(...Object.values(updated), id)

    const agent = getDb().prepare('SELECT * FROM agents WHERE id = ?').get(id) as Agent
    if ('cronSchedule' in patch) {
      if (agent.cronSchedule) scheduleAgent(win, agent)
      else unscheduleAgent(id)
    }
    if ('watchPath' in patch) {
      if (agent.watchPath) watchAgentPath(win, agent)
      else unwatchAgentPath(id)
    }
    if ('githubRepo' in patch) {
      if (agent.githubRepo) pollAgentRepo(win, agent)
      else unpollAgentRepo(id)
    }
    return agent
  })

  ipcMain.handle(IPC.AGENT_DELETE, (_e, id: string) => {
    getDb().prepare('DELETE FROM agents WHERE id = ?').run(id)
    unscheduleAgent(id)
    unwatchAgentPath(id)
    unpollAgentRepo(id)
    return { ok: true }
  })

  // --- Task execution ---
  ipcMain.handle(IPC.TASK_RUN, (_e, agentId: string) => runAgentById(win, agentId))

  ipcMain.handle(IPC.TASK_KILL, (_e, agentId: string) => {
    const agent = getDb().prepare('SELECT * FROM agents WHERE id = ?').get(agentId) as Agent | undefined
    if (agent) killAgentById(agentId, agent.mode)
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

  // --- Pipeline templates ---
  ipcMain.handle(IPC.PIPELINE_LIST, () => {
    const rows = getDb().prepare(
      'SELECT * FROM pipeline_templates ORDER BY updatedAt DESC'
    ).all() as Array<{ id: string; name: string; nodes: string; edges: string; createdAt: number; updatedAt: number }>
    return rows.map((r) => ({
      ...r,
      nodes: JSON.parse(r.nodes) as PipelineNode[],
      edges: JSON.parse(r.edges) as PipelineEdgeDef[],
    }))
  })

  ipcMain.handle(IPC.PIPELINE_SAVE, (_e, payload: { id?: string; name: string; nodes: PipelineNode[]; edges: PipelineEdgeDef[] }) => {
    const now = Date.now()
    const id = payload.id ?? randomUUID()
    const nodesJson = JSON.stringify(payload.nodes)
    const edgesJson = JSON.stringify(payload.edges)

    const existing = getDb().prepare('SELECT createdAt FROM pipeline_templates WHERE id = ?').get(id) as { createdAt: number } | undefined
    if (existing) {
      getDb().prepare('UPDATE pipeline_templates SET name = ?, nodes = ?, edges = ?, updatedAt = ? WHERE id = ?')
        .run(payload.name, nodesJson, edgesJson, now, id)
    } else {
      getDb().prepare('INSERT INTO pipeline_templates (id, name, nodes, edges, createdAt, updatedAt) VALUES (?,?,?,?,?,?)')
        .run(id, payload.name, nodesJson, edgesJson, now, now)
    }

    const template: PipelineTemplate = {
      id, name: payload.name, nodes: payload.nodes, edges: payload.edges,
      createdAt: existing?.createdAt ?? now, updatedAt: now,
    }
    return template
  })

  ipcMain.handle(IPC.PIPELINE_DELETE, (_e, id: string) => {
    getDb().prepare('DELETE FROM pipeline_templates WHERE id = ?').run(id)
    return { ok: true }
  })

  // --- Alert dispatch ---
  ipcMain.handle(IPC.ALERT_TEST, () => {
    return dispatchAlert('🔔 AgentFlow test alert — your Slack/LINE integration is working.')
  })

  // --- Metrics ---
  ipcMain.handle(IPC.METRICS_LIST, () => {
    return getDb().prepare(`
      SELECT
        agentId,
        COUNT(*) as totalRuns,
        SUM(CASE WHEN exitCode = 0 THEN 1 ELSE 0 END) as successRuns,
        SUM(CASE WHEN finishedAt IS NOT NULL THEN 1 ELSE 0 END) as finishedRuns,
        AVG(CASE WHEN finishedAt IS NOT NULL THEN finishedAt - startedAt END) as avgRunTimeMs,
        SUM(inputTokens) as totalInputTokens,
        SUM(outputTokens) as totalOutputTokens,
        MAX(startedAt) as lastRunAt
      FROM task_runs
      GROUP BY agentId
    `).all()
  })
}
