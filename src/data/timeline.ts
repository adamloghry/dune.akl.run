// The chronicle. Book canon = Frank Herbert's six novels and the Dune appendices/glossary only.
// Film notes cover Denis Villeneuve's Dune (2021) and Dune: Part Two (2024) only.
//
// Dating policy: the books give hard A.G. ("After Guild") dates only for the deep past and for
// the opening of Dune. Everything after that is counted the way the novels count it: as an
// interval from the previous book. Those dates carry `approx: true` and render with "≈".

export type Book =
  | 'APPENDIX'
  | 'DUNE'
  | 'MESSIAH'
  | 'CHILDREN'
  | 'GOD EMPEROR'
  | 'HERETICS'
  | 'CHAPTERHOUSE';

export type FilmKind = 'kept' | 'changed' | 'cut' | 'added';
export type Film = 'PART ONE' | 'PART TWO';

export interface FilmNote {
  film: Film;
  kind: FilmKind;
  text: string;
}

export interface Event {
  id: string;
  when: string; // display label
  approx?: boolean;
  title: string;
  book: Book;
  body: string;
  films?: FilmNote[];
}

export interface Era {
  id: string;
  num: string;
  name: string;
  span: string;
  sprite: string;
  books: Book[];
  // approximate absolute years, used only to draw the scale ruler
  from: number;
  to: number;
  summary: string;
  events: Event[];
}

