// Portraits, 32x32, one per person (and per family-tree figure who has no page), in each look.
import type { APIRoute, GetStaticPaths } from 'astro';
import { characters, factionById } from '../../../../data/cast';
import { familyNodes } from '../../../../data/family';
import { portrait } from '../../../../lib/art';
import { LOOKS, lookIds, type LookId } from '../../../../lib/style';

const people = [
  ...characters.map((c) => ({ id: c.id, look: c.look, bg: factionById[c.factions[0]?.id]?.colour ?? '#444444', mentat: c.factions.some((f) => f.id === 'mentats' && f.rel === 'member') })),
  ...familyNodes.filter((n) => !n.char && n.look).map((n) => ({ id: n.id, look: n.look!, bg: factionById[n.faction ?? 'atreides']?.colour ?? '#444444', mentat: false })),
];
export const getStaticPaths: GetStaticPaths = () =>
  lookIds.flatMap((look) => people.map((p) => ({ params: { look, id: p.id }, props: { p } })));

export const GET: APIRoute = ({ params, props }) => {
  const { p } = props as { p: (typeof people)[number] };
  const img = portrait(p.look, { bg: p.bg, mentat: p.mentat, style: LOOKS[params.look as LookId] });
  return new Response(img.toPNG(1, '#140c1a'), { headers: { 'Content-Type': 'image/png' } });
};
