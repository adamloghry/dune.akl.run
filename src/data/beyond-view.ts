// Joins the later-books and other-screen material onto the canon timeline.
import { eras, type Era, type Event } from "./timeline";
import { euBooks, euEvents, euNotes, screens, altNotes } from "./beyond";
import type { EUEvent, EUKind } from "./beyond-types";

export type SpineItem = { t: "canon"; ev: Event } | { t: "eu"; ev: EUEvent };

export const euKindLabel: Record<EUKind, string> = { expands: "EXPANDS", retcon: "RETCON" };
export const euAuthors = "Brian Herbert & Kevin J. Anderson";

/** Canon events in order, with each later-books event placed after the event it names in `after`. */
export function spineFor(era: Era): SpineItem[] {
  const out: SpineItem[] = era.events.map((ev) => ({ t: "canon", ev }));
  const pending = euEvents.filter((e) => e.era === era.id);
  let guard = pending.length + 1;
  while (pending.length && guard--) {
    for (let i = pending.length - 1; i >= 0; i--) {
      const e = pending[i];
      const at = out.findIndex((x) => x.ev.id === e.after);
      if (at < 0) continue;
      // after the anchor and after any eu events already chained to it
      let j = at + 1;
      while (j < out.length && out[j].t === "eu") j++;
      out.splice(j, 0, { t: "eu", ev: e });
      pending.splice(i, 1);
    }
  }
  for (const e of pending) out.push({ t: "eu", ev: e }); // anchor missing: end of era
  return out;
}

export const euNotesFor = (id: string) => euNotes.filter((n) => n.event === id);
export const altNotesFor = (id: string) => altNotes.filter((n) => n.event === id);

export const retcons = [
  ...euEvents
    .filter((e) => e.kind === "retcon")
    .map((e) => ({ id: e.id, title: e.title, books: e.books, text: e.body, herbert: e.herbert ?? "" })),
  ...euNotes
    .filter((n) => n.kind === "retcon")
    .map((n) => {
      const ev = eras.flatMap((x) => x.events).find((x) => x.id === n.event);
      return {
        id: n.event,
        title: ev?.title ?? n.event,
        books: n.books,
        text: n.text,
        herbert: n.herbert ?? "",
      };
    }),
];

export { euBooks, euEvents, euNotes, screens, altNotes };
