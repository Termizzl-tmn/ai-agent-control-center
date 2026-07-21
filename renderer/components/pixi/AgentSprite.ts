import { Container, Graphics, Text, Assets, AnimatedSprite, TextureSource } from 'pixi.js'
import type { AgentRole, AgentStatus } from '../../../main/ipc/types'
import { ROLE_COLOR, TILE, SCALE, STATE_COLOR } from './sceneConfig'

type SpriteState = 'idle' | 'walk' | 'action' | 'error' | 'done'

const STATUS_TO_STATE: Record<AgentStatus, SpriteState> = {
  idle:    'idle',
  running: 'action',
  success: 'done',
  error:   'error',
}

// Walk animation: oscillate position ±2px on x
const WALK_OFFSETS = [0, 1, 0, -1]

export class AgentSprite extends Container {
  private body: Graphics
  private bubble: Graphics
  private bubbleLabel: Text
  private anim?: AnimatedSprite
  private role: AgentRole
  private state: SpriteState = 'idle'
  private tick = 0
  private walkPhase = 0
  private errorFlash = 0

  constructor(role: AgentRole) {
    super()
    this.role = role

    this.body = this.buildBody()
    this.addChild(this.body)

    // Status bubble (above head)
    this.bubble = new Graphics()
    this.bubbleLabel = new Text({ text: '', style: { fontSize: 7, fill: 0xffffff, fontFamily: 'monospace' } })
    this.bubbleLabel.anchor.set(0.5, 0.5)
    this.bubble.addChild(this.bubbleLabel)
    this.bubble.y = -(TILE * SCALE) - 4
    this.addChild(this.bubble)
    this.updateBubble()

    // Try to load real spritesheet if available
    this.tryLoadSheet()
  }

  private buildBody(): Graphics {
    const color = ROLE_COLOR[this.role]
    const s = SCALE  // 3
    const g = new Graphics()

    // Shadow
    g.ellipse(8 * s, 22 * s, 6 * s, 2 * s).fill({ color: 0x000000, alpha: 0.3 })

    // Legs
    g.rect(4 * s, 16 * s, 3 * s, 5 * s).fill(0x1A1A2E)
    g.rect(9 * s, 16 * s, 3 * s, 5 * s).fill(0x1A1A2E)

    // Body / shirt
    g.rect(3 * s, 7 * s, 10 * s, 9 * s).fill(color)

    // Head (skin)
    g.rect(4 * s, 1 * s, 8 * s, 6 * s).fill(0xFFD5A0)

    // Eyes (2 dark pixels)
    g.rect(5 * s, 3 * s, 1 * s, 1 * s).fill(0x1A1A2E)
    g.rect(10 * s, 3 * s, 1 * s, 1 * s).fill(0x1A1A2E)

    // Outline: dark navy border
    g.rect(3 * s, 0,      10 * s, 1 * s).fill(0x1A1A2E)
    g.rect(3 * s, 7 * s,  10 * s, 1 * s).fill(0x1A1A2E)
    g.rect(3 * s, 16 * s, 10 * s, 1 * s).fill(0x1A1A2E)
    g.rect(2 * s, 1 * s,  1 * s,  20 * s).fill(0x1A1A2E)
    g.rect(13 * s, 1 * s, 1 * s,  20 * s).fill(0x1A1A2E)

    g.pivot.set(8 * s, 16 * s)  // pivot at feet center
    return g
  }

  private async tryLoadSheet() {
    const key = `assets/sprites/agents/${this.role}-agent.json`
    try {
      const sheet = await Assets.load(key)
      if (sheet?.animations) {
        this.useSheet(sheet)
      }
    } catch {
      // No sprite sheet yet — use placeholder graphics
    }
  }

  private useSheet(sheet: any) {
    if (this.anim) this.anim.destroy()
    this.removeChild(this.body)

    this.anim = new AnimatedSprite(sheet.animations[`${this.role}_idle`])
    this.anim.animationSpeed = 0.07
    this.anim.scale.set(SCALE)
    this.anim.anchor.set(0.5, 1)
    this.anim.play()
    this.addChildAt(this.anim, 0)

    this.applySheetState()
  }

  private applySheetState() {
    if (!this.anim) return
    const key = `${this.role}_${this.state}`
    if (!this.anim.textures) return

    switch (this.state) {
      case 'idle':
        this.anim.animationSpeed = 0.07
        this.anim.loop = true
        this.anim.play()
        break
      case 'walk':
        this.anim.animationSpeed = 0.13
        this.anim.loop = true
        this.anim.play()
        break
      case 'action':
        this.anim.animationSpeed = 0.10
        this.anim.loop = true
        this.anim.play()
        break
      case 'error':
        this.anim.animationSpeed = 0.20
        this.anim.loop = false
        this.anim.gotoAndPlay(0)
        this.anim.onComplete = () => this.setState('idle')
        break
      case 'done':
        this.anim.animationSpeed = 0.10
        this.anim.loop = false
        this.anim.gotoAndPlay(0)
        this.anim.onComplete = () => this.setState('idle')
        break
    }
  }

  setState(status: AgentStatus) {
    const next = STATUS_TO_STATE[status]
    if (this.state === next) return
    this.state = next
    this.tick = 0
    this.errorFlash = 0

    if (this.anim) {
      this.applySheetState()
    }

    this.updateBubble()
  }

  // Called every ticker frame — drives placeholder animation
  update(delta: number) {
    this.tick += delta

    if (this.anim) return  // real sprites self-animate

    switch (this.state) {
      case 'idle':
        // Subtle breathing: scale y oscillates ±0.5px
        this.body.scale.y = 1 + Math.sin(this.tick * 0.05) * 0.01
        break

      case 'walk':
        this.walkPhase = Math.floor(this.tick / 8) % 4
        this.body.x = WALK_OFFSETS[this.walkPhase] * SCALE
        break

      case 'action':
        // Bounce up/down while working
        this.body.y = -Math.abs(Math.sin(this.tick * 0.1)) * 2
        break

      case 'error':
        // Red flash: alternate body tint
        this.errorFlash++
        this.body.tint = this.errorFlash % 6 < 3 ? 0xFF4D6D : 0xFFFFFF
        if (this.errorFlash > 30) {
          this.body.tint = 0xFFFFFF
          this.state = 'idle'
          this.updateBubble()
        }
        break

      case 'done':
        // Jump once
        if (this.tick < 20) {
          this.body.y = -Math.sin((this.tick / 20) * Math.PI) * 8
        } else {
          this.body.y = 0
          this.state = 'idle'
          this.updateBubble()
        }
        break
    }
  }

  private updateBubble() {
    this.bubble.clear()

    const icons: Record<SpriteState, string> = {
      idle:   '',
      walk:   '',
      action: '...',
      error:  '!',
      done:   '✓',
    }
    const icon = icons[this.state]
    if (!icon) {
      this.bubble.visible = false
      return
    }

    this.bubble.visible = true
    const w = 20, h = 12
    this.bubble.roundRect(-w / 2, -h / 2, w, h, 2).fill({ color: 0x0D1120, alpha: 0.9 })
    this.bubble.roundRect(-w / 2, -h / 2, w, h, 2).stroke({ color: STATE_COLOR[this.state] ?? 0x4A5068, width: 1 })

    this.bubbleLabel.text = icon
    this.bubbleLabel.style.fill = STATE_COLOR[this.state] ?? 0x94A3B8
  }
}
