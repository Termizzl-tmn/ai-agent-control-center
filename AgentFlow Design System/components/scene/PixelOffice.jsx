import React from 'react';

/* AgentFlow — PixelOffice
   An animated pixel-art office rendered on a 2D canvas. Each agent is a
   character that sits at a desk and animates by status (typing when running,
   a "?" speech bubble when waiting, etc.), and periodically gets up and walks
   around the room. Original art, drawn pixel-by-pixel in the AgentFlow palette.
   No external sprite assets. Composable, click-selectable.

   Coordinate system: art pixels. Grid is COLS×ROWS tiles of TILE art-px.
   The canvas backing store is ART × SCALE for crispness; CSS scales it to fit.
*/

const TILE = 16;
const COLS = 22;
const ROWS = 13;
const ART_W = COLS * TILE; // 352
const ART_H = ROWS * TILE; // 208
const SCALE = 3;
const SPEED = 3.2; // tiles / second

// ---- Palette (mirrors design tokens; canvas can't read CSS vars cheaply) ----
const C = {
  floorA: '#0D1322', floorB: '#0A0F1C', grout: '#161D30',
  wallFace: '#131929', wallTop: '#232C44', baseboard: '#090D18',
  wallLine: 'rgba(0,180,216,0.25)',
  glass: '#15314A', glassHi: '#1E4A6B', frame: '#2A3552',
  deskTop: '#2C3650', deskEdge: '#1B2236', deskLeg: '#141A2B',
  monFrame: '#1B2236', monStand: '#2A3552', kbd: '#222B42', mug: '#4D9FFF',
  chair: '#222B42', chairHi: '#2E3A57',
  pot: '#5A4632', leafA: '#1F8A5B', leafB: '#2BB673',
  rug: '#0E2A30', rugLine: '#00B4D8',
  pants: '#243049', shoe: '#0A0E1B', eye: '#0A0E1B',
};
const SKIN = ['#E8B98C', '#D29B6E', '#A9714B', '#7A4F33'];
const HAIR = ['#23232B', '#3A2A1C', '#5A4632', '#6B7280', '#2A3552'];
const STATUS = { running: '#00E5A0', waiting: '#F5C542', idle: '#4A5068', done: '#4D9FFF', error: '#FF4D6D', success: '#4D9FFF' };
const ROLE_SHIRT = { po: '#7C3AED', pm: '#0284C7', techlead: '#059669', dev: '#00E5A0', qa: '#D97706', devops: '#DC2626', notifier: '#9AA3B8' };
const ROLE_LABEL = { po: 'PO', pm: 'PM', techlead: 'Tech Lead', dev: 'Developer', qa: 'QA', devops: 'DevOps', notifier: 'Notifier' };

// ---- Scene layout ----
// Desk = table tile; seat = floor tile directly south (agent faces north/up).
const DESKS = [
  { col: 3, row: 4 }, { col: 7, row: 4 }, { col: 11, row: 4 }, { col: 15, row: 4 },
  { col: 5, row: 9 }, { col: 11, row: 9 }, { col: 17, row: 9 },
];
const SEATS = DESKS.map((d) => ({ col: d.col, row: d.row + 1 }));
const PLANTS = [{ col: 1, row: 3 }, { col: 20, row: 3 }, { col: 1, row: 11 }, { col: 20, row: 6 }];
const COFFEE = { col: 20, row: 9 };
const HANGOUTS = [{ col: 10, row: 6 }, { col: 19, row: 10 }, { col: 3, row: 8 }, { col: 18, row: 3 }, { col: 13, row: 11 }];
const DOOR = { col: 0, row: 6 };

function buildGrid() {
  // true = walkable
  const g = Array.from({ length: ROWS }, () => Array(COLS).fill(true));
  for (let x = 0; x < COLS; x++) { g[0][x] = false; g[1][x] = false; } // wall
  DESKS.forEach((d) => { g[d.row][d.col] = false; });
  PLANTS.forEach((p) => { g[p.row][p.col] = false; });
  g[COFFEE.row][COFFEE.col] = false;
  return g;
}
const GRID = buildGrid();

