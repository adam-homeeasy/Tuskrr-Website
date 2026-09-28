// Proof checks for the brand-world pages. Run: node brand-world/src/proof.mjs
// contrast (sampled from real pixels under each text box), overflow at nine
// widths, tap targets, motion override states, reveal visibility and banned
// characters. Exits non-zero on failure.
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { ROOT } from './shared.mjs';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const FILES = process.env.PROOF_FILES ? process.env.PROOF_FILES.split(',') : ['START-HERE.html', 'the-entrance.html'];
const WIDTHS = [320, 375, 414, 600, 768, 1024, 1280, 1440, 1920];
let failures = 0;
const fail = (f, m) => { failures++; console.log(`  FAIL ${f}: ${m}`); };

// constraints: no em or en dashes in visible copy, no external resources
for (const f of FILES) {
  const html = readFileSync(resolve(ROOT, f), 'utf8');
  const text = html.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '');
  if (/[–—]|&mdash;|&ndash;|&#821[12];/.test(text)) fail(f, 'em or en dash in copy');
  if (/<link[^>]+rel=["']?stylesheet|<script[^>]+src=/i.test(html)) fail(f, 'external stylesheet or script');
  if (/url\((?!data:|["']?data:|var\(|#)/.test(html.replace(/url\((#|%23)[^)]*\)/g, ''))) fail(f, 'non-data url()');
}

const b = await chromium.launch();
const L = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
const ratio = (a, c) => { const x = L(a), y = L(c); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

for (const f of FILES) {
  console.log(f);
  const url = 'file://' + resolve(ROOT, f);

  // layout: overflow and tap targets
  for (const w of WIDTHS) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(url + '?motion=off');
    const r = await p.evaluate(() => {
      const sw = document.documentElement.scrollWidth, cw = document.documentElement.clientWidth;
      const small = [];
      document.querySelectorAll('a[href],button').forEach((el) => {
        const b = el.getBoundingClientRect(), cs = getComputedStyle(el);
        if (b.width === 0 || cs.visibility === 'hidden' || cs.display === 'none') return;
        if (b.height < 44 || b.width < 44) small.push((el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30) + ` ${Math.round(b.width)}x${Math.round(b.height)}`);
      });
      return { sw, cw, small };
    });
    if (r.sw > r.cw) fail(f, `horizontal overflow at ${w}px (${r.sw} > ${r.cw})`);
    if (r.small.length) fail(f, `tap targets under 44px at ${w}px: ${[...new Set(r.small)].slice(0, 4).join('; ')}`);
    await p.close();
  }

  // motion override matrix
  const cases = [['no-preference', '', 'on'], ['reduce', '', 'off'], ['reduce', '?motion=force', 'on'], ['no-preference', '?motion=off', 'off']];
  for (const [rm, q, want] of cases) {
    const p = await b.newPage({ reducedMotion: rm });
    await p.goto(url + q);
    const got = await p.evaluate(() => document.documentElement.getAttribute('data-motion'));
    if (got !== want) fail(f, `motion ${rm}${q} gave ${got}, wanted ${want}`);
    await p.close();
  }

  // visibility: sit still 6s, nothing on screen left hidden; then scroll through
  {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
    await p.goto(url);
    await p.waitForTimeout(6000);
    const stuck = await p.evaluate(() => [...document.querySelectorAll('[data-r]')].filter((el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight && +getComputedStyle(el).opacity < 0.99; }).length);
    if (stuck) fail(f, `${stuck} on-screen elements still hidden after 6s`);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < H; y += 450) { await p.evaluate((y) => scrollTo(0, y), y); await p.waitForTimeout(120); }
    await p.waitForTimeout(1500);
    const pending = await p.evaluate(() => [...document.querySelectorAll('[data-r]')].filter((el) => !el.classList.contains('r-in')).length);
    if (pending) fail(f, `${pending} elements never revealed after a full scroll`);
    // timing contract on revealed elements
    const bad = await p.evaluate(() => [...document.querySelectorAll('[data-r]')].map((el) => getComputedStyle(el).transitionTimingFunction).filter((t) => t && !t.includes('cubic-bezier(0.42, 0, 0.58, 1)') && !t.startsWith('ease')).length);
    if (bad) fail(f, `${bad} reveals off the ease-in-out curve`);
    await p.close();
  }

  // contrast from real pixels, captured one viewport at a time so vh-based
  // layout is identical when measuring and when capturing
  for (const w of [1440, 390]) {
    const p = await b.newPage({ viewport: { width: w, height: 900 } });
    await p.goto(url + '?motion=off');
    await p.evaluate(() => document.fonts.ready);
    await p.waitForTimeout(400);
    const H = await p.evaluate(() => document.documentElement.scrollHeight);
    const found = new Set();
    for (let y = 0; y < H; y += 700) {
      await p.evaluate((y) => scrollTo(0, y), y);
      await p.waitForTimeout(80);
      const { boxes, inset } = await p.evaluate(() => {
        let inset = 0;
        document.querySelectorAll('body *').forEach((el) => { const cs = getComputedStyle(el); if (cs.position === 'fixed' || cs.position === 'sticky') { const r = el.getBoundingClientRect(); if (r.top <= 0 && r.bottom > 0 && r.width > innerWidth * 0.5) inset = Math.max(inset, r.bottom); } });
        const out = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const seen = new Set();
        while (walker.nextNode()) {
          const t = walker.currentNode;
          if (!t.textContent.trim()) continue;
          const el = t.parentElement;
          if (seen.has(el)) continue;
          seen.add(el);
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none' || el.closest('[aria-hidden="true"],.sr,script,style')) continue;
          let inFixed = false;
          for (let a = el; a; a = a.parentElement) { const ps = getComputedStyle(a).position; if (ps === 'fixed' || ps === 'sticky') { inFixed = true; break; } }
          const clipped = (r) => { for (let a = el; a && a !== document.body; a = a.parentElement) { const s = getComputedStyle(a); if (s.overflow === 'visible' && s.overflowX === 'visible' && s.overflowY === 'visible') continue; const q = a.getBoundingClientRect(); if (Math.min(r.right, q.right) - Math.max(r.left, q.left) < 1 || Math.min(r.bottom, q.bottom) - Math.max(r.top, q.top) < 1) return true; } return false; };
          const range = document.createRange(); range.selectNodeContents(t);
          for (const r of range.getClientRects()) {
            if (r.width < 2 || r.height < 2 || clipped(r)) continue;
            if (r.bottom > innerHeight || r.top < 0 || (!inFixed && r.top < inset)) continue;
            const m = cs.color.match(/[\d.]+/g).map(Number);
            out.push({ x: r.left, y: r.top, w: r.width, h: r.height, c: m.slice(0, 3), a: m[3] ?? 1, size: parseFloat(cs.fontSize), weight: +cs.fontWeight, text: t.textContent.trim().slice(0, 40) });
          }
        }
        return { boxes: out, inset };
      });
      await p.addStyleTag({ content: '*{color:transparent!important;-webkit-text-fill-color:transparent!important;text-shadow:none!important}' });
      const png = await p.screenshot();
      await p.evaluate(() => document.head.lastElementChild.remove());
      const q = await b.newPage();
      const bad = await q.evaluate(async ({ data, boxes }) => {
        const img = new Image(); img.src = 'data:image/png;base64,' + data; await img.decode();
        const c = document.createElement('canvas'); c.width = img.width; c.height = img.height;
        const x = c.getContext('2d'); x.drawImage(img, 0, 0);
        const L = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(c[0]) + 0.7152 * f(c[1]) + 0.0722 * f(c[2]); };
        const ratio = (a, b) => { const p = L(a), q = L(b); return (Math.max(p, q) + 0.05) / (Math.min(p, q) + 0.05); };
        const res = [];
        for (const bx of boxes) {
          const X = Math.max(0, Math.floor(bx.x)), Y = Math.max(0, Math.floor(bx.y)), W = Math.min(c.width - X, Math.ceil(bx.w)), H = Math.min(c.height - Y, Math.ceil(bx.h));
          if (W < 1 || H < 1) continue;
          const d = x.getImageData(X, Y, W, H).data;
          const rs = [];
          for (let i = 0; i < d.length; i += 12) { const bg = [d[i], d[i + 1], d[i + 2]]; rs.push(ratio(bx.c.map((v, k) => v * bx.a + bg[k] * (1 - bx.a)), bg)); }
          rs.sort((a, b) => a - b);
          const p5 = rs[Math.floor(rs.length * 0.05)];
          const need = bx.size >= 24 || (bx.size >= 18.66 && bx.weight >= 700) ? 3 : 4.5;
          if (p5 < need) res.push(`${p5.toFixed(2)} < ${need} "${bx.text}" (${bx.size}px)`);
        }
        return res;
      }, { data: png.toString('base64'), boxes });
      await q.close();
      bad.forEach((r) => found.add(r));
    }
    if (found.size) fail(f, `contrast at ${w}px, ${found.size} runs:\n      ` + [...found].slice(0, 12).join('\n      '));
    await p.close();
  }
}
await b.close();
console.log(failures ? `\n${failures} failure(s)` : '\nAll checks passed');
process.exit(failures ? 1 : 0);
