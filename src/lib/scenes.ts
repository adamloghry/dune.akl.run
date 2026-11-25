// One painted view of Arrakis per era, following the planet's ecology through the saga:
// untouched desert, spice fields, Arrakeen, first gardens, greening, the green planet of the
// God Emperor with the Sareer kept as desert, the desert returning, and burned Rakis.
// Drawn in the base (hi-bit) palette; `style()` re-treats it for the cinematic look.
import { Pix, rng, bayer } from './pix';
import { arrakeen, tone, style, type ArtStyle } from './art';

const lum = (c: string) => {
  const n = parseInt(c.slice(1, 7), 16);
  return (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255;
};
/** Re-colour pixels below y0 (where `keep` is false) onto a new ramp by brightness. */
function recolor(p: Pix, y0: number, ramp: string[], keep: (x: number, y: number) => boolean = () => false, gain = 1.25) {
  for (let y = Math.round(y0); y < p.h; y++) for (let x = 0; x < p.w; x++) {
    const c = p.get(x, y);
    if (!c || keep(x, y)) continue;
    p.set(x, y, tone(ramp, Math.min(1, lum(c) * gain), x, y));
  }
}
// smooth value noise (bilinear, smoothstep) for patchy plantings; rows are stretched so patches
// lie flat like fields seen from a distance
const hash = (i: number, j: number, seed: number) => { const h = Math.sin(i * 127.1 + j * 311.7 + seed) * 43758.5453; return h - Math.floor(h); };
const cell = (x: number, y: number, s: number, seed: number) => {
  const u = x / (s * 2), v = y / s, i = Math.floor(u), j = Math.floor(v);
  const fx = u - i, fy = v - j, sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const a = hash(i, j, seed), b = hash(i + 1, j, seed), c = hash(i, j + 1, seed), d = hash(i + 1, j + 1, seed);
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy + (bayer(x, y) - 0.5) * 0.08;
};
const GREEN = ['#1f3a22', '#2f5a2c', '#4f8a3a', '#8ab85a'];
const FOREST = ['#12261a', '#1f3a22', '#2f5a2c', '#4a7a36'];
const WATER = ['#1a3a5a', '#2f6a9a', '#6fb0e0', '#c8e8ff'];

function spiceBlow(p: Pix, x: number, base: number, h: number, r: () => number) {
  const plume = ['#6a1a10', '#a8321e', '#e0602a', '#ffa050'];
  for (let i = 0; i < h * 14; i++) {
    const t = r(), y = base - t * h, w = 2 + t * h * 0.45;
    const xx = x + (r() - 0.5) * w * 2 + t * t * 10;
    p.set(xx, y, tone(plume, 0.3 + 0.7 * (1 - t) * r(), Math.round(xx), Math.round(y)));
  }
}
function harvester(p: Pix, x: number, y: number) {
  const hull = ['#2a2420', '#4a4038', '#7a6a58', '#a89880'];
  p.rect(x, y, 22, 7, hull[1]); p.rect(x + 1, y, 20, 2, hull[2]); p.rect(x + 2, y - 3, 8, 3, hull[1]);
  for (let i = 0; i < 22; i += 3) p.set(x + i, y + 7, hull[0]);
  p.rect(x + 22, y + 2, 3, 3, hull[0]);
  // carryall overhead
  p.rect(x + 2, y - 16, 18, 3, hull[0]); p.line(x - 3, y - 17, x + 25, y - 17, hull[2]);
  p.line(x + 6, y - 13, x + 6, y - 3, hull[0]); p.line(x + 16, y - 13, x + 16, y - 3, hull[0]);
  // dust
  for (let i = 0; i < 40; i++) p.set(x - 2 - i % 9, y + 7 - Math.floor(i / 9), i % 3 ? '#e0a458' : '#f4c47a');
}
function citadel(p: Pix, x: number, base: number, h: number) {
  const st = ['#1a1418', '#3a3036', '#6a5a5e', '#a89a98'];
  for (let y = base - h; y < base; y++) for (let i = -4; i <= 4; i++) p.set(x + i, y, tone(st, 0.65 - i * 0.09, x + i, y));
  p.rect(x - 6, base - h - 3, 13, 3, st[1]); p.rect(x - 1, base - h - 7, 3, 4, st[2]);
  for (let y = base - h + 4; y < base - 3; y += 6) p.set(x - 1, y, '#ffcf6a');
}
function ruins(p: Pix, x0: number, x1: number, base: number, r: () => number, ramp: string[]) {
  let x = x0;
  while (x < x1) {
    const w = 3 + Math.floor(r() * 6), h = 3 + Math.floor(r() * 10);
    for (let j = 0; j < h; j++) {
      const ragged = j > h - 3 ? Math.floor(r() * w) : w;
      for (let i = 0; i < ragged; i++) p.set(x + i, base - j, tone(ramp, i < 1 ? 0.8 : 0.4, x + i, base - j));
    }
    x += w + 2 + Math.floor(r() * 6);
  }
}

export function arrakis(era: string, W = 320, H = 80, s: ArtStyle = 'hibit'): Pix {
  const r = rng(W * 31 + era.length * 977);
  let p: Pix;
  switch (era) {
    case 'old-empire':
      p = arrakeen({ w: W, h: H, time: 'day', city: false, thopter: false, worm: true, seed: 88, style: 'hibit' });
      break;
    case 'imperium':
      p = arrakeen({ w: W, h: H, time: 'dusk', city: false, thopter: false, worm: false, seed: 400, style: 'hibit' });
      spiceBlow(p, W * 0.72, Math.round(H * 0.74), Math.round(H * 0.5), r);
      harvester(p, Math.round(W * 0.36), Math.round(H * 0.72));
      break;
    case 'dune':
      p = arrakeen({ w: W, h: H, time: 'dusk', seed: 10191, style: 'hibit' });
      break;
    case 'messiah': {
      p = arrakeen({ w: W, h: H, time: 'day', worm: false, seed: 10205, style: 'hibit' });
      // irrigated plots and a qanat below the city
      const y0 = Math.round(H * 0.66);
      recolor(p, y0, GREEN, (x, y) => x > W * 0.5 - (y - y0) * 0.6 || cell(x, y, 5, 3) > 0.5 || y > H * 0.9);
      for (let x = 0; x < W * 0.6; x++) { const y = Math.round(H * 0.88 + Math.sin(x * 0.05) * 2); p.set(x, y, WATER[2]); p.set(x, y + 1, WATER[1]); }
      break;
    }
    case 'children': {
      p = arrakeen({ w: W, h: H, time: 'day', city: false, worm: false, thopter: true, seed: 10214, style: 'hibit' });
      recolor(p, H * 0.6, GREEN, (x, y) => cell(x, y, 7, 7) > 0.3 + (x / W) * 0.45);
      // rain clouds over the planted lands
      for (const [cx, cy, rr] of [[W * 0.2, H * 0.16, 9], [W * 0.27, H * 0.13, 7], [W * 0.5, H * 0.2, 6]] as number[][])
        p.ellipse(cx, cy, rr * 1.8, rr * 0.6, (x, y, nx, ny) => tone(['#7a8a98', '#a8b4c0', '#dce4ea', '#f4f8fa'], 0.8 - ny * 0.5, x, y));
      for (let i = 0; i < 60; i++) { const x = Math.round(W * 0.12 + r() * W * 0.22), y = Math.round(H * 0.22 + r() * H * 0.3); p.set(x, y, '#9fb8d0'); }
      break;
    }
    case 'god-emperor': {
      p = arrakeen({ w: W, h: H, time: 'day', city: false, worm: false, thopter: false, seed: 13714, style: 'hibit' });
      const sareer = (x: number, y = 0) => { const w = Math.sin(y * 0.4 + x * 0.05) * 3 + (cell(x, y, 5, 17) - 0.5) * 8; return x > W * 0.62 + w && x < W * 0.86 + w; };
      recolor(p, H * 0.4, GREEN, (x, y) => sareer(x, y) && y > H * 0.55);
      // forest on the far slopes
      for (let i = 0; i < W * 1.6; i++) {
        const x = Math.round(r() * W), y = Math.round(H * (0.5 + r() * 0.22));
        if (sareer(x, y) && y > H * 0.55) continue;
        p.disc(x, y, 1.6, (xx, yy, nx, ny) => tone(FOREST, 0.7 - nx * 0.4 - ny * 0.3, xx, yy));
      }
      // a river running to the sea, and the Citadel
      for (let x = 0; x < W * 0.6; x++) {
        const y = Math.round(H * 0.82 + Math.sin(x * 0.035) * 4);
        for (let k = 0; k < 3; k++) p.set(x, y + k, tone(WATER, 0.75 - k * 0.2, x, y + k));
      }
      citadel(p, Math.round(W * 0.74), Math.round(H * 0.7), Math.round(H * 0.42));
      break;
    }
    case 'scattering': {
      p = arrakeen({ w: W, h: H, time: 'dusk', city: false, worm: true, thopter: false, seed: 14500, style: 'hibit' });
      ruins(p, W * 0.38, W * 0.62, Math.round(H * 0.62), r, ['#2a1624', '#3e2030', '#5e3038', '#8a4a3a']);
            break;
    }
    case 'heretics':
    default: {
      p = arrakeen({ w: W, h: H, time: 'night', city: false, worm: false, thopter: false, seed: 15214, style: 'hibit' });
      // the Honored Matres' attack: sky lit red, the sand fused to black glass, fires
      recolor(p, 0, ['#1a0608', '#4a0e10', '#8a1f1a', '#d8502a'], (x, y) => y > H * 0.62, 1.6);
      recolor(p, H * 0.62, ['#07040a', '#141018', '#2a2028', '#5a4a50'], () => false, 1.4);
      for (let i = 0; i < 14; i++) {
        const fx = Math.round(r() * W), fy = Math.round(H * (0.66 + r() * 0.3));
        for (let k = 0; k < 6; k++) p.set(fx + (k % 3) - 1, fy - Math.floor(k / 2), k < 2 ? '#ffd060' : k < 4 ? '#ff7a1a' : '#c8452e');
        for (let k = 0; k < 10; k++) if (bayer(fx, fy - 6 - k) < 0.5) p.set(fx + Math.round(Math.sin(k * 0.7) * 2), fy - 6 - k, '#3a2a2e');
      }
      ruins(p, W * 0.1, W * 0.3, Math.round(H * 0.64), r, ['#07040a', '#141018', '#2a2028', '#5a4a50']);
    }
  }
  return style(p, s, 'scene');
}
