import * as pty from 'node-pty'
import PQueue from 'p-queue'
import { Agent, TaskRun, RunCallbacks } from './ipc/types'

const queue = new PQueue({ concurrency: 3 })
const processes = new Map<string, pty.IPty>()

export function runAgent(agent: Agent, _run: TaskRun, callbacks: RunCallbacks): Promise<void> {
  return queue.add(() => new Promise<void>((resolve, reject) => {
    const shell = process.platform === 'win32' ? 'cmd.exe' : 'bash'
    const args = process.platform === 'win32' ? ['/c', agent.command] : ['-c', agent.command]

    let proc: pty.IPty
    try {
      proc = pty.spawn(shell, args, {
        name: 'xterm-color',
        cwd: agent.workingDir || process.cwd(),
        env: process.env as Record<string, string>,
      })
    } catch (err) {
      reject(err)
      return
    }

    processes.set(agent.id, proc)

    proc.onData((data) => callbacks.onOutput(data))

    proc.onExit(({ exitCode }) => {
      processes.delete(agent.id)
      callbacks.onDone(exitCode ?? 0)
      resolve()
    })
  })) as Promise<void>
}

export function killAgent(agentId: string) {
  const proc = processes.get(agentId)
  if (proc) {
    proc.kill()
    processes.delete(agentId)
  }
}
