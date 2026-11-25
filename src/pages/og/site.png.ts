// The share image for pages that are not about one event.
import type { APIRoute } from 'astro';
import { siteCard, CARD_SCALE } from '../../lib/card';
export const GET: APIRoute = () => new Response(siteCard().toPNG(CARD_SCALE, '#140c1a'), { headers: { 'Content-Type': 'image/png' } });
