import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { join } from "node:path";

/**
 * URL for a file under `public/`, with a cache-busting `?v=` query (the first 8 hex digits of the
 * file's SHA-256, computed at build time). Same helper as akl.run: fixed-URL files skip Astro's
 * hashed filenames, so without the query a returning visitor could get new HTML with a stale script.
 *
 * @param path - path under `public/`, without a leading slash
 */
export function asset(path: string): string {
  const hash = createHash("sha256")
    .update(readFileSync(join(process.cwd(), "public", path)))
    .digest("hex")
    .slice(0, 8);
  return `/${path}?v=${hash}`;
}
