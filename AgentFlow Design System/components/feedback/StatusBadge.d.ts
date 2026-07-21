import React from 'react';

export type AgentStatus = 'running' | 'waiting' | 'idle' | 'done' | 'error' | 'success';

/**
 * Pill badge with a status dot — the canonical agent-status indicator.
 * Dot pulses when running. `success` is an alias of `done`.
 * @startingPoint section="Feedback" subtitle="Agent status badges, all states" viewport="700x110"
 */
export interface StatusBadgeProps {
  /** @default "idle" */
  status?: AgentStatus;
  /** @default "md" */
  size?: 'sm' | 'md' | 'lg';
  /** Override the default status text. */
  label?: string;
  style?: React.CSSProperties;
}

export function StatusBadge(props: StatusBadgeProps): JSX.Element;
