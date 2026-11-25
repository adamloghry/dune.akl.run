// Characters and factions. Book canon is Frank Herbert's six novels only; `film` lines describe
// Villeneuve's Dune (2021) and Dune: Part Two (2024).

export type EraId =
  "old-empire" | "imperium" | "dune" | "messiah" | "children" | "god-emperor" | "scattering" | "heretics";

export const eraOrder: EraId[] = [
  "old-empire",
  "imperium",
  "dune",
  "messiah",
  "children",
  "god-emperor",
  "scattering",
  "heretics",
];
export const eraShort: Record<EraId, string> = {
  "old-empire": "Jihad",
  imperium: "Imperium",
  dune: "Dune",
  messiah: "Messiah",
  children: "Children",
  "god-emperor": "God Emp.",
  scattering: "Scattering",
  heretics: "Heretics+",
};

export type Rel = "member" | "ally" | "trained" | "enemy";
export const relLabel: Record<Rel, string> = {
  member: "member",
  ally: "allied",
  trained: "trained by",
  enemy: "opposed",
};

export interface Faction {
  id: string;
  name: string;
  aka?: string;
  kind: string;
  sigil: string; // sprite name in sprites.ts
  colour: string; // hex, used for avatars and sigils
  blurb: string;
  // 0 absent · 1 marginal · 2 a player · 3 central, per era
  presence: Partial<Record<EraId, 0 | 1 | 2 | 3>>;
  arc: Partial<Record<EraId, string>>;
  film?: string;
}

export interface Look {
  skin: string;
  hair?: string;
  eyes?: "blue" | "dark" | "white" | "none";
  head?: "hair" | "long" | "curly" | "bald" | "hood" | "stillsuit" | "crown" | "worm" | "veil";
  wide?: boolean;
  cloth: string;
}

export interface Character {
  id: string;
  name: string;
  aka?: string;
  factions: { id: string; rel: Rel }[];
  eras: Partial<Record<EraId, "alive" | "echo">>; // echo = memory, ghola line, legacy
  blurb: string;
  arc: Partial<Record<EraId, string>>;
  film?: { actor: string; note: string };
  look: Look;
}

