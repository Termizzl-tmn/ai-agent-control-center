import React from 'react';

/**
 * Toggle switch — neon-green when on, glowing track. Controlled.
 */
export interface SwitchProps {
  checked?: boolean;
  /** Receives the next boolean. */
  onChange?: (checked: boolean) => void;
  /** Optional trailing label. */
  label?: string;
  /** On-state color. @default neon green */
  accent?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function Switch(props: SwitchProps): JSX.Element;
