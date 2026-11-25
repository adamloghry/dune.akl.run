import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Fully static output: dist/ is plain HTML, CSS, fonts and images.
// inlineStylesheets: "never" and assetsInlineLimit: 0 (as on akl.run): the CSP has script-src 'self'
// and font-src 'self', so Astro must always emit scripts and fonts as files, never inline them.
export default defineConfig({
  site: process.env.SITE_URL ?? "https://dune.akl.run",
  output: "static",
  trailingSlash: "always",
  build: { format: "directory", inlineStylesheets: "never" },
  compressHTML: true,
  devToolbar: { enabled: false },
  integrations: [sitemap()],
  vite: { build: { assetsInlineLimit: 0, target: "es2020" } },
});