// ---------------------------------------------------------------- factions
export const factions: Faction[] = [
  {
    id: "atreides",
    name: "House Atreides",
    kind: "Great House",
    sigil: "hawk",
    colour: "#3f8f4f",
    blurb:
      "A Great House from Caladan, known for loyalty it earns rather than buys. The Emperor fears its popularity; the Bene Gesserit want its bloodline. Every later age of the saga runs through Atreides descendants.",
    presence: {
      "old-empire": 1,
      imperium: 2,
      dune: 3,
      messiah: 3,
      children: 3,
      "god-emperor": 3,
      scattering: 1,
      heretics: 2,
    },
    arc: {
      "old-empire": "Has a Harkonnen banished for cowardice after Corrin, starting the feud.",
      dune: "Given Arrakis as a trap; destroyed; reborn through Paul as the Fremen's ruling house.",
      messiah: "Rules the known universe through Paul's jihad.",
      children: "Alia's regency, then Leto II.",
      "god-emperor": "Leto II is the dynasty; Siona carries the line he bred to be invisible.",
      heretics: "Atreides genes run on in Odrade and her father, Miles Teg.",
    },
    film: "Recognizably the same house, with the Caladan years compressed into a prologue.",
  },
  {
    id: "harkonnen",
    name: "House Harkonnen",
    kind: "Great House",
    sigil: "griffin",
    colour: "#4a6fb5",
    blurb:
      "A Great House from Giedi Prime, rich from decades of spice and ruled by cruelty. Its leader, Baron Vladimir, is the saga's first villain and, through his descendants, a recurring ghost.",
    presence: {
      "old-empire": 1,
      imperium: 3,
      dune: 3,
      messiah: 0,
      children: 1,
      "god-emperor": 0,
      scattering: 0,
      heretics: 1,
    },
    arc: {
      imperium: "Holds Arrakis as a CHOAM fief for about eighty years.",
      dune: "Retakes Arrakis with Sardaukar help, then loses everything at Arrakeen.",
      children: "The Baron's memory possesses Alia.",
      heretics: "Giedi Prime, renamed Gammu, is where the Duncan ghola is raised.",
    },
    film: "Restyled as a pale, hairless people under a black sun. Feyd-Rautha appears only in Part Two.",
  },
  {
    id: "corrino",
    name: "House Corrino & the Sardaukar",
    kind: "Imperial House",
    sigil: "lion",
    colour: "#c9a227",
    blurb:
      "The Padishah Emperors since the Battle of Corrin, ruling from Kaitain with the Sardaukar, terror troops bred on the prison planet Salusa Secundus.",
    presence: { "old-empire": 2, imperium: 3, dune: 3, messiah: 1, children: 2 },
    arc: {
      "old-empire": "Takes the throne at the Battle of Corrin, 88 B.G.",
      dune: "Shaddam IV conspires to destroy the Atreides and loses the throne to Paul.",
      messiah: "Survives through Irulan, Paul's wife in name only.",
      children: "Wensicia plots to put her son Farad'n on the throne.",
    },
    film: "Part One adds a Sardaukar ritual on Salusa Secundus. Shaddam's fall is one scene.",
  },
  {
    id: "bene-gesserit",
    name: "Bene Gesserit",
    kind: "Order",
    sigil: "hood",
    colour: "#8e7fb0",
    blurb:
      "A sisterhood of mental and physical training, founded after the Butlerian Jihad, running a breeding program across millennia. The only institution that lasts from the first book to the last.",
    presence: {
      "old-empire": 1,
      imperium: 3,
      dune: 3,
      messiah: 2,
      children: 2,
      "god-emperor": 2,
      scattering: 1,
      heretics: 3,
    },
    arc: {
      imperium: "Breeds toward the Kwisatz Haderach; seeds legends through the Missionaria Protectiva.",
      dune: "Its plan arrives a generation early, out of its control, in Paul.",
      messiah: "Mohiam joins the conspiracy to steal Paul's bloodline.",
      "god-emperor": "Tolerated and watched by Leto II.",
      heretics: "Becomes the protagonist: hunted by the Honored Matres, then merges with them.",
    },
    film: "More openly sinister; Jessica's role as its agent is foregrounded in Part Two.",
  },
  {
    id: "guild",
    name: "Spacing Guild",
    kind: "Monopoly",
    sigil: "navigator",
    colour: "#5aa0c8",
    blurb:
      "Holds the monopoly on space travel and banking; its Navigators use spice-driven prescience to fold space safely. Utterly dependent on Arrakis.",
    presence: {
      "old-empire": 1,
      imperium: 3,
      dune: 3,
      messiah: 2,
      children: 1,
      "god-emperor": 1,
      scattering: 1,
      heretics: 1,
    },
    arc: {
      imperium: "Its monopoly starts the calendar.",
      dune: "Forced to back Paul when he threatens to destroy the spice.",
      messiah: "The Navigator Edric joins the conspiracy.",
      "god-emperor": "Rationed spice from Leto keeps it obedient.",
      scattering: "Ixian navigation machines and no-ships end its monopoly.",
    },
    film: "Navigators appear only briefly, on Caladan in Part One.",
  },
  {
    id: "fremen",
    name: "Fremen",
    kind: "People",
    sigil: "knife",
    colour: "#c26a2a",
    blurb:
      "Descendants of the Zensunni Wanderers, living in desert sietches. Underestimated by everyone, they are the most dangerous fighters in the universe and the tool, then the victims, of Paul's jihad.",
    presence: { "old-empire": 1, imperium: 2, dune: 3, messiah: 3, children: 3, "god-emperor": 1 },
    arc: {
      "old-empire": "Zensunni migrations from world to world.",
      imperium: "Adopt Pardot Kynes's dream of a green Arrakis.",
      dune: "Follow Paul as Muad'Dib.",
      messiah: "Fight his jihad across the stars and grow soft at home.",
      children: "Split between old ways and the new religion.",
      "god-emperor": 'Survive only as "Museum Fremen", performers of their own past.',
    },
    film: "Split into skeptical northerners and southern fundamentalists, an invention of Part Two.",
  },
  {
    id: "choam",
    name: "CHOAM",
    kind: "Company",
    sigil: "coin",
    colour: "#8a7a4a",
    blurb:
      "The Combine Honnete Ober Advancer Mercantiles, the trading company whose directorships the Emperor and Great Houses share. Spice is its most valuable line.",
    presence: { imperium: 3, dune: 2, messiah: 2, children: 1, "god-emperor": 1, scattering: 1, heretics: 1 },
    arc: {
      imperium: "Holds the purse strings of the Great Convention.",
      dune: "The Atreides' gain in CHOAM standing is part of what makes them dangerous.",
    },
    film: "Barely mentioned.",
  },
  {
    id: "mentats",
    name: "Mentats",
    kind: "School",
    sigil: "lips",
    colour: "#a33a3a",
    blurb:
      "Human computers trained after the Jihad, recognizable by lips stained with sapho juice. Thufir Hawat, Piter de Vries and, much later, Miles Teg.",
    presence: { "old-empire": 1, imperium: 2, dune: 2, messiah: 1, heretics: 2 },
    arc: {
      dune: 'Hawat serves the Atreides, then is forced to serve the Harkonnens; de Vries is a Tleilaxu-made "twisted" Mentat.',
      messiah: "The ghola Hayt is a Mentat.",
      heretics: "Miles Teg, the Sisterhood's Mentat-Bashar.",
    },
    film: "Kept, with the stained lips, but Hawat vanishes after Part One.",
  },
  {
    id: "tleilax",
    name: "Bene Tleilax",
    kind: "People",
    sigil: "mask",
    colour: "#6b7a3a",
    blurb:
      "Gene-crafters with their own secret faith. They make Face Dancers, who can take any shape, and gholas, people regrown from dead cells, above all Duncan Idaho, again and again.",
    presence: { imperium: 1, dune: 1, messiah: 3, children: 1, "god-emperor": 2, scattering: 1, heretics: 3 },
    arc: {
      dune: "Made Piter de Vries.",
      messiah: "Gives Paul the Duncan ghola as a weapon.",
      "god-emperor": "Supplies Leto with Duncan gholas.",
      heretics: "Master Waff's plans; Scytale, the last Master, escapes on the no-ship.",
    },
    film: "Not present.",
  },
  {
    id: "ix",
    name: "Ix",
    kind: "Machine world",
    sigil: "gear",
    colour: "#7f8c99",
    blurb:
      "The machine culture that pushes the Jihad's limits. Its no-chambers and no-ships hide people from prescience, which makes the Scattering possible.",
    presence: { imperium: 1, dune: 1, messiah: 1, children: 1, "god-emperor": 2, scattering: 2, heretics: 2 },
    arc: {
      "god-emperor": "Sends Hwi Noree to Leto and builds a no-chamber.",
      scattering: "No-ships carry humanity beyond reach.",
    },
    film: "Not present.",
  },
  {
    id: "qizarate",
    name: "The Priesthood",
    aka: "Qizarate",
    kind: "Church",
    sigil: "flame",
    colour: "#d9822b",
    blurb:
      "Paul's missionary priesthood, the Qizarate, which turns Muad'Dib into a god. Its successor on Rakis is the Priesthood of the Divided God, worshipping the worms that carry Leto.",
    presence: { messiah: 3, children: 3, "god-emperor": 1, heretics: 2 },
    arc: {
      messiah: "Runs the religion of Muad'Dib.",
      children: "Serves Alia; a priest kills the Preacher.",
      heretics: "The Rakian priesthood interprets Sheeana as a sign.",
    },
    film: "Not yet; Part Two ends where the religion begins.",
  },
  {
    id: "fish-speakers",
    name: "Fish Speakers",
    kind: "Army",
    sigil: "fish",
    colour: "#3a8fa0",
    blurb: "Leto II's army and priesthood, made up entirely of women. After his death some of them scatter.",
    presence: { "god-emperor": 3, scattering: 2, heretics: 1 },
    arc: {
      "god-emperor": "Police the Empire and worship Leto.",
      heretics: "The Honored Matres are hinted to descend partly from them.",
    },
  },
  {
    id: "honored-matres",
    name: "Honored Matres",
    kind: "Order",
    sigil: "claw",
    colour: "#e0562a",
    blurb:
      "A violent matriarchy returning from the Scattering, ruling men through sexual imprinting. They destroy planets the Bene Gesserit hold, and are themselves fleeing an unnamed enemy.",
    presence: { scattering: 2, heretics: 3 },
    arc: { heretics: "Destroy Rakis; end merged with the Bene Gesserit under Murbella." },
  },
];

