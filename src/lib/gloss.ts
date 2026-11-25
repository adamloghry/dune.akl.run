// Hover definitions for glossary terms in running text.
//
// MARKUP (one plain link per glossed term, no nested interactive elements):
//
//   <a class="gl" href="BASE/glossary/#gl-ID" data-tip="ESCAPED DEFINITION">matched text</a>
//
// Why this pattern:
// - It is an ordinary link. Keyboard users tab to it, screen-reader users hear the term as the
//   link name and can follow it to the full glossary entry. Touch users tap it and land on the
//   entry. Nothing depends on JavaScript.
// - The tooltip is CSS only (src/styles/gloss.css): `.gl::after { content: attr(data-tip) / "" }`,
//   shown on :hover (pointer devices) and :focus-visible (keyboard). The `/ ""` alt text keeps the
//   generated text out of the accessibility tree, so the link name stays the term and the
//   definition is not read twice; browsers without that syntax fall back to the plain declaration.
// - No `title` (it would duplicate the tooltip and is not keyboard accessible), no aria-label
//   (the visible text is the right name), no role="tooltip" on generated content.
//
// MATCHING: case-sensitive, whole words only. A "word character" is any Unicode letter or digit,
// so a match never starts or ends inside a longer word ("Ix" does not match "Ixian"; "spice" does
// match in "pre-spice" or "Fremen's"). At each position the longest term or alias wins, so
// "Sietch Tabr" beats "Sietch" and "Muad'Dib's Jihad" beats "Muad'Dib". Text covered by a match
// is consumed even when the term was already glossed, so a shorter term is never linked inside a
// longer one.
//
// FIRST OCCURRENCE: pass one `seen` Set per card or page. Each term is wrapped only the first time
// it appears across all calls that share the set; its id is then added to the set.

import { glossary, termById, type Term } from '../data/glossary';
import { termLevel, levelShort } from '../data/spoilers';

type Pattern = { text: string; id: string };

const isWordChar = (ch: string | undefined) => ch !== undefined && /[\p{L}\p{N}]/u.test(ch);

// Patterns grouped by first character, longest first, so the scan is cheap.
const byFirst = new Map<string, Pattern[]>();
for (const t of glossary) {
  for (const text of [t.term, ...(t.aliases ?? [])]) {
    const list = byFirst.get(text[0]) ?? [];
    list.push({ text, id: t.id });
    byFirst.set(text[0], list);
  }
}
for (const list of byFirst.values()) list.sort((a, b) => b.text.length - a.text.length);

/** HTML-escape text for element content and double- or single-quoted attributes. */
export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

type Hit = { start: number; end: number; id: string };

/** All term matches in reading order, longest-first at each position, non-overlapping. */
function scan(text: string): Hit[] {
  const hits: Hit[] = [];
  let i = 0;
  while (i < text.length) {
    const list = byFirst.get(text[i]);
    if (list && !isWordChar(text[i - 1])) {
      const p = list.find((p) => text.startsWith(p.text, i) && !isWordChar(text[i + p.text.length]));
      if (p) {
        hits.push({ start: i, end: i + p.text.length, id: p.id });
        i += p.text.length;
        continue;
      }
    }
    i++;
  }
  return hits;
}

/**
 * HTML-escape `text` and wrap the first occurrence of each glossary term (per `seen`) in a
 * glossary link with a CSS tooltip. Returns an HTML string for `set:html`.
 *
 * @param text plain text (not HTML)
 * @param seen term ids already glossed in this card or page; updated in place
 * @param base site base path without trailing slash, e.g. `import.meta.env.BASE_URL.replace(/\/$/, '')`
 */
export function glossHtml(text: string, seen: Set<string> = new Set(), base = ''): string {
  let out = '';
  let at = 0;
  for (const h of scan(text)) {
    out += escapeHtml(text.slice(at, h.start));
    const word = escapeHtml(text.slice(h.start, h.end));
    if (seen.has(h.id)) {
      out += word;
    } else {
      seen.add(h.id);
      const t = termById[h.id];
      out += `<a class="gl" href="${escapeHtml(`${base}/glossary/#gl-${t.id}`)}" data-tip="${escapeHtml(t.def)}"${termLevel[t.id] ? ` data-tl="${termLevel[t.id]}" data-tll="${levelShort[termLevel[t.id]]}"` : ''}>${word}</a>`;
    }
    at = h.end;
  }
  return out + escapeHtml(text.slice(at));
}

/** Distinct term ids found in `text`, in order of first appearance. */
export function termsIn(text: string): string[] {
  return [...new Set(scan(text).map((h) => h.id))];
}

/** Number of distinct glossary terms in `text` (what glossHtml would wrap with a fresh set). */
export function glossCount(text: string): number {
  return termsIn(text).length;
}

export { glossary, termById, type Term };
