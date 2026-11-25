// The worlds of the saga, for the star map at /map/.
//
// `where` is the star or system exactly as Frank Herbert's Dune glossary ("Terminology of the
// Imperium") states it. Where neither the glossary nor the novels give a star, it is omitted.
// `source` says where the world itself is named. Positions (x, y) are schematic on a 320x180
// grid: the novels give no star chart. A few placements echo the text (Harmonthep sits beside
// Caladan because the glossary makes both belong to Delta Pavonis; Corrin sits near Salusa
// Secundus, whose house won there), but distances mean nothing.
//
// `events` are ids in timeline.ts; `eu` are ids of euEvents in beyond.ts (later books by Brian
// Herbert and Kevin J. Anderson, secondary). `euOnly` marks a world that exists only in the later
// books; the map draws it dashed and dim.

export interface PlanetLook {
  base: string; // main surface colour
  band: string; // stripe colour (clouds, dunes, seas)
  bands?: number; // stripe every n rows (0 = none); default 3
  light: string; // lit limb, top left
  shade: string; // night side, right
  moons?: number; // small moons, only where the books give them
  ring?: boolean; // decorative ring; used only where apt
}

export interface World {
  id: string;
  name: string;
  aka?: string;
  where?: string;
  source: string;
  kind: string;
  blurb: string;
  events: string[];
  eu?: string[];
  factions?: string[];
  people?: string[];
  x: number;
  y: number;
  size?: number; // disc diameter in map pixels, 5–9; default 6
  label?: "r" | "l" | "t" | "b"; // label side; default right
  unknown?: boolean; // location unknown even in the books: drawn as a '?' marker
  look: PlanetLook;
  euOnly?: boolean;
}

const GLOSSARY = "Dune, glossary";

