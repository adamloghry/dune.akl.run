// Flat search index built at compile time and embedded in /search/ (no fetch, no server).
import { eras, kindLabel } from './timeline';
import { characters, factions } from './cast';
import { euEvents, euNotesFor, altNotesFor, screens } from './beyond-view';

export interface Doc { k: 'event' | 'character' | 'faction'; t: string; s: string; b: string; u: string }

export function buildIndex(base: string): Doc[] {
  const docs: Doc[] = [];
  for (const era of eras)
    for (const ev of era.events)
      docs.push({
        k: 'event',
        t: ev.title,
        s: `${ev.when} · ${era.name}`,
        b: [ev.body, ...(ev.films ?? []).map((f) => `${kindLabel[f.kind]} in the films: ${f.text}`),
          ...euNotesFor(ev.id).map((n) => `Later books: ${n.text}`),
          ...altNotesFor(ev.id).map((n) => `${screens[n.screen].title}: ${n.text}`)].join(' '),
        u: `${base}/#${ev.id}`,
      });
  for (const ev of euEvents)
    docs.push({
      k: 'event',
      t: ev.title,
      s: `${ev.when} · later books${ev.kind === 'retcon' ? ' · retcon' : ''}`,
      b: [ev.body, ev.herbert ? `Frank Herbert wrote: ${ev.herbert}` : '', ...altNotesFor(ev.id).map((n) => `${screens[n.screen].title}: ${n.text}`)].join(' '),
      u: `${base}/#${ev.id}`,
    });
  for (const c of characters)
    docs.push({
      k: 'character',
      t: c.name,
      s: c.aka ?? '',
      b: [c.blurb, ...Object.values(c.arc ?? {}), c.film ? `${c.film.actor}. ${c.film.note}` : ''].join(' '),
      u: `${base}/characters/${c.id}/`,
    });
  for (const f of factions)
    docs.push({
      k: 'faction',
      t: f.name,
      s: [f.aka, f.kind].filter(Boolean).join(' · '),
      b: [f.blurb, ...Object.values(f.arc ?? {}), f.film ?? ''].join(' '),
      u: `${base}/factions/${f.id}/`,
    });
  return docs;
}
