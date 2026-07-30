import { BrowserWindow } from 'electron'
import { randomUUID } from 'crypto'
import { IPC, Agent, TaskRun, RunCallbacks, toErrorMessage, exitCodeToStatus } from './ipc/types'
import { getDb } from './db'
import { runAgent, killAgent } from './executor'
import { runClaudeAgent, killClaudeAgent } from './claudeExecutor'
import { sendToRenderer, addLog } from './ipc/utils'
import { settingsStore } from './settingsStore'
import { dispatchAlert } from './alertDispatcher'

export async function runAgentById(win: BrowserWindow, agentId: string, contextMessage?: string): Promise<TaskRun | null> {
  const agent = getDb().prepare('SELECT * FROM agents WHERE id = ?').get(agentId) as Agent | undefined
  if (!agent) throw new Error(`Agent ${agentId} not found`)

  if (agent.status === 'running') {
    addLog(win, agentId, 'warn', 'Run skipped — agent is already running')
    return null
  }

  const run: TaskRun = { id: randomUUID(), agentId, startedAt: Date.now(), output: '', inputTokens: 0, outputTokens: 0 }
  getDb().prepare(
    'INSERT INTO task_runs (id, agentId, startedAt, output, inputTokens, outputTokens) VALUES (?,?,?,?,?,?)'
  ).run(run.id, run.agentId, run.startedAt, run.output, run.inputTokens, run.outputTokens)

  getDb().prepare('UPDATE agents SET status = ?, updatedAt = ? WHERE id = ?')
    .run('running', Date.now(), agentId)

  addLog(win, agentId, 'info', `Agent started (${agent.mode} mode)`)

  const callbacks: RunCallbacks = {
    onOutput: (chunk: string) => {
      run.output += chunk
      sendToRenderer(win, IPC.TASK_OUTPUT, { runId: run.id, agentId, chunk })
    },
    onDone: (exitCode: number, usage) => {
      run.finishedAt = Date.now()
      run.exitCode = exitCode
      if (usage) {
        run.inputTokens = usage.inputTokens
        run.outputTokens = usage.outputTokens
      }
      getDb().prepare(
        'UPDATE task_runs SET finishedAt = ?, exitCode = ?, output = ?, inputTokens = ?, outputTokens = ? WHERE id = ?'
      ).run(run.finishedAt, exitCode, run.output, run.inputTokens, run.outputTokens, run.id)
      getDb().prepare('UPDATE agents SET status = ?, updatedAt = ? WHERE id = ?')
        .run(exitCodeToStatus(exitCode), Date.now(), agentId)
      addLog(win, agentId, exitCode === 0 ? 'info' : 'error', `Agent finished (exit ${exitCode})`)
      sendToRenderer(win, IPC.TASK_DONE, { runId: run.id, agentId, exitCode })

      if (agent.role === 'alert' && exitCode === 0 && run.output.trim()) {
        void dispatchAlert(run.output).then((result) => {
          const sent = [
            result.slack === 'sent' ? 'Slack' : null,
            result.line === 'sent' ? 'LINE' : null,
          ].filter(Boolean)

          if (sent.length > 0) addLog(win, agentId, 'info', `Alert dispatched — ${sent.join(', ')}`)
          if (result.errors.length > 0) addLog(win, agentId, 'error', `Alert dispatch failed — ${result.errors.join(' | ')}`)
          if (result.slack === 'skipped' && result.line === 'skipped') {
            addLog(win, agentId, 'warn', 'Alert Agent finished but no Slack/LINE channel is configured in Settings')
          }
        })
      }
    },
  }

  const handleUnexpectedError = (err: unknown) => {
    callbacks.onOutput(`\n[AgentFlow Error] ${toErrorMessage(err)}\n`)
    callbacks.onDone(1)
  }

  if (agent.mode === 'claude') {
    const { anthropicApiKey: apiKey, model } = settingsStore.store
    runClaudeAgent(agent, run, apiKey, model, callbacks, contextMessage).catch(handleUnexpectedError)
  } else {
    runAgent(agent, run, callbacks, contextMessage).catch(handleUnexpectedError)
  }

  return run
}

export function killAgentById(agentId: string, mode: Agent['mode']) {
  if (mode === 'claude') killClaudeAgent(agentId)
  else killAgent(agentId)
}