export const worlds: World[] = [
  {
    id: "arrakis",
    name: "Arrakis",
    aka: "Dune · Rakis",
    where: "third planet of Canopus",
    source: GLOSSARY,
    kind: "desert world · the only source of spice",
    blurb:
      "The hinge of the Imperium: the one world where the spice melange forms, and so the one world everyone must hold. It has two moons. By Heretics it is called Rakis, and at the end of that book the Honored Matres burn it to bedrock.",
    events: [
      "zensunni",
      "missionaria",
      "harkonnen-fief",
      "kynes",
      "arrakeen",
      "betrayal",
      "kynes-death",
      "stilltent",
      "jamis",
      "reverend-mother",
      "alia-born",
      "chani",
      "sandrider",
      "first-son",
      "rabban",
      "water-of-life",
      "hawat",
      "arrakeen-battle",
      "ascension",
      "jihad-cost",
      "conspiracy",
      "chani-death",
      "abomination",
      "farad",
      "jacurutu",
      "duncan-stilgar",
      "sandtrout",
      "golden-path",
      "peace",
      "siona",
      "siona-test",
      "leto-death",
      "sheeana",
      "rakis-destroyed",
    ],
    eu: ["eu-selim", "eu-princess", "eu-paul-of-dune", "eu-winds"],
    factions: ["fremen", "atreides", "harkonnen", "qizarate", "fish-speakers"],
    people: ["paul", "chani", "stilgar", "kynes", "alia", "leto-ii", "sheeana"],
    x: 126,
    y: 104,
    size: 9,
    label: "b",
    look: { base: "#d9964f", band: "#b8732f", bands: 2, light: "#f3cf8a", shade: "#7a4520", moons: 2 },
  },
  {
    id: "caladan",
    name: "Caladan",
    aka: "Dan",
    where: "third planet of Delta Pavonis",
    source: GLOSSARY,
    kind: "sea world · Atreides fief",
    blurb:
      "The Atreides home, a wet world of oceans, and the birthworld of Paul. Mohiam tests him with the gom jabbar here on the eve of the move to Arrakis. Fifteen centuries after Leto II, the name has worn down to Dan.",
    events: ["gom-jabbar"],
    eu: ["eu-new-duke", "eu-duncan-escape", "eu-caladan"],
    factions: ["atreides"],
    people: ["leto-i", "jessica", "paul", "mohiam"],
    x: 58,
    y: 60,
    size: 7,
    look: { base: "#2f6fa8", band: "#3f8f4f", bands: 3, light: "#8fd0f0", shade: "#173a5c" },
  },
  {
    id: "giedi-prime",
    name: "Giedi Prime",
    aka: "Gammu",
    where: "the planet of Ophiuchi B (36)",
    source: GLOSSARY,
    kind: "Harkonnen homeworld",
    blurb:
      "Seat of House Harkonnen, a median-viable world with little plant life. Feyd-Rautha fights in the Baron's arena here. Renamed Gammu by Heretics, it holds the Bene Gesserit Keep where Miles Teg guards the new Duncan ghola.",
    events: ["feyd", "teg"],
    eu: ["eu-duncan-escape"],
    factions: ["harkonnen", "bene-gesserit", "honored-matres"],
    people: ["baron", "feyd", "teg", "duncan", "murbella"],
    x: 238,
    y: 50,
    size: 7,
    look: { base: "#4a4a5a", band: "#6b3a3a", bands: 2, light: "#8a8aa0", shade: "#1f1a26" },
  },
  {
    id: "kaitain",
    name: "Kaitain",
    source: "Dune, glossary (under Salusa Secundus)",
    kind: "Imperial capital",
    blurb:
      "Seat of the Padishah Emperor when Dune opens. The glossary says the Corrino court moved here from Salusa Secundus. Shaddam IV loses the throne on Arrakis, not here, and is sent back to Salusa.",
    events: ["ascension"],
    eu: ["eu-new-duke", "eu-princess"],
    factions: ["corrino"],
    people: ["shaddam", "irulan"],
    x: 206,
    y: 128,
    size: 7,
    look: { base: "#c9a227", band: "#e8d07a", bands: 3, light: "#fff0b0", shade: "#6e5512" },
  },
  {
    id: "salusa-secundus",
    name: "Salusa Secundus",
    where: "third planet of Gamma Waiping",
    source: GLOSSARY,
    kind: "Corrino homeworld · prison planet",
    blurb:
      "Homeworld of House Corrino, made the Imperial prison planet once the court left. Its harsh life breeds the Sardaukar. The glossary calls it the second stop of the Zensunni migration; Fremen say they were slaves here for nine generations. Shaddam IV is exiled here, and Jessica trains Farad'n here.",
    events: ["zensunni", "corrin", "betrayal", "ascension", "farad"],
    factions: ["corrino", "fremen"],
    people: ["shaddam", "farad", "jessica"],
    x: 248,
    y: 150,
    size: 6,
    look: { base: "#8a5a4a", band: "#a8786a", bands: 3, light: "#d0a890", shade: "#3a2420" },
  },
  {
    id: "junction",
    name: "Junction",
    source: "Chapterhouse: Dune",
    kind: "old Guild center · Honored Matre stronghold",
    blurb:
      "An old Spacing Guild center. By Chapterhouse the Honored Matres hold it as their stronghold. Odrade goes there to offer surrender while Teg attacks, dies there, and the battle ends the war.",
    events: ["junction"],
    factions: ["guild", "honored-matres", "bene-gesserit"],
    people: ["odrade", "murbella", "teg"],
    x: 168,
    y: 82,
    size: 6,
    label: "t",
    look: { base: "#5aa0c8", band: "#2f6f94", bands: 2, light: "#bfe6f8", shade: "#1f3f55", ring: true },
  },
  {
    id: "ix",
    name: "Ix",
    source: "Dune, glossary (under Richese)",
    kind: "machine world",
    blurb:
      "With Richese, the glossary ranks it supreme in machine culture, and both came through the Butlerian Jihad less harmed than most. In God Emperor, Ix sends Hwi Noree to Leto II. Ixian no-ships, hidden from prescience, make the Scattering possible.",
    events: ["jihad", "siona", "famine"],
    eu: ["eu-ix-falls", "eu-spice-war", "eu-winds"],
    factions: ["ix"],
    people: ["hwi"],
    x: 114,
    y: 154,
    size: 6,
    look: { base: "#7f8c99", band: "#5a6470", bands: 2, light: "#c0ccd8", shade: "#2e343a" },
  },
  {
    id: "tleilax",
    name: "Tleilax",
    where: "lone planet of Thalim",
    source: GLOSSARY,
    kind: "Tleilaxu homeworld",
    blurb:
      'Home of the Bene Tleilax, who grow gholas in their axlotl tanks and breed the shape-shifting Face Dancers. In Dune\'s day the glossary knows it as a renegade school for "twisted" Mentats. In Chapterhouse the Honored Matres wipe out the Tleilaxu.',
    events: ["conspiracy", "peace", "teg"],
    factions: ["tleilax", "honored-matres"],
    people: ["scytale"],
    x: 292,
    y: 86,
    size: 6,
    label: "l",
    look: { base: "#6b7a3a", band: "#8a9a4a", bands: 3, light: "#b8c878", shade: "#2e351a" },
  },
  {
    id: "wallach-ix",
    name: "Wallach IX",
    where: "ninth planet of Laoujin",
    source: GLOSSARY,
    kind: "Bene Gesserit Mother School",
    blurb:
      "Site of the Bene Gesserit Mother School in the time of Dune, where the Sisterhood trains its own. By Heretics the order is run from a hidden world instead.",
    events: ["schools", "breeding"],
    factions: ["bene-gesserit"],
    x: 26,
    y: 112,
    size: 6,
    look: { base: "#8e7fb0", band: "#6a5c8a", bands: 3, light: "#cfc4e8", shade: "#352c48" },
  },
  {
    id: "chapterhouse",
    name: "Chapterhouse",
    source: "Heretics of Dune · Chapterhouse: Dune",
    kind: "hidden Bene Gesserit homeworld",
    blurb:
      "The Sisterhood's secret seat in the last two books, green when we first see it. After Rakis burns, the one rescued worm seeds it with sandtrout, and the Sisters let it dry into a new desert. The last no-ship leaves from here.",
    events: ["rakis-destroyed", "chapterhouse", "junction", "daniel-marty"],
    factions: ["bene-gesserit", "honored-matres"],
    people: ["odrade", "murbella", "sheeana", "duncan", "teg"],
    x: 28,
    y: 26,
    size: 7,
    look: { base: "#5a9a4a", band: "#d9b070", bands: 2, light: "#a8d890", shade: "#24401c" },
  },
  {
    id: "richese",
    name: "Richese",
    where: "fourth planet of Eridani A",
    source: GLOSSARY,
    kind: "machine world",
    blurb:
      "Ranked with Ix as supreme in machine culture and known for miniaturization. The glossary notes that both worlds escaped the worst of the Butlerian Jihad.",
    events: ["jihad"],
    x: 70,
    y: 146,
    size: 6,
    look: { base: "#9aa3a8", band: "#c0c8cc", bands: 2, light: "#e8eef0", shade: "#3e4448" },
  },
  {
    id: "ecaz",
    name: "Ecaz",
    where: "fourth planet of Alpha Centauri B",
    source: GLOSSARY,
    kind: "fogwood world",
    blurb:
      "The glossary calls it a sculptors' paradise. It is the home of fogwood, a plant that can be shaped as it grows by human thought alone.",
    events: [],
    eu: ["eu-paul-of-dune"],
    x: 92,
    y: 30,
    size: 6,
    look: { base: "#3f7a4a", band: "#7ab05a", bands: 2, light: "#b0e0a0", shade: "#1c3a22" },
  },
  {
    id: "lankiveil",
    name: "Lankiveil",
    source: "Dune, glossary (under Mudir Nahya)",
    kind: "Harkonnen holding",
    blurb:
      "Glossu Rabban, the Beast, is styled Count of Lankiveil. Frank Herbert says nothing more about the world. The later books make it the place of Abulurd Harkonnen's exile.",
    events: ["rabban"],
    eu: ["eu-abulurd"],
    factions: ["harkonnen"],
    x: 274,
    y: 24,
    size: 5,
    look: { base: "#9ab0c0", band: "#e0eaf0", bands: 2, light: "#ffffff", shade: "#3a4a58" },
  },
  {
    id: "lernaeus",
    name: "Lernaeus",
    source: "Heretics of Dune",
    kind: "Teg's home",
    blurb:
      "Miles Teg is living here in retirement when Heretics opens. Mother Superior Taraza calls him back to guard the new Duncan Idaho ghola.",
    events: ["teg"],
    factions: ["bene-gesserit", "mentats"],
    people: ["teg"],
    x: 186,
    y: 22,
    size: 5,
    look: { base: "#7a9a5a", band: "#5a7a40", bands: 3, light: "#c0d8a0", shade: "#2e3a22" },
  },
  {
    id: "lampadas",
    name: "Lampadas",
    source: "Heretics of Dune · Chapterhouse: Dune",
    kind: "Bene Gesserit school world",
    blurb:
      "A center of Bene Gesserit learning. In Chapterhouse the Honored Matres destroy it. Its Sisters pool their memories in one woman, Lucilla, who flees, is forced down on Gammu, and passes the dead of Lampadas to Rebecca, a wild Reverend Mother.",
    events: ["chapterhouse"],
    factions: ["bene-gesserit", "honored-matres"],
    x: 96,
    y: 74,
    size: 5,
    label: "l",
    look: { base: "#b0a0d0", band: "#8070a8", bands: 2, light: "#e8e0f8", shade: "#40365a" },
  },
  {
    id: "buzzell",
    name: "Buzzell",
    source: "Chapterhouse: Dune",
    kind: "cold sea world · place of exile",
    blurb:
      "A cold ocean world whose only land is small, bare islands. The Sisterhood uses it as a punishment station for Sisters who have failed it.",
    events: [],
    factions: ["bene-gesserit"],
    x: 66,
    y: 10,
    size: 5,
    look: { base: "#3a6a8a", band: "#d8e8f0", bands: 3, light: "#a0c8e0", shade: "#16303f" },
  },
  {
    id: "corrin",
    name: "Corrin",
    where: "near Sigma Draconis (the battle)",
    source: GLOSSARY,
    kind: "battle site",
    blurb:
      "In the glossary, Corrin is a space battle, not a world: fought near Sigma Draconis in 88 B.G., it settled the rise of the ruling house from Salusa Secundus, which took its name from it. The later books make Corrin the thinking machines' last planet.",
    events: ["corrin"],
    eu: ["eu-corrin", "eu-abulurd"],
    factions: ["corrino", "atreides", "harkonnen"],
    x: 292,
    y: 128,
    size: 5,
    label: "l",
    look: { base: "#a03a2a", band: "#c8452e", bands: 2, light: "#f08060", shade: "#401810" },
  },
  {
    id: "tupile",
    name: "Tupile",
    source: GLOSSARY,
    kind: "sanctuary planet(s)",
    blurb:
      "A refuge for defeated Great Houses, perhaps several planets. Only the Guild knows where, and the Guild Peace keeps it untouched. So the map can only guess.",
    events: ["convention"],
    factions: ["guild"],
    x: 160,
    y: 158,
    unknown: true,
    look: { base: "#5aa0c8", band: "#5aa0c8", light: "#bfe6f8", shade: "#1f3f55" },
  },
  {
    id: "poritrin",
    name: "Poritrin",
    where: "third planet of Epsilon Alangue",
    source: GLOSSARY,
    kind: "Zensunni migration",
    blurb:
      "Many Zensunni Wanderers counted it as their world of origin, though their speech and myths point to far older roots.",
    events: ["zensunni"],
    factions: ["fremen"],
    x: 300,
    y: 166,
    size: 5,
    label: "l",
    look: { base: "#b07a4a", band: "#8a5a32", bands: 2, light: "#e0b080", shade: "#40281a" },
  },
  {
    id: "bela-tegeuse",
    name: "Bela Tegeuse",
    where: "fifth planet of Kuentsing",
    source: GLOSSARY,
    kind: "Zensunni migration",
    blurb: "The third stop on the forced migration of the Zensunni, the people who become the Fremen.",
    events: ["zensunni"],
    factions: ["fremen"],
    x: 196,
    y: 166,
    size: 5,
    look: { base: "#a8604a", band: "#7a3a2e", bands: 2, light: "#e09070", shade: "#3a1c16" },
  },
  {
    id: "harmonthep",
    name: "Harmonthep",
    where: "supposedly a lost satellite of Delta Pavonis",
    source: GLOSSARY,
    kind: "Zensunni migration",
    blurb:
      "The sixth stop of the Zensunni migration, going by Ingsley's listing, which the glossary cites. It is supposed to have circled Delta Pavonis, Caladan's star, and no longer exists.",
    events: ["zensunni"],
    factions: ["fremen"],
    x: 44,
    y: 78,
    size: 5,
    label: "l",
    look: { base: "#8a7a6a", band: "#6a5a4a", bands: 2, light: "#c0b0a0", shade: "#2e2620" },
  },
  {
    id: "synchrony",
    name: "Synchrony",
    source: "Sandworms of Dune (later books)",
    kind: "machine capital · later books only",
    blurb:
      "Not in Frank Herbert. In the later books it is the capital of the reborn thinking machines, where the story of the no-ship ends in Sandworms of Dune.",
    events: [],
    eu: ["eu-hunters", "eu-sandworms"],
    x: 306,
    y: 10,
    size: 6,
    label: "l",
    look: { base: "#6a7480", band: "#9aa8b8", bands: 1, light: "#d0dce8", shade: "#262c34" },
    euOnly: true,
  },
];

/** The Spacing Guild's lanes, drawn from Junction for the picture only. */
export const guildRoutes = [
  "arrakis",
  "caladan",
  "giedi-prime",
  "kaitain",
  "salusa-secundus",
  "ix",
  "tleilax",
  "wallach-ix",
  "richese",
  "ecaz",
];

/** The Zensunni wandering, in the order the glossary numbers its stops (Poritrin first, by their own tradition). */
export const zensunniPath = ["poritrin", "salusa-secundus", "bela-tegeuse", "harmonthep", "arrakis"];

export const worldById = Object.fromEntries(worlds.map((w) => [w.id, w]));
