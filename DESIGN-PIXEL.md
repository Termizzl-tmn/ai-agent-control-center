# DESIGN-PIXEL.md — AgentFlow Pixel Art Spec
> PixiJS v8 · Pixel Art Design System · v0.2.0

---

## 1. Grid & Scale

```
Native grid   : 16×16 px per sprite
Render scale  : 3x = 48×48 px  (dashboard agent cards)
              : 4x = 64×64 px  (selected / featured agent)
              : 2x = 32×32 px  (pipeline node, minimap)

CSS (ห้ามลืม — ใช้กับ <canvas> ที่ PixiJS render ลงไป):
  image-rendering: pixelated;
  image-rendering: crisp-edges; /* Firefox */
```

### PixiJS v8 Scale Setup

```ts
import { Application } from 'pixi.js'

const app = new Application()
await app.init({
  background: '#060B16',
  resizeTo: window,
  // PixiJS จะเลือก WebGPU หรือ WebGL ให้อัตโนมัติ
})

// render pixel art แบบ sharp — ห้ามใช้ bilinear
app.renderer.texture.defaultOptions.scaleMode = 'nearest'
```

---

## 2. Asset Pipeline (PixiJS v8 Way)

PixiJS v8 ใช้ **Assets + JSON atlas** เป็น pattern หลัก
ไม่แนะนำให้ใช้ raw `drawImage` แบบ Canvas 2D อีกต่อไป

### 2.1 Spritesheet JSON Format

สร้าง `dev-agent.json` คู่กับ `dev-agent.png`:

```json
{
  "frames": {
    "dev_idle_0": { "frame": { "x": 0,  "y": 0,  "w": 16, "h": 16 } },
    "dev_idle_1": { "frame": { "x": 16, "y": 0,  "w": 16, "h": 16 } },
    "dev_idle_2": { "frame": { "x": 32, "y": 0,  "w": 16, "h": 16 } },

    "dev_walk_0": { "frame": { "x": 64, "y": 0,  "w": 16, "h": 16 } },
    "dev_walk_1": { "frame": { "x": 80, "y": 0,  "w": 16, "h": 16 } },
    "dev_walk_2": { "frame": { "x": 96, "y": 0,  "w": 16, "h": 16 } },
    "dev_walk_3": { "frame": { "x": 112,"y": 0,  "w": 16, "h": 16 } },

    "dev_action_0": { "frame": { "x": 128,"y": 0, "w": 16, "h": 16 } },
    "dev_action_1": { "frame": { "x": 144,"y": 0, "w": 16, "h": 16 } },
    "dev_action_2": { "frame": { "x": 160,"y": 0, "w": 16, "h": 16 } },
    "dev_action_3": { "frame": { "x": 176,"y": 0, "w": 16, "h": 16 } },

    "dev_error_0": { "frame": { "x": 192,"y": 0, "w": 16, "h": 16 } },
    "dev_error_1": { "frame": { "x": 208,"y": 0, "w": 16, "h": 16 } },

    "dev_done_0": { "frame": { "x": 224,"y": 0, "w": 16, "h": 16 } },
    "dev_done_1": { "frame": { "x": 240,"y": 0, "w": 16, "h": 16 } },
    "dev_done_2": { "frame": { "x": 256,"y": 0, "w": 16, "h": 16 } }
  },
  "animations": {
    "dev_idle":   ["dev_idle_0",   "dev_idle_1",   "dev_idle_2"],
    "dev_walk":   ["dev_walk_0",   "dev_walk_1",   "dev_walk_2",   "dev_walk_3"],
    "dev_action": ["dev_action_0", "dev_action_1", "dev_action_2", "dev_action_3"],
    "dev_error":  ["dev_error_0",  "dev_error_1"],
    "dev_done":   ["dev_done_0",   "dev_done_1",   "dev_done_2"]
  },
  "meta": {
    "scale": "1",
    "size": { "w": 272, "h": 16 }
  }
}
```

### 2.2 Loading ด้วย Assets (v8 Pattern)

```ts
import { Assets, AnimatedSprite } from 'pixi.js'

// โหลด spritesheet — Assets จัดการ parse อัตโนมัติ
const sheet = await Assets.load('assets/sprites/agents/dev-agent.json')

// สร้าง AnimatedSprite จาก animations ที่ defined ใน JSON
const agent = new AnimatedSprite(sheet.animations['dev_idle'])
agent.animationSpeed = 0.1   // 4 FPS ที่ 60fps ticker
agent.scale.set(3)            // render 3x (48×48)
agent.play()

app.stage.addChild(agent)
```

