// Types for material outside the core canon (Frank Herbert's six novels + Villeneuve's films).
// Everything typed here renders as secondary: dashed, labelled, and switchable.

import type { FilmKind } from "./timeline";
import type { EraId } from "./cast";

// Novels by Brian Herbert and Kevin J. Anderson (1999–).
export type EUBook =
  | "HOUSE ATREIDES"
  | "HOUSE HARKONNEN"
  | "HOUSE CORRINO"
  | "THE BUTLERIAN JIHAD"
  | "THE MACHINE CRUSADE"
  | "THE BATTLE OF CORRIN"
  | "HUNTERS OF DUNE"
  | "SANDWORMS OF DUNE"
  | "PAUL OF DUNE"
  | "THE WINDS OF DUNE"
  | "SISTERHOOD OF DUNE"
  | "MENTATS OF DUNE"
  | "NAVIGATORS OF DUNE"
  | "THE DUKE OF CALADAN"
  | "THE LADY OF CALADAN"
  | "THE HEIR OF CALADAN"
  | "PRINCESS OF DUNE";

export interface EUBookInfo {
  title: string;
  year: string;
  series: string; // e.g. 'Prelude to Dune'
  covers: string; // in-universe period, short
  note: string; // one sentence: what it adds and how it sits against Frank Herbert
}

// 'expands' = adds detail Frank Herbert never wrote, without contradicting him.
// 'retcon'  = changes, contradicts or reinterprets something Frank Herbert did write.
export type EUKind = "expands" | "retcon";

/** A stand-alone event that exists only in the later books. Rendered as a dashed, labelled card. */
export interface EUEvent {
  id: string; // unique, prefix 'eu-'
  era: EraId;
  after: string; // id of the canon (or eu) event this card should follow on the timeline
  when: string;
  approx?: boolean;
  title: string;
  books: EUBook[];
  body: string;
  kind: EUKind;
  herbert?: string; // required for 'retcon': what Frank Herbert's own text says or leaves open
  who?: string[]; // character ids from cast.ts
  f?: string[]; // faction ids from cast.ts
}

/** A note attached to a canon event saying how the later books add to or change it. */
export interface EUNote {
  event: string; // canon event id
  books: EUBook[];
  kind: EUKind;
  text: string;
  herbert?: string; // for 'retcon'
}

// Screen versions other than Villeneuve's.
export type Screen = "LYNCH" | "SCIFI DUNE" | "SCIFI CHILDREN" | "PROPHECY";

export interface ScreenInfo {
  title: string;
  year: string;
  maker: string;
  covers: string;
  stance: string; // one or two sentences: how far it departs from Herbert
}

/** A note on how another screen version handles an event. Hidden by default. */
export interface AltNote {
  event: string; // canon or eu event id
  screen: Screen;
  kind: FilmKind;
  text: string;
}
