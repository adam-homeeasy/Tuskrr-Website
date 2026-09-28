// Measures reference sites on the live page (design-dna rules: measure, do not
// infer). Run: node brand-world/references/measure.mjs [slug ...]
// Writes brand-world/references/<slug>/measure.json and screenshots.
import { createRequire } from 'node:module';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const require = createRequire(import.meta.url);
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node22/lib/node_modules/playwright')); }

const HERE = dirname(fileURLToPath(import.meta.url));
export const SITES = [
  { slug: 'springsummer', url: 'https://springsummer.dk/' },
  { slug: 'basic-agency', url: 'https://www.basicagency.com/' },
  { slug: 'hellohello-outfit', url: 'https://outfit.hellohello.is/' },
  { slug: 'stroms-man', url: 'https://stroms.com/pages/man' },
  { slug: 'brunello-cucinelli-ai', url: 'https://shop.brunellocucinelli.com/en-gb/ai' },
  { slug: 'bread-and-boxers', url: 'https://breadandboxers.com/se' },
  { slug: 'offform', url: 'https://offform.net/' },
  { slug: 'unimatic-impronte', url: 'https://www.unimaticwatches.com/pages/impronte-collection' },
];

const only = process.argv.slice(2);
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36';

// Runs in the page: declarations, computed palette with grounds, type, media.
function collect() {
  const out = { transitions: {}, animations: {}, easings: {}, durations: {}, delays: {}, keyframes: [] };
  const bump = (o, k) => { if (!k) return; o[k] = (o[k] || 0) + 1; };
  const els = [...document.querySelectorAll('body *')].slice(0, 6000);
  for (const el of els) {
    const cs = getComputedStyle(el);
    if (cs.transitionDuration && cs.transitionDuration !== '0s') {
      bump(out.transitions, `${cs.transitionProperty} | ${cs.transitionDuration} | ${cs.transitionTimingFunction} | ${cs.transitionDelay}`);
      cs.transitionTimingFunction.split(/,(?![^(]*\))/).forEach((e) => bump(out.easings, e.trim()));
      cs.transitionDuration.split(',').forEach((d) => bump(out.durations, d.trim()));
      cs.transitionDelay.split(',').forEach((d) => d.trim() !== '0s' && bump(out.delays, d.trim()));
    }
    if (cs.animationName && cs.animationName !== 'none') {
      bump(out.animations, `${cs.animationName} | ${cs.animationDuration} | ${cs.animationTimingFunction} | ${cs.animationDelay} | ${cs.animationIterationCount}`);
    }
  }
  // keyframes from readable stylesheets
  for (const ss of document.styleSheets) {
    let rules; try { rules = ss.cssRules; } catch { continue; }
    for (const r of rules || []) if (r.type === 7) out.keyframes.push(r.cssText.slice(0, 400));
  }
  out.keyframes = out.keyframes.slice(0, 40);

  // palette: text colour on its effective ground
  const ground = (el) => {
    let e = el;
    while (e) { const bg = getComputedStyle(e).backgroundColor; if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') return bg; e = e.parentElement; }
    return 'page';
  };
  const pairs = {}; const bgs = {};
  for (const el of els) {
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    if (r.width * r.height > 2000 && cs.backgroundColor !== 'rgba(0, 0, 0, 0)') bump(bgs, cs.backgroundColor);
    const t = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (t && r.width > 0) bump(pairs, `${cs.color} on ${ground(el)}`);
  }
  out.pairs = Object.entries(pairs).sort((a, b) => b[1] - a[1]).slice(0, 14);
  out.backgrounds = Object.entries(bgs).sort((a, b) => b[1] - a[1]).slice(0, 10);
  out.bodyBg = getComputedStyle(document.body).backgroundColor;
  out.htmlBg = getComputedStyle(document.documentElement).backgroundColor;

  // type
  const fonts = {}; const sizes = {};
  for (const el of els) {
    const t = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1);
    if (!t) continue;
    const cs = getComputedStyle(el);
    bump(fonts, `${cs.fontFamily.split(',')[0].replace(/"/g, '')} ${cs.fontWeight}${cs.fontStyle === 'italic' ? ' italic' : ''}`);
    bump(sizes, `${cs.fontSize}/${cs.lineHeight} ls:${cs.letterSpacing} ${cs.textTransform}`);
  }
  out.fonts = Object.entries(fonts).sort((a, b) => b[1] - a[1]).slice(0, 10);
  out.sizes = Object.entries(sizes).sort((a, b) => parseFloat(b[0]) - parseFloat(a[0])).slice(0, 12);
  const h = [...document.querySelectorAll('h1,h2,h3')].slice(0, 8).map((e) => { const cs = getComputedStyle(e); return { tag: e.tagName, text: e.textContent.trim().slice(0, 70), font: cs.fontFamily.split(',')[0], size: cs.fontSize, lh: cs.lineHeight, ls: cs.letterSpacing, weight: cs.fontWeight, tt: cs.textTransform }; });
  out.headings = h;

  // media inventory
  const vids = [...document.querySelectorAll('video')].map((v) => { const r = v.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), autoplay: v.autoplay, loop: v.loop, muted: v.muted, src: (v.currentSrc || v.querySelector('source')?.src || '').slice(0, 120) }; });
  const imgs = [...document.querySelectorAll('img')].map((i) => { const r = i.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height), nw: i.naturalWidth, nh: i.naturalHeight, fit: getComputedStyle(i).objectFit }; }).filter((i) => i.w > 40);
  const ratios = {}; imgs.forEach((i) => { if (i.h) bump(ratios, (i.w / i.h).toFixed(2)); });
  out.media = { videos: vids.slice(0, 20), videoCount: vids.length, imageCount: imgs.length, iframes: document.querySelectorAll('iframe').length, canvases: document.querySelectorAll('canvas').length, svgs: document.querySelectorAll('svg').length, imgRatios: Object.entries(ratios).sort((a, b) => b[1] - a[1]).slice(0, 10), bigImages: imgs.filter((i) => i.w > 600).length };
  // structure
  out.page = { height: document.documentElement.scrollHeight, width: document.documentElement.clientWidth, sections: document.querySelectorAll('section').length, title: document.title };
  const nav = document.querySelector('header, nav');
  if (nav) { const cs = getComputedStyle(nav); const r = nav.getBoundingClientRect(); out.nav = { tag: nav.tagName, position: cs.position, height: Math.round(r.height), bg: cs.backgroundColor, mixBlend: cs.mixBlendMode, backdrop: cs.backdropFilter, links: [...nav.querySelectorAll('a')].map((a) => a.textContent.trim()).filter(Boolean).slice(0, 16) }; }
  // overlays on big media
  out.overlays = [];
  for (const el of els) {
    const cs = getComputedStyle(el);
    for (const pseudo of ['::before', '::after']) {
      const p = getComputedStyle(el, pseudo);
      if (p.content !== 'none' && p.backgroundImage.includes('gradient')) out.overlays.push({ on: el.className?.toString().slice(0, 50), pseudo, bg: p.backgroundImage.slice(0, 200), opacity: p.opacity, blend: p.mixBlendMode });
    }
    if (cs.backgroundImage.includes('gradient') && el.getBoundingClientRect().width > 300) out.overlays.push({ on: el.className?.toString().slice(0, 50), bg: cs.backgroundImage.slice(0, 200), opacity: cs.opacity, blend: cs.mixBlendMode });
    if (cs.mixBlendMode !== 'normal') bump(out, 'blend:' + cs.mixBlendMode);
  }
  out.overlays = out.overlays.slice(0, 12);
  const libs = [];
  if (window.gsap) libs.push('gsap ' + window.gsap.version);
  if (window.ScrollTrigger) libs.push('ScrollTrigger');
  if (window.Lenis || document.documentElement.classList.contains('lenis')) libs.push('lenis');
  if (window.THREE) libs.push('three');
  if (window.Shopify) libs.push('shopify');
  if (window.__NEXT_DATA__ || document.getElementById('__next')) libs.push('next');
  if (document.querySelector('[data-framer-name], [data-framer-component-type]')) libs.push('framer');
  if (document.querySelector('[data-wf-page], html[data-wf-site]')) libs.push('webflow');
  if (window.Swiper || document.querySelector('.swiper')) libs.push('swiper');
  if (window.barba) libs.push('barba');
  out.libs = libs;
  out.scripts = [...document.scripts].map((s) => s.src).filter(Boolean).map((s) => s.replace(/\?.*/, '').split('/').slice(-2).join('/')).slice(0, 40);
  return out;
}

