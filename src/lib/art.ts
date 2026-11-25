// Richer build-time pixel art: 32x32 shaded portraits and wide scenes, drawn in full colour and
// then optionally re-treated in one of three styles:
//   hibit  — full shading ramps, rim light, dithered skies (the base render)
//   cine   — Villeneuve-like: near-monochrome sand/ash palette, hard light, haze, one accent
//   codex  — "illuminated archive": jewel palette, black leading between colour areas, gilt frame
import { Pix, bayer, rng, shade, lerp, type Col } from './pix';
import type { Look } from '../data/cast';

export type ArtStyle = 'hibit' | 'cine' | 'codex';

const INK = '#120a10';

const lum = (hex: string) => {
  const n = parseInt(hex.slice(1, 7), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};
const sat = (hex: string) => {
  const n = parseInt(hex.slice(1, 7), 16);
  const r = n >> 16, g = (n >> 8) & 255, b = n & 255;
  return (Math.max(r, g, b) - Math.min(r, g, b)) / 255;
};
const dist = (a: string, b: string) => {
  const p = (h: string) => { const n = parseInt(h.slice(1, 7), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const A = p(a), B = p(b);
  return (A[0] - B[0]) ** 2 * 0.3 + (A[1] - B[1]) ** 2 * 0.59 + (A[2] - B[2]) ** 2 * 0.11;
};

/** 4-tone shade picker: t in 0..1 (0 = darkest), dithered between neighbouring tones. */
function tone(ramp: string[], t: number, x: number, y: number) {
  const f = Math.max(0, Math.min(0.999, t)) * (ramp.length - 1);
  const k = Math.floor(f);
  return f - k > bayer(x, y) ? ramp[Math.min(ramp.length - 1, k + 1)] : ramp[k];
}
const rampFor = (base: string) => [shade(base, 0.45), shade(base, 0.7), base, lerp(base, '#fff1d6', 0.35)];

// ---------------------------------------------------------------- portraits
export interface PortraitOpts { bg: string; mentat?: boolean; style?: ArtStyle; accent?: string }

export function portrait(L: Look, o: PortraitOpts): Pix {
  const p = new Pix(32, 32);
  const bgR = [shade(o.bg, 0.28), shade(o.bg, 0.42), shade(o.bg, 0.6), shade(o.bg, 0.8)];
  // background: radial glow behind the head
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
    const d = Math.hypot((x - 15.5) / 18, (y - 12) / 16);
    p.set(x, y, tone(bgR, 1 - d, x, y));
  }
  const skin = rampFor(L.skin);
  const cloth = rampFor(L.cloth);
  const hairC = L.hair ?? '#1d1512';
  const hair = rampFor(hairC);
  const wide = !!L.wide;
  const cx = 15.5, cy = 14, rx = wide ? 7.6 : 6.6, ry = 8.2;
  const light = (nx: number, ny: number) => 0.62 - 0.42 * nx - 0.32 * ny; // lit from upper left

  // shoulders / robe
  p.poly([[2, 32], [4, 26], [9, 23.5], [22, 23.5], [27, 26], [30, 32]], (x, y) => {
    const nx = (x - 16) / 14;
    const fold = (x === 10 || x === 21) && y > 25 ? -0.25 : 0;
    return tone(cloth, 0.6 - 0.45 * nx - (y - 24) * 0.02 + fold, x, y);
  });
  // neck
  p.rect(13, 21, 6, 4, skin[1]); p.rect(13, 21, 2, 3, skin[2]);
  // collar
  p.rect(11, 24, 10, 1, cloth[0]);

  // hood / veil / stillsuit cowl drawn behind the head
  if (L.head === 'hood' || L.head === 'veil' || L.head === 'stillsuit') {
    const robe = L.head === 'veil' ? rampFor('#1b1820') : L.head === 'stillsuit' ? rampFor('#5a4632') : cloth;
    p.ellipse(cx, cy - 0.5, rx + 3, ry + 3.2, (x, y, nx, ny) => tone(robe, light(nx, ny) - 0.1, x, y));
    p.poly([[cx - rx - 3, cy], [cx + rx + 3, cy], [cx + rx + 5, 26], [cx - rx - 5, 26]], (x, y) => tone(robe, 0.55 - 0.4 * ((x - cx) / 10), x, y));
  }
  if (L.head === 'long' || L.head === 'curly') {
    p.poly([[cx - rx - 1.5, cy - 4], [cx + rx + 1.5, cy - 4], [cx + rx + 2.5, cy + 10], [cx - rx - 2.5, cy + 10]], (x, y) => tone(hair, 0.5 - 0.35 * ((x - cx) / 9) - (y - cy) * 0.02, x, y));
  }

  // head
  p.ellipse(cx, cy, rx, ry, (x, y, nx, ny) => tone(skin, light(nx, ny), x, y));
  // ears
  p.rect(Math.round(cx - rx) - 1, 13, 1, 3, skin[1]); p.rect(Math.round(cx + rx), 13, 1, 3, skin[0]);
  // jaw shadow
  for (let x = Math.round(cx - rx + 2); x <= Math.round(cx + rx - 2); x++) p.set(x, Math.round(cy + ry) - 1, skin[0]);

  // hair on top
  const top = (fn: (x: number, y: number, nx: number, ny: number) => Col) =>
    p.ellipse(cx, cy - 2.4, rx + 0.8, ry - 1.6, (x, y, nx, ny) => (ny < -0.05 - 0.25 * Math.abs(nx) ? fn(x, y, nx, ny) : p.get(x, y)));
  switch (L.head) {
    case 'hair': case 'long': top((x, y, nx, ny) => tone(hair, light(nx, ny) + ((x * 7 + y * 3) % 5 === 0 ? 0.2 : 0), x, y)); break;
    case 'curly': {
      top((x, y, nx, ny) => tone(hair, light(nx, ny), x, y));
      const r = rng(7);
      for (let i = 0; i < 26; i++) { const a = Math.PI * (1 + r()), d = rx + 0.5; p.disc(cx + Math.cos(a) * d, cy - 3 + Math.sin(a) * (ry - 2), 1.6, (x, y, nx, ny) => tone(hair, 0.55 - nx * 0.3 - ny * 0.3, x, y)); }
      break;
    }
    case 'bald': p.set(cx - 3, cy - 6, skin[3]); p.set(cx - 2, cy - 6, skin[3]); p.set(cx - 3, cy - 5, skin[3]); break;
    case 'crown': {
      top((x, y, nx, ny) => tone(hair, light(nx, ny), x, y));
      const gold = ['#6b4a10', '#a8781c', '#e0b23a', '#ffe58a'];
      for (let x = Math.round(cx - rx); x <= Math.round(cx + rx); x++) { p.set(x, cy - 7, tone(gold, 0.8 - (x - cx) / 14, x, 0)); p.set(x, cy - 6, gold[1]); }
      [-4, 0, 4].forEach((dx) => { p.set(cx + dx, cy - 8, gold[2]); p.set(cx + dx, cy - 9, gold[3]); });
      p.set(cx, cy - 7, '#c8452e');
      break;
    }
    case 'hood': case 'veil': {
      const robe = L.head === 'veil' ? rampFor('#1b1820') : cloth;
      top((x, y, nx, ny) => tone(robe, light(nx, ny) - 0.05, x, y));
      break;
    }
    case 'stillsuit': {
      const suit = rampFor('#5a4632');
      top((x, y, nx, ny) => tone(suit, light(nx, ny), x, y));
      break;
    }
    case 'worm': top((x, y, nx, ny) => tone(hair, light(nx, ny), x, y)); break;
  }

  // brows, eyes, nose, mouth
  const ex1 = Math.round(cx - 3.3), ex2 = Math.round(cx + 2.3), ey = 14;
  const brow = shade(hairC, 0.8);
  if (L.head !== 'veil') { p.rect(ex1 - 1, ey - 2, 3, 1, brow); p.rect(ex2, ey - 2, 3, 1, brow); }
  const ibad = L.eyes === 'blue';
  const white = L.eyes === 'white';
  if (L.eyes !== 'none') {
    for (const ex of [ex1, ex2]) {
      p.rect(ex - 1, ey, 3, 1, ibad ? '#2a6fe0' : white ? '#f6ead2' : '#e8dccb');
      p.set(ex, ey, ibad ? '#0d2f80' : white ? '#cfc3ad' : '#2a1a14');
      p.set(ex + (ex === ex1 ? 0 : 0), ey - 1, shade(L.skin, 0.68));
      if (ibad) p.set(ex - 1, ey, '#7fb8ff');
    }
    p.set(ex1 - 1, ey + 1, shade(L.skin, 0.8)); p.set(ex2 + 1, ey + 1, shade(L.skin, 0.75));
  }
  // nose
  p.set(cx + 0.5, 16, skin[1]); p.set(cx + 0.5, 17, skin[0]); p.set(cx - 0.5, 17, skin[1]);
  // mouth
  const lips = o.mentat ? '#8a1f2a' : shade(L.skin, 0.62);
  p.rect(Math.round(cx - 1.5), 19, 4, 1, lips);
  if (o.mentat) p.rect(Math.round(cx - 1), 20, 3, 1, '#b8323c');
  else p.rect(Math.round(cx - 1), 20, 2, 1, skin[3] ?? skin[2]);

  // stillsuit mask and catch-tube
  if (L.head === 'stillsuit') {
    const mask = ['#2a2018', '#3a2e22', '#4e3e2c', '#6b5a44'];
    p.poly([[cx - rx + 0.5, 17.5], [cx + rx - 0.5, 17.5], [cx + rx - 1.5, 22], [cx - rx + 1.5, 22]], (x, y) => tone(mask, 0.6 - (x - cx) / 12 - (y - 17) * 0.05, x, y));
    p.set(cx - 1, 16, '#2a2018'); p.set(cx + 1, 16, '#2a2018');
    p.line(cx + rx - 1, 20, cx + rx + 2, 25, '#6b5a44'); p.line(cx + rx, 20, cx + rx + 3, 25, '#3a2e22');
  }
  // Leto II: the worm skin rising around the shoulders
  if (L.head === 'worm') {
    const seg = ['#3a2a1e', '#5e4632', '#8a6a4a', '#b8946a'];
    p.poly([[0, 32], [0, 23], [8, 21], [24, 21], [32, 23], [32, 32]], (x, y) => tone(seg, 0.65 - (x - 16) / 30 - (x % 4 === 0 ? 0.3 : 0), x, y));
  }

  // rim light from the faction colour on the shadow side
  const rim = lerp(o.bg, '#fff1d6', 0.35);
  for (let y = 4; y < 31; y++) {
    let last = -1;
    for (let x = 31; x >= 16; x--) if (isFigure(p, x, y, bgR)) { last = x; break; }
    if (last > 0 && (x0 => x0 % 2 === 0 || y > 22)(y)) p.set(last, y, rim);
  }
  outlineFigure(p, bgR);
  return style(p, o.style ?? 'hibit', 'portrait', o.accent);
}

function isFigure(p: Pix, x: number, y: number, bg: string[]) {
  const c = p.get(x, y);
  return !!c && !bg.includes(c);
}
function outlineFigure(p: Pix, bg: string[]) {
  const mark: [number, number][] = [];
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
    if (isFigure(p, x, y, bg)) continue;
    if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => isFigure(p, x + dx, y + dy, bg))) mark.push([x, y]);
  }
  for (const [x, y] of mark) p.set(x, y, INK);
}

