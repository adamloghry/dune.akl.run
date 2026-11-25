// The home page painting: Arrakeen at dusk (480x120). The worm and thopter are animated sprites
// on the page, so they are left out here.
import type { APIRoute, GetStaticPaths } from "astro";
import { arrakeen } from "../../../lib/art";
import { LOOKS, lookIds, type LookId } from "../../../lib/style";

export const getStaticPaths: GetStaticPaths = () => lookIds.map((look) => ({ params: { look } }));
export const GET: APIRoute = ({ params }) =>
  new Response(
    arrakeen({
      w: 480,
      h: 120,
      time: "dusk",
      worm: false,
      thopter: false,
      seed: 10191,
      style: LOOKS[params.look as LookId],
    }).toPNG(1, "#140c1a"),
    { headers: { "Content-Type": "image/png" } },
  );
