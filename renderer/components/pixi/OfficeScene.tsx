import { useEffect, useRef } from 'react'
import { Application, Graphics, Text, TextureSource } from 'pixi.js'
import { AgentSprite } from './AgentSprite'
import { useAgentStore } from '../../store/agentStore'
import {
  SCENE_W, SCENE_H, TILE, SCALE, COLS, ROWS,
  ROLE_HOME, tileToPixel,
} from './sceneConfig'
import type { Agent } from '../../../main/ipc/types'

export function OfficeScene() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    let destroyed = false
    const sprites = new Map<string, AgentSprite>()

    function spawnSprite(app: Application, agent: Agent) {
      const home = ROLE_HOME[agent.role]
      if (!home || sprites.has(agent.id)) return

      const sprite = new AgentSprite(agent.role)
      const pos = tileToPixel(home.col, home.row)
      sprite.x = pos.x
      sprite.y = pos.y
      sprite.setState(agent.status)
      app.stage.addChild(sprite)
      sprites.set(agent.id, sprite)
    }

    async function init() {
      const app = new Application()
      await app.init({
        width: SCENE_W,
        height: SCENE_H,
        background: 0x060B16,
        antialias: false,
        autoDensity: true,
      })

      // PixiJS v8: set nearest-neighbor globally before any texture loads
      TextureSource.defaultOptions.scaleMode = 'nearest'

      if (destroyed) { app.destroy(true); return }

      containerRef.current!.appendChild(app.canvas as HTMLCanvasElement)

      buildFloor(app)
      buildDeskLabels(app)

      // Spawn sprites for already-loaded agents
      useAgentStore.getState().agents.forEach((a) => spawnSprite(app, a))

      // Subscribe to store changes
      const unsub = useAgentStore.subscribe((state, prev) => {
        state.agents.forEach((agent) => {
          if (!sprites.has(agent.id)) {
            spawnSprite(app, agent)
          } else {
            const prevAgent = prev.agents.find(a => a.id === agent.id)
            if (prevAgent?.status !== agent.status) {
              sprites.get(agent.id)!.setState(agent.status)
            }
          }
        })
      })

      // Drive placeholder animations
      app.ticker.add((ticker) => {
        sprites.forEach((sprite) => sprite.update(ticker.deltaTime))
      })

      return () => {
        unsub()
        sprites.clear()
        app.destroy(true)
      }
    }

    const cleanupPromise = init()

    return () => {
      destroyed = true
      cleanupPromise.then((cleanup) => cleanup?.())
    }
  }, [])

  return (
    <div className="flex flex-col h-full bg-[#060B16]">
      <div className="px-4 py-2 border-b border-border shrink-0 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Office Scene
        </h2>
        <span className="text-[10px] text-muted-foreground/50">
          placeholder sprites — drop PNG+JSON into assets/sprites/agents/ to upgrade
        </span>
      </div>
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">
        <div
          ref={containerRef}
          style={{ width: SCENE_W, height: SCENE_H, imageRendering: 'pixelated' }}
        />
      </div>
    </div>
  )
}

// ── scene builders ──────────────────────────────────────────────────────────

function buildFloor(app: Application) {
  const g = new Graphics()

  // Base fill
  g.rect(0, 0, SCENE_W, SCENE_H).fill(0x060B16)

  // Tile grid
  const ts = TILE * SCALE
  for (let c = 0; c <= COLS; c++) {
    g.moveTo(c * ts, 0).lineTo(c * ts, SCENE_H)
  }
  for (let r = 0; r <= ROWS; r++) {
    g.moveTo(0, r * ts).lineTo(SCENE_W, r * ts)
  }
  g.stroke({ color: 0x0D1120, width: 1 })

  // Zone highlights
  const zones = [
    { col: 0,  row: 0,  color: 0x059669 },  // architect
    { col: 8,  row: 0,  color: 0x00E5A0 },  // code
    { col: 15, row: 0,  color: 0xD97706 },  // test
    { col: 0,  row: 5,  color: 0x7C3AED },  // backlog
    { col: 8,  row: 5,  color: 0x0284C7 },  // planning
    { col: 15, row: 5,  color: 0xDC2626 },  // pipeline
    { col: 8,  row: 9,  color: 0x6B7280 },  // alert
  ]

  zones.forEach(({ col, row, color }) => {
    const x = col * ts
    const y = row * ts
    const w = 4 * ts
    const h = 3 * ts
    g.rect(x + 1, y + 1, w - 2, h - 2).fill({ color, alpha: 0.06 })
    g.rect(x, y, w, h).stroke({ color, width: 1, alpha: 0.25 })
  })

  app.stage.addChild(g)
}

function buildDeskLabels(app: Application) {
  const labels = [
    { name: 'Architect', col: 0,  row: 0,  color: 0x059669 },
    { name: 'Code',      col: 8,  row: 0,  color: 0x00E5A0 },
    { name: 'Test',      col: 15, row: 0,  color: 0xD97706 },
    { name: 'Backlog',   col: 0,  row: 5,  color: 0x7C3AED },
    { name: 'Planning',  col: 8,  row: 5,  color: 0x0284C7 },
    { name: 'Pipeline',  col: 15, row: 5,  color: 0xDC2626 },
    { name: 'Alert',     col: 8,  row: 9,  color: 0x6B7280 },
  ]

  const ts = TILE * SCALE
  labels.forEach(({ name, col, row, color }) => {
    const label = new Text({
      text: name.toUpperCase(),
      style: { fontSize: 7, fill: color, fontFamily: 'monospace', letterSpacing: 1 },
    })
    label.x = col * ts + 3
    label.y = row * ts + 3
    label.alpha = 0.5
    app.stage.addChild(label)
  })
}
