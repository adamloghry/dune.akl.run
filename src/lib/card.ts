// Share cards: a 240x126 pixel-art image per event, drawn at build time and scaled 5x to the
// 1200x630 size that link previews use. Events past Dune get a spoiler card that names the book
// but not what happens, so pasting a link into a chat gives nothing away.
import { Pix, bayer, shade } from './pix';
import { drawText, textWidth, wrap } from './font';
import { arrakeen, type SceneOpts } from './art';
import { ART } from './style';
import { sprites } from '../data/sprites';
import { levels, type Level } from '../data/spoilers';

export const CARD_W = 240, CARD_H = 126, CARD_SCALE = 5;

// Hex colours for the sprite palette letters (the dark theme).
const SPRITE: Record<string, string> = {
  k: '#07040a', s: '#e0a458', d: '#a86a34', o: '#ff7a1a', y: '#ffcf4a', b: '#4fa3ff', w: '#f6ead2', r: '#c8452e',
};

/** One look per era, so cards from different books are told apart at a glance. */
export const eraScene: Record<string, SceneOpts & { tint: string }> = {
  'old-empire': { time: 'night', city: false, worm: false, thopter: false, seed: 88, tint: '#c8452e' },
  imperium: { time: 'night', city: false, worm: false, thopter: true, seed: 400, tint: '#4fa3ff' },
  dune: { time: 'dusk', seed: 10191, tint: '#ff7a1a' },
  messiah: { time: 'dusk', worm: false, seed: 10205, tint: '#ffcf4a' },
  children: { time: 'day', city: false, seed: 10214, tint: '#4fa3ff' },
  'god-emperor': { time: 'day', city: false, thopter: false, seed: 13714, tint: '#e0a458' },
  scattering: { time: 'night', city: false, worm: false, thopter: true, seed: 14500, tint: '#a86a34' },
  heretics: { time: 'night', city: false, seed: 15214, tint: '#c8452e' },
};

const eraShort: Record<string, string> = {
  'old-empire': 'The Old Empire', imperium: 'The Imperium', dune: 'Dune', messiah: 'Dune Messiah',
  children: 'Children of Dune', 'god-emperor': 'God Emperor', scattering: 'The Scattering', heretics: 'Heretics',
};

/** The era's landscape alone, for the top of an event page. */
export function eraBackdrop(era: string, w = 320, h = 96): Pix {
  const { tint: _t, ...o } = eraScene[era] ?? eraScene.dune;
  return arrakeen({ ...o, w, h, style: ART });
}

function sprite(p: Pix, name: string, x: number, y: number, k = 1) {
  const g = sprites[name] ?? sprites.worm;
  g.forEach((row, j) => [...row].forEach((c, i) => {
    if (c === '.') return;
    p.rect(x + i * k, y + j * k, k, k, SPRITE[c] ?? '#f6ead2');
  }));
}

export interface CardIn {
  title: string;
  when: string;
  book: string;
  era: string;
  eraName: string;
  sprite: string;
  level: Level;
  later?: boolean; // Brian Herbert & Kevin J. Anderson
}

const BG = '#140c1a', INK = '#f2e2c4', INK2 = '#c9b18d', GOLD = '#ffcf4a', LINE = '#4a3550';

export function shareCard(c: CardIn): Pix {
  const W = CARD_W, H = CARD_H;
  const look = eraScene[c.era] ?? eraScene.dune;
  const { tint, ...o } = look;
  const scene = arrakeen({ ...o, w: W, h: 64, style: ART });
  const p = new Pix(W, H, BG);
  for (let y = 0; y < scene.h; y++) for (let x = 0; x < W; x++) p.set(x, y, scene.get(x, y) ?? BG);
  // dithered fade from the scene into the text panel
  for (let y = 44; y < 62; y++) for (let x = 0; x < W; x++) if ((y - 44) / 18 > bayer(x, y)) p.set(x, y, BG);
  // frame
  p.rect(0, 0, W, 2, LINE); p.rect(0, H - 2, W, 2, LINE); p.rect(0, 0, 2, H, LINE); p.rect(W - 2, 0, 2, H, LINE);
  p.rect(2, H - 5, W - 4, 3, tint);

  // brand, top left, on a dark tab
  const brand = 'THE GOLDEN PATH';
  p.rect(2, 2, textWidth(brand) + 22, 13, BG);
  p.disc(10, 8, 4, GOLD); p.disc(10, 8, 2, BG);
  drawText(p, brand, 18, 5, INK);
  // era, top right
  const era = (eraShort[c.era] ?? c.eraName).toUpperCase();
  const ew = textWidth(era);
  p.rect(W - ew - 10, 2, ew + 8, 13, BG);
  drawText(p, era, W - ew - 6, 5, tint);

  // later books: a dashed tag under the era, so it is never read as Frank Herbert
  if (c.later) {
    const t = 'LATER BOOKS - NOT FRANK HERBERT';
    const tw = textWidth(t), tx = W - tw - 6, ty = 19;
    p.rect(tx - 4, ty - 3, tw + 8, 13, BG);
    for (let x = tx - 4; x < tx + tw + 4; x += 3) { p.set(x, ty - 3, INK2); p.set(x, ty + 9, INK2); }
    drawText(p, t, tx, ty, INK2);
  }
  // the era sprite, bottom left of the scene, on a plate
  p.rect(8, 34, 36, 36, BG); p.rect(8, 34, 36, 2, tint);
  sprite(p, c.sprite, 10, 38, 2);

  const spoil = c.level >= 3;
  const short = levels.find((l) => l.n === c.level)?.short ?? '';
  const x0 = 52, maxW = W - x0 - 8;
  let y = 66;
  const full = `${c.when} - ${c.book}`;
  const meta = textWidth(full) <= maxW ? full : wrap(c.when, maxW)[0];
  drawText(p, meta, x0, y, GOLD);
  y += 13;
  const title = spoil ? `A ${short} spoiler` : c.title;
  const big = wrap(title, maxW, 2);
  const lines = big.length <= 2 && y + big.length * 16 <= H - 8 ? { l: big, k: 2 } : { l: wrap(title, maxW, 1).slice(0, 4), k: 1 };
  for (const line of lines.l) {
    drawText(p, line, x0, y, INK, lines.k, shade(BG, 0.5));
    y += lines.k === 2 ? 16 : 9;
  }
  if (spoil && y + 9 <= H - 6) drawText(p, 'OPEN THE LINK TO READ IT', x0, y + 2, INK2);
  return p;
}

/** The card for pages that are not about one event. */
export function siteCard(): Pix {
  const W = CARD_W, H = CARD_H;
  const p = new Pix(W, H, BG);
  const scene = arrakeen({ w: W, h: H, style: ART, seed: 10191 });
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) p.set(x, y, scene.get(x, y) ?? BG);
  p.rect(0, 0, W, 2, LINE); p.rect(0, H - 2, W, 2, LINE); p.rect(0, 0, 2, H, LINE); p.rect(W - 2, 0, 2, H, LINE);
  const t = 'THE GOLDEN PATH';
  const tw = textWidth(t, 2);
  p.rect((W - tw) / 2 - 8, 14, tw + 16, 34, BG);
  drawText(p, t, Math.round((W - tw) / 2), 18, GOLD, 2, '#07040a');
  const s = 'A HISTORY OF THE DUNE SAGA';
  drawText(p, s, Math.round((W - textWidth(s)) / 2), 38, INK);
  return p;
}
