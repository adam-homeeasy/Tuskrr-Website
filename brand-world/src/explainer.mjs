// Builds the Tuskrr brand world explainer as two NoDecks-format decks (Grid
// theme): a client deck and an internal deck. Run: node brand-world/src/explainer.mjs
// World data comes from snapshots of round 1 (commit 1d5ff74) and round 2
// (commit 2744842) so every quoted palette, line and device is exact.
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, IMG, PRODUCTS, contourSVG, ridgesSVG, esc } from './shared.mjs';
import { WORLDS as R1 } from './snapshots/round1-worlds.mjs';
import { WORLDS as R2, FOUNDATION as F } from './snapshots/round2-worlds.mjs';

const SKILL = '/root/.claude/skills/synced/1143db4b-e37c-435b-8a4f-be5f8724496a_7933aa2e-6d1d-47d6-8986-3b24fdf6da6e/nodecks-deck';
const TEMPLATE = readFileSync(join(SKILL, 'assets/base-template.html'), 'utf8');
const MOTION = readFileSync(join(SKILL, 'assets/motion.min.js'), 'utf8');
const OUT = join(ROOT, 'explainer');

// Confirmed after round 2 (see HANDOVER.md). Laptop sizes and returns are samples.
const PROOF = [
  ['Genuine leather', 'Confirmed'],
  ['3-year warranty', 'Confirmed'],
  ['Cash on delivery', 'Confirmed'],
  ['Initials embossed on custom order, ready in 2 weeks', 'Confirmed'],
  ['Laptop fit shown for every bag', 'Sample sizes for now'],
  ['Free returns within 7 days of delivery', 'Sample policy for now'],
];
const LAPTOP = { ridge: '15.6-inch', traverse: '16-inch', strata: '15.6-inch', crest: '15.6-inch', axis: '11-inch tablet', contour: '14-inch' };

// ---------- Grid theme (nodecks-color-deck section 3) ----------
const GRID_TOKENS = `:root {
  /* Hallmark · theme: Grid (editorial) · signal ink: ultramarine oklch(45% 0.19 264) · paper oklch(99% 0.003 255) · Archivo only */
  --nd-canvas: #fafcfe; --nd-surface: #fafcfe; --nd-surface-2: #f4f6f8; --nd-border: #d5d8db;
  --nd-text-primary: #0a0e12; --nd-text-secondary: #2a2e34; --nd-text-muted: #54585f;
  --nd-brand-fill: #1a48bc; --nd-brand-ink: #1a48bc; --nd-glow: #e1ecff; --nd-card-shadow: none;
  --nd-ink: #1a48bc; --nd-ink-2: #1a48bc; --nd-on-ink: #fafcfe; --nd-on-ink-muted: #d6e2ff;
  --nd-series-1: #1a48bc; --nd-series-2: #494d54; --nd-series-3: #82878c; --nd-series-4: #0a0e12;
  --nd-status-critical: #b71a18; --nd-status-serious: #996700; --nd-status-warning: #996700; --nd-status-good: #007834;
  --nd-status-critical-ink: #b71a18; --nd-status-warning-ink: #996700; --nd-status-good-ink: #007834;
  --nd-grid: #ebedf0; --nd-track: #ebedf0; --nd-axis: #d5d8db;
  --nd-font-heading: "Archivo", system-ui, -apple-system, "Segoe UI", sans-serif;
  --nd-font-body: "Archivo", system-ui, -apple-system, "Segoe UI", sans-serif;
  --nd-radius: 0; --nd-radius-pill: 0; --nd-ease: cubic-bezier(0.16, 1, 0.3, 1); --nd-rail-w: 220px;
}
html[data-theme="dark"] {
  --nd-canvas: #07090d; --nd-surface: #07090d; --nd-surface-2: #101419; --nd-border: #2a2e34;
  --nd-text-primary: #e8ebef; --nd-text-secondary: #b3b8be; --nd-text-muted: #8e9398;
  --nd-brand-fill: #6e9bfb; --nd-brand-ink: #6e9bfb; --nd-glow: #10192e; --nd-card-shadow: none;
  --nd-ink: #1a48bc; --nd-ink-2: #1a48bc; --nd-on-ink: #fafcfe; --nd-on-ink-muted: #d6e2ff;
  --nd-series-1: #6e9bfb; --nd-series-2: #a0a5ab; --nd-series-3: #6e7277; --nd-series-4: #e8ebef;
  --nd-status-critical-ink: #ff8a85; --nd-status-warning-ink: #e0b050; --nd-status-good-ink: #5fd18a;
  --nd-grid: #2a2e34; --nd-track: #2a2e34; --nd-axis: #44484d;
}`;

