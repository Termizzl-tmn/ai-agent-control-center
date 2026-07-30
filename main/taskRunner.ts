import { BrowserWindow } from 'electron'
import { randomUUID } from 'crypto'
import { IPC, Agent, TaskRun, toErrorMessage, exitCodeToStatus } from './ipc/types'
import { getDb } from './db'
import { runAgent, killAgent } from './executor'
import { runClaudeAgent, killClaudeAgent } from './claudeExecutor'
import { sendToRenderer, addLog } from './ipc/utils'
import { settingsStore } from './settingsStore'

export async function runAgentById(win: BrowserWindow, agentId: string): Promise<TaskRun | null> {
  const agent = getDb().prepare('SELECT * FROM agents WHERE id = ?').get(agentId) as Agent | undefined
  if (!agent) throw new Error(`Agent ${agentId} not found`)

  if (agent.status === 'running') {
    addLog(win, agentId, 'warn', 'Run skipped — agent is already running')
    return null
  }

  const run: TaskRun = { id: randomUUID(), agentId, startedAt: Date.now(), output: '' }
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
}

export function killAgentById(agentId: string, mode: Agent['mode']) {
  if (mode === 'claude') killClaudeAgent(agentId)
  else killAgent(agentId)
}