function bfs(start, goal) {
  if (start.col === goal.col && start.row === goal.row) return [];
  const key = (c, r) => c + ',' + r;
  const q = [start];
  const prev = { [key(start.col, start.row)]: null };
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  while (q.length) {
    const cur = q.shift();
    if (cur.col === goal.col && cur.row === goal.row) break;
    for (const [dc, dr] of dirs) {
      const nc = cur.col + dc, nr = cur.row + dr;
      if (nc < 0 || nr < 0 || nc >= COLS || nr >= ROWS) continue;
      if (!GRID[nr][nc] && !(nc === goal.col && nr === goal.row)) continue;
      const k = key(nc, nr);
      if (k in prev) continue;
      prev[k] = cur;
      q.push({ col: nc, row: nr });
    }
  }
  const gk = key(goal.col, goal.row);
  if (!(gk in prev)) return [];
  const path = [];
  let node = { col: goal.col, row: goal.row };
  while (node) { path.unshift(node); node = prev[key(node.col, node.row)]; }
  path.shift(); // drop start
  return path;
}

// ---- Drawing helpers ----
function R(ctx, x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x | 0, y | 0, Math.ceil(w), Math.ceil(h)); }

function drawFloor(ctx) {
  for (let r = 2; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      R(ctx, c * TILE, r * TILE, TILE, TILE, (c + r) % 2 ? C.floorA : C.floorB);
      R(ctx, c * TILE, r * TILE, TILE, 1, C.grout);
      R(ctx, c * TILE, r * TILE, 1, TILE, C.grout);
    }
  }
}

function drawWall(ctx) {
  R(ctx, 0, 0, ART_W, TILE * 2, C.wallFace);
  R(ctx, 0, 0, ART_W, 3, C.wallTop);
  R(ctx, 0, 3, ART_W, 1, C.wallLine);
  R(ctx, 0, TILE * 2 - 2, ART_W, 2, C.baseboard);
  // windows
  [[4, 6], [14, 17]].forEach(([a, b]) => {
    const x = a * TILE + 2, w = (b - a) * TILE - 4;
    R(ctx, x, 6, w, 16, C.glass);
    R(ctx, x, 6, w, 5, C.glassHi);
    R(ctx, x - 1, 5, w + 2, 1, C.frame);
    R(ctx, x - 1, 22, w + 2, 1, C.frame);
    R(ctx, x + w / 2, 6, 1, 16, C.frame);
  });
  // door on left wall
  R(ctx, DOOR.col * TILE, 4, 12, TILE * 2 - 6, C.frame);
  R(ctx, DOOR.col * TILE + 2, 6, 8, TILE * 2 - 10, '#0C1220');
  R(ctx, DOOR.col * TILE + 8, 14, 1, 2, C.mug);
}

function drawRug(ctx) {
  const x = 7 * TILE, y = 5 * TILE, w = 8 * TILE, h = 3 * TILE;
  R(ctx, x, y, w, h, C.rug);
  ctx.strokeStyle = C.rugLine; ctx.lineWidth = 1; ctx.globalAlpha = 0.5;
  ctx.strokeRect(x + 2.5, y + 2.5, w - 5, h - 5);
  ctx.globalAlpha = 1;
}

function drawPlant(ctx, p) {
  const x = p.col * TILE, y = p.row * TILE;
  R(ctx, x + 5, y + 10, 6, 5, C.pot);
  R(ctx, x + 5, y + 10, 6, 1, '#6B5640');
  R(ctx, x + 6, y + 3, 4, 7, C.leafA);
  R(ctx, x + 4, y + 5, 3, 4, C.leafB);
  R(ctx, x + 9, y + 4, 3, 5, C.leafB);
  R(ctx, x + 7, y + 1, 2, 3, C.leafB);
}

function drawCoffee(ctx, time) {
  const x = COFFEE.col * TILE, y = COFFEE.row * TILE;
  R(ctx, x + 3, y + 4, 10, 11, C.frame);
  R(ctx, x + 3, y + 4, 10, 1, C.chairHi);
  R(ctx, x + 5, y + 7, 6, 3, '#0C1220');
  const on = Math.floor(time * 2) % 2;
  R(ctx, x + 10, y + 5, 1, 1, on ? STATUS.running : STATUS.idle);
  R(ctx, x + 5, y + 12, 6, 2, '#3A2A1C'); // pot
}

