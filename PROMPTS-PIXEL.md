# PROMPTS-PIXEL.md — AgentFlow Pixel Art Generation
> Leonardo.ai Prompt Guide · PixiJS v8 Asset Pipeline · v0.2.0

---

## PixiJS v8 Asset Requirements

ก่อน generate ต้องเข้าใจ format ที่ PixiJS v8 ต้องการ:

```
spritesheet : PNG แนวนอน, frames เรียงซ้ายไปขวา
frame size  : 16×16 px ต่อ frame (native)
atlas JSON  : ต้องมีคู่กัน (สร้างใน Aseprite หรือ TexturePacker)
scale mode  : nearest neighbor — ห้าม bilinear

5 states ต่อ agent:
  idle    → 3 frames
  walk    → 4 frames
  action  → 4 frames
  error   → 2 frames
  done    → 3 frames

รวม 16 frames × 16px = 256px wide (minimum per agent sheet)
```

---

## Setup Leonardo.ai

1. ไปที่ [leonardo.ai](https://leonardo.ai)
2. Model: **Pixel Art** (ถ้าไม่มีใช้ **Leonardo Diffusion XL**)
3. Resolution: **256×16** px สำหรับ strip เดียว / **512×32** สำหรับ 2 rows
4. Guidance Scale: **7**
5. Steps: **35**
6. **บันทึก Seed** ที่ได้ผลดี — ใช้ seed เดิมทุก state ของ agent นั้น

---

## Negative Prompt (ใส่ทุก prompt)

```
blurry, anti-aliasing, smooth shading, gradient, 3D render,
realistic, soft edges, watermark, text overlay, signature,
extra limbs, deformed body, inconsistent style, low resolution,
noise, dithering, mixed art styles, rounded edges, glow effect
```

---

## Global Style Token (ต่อท้ายทุก prompt)

```
16x16 pixel art sprite, crisp hard pixels, zero anti-aliasing,
dark navy outline color #1A1A2E, flat cel shading,
retro 16-bit RPG character, transparent background,
nearest-neighbor scaling, SNES era sprite style
```

---

## PART A — Concept Sheet (ทำก่อนทุก agent)

เพื่อ lock design ก่อน generate spritesheet — ใช้ resolution **512×512**

### Template

```
pixel art character concept reference sheet,
[ROLE] — [OUTFIT DESCRIPTION] — [PROP DESCRIPTION],
4 views: front center, left side, right side, back,
idle standing pose, full body visible, white background,
labeled views, 16x16 pixel art, crisp pixels, no anti-aliasing,
dark navy outline, flat shading, retro RPG game character
```

---

### A1 — PO Agent

```
pixel art character concept reference sheet,
product owner — purple shirt #7C3AED dark navy pants — clipboard in right hand,
4 views: front center, left side, right side, back,
idle standing pose, full body visible, white background,
short dark hair, neutral confident expression,
16x16 pixel art, crisp pixels, no anti-aliasing,
dark navy outline, flat shading, retro RPG game character
```

### A2 — PM Agent

```
pixel art character concept reference sheet,
project manager — blue blazer #0284C7 gray pants — small tablet in hands,
4 views: front center, left side, right side, back,
idle standing pose, full body visible, white background,
neat hair, glasses (2 pixel dots), professional expression,
16x16 pixel art, crisp pixels, no anti-aliasing,
dark navy outline, flat shading, retro RPG game character
```

### A3 — Tech Lead Agent

```
pixel art character concept reference sheet,
tech lead — green hoodie #059669 black pants — rolled blueprint under left arm,
4 views: front center, left side, right side, back,
idle standing pose, full body visible, white background,
messy dark hair, thoughtful expression,
16x16 pixel art, crisp pixels, no anti-aliasing,
dark navy outline, flat shading, retro RPG game character
```

### A4 — Developer Agent

```
pixel art character concept reference sheet,
developer — teal hoodie #00E5A0 dark jeans — laptop under right arm,
4 views: front center, left side, right side, back,
idle standing pose, full body visible, white background,
medium dark hair, focused expression, headphones around neck,
16x16 pixel art, crisp pixels, no anti-aliasing,
dark navy outline, flat shading, retro RPG game character
```

### A5 — QA Agent

```
pixel art character concept reference sheet,
QA engineer — amber vest #D97706 white shirt dark pants — magnifying glass right hand,
4 views: front center, left side, right side, back,
idle standing pose, full body visible, white background,
short light hair, wide curious eyes, badge on chest,
16x16 pixel art, crisp pixels, no anti-aliasing,
dark navy outline, flat shading, retro RPG game character
```

### A6 — DevOps Agent

```
pixel art character concept reference sheet,
devops engineer — red jacket #DC2626 dark cargo pants — wrench in right hand,
4 views: front center, left side, right side, back,
idle standing pose, full body visible, white background,
short dark hair, serious expression, tool belt visible,
16x16 pixel art, crisp pixels, no anti-aliasing,
dark navy outline, flat shading, retro RPG game character
```

### A7 — Notifier Agent

```
pixel art character concept reference sheet,
notifier agent — gray uniform #6B7280 dark pants — megaphone in right hand,
4 views: front center, left side, right side, back,
idle standing pose, full body visible, white background,
small bell icon on chest, round cheerful face, alert expression,
16x16 pixel art, crisp pixels, no anti-aliasing,
dark navy outline, flat shading, retro RPG game character
```

---

## PART B — State Strips (ทีละ state, resolution 256×16)

ทำทีละ state แล้ว import เข้า Aseprite ประกอบทีหลัง
ใช้ **seed เดิม** จาก concept sheet เสมอ

---

### B-IDLE — 3 frames (subtle breathing)

```
pixel art idle animation strip, 16x16 sprite sheet,
[CHARACTER FROM CONCEPT],
3 frames horizontal left to right,
frame 1: neutral standing, weight centered,
frame 2: very slight body shift, 1 pixel weight left,
frame 3: slight head tilt 1 pixel, back toward neutral,
front facing down view, transparent background,
[GLOBAL STYLE TOKEN]
```

---

### B-WALK — 4 frames (walk cycle)

```
pixel art walk cycle strip, 16x16 sprite sheet,
[CHARACTER FROM CONCEPT],
4 frames horizontal left to right,
frame 1: left foot forward, right arm swings forward,
frame 2: feet together, mid-stride neutral,
frame 3: right foot forward, left arm swings forward,
frame 4: feet together, mid-stride neutral,
[PROP] moves naturally with walk,
front facing down view, transparent background,
[GLOBAL STYLE TOKEN]
```

---

### B-ACTION — 4 frames (working animation)

สำหรับแต่ละ role ใส่ action description ที่ต่างกัน:

| Role | Action Description |
|---|---|
| PO | `writing on clipboard with pen, frame 1-3 pen moves, frame 4 pause reviewing` |
| PM | `swiping tablet screen, fingers move across display across frames` |
| Tech Lead | `unrolling blueprint with both hands, pointing finger at it frame 3` |
| Developer | `typing on laptop keyboard both hands, screen flickers green pixel frame 2 and 4` |
| QA | `raising magnifying glass to eye level, leaning forward to inspect frame 3` |
| DevOps | `turning wrench clockwise, body leans into work frame 2 and 3` |
| Notifier | `raising megaphone to mouth frame 2, open mouth pixel visible frame 3` |

```
pixel art action animation strip, 16x16 sprite sheet,
[CHARACTER FROM CONCEPT],
4 frames horizontal left to right,
[ACTION DESCRIPTION FROM TABLE ABOVE],
front facing down view, transparent background,
[GLOBAL STYLE TOKEN]
```

---

### B-ERROR — 2 frames (flash)

```
pixel art error animation strip, 16x16 sprite sheet,
[CHARACTER FROM CONCEPT],
2 frames horizontal,
frame 1: full sprite tinted red #FF4D6D overlay, shocked pose,
frame 2: original colors restored, recoil pose leaning back 1px,
small exclamation mark 2x4px red floating above head,
front facing down view, transparent background,
[GLOBAL STYLE TOKEN]
```

---

### B-DONE — 3 frames (celebrate once)

```
pixel art done celebration strip, 16x16 sprite sheet,
[CHARACTER FROM CONCEPT],
3 frames horizontal,
frame 1: normal standing pose,
frame 2: raise one arm up, body jumps 1px upward,
frame 3: both arms slightly raised, happy expression pixel,
small checkmark 3x3px in green #00E5A0 floating above head frame 3,
front facing down view, transparent background,
[GLOBAL STYLE TOKEN]
```

---

## PART C — Desk Objects

สำหรับ office scene tiles — resolution **48×48** (3x render ของ 16×16)

```
pixel art desk object, 16x16 tile,
[OBJECT DESCRIPTION],
top-down isometric office view,
transparent background, flat shading,
[GLOBAL STYLE TOKEN]
```

| Agent | Object | Colors |
|---|---|---|
| PO | `stack of colorful sticky notes, pink yellow green layers` | `#FFB3C1 #FFF176 #B9F6CA` |
| PM | `gantt chart paper flat on desk, blue grid lines, week columns` | `#BFDBFE` |
| Tech Lead | `whiteboard standing up, diagram arrows in green marker` | `#F0FDF4` |
| Developer | `dual monitor setup side by side, screens glow green code text` | `#00E5A0` |
| QA | `clipboard with checklist, red X marks on some rows` | `#FEE2E2` |
| DevOps | `server rack unit, green and red LED dots on front panel` | `#00E5A0 #FF4D6D` |
| Notifier | `golden bell on small stand, shine pixel top right` | `#FCD34D` |

---

## PART D — Workflow (Concept → PixiJS)

```
Step 1 — Concept (Part A, 512×512)
  Generate → เลือก design → note seed
       ↓
Step 2 — State Strips (Part B, 256×16 ต่อ state)
  ทำครบ 5 states: idle, walk, action, error, done
  ใช้ seed เดิมทุก state
       ↓
Step 3 — Aseprite
  Import strips ทั้ง 5 → จัด frame ใน timeline
  Export เป็น spritesheet PNG แนวนอน
  Export JSON atlas (Aseprite รองรับ PixiJS format)
       ↓
Step 4 — PixiJS v8
  await Assets.load('dev-agent.json')
  new AnimatedSprite(sheet.animations['dev_idle'])
  agent.scale.set(3)  ← 3x pixel art
       ↓
Step 5 — เชื่อม IPC
  onAgentStatus → setState() → swap textures
```

---

## Export Settings ใน Aseprite

```
File → Export Sprite Sheet
  Layout    : Horizontal strip
  Layers    : Visible layers
  Frames    : All frames
  Output    : {agentname}-{state}.png

File → Export Sprite Sheet (JSON)
  Format    : JSON Array
  Item      : Frame
  เลือก     : Output JSON data ✓
  Filename  : {agentname}.json
```

แล้วนำ JSON ไป merge รวมทุก state ด้วย script หรือ TexturePacker

---

*AgentFlow · PixiJS v8 · Weerapat Srisawat (Ter) · 2026*