const GRID_DEVICES = `
/* Grid devices */
.nd-main { position: relative; }
.nd-main::before { content: ""; position: absolute; inset: 0 64px; z-index: 0; pointer-events: none;
  background-image: repeating-linear-gradient(to right, var(--nd-grid) 0, var(--nd-grid) 1px, transparent 1px, transparent calc(100% / 12)); }
.nd-section { position: relative; z-index: 1; }
h1, h2, h3, .nd-number { font-family: var(--nd-font-heading); font-weight: 800; letter-spacing: -0.03em; }
h2.nd-claim { letter-spacing: -0.035em; line-height: 1.05; max-width: 22ch; font-size: clamp(1.9rem, 3.6vw, 3rem); }
h2.nd-claim::before { content: ""; display: block; width: 96px; height: 3px; background: var(--nd-brand-fill); margin-bottom: 18px; }
.nd-section-index, table.nd-table th, .nd-chart-title, .nd-stat-label, .nd-lbl { font-family: var(--nd-font-body); font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.09em; color: var(--nd-text-muted); }
.nd-section-index { color: var(--nd-brand-ink); }
.nd-takeaway { display: block; max-width: 60ch; background: none; border-top: 2px solid var(--nd-text-primary); border-radius: 0; padding: 12px 0 0; color: var(--nd-text-primary); font-weight: 600; }
.nd-takeaway::before { content: ""; display: inline-block; width: .52em; height: .52em; background: var(--nd-brand-fill); margin-right: 10px; }
.nd-card { border: 1px solid var(--nd-border); border-radius: 0; box-shadow: none; background: var(--nd-surface); }
.nd-toggles button, .nd-table-toggle, .nd-rail a { border-radius: 0 !important; }
.nd-stat-row, .nd-cells { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0; border-top: 2px solid var(--nd-text-primary); }
.nd-cells.c2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.nd-cells.c4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
.nd-stat-row > *, .nd-cells > * { border: 0; border-inline-start: 1px solid var(--nd-border); padding: 18px 20px 6px; background: none; }
.nd-stat-row > :first-child, .nd-cells > :first-child { border-inline-start: 0; padding-left: 0; }
.nd-stat-value { display: block; font-family: var(--nd-font-heading); font-weight: 800; font-size: clamp(1.8rem, 3vw, 2.8rem); letter-spacing: -0.03em; white-space: nowrap; color: var(--nd-brand-ink); line-height: 1.05; }
.nd-stat-label { display: block; margin-top: 8px; }
.nd-cells h3 { font-size: 1.15rem; margin: 0 0 8px; letter-spacing: -0.02em; }
.nd-cells p { margin: 0 0 10px; color: var(--nd-text-secondary); font-size: .96rem; }
.nd-cells .nd-lbl { display: block; margin-bottom: 8px; }
.nd-section p { max-width: 68ch; }
.nd-lead { font-size: 1.15rem; color: var(--nd-text-secondary); margin: 0 0 22px; }
table.nd-table { font-variant-numeric: tabular-nums; }
table.nd-table td { vertical-align: top; }
table.nd-table th { border-bottom: 2px solid var(--nd-text-primary); }
.nd-quote { font-family: var(--nd-font-heading); font-weight: 800; letter-spacing: -0.03em; font-size: clamp(1.4rem, 2.4vw, 2rem); line-height: 1.1; margin: 0 0 10px; color: var(--nd-text-primary); }
.nd-tagline { font-family: var(--nd-font-heading); font-weight: 800; letter-spacing: -0.04em; font-size: clamp(2.6rem, 6vw, 5rem); line-height: .95; margin: 0 0 20px; }
.nd-list { margin: 0; padding: 0; list-style: none; border-top: 2px solid var(--nd-text-primary); }
.nd-list li { padding: 12px 0; border-bottom: 1px solid var(--nd-border); max-width: 72ch; }
.nd-list li b { display: block; }
.nd-list li span { color: var(--nd-text-secondary); }
/* Brand-world previews. These are exhibits: the colours inside them are the
   brand worlds' own palettes, shown as content, not deck tokens. */
.bw-prev { position: relative; height: 190px; overflow: hidden; margin: 0 0 14px; }
.bw-prev svg { position: absolute; inset: 0; width: 100%; height: 100%; }
.bw-prev .h { position: absolute; left: 7%; right: 7%; bottom: 9%; font-family: var(--nd-font-heading); font-weight: 800; letter-spacing: -0.03em; line-height: .95; font-size: clamp(1.1rem, 2vw, 1.7rem); text-transform: uppercase; z-index: 2; }
.bw-fs { background: #ECE8DF; color: #1B1C1A; } .bw-fs svg { color: #C9C1AF; }
.bw-qa { background: #121212; color: #ECEAE6; background-image: linear-gradient(90deg, rgba(236,234,230,.08) 1px, transparent 1px); background-size: calc(100% / 12) 100%; } .bw-qa em { font-style: normal; color: #C9A24A; }
.bw-hg { background: linear-gradient(180deg, #150e14 0%, #2d1d2c 34%, #6a3f55 52%, #c46a47 64%, #e39a5b 74%); color: #EBDDC7; } .bw-hg .h { top: 9%; bottom: auto; text-transform: none; } .bw-hg em { font-style: normal; color: #E39A5B; }
.bw-en { background: #131110; color: #EFE9E1; } .bw-en em { font-style: normal; color: #D1A650; }
.bw-en .slit { position: absolute; top: 8%; bottom: 0; left: 64%; width: 12%; background: linear-gradient(180deg, #F6E3BD, #dcb77a); box-shadow: 0 0 60px 12px rgba(246,227,189,.28); }
.bw-en .h { right: 42%; }
.bw-big { height: 300px; margin-bottom: 22px; }
.bw-big .h { font-size: clamp(1.6rem, 3.4vw, 2.8rem); }
.chips { display: flex; height: 16px; margin: 8px 0 12px; }
.chips i { flex: 1; }
.dir-meta { font-size: .9rem; color: var(--nd-text-secondary); }
.dir-meta b { color: var(--nd-text-primary); }
.logo { display: block; width: 180px; height: auto; margin: 0 0 26px; }
.prod { display: grid; grid-template-columns: minmax(0, 1fr) 260px; gap: 40px; align-items: start; }
.prod img { width: 100%; height: auto; display: block; border: 1px solid var(--nd-border); }
.prod figcaption { font-size: 12px; color: var(--nd-text-muted); margin-top: 6px; }
@media (max-width: 900px) {
  .nd-stat-row, .nd-cells, .nd-cells.c4 { grid-template-columns: 1fr 1fr; }
  .nd-cells.c2 { grid-template-columns: 1fr; }
  .prod { grid-template-columns: 1fr; }
}
@media (max-width: 560px) {
  .nd-stat-row, .nd-cells, .nd-cells.c4 { grid-template-columns: 1fr; }
  .nd-stat-row > *, .nd-cells > * { border-inline-start: 0; padding-left: 0; border-bottom: 1px solid var(--nd-border); }
}
/* One plate per deck: the premise */
.nd-section--ink { background: var(--nd-ink); color: var(--nd-on-ink); margin: 0 -64px; padding-left: 64px; padding-right: 64px; border-bottom: 0; }
.nd-section--ink::before { content: ""; position: absolute; inset: 0 64px; pointer-events: none;
  background-image: repeating-linear-gradient(to right, rgba(250,252,254,.14) 0, rgba(250,252,254,.14) 1px, transparent 1px, transparent calc(100% / 12)); }
.nd-section--ink > * { position: relative; }
.nd-section--ink h2.nd-claim, .nd-section--ink .nd-takeaway, .nd-section--ink .nd-stat-value, .nd-section--ink .nd-lead, .nd-section--ink p { color: var(--nd-on-ink); }
.nd-section--ink .nd-section-index, .nd-section--ink .nd-stat-label { color: var(--nd-on-ink-muted); }
.nd-section--ink h2.nd-claim::before, .nd-section--ink .nd-takeaway::before { background: var(--nd-on-ink); }
.nd-section--ink .nd-takeaway { border-top-color: var(--nd-on-ink); }
.nd-section--ink .nd-stat-row { border-top-color: var(--nd-on-ink); }
.nd-section--ink .nd-stat-row > * { border-color: rgba(250,252,254,.35); }
::selection { background: var(--nd-glow); color: var(--nd-text-primary); }
`;