// ---------------------------------------------------------------- scenes
export interface SceneOpts { w?: number; h?: number; seed?: number; style?: ArtStyle; time?: 'dusk' | 'night' | 'day'; worm?: boolean; city?: boolean; thopter?: boolean }

export function arrakeen(o: SceneOpts = {}): Pix {
  const W = o.w ?? 320, H = o.h ?? 120, r = rng(o.seed ?? 10191);
  const p = new Pix(W, H);
  const time = o.time ?? 'dusk';
  const sky = time === 'night' ? ['#0b0714', '#1a0f26', '#2e1838', '#4a2440', '#6e3a3a']
    : time === 'day' ? ['#9fc6e0', '#c9d9d6', '#efd9b0', '#f4c98a', '#f0b070']
    : ['#1f1030', '#4a1f3c', '#8a3a3a', '#d8743a', '#f4b062'];
  p.ramp(0, 0, W, Math.round(H * 0.72), sky);
  // stars
  if (time !== 'day') for (let i = 0; i < 70; i++) { const x = Math.floor(r() * W), y = Math.floor(r() * H * 0.35); p.set(x, y, r() > 0.85 ? '#fff6e0' : '#c9b8d8'); }
  // sun low on the horizon / moons
  if (time === 'dusk') p.disc(W * 0.7, H * 0.56, 9, (x, y, nx, ny) => tone(['#f4b062', '#ffd98a', '#fff0c0', '#fffbe8'], 1 - Math.hypot(nx, ny) * 0.7, x, y));
  const moon = (mx: number, my: number, mr: number) => p.disc(mx, my, mr, (x, y, nx, ny) => tone(['#8a7a8a', '#c9b8a8', '#efe0c8', '#fff6e0'], 0.75 - 0.5 * nx - 0.3 * ny, x, y));
  moon(W * 0.86, H * 0.14, 6); moon(W * 0.93, H * 0.26, 2.5);

  // the Shield Wall: far rock ridge
  const ridge = (x: number) => H * 0.5 - 10 * Math.abs(Math.sin(x * 0.031 + 1.3)) - 6 * Math.abs(Math.sin(x * 0.083)) - (r() > 0.92 ? 2 : 0);
  const rock = time === 'day' ? ['#7a5a48', '#9a7058', '#b88a68', '#d8a880'] : ['#2a1624', '#3e2030', '#5e3038', '#8a4a3a'];
  for (let x = 0; x < W; x++) {
    const top = Math.round(ridge(x));
    for (let y = top; y < H * 0.62; y++) p.set(x, y, tone(rock, (y === top ? 0.9 : 0.55) - (y - top) * 0.02 - (x % 7 === 0 ? 0.2 : 0), x, y));
  }
  // Arrakeen: blocky city with the Residency
  if (o.city !== false) {
    const cityX = W * 0.08, base = Math.round(H * 0.6);
    const wall = time === 'day' ? ['#6a5040', '#8a6a50', '#a8845e', '#c8a070'] : ['#1a0e16', '#2a1620', '#3e2228', '#5a3030'];
    let x = cityX;
    while (x < W * 0.48) {
      const bw = 5 + Math.floor(r() * 9), bh = 6 + Math.floor(r() * 12) + (x > W * 0.22 && x < W * 0.3 ? 12 : 0);
      for (let j = 0; j < bh; j++) for (let i = 0; i < bw; i++) p.set(x + i, base - j, tone(wall, i < 2 ? 0.8 : 0.45 - j * 0.01, x + i, base - j));
      for (let j = 3; j < bh - 1; j += 3) for (let i = 2; i < bw - 1; i += 3) if (r() > 0.55) p.set(x + i, base - j, time === 'day' ? '#3a2a20' : '#ffcf6a');
      x += bw + (r() > 0.7 ? 2 : 0);
    }
    // landing field beacon and a frigate
    p.rect(Math.round(W * 0.42), base - 26, 1, 26, wall[1]); p.set(Math.round(W * 0.42), base - 27, '#ff5a3a');
  }
  // middle dunes: asymmetric (gentle windward, steep lee), shaded by slope, crest highlight
  const duneLayer = (baseY: number, amp: number, f: number, ph: number, ramp: string[]) => {
    const prof = (x: number) => {
      const u = x * f + ph, s1 = (u / (Math.PI * 2)) % 1;
      const saw = s1 < 0.78 ? s1 / 0.78 : 1 - (s1 - 0.78) / 0.22; // slow rise, quick fall
      return baseY - amp * (0.75 * saw + 0.25 * Math.sin(u * 2.3));
    };
    for (let x = 0; x < W; x++) {
      const y0 = prof(x), slope = prof(x + 1) - prof(x - 1); // negative = rising to the right
      const lit = Math.max(0, Math.min(1, 0.62 - slope * 0.35));
      for (let y = Math.round(y0); y < H; y++) {
        const t = lit - (y - y0) * 0.01;
        p.set(x, y, tone(ramp, y === Math.round(y0) ? Math.min(1, lit + 0.3) : t, x, y));
      }
    }
  };
  const sandFar = time === 'night' ? ['#2a1420', '#3e1e28', '#5a2c30', '#7a4034'] : time === 'day' ? ['#a8703a', '#c88a48', '#e0a458', '#f4c47a'] : ['#5a2a28', '#8a4030', '#b8602e', '#e08a3e'];
  const sandNear = time === 'night' ? ['#3a1a20', '#5a2a28', '#7a3e30', '#a05a3a'] : time === 'day' ? ['#b87a40', '#d8964e', '#f0b062', '#ffd08a'] : ['#7a3a28', '#a85a30', '#d8803a', '#f4a852'];
  duneLayer(H * 0.68, 11, 0.022, r() * 6, sandFar);
  duneLayer(H * 0.84, 14, 0.017, r() * 6, sandNear);
  // ripples on the foreground
  for (let y = Math.round(H * 0.86); y < H; y += 3) for (let x = (y * 5) % 7; x < W; x += 9) { p.set(x, y, sandNear[0]); p.set(x + 1, y, sandNear[0]); p.set(x + 2, y - 1, sandNear[3]); }

  // the worm: a ringed column breaching the sand, maw open toward us
  if (o.worm !== false) {
    const wx = Math.round(W * 0.2), base = Math.round(H * 0.86), R = Math.round(H * 0.11), top = Math.round(H * 0.42);
    const body = ['#2a1a12', '#4e3020', '#7a4e30', '#a8784e', '#d0a070'];
    // sand spray fanning out from the breach
    for (let i = 0; i < 260; i++) { const a = Math.PI * (1.05 + r() * 0.9), d = R * (0.8 + r() * 1.6); p.set(wx + Math.cos(a) * d * 1.5, base - 1 + Math.sin(a) * d * 0.9, r() > 0.45 ? sandNear[3] : sandNear[2]); }
    for (let y = top; y < base; y++) {
      const lean = Math.round((base - y) * 0.18);
      for (let x = -R; x <= R; x++) {
        const nx = x / R, ring = (y - top) % 6 < 1 ? -0.35 : (y - top) % 6 === 1 ? 0.15 : 0;
        p.set(wx + x + lean, y, tone(body, 0.62 - nx * 0.5 + ring - Math.abs(nx) ** 4 * 0.4, wx + x, y));
      }
    }
    const mx = wx + Math.round((base - top) * 0.18), my = top;
    p.ellipse(mx, my, R + 1, R * 0.45 + 1, body[0]);
    p.ellipse(mx, my, R, R * 0.45, '#3a0e12');
    for (const [k, col] of [[0.92, '#fff0d0'], [0.7, '#e8d0a8'], [0.48, '#c8a888']] as [number, string][])
      for (let a = 0; a < 40; a++) { const t = (a / 40) * Math.PI * 2; p.set(mx + Math.cos(t) * R * k, my + Math.sin(t) * R * 0.45 * k, a % 2 ? col : '#5a1a1a'); }
    p.ellipse(mx, my, R * 0.28, R * 0.12, '#12040a');
    // falling sand curtain from the lip
    for (let i = 0; i < 40; i++) { const xx = mx - R + r() * R * 2; p.line(xx, my + 2, xx + (r() - 0.5) * 2, my + 2 + r() * R * 0.8, sandNear[2]); }
  }
  // ornithopter
  if (o.thopter !== false) {
    const tx = Math.round(W * 0.55), ty = Math.round(H * 0.3);
    const hull = ['#1a1418', '#2e2630', '#4a4048', '#7a6e70'];
    p.ellipse(tx, ty, 6, 2, (x, y, nx, ny) => tone(hull, 0.6 - ny * 0.6, x, y));
    p.rect(tx + 4, ty - 1, 2, 1, '#9fd0ff');
    p.line(tx - 14, ty - 4, tx - 2, ty - 1, hull[2]); p.line(tx + 2, ty - 1, tx + 12, ty - 5, hull[2]);
    p.line(tx - 14, ty - 3, tx - 2, ty, hull[1]); p.line(tx + 2, ty, tx + 12, ty - 4, hull[1]);
    p.line(tx - 6, ty, tx - 10, ty + 1, hull[1]);
  }
  // spice haze near the ground
  for (let y = Math.round(H * 0.63); y < H * 0.7; y++) for (let x = 0; x < W; x++) {
    if (((x * 3 + y * 7) % 13 === 0) && bayer(x, y) < 0.25) p.set(x, y, time === 'night' ? '#6a3040' : '#f4c47a');
  }
  return style(p, o.style ?? 'hibit', 'scene');
}

