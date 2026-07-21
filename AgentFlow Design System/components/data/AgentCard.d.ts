import React from 'react';

export type AgentRole = 'po' | 'pm' | 'techlead' | 'dev' | 'qa' | 'devops' | 'notifier';
export type AgentCardStatus = 'running' | 'waiting' | 'idle' | 'done' | 'success' | 'error';

/**
 * The dashboard's primary unit — a role-tinted agent card with id, name,
 * status badge, glowing progress bar and task count. Composes StatusBadge + ProgressBar.
 * @startingPoint section="Data" subtitle="Agent card — role-tinted, with status & progress" viewport="340x180"
 */
export interface AgentCardProps {
  /** Mono id shown top-left, e.g. "AGT-014". */
  agentId?: string;
  name?: string;
  /** Role drives the accent color + icon. @default "dev" */
  role?: AgentRole;
  description?: string;
  /** @default "idle" */
  status?: AgentCardStatus;
  /** 0–100. */
  progress?: number;
  tasksDone?: number;
  tasksTotal?: number;
  /** Selected = elevated bg + role glow ring. */
  selected?: boolean;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
}

export function AgentCard(props: AgentCardProps): JSX.Element;