const PRINT_SHARED = `
  html, body { background: var(--nd-canvas) !important; color: var(--nd-text-primary) !important; }
  .nd-section { padding: 6mm 6mm 12mm !important; justify-content: flex-start; }
  body { font-size: 13px; line-height: 1.45; }
  h2.nd-claim { font-size: 1.45rem !important; margin-bottom: 14px !important; max-width: 46ch !important; }
  .nd-substance { margin-bottom: 14px !important; }
  .nd-card { padding: 14px 18px !important; }
  .nd-stat-value { font-size: 1.5rem !important; }
  table.nd-table { font-size: .78rem !important; }
  table.nd-table th, table.nd-table td { padding: 5px 8px !important; }
  .nd-chart-view svg { max-height: 66mm; }
  .nd-takeaway { font-size: .85rem !important; padding: 6px 12px !important; }
  .nd-stagger-group > *, [data-reveal="table-rows"] tr { opacity: 1 !important; transform: none !important; }
  .nd-main::before { display: none; }
  .nd-section--ink { background: var(--nd-ink) !important; color: var(--nd-on-ink) !important; margin: 0; padding: 8mm 6mm 12mm !important; }
  .bw-prev { height: 34mm; }
  .bw-big { height: 24mm; margin-bottom: 8px !important; }
  .bw-big .h { font-size: 1.2rem !important; }
  #field-survey table.nd-table, #quiet-architecture table.nd-table, #high-ground table.nd-table, #the-entrance table.nd-table { font-size: .7rem !important; }
  #field-survey table.nd-table th, #field-survey table.nd-table td, #quiet-architecture table.nd-table th, #quiet-architecture table.nd-table td, #high-ground table.nd-table th, #high-ground table.nd-table td, #the-entrance table.nd-table th, #the-entrance table.nd-table td { padding: 3px 8px !important; }
  #field-survey tbody th, #quiet-architecture tbody th, #high-ground tbody th, #the-entrance tbody th { font-size: .75rem !important; }
  #field-survey .chips, #quiet-architecture .chips, #high-ground .chips, #the-entrance .chips { height: 9px; margin: 3px 0 5px; }
  #field-survey h2.nd-claim, #quiet-architecture h2.nd-claim, #high-ground h2.nd-claim, #the-entrance h2.nd-claim { font-size: 1.25rem !important; }
  .nd-tagline { font-size: 2.6rem !important; }
  .nd-lead { font-size: .95rem !important; margin-bottom: 10px !important; }
  .nd-cells p, .nd-list li { font-size: .8rem !important; }
  .nd-list li { padding: 5px 0 !important; }
  .logo { width: 110px; margin-bottom: 10px; }
  .prod { grid-template-columns: minmax(0, 1fr) 150px; gap: 20px; }
`;

const FINALIZE = `<script>(function(){function fin(){var pt=document.documentElement.getAttribute('data-print-theme');if(pt){document.documentElement.setAttribute('data-theme',pt);}
  document.querySelectorAll('[data-reveal=number]').forEach(function(el){
  el.textContent=(el.getAttribute('data-prefix')||'')+el.getAttribute('data-value')+(el.getAttribute('data-suffix')||'');});}
window.addEventListener('beforeprint',fin);var mq=window.matchMedia&&window.matchMedia('print');
if(mq&&mq.addEventListener){mq.addEventListener('change',function(e){if(e.matches)fin();});}})();</script>`;

