// Cross-references in src/data: every id one record names must exist, so a typo fails the
// build instead of quietly dropping a card, tag or family link.
import { describe, expect, it } from "vitest";
import { eras } from "../../src/data/timeline";
import { characters, factions, tags, charById, factionById } from "../../src/data/cast";
import { euEvents, euNotes, altNotes } from "../../src/data/beyond";
import { familyNodes, unions, edges } from "../../src/data/family";
import { glossary } from "../../src/data/glossary";
import { worlds } from "../../src/data/worlds";

const canon = eras.flatMap((e) => e.events);
const canonIds = new Set(canon.map((e) => e.id));
const euIds = new Set(euEvents.map((e) => e.id));
const allIds = new Set([...canonIds, ...euIds]);

const dupes = (xs: string[]) => xs.filter((x, i) => xs.indexOf(x) !== i);

describe("timeline", () => {
  it("has unique event ids across the canon and the later books", () => {
    expect(dupes([...canon.map((e) => e.id), ...euEvents.map((e) => e.id)])).toEqual([]);
  });
  it("has unique era ids, in order on the scale ruler", () => {
    expect(dupes(eras.map((e) => e.id))).toEqual([]);
    for (let i = 1; i < eras.length; i++)
      expect(eras[i].from, eras[i].id).toBeGreaterThanOrEqual(eras[i - 1].from);
  });
  it("tags only real events, people and factions", () => {
    for (const [id, t] of Object.entries(tags)) {
      expect(canonIds.has(id), `tags.${id}`).toBe(true);
      for (const c of t.who ?? []) expect(charById[c], `tags.${id} who ${c}`).toBeDefined();
      for (const f of t.f ?? []) expect(factionById[f], `tags.${id} f ${f}`).toBeDefined();
    }
  });
});

describe("later books and other screen versions", () => {
  it("says where in the novel each event happens, naming the right book", () => {
    const title: Record<string, string> = {
      DUNE: "Dune ·",
      MESSIAH: "Dune Messiah",
      CHILDREN: "Children of Dune",
      "GOD EMPEROR": "God Emperor of Dune",
      HERETICS: "Heretics of Dune",
      CHAPTERHOUSE: "Chapterhouse: Dune",
    };
    for (const e of canon)
      if (e.book !== "APPENDIX") expect(e.ref?.startsWith(title[e.book]), `${e.id}: ${e.ref}`).toBe(true);
  });
  it("puts events only on worlds that exist, and only real events on worlds", () => {
    expect(dupes(worlds.map((w) => w.id))).toEqual([]);
    for (const w of worlds) {
      for (const id of w.events) expect(canonIds.has(id), `${w.id} event ${id}`).toBe(true);
      for (const id of w.eu ?? []) expect(euIds.has(id), `${w.id} eu ${id}`).toBe(true);
    }
  });
  it("prefixes later-book event ids with eu-", () => {
    for (const e of euEvents) expect(e.id.startsWith("eu-"), e.id).toBe(true);
  });
  it("places each later-book card after an event that exists", () => {
    for (const e of euEvents) expect(allIds.has(e.after), `${e.id}.after ${e.after}`).toBe(true);
  });
  it("says what Frank Herbert wrote for every retcon", () => {
    for (const e of euEvents) if (e.kind === "retcon") expect(e.herbert, e.id).toBeTruthy();
    for (const n of euNotes) if (n.kind === "retcon") expect(n.herbert, `note on ${n.event}`).toBeTruthy();
  });
  it("tags later-book cards with real people and factions", () => {
    for (const e of euEvents) {
      for (const c of e.who ?? []) expect(charById[c], `${e.id} who ${c}`).toBeDefined();
      for (const f of e.f ?? []) expect(factionById[f], `${e.id} f ${f}`).toBeDefined();
    }
  });
  it("attaches notes only to events that exist", () => {
    for (const n of euNotes) expect(canonIds.has(n.event), `eu note on ${n.event}`).toBe(true);
    for (const n of altNotes) expect(allIds.has(n.event), `screen note on ${n.event}`).toBe(true);
  });
});

describe("people and powers", () => {
  it("has unique ids", () => {
    expect(dupes(characters.map((c) => c.id))).toEqual([]);
    expect(dupes(factions.map((f) => f.id))).toEqual([]);
  });
  it("puts each person only in factions that exist", () => {
    for (const c of characters)
      for (const f of c.factions) expect(factionById[f.id], `${c.id} in ${f.id}`).toBeDefined();
  });
});

describe("family tree", () => {
  const nodeIds = new Set(familyNodes.map((n) => n.id));
  it("links pages and edges to people that exist", () => {
    expect(dupes(familyNodes.map((n) => n.id))).toEqual([]);
    for (const n of familyNodes) if (n.char) expect(charById[n.char], `${n.id}.char`).toBeDefined();
    const unionIds = new Set(unions.map((u) => u.id));
    for (const u of unions) {
      expect(nodeIds.has(u.a), `${u.id}.a`).toBe(true);
      expect(nodeIds.has(u.b), `${u.id}.b`).toBe(true);
    }
    for (const e of edges) {
      expect(nodeIds.has(e.from) || unionIds.has(e.from), `edge from ${e.from}`).toBe(true);
      expect(nodeIds.has(e.to), `edge to ${e.to}`).toBe(true);
    }
  });
});

describe("glossary", () => {
  it("has unique ids and one-line definitions", () => {
    expect(dupes(glossary.map((t) => t.id))).toEqual([]);
    for (const t of glossary) expect(t.def.length, t.id).toBeLessThanOrEqual(160);
  });
});
