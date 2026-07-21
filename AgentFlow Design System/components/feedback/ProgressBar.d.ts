import React from 'react';

/**
 * Thin progress track that glows in its status color.
 */
export interface ProgressBarProps {
  /** 0–100. */
  value?: number;
  /** Fill + glow color. @default "running" */
  status?: 'running' | 'waiting' | 'done' | 'error' | 'brand' | 'idle';
  /** Track height in px. @default 4 */
  height?: number;
  /** Show a right-aligned mono percentage below. @default false */
  showLabel?: boolean;
  style?: React.CSSProperties;
}

export function ProgressBar(props: ProgressBarProps): JSX.Element;
