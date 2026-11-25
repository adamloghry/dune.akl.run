// Arrakis as it is in each era (320x80), in each look.
import type { APIRoute, GetStaticPaths } from 'astro';
import { eras } from '../../../../data/timeline';
import { arrakis } from '../../../../lib/scenes';
import { LOOKS, lookIds, type LookId } from '../../../../lib/style';

export const getStaticPaths: GetStaticPaths = () => lookIds.flatMap((look) => eras.map((e) => ({ params: { look, id: e.id } })));
export const GET: APIRoute = ({ params }) =>
  new Response(arrakis(params.id!, 320, 80, LOOKS[params.look as LookId]).toPNG(1, '#140c1a'), { headers: { 'Content-Type': 'image/png' } });
