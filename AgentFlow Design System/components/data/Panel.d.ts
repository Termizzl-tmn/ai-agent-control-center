import React from 'react';

/**
 * Surface container with an optional mono title bar, right-aligned meta slot,
 * accent top-border and CRT scanline texture. The base block for all screens.
 */
export interface PanelProps {
  /** Uppercase mono title in the header bar. Omit for a bare panel. */
  title?: string;
  /** Right-aligned header content (counts, timestamps). */
  meta?: React.ReactNode;
  children?: React.ReactNode;
  /** Overlay CRT scanlines on the body. @default false */
  scanlines?: boolean;
  /** Body padding in px. @default 16 */
  padding?: number;
  /** Colored 2px top border (e.g. a role color). */
  accent?: string;
  style?: React.CSSProperties;
  bodyStyle?: React.CSSProperties;
}

export function Panel(props: PanelProps): JSX.Element;