### 2.3 Preload ทุก Agent ก่อนเข้า scene

```ts
// โหลดทั้งหมดพร้อมกัน
await Assets.load([
  'assets/sprites/agents/po-agent.json',
  'assets/sprites/agents/pm-agent.json',
  'assets/sprites/agents/techlead-agent.json',
  'assets/sprites/agents/dev-agent.json',
  'assets/sprites/agents/qa-agent.json',
  'assets/sprites/agents/devops-agent.json',
  'assets/sprites/agents/notifier-agent.json',
  'assets/sprites/tiles/office-tileset.json',
])
```

---

## 3. Animation States (5 States)

### 3.1 State Spec

| State | Key | Frames | animationSpeed | loop | Trigger |
|---|---|---|---|---|---|
| idle | `{role}_idle` | 3 | 0.07 | true | ไม่มีงาน |
| walk | `{role}_walk` | 4 | 0.13 | true | กำลังเดิน |
| action | `{role}_action` | 4 | 0.10 | true | execute task |
| error | `{role}_error` | 2 | 0.20 | false (3x) | API error |
| done | `{role}_done` | 3 | 0.10 | false (1x) | task complete |

### 3.2 AgentSprite Class (PixiJS v8)

```ts
import { AnimatedSprite, Assets, Container, Sprite, Texture } from 'pixi.js'

type AgentState = 'idle' | 'walk' | 'action' | 'error' | 'done'
type AgentRole = 'po' | 'pm' | 'techlead' | 'dev' | 'qa' | 'devops' | 'notifier'

export class AgentSprite extends Container {
  private anim: AnimatedSprite
  private role: AgentRole
  private currentState: AgentState = 'idle'
  private sheet: any

  constructor(role: AgentRole, sheet: any) {
    super()
    this.role = role
    this.sheet = sheet

    // สร้าง AnimatedSprite จาก idle state เริ่มต้น
    this.anim = new AnimatedSprite(sheet.animations[`${role}_idle`])
    this.anim.animationSpeed = 0.07
    this.anim.scale.set(3) // 3x = 48×48
    this.anim.anchor.set(0.5, 1) // pivot ที่ฐาน
    this.anim.play()

    this.addChild(this.anim)
  }

  setState(state: AgentState) {
    if (this.currentState === state) return
    this.currentState = state

    const key = `${this.role}_${state}`
    this.anim.textures = this.sheet.animations[key]

    switch (state) {
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
        // กลับ idle หลัง error flash จบ
        this.anim.onComplete = () => this.setState('idle')
        break

      case 'done':
        this.anim.animationSpeed = 0.10
        this.anim.loop = false
        this.anim.gotoAndPlay(0)
        // กลับ idle หลัง done animation จบ
        this.anim.onComplete = () => this.setState('idle')
        break
    }
  }

  getState() { return this.currentState }
}
```

### 3.3 เชื่อม IPC → AgentSprite State

```ts
// ใน renderer process — รับ agent status จาก Electron IPC
window.electronAPI.onAgentStatus((data: { id: string, status: string }) => {
  const sprite = agentSprites.get(data.id)
  if (!sprite) return

  // map agent status → sprite state
  const stateMap: Record<string, AgentState> = {
    running: 'action',
    waiting: 'idle',
    walking: 'walk',
    error:   'error',
    done:    'done',
    idle:    'idle',
  }

  sprite.setState(stateMap[data.status] ?? 'idle')
})
```

---

## 4. Office Scene Setup (PixiJS v8)

### 4.1 Scene Layout (RenderLayer)

PixiJS v8 มี RenderLayer — ใช้แยก layer ชัดเจน

```ts
import { Application, Container, RenderLayer } from 'pixi.js'

// Layers (วาดทับกันตาม order)
const floorLayer   = new RenderLayer()  // tile พื้น
const objectLayer  = new RenderLayer()  // โต๊ะ, ของ
const agentLayer   = new RenderLayer()  // agent sprites
const hudLayer     = new RenderLayer()  // status bubble, labels

app.stage.addChild(floorLayer, objectLayer, agentLayer, hudLayer)
```

### 4.2 Scene Dimensions

```
Tile size        : 16×16 px (native)
Scene            : 20 col × 12 row tiles
Native scene     : 320×192 px
Rendered (3x)    : 960×576 px

Camera           : PixiJS Container + pivot เพื่อ pan/zoom
```

### 4.3 Tile Rendering

