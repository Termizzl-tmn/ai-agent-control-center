import Anthropic from '@anthropic-ai/sdk'
import type { Agent, TaskRun, RunCallbacks } from './ipc/types'
import { toErrorMessage } from './ipc/types'

const activeStreams = new Map<string, AbortController>()

export async function runClaudeAgent(
  agent: Agent,
  _run: TaskRun,
  apiKey: string,
  model: string,
  callbacks: RunCallbacks,
) {
  if (!apiKey) {
    callbacks.onOutput('[AgentFlow] No Anthropic API key set. Go to Settings → API Key to configure.\n')
    callbacks.onDone(1)
    return
  }

  const controller = new AbortController()
  activeStreams.set(agent.id, controller)

  const client = new Anthropic({ apiKey })
  const systemPrompt = agent.command ||
    `You are the ${agent.name}. ${agent.description} Respond in Markdown.`

  try {
    const stream = client.messages.stream(
      {
        model,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: 'Please begin your task and show your work.' }],
      },
      { signal: controller.signal },
    )

    stream.on('text', (text) => callbacks.onOutput(text))

    await stream.finalMessage()

    activeStreams.delete(agent.id)
    callbacks.onDone(0)
  } catch (err: unknown) {
    activeStreams.delete(agent.id)
    if (err instanceof Error && err.name === 'AbortError') {
      callbacks.onOutput('\n[AgentFlow] Agent stopped by user.\n')
      callbacks.onDone(130)
    } else {
      callbacks.onOutput(`\n[AgentFlow Error] ${toErrorMessage(err)}\n`)
      callbacks.onDone(1)
    }
  }
}

export function killClaudeAgent(agentId: string) {
  const controller = activeStreams.get(agentId)
  if (controller) {
    controller.abort()
    activeStreams.delete(agentId)
  }
}
