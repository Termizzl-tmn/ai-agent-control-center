import React from 'react';

/**
 * Text/password input with optional mono label, trailing addon and hint.
 */
export interface InputProps {
  /** Uppercase mono label above the field. */
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  /** @default "text" */
  type?: string;
  /** Use DM Mono for the value (API keys, numbers). @default true */
  mono?: boolean;
  /** Trailing element rendered beside the field (e.g. a Button). */
  addon?: React.ReactNode;
  /** Helper text below the field. */
  hint?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function Input(props: InputProps): JSX.Element;
