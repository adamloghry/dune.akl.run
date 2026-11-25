// public/ files that Cloudflare reads verbatim: keep their promises from silently changing.
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(new URL(`../../public/${p}`, import.meta.url), "utf8");

describe("_headers", () => {
  const h = read("_headers");
  const lines = h.split("\n");
  it("stays within Cloudflare's limits (100 rules, 2,000 characters a line)", () => {
    expect(lines.filter((l) => /^\S/.test(l)).length).toBeLessThanOrEqual(100);
    for (const l of lines) expect(l.length).toBeLessThanOrEqual(2000);
  });
  it("sends HSTS and a CSP with no inline scripts", () => {
    expect(h).toMatch(/Strict-Transport-Security: max-age=\d{8,}/);
    const csp = h.match(/Content-Security-Policy: (.*)/)?.[1] ?? "";
    expect(csp).toContain("script-src 'self';");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
  });
});

describe("robots.txt", () => {
  const r = read("robots.txt");
  it("lets search engines in, asks AI-training crawlers to stay out, and names the sitemap", () => {
    expect(r).toMatch(/User-agent: \*\nAllow: \//);
    for (const bot of ["GPTBot", "ClaudeBot", "CCBot", "Google-Extended"])
      expect(r).toContain(`User-agent: ${bot}`);
    expect(r).toContain("Sitemap: https://dune.akl.run/sitemap-index.xml");
  });
});
