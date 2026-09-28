import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const dist = resolve(root, 'dist');
const html = await readFile(resolve(dist, 'index.html'), 'utf8');
assert.match(html, /<html[^>]*lang="en-CA"/);
assert.match(html, /name="robots"[^>]*content="noindex, nofollow"/);
assert.equal((html.match(/<h1\b/g) ?? []).length, 1, 'Exactly one primary heading');
assert.match(html, /Logos Learning Labs Inc\./);
assert.match(html, /8171 Ackroyd Road/);
assert.match(html, /Suite 1014/);
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'No duplicate element IDs');
let checked = 0;
for (const [, raw] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
  const url = raw.replaceAll('&amp;', '&');
  if (/^(https?:|mailto:|data:)/.test(url)) continue;
  if (url.startsWith('#')) { assert(ids.includes(url.slice(1)), `Missing anchor ${url}`); continue; }
  const path = resolve(dist, url.replace(/^\//, '').split('?')[0]);
  assert(!relative(dist, path).startsWith('..'), `Path outside output: ${url}`);
  assert((await stat(path)).isFile(), `Missing resource ${url}`);
  checked++;
}
assert.deepEqual((await readdir(resolve(dist, 'vendor/mint-ui/0.6.1'))).sort(), ['components.css', 'mint-ui.js', 'theme.css']);
for (const name of ['CNAME', '.git', '.local', 'docs', 'src', 'package.json']) {
  assert(!(await readdir(dist)).includes(name), `Source-only file leaked: ${name}`);
}
assert.match(await readFile(resolve(dist, 'robots.txt'), 'utf8'), /Disallow:\s*\//);
for (const screen of ['quiz', 'study', 'country']) assert((await stat(resolve(dist, `assets/apps/flag-${screen}.png`))).isFile());
console.log(`Verified English Astro output, ${checked} local resources, anchors, company details, noindex and Mint runtime-only distribution.`);
