import { settingsStore } from './settingsStore'
import type { DispatchResult } from './ipc/types'

const LINE_MAX_CHARS = 5000

async function sendSlack(webhookUrl: string, text: string): Promise<void> {
  const res = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  })
  if (!res.ok) throw new Error(`Slack webhook returned ${res.status}`)
}

async function sendLine(channelAccessToken: string, targetId: string, text: string): Promise<void> {
  const res = await fetch('https://api.line.me/v2/bot/message/push', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${channelAccessToken}`,
    },
    body: JSON.stringify({
      to: targetId,
      messages: [{ type: 'text', text: text.slice(0, LINE_MAX_CHARS) }],
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`LINE API returned ${res.status}${body ? `: ${body}` : ''}`)
  }
}

export async function dispatchAlert(text: string): Promise<DispatchResult> {
  const { slackWebhookUrl, lineChannelAccessToken, lineTargetId } = settingsStore.store
  const result: DispatchResult = { slack: 'skipped', line: 'skipped', errors: [] }

  if (slackWebhookUrl) {
    try {
      await sendSlack(slackWebhookUrl, text)
      result.slack = 'sent'
    } catch (err) {
      result.slack = 'error'
      result.errors.push(`Slack: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  if (lineChannelAccessToken && lineTargetId) {
    try {
      await sendLine(lineChannelAccessToken, lineTargetId, text)
      result.line = 'sent'
    } catch (err) {
      result.line = 'error'
      result.errors.push(`LINE: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return result
}
