// Build-time share images, one per event: /og/<event id>.png (1200x630).
import type { APIRoute, GetStaticPaths } from "astro";
import { eventPages, type EventPage } from "../../data/pages";
import { shareCard, CARD_SCALE } from "../../lib/card";

export const getStaticPaths: GetStaticPaths = () =>
  eventPages.map((p) => ({ params: { id: p.id }, props: { p } }));

export const GET: APIRoute = ({ props }) => {
  const p = (props as { p: EventPage }).p;
  const img = shareCard({
    title: p.title,
    when: p.when,
    book: p.book,
    era: p.era.id,
    eraName: p.era.name,
    sprite: p.era.sprite,
    level: p.level,
    later: p.later,
  });
  return new Response(img.toPNG(CARD_SCALE, "#140c1a"), { headers: { "Content-Type": "image/png" } });
};