```ts
import { Assets, Sprite, Container } from 'pixi.js'

async function buildFloor(app: Application) {
  const sheet = await Assets.load('assets/sprites/tiles/office-tileset.json')

  for (let row = 0; row < 12; row++) {
    for (let col = 0; col < 20; col++) {
      const tile = new Sprite(sheet.textures['floor_dark'])
      tile.scale.set(3)           // 3x scale
      tile.x = col * 16 * 3      // 48px per tile (rendered)
      tile.y = row * 16 * 3
      floorLayer.attach(tile)
      app.stage.addChild(tile)
    }
  }
}
```

---

## 5. Status Bubble (HUD)

```ts
import { Container, Graphics, Text } from 'pixi.js'

const BUBBLE_ICONS: Record<AgentState, string> = {
  idle:   '',
  walk:   '',
  action: '...',
  error:  '!',
  done:   '✓',
}

const BUBBLE_COLORS: Record<AgentState, number> = {
  idle:   0x000000,
  walk:   0x000000,
  action: 0x94A3B8,
  error:  0xFF4D6D,
  done:   0x00E5A0,
}

export function createStatusBubble(state: AgentState): Container {
  const container = new Container()
  if (state === 'idle' || state === 'walk') return container

  const bg = new Graphics()
  bg.roundRect(0, 0, 16, 10, 2)
  bg.fill({ color: 0xFFFFFF, alpha: 0.9 })

  const label = new Text({
    text: BUBBLE_ICONS[state],
    style: {
      fontSize: 6,
      fill: BUBBLE_COLORS[state],
      fontFamily: 'DM Mono',
    }
  })
  label.x = 4
  label.y = 1

  container.addChild(bg, label)
  container.x = -8  // กึ่งกลาง sprite 16px
  container.y = -22 // ลอยเหนือหัว
  return container
}
```

---

## 6. Agent Role Visual Spec

| Role | Shirt | Prop | Desk Object | Desk Color |
|---|---|---|---|---|
| PO | `#7C3AED` purple | clipboard 3×4px | sticky notes stack | `#F5F0E0` |
| PM | `#0284C7` blue | tablet 4×3px | gantt chart 8×4px | `#EFF6FF` |
| Tech Lead | `#059669` green | blueprint roll 2×6px | whiteboard 8×6px | `#F0FDF4` |
| Developer | `#00E5A0` teal | laptop 6×4px | dual monitors 8×5px | `#0D1120` |
| QA | `#D97706` amber | magnifier 4×4px | bug report 6×4px | `#FFFBEB` |
| DevOps | `#DC2626` red | wrench 2×6px | server rack 6×8px | `#1A1A2E` |
| Notifier | `#6B7280` gray | megaphone 4×3px | bell 4×4px | `#F9FAFB` |

---

## 7. Performance Notes (PixiJS v8)

- ใช้ **Spritesheet atlas** รวม frames ทุก agent ไว้ใน texture เดียว — ลด draw calls
- ตั้ง `app.renderer.texture.defaultOptions.scaleMode = 'nearest'` ก่อน load asset
- ใช้ **RenderLayer** แยก floor / object / agent / HUD — PixiJS จัดการ GPU batch เอง
- **destroy agent sprite** เมื่อลบออกจาก scene: `sprite.destroy()` — อย่าปล่อยทิ้ง
- ถ้า agent ไม่อยู่ใน viewport ให้ `agent.visible = false` ไม่ใช่ remove จาก stage

---

## 8. File Structure

```
assets/sprites/
├── agents/
│   ├── po-agent.png          ← spritesheet แนวนอน (native 16px height)
│   ├── po-agent.json         ← atlas JSON (frames + animations)
│   ├── pm-agent.png / .json
│   ├── techlead-agent.png / .json
│   ├── dev-agent.png / .json
│   ├── qa-agent.png / .json
│   ├── devops-agent.png / .json
│   └── notifier-agent.png / .json
└── tiles/
    ├── office-tileset.png
    └── office-tileset.json

renderer/components/
├── AgentSprite.ts            ← class จาก section 3.2
├── OfficeScene.ts            ← scene setup จาก section 4
└── StatusBubble.ts           ← HUD จาก section 5
```

---

## 9. Tools

| Tool | ฟรี | หน้าที่ |
|---|---|---|
| **Aseprite** | ไม่ ($20) | draw + export spritesheet + JSON atlas |
| **TexturePacker** | มี free tier | pack หลาย PNG → atlas พร้อม JSON |
| **Libresprite** | ใช่ | Aseprite fork ฟรี |
| **PixiJS DevTools** | ใช่ | debug scene graph, texture, performance |

---

*AgentFlow · PixiJS v8 · Weerapat Srisawat (Ter) · 2026*
