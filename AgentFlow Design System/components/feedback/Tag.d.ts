import React from 'react';

/**
 * Small square chip for labels, levels, severities. Sharp corners (pixel feel).
 */
export interface TagProps {
  children?: React.ReactNode;
  /** @default "neutral" */
  tone?: 'neutral' | 'brand' | 'running' | 'waiting' | 'done' | 'error';
  /** Shortcut: HIGH→error, MED→waiting, LOW→done. Overrides tone + children. */
  severity?: 'HIGH' | 'MED' | 'LOW';
  style?: React.CSSProperties;
}

export function Tag(props: TagProps): JSX.Element;