// Samples transform/opacity of the largest visible text and media early in load.
function sample() {
  const pick = [...document.querySelectorAll('h1,h2,h3,p,img,video,a,span,[class*=title],[class*=hero] *')]
    .filter((e) => { const r = e.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && r.width > 30; }).slice(0, 40);
  return pick.map((e) => { const cs = getComputedStyle(e); return { tag: e.tagName, cls: (e.className?.toString() || '').slice(0, 40), op: cs.opacity, tf: cs.transform, clip: cs.clipPath, filter: cs.filter }; })
    .filter((s) => s.op !== '1' || s.tf !== 'none' || s.clip !== 'none' || s.filter !== 'none');
}

const b = await chromium.launch({ args: ['--autoplay-policy=no-user-gesture-required'] });
for (const s of SITES) {
  if (only.length && !only.includes(s.slug)) continue;
  const dir = join(HERE, s.slug); mkdirSync(join(dir, 'shots'), { recursive: true });
  const res = { url: s.url, measured: new Date().toISOString(), viewport: '1440x900' };
  try {
    const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, userAgent: UA, locale: 'en-GB' });
    const p = await ctx.newPage();
    const net = { video: [], font: [], image: 0 };
    p.on('response', (r) => { const t = r.headers()['content-type'] || ''; const u = r.url(); if (t.includes('video') || /\.(mp4|webm|m3u8)/.test(u)) net.video.push(u.slice(0, 140)); else if (t.includes('font') || /\.(woff2?|otf|ttf)/.test(u)) net.font.push(u.split('/').pop().slice(0, 80)); else if (t.includes('image')) net.image++; });
    const t0 = Date.now();
    const resp = await p.goto(s.url, { waitUntil: 'commit', timeout: 60000 });
    res.status = resp?.status();
    // mid-entrance samples at ~300ms, ~700ms, ~1500ms after DOMContentLoaded
    await p.waitForLoadState('domcontentloaded').catch(() => {});
    res.entrance = [];
    for (const ms of [150, 400, 800, 1500]) {
      await p.waitForTimeout(Math.max(0, ms - (Date.now() - t0)));
      res.entrance.push({ at: Date.now() - t0, items: await p.evaluate(sample).catch((e) => String(e)) });
    }
    await p.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
    await p.waitForTimeout(2500);
    await p.screenshot({ path: join(dir, 'shots', 'd-000.jpg'), type: 'jpeg', quality: 70 });
    // dismiss cookie banners that block the view
    for (const sel of ['#onetrust-accept-btn-handler', 'button:has-text("Accept all")', 'button:has-text("Accept")', 'button:has-text("Allow all")', 'button:has-text("OK")', 'button:has-text("Godkänn")', 'button:has-text("Acceptera")']) {
      const el = p.locator(sel).first(); if (await el.isVisible().catch(() => false)) { await el.click({ timeout: 2000 }).catch(() => {}); await p.waitForTimeout(600); break; }
    }
    Object.assign(res, await p.evaluate(collect));
    // scroll through, sampling reveals mid-flight and taking shots
    const H = res.page.height; const steps = Math.min(14, Math.ceil(H / 900));
    res.scrollReveals = [];
    for (let i = 1; i <= steps; i++) {
      await p.mouse.wheel(0, 900); await p.waitForTimeout(200);
      if (i <= 4) res.scrollReveals.push({ y: i * 900, items: (await p.evaluate(sample).catch(() => [])).slice(0, 10) });
      await p.waitForTimeout(900);
      await p.screenshot({ path: join(dir, 'shots', `d-${String(i).padStart(3, '0')}.jpg`), type: 'jpeg', quality: 60 });
    }
    res.afterScroll = await p.evaluate(() => ({ height: document.documentElement.scrollHeight, videos: document.querySelectorAll('video').length, imgs: document.querySelectorAll('img').length }));
    res.net = { videos: [...new Set(net.video)].slice(0, 20), fonts: [...new Set(net.font)].slice(0, 20), images: net.image };
    await ctx.close();
    // phone
    const m = await b.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA.replace('Macintosh; Intel Mac OS X 10_15_7', 'iPhone; CPU iPhone OS 18_0 like Mac OS X') + ' Mobile', isMobile: true, hasTouch: true, deviceScaleFactor: 2 });
    const mp = await m.newPage();
    await mp.goto(s.url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(() => {});
    await mp.waitForTimeout(4000);
    for (let i = 0; i < 4; i++) { await mp.screenshot({ path: join(dir, 'shots', `m-${i}.jpg`), type: 'jpeg', quality: 60 }); await mp.evaluate(() => scrollBy(0, 844)); await mp.waitForTimeout(1000); }
    res.phone = await mp.evaluate(() => ({ height: document.documentElement.scrollHeight, overflowX: document.documentElement.scrollWidth > innerWidth }));
    await m.close();
  } catch (e) { res.error = String(e).slice(0, 400); }
  writeFileSync(join(dir, 'measure.json'), JSON.stringify(res, null, 1));
  console.log(s.slug, res.status, res.error || `h=${res.page?.height} vids=${res.media?.videoCount} imgs=${res.media?.imageCount}`);
}
await b.close();
