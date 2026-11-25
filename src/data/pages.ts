// Every event, canon and later-books, as one list in chronicle order: the source for the
// per-event pages and their share cards.
import { eras, type Era, type Event } from './timeline';
import { spineFor, euBooks } from './beyond-view';
import type { EUEvent } from './beyond-types';
import { eventLevel, type Level } from './spoilers';

export interface EventPage {
  id: string;
  title: string;
  when: string;
  book: string;
  era: Era;
  level: Level;
  later: boolean;
  canon?: Event;
  eu?: EUEvent;
}

export const eventPages: EventPage[] = eras.flatMap((era) =>
  spineFor(era).map((s): EventPage => {
    if (s.t === 'canon') return { id: s.ev.id, title: s.ev.title, when: s.ev.when, book: s.ev.book, era, level: eventLevel(s.ev.id), later: false, canon: s.ev };
    const e = s.ev;
    const book = e.books.map((b) => euBooks[b]?.title ?? b).join(', ');
    return { id: e.id, title: e.title, when: e.when, book, era, level: eventLevel(e.id), later: true, eu: e };
  }),
);

const canonOnly = eventPages.filter((p) => !p.later);

/** The canon events either side, so the pages read as a chronicle. Later-books pages sit
 * between the canon event they follow and the next one. */
export function neighbours(id: string): { prev?: EventPage; next?: EventPage } {
  const i = eventPages.findIndex((p) => p.id === id);
  let a = i - 1, b = i + 1;
  while (a >= 0 && eventPages[a].later) a--;
  while (b < eventPages.length && eventPages[b].later) b++;
  return { prev: eventPages[a], next: eventPages[b] };
}
export { canonOnly };
