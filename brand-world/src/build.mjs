// Builds every brand-world page into brand-world/. Run: node brand-world/src/build.mjs
import { writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './shared.mjs';
import { WORLDS } from './worlds.mjs';

const out = [];
const add = async (mod, fn, file) => {
  if (!existsSync(new URL(mod, import.meta.url))) return;
  const m = await import(mod);
  out.push([file, m[fn]()]);
};
await add('./the-entrance.mjs', 'renderEntrance', WORLDS.a.file);
await add('./start-here.mjs', 'renderStart', 'START-HERE.html');
for (const [file, html] of out) {
  writeFileSync(join(ROOT, file), html);
  console.log(file, (html.length / 1024).toFixed(0) + ' KB');
}
