// The Atreides family tree, book canon only (Frank Herbert's six novels).
// Positions are hand-placed: x is the card's centre in px, row is the generation band.
// Anything a later novel only implies is drawn dotted, with its gap in years.

import type { Look } from './cast';

export interface FNode {
  id: string;
  name: string;
  sub?: string;
  char?: string; // id in cast.ts when the person has a page
  look?: Look; // for people without a page
  faction?: string; // portrait background for people without a page
  x: number;
  row: number;
  film?: string; // short note when the films differ
  eu?: string; // what the later books (Brian Herbert & Kevin J. Anderson) add about this person
}

export type UnionKind = 'married' | 'partner' | 'name-only';
export interface FUnion { id: string; a: string; b: string; kind: UnionKind }
export interface FEdge { from: string; to: string; dotted?: boolean; label?: string; labelOnBus?: boolean; eu?: boolean } // eu: only in the later books

export const familyNodes: FNode[] = [
  { id: 'paulus', name: 'Paulus Atreides', sub: 'the Old Duke, killed by a bull', x: 330, row: 0, faction: 'atreides',
    look: { skin: '#d9a271', hair: '#a29a94', eyes: 'dark', head: 'hair', cloth: '#2f5a3a' } },
  { id: 'helena', name: "Leto's mother", sub: 'unnamed by Frank Herbert', x: 480, row: 0, faction: 'atreides', eu: 'Helena Richese',
    look: { skin: '#f1c9a0', hair: '#5b3a22', eyes: 'dark', head: 'long', cloth: '#3a2a3f' } },
  { id: 'baron', name: 'Baron Harkonnen', sub: 'secret father', char: 'baron', x: 720, row: 0 },
  { id: 'mohiam', name: 'Mohiam', sub: 'Reverend Mother', char: 'mohiam', x: 900, row: 0, eu: "Jessica's mother" },

  { id: 'shaddam', name: 'Shaddam IV', sub: 'Padishah Emperor', char: 'shaddam', x: 110, row: 1 },
  { id: 'leto-i', name: 'Duke Leto', char: 'leto-i', x: 405, row: 1 },
  { id: 'jessica', name: 'Lady Jessica', sub: 'concubine, never wife', char: 'jessica', x: 600, row: 1,
    film: 'Part Two reveals her Harkonnen father, later than the book.' },

  { id: 'wensicia', name: 'Wensicia', sub: "Shaddam's daughter", x: 40, row: 2, faction: 'corrino',
    look: { skin: '#f1c9a0', hair: '#d8b25a', eyes: 'dark', head: 'long', cloth: '#6a4a1a' } },
  { id: 'irulan', name: 'Irulan', sub: 'wife in name only', char: 'irulan', x: 190, row: 2,
    film: 'Part Two ends with the marriage only demanded.' },
  { id: 'paul', name: 'Paul', sub: "Muad'Dib", char: 'paul', x: 360, row: 2 },
  { id: 'chani', name: 'Chani', sub: 'concubine, true partner', char: 'chani', x: 510, row: 2 },
  { id: 'alia', name: 'Alia', sub: 'born after the Duke dies', char: 'alia', x: 720, row: 2,
    film: 'Still unborn at the end of Part Two.' },
  { id: 'hayt', name: 'Duncan Idaho', sub: 'Hayt, the first ghola', char: 'duncan', x: 870, row: 2 },

  { id: 'farad', name: "Farad'n", sub: 'scribe to the God Emperor', char: 'farad', x: 110, row: 3 },
  { id: 'ghanima', name: 'Ghanima', char: 'ghanima', x: 260, row: 3 },
  { id: 'leto-ii', name: 'Leto II', sub: 'the God Emperor, no heirs', char: 'leto-ii', x: 430, row: 3 },
  { id: 'first-son', name: 'Leto', sub: 'first son, killed as a baby', x: 590, row: 3, faction: 'fremen',
    look: { skin: '#d9a271', hair: '#1d1512', eyes: 'dark', head: 'bald', cloth: '#5a3a22' },
    film: 'Cut: Paul and Chani have no child on screen.' },

  { id: 'moneo', name: 'Moneo', sub: "Leto's majordomo", char: 'moneo', x: 185, row: 4 },

  { id: 'siona', name: 'Siona', sub: 'hidden from prescience', char: 'siona', x: 185, row: 5 },
  { id: 'duncan-gold', name: 'Duncan Idaho', sub: "one of Leto's gholas", char: 'duncan', x: 335, row: 5 },

  { id: 'teg', name: 'Miles Teg', sub: 'Mentat-Bashar', char: 'teg', x: 600, row: 6 },
  { id: 'duncan-last', name: 'Duncan Idaho', sub: 'the last ghola', char: 'duncan', x: 790, row: 6 },
  { id: 'murbella', name: 'Murbella', char: 'murbella', x: 940, row: 6 },

  { id: 'odrade', name: 'Darwi Odrade', sub: 'Mother Superior', char: 'odrade', x: 600, row: 7 },
  { id: 'murbella-kids', name: 'Their children', sub: 'born on Chapterhouse', x: 865, row: 7, faction: 'bene-gesserit',
    look: { skin: '#f1c9a0', hair: '#1d1512', eyes: 'dark', head: 'hair', cloth: '#3a2a3f' } },
];

export const unions: FUnion[] = [
  { id: 'u-paulus', a: 'paulus', b: 'helena', kind: 'married' },
  { id: 'u-leto', a: 'leto-i', b: 'jessica', kind: 'partner' },
  { id: 'u-irulan', a: 'irulan', b: 'paul', kind: 'name-only' },
  { id: 'u-paul', a: 'paul', b: 'chani', kind: 'partner' },
  { id: 'u-alia', a: 'alia', b: 'hayt', kind: 'married' },
  { id: 'u-ghanima', a: 'farad', b: 'ghanima', kind: 'partner' },
  { id: 'u-leto-gh', a: 'ghanima', b: 'leto-ii', kind: 'name-only' },
  { id: 'u-siona', a: 'siona', b: 'duncan-gold', kind: 'partner' },
  { id: 'u-murbella', a: 'duncan-last', b: 'murbella', kind: 'partner' },
];

export const edges: FEdge[] = [
  { from: 'u-paulus', to: 'leto-i' },
  { from: 'baron', to: 'jessica' },
  { from: 'mohiam', to: 'jessica', eu: true },
  { from: 'shaddam', to: 'wensicia' },
  { from: 'shaddam', to: 'irulan' },
  { from: 'u-leto', to: 'paul' },
  { from: 'u-leto', to: 'alia' },
  { from: 'wensicia', to: 'farad' },
  { from: 'u-paul', to: 'ghanima' },
  { from: 'u-paul', to: 'leto-ii' },
  { from: 'u-paul', to: 'first-son' },
  { from: 'u-ghanima', to: 'moneo', dotted: true, label: '≈3,500 years of Leto\'s breeding' },
  { from: 'moneo', to: 'siona' },
  { from: 'u-siona', to: 'teg', dotted: true, label: "≈1,500 years of Siona's line", labelOnBus: true },
  { from: 'teg', to: 'odrade' },
  { from: 'u-murbella', to: 'murbella-kids' },
];

export const unionLabel: Record<UnionKind, string> = {
  married: 'married',
  partner: 'partners, unmarried',
  'name-only': 'married in name only',
};
