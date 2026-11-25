import { defineConfig } from 'astro/config';
import csp from './integrations/csp.mjs';

// Fully static output: dist/ is plain HTML, CSS and font files.
export default defineConfig({
  site: process.env.SITE_URL ?? 'https://dune.akl.run',
  output: 'static',
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'never' },
  compressHTML: true,
  devToolbar: { enabled: false },
  integrations: [csp()],
});
