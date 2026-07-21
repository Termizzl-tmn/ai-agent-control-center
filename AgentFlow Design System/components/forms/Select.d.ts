import React from 'react';

export interface SelectOption { value: string; label: string; }

/**
 * Styled native select with mono label and chevron.
 */
export interface SelectProps {
  label?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  /** Strings or {value,label} objects. */
  options?: Array<string | SelectOption>;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function Select(props: SelectProps): JSX.Element;
