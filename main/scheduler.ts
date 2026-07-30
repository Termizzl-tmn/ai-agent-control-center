import { schedule, validate, type ScheduledTask } from 'node-cron'
import type { BrowserWindow } from 'electron'
import { getDb } from './db'
import type { Agent } from './ipc/types'
import { addLog } from './ipc/utils'
import { runAgentById } from './taskRunner'

const jobs = new Map<string, ScheduledTask>()

export function isValidCron(expression: string): boolean {
  return validate(expression)
}

export function unscheduleAgent(agentId: string) {
  const task = jobs.get(agentId)
  if (task) {
    task.stop()
    jobs.delete(agentId)
  }
}

export function scheduleAgent(win: BrowserWindow, agent: Agent) {
  unscheduleAgent(agent.id)
  if (!agent.cronSchedule || !validate(agent.cronSchedule)) return

  const task = schedule(agent.cronSchedule, async () => {
    addLog(win, agent.id, 'info', `Scheduled run triggered (${agent.cronSchedule})`)
    try {
      await runAgentById(win, agent.id)
    } catch (err) {
      addLog(win, agent.id, 'error', `Scheduled run failed to start: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, { noOverlap: true })

  jobs.set(agent.id, task)
}

export function initScheduler(win: BrowserWindow) {
  const agents = getDb().prepare("SELECT * FROM agents WHERE cronSchedule != ''").all() as Agent[]
  for (const agent of agents) scheduleAgent(win, agent)
}