// ---------------------------------------------------------------- characters
// Looks follow Frank Herbert's text where he gives one (Feyd's dark ringlets, Jessica's bronze hair, the
// Baron's bulk) and are neutral where he doesn't. They never copy an actor from any film or series.
const S = {
  fair: "#f1c9a0",
  tan: "#d9a271",
  olive: "#b98552",
  brown: "#8a5a3c",
  deep: "#5e3a26",
  pale: "#f3e4d6",
  grey: "#cfc6bd",
};
const H = {
  black: "#1d1512",
  brown: "#5b3a22",
  red: "#9b3a22",
  blond: "#d8b25a",
  grey: "#a29a94",
  white: "#eee7dc",
  bronze: "#a8662e",
};

export const characters: Character[] = [
  {
    id: "paul",
    name: "Paul Atreides",
    aka: "Usul · Muad'Dib · the Preacher",
    factions: [
      { id: "atreides", rel: "member" },
      { id: "fremen", rel: "member" },
      { id: "bene-gesserit", rel: "trained" },
      { id: "mentats", rel: "trained" },
      { id: "qizarate", rel: "ally" },
    ],
    eras: { dune: "alive", messiah: "alive", children: "alive" },
    blurb:
      "The Kwisatz Haderach, a generation early. He sees the jihad coming and cannot find a path that avoids it. Herbert built him as a warning about charismatic leaders, not a hero.",
    arc: {
      dune: "Duke's son to Fremen messiah to Emperor in about two years.",
      messiah: "Emperor of a holy war he hates; blinded, he walks into the desert.",
      children: "Returns as a blind Preacher denouncing his own religion, and is killed.",
    },
    film: {
      actor: "Timothée Chalamet",
      note: "Older than the book's fifteen. Part Two turns his acceptance of the messiah role into a darker, more deliberate choice.",
    },
    look: { skin: S.fair, hair: H.black, eyes: "blue", head: "hair", cloth: "#3a3a3a" },
  },
  {
    id: "jessica",
    name: "Lady Jessica",
    factions: [
      { id: "atreides", rel: "member" },
      { id: "bene-gesserit", rel: "member" },
      { id: "fremen", rel: "member" },
    ],
    eras: { dune: "alive", children: "alive" },
    blurb:
      "Bene Gesserit concubine of Duke Leto who disobeyed her order to have a son. Mother of Paul and Alia, later a Fremen Reverend Mother.",
    arc: {
      dune: "Becomes Reverend Mother of Sietch Tabr.",
      messiah: "Off-stage, back on Caladan.",
      children:
        "Returns to judge her grandchildren and is taken to Salusa Secundus, where she trains Farad'n.",
    },
    film: { actor: "Rebecca Ferguson", note: "Becomes an active evangelist of the prophecy in Part Two." },
    look: { skin: S.fair, hair: H.bronze, eyes: "dark", head: "long", cloth: "#3a2a3f" },
  },
  {
    id: "leto-i",
    name: "Duke Leto Atreides",
    factions: [
      { id: "atreides", rel: "member" },
      { id: "harkonnen", rel: "enemy" },
      { id: "corrino", rel: "enemy" },
    ],
    eras: { dune: "alive" },
    blurb:
      "The Red Duke, Paul's father, who accepts Arrakis knowing it is a trap. His name passes to two descendants.",
    arc: { dune: "Betrayed by Yueh; dies trying to kill the Baron with a poison tooth." },
    film: { actor: "Oscar Isaac", note: "Kept closely." },
    look: { skin: S.olive, hair: H.black, eyes: "dark", head: "hair", cloth: "#2f5a3a" },
  },
  {
    id: "alia",
    name: "Alia Atreides",
    aka: "St. Alia-of-the-Knife",
    factions: [
      { id: "atreides", rel: "member" },
      { id: "fremen", rel: "member" },
      { id: "qizarate", rel: "ally" },
      { id: "harkonnen", rel: "enemy" },
    ],
    eras: { dune: "alive", messiah: "alive", children: "alive" },
    blurb:
      "Pre-born: awakened in the womb with every ancestor's memory. A child who kills the Baron, a regent who becomes possessed by him.",
    arc: {
      dune: "Kills Baron Harkonnen with the gom jabbar.",
      messiah: "Priestess of Paul's religion; falls for the ghola Hayt.",
      children: "Possessed by the Baron's memory; marries Duncan; dies by her own hand.",
    },
    film: {
      actor: "Anya Taylor-Joy (vision)",
      note: "Never born in Part Two; speaks from the womb and appears as an adult in Paul's vision.",
    },
    look: { skin: S.fair, hair: H.bronze, eyes: "blue", head: "long", cloth: "#1f1f1f" },
  },
  {
    id: "chani",
    name: "Chani",
    factions: [
      { id: "fremen", rel: "member" },
      { id: "atreides", rel: "member" },
    ],
    eras: { dune: "alive", messiah: "alive" },
    blurb: "Daughter of Liet-Kynes, Fremen fighter, Paul's partner and the mother of his children.",
    arc: {
      dune: "Paul's concubine; their first son is killed in a Sardaukar raid.",
      messiah: "Dies giving birth to Leto II and Ghanima.",
    },
    film: {
      actor: "Zendaya",
      note: "The films' biggest change: a sceptic who rejects the prophecy and leaves Paul at the end of Part Two.",
    },
    look: { skin: S.brown, hair: H.red, eyes: "blue", head: "stillsuit", cloth: "#6b4a32" },
  },
  {
    id: "leto-ii",
    name: "Leto II",
    aka: "the God Emperor · the Tyrant",
    factions: [
      { id: "atreides", rel: "member" },
      { id: "fremen", rel: "member" },
      { id: "fish-speakers", rel: "member" },
      { id: "ix", rel: "ally" },
    ],
    eras: {
      messiah: "alive",
      children: "alive",
      "god-emperor": "alive",
      scattering: "echo",
      heretics: "echo",
    },
    blurb:
      "Paul's son, who takes the sandtrout skin and becomes a human-sandworm hybrid ruling for about 3,500 years, so humanity can never again be killed by one blow.",
    arc: {
      messiah: "Born; his mother dies.",
      children: "Takes the sandtrout skin and the throne.",
      "god-emperor": "Rules, breeds Siona, and arranges his own death.",
      heretics: 'His "pearls of awareness" are said to dream in every sandworm.',
    },
    film: { actor: "Not in the films", note: "Paul and Chani have no children in Part Two." },
    look: { skin: S.fair, hair: H.black, eyes: "blue", head: "worm", cloth: "#8a6a4a" },
  },
  {
    id: "ghanima",
    name: "Ghanima Atreides",
    factions: [
      { id: "atreides", rel: "member" },
      { id: "fremen", rel: "member" },
      { id: "corrino", rel: "ally" },
    ],
    eras: { messiah: "alive", children: "alive" },
    blurb:
      "Leto II's twin sister, pre-born like him. Holds the memories of Chani close as a shield against Abomination.",
    arc: {
      messiah: "Born.",
      children: "Plans to kill Farad'n, then formally marries Leto and takes Farad'n as her consort.",
    },
    look: { skin: S.tan, hair: H.red, eyes: "blue", head: "long", cloth: "#6b4a32" },
  },
  {
    id: "duncan",
    name: "Duncan Idaho",
    aka: "Hayt · gholas",
    factions: [
      { id: "atreides", rel: "member" },
      { id: "tleilax", rel: "trained" },
      { id: "mentats", rel: "trained" },
      { id: "bene-gesserit", rel: "ally" },
      { id: "honored-matres", rel: "enemy" },
    ],
    eras: {
      dune: "alive",
      messiah: "alive",
      children: "alive",
      "god-emperor": "alive",
      scattering: "echo",
      heretics: "alive",
    },
    blurb:
      "The one character in every novel. Swordmaster who dies for Paul, then regrown by the Tleilaxu again and again: the thread that ties five thousand years together.",
    arc: {
      dune: "Dies holding a doorway so Paul and Jessica can escape.",
      messiah: "Returns as the ghola Hayt, a weapon that remembers he is Duncan.",
      children: "Marries Alia; provokes Stilgar into killing him.",
      "god-emperor": "Gholas serve Leto for millennia; the last helps Siona kill him.",
      heretics: "A new ghola with all his past lives; flees into the unknown.",
    },
    film: { actor: "Jason Momoa", note: "Dies in Part One as in the book." },
    look: { skin: S.olive, hair: H.black, eyes: "dark", head: "curly", cloth: "#2f5a3a" },
  },
  {
    id: "stilgar",
    name: "Stilgar",
    factions: [
      { id: "fremen", rel: "member" },
      { id: "atreides", rel: "ally" },
    ],
    eras: { dune: "alive", messiah: "alive", children: "alive" },
    blurb:
      "Naib of Sietch Tabr who takes in Paul and Jessica, then watches his people become something he does not recognize.",
    arc: {
      dune: "Shelters Paul; yields his leadership.",
      messiah: "Paul's minister.",
      children: "Kills Duncan; rebels against Alia.",
    },
    film: { actor: "Javier Bardem", note: "Recast as a fervent, sometimes comic, true believer." },
    look: { skin: S.brown, hair: H.black, eyes: "blue", head: "stillsuit", cloth: "#6b4a32" },
  },
  {
    id: "gurney",
    name: "Gurney Halleck",
    factions: [{ id: "atreides", rel: "member" }],
    eras: { dune: "alive", children: "alive" },
    blurb: "Warrior-troubadour, scarred by Rabban's inkvine whip, who carries a baliset and a grudge.",
    arc: {
      dune: "Survives with smugglers; nearly kills Jessica believing she betrayed the Duke.",
      children: "Serves Jessica; is sent to test Leto II.",
    },
    film: { actor: "Josh Brolin", note: "The attempt on Jessica is cut." },
    look: { skin: S.tan, hair: H.blond, eyes: "dark", head: "hair", cloth: "#4a4a3a" },
  },
  {
    id: "thufir",
    name: "Thufir Hawat",
    factions: [
      { id: "atreides", rel: "member" },
      { id: "mentats", rel: "member" },
      { id: "harkonnen", rel: "enemy" },
    ],
    eras: { dune: "alive" },
    blurb: "Master of Assassins to three generations of Atreides. Captured and kept alive by poison.",
    arc: { dune: "Dies refusing the Emperor's order to kill Paul." },
    film: { actor: "Stephen McKinley Henderson", note: "Not seen after Part One." },
    look: { skin: S.tan, hair: H.grey, eyes: "dark", head: "hair", cloth: "#2f5a3a" },
  },
  {
    id: "baron",
    name: "Baron Vladimir Harkonnen",
    factions: [
      { id: "harkonnen", rel: "member" },
      { id: "corrino", rel: "ally" },
      { id: "atreides", rel: "enemy" },
    ],
    eras: { dune: "alive", children: "echo" },
    blurb:
      "Head of House Harkonnen, held up by suspensors, and secretly Jessica's father. Killed by his granddaughter; returns as a voice inside her.",
    arc: { dune: "Destroys the Atreides; killed by Alia.", children: "His memory possesses Alia." },
    film: { actor: "Stellan Skarsgård", note: "Killed by Paul. His being Jessica's father is kept." },
    look: { skin: S.fair, eyes: "dark", head: "bald", wide: true, cloth: "#2a3a6a" },
  },
  {
    id: "feyd",
    name: "Feyd-Rautha Harkonnen",
    factions: [
      { id: "harkonnen", rel: "member" },
      { id: "bene-gesserit", rel: "ally" },
    ],
    eras: { dune: "alive" },
    blurb:
      "The Baron's nephew and heir, a gladiator with a showman's cruelty, and a Bene Gesserit genetic insurance policy.",
    arc: { dune: "Killed by Paul in a duel." },
    film: { actor: "Austin Butler", note: "Introduced in Part Two in a black-sun arena." },
    look: { skin: S.fair, hair: H.black, eyes: "dark", head: "curly", cloth: "#2a3a6a" },
  },
  {
    id: "kynes",
    name: "Liet-Kynes",
    factions: [
      { id: "fremen", rel: "member" },
      { id: "corrino", rel: "member" },
    ],
    eras: { imperium: "alive", dune: "alive" },
    blurb: "Imperial Planetologist and secret Fremen leader, son of Pardot Kynes and father of Chani.",
    arc: {
      imperium: "Inherits his father's plan to green Arrakis.",
      dune: "Abandoned in the desert by the Harkonnens; dies in a spice blow.",
    },
    film: {
      actor: "Sharon Duncan-Brewster",
      note: "A woman, Dr. Liet Kynes, who dies summoning a worm onto the Sardaukar.",
    },
    look: { skin: S.tan, hair: H.brown, eyes: "blue", head: "stillsuit", cloth: "#7a6a4a" },
  },
  {
    id: "mohiam",
    name: "Gaius Helen Mohiam",
    factions: [
      { id: "bene-gesserit", rel: "member" },
      { id: "corrino", rel: "ally" },
    ],
    eras: { dune: "alive", messiah: "alive" },
    blurb:
      "Reverend Mother and the Emperor's Truthsayer. Tests Paul with the gom jabbar; later plots against him.",
    arc: { dune: "The gom jabbar.", messiah: "Joins the conspiracy; executed on Paul's order." },
    film: { actor: "Charlotte Rampling", note: "Kept." },
    look: { skin: S.fair, hair: H.grey, eyes: "dark", head: "long", cloth: "#111111" },
  },
  {
    id: "irulan",
    name: "Princess Irulan",
    factions: [
      { id: "corrino", rel: "member" },
      { id: "bene-gesserit", rel: "trained" },
      { id: "atreides", rel: "member" },
    ],
    eras: { dune: "alive", messiah: "alive", children: "alive" },
    blurb: "Shaddam's eldest daughter and Paul's wife in name, whose histories open every chapter of Dune.",
    arc: {
      dune: "The political price of the throne.",
      messiah: "Secretly gives Chani contraceptives.",
      children: "Protects the twins.",
    },
    film: {
      actor: "Florence Pugh",
      note: "A character on screen rather than the book's narrator-historian.",
    },
    look: { skin: S.fair, hair: H.blond, eyes: "dark", head: "long", cloth: "#c9a227" },
  },
  {
    id: "shaddam",
    name: "Shaddam IV",
    factions: [
      { id: "corrino", rel: "member" },
      { id: "harkonnen", rel: "ally" },
      { id: "atreides", rel: "enemy" },
    ],
    eras: { dune: "alive" },
    blurb: "The 81st Padishah Emperor, who sets the trap on Arrakis and loses his throne to it.",
    arc: { dune: "Abdicates to Salusa Secundus." },
    film: { actor: "Christopher Walken", note: "Kept, compressed." },
    look: { skin: S.fair, hair: H.red, eyes: "dark", head: "crown", cloth: "#7a2a2a" },
  },
  {
    id: "farad",
    name: "Farad'n Corrino",
    aka: "Harq al-Ada",
    factions: [
      { id: "corrino", rel: "member" },
      { id: "bene-gesserit", rel: "trained" },
      { id: "atreides", rel: "ally" },
    ],
    eras: { children: "alive" },
    blurb:
      "Shaddam's grandson, a scholar pushed toward the throne by his mother Wensicia. Trained by Jessica; ends as Leto II's scribe.",
    arc: { children: "Disowns his mother's plot; becomes Ghanima's consort." },
    look: { skin: S.fair, hair: H.red, eyes: "dark", head: "hair", cloth: "#c9a227" },
  },
  {
    id: "scytale",
    name: "Scytale (Face Dancer)",
    factions: [{ id: "tleilax", rel: "member" }],
    eras: { messiah: "alive" },
    blurb:
      "The Tleilaxu Face Dancer who drives the conspiracy in Messiah. The books never say whether he is linked to the Tleilaxu Master Scytale of Heretics and Chapterhouse.",
    arc: { messiah: "Offers Paul a ghola of Chani; is killed by Paul." },
    look: { skin: S.grey, eyes: "white", head: "bald", cloth: "#4a5a2a" },
  },
  {
    id: "moneo",
    name: "Moneo Atreides",
    factions: [
      { id: "atreides", rel: "member" },
      { id: "fish-speakers", rel: "ally" },
    ],
    eras: { "god-emperor": "alive" },
    blurb: "Leto II's majordomo, a former rebel who has seen the Golden Path and serves it. Siona's father.",
    arc: { "god-emperor": "Dies in the fall from the bridge with Leto." },
    look: { skin: S.olive, hair: H.grey, eyes: "dark", head: "hair", cloth: "#5a4a6a" },
  },
  {
    id: "siona",
    name: "Siona Atreides",
    factions: [
      { id: "atreides", rel: "member" },
      { id: "fish-speakers", rel: "member" },
    ],
    eras: { "god-emperor": "alive", heretics: "echo" },
    blurb:
      "A rebel against Leto II, and the goal of his breeding: a human invisible to prescience. Her descendants cannot be foreseen.",
    arc: {
      "god-emperor": "Steals his journals; kills him at the bridge.",
      heretics: "Her bloodline protects Teg, Odrade and the later Duncan gholas from prescient sight.",
    },
    look: { skin: S.olive, hair: H.black, eyes: "dark", head: "long", cloth: "#3a6a7a" },
  },
  {
    id: "hwi",
    name: "Hwi Noree",
    factions: [{ id: "ix", rel: "member" }],
    eras: { "god-emperor": "alive" },
    blurb: "Ixian ambassador engineered to be the woman Leto II could love. He agrees to marry her.",
    arc: { "god-emperor": "Dies at the bridge with Leto." },
    look: { skin: S.fair, hair: H.black, eyes: "dark", head: "long", cloth: "#7f8c99" },
  },
  {
    id: "odrade",
    name: "Darwi Odrade",
    factions: [
      { id: "bene-gesserit", rel: "member" },
      { id: "atreides", rel: "member" },
    ],
    eras: { heretics: "alive" },
    blurb:
      "Bene Gesserit with Atreides blood, Taraza's successor as Mother Superior. Unusually willing to gamble.",
    arc: { heretics: "Escapes Rakis with the last worm; dies in the gambit at Junction." },
    look: { skin: S.olive, hair: H.black, eyes: "blue", head: "veil", cloth: "#111111" },
  },
  {
    id: "teg",
    name: "Miles Teg",
    factions: [
      { id: "bene-gesserit", rel: "ally" },
      { id: "mentats", rel: "member" },
      { id: "atreides", rel: "member" },
    ],
    eras: { heretics: "alive" },
    blurb:
      "Mentat-Bashar, the Sisterhood's greatest soldier, of Atreides descent. Under torture discovers he can move faster than the eye.",
    arc: { heretics: "Protects the Duncan ghola; dies on Rakis, then returns as a ghola in Chapterhouse." },
    look: { skin: S.fair, hair: H.white, eyes: "dark", head: "hair", cloth: "#3a3a3a" },
  },
  {
    id: "sheeana",
    name: "Sheeana",
    factions: [
      { id: "qizarate", rel: "ally" },
      { id: "bene-gesserit", rel: "member" },
    ],
    eras: { heretics: "alive" },
    blurb: "A Rakian girl who can command sandworms. Taken into the Sisterhood; leaves on the no-ship.",
    arc: { heretics: "From worm-dancer to Bene Gesserit to fugitive." },
    look: { skin: S.brown, hair: H.brown, eyes: "blue", head: "long", cloth: "#7a6a4a" },
  },
  {
    id: "murbella",
    name: "Murbella",
    factions: [
      { id: "honored-matres", rel: "member" },
      { id: "bene-gesserit", rel: "member" },
    ],
    eras: { heretics: "alive" },
    blurb:
      "A young Honored Matre who tries to imprint Duncan and is imprinted instead. Ends as the leader of both orders.",
    arc: { heretics: "Captured, retrained, then commands the merged Sisterhood." },
    look: { skin: S.fair, hair: H.blond, eyes: "dark", head: "long", cloth: "#e0562a" },
  },
];