function drawDesk(ctx, d, agent, time) {
  const x = d.col * TILE, y = d.row * TILE;
  // chair (south of desk, where agent sits)
  R(ctx, x + 3, y + TILE + 5, 10, 8, C.chair);
  R(ctx, x + 3, y + TILE + 5, 10, 2, C.chairHi);
  // desk legs + top
  R(ctx, x + 1, y + 11, 2, 5, C.deskLeg);
  R(ctx, x + 13, y + 11, 2, 5, C.deskLeg);
  R(ctx, x, y + 8, TILE, 4, C.deskTop);
  R(ctx, x, y + 8, TILE, 1, '#384665');
  R(ctx, x, y + 12, TILE, 1, C.deskEdge);
  // keyboard + mug on desk
  R(ctx, x + 4, y + 9, 8, 2, C.kbd);
  R(ctx, x + 12, y + 9, 2, 2, C.mug);
  // monitor (back of desk)
  const sc = agent ? (STATUS[agent.status] || C.idle) : C.idle;
  R(ctx, x + 4, y + 7, 2, 2, C.monStand);
  R(ctx, x + 2, y - 1, 12, 9, C.monFrame);
  const lit = agent && agent.status !== 'idle';
  if (lit) { ctx.save(); ctx.shadowColor = sc; ctx.shadowBlur = 7; }
  R(ctx, x + 3, y, 10, 6, lit ? sc : '#0C1220');
  if (lit) ctx.restore();
  if (lit) {
    // code lines on screen
    ctx.globalAlpha = 0.35;
    const off = agent.status === 'running' ? Math.floor(time * 6) % 3 : 0;
    R(ctx, x + 4, y + 1 + off * 0, 5, 1, '#06121f');
    R(ctx, x + 4, y + 3, 7 - off, 1, '#06121f');
    R(ctx, x + 4, y + 5, 4, 1, '#06121f');
    ctx.globalAlpha = 1;
  }
}

// Character: ~12 wide, 18 tall, feet at feetY. Dark outline for contrast.
const OUT = '#05080F';
function drawChar(ctx, cx, feetY, opt) {
  const { shirt, skin, hair, dir, pose, frame, status, time } = opt;
  const left = Math.round(cx) - 6;
  const top = Math.round(feetY) - 18;
  const back = dir === 'up';
  const walking = pose === 'walk';
  const seated = pose === 'sit' || pose === 'type' || pose === 'read';
  const lp = walking ? (frame % 2 ? 1 : -1) : 0;

  // ground shadow
  ctx.globalAlpha = 0.32; R(ctx, left + 2, feetY - 1, 9, 2, '#000'); ctx.globalAlpha = 1;

  // ---- silhouette outline (drawn first, 1px larger masses) ----
  R(ctx, left + 2, top + 1, 9, 8, OUT);            // head block
  R(ctx, left + 1, top + 7, 11, 8, OUT);           // torso+arms block
  if (!seated) { R(ctx, left + 2, top + 13, 9, 4, OUT); } // legs block

  // legs
  if (seated) {
    R(ctx, left + 3, top + 14, 3, 2, C.pants);
    R(ctx, left + 7, top + 14, 3, 2, C.pants);
  } else {
    R(ctx, left + 3, top + 13 + (lp > 0 ? 1 : 0), 3, 4 - (lp > 0 ? 1 : 0), C.pants);
    R(ctx, left + 7, top + 13 + (lp < 0 ? 1 : 0), 3, 4 - (lp < 0 ? 1 : 0), C.pants);
    R(ctx, left + 3, top + 16, 3, 1, C.shoe);
    R(ctx, left + 7, top + 16, 3, 1, C.shoe);
  }

  // torso (shirt) + collar highlight
  R(ctx, left + 3, top + 8, 7, 6, shirt);
  R(ctx, left + 3, top + 8, 7, 1, 'rgba(255,255,255,0.18)');

  // arms
  if (pose === 'type') {
    const b = frame % 2;
    R(ctx, left + 2, top + 9, 2, 3, shirt);
    R(ctx, left + 9, top + 9, 2, 3, shirt);
    R(ctx, left + 2, top + 8 - b, 2, 1, skin);
    R(ctx, left + 9, top + 8 - (1 - b), 2, 1, skin);
  } else if (walking) {
    R(ctx, left + 2, top + 8 + lp, 2, 4, shirt);
    R(ctx, left + 9, top + 8 - lp, 2, 4, shirt);
  } else {
    R(ctx, left + 2, top + 9, 2, 4, shirt);
    R(ctx, left + 9, top + 9, 2, 4, shirt);
  }

  // neck + head
  R(ctx, left + 5, top + 7, 3, 1, skin);
  R(ctx, left + 4, top + 2, 5, 6, skin);

  // hair
  if (back) {
    R(ctx, left + 4, top + 1, 5, 6, hair);
    R(ctx, left + 3, top + 2, 1, 5, hair);
    R(ctx, left + 9, top + 2, 1, 5, hair);
  } else {
    R(ctx, left + 4, top + 1, 5, 2, hair);
    R(ctx, left + 3, top + 2, 1, 3, hair);
    R(ctx, left + 9, top + 2, 1, 3, hair);
    if (dir === 'down') { R(ctx, left + 5, top + 4, 1, 2, C.eye); R(ctx, left + 7, top + 4, 1, 2, C.eye); }
    else if (dir === 'left') { R(ctx, left + 5, top + 4, 1, 2, C.eye); }
    else { R(ctx, left + 7, top + 4, 1, 2, C.eye); }
  }

  // ---- status indicator above head ----
  const sc = STATUS[status] || C.idle;
  if (status === 'waiting' || status === 'error') {
    const bx = left + 6, by = top - 12;
    R(ctx, bx - 1, by - 1, 13, 11, OUT); // bubble outline
    ctx.save(); ctx.shadowColor = sc; ctx.shadowBlur = 7;
    R(ctx, bx, by, 11, 9, '#E6ECFB');
    ctx.restore();
    R(ctx, bx + 2, by + 9, 2, 2, '#E6ECFB');
    R(ctx, bx + 2, by + 11, 1, 1, OUT);
    R(ctx, bx, by, 11, 2, sc);
    const g = status === 'waiting' ? '#1a2436' : STATUS.error;
    if (status === 'waiting') { R(ctx, bx + 4, by + 3, 3, 1, g); R(ctx, bx + 6, by + 4, 1, 1, g); R(ctx, bx + 5, by + 5, 1, 1, g); R(ctx, bx + 5, by + 7, 1, 1, g); }
    else { R(ctx, bx + 5, by + 3, 1, 3, g); R(ctx, bx + 5, by + 7, 1, 1, g); }
  } else {
    const pulse = status === 'running' ? 0.5 + 0.5 * Math.abs(Math.sin(time * 3)) : 0.95;
    const dx = left + 5, dy = top - 5;
    R(ctx, dx, dy - 1, 3, 5, OUT); R(ctx, dx - 1, dy, 5, 3, OUT); // dot outline
    ctx.save(); ctx.globalAlpha = pulse; ctx.shadowColor = sc; ctx.shadowBlur = 6;
    R(ctx, dx + 1, dy, 1, 1, sc); R(ctx, dx, dy + 1, 3, 1, sc); R(ctx, dx + 1, dy + 2, 1, 1, sc);
    ctx.restore(); ctx.globalAlpha = 1;
  }
}