// ---------- helpers ----------
let counter = 0;
const pad = (n) => String(n).padStart(2, '0');
function sec({ id, label, claim, body, take, ink = false }) {
  const idx = pad(++counter);
  return `<section class="nd-section${ink ? ' nd-section--ink' : ''}" id="${id}" data-index="${idx}" data-label="${esc(label.toUpperCase())}">
  <div class="nd-section-head"><span class="nd-section-index">${idx} / ${esc(label.toUpperCase())}</span></div>
  <h2 class="nd-claim" data-reveal="claim">${claim}</h2>
  <div class="nd-substance" data-reveal="substance">${body}</div>
  <p class="nd-takeaway" data-reveal="takeaway">${take}</p>
</section>`;
}
const table = (head, rows, { reveal = true } = {}) => `<table class="nd-table"><thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody${reveal ? ' data-reveal="table-rows"' : ''}>${rows.map((r) => `<tr>${r.map((c, i) => i === 0 ? `<th scope="row" style="text-transform:none;letter-spacing:0;font-size:.92rem;color:var(--nd-text-primary);border-bottom:1px solid var(--nd-border)">${c}</th>` : `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
const chips = (pal) => `<span class="chips" aria-hidden="true">${pal.map((c) => `<i style="background:${c.hex}"></i>`).join('')}</span>`;
const palText = (pal) => pal.map((c) => `${esc(c.name)} ${c.hex}`).join(', ');

// ---------- previews ----------
const PREV = {
  fs: (big) => `<div class="bw-prev bw-fs${big ? ' bw-big' : ''}" aria-hidden="true">${contourSVG({ seed: 7, cols: 60, levels: 12 })}<span class="h">The wild,<br>measured.</span></div>`,
  qa: (big) => `<div class="bw-prev bw-qa${big ? ' bw-big' : ''}" aria-hidden="true"><span class="h">Every line<br>has <em>purpose.</em></span></div>`,
  hg: (big) => `<div class="bw-prev bw-hg${big ? ' bw-big' : ''}" aria-hidden="true">${ridgesSVG({ w: 800, h: 320, seed: 3, layers: [{ base: 0.5, amp: 0.3, freq: 2.2, fill: '#7a4a5e' }, { base: 0.66, amp: 0.3, freq: 2.8, fill: '#4f3547' }, { base: 0.82, amp: 0.3, freq: 3.4, fill: '#3a2530' }, { base: 1, amp: 0.25, freq: 4.1, fill: '#221610' }] }).replace('<svg ', '<svg style="top:auto;height:55%" ')}<span class="h">Take the <em>long</em> way.</span></div>`,
  en: (big) => `<div class="bw-prev bw-en${big ? ' bw-big' : ''}" aria-hidden="true"><span class="slit"></span><span class="h">Arrive like<br>you <em>mean it.</em></span></div>`,
};

// The four directions in play, in one shape.
const DIRS = [
  { key: 'fs', theme: 'Linear Wilderness', w: R1.a, website: 'A legend rail on the left and a scroll of numbered sheets' },
  { key: 'qa', theme: 'Linear Wilderness', w: R1.b, website: 'An index list of names with the product in a pane beside it' },
  { key: 'hg', theme: 'Linear Wilderness', w: R1.c, website: 'Full-screen scenes with an elevation line tracking the scroll' },
  { key: 'en', theme: 'The Entrance', w: R2.a, website: 'A numbered index; tap a name and the bag steps into the light' },
];
const typeOf = (w) => {
  const { display: d, text: t, data: x } = w.type;
  const parts = [d.startsWith(t) ? `${t} (condensed for display)` : `${d}, ${t}`];
  if (!x.startsWith(t) && !x.startsWith(d)) parts.push(x);
  return parts.join(', ');
};
const shots = (w) => w.photo.map(([h]) => h).filter((h) => h !== 'The grade').map((h, i) => i ? h.charAt(0).toLowerCase() + h.slice(1) : h).join(', ');

// ---------- sections ----------
const S = {};

S.premise = () => sec({
  id: 'premise', label: 'Premise', ink: true,
  claim: 'Tuskrr&#8217;s buyer has upgraded everything except the bag, and the brand is built on that gap.',
  body: `<p class="nd-lead">A leather work and everyday bag for the early-career climber in metro India. They changed the phone, the watch and the sneakers. They still carry the company backpack.</p>
    <div class="nd-stat-row">
      <div><span class="nd-stat-value">24 to 34</span><span class="nd-stat-label">Age of the core buyer</span></div>
      <div><span class="nd-stat-value">&#8377;6,000</span><span class="nd-stat-label">Typical price, range &#8377;5,000 to 7,000</span></div>
      <div><span class="nd-stat-value"><span data-reveal="number" data-value="6">6</span> bags</span><span class="nd-stat-label">In the launch range</span></div>
    </div>`,
  take: 'Every choice in this document is judged against that buyer.',
});

S.source = () => sec({
  id: 'source', label: 'Source',
  claim: 'Everything here comes from four client inputs, with nothing borrowed from stock.',
  body: table(['Input', 'What it gave us', 'Limit'], [
    ['Product names deck (PDF)', 'Six names, their inspirations, stories and campaign lines; the phrase Linear Wilderness', 'Moodboard photos inside are reference only; we do not hold the rights'],
    ['Logo files', 'Tusker monogram and wordmark, black and white versions', 'JPEG only; vector files still needed'],
    ['Six product renders', 'RIDGE, TRAVERSE, STRATA, CREST, AXIS, CONTOUR', 'Renders, not photography'],
    ['Answers from Tuskrr', 'Price, market, channel, material, warranty, cash on delivery, initials lead time, no Diwali page', 'Laptop sizes and returns policy not yet given'],
  ]),
  take: 'The gaps in the last column become the open decisions at the end.',
});

S.findings = () => sec({
  id: 'findings', label: 'Findings',
  claim: 'The source files carry five problems the website will inherit unless Tuskrr fixes them.',
  body: table(['Finding', 'Why it matters', 'Fix'], [
    ['Two wordmarks on the badges', 'RIDGE and CREST carry the drawn logo; TRAVERSE, STRATA, AXIS and CONTOUR carry plain letters', 'Use the drawn wordmark on every badge'],
    ['The gold S is used unevenly', 'It is on RIDGE, TRAVERSE, STRATA and CONTOUR, missing on CREST and AXIS', 'Decide if it is a brand mark or a finish'],
    ['Logo exists only as JPEG', 'It cannot be printed or scaled cleanly', 'Commission vector files'],
    ['Moodboard photos are not ours', 'They cannot appear on the site', 'Plan a shoot in Indian cities with Indian models'],
    ['Products are renders', 'Renders undersell leather at close range', 'Photograph the real bags'],
  ]),
  take: 'None of these blocks the brand world; all of them block launch.',
});

S.buyer = () => sec({
  id: 'buyer', label: 'Buyer',
  claim: 'The core buyer is an early-career climber in metro India, still carrying the company backpack.',
  body: `<div class="nd-cells nd-stagger-group">
      <div><span class="nd-lbl">Where</span><p>${esc(F.icp.who)}</p></div>
      <div><span class="nd-lbl">How they live</span><p>${esc(F.icp.life)}</p></div>
      <div><span class="nd-lbl">How they buy</span><p>${esc(F.icp.money)} ${esc(F.icp.first)}</p></div>
    </div>`,
  take: 'Not for hikers, logo-seekers or suit-only formal buyers.',
});

S.gift = () => sec({
  id: 'gifting', label: 'Gifting',
  claim: 'Gifting is Tuskrr&#8217;s second front door, and it needs its own route through the site.',
  body: `<div class="nd-cells c2 nd-stagger-group">
      ${F.secondary.map(([h, t]) => `<div><h3>${esc(h)}</h3><p>${esc(t)}</p></div>`).join('')}
    </div>
    <p style="margin-top:22px">On the site: gift-ready box and dust bag, a printed note from the giver, initials embossed as a custom order (ready in 2 weeks), and one enquiry form for corporate orders. No Diwali page.</p>`,
  take: 'The site needs a gift route, not a gift-wrap checkbox.',
});

S.triggers = () => sec({
  id: 'triggers', label: 'Triggers',
  claim: 'Two sentences start a sale, and both end in the same feeling.',
  body: `<div class="nd-cells c2 nd-stagger-group">
      ${F.triggers.map(([who, line, pay]) => `<div><span class="nd-lbl">${esc(who)}</span><p class="nd-quote">&#8220;${esc(line)}&#8221;</p><p>${esc(pay)}</p></div>`).join('')}
    </div>`,
  take: `Both buyers pay for the same thing: ${esc(F.emotion.replace(/\.$/, '')).toLowerCase()}.`,
});

S.tagline = (internal) => sec({
  id: 'tagline', label: 'Tagline',
  claim: '&#8220;Arrive like you mean it&#8221; ties the bag to the moment the buyer cares about: walking into the room.',
  body: `<p class="nd-tagline">Arrive like you mean it.</p>
    <div class="nd-cells">
      <div><span class="nd-lbl">Promise</span><p>${esc(F.promise)}</p></div>
      <div><span class="nd-lbl">Where it lives</span><p>Under the logo, on the hang tag, the site&#8217;s first screen and the end of every Reel.</p></div>
      <div><span class="nd-lbl">In a gift note</span><p>&#8220;New role. Arrive like you mean it.&#8221;</p></div>
    </div>
    ${internal ? '<p style="margin-top:22px">The shortlist was &#8220;Carry the room&#8221;, &#8220;Sharp lines. Wild heart.&#8221;, &#8220;Leave the herd&#8221; and &#8220;Arrive like you mean it&#8221;. Tuskrr chose the last one.</p>' : ''}`,
  take: 'Run a trademark search at IP India before it is printed.',
});

S.voice = () => sec({
  id: 'voice', label: 'Personality and voice',
  claim: 'Tuskrr sounds confident, sharp, warm and a little wild, and it never calls itself premium.',
  body: `<div class="nd-cells c2">
      <div><span class="nd-lbl">Personality</span>${table(['Is', 'Is not'], F.personality.map(([a, b]) => [esc(a), esc(b.replace(/^not /, ''))]), { reveal: false })}</div>
      <div><span class="nd-lbl">Voice rules</span><ul class="nd-list">${F.voice.map((v) => `<li>${esc(v)}</li>`).join('')}</ul></div>
    </div>`,
  take: 'Say less than you could, and let the leather carry the price.',
});

S.linear = () => sec({
  id: 'linear-wilderness', label: 'Linear Wilderness',
  claim: 'Linear Wilderness is already in Tuskrr&#8217;s own product deck: nature makes the lines, Tuskrr gives them structure.',
  body: `<div class="prod">
      <div>${table(['Bag', 'Inspired by', 'Campaign line'], PRODUCTS.map((p) => [esc(p.name) + `<br><span style="font-weight:400;color:var(--nd-text-muted);font-size:.85rem">${esc(p.type)}</span>`, esc(p.inspired), esc(p.line) + (p.alt ? `<br><span style="color:var(--nd-text-muted);font-size:.85rem">or: ${esc(p.alt)}</span>` : '')]))}</div>
      <figure style="margin:0"><img src="${IMG.ridge}" alt="RIDGE backpack in cognac leather with vertical stitched channels, supplied render"><figcaption>RIDGE. The stitched channels are the lines. Supplied render.</figcaption></figure>
    </div>`,
  take: 'The product names already tell the landscape story, so the brand can stay in the city.',
});

S.theme1 = () => sec({
  id: 'theme-linear', label: 'Theme 1',
  claim: 'Theme one, Linear Wilderness, reads the idea three ways: as a map, as architecture and as a journey.',
  body: `<div class="nd-cells nd-stagger-group">
      ${DIRS.slice(0, 3).map((d) => `<div>${PREV[d.key]()}<span class="nd-lbl">Direction ${d.w.letter}</span><h3>${esc(d.w.name)}</h3>${chips(d.w.palette)}<p>${esc(d.w.reading)}</p><p class="dir-meta"><b>Feels</b> ${esc(d.w.feeling.join(', '))}</p></div>`).join('')}
    </div>`,
  take: 'These predate the tagline; whichever is kept will carry &#8220;Arrive like you mean it.&#8221;',
});

function dirDetail(d, id) {
  const w = d.w;
  return sec({
    id, label: w.name,
    claim: `${esc(w.name)} ${{ fs: 'makes Tuskrr the brand that reads a landscape like a surveyor, then builds its lines into leather.', qa: 'treats the stitched channel as architecture and lets the city carry the wild.', hg: 'tells Tuskrr as a journey, in the warm hour when the land turns to line.', en: 'stages every day as a walk into a room, lit by one door of light.' }[d.key]}`,
    body: `${PREV[d.key](true)}
      ${table(['Part', 'In this direction'], [
        ['Theme', esc(d.theme)],
        ['Idea', esc(w.reading) + ' ' + esc(w.intro)],
        ['Palette', `${chips(w.palette)}${esc(palText(w.palette))}`],
        ['Type', esc(typeOf(w))],
        ['Signature', `<b>${esc(w.device.title)}.</b> ${esc(w.device.text)}`],
        ['Photography', esc(shots(w))],
        ['Voice', esc(w.voice.samples.slice(0, 3).map(([, v]) => v).join(' / '))],
        ['Website', esc(d.website)],
        ['Watch for', esc(w.watch[0])],
      ])}`,
    take: esc(w.strengths[0]),
  });
}

S.theme2 = () => sec({
  id: 'theme-entrance', label: 'Theme 2',
  claim: 'Theme two, The Entrance, stages every day as a walk into a room, lit by one door of light.',
  body: `${PREV.en(true)}
    <div class="nd-cells">
      <div><span class="nd-lbl">Look</span><p>Dark rooms, warm leather, the gold S as the only accent. ${chips(R2.a.palette)}</p></div>
      <div><span class="nd-lbl">Signature</span><p>${esc(R2.a.device.text)}</p></div>
      <div><span class="nd-lbl">Voice</span><p>${esc(R2.a.voice.samples.slice(0, 3).map(([, v]) => v).join(' / '))}</p></div>
    </div>`,
  take: 'It is the direction built after the tagline, so it carries it at full weight.',
});

S.compare = () => sec({
  id: 'compare', label: 'Side by side',
  claim: 'The four directions differ in structure, not only in colour, so choosing between them is a real choice.',
  body: `<div style="overflow-x:auto">${table(['', ...DIRS.map((d) => d.w.name)], [
    ['Theme', ...DIRS.map((d) => esc(d.theme))],
    ['Idea', ...DIRS.map((d) => esc(d.w.reading))],
    ['Look', ...DIRS.map((d) => chips(d.w.palette) + esc(d.w.feeling.join(', ')))],
    ['Type', ...DIRS.map((d) => esc(typeOf(d.w)))],
    ['Signature', ...DIRS.map((d) => esc(d.w.device.title))],
    ['Website', ...DIRS.map((d) => esc(d.website))],
    ['Watch for', ...DIRS.map((d) => esc(d.w.watch[0]))],
  ])}</div>`,
  take: 'More options will be added before a final pick.',
});

S.contrast = () => {
  const bars = [
    ['Field Survey: cognac on paper', 5.72], ['Field Survey: bearing gold on paper', 4.29],
    ['Quiet Architecture: brass on carbon', 7.81], ['High Ground: terracotta on bark', 4.56],
    ['High Ground: dusk on bark', 3.84], ['The Entrance: cognac on night', 5.26], ['The Entrance: brass on night', 8.32],
  ];
  const W = 640, rowH = 34, left = 250, max = 9, scale = (v) => (v / max) * (W - left - 60);
  const svgBars = bars.map(([name, v], i) => {
    const y = 10 + i * rowH, weak = v < 4.5;
    return `<text x="${left - 10}" y="${y + 17}" text-anchor="end" style="font-size:12px;fill:var(--nd-text-primary)">${esc(name)}</text>
      <rect x="${left}" y="${y + 4}" width="${scale(v).toFixed(1)}" height="20" rx="0" style="fill:${weak ? 'var(--nd-series-3)' : 'var(--nd-series-1)'};transform-box:fill-box" data-reveal="bar" data-axis="X"></rect>
      <text x="${(left + scale(v) + 8).toFixed(1)}" y="${y + 19}" style="font-size:12px;font-weight:700;fill:var(--nd-text-primary)">${v.toFixed(2)}</text>`;
  }).join('');
  const H = 10 + bars.length * rowH + 26;
  const ref = (v, lab, anchor) => `<line x1="${(left + scale(v)).toFixed(1)}" x2="${(left + scale(v)).toFixed(1)}" y1="6" y2="${H - 20}" style="stroke:var(--nd-text-muted);stroke-dasharray:3 3"></line><text x="${(left + scale(v) + (anchor === 'end' ? -4 : 4)).toFixed(1)}" y="${H - 6}" text-anchor="${anchor}" style="font-size:11px;fill:var(--nd-text-muted)">${lab}</text>`;
  return sec({
    id: 'contrast', label: 'Contrast',
    claim: 'Every accent in every direction clears its contrast floor, so none needs retuning before build.',
    body: `<div class="nd-card nd-chart-pair">
      <button class="nd-table-toggle" type="button" data-table-toggle aria-label="Show table view">&#8997; Table</button>
      <p class="nd-chart-title" style="padding-right:120px">Accent contrast on each direction&#8217;s main ground</p>
      <div class="nd-chart-view" role="img" aria-label="Bar chart of accent contrast ratios. All seven clear 3.0. Five clear 4.5 for body text; bearing gold at 4.29 and dusk at 3.84 are display sizes only.">
        <svg viewBox="0 0 ${W} ${H}" width="100%" style="height:auto;display:block">${ref(3, '3.0 display', 'end')}${ref(4.5, '4.5 body', 'start')}${svgBars}</svg>
      </div>
      <div class="nd-table-view">${table(['Accent on ground', 'Ratio', 'Allowed use'], bars.map(([n, v]) => [esc(n), `<span class="nd-number">${v.toFixed(2)}</span>`, v >= 4.5 ? 'Any size' : 'Display sizes only']))}</div>
    </div>`,
    take: 'Two accents are display-only; the build notes each one so nobody sets body text in them.',
  });
};

S.trust = () => sec({
  id: 'trust', label: 'Trust',
  claim: 'At &#8377;6,000 from a brand people have not heard of yet, trust closes the sale.',
  body: `<div class="nd-cells c2">
      <div><span class="nd-lbl">On every product page</span>${table(['Proof', 'Status'], PROOF.map(([a, b]) => [esc(a), esc(b)]))}</div>
      <div><span class="nd-lbl">Sample laptop fit, for layout only</span>${table(['Bag', 'Fits'], PRODUCTS.map((p) => [esc(p.name), esc(LAPTOP[p.id])]))}</div>
    </div>`,
  take: 'Replace the sample laptop sizes and returns policy with real figures before launch.',
});

S.history = () => sec({
  id: 'history', label: 'How we got here',
  claim: 'Two rounds produced six directions; four stay in play and one merge is on hold.',
  body: table(['Round', 'Direction', 'Status', 'Why'], [
    ['1', 'Field Survey', 'In play, theme 1', 'Linear Wilderness kept as a theme'],
    ['1', 'Quiet Architecture', 'In play, theme 1', 'Linear Wilderness kept as a theme'],
    ['1', 'High Ground', 'In play, theme 1', 'Linear Wilderness kept as a theme'],
    ['2', 'The Entrance', 'In play, theme 2', 'Carries the tagline at full weight'],
    ['2', 'Monday to Monday', 'Retired', 'Client kept only The Entrance from round 2'],
    ['2', 'Sharp Lines, Wild Heart', 'Retired', 'Client kept only The Entrance from round 2'],
    ['After 2', 'The Entrance with Linear Wilderness merged in', 'On hold, to be undone', 'Client wants the two themes kept separate'],
  ]),
  take: 'Open question: is theme 1 one of its three directions, or the idea on its own?',
});

S.testkit = () => sec({
  id: 'test', label: 'Test kit',
  claim: 'Five minutes with six people who match the buyer will tell us more than another round of options.',
  body: `<div class="nd-cells c2">
      <div><span class="nd-lbl">Who to ask</span><ul class="nd-list">
        <li><b>The engineer</b><span>25 to 28, Bengaluru or Pune, carries the company backpack</span></li>
        <li><b>The traveller</b><span>Consultant or analyst, 27 to 31, flies for work most weeks</span></li>
        <li><b>The stylist</b><span>Startup designer or marketer, 24 to 28, lives on Instagram</span></li>
        <li><b>The newly promoted</b><span>Manager, 30 to 34, promoted in the last year</span></li>
        <li><b>The smart-formal professional</b><span>Finance or law, Delhi NCR; women and men across the group</span></li>
        <li><b>The gift giver</b><span>Spent &#8377;5,000 to &#8377;7,000 on a gift in the last year</span></li>
      </ul></div>
      <div><span class="nd-lbl">What to ask</span><ul class="nd-list">
        <li><b>Show each first screen on a phone for ten seconds</b><span>What kind of brand is this? Would you buy from it?</span></li>
        <li><b>What kind of person carries this bag?</b><span>Listen for &#8220;someone like me&#8221;.</span></li>
        <li><b>Read the tagline aloud</b><span>What does it make you think of?</span></li>
        <li><b>Would you buy it at &#8377;6,000? Would you gift it?</b><span>Note the hesitation, not only the answer.</span></li>
        <li><b>What would stop you buying online?</b><span>This orders the proof points.</span></li>
      </ul></div>
    </div>`,
  take: 'Red flags: &#8220;looks like a travel brand&#8221;, &#8220;my dad&#8217;s bag&#8221;, &#8220;is it real leather?&#8221; asked first.',
});

S.build = () => sec({
  id: 'build', label: 'Files and build',
  claim: 'Every page is generated from one data file and checked by script, so a change lands everywhere at once.',
  body: `<div class="nd-cells c2">
      <div><span class="nd-lbl">Where things are</span>${table(['Item', 'Location'], [
        ['Branch', 'claude/ecstatic-cerf-eqi4ii'],
        ['Round 1 worlds', 'Commit 1d5ff74'],
        ['Round 2 foundation and options', 'Commit 2744842'],
        ['Merged version (on hold)', 'Commit bb939da'],
        ['Handover notes', 'brand-world/HANDOVER.md'],
        ['This explainer', 'brand-world/src/explainer.mjs'],
      ], { reveal: false })}</div>
      <div><span class="nd-lbl">Rules every page follows</span><ul class="nd-list">
        <li>Contrast checked against real pixels: 4.5 for body, 3.0 for display</li>
        <li>No em or en dashes in page copy; tap targets at least 44px</li>
        <li>One self-contained file per page, images and fonts inlined</li>
        <li>Every image labelled: supplied render or drawn stand-in</li>
        <li>Reduced motion respected; ?motion=off and ?motion=force override it</li>
      </ul></div>
    </div>`,
  take: 'Run proof.mjs before anything is shared.',
});

S.decisions = (internal) => sec({
  id: 'decisions', label: 'Decisions',
  claim: `${internal ? 'Eight' : 'Seven'} answers unblock the website.`,
  body: `<ul class="nd-list">
      ${internal ? '<li><b>Theme 1: which direction?</b><span>Field Survey, Quiet Architecture, High Ground, or the Linear Wilderness idea on its own.</span></li>' : ''}
      <li><b>Which wordmark goes on the badges?</b><span>We recommend the drawn one on all six.</span></li>
      <li><b>Is the gold S on every badge?</b><span>A brand mark, or a finish on some bags.</span></li>
      <li><b>Price for custom initials</b><span>Lead time is confirmed at 2 weeks.</span></li>
      <li><b>Real laptop sizes for each bag</b><span>Sample sizes are in place for layout.</span></li>
      <li><b>The returns policy</b><span>A sample policy is in place for layout.</span></li>
      <li><b>Vector logo files</b><span>Needed for the site and anything printed.</span></li>
      <li><b>A photo shoot</b><span>Real bags, Indian cities, Indian models.</span></li>
    </ul>`,
  take: internal ? 'Next: add the new options, measure the reference sites, then design the website.' : 'With these, the website design starts.',
});

S.colophon = () => sec({
  id: 'colophon', label: 'Colophon',
  claim: 'Prepared for Tuskrr by the NoDecks team.',
  body: `<span class="logo" role="img" aria-label="Tuskrr monogram" style="aspect-ratio:450/359;background:var(--nd-text-primary);-webkit-mask:url(${IMG.monogram}) center/contain no-repeat;mask:url(${IMG.monogram}) center/contain no-repeat"></span>
    <p>Consultant: Sovit Biswal<br>consult@nodecks.in<br>+91 8249424199</p>
    <p>Mohd Asad Khan</p>`,
  take: 'Working draft, 28 September 2026.',
});

// ---------- assemble ----------
function build(kind) {
  counter = 0;
  const internal = kind === 'internal';
  const title = internal ? 'Tuskrr brand world: internal' : 'Tuskrr brand world';
  const order = internal
    ? ['premise', 'source', 'findings', 'buyer', 'gift', 'triggers', 'tagline', 'voice', 'linear', 'theme1', 'fs', 'qa', 'hg', 'en', 'compare', 'contrast', 'trust', 'history', 'testkit', 'build', 'decisions', 'colophon']
    : ['premise', 'buyer', 'gift', 'triggers', 'tagline', 'voice', 'linear', 'theme1', 'theme2', 'compare', 'trust', 'decisions', 'colophon'];
  const html = order.map((k) => {
    if (k === 'fs') return dirDetail(DIRS[0], 'field-survey');
    if (k === 'qa') return dirDetail(DIRS[1], 'quiet-architecture');
    if (k === 'hg') return dirDetail(DIRS[2], 'high-ground');
    if (k === 'en') return dirDetail(DIRS[3], 'the-entrance');
    return S[k](internal);
  }).join('\n');

  let t = TEMPLATE.replaceAll('{{DECK_TITLE}}', title);
  t = t.replace(/<link href="https:\/\/fonts\.googleapis\.com\/css2\?family=Space\+Grotesk[^>]*>/, '<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800&display=swap" rel="stylesheet">');
  const a = t.indexOf(':root {'), b = t.indexOf('* { box-sizing');
  t = t.slice(0, a) + GRID_TOKENS + '\n\n' + t.slice(b);
  t = t.replace('</style>', GRID_DEVICES + '\n@media print {' + PRINT_SHARED + '}\n</style>');
  t = t.replace(/<!-- =+\s+SECTION PATTERNS[\s\S]*?=+ -->\n/, `<h1 style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">${esc(title)}</h1>\n` + html + '\n');
  t = t.replace('/* {{VENDORED_MOTION_JS}} */', MOTION);
  t = t.replace('var kids = group.children;', 'var kids = Array.prototype.slice.call(group.children);');
  t = t.replace('</body>', FINALIZE + '\n</body>');
  return { title, html: t };
}

mkdirSync(OUT, { recursive: true });
for (const kind of ['client', 'internal']) {
  const { html } = build(kind);
  const file = join(OUT, `tuskrr-brand-world-grid-${kind}.html`);
  writeFileSync(file, html);
  console.log(file.replace(ROOT + '/', ''), (html.length / 1024).toFixed(0) + ' KB', (html.match(/class="nd-section/g) || []).length, 'sections');
}
