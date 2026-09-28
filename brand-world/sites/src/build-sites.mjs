// Builds the eight direction sites into brand-world/sites/.
// Run: node brand-world/sites/src/build-sites.mjs [01 02 ...]
import { writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { resetUsed } from './kit.mjs';

const OUT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITES = [
  ['01', 's01-reel.mjs', '01-the-reel.html'],
  ['02', 's02-host.mjs', '02-the-host.html'],
  ['03', 's03-roster.mjs', '03-the-roster.html'],
  ['04', 's04-outfitter.mjs', '04-the-outfitter.html'],
  ['05', 's05-readings.mjs', '05-six-readings.html'],
  ['06', 's06-store.mjs', '06-the-small-store.html'],
  ['07', 's07-pressed.mjs', '07-pressed-in.html'],
  ['08', 's08-kit.mjs', '08-everyday-kit.html'],
  ['index', 'index-page.mjs', 'index.html'],
];
const only = process.argv.slice(2);
for (const [n, mod, file] of SITES) {
  if (only.length && !only.includes(n)) continue;
  if (!existsSync(new URL('./' + mod, import.meta.url))) continue;
  resetUsed();
  const { build } = await import('./' + mod);
  const html = build();
  writeFileSync(join(OUT, file), html);
  console.log(file, (html.length / 1e6).toFixed(2) + ' MB');
}
