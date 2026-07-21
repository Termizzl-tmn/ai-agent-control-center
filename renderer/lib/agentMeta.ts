import type { AgentRole } from '../../main/ipc/types'

export const ROLE_META: Record<AgentRole, { label: string; icon: string; color: string }> = {
  backlog:   { label: 'Backlog Agent',   icon: '📋', color: 'blue'   },
  planning:  { label: 'Planning Agent',  icon: '📅', color: 'purple' },
  architect: { label: 'Architect Agent', icon: '🏗️',  color: 'indigo' },
  code:      { label: 'Code Agent',      icon: '💻', color: 'green'  },
  test:      { label: 'Test Agent',      icon: '🧪', color: 'yellow' },
  pipeline:  { label: 'Pipeline Agent',  icon: '⚙️',  color: 'orange' },
  alert:     { label: 'Alert Agent',     icon: '🔔', color: 'red'    },
}

export const ROLE_HEX: Record<AgentRole, string> = {
  backlog:   '#7C3AED',
  planning:  '#0284C7',
  architect: '#059669',
  code:      '#00E5A0',
  test:      '#D97706',
  pipeline:  '#DC2626',
  alert:     '#6B7280',
}

export const ROLE_BORDER: Record<AgentRole, string> = {
  backlog:   'border-blue-800 hover:border-blue-600',
  planning:  'border-purple-800 hover:border-purple-600',
  architect: 'border-indigo-800 hover:border-indigo-600',
  code:      'border-green-800 hover:border-green-600',
  test:      'border-yellow-800 hover:border-yellow-600',
  pipeline:  'border-orange-800 hover:border-orange-600',
  alert:     'border-red-800 hover:border-red-600',
}
