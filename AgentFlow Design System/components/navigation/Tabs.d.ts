import React from 'react';

export interface TabItem { id: string; label: string; }

/**
 * Tab strip — underline tabs for view switching, or bracketed filter chips.
 */
export interface TabsProps {
  /** Strings or {id,label}. */
  tabs?: Array<string | TabItem>;
  /** Active tab id. */
  value?: string;
  onChange?: (id: string) => void;
  /** "underline" (view tabs) or "filter" (bracketed chips). @default "underline" */
  variant?: 'underline' | 'filter';
  /** Active color. @default neon green */
  accent?: string;
  style?: React.CSSProperties;
}

export function Tabs(props: TabsProps): JSX.Element;
