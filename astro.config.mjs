import { defineConfig } from 'astro/config';
import { copyFile, readdir, rm, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { relative, isAbsolute } from 'node:path';

// Keep the installed package immutable; build output only needs its runtime.
const mintRuntime = new Set(['theme.css', 'components.css', 'mint-ui.js']);
const production = process.env.SITE_PUBLIC === '1';
const publishMintRuntimeOnly = {
  name: 'publish-mint-runtime-only',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const output = fileURLToPath(dir);
      const vendor = new URL('vendor/mint-ui/', dir);
      for (const version of await readdir(vendor)) {
        const versionDirectory = new URL(`${version}/`, vendor);
        for (const entry of await readdir(versionDirectory)) {
          if (mintRuntime.has(entry)) continue;
          const target = new URL(entry, versionDirectory);
          const relativeTarget = relative(output, fileURLToPath(target));
          if (relativeTarget.startsWith('..') || isAbsolute(relativeTarget)) {
            throw new Error('Refusing cleanup outside Astro build output');
          }
          await rm(target, { recursive: true, force: true });
        }
      }
      if (production) {
        await copyFile(new URL('./CNAME', import.meta.url), new URL('CNAME', dir));
        await copyFile(new URL('./.nojekyll', import.meta.url), new URL('.nojekyll', dir));
        await writeFile(new URL('robots.txt', dir), 'User-agent: *\nAllow: /\nSitemap: https://logoslearninglabs.com/sitemap.xml\n');
        await writeFile(new URL('sitemap.xml', dir), '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>https://logoslearninglabs.com/</loc></url></urlset>\n');
      }
    },
  },
};

export default defineConfig({
  output: 'static',
  site: 'https://logoslearninglabs.com/',
  trailingSlash: 'always',
  outDir: production ? './dist-production' : './dist',
  devToolbar: { enabled: false },
  integrations: [publishMintRuntimeOnly],
});
