// After the build, hash every inline <script> that runs (not JSON data blocks) and write the
// hashes into dist/_headers, so the Content-Security-Policy allows exactly those scripts and nothing else.
import { createHash } from 'node:crypto';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

async function* htmlFiles(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

export default function csp() {
  return {
    name: 'csp-hashes',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const out = fileURLToPath(dir);
        const hashes = new Set();
        for await (const f of htmlFiles(out)) {
          const html = await readFile(f, 'utf8');
          for (const m of html.matchAll(/<script(\s[^>]*)?>([\s\S]*?)<\/script>/g)) {
            const attrs = m[1] ?? '';
            if (/\bsrc=/.test(attrs) || /type="application\/(ld\+)?json"/.test(attrs)) continue;
            hashes.add(`'sha256-${createHash('sha256').update(m[2], 'utf8').digest('base64')}'`);
          }
        }
        const headersPath = join(out, '_headers');
        const tpl = await readFile(headersPath, 'utf8');
        if (!tpl.includes('__SCRIPT_HASHES__')) throw new Error('_headers has no __SCRIPT_HASHES__ placeholder');
        await writeFile(headersPath, tpl.replace('__SCRIPT_HASHES__', [...hashes].sort().join(' ')));
        logger.info(`Content-Security-Policy allows ${hashes.size} inline scripts by hash`);
      },
    },
  };
}