// ---------------------------------------------------------------- style treatments
const CINE = ['#0e0b0a', '#2b231e', '#5a4a3c', '#9a8266', '#d6c3a0', '#f2e6cc'];
const CODEX = ['#0b0a10', '#4a1f3c', '#8a3a3a', '#d8743a', '#f4b062', '#e0a458', '#f0cfa0', '#d8a070', '#a86a40', '#6e3e24', '#3a2418', '#8a8a9a', '#1d2a4a', '#2f5a8a', '#5f9fd0', '#2a5a3a', '#4f8f4a', '#8a1f2a', '#c8452e', '#6b3a10', '#c89020', '#f2c94a', '#f6ead2', '#6a3a7a', '#a87acb', '#5a3a2a', '#c9a27a'];

function style(p: Pix, s: ArtStyle, kind: 'portrait' | 'scene', accent?: string): Pix {
  if (s === 'hibit') return p;
  if (s === 'cine') {
    const out = new Pix(p.w, p.h);
    for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
      const c = p.get(x, y);
      if (!c) continue;
      // keep strong blues (Ibad eyes, windows) and hot oranges as the only accents
      const n = parseInt(c.slice(1, 7), 16), R = n >> 16, G = (n >> 8) & 255, B = n & 255;
      if (B > 150 && B > R + 40) { out.set(x, y, '#4f8fe0'); continue; }
      if (kind === 'scene' && R > 220 && G < 160 && B < 90) { out.set(x, y, '#e8742a'); continue; }
      // harder contrast curve, then dithered posterise to the sand/ash ramp
      let l = lum(c);
      l = Math.max(0, Math.min(1, (l - 0.5) * 1.35 + 0.5));
      out.set(x, y, tone(CINE, l, x, y));
    }
    if (kind === 'scene') { // letterbox to 2.39:1 and haze band
      const bar = Math.max(0, Math.round((p.h - p.w / 2.39) / 2));
      out.rect(0, 0, p.w, bar, '#000000'); out.rect(0, p.h - bar, p.w, bar, '#000000');
    }
    if (accent) out.rect(0, p.h - 1, p.w, 1, accent);
    return out;
  }
  // codex: map to a 16-colour jewel palette, then lead the boundaries
  const out = new Pix(p.w, p.h);
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
    const c = p.get(x, y);
    if (!c) continue;
    let best = CODEX[0], bd = Infinity;
    for (const k of CODEX) { const d = dist(c, k) * 1; if (d < bd) { bd = d; best = k; } }
    out.set(x, y, best);
  }
  const lead: [number, number][] = [];
  for (let y = 0; y < p.h - 1; y++) for (let x = 0; x < p.w - 1; x++) {
    const a = out.get(x, y), b = out.get(x + 1, y), c = out.get(x, y + 1);
    if (!a) continue;
    const big = (u: Col) => u && dist(a, u) > 9000;
    if (big(b) || big(c)) lead.push([x, y]);
  }
  for (const [x, y] of lead) out.set(x, y, '#0b0a10');
  if (kind === 'portrait') return framed(out);
  return gilt(out);
}

