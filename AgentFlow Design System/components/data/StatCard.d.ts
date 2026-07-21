import React from 'react';

/**
 * Metric card — mono label over a big Syne value, optional usage bar and sub-line.
 */
export interface StatCardProps {
  /** Uppercase mono caption. */
  label: string;
  /** The headline figure. */
  value: React.ReactNode;
  /** Mono sub-line under the value (e.g. "of 50,000"). */
  sub?: React.ReactNode;
  /** Value + bar color. @default text primary */
  accent?: string;
  /** 0–100 — renders a thin glowing usage bar. */
  bar?: number;
  style?: React.CSSProperties;
}

export function StatCard(props: StatCardProps): JSX.Element;