function poseFor(status) {
  if (status === 'running') return 'type';
  if (status === 'done' || status === 'success') return 'read';
  return 'sit';
}

function PixelOffice({
  agents,
  height = 360,
  selectedId,
  onSelectAgent,
  animated = true,
  style,
}) {
  const canvasRef = React.useRef(null);
  const wrapRef = React.useRef(null);
  const stateRef = React.useRef(null);
  const propsRef = React.useRef({});
  propsRef.current = { agents, selectedId, onSelectAgent, animated };

  // (re)build runtime agents when the agent list identity changes
  const sig = (agents || []).map((a) => a.id + a.status).join('|');
  React.useEffect(() => {
    const list = (propsRef.current.agents || []).slice(0, 7);
    const rt = list.map((a, i) => {
      const seat = SEATS[i];
      const prev = stateRef.current && stateRef.current.find((p) => p.id === a.id);
      return prev ? Object.assign(prev, { status: a.status, name: a.name, role: a.role }) : {
        id: a.id, name: a.name, role: a.role, status: a.status, seatIndex: i, seat,
        x: seat.col, y: seat.row, path: [], goal: 'seat', pose: poseFor(a.status), dir: 'down',
        pauseT: 0, wanderT: 4 + Math.random() * 10,
        skin: SKIN[i % SKIN.length], hair: HAIR[(i * 2) % HAIR.length],
      };
    });
    stateRef.current = rt;
  }, [sig]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = ART_W * SCALE; canvas.height = ART_H * SCALE;
    let raf, last = performance.now(), running = true;

    function update(dt, time) {
      const rt = stateRef.current || [];
      const anim = propsRef.current.animated;
      let walkers = rt.filter((a) => a.path.length).length;
      for (const a of rt) {
        if (a.path.length) {
          const t = a.path[0];
          const dx = t.col - a.x, dy = t.row - a.y;
          const dist = Math.hypot(dx, dy);
          const sp = SPEED * dt;
          if (dist <= sp) { a.x = t.col; a.y = t.row; a.path.shift(); }
          else { a.x += (dx / dist) * sp; a.y += (dy / dist) * sp; }
          if (Math.abs(dx) > Math.abs(dy)) a.dir = dx > 0 ? 'right' : 'left';
          else a.dir = dy > 0 ? 'down' : 'up';
          a.pose = 'walk';
          if (!a.path.length) {
            if (a.goal === 'hangout') { a.pauseT = 2 + Math.random() * 3; a.dir = 'down'; }
            else { a.goal = 'seat'; a.dir = 'down'; a.wanderT = 10 + Math.random() * 12; }
          }
        } else if (a.goal === 'hangout' && a.pauseT > 0) {
          a.pose = 'idle'; a.dir = 'down';
          a.pauseT -= dt;
          if (a.pauseT <= 0) { a.path = bfs({ col: Math.round(a.x), row: Math.round(a.y) }, a.seat); a.goal = 'seat'; }
        } else {
          a.x = a.seat.col; a.y = a.seat.row; a.dir = 'down'; a.pose = poseFor(a.status);
          if (anim && a.status !== 'running' && a.status !== 'waiting' && walkers < 2) {
            a.wanderT -= dt;
            if (a.wanderT <= 0) {
              const h = HANGOUTS[Math.floor(Math.random() * HANGOUTS.length)];
              const p = bfs(a.seat, h);
              if (p.length) { a.path = p; a.goal = 'hangout'; walkers++; }
              else a.wanderT = 6;
            }
          }
        }
      }
    }

    function draw(time) {
      ctx.setTransform(SCALE, 0, 0, SCALE, 0, 0);
      ctx.imageSmoothingEnabled = false;
      R(ctx, 0, 0, ART_W, ART_H, C.floorB);
      drawFloor(ctx);
      drawRug(ctx);
      drawWall(ctx);
      PLANTS.forEach((p) => drawPlant(ctx, p));
      drawCoffee(ctx, time);

      const rt = stateRef.current || [];
      const seatOf = {};
      rt.forEach((a) => { seatOf[a.seatIndex] = a; });
      // desks (with their seated agent's monitor color)
      DESKS.forEach((d, i) => {
        const occ = seatOf[i];
        const seated = occ && !occ.path.length && occ.goal === 'seat' && occ.pauseT <= 0;
        drawDesk(ctx, d, seated ? occ : null, time);
      });

      // characters sorted by y for depth
      const sel = propsRef.current.selectedId;
      [...rt].sort((a, b) => a.y - b.y).forEach((a) => {
        const cx = a.x * TILE + 8;
        const feetY = a.y * TILE + 15;
        const frame = Math.floor(time * (a.pose === 'walk' ? 7 : 4)) % 2;
        if (a.id === sel) {
          ctx.save(); ctx.strokeStyle = '#00B4D8'; ctx.lineWidth = 1; ctx.shadowColor = '#00B4D8'; ctx.shadowBlur = 6;
          ctx.strokeRect(cx - 7.5, feetY - 17.5, 15, 18); ctx.restore();
        }
        drawChar(ctx, cx, feetY, {
          shirt: ROLE_SHIRT[a.role] || '#9AA3B8', skin: a.skin, hair: a.hair,
          dir: a.dir, pose: a.pose, frame, status: a.status, time,
        });
      });

      // CRT scanlines
      ctx.globalAlpha = 0.05; ctx.fillStyle = '#fff';
      for (let y = 0; y < ART_H; y += 3) ctx.fillRect(0, y, ART_W, 1);
      ctx.globalAlpha = 1;
      // vignette
      const g = ctx.createRadialGradient(ART_W / 2, ART_H / 2, ART_H / 3, ART_W / 2, ART_H / 2, ART_H);
      g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.45)');
      ctx.fillStyle = g; ctx.fillRect(0, 0, ART_W, ART_H);
    }

    function loop(now) {
      if (!running) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const time = now / 1000;
      if (propsRef.current.animated) update(dt, time);
      draw(time);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);
    return () => { running = false; cancelAnimationFrame(raf); };
  }, []);

  function handleClick(e) {
    const onSel = propsRef.current.onSelectAgent;
    if (!onSel) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const ax = ((e.clientX - rect.left) / rect.width) * ART_W;
    const ay = ((e.clientY - rect.top) / rect.height) * ART_H;
    const rt = stateRef.current || [];
    let best = null, bd = 14;
    for (const a of rt) {
      const cx = a.x * TILE + 8, cy = a.y * TILE + 7;
      const d = Math.hypot(ax - cx, ay - cy);
      if (d < bd) { bd = d; best = a; }
    }
    if (best) onSel(best);
  }

  return (
    <div ref={wrapRef} style={{
      position: 'relative', width: '100%', height, overflow: 'hidden',
      background: '#0A0F1C', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)',
      ...style,
    }}>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'contain', imageRendering: 'pixelated',
          cursor: propsRef.current.onSelectAgent ? 'pointer' : 'default',
        }}
      />
    </div>
  );
}

export { PixelOffice };
