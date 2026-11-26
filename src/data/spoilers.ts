// Spoiler shield. Every piece of content gets the reading point at which it stops being a
// spoiler: 1 = Dune: Part One (the film, or the novel up to Jamis's duel) … 7 = Chapterhouse.
// The reader picks how far they have got; anything with a higher level is veiled until tapped.
// Nothing is veiled until the reader picks a level, and nothing is veiled without JavaScript.
import { eras, type Era } from "./timeline";
import type { EraId } from "./cast";
import { euEvents } from "./beyond";

export type Level = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** What the reader can choose. "Everything" (no shield) is 7. */
export const levels: { n: Level; label: string; short: string }[] = [
  { n: 1, label: "Dune: Part One, the film (the novel up to Jamis)", short: "Part One" },
  { n: 2, label: "Dune: Part Two, or the whole novel Dune", short: "Dune" },
  { n: 3, label: "Dune Messiah", short: "Messiah" },
  { n: 4, label: "Children of Dune", short: "Children of Dune" },
  { n: 5, label: "God Emperor of Dune", short: "God Emperor" },
  { n: 6, label: "Heretics of Dune", short: "Heretics" },
  { n: 7, label: "Everything, Chapterhouse included", short: "Chapterhouse" },
];
export const levelShort = Object.fromEntries(levels.map((l) => [l.n, l.short])) as Record<Level, string>;

// Dune is split at the end of the first film, which ends on Jamis's duel.
const PART_ONE = new Set(["gom-jabbar", "arrakeen", "betrayal", "kynes-death", "stilltent", "jamis"]);
const byBook: Record<string, Level> = {
  APPENDIX: 1,
  DUNE: 2,
  MESSIAH: 3,
  CHILDREN: 4,
  "GOD EMPEROR": 5,
  HERETICS: 6,
  CHAPTERHOUSE: 7,
};

/** The level at which an era's own summary and arcs stop spoiling. */
export const eraLevel: Record<EraId, Level> = {
  "old-empire": 1,
  imperium: 1,
  dune: 2,
  messiah: 3,
  children: 4,
  "god-emperor": 5,
  scattering: 6,
  heretics: 7,
};

// Background events that a reader meets in Part One, whatever book tag they carry.
const EARLY = new Set([
  "zensunni",
  "jihad",
  "schools",
  "corrin",
  "guild",
  "convention",
  "breeding",
  "missionaria",
  "harkonnen-fief",
  "kynes",
]);

// Later books: the prequels set before Dune reveal Dune's secrets (Jessica's parentage), so they
// count as Dune. Books set between the novels count as the novel they follow.
const euLevel: Record<string, Level> = {
  "eu-paul-of-dune": 3,
  "eu-winds": 4,
  "eu-hunters": 7,
  "eu-sandworms": 7,
};

const ev: Record<string, Level> = {};
for (const era of eras as Era[])
  for (const e of era.events)
    ev[e.id] = EARLY.has(e.id) || PART_ONE.has(e.id) ? 1 : (byBook[e.book] ?? eraLevel[era.id as EraId]);
for (const e of euEvents)
  ev[e.id] =
    euLevel[e.id] ?? (e.era === "old-empire" ? 1 : e.era === "imperium" ? 2 : eraLevel[e.era as EraId]);

export const eventLevel = (id: string): Level => ev[id] ?? 7;

/** When a person is first met (their name alone is safe from here). */
export const charAppear: Record<string, Level> = {
  paul: 1,
  jessica: 1,
  "leto-i": 1,
  alia: 2,
  chani: 1,
  "leto-ii": 3,
  ghanima: 3,
  duncan: 1,
  stilgar: 1,
  gurney: 1,
  thufir: 1,
  baron: 1,
  feyd: 1,
  kynes: 1,
  mohiam: 1,
  irulan: 1,
  shaddam: 1,
  yueh: 1,
  piter: 1,
  rabban: 1,
  jamis: 1,
  margot: 1,
  fenring: 2,
  farad: 4,
  scytale: 3,
  edric: 3,
  moneo: 5,
  siona: 5,
  hwi: 5,
  odrade: 6,
  teg: 6,
  sheeana: 6,
  murbella: 6,
  taraza: 6,
  lucilla: 6,
};
/** When a person's one-line description stops spoiling. */
export const charBlurb: Record<string, Level> = {
  ...charAppear,
  jessica: 2,
  alia: 2,
  chani: 2,
  "leto-ii": 4,
  ghanima: 4,
  duncan: 3,
  thufir: 2,
  baron: 2,
  mohiam: 3,
  irulan: 2,
  shaddam: 2,
  rabban: 2,
  margot: 2,
  farad: 5,
  moneo: 5,
  murbella: 7,
};
export const factionAppear: Record<string, Level> = {
  qizarate: 3,
  "fish-speakers": 5,
  "honored-matres": 6,
};
export const factionBlurb: Record<string, Level> = {
  fremen: 2,
  atreides: 2,
  harkonnen: 2,
  tleilax: 3,
  qizarate: 5,
  "fish-speakers": 5,
  ix: 6,
  mentats: 6,
  "honored-matres": 6,
};
export const facAppear = (id: string): Level => factionAppear[id] ?? 1;
export const facBlurb = (id: string): Level => factionBlurb[id] ?? facAppear(id);
export const appear = (id: string): Level => charAppear[id] ?? 1;
export const blurbLevel = (id: string): Level => charBlurb[id] ?? appear(id);

/** The latest era in which something is present, as a level (for "life strips" that give away who survives). */
export const lastLevel = (eraMap: Partial<Record<EraId, unknown>>): Level =>
  Math.max(
    1,
    ...Object.keys(eraMap)
      .filter((k) => eraMap[k as EraId])
      .map((k) => eraLevel[k as EraId]),
  ) as Level;

/** Attributes for a veilable element. Use `soft` for small cells (no label, just obscured). */
export const sp = (n: Level, soft = false) =>
  n <= 1 ? {} : { "data-sp": n, "data-spl": levelShort[n], ...(soft ? { "data-sps": "" } : {}) };
/** When a person's other names stop spoiling ("the Preacher", "Hayt"). */
const akaLevels: Record<string, Level> = { paul: 4, alia: 2, duncan: 3, "leto-ii": 4, farad: 4 };
export const akaLevel = (id: string): Level => Math.max(appear(id), akaLevels[id] ?? 1) as Level;
/** When a glossary definition stops spoiling. Unlisted terms are safe from Part One. */
export const termLevel: Record<string, Level> = {
  abomination: 2,
  arrakis: 6,
  "axlotl-tank": 7,
  bashar: 6,
  chapterhouse: 7,
  "divided-god": 6,
  fedaykin: 2,
  "fish-speakers": 5,
  gammu: 6,
  "golden-path": 4,
  "honored-matres": 6,
  imprinting: 6,
  ix: 6,
  jihad: 2,
  junction: 7,
  "laza-tiger": 4,
  mahdi: 2,
  "mother-superior": 7,
  "museum-fremen": 5,
  "no-ship": 6,
  "padishah-emperor": 2,
  pearls: 6,
  "pre-born": 2,
  prescience: 3,
  qizarate: 3,
  rakis: 6,
  "salusa-secundus": 2,
  sareer: 5,
  scattering: 6,
  siaynoq: 5,
  "spice-essence": 5,
  "water-of-life": 2,
  "other-memory": 2,
};
