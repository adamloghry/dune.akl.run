// Flat search index built at compile time and embedded in /search/ (no fetch, no server).
import { eras, kindLabel } from './timeline';
import { characters, factions } from './cast';
import { euEvents, euNotesFor, altNotesFor, screens } from './beyond-view';
import { eventLevel, blurbLevel, facBlurb, lastLevel, levelShort, type Level } from './spoilers';
import type { EraId } from './cast';

export interface Doc { k: 'event' | 'character' | 'faction'; t: string; s: string; b: string; u: string; p?: number; pl?: string }
const withLevel = (d: Doc, n: number): Doc => (n > 1 ? { ...d, p: n, pl: levelShort[n as Level] } : d);

export function buildIndex(base: string): Doc[] {
  const docs: Doc[] = [];
  for (const era of eras)
    for (const ev of era.events)
      docs.push(withLevel({
        k: 'event',
        t: ev.title,
        s: `${ev.when} · ${era.name}`,
        b: [ev.body, ...(ev.films ?? []).map((f) => `${kindLabel[f.kind]} in the films: ${f.text}`),
          ...euNotesFor(ev.id).map((n) => `Later books: ${n.text}`),
          ...altNotesFor(ev.id).map((n) => `${screens[n.screen].title}: ${n.text}`)].join(' '),
        u: `${base}/#${ev.id}`,
      }, Math.max(eventLevel(ev.id), euNotesFor(ev.id).length ? 2 : 1)));
  for (const ev of euEvents)
    docs.push(withLevel({
      k: 'event',
      t: ev.title,
      s: `${ev.when} · later books${ev.kind === 'retcon' ? ' · retcon' : ''}`,
      b: [ev.body, ev.herbert ? `Frank Herbert wrote: ${ev.herbert}` : '', ...altNotesFor(ev.id).map((n) => `${screens[n.screen].title}: ${n.text}`)].join(' '),
      u: `${base}/#${ev.id}`,
    }, eventLevel(ev.id)));
  for (const c of characters)
    docs.push(withLevel({
      k: 'character',
      t: c.name,
      s: c.aka ?? '',
      b: [c.blurb, ...Object.values(c.arc ?? {}), c.film ? `${c.film.actor}. ${c.film.note}` : ''].join(' '),
      u: `${base}/characters/${c.id}/`,
    }, Math.max(blurbLevel(c.id), lastLevel(c.arc as Partial<Record<EraId, string>>))));
  for (const f of factions)
    docs.push(withLevel({
      k: 'faction',
      t: f.name,
      s: [f.aka, f.kind].filter(Boolean).join(' · '),
      b: [f.blurb, ...Object.values(f.arc ?? {}), f.film ?? ''].join(' '),
      u: `${base}/factions/${f.id}/`,
    }, Math.max(facBlurb(f.id), lastLevel(f.arc as Partial<Record<EraId, string>>))));
  return docs;
}
