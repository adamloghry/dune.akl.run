// Glossary of Dune terms a reader of this site meets in the timeline, the cast pages and the
// later-books cards. Every definition is written in our own words. Book canon (Frank Herbert's six
// novels plus the appendices and glossary printed with Dune) is the record; `film` notes describe
// Denis Villeneuve's Dune (2021) and Dune: Part Two (2024) only. Terms that exist only in the later
// novels by Brian Herbert and Kevin J. Anderson carry `tier: 'later-books'`.
//
// Matching (see src/lib/gloss.ts) is case-sensitive on whole words, so every spelling or
// inflection that should be linked in running text must be listed in `term` or `aliases`.

export interface Term {
  id: string;
  term: string;
  /** Other spellings or inflections to match in text, e.g. 'gholas', 'Face Dancers'. */
  aliases?: string[];
  /** One line, at most 160 characters, in our own words. */
  def: string;
  /** Optional one or two extra sentences. */
  more?: string;
  /** Optional: how Villeneuve's films show or change it. */
  film?: string;
  /** Default 'book'. 'later-books' = exists only in the novels by Brian Herbert & Kevin J. Anderson. */
  tier?: "book" | "later-books";
}

const terms: Term[] = [
  {
    id: "abomination",
    term: "Abomination",
    def: "A pre-born person taken over by an ancestral life in their memory. The Bene Gesserit fear it above almost anything.",
    more: "Every pre-born child faces this danger, so the Sisterhood watches them closely.",
  },
  {
    id: "amtal",
    term: "amtal",
    aliases: ["amtal rule"],
    def: "A custom of testing something to destruction to learn its limits. On Arrakis it can mean a fight to the death.",
    more: "It lies behind Jamis's challenge to Paul in Dune.",
  },
  {
    id: "arrakeen",
    term: "Arrakeen",
    def: "The first settlement on Arrakis and its seat of government. The Atreides move into its Residency.",
  },
  {
    id: "arrakis",
    term: "Arrakis",
    def: "The desert planet, the only known natural source of melange. The Fremen call it Dune; much later it is Rakis.",
  },
  {
    id: "assassins-handbook",
    term: "Assassins' Handbook",
    def: "An old reference work listing the poisons and weapons allowed in a War of Assassins.",
  },
  {
    id: "atomics",
    term: "atomics",
    aliases: ["family atomics"],
    def: "Nuclear weapons. Each Great House keeps a family stockpile, but the Great Convention forbids using them on people.",
    more: "Paul uses his on the Shield Wall: rock, not people, so within the letter of the law.",
    film: "Part Two keeps the atomics that blast open the Shield Wall.",
  },
  {
    id: "axlotl-tank",
    term: "axlotl tank",
    aliases: ["axlotl tanks"],
    def: "The Tleilaxu vats that grow gholas. The last two novels reveal them as living Tleilaxu women.",
  },
  {
    id: "baliset",
    term: "baliset",
    def: "A nine-string instrument, a kind of zither. Gurney Halleck carries one and is rarely far from a song.",
  },
  {
    id: "bashar",
    term: "Bashar",
    aliases: ["Mentat-Bashar"],
    def: "A senior military rank, first used for Sardaukar officers. Miles Teg is a Mentat-Bashar: commander and Mentat.",
  },
  {
    id: "bene-gesserit",
    term: "Bene Gesserit",
    aliases: ["Sisterhood", "Sister"],
    def: "An ancient order of women trained to master body and mind. It runs a secret breeding program aimed at the Kwisatz Haderach.",
    more: "Its members serve the Great Houses as wives, advisers and Truthsayers. It is the only old power left in the last two novels.",
    film: "More openly sinister on screen. Part Two foregrounds Jessica's work as its agent.",
  },
  {
    id: "bene-tleilax",
    term: "Bene Tleilax",
    aliases: ["Tleilaxu", "Tleilax"],
    def: "Secretive gene-crafters with a hidden faith of their own. They make gholas, Face Dancers and twisted Mentats.",
    film: "Absent from both films.",
  },
  {
    id: "butlerian-jihad",
    term: "Butlerian Jihad",
    aliases: ["Jihad"],
    def: "The crusade, more than ten thousand years before Dune, that destroyed computers, thinking machines and conscious robots.",
    more: "Its ban on machines made like a human mind shapes everything after. Mentats, Navigators and the Bene Gesserit do work machines once did.",
  },
  {
    id: "butlerians",
    term: "Butlerians",
    tier: "later-books",
    def: "A violent anti-technology movement in the Great Schools novels, led by Manford Torondo, that attacks the new schools.",
  },
  {
    id: "caladan",
    term: "Caladan",
    def: "The ocean world, home of House Atreides before Arrakis.",
  },
  {
    id: "chapterhouse",
    term: "Chapterhouse",
    def: "The hidden home world of the Bene Gesserit. In the last novel it begins drying into desert.",
  },
  {
    id: "choam",
    term: "CHOAM",
    def: "Combine Honnete Ober Advancer Mercantiles, the great trading company. The Emperor and the Great Houses share its directorships.",
    more: "Spice is its most valuable line. A House's CHOAM shares are a measure of its power.",
  },
  {
    id: "crysknife",
    term: "crysknife",
    aliases: ["crysknives"],
    def: "The sacred Fremen knife, made from a sandworm's tooth. An unfixed blade disintegrates away from a living body.",
    more: "By custom, once drawn it must draw blood before it is sheathed.",
    film: "Kept. Shadout Mapes gives one to Jessica in Part One.",
  },
  {
    id: "cymek",
    term: "cymek",
    aliases: ["cymeks"],
    tier: "later-books",
    def: "A human brain kept alive in a canister and driving a machine body. The Titans of the Legends of Dune novels become cymeks.",
  },
  {
    id: "divided-god",
    term: "Divided God",
    def: "Leto II as worshipped on Rakis in the last novels: one god split among the sandworms that carry pieces of him.",
  },
  {
    id: "eyes-of-ibad",
    term: "Eyes of Ibad",
    aliases: ["blue-within-blue"],
    def: "Eyes turned solid blue, whites included, by a diet heavy in spice. Every Fremen has them.",
    film: "Kept in both films as the mark of the Fremen.",
  },
  {
    id: "face-dancer",
    term: "Face Dancer",
    aliases: ["Face Dancers"],
    def: "A Tleilaxu-made mimic who can reshape face and body to pass as almost anyone.",
  },
  {
    id: "faufreluches",
    term: "faufreluches",
    def: "The Imperium's rigid class system, which fixes every person's place.",
  },
  {
    id: "fedaykin",
    term: "Fedaykin",
    def: "Fremen death commandos, sworn to die for a cause. They become Paul's personal guard.",
  },
  {
    id: "fish-speakers",
    term: "Fish Speakers",
    aliases: ["Fish Speaker"],
    def: "Leto II's all-female army and priesthood, devoted to him.",
    more: "After his death some scatter. The last novels name them among the Honored Matres' ancestors.",
  },
  {
    id: "fremen",
    term: "Fremen",
    def: "The free people of the deep desert of Arrakis, descended from the Zensunni Wanderers. Far more numerous and dangerous than outsiders think.",
    film: "Part Two invents a split between skeptical northerners and devout southerners.",
  },
  {
    id: "gammu",
    term: "Gammu",
    def: "Giedi Prime's later name. In Heretics of Dune the newest Duncan Idaho ghola is raised there.",
  },
  {
    id: "ghola",
    term: "ghola",
    aliases: ["gholas", "Gholas"],
    def: "A person regrown by the Tleilaxu from a dead body's cells, without the original's memories unless they are woken.",
    more: "Duncan Idaho is regrown again and again, from Dune Messiah to Chapterhouse: Dune.",
  },
  {
    id: "giedi-prime",
    term: "Giedi Prime",
    def: "The Harkonnen home world: industrial, cruel and built for spectacle.",
    film: "Part Two invents a black sun that drains it of color.",
  },
  {
    id: "golden-path",
    term: "Golden Path",
    def: "Leto II's plan to save humanity from extinction: a tyranny long enough that people learn never to rely on one ruler or one world again.",
    more: "Paul sees it and turns away. Leto takes it on, at the cost of his humanity.",
  },
  {
    id: "gom-jabbar",
    term: "gom jabbar",
    def: "A poisoned needle held at the neck during a Bene Gesserit test: endure the pain box without pulling your hand away, or die.",
    more: "The test separates humans, who can override instinct, from animals, which cannot.",
    film: "Kept closely in Part One.",
  },
  {
    id: "great-convention",
    term: "Great Convention",
    def: "The universal truce that holds the Imperium together. Its hardest rule: no atomics against people.",
  },
  {
    id: "great-houses",
    term: "Great Houses",
    aliases: ["Great House"],
    def: "The noble families that rule planets as fiefs and sit together in the Landsraad.",
  },
  {
    id: "holtzman-shield",
    term: "Holtzman shield",
    aliases: ["shields"],
    def: "A force field that stops anything moving fast. Only a slow blade gets through, so the Imperium fights with knives.",
    more: "A lasgun beam that hits a shield sets off a blast like an atomic explosion.",
    film: "The films show a shield flash red when a slow blade gets through.",
  },
  {
    id: "honored-matres",
    term: "Honored Matres",
    aliases: ["Honored Matre", "Matres"],
    def: "A violent order of women who return from the Scattering and rule men through sexual imprinting.",
    more: "Chapterhouse: Dune traces them to Fish Speakers and Bene Gesserit who fled into the Scattering. They flee an enemy of their own.",
  },
  {
    id: "hunter-seeker",
    term: "hunter-seeker",
    def: "A small flying needle, steered by a hidden operator, that hunts a target and burrows into flesh.",
    film: "Kept in Part One, in the attempt on Paul's life.",
  },
  {
    id: "imperium",
    term: "Imperium",
    def: "The known universe under the Padishah Emperor, held in balance by the Emperor, the Great Houses and the Spacing Guild.",
  },
  {
    id: "imprinting",
    term: "imprinting",
    aliases: ["imprint", "imprinted"],
    def: "Sexual conditioning that binds a partner to the one who imprints them. The Bene Gesserit teach it; the Honored Matres make it a weapon.",
  },
  {
    id: "inkvine",
    term: "inkvine",
    def: "A creeping Giedi Prime plant used as a whip. Its lash leaves a dark red scar that hurts for years, like the one on Gurney's jaw.",
  },
  {
    id: "ix",
    term: "Ix",
    aliases: ["Ixian"],
    def: "The machine-building world that pushes the limits the Jihad set. Its no-chambers and no-ships hide people from prescience.",
  },
  {
    id: "jacurutu",
    term: "Jacurutu",
    def: "A lost sietch whose people stole water and were wiped out by the other tribes. Fremen treat its name as a curse.",
    more: "In Children of Dune it is not as empty as the legend says.",
  },
  {
    id: "jihad",
    term: "jihad",
    aliases: ["Muad'Dib's Jihad"],
    def: "The holy war Fremen legions fight across the Imperium in Paul's name. He foresees it and cannot stop it.",
    film: "Part Two ends as Paul launches it.",
  },
  {
    id: "junction",
    term: "Junction",
    def: "Once a Guild world, the stronghold of the Honored Matres in Chapterhouse: Dune.",
  },
  {
    id: "kaitain",
    term: "Kaitain",
    def: "The Imperial capital world, where the Padishah Emperor keeps his court.",
  },
  {
    id: "kanly",
    term: "kanly",
    def: "A formal feud or vendetta between Great Houses, fought under strict rules.",
  },
  {
    id: "kwisatz-haderach",
    term: "Kwisatz Haderach",
    def: "The male the Bene Gesserit bred for: one who can look into the places, past and future, that their own minds cannot reach.",
    more: 'The name means "shortening of the way". Paul arrives a generation early and outside their control.',
  },
  {
    id: "landsraad",
    term: "Landsraad",
    def: "The assembly of the Great Houses, one of the three powers that balance the Imperium with the Emperor and the Guild.",
  },
  {
    id: "lasgun",
    term: "lasgun",
    aliases: ["lasguns"],
    def: "A continuous-beam laser weapon. Fired into a shield, it sets off a blast that can destroy shooter and target alike.",
  },
  {
    id: "laza-tiger",
    term: "Laza tiger",
    aliases: ["Laza tigers"],
    def: "Big cats from Salusa Secundus. In Children of Dune they are trained to hunt the Atreides twins.",
  },
  {
    id: "lisan-al-gaib",
    term: "Lisan al-Gaib",
    def: "The Voice from the Outer World: the off-world messiah of Fremen prophecy, a legend the Missionaria Protectiva planted long ago.",
    film: "Part Two roots belief in it among southern fundamentalists. Paul claims the title before their war council.",
  },
  {
    id: "mahdi",
    term: "Mahdi",
    def: "The Fremen title for the messiah who will lead them to paradise. They hail Paul by it.",
  },
  {
    id: "maker",
    term: "maker",
    aliases: ["makers"],
    def: "The Fremen word for a sandworm, the creature behind the spice and the desert itself.",
  },
  {
    id: "maker-hooks",
    term: "maker hooks",
    aliases: ["hooks"],
    def: "Long hooks a sandrider drives under the edge of a worm's ring segment to hold it open, keep the worm on the surface and steer it.",
    film: "Kept in Paul's first worm ride in Part Two.",
  },
  {
    id: "melange",
    term: "melange",
    aliases: ["spice"],
    def: "The spice. It extends life, sharpens awareness and enables prescience, and it is addictive. Arrakis is its only natural source.",
    more: "Withdrawal kills. The Guild cannot navigate without it, so whoever controls Arrakis holds the Imperium by the throat.",
    film: "Glittering orange dust hanging in the desert air.",
  },
  {
    id: "mentat",
    term: "Mentat",
    aliases: ["Mentats"],
    def: "A person trained to do the thinking computers did before the Butlerian Jihad.",
    more: "Mentats in Dune drink sapho juice, which stains their lips.",
    film: "Kept, with the stained lips.",
  },
  {
    id: "missionaria-protectiva",
    term: "Missionaria Protectiva",
    def: "The Bene Gesserit arm that seeds legends and prophecies on primitive worlds for Sisters in trouble to use later.",
  },
  {
    id: "mother-superior",
    term: "Mother Superior",
    def: "The head of the Bene Gesserit. In the last two novels Taraza, then Odrade, hold the office.",
  },
  {
    id: "muad-dib",
    term: "Muad'Dib",
    def: "Paul's self-chosen Fremen name, after a small desert mouse admired for surviving.",
  },
  {
    id: "museum-fremen",
    term: "Museum Fremen",
    def: "In God Emperor of Dune, the last Fremen, who act out their ancestors' desert life for show.",
  },
  {
    id: "naib",
    term: "naib",
    aliases: ["Naib"],
    def: "The leader of a sietch, sworn never to be taken alive by an enemy.",
  },
  {
    id: "navigator",
    term: "Navigator",
    aliases: ["Navigators"],
    def: "A Guild pilot who uses spice-driven prescience to find a safe path when a ship folds space.",
    more: "Years of spice change their bodies. The first seen on the page, Edric in Dune Messiah, lives in a tank of spice gas.",
    film: "Seen only briefly, on Caladan in Part One.",
  },
  {
    id: "no-chamber",
    term: "no-chamber",
    aliases: ["no-globe"],
    def: "An Ixian-made space whose occupants prescience cannot see.",
  },
  {
    id: "no-ship",
    term: "no-ship",
    aliases: ["no-ships", "No-ships"],
    def: "An Ixian ship hidden from prescience. No-ships carry humanity out into the Scattering.",
  },
  {
    id: "omnius",
    term: "Omnius",
    tier: "later-books",
    def: "The computer mind that rules the Synchronized Worlds in the prequel novels. Frank Herbert's books have no such machine.",
  },
  {
    id: "orange-catholic-bible",
    term: "Orange Catholic Bible",
    def: "The shared scripture of the Imperium, built from older faiths after the Jihad to calm the religious wars.",
  },
  {
    id: "ornithopter",
    term: "ornithopter",
    aliases: ["ornithopters", "thopter"],
    def: "An aircraft with beating, birdlike wings. The usual way to fly on Arrakis.",
    film: "Redesigned as a dragonfly-like craft with fast-beating wings.",
  },
  {
    id: "other-memory",
    term: "Other Memory",
    aliases: ["ancestral memories", "ancestral memory"],
    def: "The lives of one's ancestors held in memory: woken by the spice agony in a Reverend Mother, present from birth in the pre-born.",
    more: "A Reverend Mother gains her female line. Paul and the pre-born reach both lines.",
  },
  {
    id: "padishah-emperor",
    term: "Padishah Emperor",
    aliases: ["Padishah Emperors"],
    def: "The title of the ruler of the Imperium. House Corrino holds it from the Battle of Corrin until Paul.",
  },
  {
    id: "pearls",
    term: "pearls of awareness",
    aliases: ["pearls", "pearl"],
    def: "Pieces of Leto II's mind carried by the sandtrout he sheds as he dies, so each new worm holds a dreaming part of him.",
  },
  {
    id: "planetologist",
    term: "Planetologist",
    def: "A scientist of whole worlds. Pardot Kynes, then his son Liet-Kynes, serve as Imperial Planetologist on Arrakis.",
  },
  {
    id: "pre-born",
    term: "pre-born",
    aliases: ["Pre-born"],
    def: "A child awakened in the womb when the mother takes the Water of Life. Born fully aware, with the memories of its ancestors.",
  },
  {
    id: "prescience",
    term: "prescience",
    def: "Sight into possible futures, which spice can bring on. Guild Navigators, Paul and Leto II have it in different strengths.",
    more: "It has blind spots: other prescients, no-ships, and people like Siona who were bred to be unseen.",
  },
  {
    id: "project-amal",
    term: "Project Amal",
    tier: "later-books",
    def: "The secret Tleilaxu attempt, on Ix and for Shaddam, to make synthetic spice in the Prelude to Dune novels.",
  },
  {
    id: "qizarate",
    term: "Qizarate",
    def: "The missionary priesthood of Paul's religion. It spreads the faith across the Imperium and turns Muad'Dib into a god.",
  },
  {
    id: "rakis",
    term: "Rakis",
    aliases: ["Rakian"],
    def: "Arrakis's later name, once it has turned back into desert. Its priests worship the worms.",
  },
  {
    id: "reverend-mother",
    term: "Reverend Mother",
    aliases: ["Reverend Mothers"],
    def: "A Bene Gesserit, or a Fremen religious leader, who has survived the spice agony and gained the memories of her female ancestors.",
  },
  {
    id: "salusa-secundus",
    term: "Salusa Secundus",
    def: "The Imperial prison planet. Its brutal conditions forge the Sardaukar, and Shaddam IV is exiled there.",
  },
  {
    id: "sandrider",
    term: "sandrider",
    aliases: ["sandriders"],
    def: "A Fremen who has called and ridden a sandworm. The first ride is a rite of adulthood.",
  },
  {
    id: "sandtrout",
    term: "sandtrout",
    def: "The sandworm's small larval stage. Sandtrout wall off water underground, keeping Arrakis a desert.",
    more: "In Children of Dune, Leto II lets them cover his skin like a living membrane.",
  },
  {
    id: "sandworm",
    term: "sandworm",
    aliases: ["sandworms", "worm", "worms"],
    def: "The giant worm of Arrakis, drawn by rhythm on the sand. Its life cycle produces the spice.",
  },
  {
    id: "sapho",
    term: "sapho",
    aliases: ["sapho juice"],
    def: "A strong liquid pressed from the roots of an Ecaz plant. Mentats drink it to sharpen thought; it stains the lips red.",
  },
  {
    id: "sardaukar",
    term: "Sardaukar",
    def: "The Emperor's terror troops, raised on the prison planet Salusa Secundus. Unbeaten for centuries.",
    film: "Part One adds a Sardaukar ritual on Salusa Secundus.",
  },
  {
    id: "sareer",
    term: "Sareer",
    def: "In God Emperor of Dune, the last strip of desert on a green Arrakis, kept by Leto II.",
  },
  {
    id: "scattering",
    term: "Scattering",
    def: "The flight of trillions of people into unknown space after Leto II's death, carried by no-ships beyond any one power's reach.",
  },
  {
    id: "shadout",
    term: "Shadout",
    def: 'A Fremen title of respect meaning "well-dipper". The Atreides housekeeper on Arrakis is the Shadout Mapes.',
  },
  {
    id: "shai-hulud",
    term: "Shai-Hulud",
    def: "The Fremen holy name for the sandworm, the Old Man of the Desert, treated as a god.",
    film: "Kept. The Fremen in the films call the worms by it.",
  },
  {
    id: "shield-wall",
    term: "Shield Wall",
    def: "A mountain range that shelters Arrakeen from the great storms of the open desert.",
  },
  {
    id: "siaynoq",
    term: "Siaynoq",
    def: "In God Emperor of Dune, the ritual gathering at which Leto II speaks with his Fish Speakers.",
  },
  {
    id: "sietch",
    term: "sietch",
    aliases: ["sietches", "Sietch"],
    def: "A Fremen cave community, hidden in rock and sealed to keep in water. The word also means its people.",
  },
  {
    id: "sietch-tabr",
    term: "Sietch Tabr",
    def: "Stilgar's sietch, where Paul and Jessica are taken in after the fall of the Atreides.",
  },
  {
    id: "sorceresses",
    term: "Sorceresses",
    aliases: ["Sorceresses of Rossak"],
    tier: "later-books",
    def: "Telepathic women of the planet Rossak in the prequel novels, from whom the first Bene Gesserit come.",
  },
  {
    id: "spacing-guild",
    term: "Spacing Guild",
    aliases: ["Guild"],
    def: "Holds the monopoly on space travel and interstellar banking. Its Navigators need spice to steer ships through folded space.",
    more: "The Imperial calendar counts years from the start of its monopoly: A.G. means After Guild.",
  },
  {
    id: "spice-blow",
    term: "spice blow",
    aliases: ["pre-spice mass"],
    def: "A gas eruption from a buried pre-spice mass that throws fresh spice onto the desert surface.",
  },
  {
    id: "spice-essence",
    term: "spice essence",
    def: "Highly concentrated spice, strong enough to force a trance of prescience. Leto II gives it to Siona as a test.",
  },
  {
    id: "stillsuit",
    term: "stillsuit",
    aliases: ["stillsuits"],
    def: "The Fremen body suit that recycles sweat and urine into drinkable water.",
    film: "Kept in close detail in both films.",
  },
  {
    id: "stilltent",
    term: "stilltent",
    def: "A small sealed tent that traps the moisture of the people inside it.",
  },
  {
    id: "suk",
    term: "Suk",
    aliases: ["Suk conditioning"],
    def: "An Imperial school of doctors whose conditioning was thought to make them unable to harm a patient.",
  },
  {
    id: "suspensor",
    term: "suspensor",
    aliases: ["suspensors"],
    def: "A field that cancels gravity in a small space. The Baron Harkonnen uses suspensors to carry his great weight.",
  },
  {
    id: "swordmaster",
    term: "Swordmaster",
    aliases: ["Swordmasters"],
    def: "A master of the blade. Duncan Idaho is a Swordmaster of the Ginaz.",
  },
  {
    id: "synchronized-worlds",
    term: "Synchronized Worlds",
    aliases: ["Synchrony"],
    tier: "later-books",
    def: "The planets ruled by the machine mind Omnius in the later novels. Synchrony is their capital.",
  },
  {
    id: "thinking-machines",
    term: "thinking machines",
    aliases: ["thinking machine"],
    def: "Computers and robots made to imitate the human mind, banned since the Butlerian Jihad.",
  },
  {
    id: "thumper",
    term: "thumper",
    aliases: ["thumpers"],
    def: "A stake that beats a steady rhythm into the sand to call a sandworm. Fremen use it to summon a worm to ride.",
    film: "Kept. In Part One, Liet Kynes uses one to call a worm onto the Sardaukar.",
  },
  {
    id: "titans",
    term: "Titans",
    tier: "later-books",
    def: "Twenty human tyrants who conquer humanity with its own machines in the Legends of Dune novels, before their machine mind turns on them.",
  },
  {
    id: "truthsayer",
    term: "Truthsayer",
    def: "A Reverend Mother trained to tell truth from lies. Mohiam is the Emperor's Truthsayer.",
  },
  {
    id: "usul",
    term: "Usul",
    def: "Paul's private name in the sietch, meaning the base of the pillar. Only those closest to him use it.",
  },
  {
    id: "voice",
    term: "Voice",
    def: "The Bene Gesserit skill of controlling others with precisely pitched tones.",
    film: "Rendered as a deep, layered voice that seems to come from several throats.",
  },
  {
    id: "war-of-assassins",
    term: "War of Assassins",
    def: "A formal feud between Great Houses, limited by the Great Convention to approved weapons and methods.",
  },
  {
    id: "water-of-life",
    term: "Water of Life",
    def: "The poison a sandworm gives off as it drowns. A Reverend Mother changes it inside her body into a drug her tribe can share.",
    more: "No man has survived drinking it before Paul.",
    film: "Kept. In Part Two both Jessica and Paul drink it.",
  },
  {
    id: "weirding-way",
    term: "weirding way",
    aliases: ["weirding"],
    def: "The Bene Gesserit way of fighting, fast and precise. Jessica and Paul teach it to the Fremen.",
  },
  {
    id: "zensunni",
    term: "Zensunni",
    aliases: ["Zensunni Wanderers"],
    def: "A breakaway sect that wandered from world to world for generations. The Fremen descend from them.",
  },
];

/** All terms, sorted A–Z by term (case-insensitive, ignoring punctuation). */
export const glossary: Term[] = [...terms].sort((a, b) =>
  a.term.localeCompare(b.term, "en", { sensitivity: "base", ignorePunctuation: true }),
);

export const termById: Record<string, Term> = Object.fromEntries(glossary.map((t) => [t.id, t]));
