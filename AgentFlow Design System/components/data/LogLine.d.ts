import React from 'react';

/**
 * One monospace activity-log row: time │ LEVEL │ [agent] message.
 * Severity colors the message + level tag; `current` adds a neon left border.
 */
export interface LogLineProps {
  /** Timestamp string, e.g. "09:41:02". */
  time?: string;
  /** @default "info" */
  level?: 'info' | 'warn' | 'error' | 'success';
  /** Optional agent name shown in [brackets]. */
  agent?: string;
  message?: React.ReactNode;
  /** Left gutter line number (zero-padded to 3). */
  lineNo?: number;
  /** Highlight as the latest/active entry. @default false */
  current?: boolean;
  style?: React.CSSProperties;
}

export function LogLine(props: LogLineProps): JSX.Element;
