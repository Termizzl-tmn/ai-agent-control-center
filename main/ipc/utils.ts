import { BrowserWindow } from 'electron'
import { randomUUID } from 'crypto'
import { IPC, LogEntry } from './types'
import { getDb } from '../db'

export function sendToRenderer(win: BrowserWindow, channel: string, payload: unknown) {
  if (!win.isDestroyed()) win.webContents.send(channel, payload)
}

export function addLog(win: BrowserWindow, agentId: string, level: LogEntry['level'], message: string) {
  const entry: LogEntry = { id: randomUUID(), agentId, level, message, timestamp: Date.now() }
  getDb().prepare(
    'INSERT INTO logs (id, agentId, level, message, timestamp) VALUES (?,?,?,?,?)'
  ).run(entry.id, entry.agentId, entry.level, entry.message, entry.timestamp)
  sendToRenderer(win, IPC.LOG_ENTRY, entry)
}
