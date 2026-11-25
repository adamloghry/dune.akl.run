import { eras, type Event, type Era } from "./timeline";
import { characters, factions, tags, eraOrder, type EraId } from "./cast";

export interface Placed {
  ev: Event;
  era: Era;
}

export const allEvents: Placed[] = eras.flatMap((era) => era.events.map((ev) => ({ ev, era })));

export const eventsFor = (kind: "who" | "f", id: string): Placed[] =>
  allEvents.filter(({ ev }) => (tags[ev.id]?.[kind] ?? []).includes(id));

export const whoIn = (evId: string) => tags[evId]?.who ?? [];
export const factionsIn = (evId: string) => tags[evId]?.f ?? [];

/** Characters who share events with `id`, ranked by number of shared events. */
export function companions(id: string) {
  const counts = new Map<string, number>();
  for (const { ev } of eventsFor("who", id))
    for (const o of whoIn(ev.id)) if (o !== id) counts.set(o, (counts.get(o) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1]);
}

/** Faction × faction co-occurrence across events (how often they are in the same story). */
export function factionLinks() {
  const m = new Map<string, number>();
  for (const { ev } of allEvents) {
    const fs = factionsIn(ev.id);
    for (let i = 0; i < fs.length; i++)
      for (let j = i + 1; j < fs.length; j++) {
        const k = [fs[i], fs[j]].sort().join("|");
        m.set(k, (m.get(k) ?? 0) + 1);
      }
  }
  return m;
}

export const eraIndex = (id: EraId) => eraOrder.indexOf(id);
export const eraName = (id: string) => eras.find((e) => e.id === id)?.name ?? id;
export { characters, factions, eraOrder };
