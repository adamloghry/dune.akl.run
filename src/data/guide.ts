// Reading and watching guide. Spoiler-light by design: no deaths or twists in any of this copy.
// Tier order matches the rest of the site: Frank Herbert's novels, then Villeneuve's films, then
// the later books by Brian Herbert & Kevin J. Anderson, then other screen versions.

import type { Book } from "./timeline";
import type { EraId } from "./cast";
import type { EUBook, Screen } from "./beyond-types";

export interface StartStep {
  what: string;
  why: string;
}

export const startHere: {
  lead: string;
  steps: StartStep[];
  alternatives: { label: string; text: string }[];
} = {
  lead: "Our default: read the novel first, then watch the films as a companion.",
  steps: [
    {
      what: "Read Dune (1965).",
      why: "The book is the record. It holds the inner voices, the politics and the slow turn in Paul that the films have to compress.",
    },
    {
      what: "Watch Dune (2021) and Dune: Part Two (2024), back to back.",
      why: "Together they cover the novel. Knowing the book, you will see exactly what Villeneuve kept and what he changed.",
    },
    {
      what: "Read Dune Messiah (1969).",
      why: "It is short, and Frank Herbert meant it as the second half of Dune. Read it before the third film arrives.",
    },
    {
      what: "Keep going if you want more.",
      why: "Children of Dune finishes the story of Paul's family. God Emperor, Heretics and Chapterhouse are stranger and slower, and they reward patience.",
    },
  ],
  alternatives: [
    {
      label: "Films first",
      text: "Watch both films, then read Dune. You will know the plot, but the book still surprises: whole characters and threads never reach the screen.",
    },
    {
      label: "Short on time",
      text: "Read Dune and Dune Messiah as one story and stop there. That is the complete arc of Paul.",
    },
  ],
};

export interface HerbertBook {
  book: Book;
  title: string;
  year: string;
  eras: EraId[];
  adds: string; // spoiler-light, one line
  feel: string; // length and feel, a few words
  films?: string; // what the films cover
}

export const herbertBooks: HerbertBook[] = [
  {
    book: "DUNE",
    title: "Dune",
    year: "1965",
    eras: ["dune"],
    adds: "A noble family takes over the desert planet that produces the spice, and walks into a trap. The son finds a home, and a destiny, among the Fremen.",
    feel: "The longest of the six. Court intrigue first, then desert survival and war. Read the appendices too.",
    films: "Part One covers the first half, to the duel with Jamis. Part Two covers the rest.",
  },
  {
    book: "MESSIAH",
    title: "Dune Messiah",
    year: "1969",
    eras: ["messiah"],
    adds: "Twelve years on, the cost of winning. A conspiracy forms around a ruler who can see it coming.",
    feel: "The shortest. A tight palace drama told largely in conversations.",
    films: "Dune: Part Three adapts it (see below).",
  },
  {
    book: "CHILDREN",
    title: "Children of Dune",
    year: "1976",
    eras: ["children"],
    adds: "The next generation inherits the empire, the religion and the visions, while Arrakis itself changes.",
    feel: "Long and political, and more mystical than the first two.",
    films: "Not adapted by Villeneuve. The 2003 miniseries covers it.",
  },
  {
    book: "GOD EMPEROR",
    title: "God Emperor of Dune",
    year: "1981",
    eras: ["god-emperor"],
    adds: "Thousands of years later, one ruler explains why he chose to be a tyrant, and what it is for.",
    feel: "Mostly dialogue and ideas. A philosophical novel more than an adventure.",
  },
  {
    book: "HERETICS",
    title: "Heretics of Dune",
    year: "1984",
    eras: ["scattering", "heretics"],
    adds: "The Bene Gesserit take the lead, and a new power comes home from deep space.",
    feel: "A new cast and a faster pace, closer to a spy thriller.",
  },
  {
    book: "CHAPTERHOUSE",
    title: "Chapterhouse: Dune",
    year: "1985",
    eras: ["heretics"],
    adds: "A Sisterhood under siege works out how to survive by changing itself.",
    feel: "Reflective and slow. It ends on an open question: Herbert did not live to write the next book.",
  },
];

export interface FilmInfo {
  title: string;
  year: string;
  covers: string;
  note: string;
  status?: string;
}

export const villeneuveFilms: FilmInfo[] = [
  {
    title: "Dune",
    year: "2021",
    covers:
      "The first half of the novel: Caladan, the move to Arrakis, the Harkonnen attack and the flight into the desert.",
    note: "Titled Dune: Part One on screen. Close to the book in plot, lighter on its politics and inner voices.",
  },
  {
    title: "Dune: Part Two",
    year: "2024",
    covers: "The second half: life among the Fremen through to the end of the novel.",
    note: "Compresses the book's two years into months and gives Chani a bigger, different role. Every change is on the films page.",
  },
];

/** Verified by web search on the date given. Update or remove when the film is out. */
export const partThree = {
  title: "Dune: Part Three",
  adapts: "Dune Messiah",
  release: "December 18, 2026",
  checked: "November 25, 2026",
  source: "https://editorial.rottentomatoes.com/article/everything-we-know-about-dune-part-three/",
  sourceName: "Rotten Tomatoes",
};

/** In-universe order of the later books, with Frank Herbert's novels as anchors. */
export type ChronoItem = { eu: EUBook } | { herbert: Book };
export const laterChrono: ChronoItem[] = [
  { eu: "THE BUTLERIAN JIHAD" },
  { eu: "THE MACHINE CRUSADE" },
  { eu: "THE BATTLE OF CORRIN" },
  { eu: "SISTERHOOD OF DUNE" },
  { eu: "MENTATS OF DUNE" },
  { eu: "NAVIGATORS OF DUNE" },
  { eu: "HOUSE ATREIDES" },
  { eu: "HOUSE HARKONNEN" },
  { eu: "HOUSE CORRINO" },
  { eu: "PRINCESS OF DUNE" },
  { eu: "THE DUKE OF CALADAN" },
  { eu: "THE LADY OF CALADAN" },
  { eu: "THE HEIR OF CALADAN" },
  { herbert: "DUNE" },
  { eu: "PAUL OF DUNE" },
  { herbert: "MESSIAH" },
  { eu: "THE WINDS OF DUNE" },
  { herbert: "CHILDREN" },
  { herbert: "GOD EMPEROR" },
  { herbert: "HERETICS" },
  { herbert: "CHAPTERHOUSE" },
  { eu: "HUNTERS OF DUNE" },
  { eu: "SANDWORMS OF DUNE" },
];
export const laterChronoSource = "https://dunenovels.com/chronological-order-of-dune-books/";

/** One line each, in our words. Titles and years come from screens in beyond.ts. */
export const otherScreens: { screen: Screen; line: string }[] = [
  {
    screen: "LYNCH",
    line: "David Lynch's single film of the first novel. Memorable and strange, it follows the plot but invents a lot.",
  },
  {
    screen: "SCIFI DUNE",
    line: "A three-part TV miniseries of the first novel. Closer to the book's structure than Lynch, on a TV budget.",
  },
  {
    screen: "SCIFI CHILDREN",
    line: "A three-part sequel miniseries that adapts Dune Messiah and Children of Dune. Until Part Three, the only screen version of either.",
  },
  {
    screen: "PROPHECY",
    line: "An HBO series about the early Sisterhood, set long before Paul. Loosely based on a later book, with much of its own story.",
  },
];
