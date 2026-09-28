// Cuts the supplied white-on-dark logo JPEGs into tight, transparent PNGs.
// Alpha comes from luminance, so the mark can be recoloured with CSS masks.
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets', 'img');
const jobs = [
  ['wordmark-white.jpg', 'logo-wordmark.png'],
  ['monogram-white.jpg', 'logo-monogram.png'],
];

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }).catch(() => chromium.launch());
const page = await browser.newPage();
for (const [src, out] of jobs) {
  const data = 'data:image/jpeg;base64,' + readFileSync(join(root, src)).toString('base64');
  const png = await page.evaluate(async (data) => {
    const img = new Image();
    img.src = data;
    await img.decode();
    const c = document.createElement('canvas');
    c.width = img.width; c.height = img.height;
    const x = c.getContext('2d');
    x.drawImage(img, 0, 0);
    const d = x.getImageData(0, 0, c.width, c.height);
    const lo = 0.16, hi = 0.82;
    let minX = c.width, minY = c.height, maxX = 0, maxY = 0;
    for (let i = 0; i < d.data.length; i += 4) {
      const l = (0.2126 * d.data[i] + 0.7152 * d.data[i + 1] + 0.0722 * d.data[i + 2]) / 255;
      const p0 = i / 4, ex = p0 % c.width, ey = (p0 / c.width) | 0;
      const edge = ex < 12 || ey < 12 || ex > c.width - 13 || ey > c.height - 13;
      const a = edge ? 0 : Math.max(0, Math.min(1, (l - lo) / (hi - lo)));
      d.data[i] = d.data[i + 1] = d.data[i + 2] = 255;
      d.data[i + 3] = Math.round(a * 255);
      if (a > 0.5) {
        const p = i / 4, px = p % c.width, py = (p / c.width) | 0;
        if (px < minX) minX = px; if (px > maxX) maxX = px;
        if (py < minY) minY = py; if (py > maxY) maxY = py;
      }
    }
    x.putImageData(d, 0, 0);
    const pad = 4;
    const w = maxX - minX + 1 + pad * 2, h = maxY - minY + 1 + pad * 2;
    const o = document.createElement('canvas');
    o.width = w; o.height = h;
    o.getContext('2d').drawImage(c, minX - pad, minY - pad, w, h, 0, 0, w, h);
    return { url: o.toDataURL('image/png'), w, h };
  }, data);
  writeFileSync(join(root, out), Buffer.from(png.url.split(',')[1], 'base64'));
  console.log(out, png.w + 'x' + png.h);
}
await browser.close();
