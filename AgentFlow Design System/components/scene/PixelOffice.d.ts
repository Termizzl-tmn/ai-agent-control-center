import React from 'react';

export type AgentRole = 'po' | 'pm' | 'techlead' | 'dev' | 'qa' | 'devops' | 'notifier';
export type OfficeStatus = 'running' | 'waiting' | 'idle' | 'done' | 'success' | 'error';

export interface OfficeAgent {
  id: string;
  name: string;
  /** Drives shirt color + seat icon. */
  role: AgentRole;
  /** running→typing, waiting→"?" bubble, done→reading, idle→sitting, error→"!" bubble. */
  status: OfficeStatus;
}

/**
 * Animated pixel-art office. Each agent is a character that sits at a desk,
 * animates by status, and periodically gets up and walks the room. Canvas-
 * rendered original art in the AgentFlow palette. Click-selectable.
 * @startingPoint section="Scene" subtitle="Live animated pixel-art agent office" viewport="700x400"
 */
export interface PixelOfficeProps {
  /** Up to 7 agents, mapped to desks in order. */
  agents: OfficeAgent[];
  /** Canvas wrapper height in px. @default 360 */
  height?: number;
  /** Draw a neon selection ring on this agent. */
  selectedId?: string;
  /** Click a character → receives the agent object. Enables pointer cursor. */
  onSelectAgent?: (agent: OfficeAgent) => void;
  /** Run the game loop (walking + idle motion). @default true */
  animated?: boolean;
  style?: React.CSSProperties;
}

export function PixelOffice(props: PixelOfficeProps): JSX.Element;
