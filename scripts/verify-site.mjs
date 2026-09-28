import assert from 'node:assert/strict';
import { readFile, readdir, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, relative } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const args = process.argv.slice(2);
assert(args.every(arg => arg === '--production'), 'Usage: node scripts/verify-site.mjs [--production]');
const production = args.includes('--production');
const dist = resolve(root, production ? 'dist-production' : 'dist');
const html = await readFile(resolve(dist, 'index.html'), 'utf8');
assert.match(html, /<html[^>]*lang="en-CA"/);
assert.match(html, production ? /name="robots"[^>]*content="index, follow"/ : /name="robots"[^>]*content="noindex, nofollow"/);
if (production) {
  assert.doesNotMatch(html, /noindex|127\.0\.0\.1|localhost/);
  assert.match(html, /rel="canonical"[^>]*href="https:\/\/logoslearninglabs\.com\/"/);
  assert.equal((await readFile(resolve(dist, 'CNAME'), 'utf8')).trim(), 'logoslearninglabs.com');
  assert((await stat(resolve(dist, '.nojekyll'))).isFile());
  assert.match(await readFile(resolve(dist, 'sitemap.xml'), 'utf8'), /<loc>https:\/\/logoslearninglabs\.com\/<\/loc>/);
}
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
for (const name of ['.git', '.local', 'docs', 'src', 'package.json', 'AGENTS.md', 'README.md', 'pnpm-lock.yaml']) {
  assert(!(await readdir(dist)).includes(name), `Source-only file leaked: ${name}`);
}
const robots = await readFile(resolve(dist, 'robots.txt'), 'utf8');
if (production) {
  assert.match(robots, /Allow:\s*\//);
  assert.match(robots, /Sitemap: https:\/\/logoslearninglabs\.com\/sitemap\.xml/);
  assert.doesNotMatch(robots, /Disallow:\s*\//);
} else {
  assert.match(robots, /Disallow:\s*\//);
  assert(!(await readdir(dist)).includes('CNAME'), 'Local builds must exclude the publishing domain configuration');
}
for (const screen of ['quiz', 'study', 'country']) assert((await stat(resolve(dist, `assets/apps/flag-${screen}.png`))).isFile());
console.log(`Verified ${production ? 'production' : 'local noindex'} English Astro output, ${checked} local resources, anchors, company details and Mint runtime-only distribution.`);
