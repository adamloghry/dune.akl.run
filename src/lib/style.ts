// The two art styles the reader can switch between in the top bar:
//   book — hi-bit: full shading ramps, rim light, dithered skies (the default)
//   film — cinematic: sand-and-ash palette, hard light, one hot accent, like Villeneuve's films
// Share cards (one static image per link) always use the book style.
import type { ArtStyle } from './art';
export const LOOKS = { book: 'hibit', film: 'cine' } as const satisfies Record<string, ArtStyle>;
export type LookId = keyof typeof LOOKS;
export const lookIds = Object.keys(LOOKS) as LookId[];
export const ART: ArtStyle = LOOKS.book;
