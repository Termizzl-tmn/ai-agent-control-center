import { useEffect } from 'react'
import type { AppProps } from 'next/app'
import '../styles/globals.css'
import { ipc } from '../lib/ipc'
import { useAgentStore } from '../store/agentStore'

export default function App({ Component, pageProps }: AppProps) {
  useEffect(() => {
    void ipc?.listMetrics().then((m) => useAgentStore.getState().setMetrics(m))

    const offOutput = ipc?.onTaskOutput(({ agentId, chunk }) =>
      useAgentStore.getState().appendOutput(agentId, chunk)
    )
    const offDone = ipc?.onTaskDone(({ agentId, exitCode }) => {
      useAgentStore.getState().updateAgentStatus(agentId, exitCode === 0 ? 'success' : 'error')
      void ipc?.listMetrics().then((m) => useAgentStore.getState().setMetrics(m))
    })
    const offLog = ipc?.onLogEntry((entry) =>
      useAgentStore.getState().addLog(entry)
    )
    return () => { offOutput?.(); offDone?.(); offLog?.() }
  }, [])

  return <Component {...pageProps} />
}
