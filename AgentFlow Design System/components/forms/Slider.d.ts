import React from 'react';

/**
 * Range slider with neon-filled track, glowing thumb and a mono value readout.
 */
export interface SliderProps {
  label?: string;
  value?: number;
  /** @default 0 */
  min?: number;
  /** @default 100 */
  max?: number;
  /** @default 1 */
  step?: number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Format the readout, e.g. v => `${v.toLocaleString()} tokens`. */
  format?: (value: number) => React.ReactNode;
  /** Fill + thumb color. @default brand cyan */
  accent?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}

export function Slider(props: SliderProps): JSX.Element;