// ---------------------------------------------------------------- event tags
// Which characters and factions each timeline event involves. Feeds the character and
// faction pages and the intersection views.
export const tags: Record<string, { who?: string[]; f?: string[] }> = {
  zensunni: { f: ["fremen"] },
  jihad: { f: [] },
  schools: { f: ["bene-gesserit", "mentats", "guild"] },
  corrin: { f: ["corrino", "atreides", "harkonnen"] },
  guild: { f: ["guild", "choam"] },
  convention: { f: ["guild", "corrino", "choam"] },
  breeding: { who: ["jessica"], f: ["bene-gesserit", "atreides", "harkonnen"] },
  missionaria: { f: ["bene-gesserit", "fremen"] },
  "harkonnen-fief": { who: ["baron"], f: ["harkonnen", "choam", "fremen"] },
  kynes: { who: ["kynes"], f: ["fremen", "corrino"] },
  "gom-jabbar": { who: ["paul", "mohiam", "jessica", "leto-i"], f: ["bene-gesserit", "atreides"] },
  arrakeen: { who: ["paul", "jessica", "leto-i", "duncan", "kynes"], f: ["atreides", "fremen"] },
  betrayal: {
    who: ["leto-i", "baron", "thufir", "jessica", "paul"],
    f: ["atreides", "harkonnen", "corrino", "mentats"],
  },
  "kynes-death": {
    who: ["paul", "jessica", "duncan", "kynes"],
    f: ["atreides", "fremen", "corrino", "harkonnen"],
  },
  jamis: { who: ["paul", "jessica", "stilgar", "chani"], f: ["fremen"] },
  "reverend-mother": { who: ["jessica", "alia"], f: ["fremen", "bene-gesserit"] },
  "alia-born": { who: ["alia", "jessica"], f: ["atreides", "fremen"] },
  "first-son": { who: ["paul", "chani", "alia"], f: ["atreides", "fremen", "corrino"] },
  stilltent: { who: ["paul", "jessica", "baron"], f: ["atreides", "harkonnen", "bene-gesserit"] },
  sandrider: { who: ["paul", "stilgar", "chani"], f: ["fremen"] },
  rabban: { who: ["baron", "feyd", "gurney"], f: ["harkonnen", "fremen"] },
  jacurutu: { who: ["leto-ii", "gurney", "jessica"], f: ["fremen", "bene-gesserit", "atreides"] },
  "duncan-stilgar": { who: ["duncan", "stilgar", "alia"], f: ["fremen", "atreides"] },
  "siona-test": { who: ["siona", "leto-ii"], f: ["atreides"] },
  chani: { who: ["chani", "paul", "kynes"], f: ["fremen"] },
  "water-of-life": { who: ["paul", "chani", "jessica"], f: ["fremen", "bene-gesserit"] },
  hawat: {
    who: ["thufir", "gurney", "jessica", "paul", "shaddam"],
    f: ["mentats", "harkonnen", "atreides", "corrino"],
  },
  feyd: { who: ["feyd", "baron"], f: ["harkonnen", "bene-gesserit", "corrino"] },
  "arrakeen-battle": {
    who: ["paul", "alia", "jessica", "mohiam", "baron", "feyd", "shaddam", "gurney", "stilgar", "thufir"],
    f: ["fremen", "atreides", "corrino", "harkonnen", "guild"],
  },
  ascension: {
    who: ["paul", "shaddam", "irulan", "chani", "jessica", "mohiam"],
    f: ["atreides", "corrino", "guild", "bene-gesserit"],
  },
  "jihad-cost": { who: ["paul"], f: ["fremen", "qizarate", "atreides"] },
  conspiracy: {
    who: ["mohiam", "scytale", "irulan", "duncan", "paul"],
    f: ["bene-gesserit", "guild", "tleilax", "corrino"],
  },
  "chani-death": {
    who: ["paul", "chani", "irulan", "duncan", "alia", "leto-ii", "ghanima", "scytale"],
    f: ["atreides", "fremen", "tleilax", "qizarate"],
  },
  abomination: { who: ["alia", "baron", "jessica"], f: ["atreides", "harkonnen", "bene-gesserit"] },
  farad: {
    who: ["farad", "leto-ii", "ghanima", "paul", "jessica", "duncan"],
    f: ["corrino", "qizarate", "bene-gesserit"],
  },
  sandtrout: {
    who: ["leto-ii", "paul", "alia", "ghanima", "stilgar"],
    f: ["fremen", "qizarate", "atreides"],
  },
  "golden-path": { who: ["leto-ii", "ghanima", "farad"], f: ["atreides", "corrino"] },
  peace: { who: ["leto-ii", "duncan"], f: ["fish-speakers", "tleilax", "atreides"] },
  siona: { who: ["siona", "moneo", "hwi", "leto-ii", "duncan"], f: ["atreides", "ix", "fish-speakers"] },
  "leto-death": { who: ["leto-ii", "siona", "duncan", "moneo", "hwi"], f: ["atreides", "fish-speakers"] },
  famine: { f: ["ix", "guild"] },
  "honored-matres": { f: ["honored-matres", "fish-speakers", "bene-gesserit"] },
  sheeana: { who: ["sheeana", "odrade"], f: ["qizarate", "bene-gesserit"] },
  teg: { who: ["teg", "duncan", "murbella"], f: ["bene-gesserit", "mentats", "honored-matres", "tleilax"] },
  "rakis-destroyed": {
    who: ["odrade", "sheeana", "teg"],
    f: ["honored-matres", "bene-gesserit", "qizarate"],
  },
  chapterhouse: {
    who: ["odrade", "murbella", "teg", "sheeana", "duncan"],
    f: ["bene-gesserit", "honored-matres"],
  },
  junction: {
    who: ["odrade", "murbella", "duncan", "sheeana", "teg"],
    f: ["bene-gesserit", "honored-matres", "tleilax"],
  },
  "daniel-marty": { who: ["duncan", "sheeana"] },
};

export const charById = Object.fromEntries(characters.map((c) => [c.id, c]));
export const factionById = Object.fromEntries(factions.map((f) => [f.id, f]));
