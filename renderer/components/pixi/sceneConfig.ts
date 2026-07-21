import type { AgentRole } from '../../../main/ipc/types'

// Native tile grid: 20 cols × 12 rows, each tile 16×16px, rendered at 3x (48×48)
export const TILE = 16
export const SCALE = 3
export const COLS = 20
export const ROWS = 12

export const SCENE_W = COLS * TILE * SCALE  // 960
export const SCENE_H = ROWS * TILE * SCALE  // 576

// Role colors (shirt color from DESIGN-PIXEL.md)
export const ROLE_COLOR: Record<AgentRole, number> = {
  backlog:   0x7C3AED,  // purple
  planning:  0x0284C7,  // blue
  architect: 0x059669,  // green
  code:      0x00E5A0,  // teal
  test:      0xD97706,  // amber
  pipeline:  0xDC2626,  // red
  alert:     0x6B7280,  // gray
}

// Desk/home position per role (tile coordinates)
// Layout: top row = architect/code/test, mid = backlog/planning/pipeline, bottom-center = alert
export const ROLE_HOME: Record<AgentRole, { col: number; row: number }> = {
  architect: { col: 2,  row: 1  },
  code:      { col: 10, row: 1  },
  test:      { col: 17, row: 1  },
  backlog:   { col: 2,  row: 6  },
  planning:  { col: 10, row: 6  },
  pipeline:  { col: 17, row: 6  },
  alert:     { col: 10, row: 10 },
}

// Convert tile coords → pixel coords (center of tile, rendered)
export function tileToPixel(col: number, row: number) {
  return {
    x: col * TILE * SCALE + (TILE * SCALE) / 2,
    y: row * TILE * SCALE + (TILE * SCALE) / 2,
  }
}

// Status color for status bubble
export const STATE_COLOR: Record<string, number> = {
  idle:    0x4A5068,
  running: 0x00E5A0,
  success: 0x4D9FFF,
  error:   0xFF4D6D,
}