function framed(src: Pix): Pix {
  const p = new Pix(36, 36);
  const gold = ['#6b3a10', '#c89020', '#f2c94a', '#fff1b0'];
  for (let y = 0; y < 36; y++) for (let x = 0; x < 36; x++) {
    const edge = Math.min(x, y, 35 - x, 35 - y);
    if (edge < 2) p.set(x, y, tone(gold, edge === 0 ? 0.2 : 0.8 - (x + y) / 140, x, y));
  }
  p.blit(src, 2, 2);
  // corner rosettes
  for (const [cx, cy] of [[2, 2], [33, 2], [2, 33], [33, 33]]) { p.disc(cx, cy, 2.2, gold[2]); p.set(cx, cy, '#8a1f2a'); }
  return p;
}
function gilt(src: Pix): Pix {
  const p = new Pix(src.w + 8, src.h + 8);
  const gold = ['#6b3a10', '#c89020', '#f2c94a', '#fff1b0'];
  for (let y = 0; y < p.h; y++) for (let x = 0; x < p.w; x++) {
    const e = Math.min(x, y, p.w - 1 - x, p.h - 1 - y);
    if (e < 4) p.set(x, y, e === 0 || e === 3 ? '#0b0a10' : (x + y) % 6 < 3 ? gold[2] : gold[1]);
  }
  p.blit(src, 4, 4);
  return p;
}
