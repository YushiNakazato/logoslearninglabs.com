import { defineConfig } from 'astro/config';
import { readdir, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { relative, isAbsolute } from 'node:path';

// Keep the installed package immutable; build output only needs its runtime.
const mintRuntime = new Set(['theme.css', 'components.css', 'mint-ui.js']);
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
    },
  },
};

export default defineConfig({
  output: 'static',
  site: 'https://logoslearninglabs.com/',
  trailingSlash: 'always',
  outDir: './dist',
  devToolbar: { enabled: false },
  integrations: [publishMintRuntimeOnly],
});
