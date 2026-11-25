// A tiny pixel canvas used at build time. Everything is drawn into a grid of colours, then
// exported as a compact SVG (one <path> per colour, horizontal runs merged) or as a PNG (for
// share images). Deterministic: no randomness unless you pass a seeded rng.
import { deflateSync } from 'node:zlib';

export type Col = string | null; // '#rrggbb', a CSS colour such as 'var(--sand)', or null = transparent

// 4x4 ordered-dither matrix, values 0..15
const BAYER = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
export const bayer = (x: number, y: number) => (BAYER[(y & 3) * 4 + (x & 3)] + 0.5) / 16;

export function rng(seed: number) {
  let a = seed | 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class Pix {
  readonly w: number;
  readonly h: number;
  readonly px: Col[];
  constructor(w: number, h: number, fill: Col = null) {
    this.w = w; this.h = h;
    this.px = new Array(w * h).fill(fill);
  }
  set(x: number, y: number, c: Col) {
    x = Math.round(x); y = Math.round(y);
    if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.px[y * this.w + x] = c;
  }
  get(x: number, y: number): Col {
    return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.px[y * this.w + x] : null;
  }
  rect(x: number, y: number, w: number, h: number, c: Col) {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) this.set(i, j, c);
  }
  line(x0: number, y0: number, x1: number, y1: number, c: Col) {
    x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
    const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
    let err = dx + dy;
    for (;;) {
      this.set(x0, y0, c);
      if (x0 === x1 && y0 === y1) break;
      const e2 = 2 * err;
      if (e2 >= dy) { err += dy; x0 += sx; }
      if (e2 <= dx) { err += dx; y0 += sy; }
    }
  }
  /** Filled ellipse. `shade(x, y, nx, ny)` may return a colour per pixel (nx, ny in -1..1). */
  ellipse(cx: number, cy: number, rx: number, ry: number, c: Col | ((x: number, y: number, nx: number, ny: number) => Col)) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y++)
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x++) {
        const nx = (x + 0.5 - cx) / rx, ny = (y + 0.5 - cy) / ry;
        if (nx * nx + ny * ny <= 1) this.set(x, y, typeof c === 'function' ? c(x, y, nx, ny) : c);
      }
  }
  disc(cx: number, cy: number, r: number, c: Col | ((x: number, y: number, nx: number, ny: number) => Col)) {
    this.ellipse(cx, cy, r, r, c);
  }
  /** Scanline polygon fill (even-odd). */
  poly(pts: [number, number][], c: Col | ((x: number, y: number) => Col)) {
    const ys = pts.map((p) => p[1]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y++) {
      const yc = y + 0.5, xs: number[] = [];
      for (let i = 0; i < pts.length; i++) {
        const [x0, y0] = pts[i], [x1, y1] = pts[(i + 1) % pts.length];
        if ((y0 <= yc && y1 > yc) || (y1 <= yc && y0 > yc)) xs.push(x0 + ((yc - y0) / (y1 - y0)) * (x1 - x0));
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2)
        for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x++) this.set(x, y, typeof c === 'function' ? c(x, y) : c);
    }
  }
  /** Fill a rect with a dithered ramp through `cols`, top to bottom (or left to right). */
  ramp(x: number, y: number, w: number, h: number, cols: Col[], dir: 'v' | 'h' = 'v') {
    const n = cols.length - 1;
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) {
      const t = dir === 'v' ? (j - y) / Math.max(1, h - 1) : (i - x) / Math.max(1, w - 1);
      const f = t * n, k = Math.min(n - 1, Math.floor(f));
      this.set(i, j, f - k > bayer(i, j) ? cols[k + 1] : cols[k]);
    }
  }
  /** Pick between two colours with ordered dither at amount t (0 → a, 1 → b). */
  static mix(a: Col, b: Col, t: number, x: number, y: number): Col {
    return t > bayer(x, y) ? b : a;
  }
  /** Copy another canvas onto this one; null pixels are transparent. */
  blit(src: Pix, ox: number, oy: number, opts: { flip?: boolean; map?: (c: Col) => Col } = {}) {
    for (let y = 0; y < src.h; y++) for (let x = 0; x < src.w; x++) {
      let c = src.px[y * src.w + (opts.flip ? src.w - 1 - x : x)];
      if (opts.map) c = opts.map(c);
      if (c) this.set(ox + x, oy + y, c);
    }
  }
  /** Draw a character-grid sprite (as in sprites.ts) with a palette map. */
  grid(rows: string[], ox: number, oy: number, pal: Record<string, Col>, scale = 1) {
    rows.forEach((row, y) => [...row].forEach((ch, x) => {
      const c = pal[ch];
      if (c) this.rect(ox + x * scale, oy + y * scale, scale, scale, c);
    }));
  }
  /** 1px outline around non-null pixels (outside only). */
  outline(c: Col) {
    const add: number[] = [];
    for (let y = 0; y < this.h; y++) for (let x = 0; x < this.w; x++) {
      if (this.get(x, y)) continue;
      if (this.get(x - 1, y) || this.get(x + 1, y) || this.get(x, y - 1) || this.get(x, y + 1)) add.push(y * this.w + x);
    }
    for (const i of add) this.px[i] = c;
  }

  /** Compact SVG: one path per colour; CSS colours (var(...)) go in style so they re-theme. */
  toSVG(o: { cls?: string; width?: number | string; height?: number | string; label?: string; preserve?: string; style?: string } = {}) {
    const byCol = new Map<string, string[]>();
    for (let y = 0; y < this.h; y++) {
      let x = 0;
      while (x < this.w) {
        const c = this.px[y * this.w + x];
        let run = 1;
        while (x + run < this.w && this.px[y * this.w + x + run] === c) run++;
        if (c) {
          if (!byCol.has(c)) byCol.set(c, []);
          byCol.get(c)!.push(`M${x} ${y}h${run}v1h-${run}z`);
        }
        x += run;
      }
    }
    const paths = [...byCol.entries()]
      .map(([c, d]) => (c.startsWith('#') ? `<path fill="${c}" d="${d.join('')}"/>` : `<path style="fill:${c}" d="${d.join('')}"/>`))
      .join('');
    const a11y = o.label ? `role="img" aria-label="${o.label.replace(/"/g, '&quot;')}"` : 'aria-hidden="true"';
    const size = `${o.width != null ? ` width="${o.width}"` : ''}${o.height != null ? ` height="${o.height}"` : ''}`;
    return `<svg class="${o.cls ?? 'pix'}" viewBox="0 0 ${this.w} ${this.h}"${size} shape-rendering="crispEdges" preserveAspectRatio="${o.preserve ?? 'xMidYMid meet'}"${o.style ? ` style="${o.style}"` : ''} ${a11y}>${paths}</svg>`;
  }

  /** PNG bytes, each pixel scaled up `scale` times. CSS colours must be resolved first (hex only). */
  toPNG(scale = 1, bg = '#000000'): Uint8Array {
    const W = this.w * scale, H = this.h * scale;
    const hex = (c: Col) => {
      const s = c && c.startsWith('#') ? c : bg;
      const n = parseInt(s.slice(1, 7), 16);
      return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    };
    const raw = Buffer.alloc((W * 3 + 1) * H);
    for (let y = 0; y < this.h; y++) {
      const line = Buffer.alloc(W * 3);
      for (let x = 0; x < this.w; x++) {
        const [r, g, b] = hex(this.px[y * this.w + x]);
        for (let s = 0; s < scale; s++) { const o = (x * scale + s) * 3; line[o] = r; line[o + 1] = g; line[o + 2] = b; }
      }
      for (let s = 0; s < scale; s++) {
        const o = (y * scale + s) * (W * 3 + 1);
        raw[o] = 0; line.copy(raw, o + 1);
      }
    }
    const chunk = (type: string, data: Buffer) => {
      const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
      const td = Buffer.concat([Buffer.from(type, 'ascii'), data]);
      const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td) >>> 0);
      return Buffer.concat([len, td, crc]);
    };
    const ihdr = Buffer.alloc(13);
    ihdr.writeUInt32BE(W, 0); ihdr.writeUInt32BE(H, 4);
    ihdr[8] = 8; ihdr[9] = 2; ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0;
    const png = Buffer.concat([
      Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      chunk('IHDR', ihdr),
      chunk('IDAT', deflateSync(raw, { level: 9 })),
      chunk('IEND', Buffer.alloc(0)),
    ]);
    return new Uint8Array(png);
  }
}

let CRC: Int32Array | null = null;
function crc32(buf: Buffer) {
  if (!CRC) {
    CRC = new Int32Array(256);
    for (let n = 0; n < 256; n++) { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; CRC[n] = c; }
  }
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC[(c ^ buf[i]) & 255] ^ (c >>> 8);
  return c ^ -1;
}

// ---- colour helpers (hex only)
export function shade(hex: string, k: number) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `#${[f(n >> 16), f((n >> 8) & 255), f(n & 255)].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}
export function lerp(a: string, b: string, t: number) {
  const p = (h: string) => { const n = parseInt(h.slice(1), 16); return [n >> 16, (n >> 8) & 255, n & 255]; };
  const A = p(a), B = p(b);
  return `#${A.map((v, i) => Math.round(v + (B[i] - v) * t).toString(16).padStart(2, '0')).join('')}`;
}
/** A shading ramp from deep shadow to highlight around a base colour. */
export function rampOf(base: string, n = 5, shadow = '#1a0f14', light = '#fff3d6') {
  const out: string[] = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    out.push(t < 0.5 ? lerp(lerp(shadow, base, 0.35), base, t * 2) : lerp(base, lerp(base, light, 0.55), (t - 0.5) * 2));
  }
  return out;
}
