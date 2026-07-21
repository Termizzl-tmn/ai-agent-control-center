import React from 'react';

export type ButtonVariant = 'primary' | 'brand' | 'secondary' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * AgentFlow primary button. Sharp corners, uppercase DM Mono label, neon fills.
 * @startingPoint section="Forms" subtitle="Buttons in every variant" viewport="700x120"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** Visual style. @default "secondary" */
  variant?: ButtonVariant;
  /** @default "md" */
  size?: ButtonSize;
  /** Leading icon node (glyph, svg, img). */
  icon?: React.ReactNode;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

export function Button(props: ButtonProps): JSX.Element;