export const eras: Era[] = [
  {
    id: 'old-empire',
    num: '01',
    name: 'The Old Empire and the Jihad',
    span: '≈1400 B.G. – 0 A.G.',
    sprite: 'robot',
    books: ['APPENDIX'],
    from: -1400,
    to: 0,
    summary:
      'The deep past exists in the books only as glossary entries, epigraphs and the appendices. It is a history of one decision: humanity outlaws machines that think, and spends ten thousand years building people to replace them.',
    events: [
      {
        id: 'zensunni',
        when: '1381 B.G.',
        title: 'The Zensunni schism',
        book: 'APPENDIX',
        body: 'A sect breaks from the teachings of Maometh, the "Third Muhammed". Its followers become the Zensunni Wanderers, a people forced from world to world (Poritrin, Bela Tegeuse, Harmonthep and others) for generations. They are the ancestors of the Fremen.',
      },
      {
        id: 'jihad',
        when: '201–108 B.G.',
        title: 'The Butlerian Jihad',
        book: 'APPENDIX',
        body: 'A crusade against computers, thinking machines and conscious robots. Its chief commandment passes into the Orange Catholic Bible: "Thou shalt not make a machine in the likeness of a human mind." Every institution in the later Imperium exists to do a job a computer used to do.',
      },
      {
        id: 'schools',
        when: 'After the Jihad',
        title: 'The great schools are founded',
        book: 'APPENDIX',
        body: 'With machines gone, minds are trained instead. The Bene Gesserit (mental and physical discipline, later a breeding program), the Mentats (human computers) and the Spacing Guild\'s Navigators (spice-driven prescience to fold space) all date from this period. The Commission of Ecumenical Translators assembles the Orange Catholic Bible to calm the religious wars.',
      },
      {
        id: 'corrin',
        when: '88 B.G.',
        title: 'The Battle of Corrin',
        book: 'APPENDIX',
        body: 'A space battle near Sigma Draconis settles the ascendancy of the ruling house from Salusa Secundus, which takes the name Corrino. In Dune, the Atreides–Harkonnen feud is traced to a Harkonnen banished for cowardice after this battle.',
      },
    ],
  },
  {
    id: 'imperium',
    num: '02',
    name: 'Ten Thousand Years of the Imperium',
    span: '0 – 10,190 A.G.',
    sprite: 'navigator',
    books: ['APPENDIX', 'DUNE'],
    from: 0,
    to: 10190,
    summary:
      'A political tripod holds for ten millennia: the Padishah Emperor and his Sardaukar, the Landsraad of Great Houses, and the Spacing Guild with its monopoly on travel. CHOAM, the trading company, keeps the books. Under it all runs one commodity, the spice melange, found on one planet.',
    events: [
      {
        id: 'guild',
        when: '0 A.G.',
        title: 'The Guild monopoly begins the calendar',
        book: 'APPENDIX',
        body: 'The Spacing Guild\'s monopoly on space travel, transport and interstellar banking is so total that the Imperial calendar counts from it. Every date in the books is "After Guild".',
      },
      {
        id: 'convention',
        when: 'Undated',
        title: 'The Great Convention',
        book: 'APPENDIX',
        body: 'A universal truce enforced by the balance of Guild, Houses and Emperor. Its hardest rule: no atomics against humans. Feuds are fought instead as formal "War of Assassins" under the Assassins\' Handbook. The social order is a rigid class system, the faufreluches.',
      },
      {
        id: 'breeding',
        when: '≈90 generations',
        approx: true,
        title: 'The Bene Gesserit breeding program',
        book: 'DUNE',
        body: 'The Sisterhood breeds bloodlines toward the Kwisatz Haderach, a male who can see where they cannot. The plan, near completion, needs an Atreides daughter to marry a Harkonnen heir. Lady Jessica disobeys and bears a son.',
      },
      {
        id: 'missionaria',
        when: 'Centuries before Dune',
        approx: true,
        title: 'The Missionaria Protectiva seeds Arrakis',
        book: 'DUNE',
        body: 'Bene Gesserit missionaries plant protective legends on primitive worlds, so any Sister in danger can exploit them. On Arrakis they plant the prophecy of the Lisan al-Gaib, the off-world messiah. This is the lever Jessica and Paul pull.',
      },
      {
        id: 'harkonnen-fief',
        when: '≈80 years before Dune',
        approx: true,
        title: 'Harkonnens hold Arrakis',
        book: 'DUNE',
        body: 'House Harkonnen runs Arrakis as a CHOAM quasi-fief and squeezes it for spice. The Fremen, assumed to be a few scattered tribes, are hunted for sport.',
      },
      {
        id: 'kynes',
        when: 'A generation before Dune',
        approx: true,
        title: 'Pardot Kynes and the ecological dream',
        book: 'APPENDIX',
        body: 'The Imperial Planetologist Pardot Kynes goes native among the Fremen and gives them a plan: turn Arrakis green with patience and hoarded water, over three to five hundred years. He dies in a cave-in at Plaster Basin. His son Liet-Kynes inherits both the post and the dream.',
      },
    ],
  },
  {
    id: 'dune',
    num: '03',
    name: 'Dune',
    span: '10,191 – ≈10,193 A.G.',
    sprite: 'worm',
    books: ['DUNE'],
    from: 10190,
    to: 10193,
    summary:
      'The novel spans roughly two years. The Emperor gives Arrakis to House Atreides as a trap; the Atreides fall; the duke\'s son becomes the Fremen messiah and takes the throne. Villeneuve splits the book across two films and moves its center of gravity.',
    events: [
      {
        id: 'gom-jabbar',
        when: '10,191 A.G.',
        title: 'The gom jabbar',
        book: 'DUNE',
        body: 'On Caladan, Reverend Mother Gaius Helen Mohiam tests fifteen-year-old Paul with the box of pain and the poisoned needle. He passes. Duke Leto accepts Arrakis knowing it is a trap: the Emperor fears the Atreides\' popularity and their skill at training a near-Sardaukar army.',
        films: [
          {
            film: 'PART ONE',
            kind: 'kept',
            text: 'Kept closely. Paul is fifteen in the book; the films play him older.',
          },
          {
            film: 'PART ONE',
            kind: 'added',
            text: 'Before Caladan, the film opens with Chani narrating Harkonnen oppression of the Fremen, framing the story from Arrakis.',
          },
        ],
      },
      {
        id: 'arrakeen',
        when: '10,191 A.G.',
        title: 'Arrival at Arrakeen',
        book: 'DUNE',
        body: 'The Atreides take over the Residency. The Fremen housekeeper, the Shadout Mapes, gives Jessica a crysknife; that first night a hunter-seeker nearly kills Paul. Later comes a formal banquet where the Duke and Jessica read the planet\'s power brokers. Duncan Idaho returns from the sietches with the measure of the Fremen, and Leto tells Paul what they must now win: "desert power".',
        films: [
          {
            film: 'PART ONE',
            kind: 'cut',
            text: 'The banquet is cut, along with most of the novel\'s court intrigue and the suspicion that Jessica is the traitor.',
          },
        ],
      },
      {
        id: 'betrayal',
        when: '10,191 A.G.',
        title: 'Yueh\'s betrayal and the fall of the Atreides',
        book: 'DUNE',
        body: 'Dr. Wellington Yueh, whose Suk conditioning was believed unbreakable, drops the shields. Harkonnens and disguised Sardaukar take Arrakeen. Duke Leto dies biting a poison-gas tooth meant for the Baron; it kills the Mentat Piter de Vries instead. Thufir Hawat is captured and pressed into Harkonnen service.',
        films: [
          {
            film: 'PART ONE',
            kind: 'kept',
            text: 'The tooth, Piter\'s death and the Baron\'s escape are kept. Hawat\'s capture is not followed.',
          },
        ],
      },
      {
        id: 'kynes-death',
        when: '10,191 A.G.',
        title: 'Into the desert, and the death of Kynes',
        book: 'DUNE',
        body: 'Dumped in the deep desert by Harkonnen soldiers, Paul and Jessica escape with the survival kit Yueh hid for them and are found by Duncan and taken to an Imperial ecological testing station run by Liet-Kynes. Sardaukar attack; Duncan dies holding them off while Paul and Jessica escape by ornithopter into a storm. Kynes, unmasked as a Fremen leader, is left in the open desert by the Harkonnens and dies when a pre-spice mass erupts beneath him, hallucinating his father\'s voice.',
        films: [
          {
            film: 'PART ONE',
            kind: 'kept',
            text: 'Duncan\'s last stand at the station is kept.',
          },
          {
            film: 'PART ONE',
            kind: 'changed',
            text: 'Liet Kynes is a woman (Dr. Liet Kynes), and her father\'s multi-generation plan is barely mentioned. She dies by choice: she summons a sandworm with a thumper and takes the Sardaukar down with her.',
          },
        ],
      },
      {
        id: 'stilltent',
        when: '10,191 A.G.',
        title: 'The awakening in the stilltent',
        book: 'DUNE',
        body: "Sheltering from the storm in a stilltent, steeped in spice, Paul's prescience opens fully. He sees the jihad that will be fought in his name, understands he is the Kwisatz Haderach, and realizes that Jessica is the Baron's daughter: he is part Harkonnen.",
        films: [
          {
            film: 'PART ONE',
            kind: 'kept',
            text: 'The stilltent vision of the jihad is kept.',
          },
          {
            film: 'PART TWO',
            kind: 'changed',
            text: "The discovery that Jessica is the Baron's daughter is moved to Part Two, after Paul drinks the Water of Life.",
          },
        ],
      },
      {
        id: 'jamis',
        when: '10,191 A.G.',
        title: 'Stilgar\'s troop and the duel with Jamis',
        book: 'DUNE',
        body: 'Stilgar\'s Fremen find Paul and Jessica. Jamis invokes the amtal and fights Paul to the death. Paul kills with a blade for the first time and weeps for Jamis ("he gives moisture to the dead"), takes the tribe name Usul and chooses Muad\'Dib, and inherits Jamis\'s household, including his widow Harah.',
        films: [
          {
            film: 'PART ONE',
            kind: 'kept',
            text: 'The duel is kept and ends Part One. Harah and the household are cut.',
          },
        ],
      },
      {
        id: 'reverend-mother',
        when: '10,191 A.G.',
        title: 'Jessica becomes a Fremen Reverend Mother',
        book: 'DUNE',
        body: 'Pregnant with the Duke\'s daughter, Jessica drinks the Water of Life to become the sietch\'s Reverend Mother. The unborn child is awakened in the womb with all her ancestral memories.',
        films: [
          {
            film: 'PART TWO',
            kind: 'changed',
            text: 'Jessica becomes a calculating evangelist who travels south to spread the prophecy among the fundamentalists. The book\'s Jessica uses the legend too, but less as its architect.',
          },
        ],
      },
      {
        id: 'alia-born',
        when: '10,191 A.G.',
        title: 'Alia is born',
        book: 'DUNE',
        body: 'Born months after the Duke\'s death, Alia is fully conscious from birth, an adult mind in an infant body, unsettling even to the Fremen.',
        films: [
          {
            film: 'PART TWO',
            kind: 'changed',
            text: 'The time-skip is cut. Events take months, so Alia is never born; she speaks to Jessica from the womb and appears to Paul in a vision as an adult.',
          },
        ],
      },
      {
        id: 'chani',
        when: '10,191 A.G.',
        title: 'Paul and Chani',
        book: 'DUNE',
        body: 'At Sietch Tabr, Paul takes Chani, Liet-Kynes\'s daughter and the girl from his visions, as his partner. In the book she believes in him to the end and accepts the dynastic marriage to Irulan; the novel closes on Jessica telling her that history will call them, the concubines, wives.',
        films: [
          {
            film: 'PART TWO',
            kind: 'changed',
            text: 'The biggest change in the films. Chani is a skeptic who rejects the prophecy, warns that it is a tool of control, and walks away from Paul at the end. She becomes the audience\'s guide to the critique the books make more slowly.',
          },
        ],
      },
      {
        id: 'sandrider',
        when: '≈10,192 A.G.',
        approx: true,
        title: 'Sandrider',
        book: 'DUNE',
        body: 'Paul learns the Fremen ways: water discipline, the weirding way taught in return, stillsuits and thumpers. He calls and rides his first maker with hooks, the rite that makes a Fremen a sandrider, and becomes their war leader against the Harkonnens.',
        films: [
          {
            film: 'PART TWO',
            kind: 'kept',
            text: 'The first worm ride is kept, played as one spectacular ride on an unusually large maker.',
          },
        ],
      },
      {
        id: 'first-son',
        when: '≈10,192 A.G.',
        approx: true,
        title: 'Leto, the first son',
        book: 'DUNE',
        body: 'Paul and Chani have a son, named Leto after the Duke. Near the end of the war, a Sardaukar raid on the sietches kills the child and carries off Alia.',
        films: [
          {
            film: 'PART TWO',
            kind: 'cut',
            text: 'Paul and Chani have no child, so the raid and the loss are gone.',
          },
        ],
      },
      {
        id: 'rabban',
        when: '≈10,192 A.G.',
        approx: true,
        title: 'Rabban, the Beast',
        book: 'DUNE',
        body: 'The Baron hands Arrakis to his brutal nephew Glossu Rabban with orders to squeeze it dry, so that Feyd-Rautha can later arrive as the people\'s savior. Muad\'Dib\'s raids turn the plan into a slow Harkonnen defeat.',
        films: [
          {
            film: 'PART TWO',
            kind: 'changed',
            text: 'The Feyd-as-savior plan is cut. Rabban is simply failing, and Gurney kills him during the final battle.',
          },
        ],
      },
      {
        id: 'water-of-life',
        when: '≈10,193 A.G.',
        approx: true,
        title: 'Paul drinks the Water of Life',
        book: 'DUNE',
        body: 'With his prescience clouded, Paul drinks the poison no man has survived and lies near death for three weeks. He wakes as the Kwisatz Haderach, seeing past, present and the narrow paths of the future, and sees the jihad he cannot stop.',
        films: [
          {
            film: 'PART TWO',
            kind: 'added',
            text: 'Paul goes south and proclaims himself the Lisan al-Gaib before a war council of fundamentalists. The council scene and the split between skeptical northerners and southern believers are inventions of the film.',
          },
          {
            film: 'PART TWO',
            kind: 'changed',
            text: 'The drinking is kept but framed as a choice to accept the messiah role in order to lead the south, not as a search for lost prescience. Paul\'s waking becomes a turn toward ruthlessness.',
          },
        ],
      },
      {
        id: 'hawat',
        when: '≈10,193 A.G.',
        approx: true,
        title: 'Thufir Hawat and Gurney Halleck',
        book: 'DUNE',
        body: 'Hawat, serving the Harkonnens, is a poisoned and divided man; at the end he dies refusing the Emperor\'s order to kill Paul. Gurney, reunited with Paul among smugglers, nearly kills Jessica because he believes she was the traitor.',
        films: [
          {
            film: 'PART TWO',
            kind: 'cut',
            text: 'Hawat does not appear after Part One. Gurney\'s attempt on Jessica is cut.',
          },
        ],
      },
      {
        id: 'feyd',
        when: '≈10,193 A.G.',
        approx: true,
        title: 'Feyd-Rautha and Margot Fenring',
        book: 'DUNE',
        body: 'The Baron\'s nephew and planned heir is a gladiatorial showman. Lady Margot Fenring, on Bene Gesserit orders, seduces him to preserve his genes. Count Hasimir Fenring, the Emperor\'s friend and a "failed" Kwisatz Haderach, is the one man Paul cannot see.',
        films: [
          {
            film: 'PART TWO',
            kind: 'kept',
            text: 'Feyd\'s arena birthday and Margot\'s seduction are kept, restaged under Giedi Prime\'s black sun.',
          },
          {
            film: 'PART TWO',
            kind: 'cut',
            text: 'Count Fenring is cut, and with him the book\'s point that Paul\'s prescience has blind spots.',
          },
        ],
      },
      {
        id: 'arrakeen-battle',
        when: '≈10,193 A.G.',
        approx: true,
        title: 'The Battle of Arrakeen',
        book: 'DUNE',
        body: 'Paul uses family atomics to blast open the Shield Wall, legal because they target rock, not people, and rides worms into the Emperor\'s camp in a storm. A Sardaukar raid on Sietch Tabr has killed Paul\'s infant son and taken Alia captive; brought before the Emperor, the toddler kills Baron Harkonnen with the gom jabbar. Paul kills Feyd in a duel.',
        films: [
          {
            film: 'PART TWO',
            kind: 'kept',
            text: 'The atomics, the worm charge and the duel with Feyd are kept.',
          },
          {
            film: 'PART TWO',
            kind: 'changed',
            text: 'Paul kills the Baron himself, because Alia is unborn.',
          },
        ],
      },
      {
        id: 'ascension',
        when: '≈10,193 A.G.',
        approx: true,
        title: 'Paul takes the throne',
        book: 'DUNE',
        body: 'With the power to destroy the spice, and so the Guild, Paul forces Shaddam IV to abdicate to Salusa Secundus and takes Princess Irulan as wife in name. Irulan\'s later histories supply the novel\'s epigraphs. The jihad begins, against Paul\'s will.',
        films: [
          {
            film: 'PART TWO',
            kind: 'changed',
            text: 'Compressed into one scene: the Great Houses refuse to accept Paul and he immediately launches the holy war. Irulan appears on screen and keeps a journal, but no longer frames the story as the book\'s narrator-historian.',
          },
        ],
      },
    ],
  },
  {
    id: 'messiah',
    num: '04',
    name: 'The Jihad and Dune Messiah',
    span: 'Dune + 12 years',
    sprite: 'eye',
    books: ['MESSIAH'],
    from: 10193,
    to: 10205,
    summary:
      'Twelve years of holy war in Muad\'Dib\'s name. Paul is the most powerful man in history and cannot stop what he started. Herbert wrote Messiah as the corrective: the hero is the disaster.',
    events: [
      {
        id: 'jihad-cost',
        when: 'Dune + 0–12 yrs',
        approx: true,
        title: 'Muad\'Dib\'s Jihad',
        book: 'MESSIAH',
        body: 'Fremen legions conquer the Imperium. Paul tallies it himself: sixty-one billion dead, ninety planets sterilized, five hundred demoralized, the followers of forty religions wiped out. He compares himself unfavorably to Hitler.',
      },
      {
        id: 'conspiracy',
        when: 'Dune + 12 yrs',
        approx: true,
        title: 'The conspiracy',
        book: 'MESSIAH',
        body: 'The Bene Gesserit (Mohiam), the Guild (the Navigator Edric, whose presence clouds prescience), the Tleilaxu (the Face Dancer Scytale) and Irulan plot to bring Paul down and steal his bloodline. The Tleilaxu give him Hayt, a ghola grown from Duncan Idaho\'s body.',
      },
      {
        id: 'chani-death',
        when: 'Dune + 12 yrs',
        approx: true,
        title: 'Blindness, twins and the walk into the desert',
        book: 'MESSIAH',
        body: 'A stone burner blinds Paul, but prescience lets him "see". Irulan has been secretly feeding Chani contraceptives; the delay damages her and she dies giving birth to twins, Leto II and Ghanima. Chani\'s death triggers Hayt\'s hidden order to kill Paul; the conflict breaks his conditioning and he is Duncan again, and Alia\'s love. Scytale offers to restore Chani as a ghola in exchange for Paul\'s throne; Paul kills him. Paul walks blind into the desert, as Fremen custom demands, leaving Alia as regent.',
      },
    ],
  },
  {
    id: 'children',
    num: '05',
    name: 'Children of Dune',
    span: 'Messiah + 9 years',
    sprite: 'sandtrout',
    books: ['CHILDREN'],
    from: 10205,
    to: 10214,
    summary:
      'Alia\'s regency curdles. The twins, pre-born like their aunt, carry every ancestor inside them. Arrakis is turning green and the worms are dying with the desert. Leto II sees the only future in which humanity survives and decides to pay for it himself.',
    events: [
      {
        id: 'abomination',
        when: 'Messiah + 9 yrs',
        approx: true,
        title: 'Alia, Abomination',
        book: 'CHILDREN',
        body: 'Unable to hold back the crowd of ancestral voices, Alia is possessed by the memory of her grandfather, Baron Vladimir Harkonnen. The Bene Gesserit name for this is Abomination. Jessica returns to Arrakis to judge her grandchildren.',
      },
      {
        id: 'farad',
        when: 'Messiah + 9 yrs',
        approx: true,
        title: 'The Corrino plot and the Preacher',
        book: 'CHILDREN',
        body: 'Duncan, now Alia\'s husband, takes Jessica to Salusa Secundus, where she trains Farad\'n in the Bene Gesserit ways. Shaddam\'s daughter Wensicia sends trained Laza tigers to kill the twins so her son Farad\'n can take the throne. Leto lets himself be thought dead. A blind Preacher from the desert denounces the religion of Muad\'Dib in Arrakeen.',
      },
      {
        id: 'jacurutu',
        when: 'Messiah + 9 yrs',
        approx: true,
        title: 'Jacurutu',
        book: 'CHILDREN',
        body: 'Leto goes looking for the lost sietch of Jacurutu, where Gurney, on Jessica\'s orders, captures him and forces a massive spice overdose on him, a test for Abomination. Leto survives and, in the trance, sees the Golden Path in full.',
      },
      {
        id: 'duncan-stilgar',
        when: 'Messiah + 9 yrs',
        approx: true,
        title: 'Duncan forces Stilgar\'s hand',
        book: 'CHILDREN',
        body: 'Duncan, knowing what Alia has become, provokes Stilgar into killing him, a death that breaks Stilgar from the regent and turns the old naib against her.',
      },
      {
        id: 'sandtrout',
        when: 'Messiah + 9 yrs',
        approx: true,
        title: 'Leto II takes the sandtrout skin',
        book: 'CHILDREN',
        body: 'In the desert, Leto lets sandtrout, the larval stage of the sandworm, cover his body as a living membrane. He becomes nearly invulnerable and begins a transformation that will take millennia. He confronts the Preacher, who is Paul; Paul is then killed by a priest. Alia, recognizing what she has become, throws herself from a window.',
      },
      {
        id: 'golden-path',
        when: 'Messiah + 9 yrs',
        approx: true,
        title: 'The Golden Path',
        book: 'CHILDREN',
        body: 'Leto takes the throne and walks the future Paul refused. He announces a marriage to Ghanima in form only; Farad\'n will father her children and becomes the royal scribe. The Golden Path demands a long tyranny so total that humanity will learn, in its bones, never to depend on one leader or one planet again.',
      },
    ],
  },
  {
    id: 'god-emperor',
    num: '06',
    name: 'The God Emperor',
    span: '≈3,500 years',
    sprite: 'golden',
    books: ['GOD EMPEROR'],
    from: 10214,
    to: 13714,
    summary:
      'The longest era in the arc, told almost entirely from its last months. Leto II, now mostly sandworm, rules a galaxy kept in deliberate stasis: no wars, no space travel to speak of, spice under his sole control.',
    events: [
      {
        id: 'peace',
        when: '≈3,500 yrs of reign',
        approx: true,
        title: 'Leto\'s Peace',
        book: 'GOD EMPEROR',
        body: 'Arrakis is green except for the Sareer, a strip of desert Leto preserves; the only sandworm left is Leto. His army is the Fish Speakers, all women. The Tleilaxu supply him with Duncan Idaho gholas, one after another; many die by his hand or in rebellion.',
      },
      {
        id: 'siona',
        when: 'Final months of the reign',
        approx: true,
        title: 'Siona and Hwi Noree',
        book: 'GOD EMPEROR',
        body: 'Siona, a rebellious Atreides descendant and daughter of his majordomo Moneo, steals Leto\'s journals. She is the product of his own breeding program: invisible to prescience. Ix sends Hwi Noree, engineered to be the woman he could love, and Leto agrees to marry her.',
      },
      {
        id: 'siona-test',
        when: 'Final months of the reign',
        approx: true,
        title: 'The test in the Sareer',
        book: 'GOD EMPEROR',
        body: 'Leto takes Siona into the Sareer, the last desert, and gives her spice essence. She sees what he has always seen: without the Golden Path, humanity dies. She remains his enemy, now knowing why he must die.',
      },
      {
        id: 'leto-death',
        when: 'End of the reign',
        approx: true,
        title: 'The death of the God Emperor',
        book: 'GOD EMPEROR',
        body: 'On the way to the wedding, Siona and the current Duncan bring down the bridge over the Idaho River. Leto falls into the water, deadly to the sandtrout in his body. Dying, he releases them; each carries a "pearl" of his awareness, and the worms and the spice will return. Humanity is free, and about to scatter.',
      },
    ],
  },
  {
    id: 'scattering',
    num: '07',
    name: 'The Famine Times and the Scattering',
    span: '≈1,500 years',
    sprite: 'ship',
    books: ['HERETICS'],
    from: 13714,
    to: 15214,
    summary:
      'Recalled only in retrospect in the last two novels. The tight Imperium Leto built breaks in famine, and trillions flee into the unknown universe on no-ships that prescience cannot track. That was the point of the Golden Path.',
    events: [
      {
        id: 'famine',
        when: 'After Leto\'s death',
        approx: true,
        title: 'Famine and flight',
        book: 'HERETICS',
        body: 'Leto\'s death brings the Famine Times. Ixian no-ships, invisible to prescience, make the Scattering possible. Humanity spreads beyond any one power\'s reach, which means no single disaster can end it again.',
      },
      {
        id: 'honored-matres',
        when: 'During the Scattering',
        approx: true,
        title: 'The Honored Matres arise',
        book: 'HERETICS',
        body: 'Somewhere out in the Scattering, a violent matriarchy forms that controls men through sexual imprinting. The books hint at roots in Fish Speakers and Bene Gesserit who left. They are fleeing something even worse.',
      },
    ],
  },
  {
    id: 'heretics',
    num: '08',
    name: 'Heretics and Chapterhouse',
    span: '≈1,500 years after Leto',
    sprite: 'chapter',
    books: ['HERETICS', 'CHAPTERHOUSE'],
    from: 15214,
    to: 15230,
    summary:
      'The Bene Gesserit, the last old institution standing, are the protagonists now. Arrakis is a desert again, called Rakis, and the Honored Matres come home from the Scattering. Herbert died before writing the book that would have resolved it.',
    events: [
      {
        id: 'sheeana',
        when: '≈1,500 yrs after Leto',
        approx: true,
        title: 'Sheeana of Rakis',
        book: 'HERETICS',
        body: 'On Rakis, a girl named Sheeana survives a worm attack and can command the worms, which some see as Leto\'s pearls. The Sisterhood takes an interest. Mother Superior Taraza sends her protégée Darwi Odrade to Rakis.',
      },
      {
        id: 'teg',
        when: '≈1,500 yrs after Leto',
        approx: true,
        title: 'Miles Teg and the Duncan ghola',
        book: 'HERETICS',
        body: 'The old Mentat-Bashar Miles Teg guards a new Duncan Idaho ghola on Gammu, once Giedi Prime. In a Harkonnen no-globe on Gammu, Teg restores the ghola\'s original memories. Under torture he discovers he can move at blinding speed. The young Honored Matre Murbella seizes Duncan, and his Tleilaxu-implanted conditioning lets him imprint her instead.',
      },
      {
        id: 'rakis-destroyed',
        when: 'End of Heretics',
        approx: true,
        title: 'The destruction of Rakis',
        book: 'HERETICS',
        body: 'The Honored Matres burn Rakis down to the bedrock. Taraza and Teg die there. Odrade, now Mother Superior, escapes with Sheeana and one worm. Dune, the planet, is gone.',
      },
      {
        id: 'chapterhouse',
        when: 'After Heretics',
        approx: true,
        title: 'Chapterhouse becomes a desert',
        book: 'CHAPTERHOUSE',
        body: 'The rescued worm dies and seeds sandtrout on the Bene Gesserit homeworld, which begins to dry into a new Dune. Honored Matres hunt down Sisterhood planets one by one. Odrade revives Teg as a ghola and trains Murbella as a Bene Gesserit.',
      },
      {
        id: 'junction',
        when: 'End of Chapterhouse',
        approx: true,
        title: 'Junction, and the escape',
        book: 'CHAPTERHOUSE',
        body: 'Odrade dies in a gambit at the Honored Matre stronghold of Junction. Murbella, both Bene Gesserit and Honored Matre, ends up commanding the merged orders. Duncan, Sheeana, the young Teg and the Tleilaxu Scytale escape in a no-ship into the unknown.',
      },
      {
        id: 'daniel-marty',
        when: 'The last pages',
        approx: true,
        title: 'Daniel and Marty',
        book: 'CHAPTERHOUSE',
        body: 'An old couple, who appear to Duncan in visions as gardeners, watch the no-ship go and speak of it as something they are searching for. What they are is left open, and readers have argued about it ever since. Frank Herbert died in 1986; his arc ends here, on the question.',
      },
    ],
  },
];

export const bookInfo: Record<Book, { title: string; year: string; note: string }> = {
  APPENDIX: { title: 'Dune: appendices & glossary', year: '1965', note: 'The source for the deep past and its dates.' },
  DUNE: { title: 'Dune', year: '1965', note: 'Adapted in Part One (2021) and Part Two (2024).' },
  MESSIAH: { title: 'Dune Messiah', year: '1969', note: 'Not covered by the two released films. Villeneuve\'s Dune: Part Three adapts it.' },
  CHILDREN: { title: 'Children of Dune', year: '1976', note: 'Not adapted by Villeneuve.' },
  'GOD EMPEROR': { title: 'God Emperor of Dune', year: '1981', note: 'Not adapted.' },
  HERETICS: { title: 'Heretics of Dune', year: '1984', note: 'Not adapted.' },
  CHAPTERHOUSE: { title: 'Chapterhouse: Dune', year: '1985', note: 'Not adapted. Herbert\'s last Dune novel.' },
};

export const kindLabel: Record<FilmKind, string> = {
  kept: 'KEPT',
  changed: 'CHANGED',
  cut: 'CUT',
  added: 'ADDED',
};
