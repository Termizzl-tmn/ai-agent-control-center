import type { BrowserWindow } from 'electron'
import { getDb } from './db'
import type { Agent } from './ipc/types'
import { addLog } from './ipc/utils'
import { runAgentById } from './taskRunner'
import { settingsStore } from './settingsStore'

const POLL_INTERVAL_MS = 120_000
const REPO_PATTERN = /^[\w.-]+\/[\w.-]+$/

interface PullRequest {
  number: number
  title: string
  body: string | null
  html_url: string
  user: { login: string }
  head: { ref: string; sha: string }
  base: { ref: string }
}

const pollers = new Map<string, NodeJS.Timeout>()
const seenShas = new Map<string, Map<number, string>>()

function authHeaders(): Record<string, string> {
  const { githubToken } = settingsStore.store
  return githubToken ? { Authorization: `Bearer ${githubToken}` } : {}
}

export function isValidGithubRepoFormat(repo: string): boolean {
  return REPO_PATTERN.test(repo)
}

export async function isValidGithubRepo(repo: string): Promise<boolean> {
  if (!isValidGithubRepoFormat(repo)) return false
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: { Accept: 'application/vnd.github+json', ...authHeaders() },
    })
    return res.ok
  } catch {
    return false
  }
}

function buildContextMessage(repo: string, pr: PullRequest): string {
  const body = (pr.body ?? '').slice(0, 1500)
  return [
    `New/updated pull request in ${repo}: #${pr.number} — ${pr.title}`,
    `Author: ${pr.user.login}`,
    `Branch: ${pr.head.ref} → ${pr.base.ref}`,
    `URL: ${pr.html_url}`,
    '',
    'Description:',
    body || '(no description provided)',
    '',
    'Please review this pull request and provide your analysis.',
  ].join('\n')
}

async function checkForNewPRs(win: BrowserWindow, agent: Agent) {
  const repo = agent.githubRepo
  try {
    const res = await fetch(`https://api.github.com/repos/${repo}/pulls?state=open&per_page=30`, {
      headers: { Accept: 'application/vnd.github+json', ...authHeaders() },
    })
    if (!res.ok) {
      addLog(win, agent.id, 'error', `GitHub API returned ${res.status} for ${repo}`)
      return
    }

    const prs = (await res.json()) as PullRequest[]
    const isFirstPoll = !seenShas.has(agent.id)
    const previouslySeen = seenShas.get(agent.id) ?? new Map<number, string>()
    const nowSeen = new Map<number, string>()

    for (const pr of prs) {
      nowSeen.set(pr.number, pr.head.sha)
      if (isFirstPoll) continue

      if (previouslySeen.get(pr.number) !== pr.head.sha) {
        addLog(win, agent.id, 'info', `PR #${pr.number} changed in ${repo} — triggering run`)
        try {
          await runAgentById(win, agent.id, buildContextMessage(repo, pr))
        } catch (err) {
          addLog(win, agent.id, 'error', `GitHub-triggered run failed to start: ${err instanceof Error ? err.message : String(err)}`)
        }
      }
    }

    seenShas.set(agent.id, nowSeen)
  } catch (err) {
    addLog(win, agent.id, 'error', `GitHub poll failed for ${repo}: ${err instanceof Error ? err.message : String(err)}`)
  }
}

export function unpollAgentRepo(agentId: string) {
  const timer = pollers.get(agentId)
  if (timer) {
    clearInterval(timer)
    pollers.delete(agentId)
  }
  seenShas.delete(agentId)
}

export function pollAgentRepo(win: BrowserWindow, agent: Agent) {
  unpollAgentRepo(agent.id)
  if (!agent.githubRepo) return

  void checkForNewPRs(win, agent)
  const timer = setInterval(() => { void checkForNewPRs(win, agent) }, POLL_INTERVAL_MS)
  pollers.set(agent.id, timer)
}

export function initGithubTriggers(win: BrowserWindow) {
  const agents = getDb().prepare("SELECT * FROM agents WHERE githubRepo != ''").all() as Agent[]
  for (const agent of agents) pollAgentRepo(win, agent)
}
