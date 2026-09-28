import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const args = process.argv.slice(2);
if (args.some(arg => arg !== '--production')) throw new Error('Usage: node scripts/build-site.mjs [--production]');
const production = args.includes('--production');
const require = createRequire(import.meta.url);
const packagePath = require.resolve('astro/package.json');
const binary = resolve(dirname(packagePath), require(packagePath).bin.astro);
// Local review builds remain private even when the parent shell has SITE_PUBLIC=1.
const child = spawn(process.execPath, [binary, 'build'], {
  stdio: 'inherit', env: { ...process.env, SITE_PUBLIC: production ? '1' : '0' },
});
child.on('error', error => { console.error(error); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
