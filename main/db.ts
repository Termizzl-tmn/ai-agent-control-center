import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { randomUUID } from 'crypto'
import type { AgentRole, AgentMode } from './ipc/types'

let db: Database.Database

export function getDb(): Database.Database {
  if (!db) {
    const dbPath = path.join(app.getPath('userData'), 'agentflow.db')
    db = new Database(dbPath)
    db.pragma('journal_mode = WAL')
    migrate(db)
    seedDefaultAgents(db)
  }
  return db
}

function migrate(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS agents (
      id          TEXT PRIMARY KEY,
      name        TEXT NOT NULL,
      role        TEXT NOT NULL DEFAULT 'code',
      description TEXT NOT NULL DEFAULT '',
      command     TEXT NOT NULL DEFAULT '',
      workingDir  TEXT NOT NULL DEFAULT '',
      mode        TEXT NOT NULL DEFAULT 'pty',
      status      TEXT NOT NULL DEFAULT 'idle',
      cronSchedule TEXT NOT NULL DEFAULT '',
      watchPath   TEXT NOT NULL DEFAULT '',
      githubRepo  TEXT NOT NULL DEFAULT '',
      createdAt   INTEGER NOT NULL,
      updatedAt   INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS task_runs (
      id           TEXT PRIMARY KEY,
      agentId      TEXT NOT NULL,
      startedAt    INTEGER NOT NULL,
      finishedAt   INTEGER,
      exitCode     INTEGER,
      output       TEXT,
      inputTokens  INTEGER NOT NULL DEFAULT 0,
      outputTokens INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (agentId) REFERENCES agents(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS logs (
      id        TEXT PRIMARY KEY,
      agentId   TEXT NOT NULL,
      level     TEXT NOT NULL DEFAULT 'info',
      message   TEXT NOT NULL,
      timestamp INTEGER NOT NULL,
      FOREIGN KEY (agentId) REFERENCES agents(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS pipeline_templates (
      id        TEXT PRIMARY KEY,
      name      TEXT NOT NULL,
      nodes     TEXT NOT NULL,
      edges     TEXT NOT NULL,
      createdAt INTEGER NOT NULL,
      updatedAt INTEGER NOT NULL
    );
  `)

  // Add columns to existing tables if upgrading from older schema
  const cols = db.prepare("PRAGMA table_info(agents)").all() as { name: string }[]
  const colNames = cols.map(c => c.name)
  if (!colNames.includes('role'))        db.exec("ALTER TABLE agents ADD COLUMN role TEXT NOT NULL DEFAULT 'code'")
  if (!colNames.includes('description')) db.exec("ALTER TABLE agents ADD COLUMN description TEXT NOT NULL DEFAULT ''")
  if (!colNames.includes('mode'))        db.exec("ALTER TABLE agents ADD COLUMN mode TEXT NOT NULL DEFAULT 'pty'")
  if (!colNames.includes('cronSchedule')) db.exec("ALTER TABLE agents ADD COLUMN cronSchedule TEXT NOT NULL DEFAULT ''")
  if (!colNames.includes('watchPath'))    db.exec("ALTER TABLE agents ADD COLUMN watchPath TEXT NOT NULL DEFAULT ''")
  if (!colNames.includes('githubRepo'))   db.exec("ALTER TABLE agents ADD COLUMN githubRepo TEXT NOT NULL DEFAULT ''")
  upgradeSeededAgents(db)

  const runCols = db.prepare("PRAGMA table_info(task_runs)").all() as { name: string }[]
  const runColNames = runCols.map(c => c.name)
  if (!runColNames.includes('inputTokens'))  db.exec("ALTER TABLE task_runs ADD COLUMN inputTokens INTEGER NOT NULL DEFAULT 0")
  if (!runColNames.includes('outputTokens')) db.exec("ALTER TABLE task_runs ADD COLUMN outputTokens INTEGER NOT NULL DEFAULT 0")
}

interface DefaultAgent {
  name: string
  role: AgentRole
  description: string
  mode: AgentMode
  command: string
}

const DEFAULT_AGENTS: DefaultAgent[] = [
  {
    role: 'backlog', name: 'Backlog Agent', mode: 'claude',
    description: 'Writes user stories, acceptance criteria, and grooms the backlog.',
    command: 'You are a Backlog Agent for a software development team. Write clear user stories with acceptance criteria in Gherkin format. Groom and prioritise the backlog. Output structured Markdown.',
  },
  {
    role: 'planning', name: 'Planning Agent', mode: 'claude',
    description: 'Plans sprints, milestones, and detects task dependencies.',
    command: 'You are a Planning Agent for a software development team. Plan sprints, define milestones, identify task dependencies, and produce capacity estimates. Output structured Markdown.',
  },
  {
    role: 'architect', name: 'Architect Agent', mode: 'claude',
    description: 'Reviews system design, drafts ADRs, and flags tech debt.',
    command: 'You are an Architect Agent for a software development team. Review system designs, draft Architecture Decision Records (ADRs), flag tech debt, and recommend scalable patterns. Output structured Markdown.',
  },
  {
    role: 'code', name: 'Code Agent', mode: 'claude',
    description: 'Generates code, summarises PRs, and assists with refactoring.',
    command: 'You are a Code Agent for a software development team. Generate high-quality TypeScript/JavaScript code, summarise pull requests, assist with refactoring, and provide implementation guidance. Use code blocks in your output.',
  },
  {
    role: 'test', name: 'Test Agent', mode: 'claude',
    description: 'Generates test cases, Playwright scripts, and coverage reports.',
    command: 'You are a Test Agent for a software development team. Generate comprehensive test cases, write Playwright E2E scripts, identify coverage gaps, and produce test plans. Output structured Markdown with code blocks.',
  },
  {
    role: 'pipeline', name: 'Pipeline Agent', mode: 'claude',
    description: 'Monitors CI/CD status, deploy health, and watches logs.',
    command: 'You are a Pipeline Agent for a software development team. Analyse CI/CD pipelines, review deployment health, watch logs for anomalies, and report status. Output structured Markdown.',
  },
  {
    role: 'alert', name: 'Alert Agent', mode: 'claude',
    description: 'Dispatches Slack/LINE/email notifications on configurable triggers.',
    command: 'You are an Alert Agent for a software development team. Compose concise, actionable notifications for critical events, failures, and milestones. Format messages suitable for Slack, LINE, or email.',
  },
]

// Upgrade old seed agents (command='', mode='pty') to claude mode with system prompts
function upgradeSeededAgents(db: Database.Database) {
  const byRole = Object.fromEntries(DEFAULT_AGENTS.map(a => [a.role, a]))
  const stale = db.prepare("SELECT * FROM agents WHERE command = '' AND mode = 'pty'").all() as Array<{ id: string; role: string }>
  const update = db.prepare("UPDATE agents SET mode = ?, command = ?, description = ?, updatedAt = ? WHERE id = ?")
  const now = Date.now()
  for (const row of stale) {
    const def = byRole[row.role]
    if (def) update.run(def.mode, def.command, def.description, now, row.id)
  }
}

function seedDefaultAgents(db: Database.Database) {
  const count = (db.prepare('SELECT COUNT(*) as c FROM agents').get() as { c: number }).c
  if (count > 0) return

  const insert = db.prepare(
    'INSERT INTO agents (id, name, role, description, command, workingDir, mode, status, createdAt, updatedAt) VALUES (?,?,?,?,?,?,?,?,?,?)'
  )
  const now = Date.now()
  for (const a of DEFAULT_AGENTS) {
    insert.run(randomUUID(), a.name, a.role, a.description, a.command, '', a.mode, 'idle', now, now)
  }
}
