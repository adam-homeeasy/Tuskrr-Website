// Reference pages for the website directions. Nothing here is a website build:
// these pages describe eight directions and the assets each one needs.
// Run: node brand-world/src/directions.mjs
// Writes brand-world/website-directions.html and brand-world/asset-requirements.html.
import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, IMG, FONTS, PRODUCTS, NOT_FINAL, esc, page, lockup, contourSVG, strataSVG } from './shared.mjs';
import { THEMES, DIRECTIONS, ASSETS, ASSET_GROUPS, RULES, SPECS } from './directions-data.mjs';

// ---------- contrast ----------
const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (h) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; const [r, g, b] = rgb(h); return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
export const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
const best = (bg, ...opts) => opts.sort((a, b) => ratio(b, bg) - ratio(a, bg))[0];
const grade = (r) => (r >= 4.5 ? 'text, any size' : r >= 3 ? 'display sizes only' : 'not for text');

// Specimen colours per direction: ground, ink, soft text, accent. Checked below.
const SPEC = {
  reel: { bg: '#131110', ink: '#EFE9E1', soft: '#A39B91', acc: '#D1A650', disp: 'cond' },
  host: { bg: '#131110', ink: '#EFE9E1', soft: '#A39B91', acc: '#C27442', panel: '#1F1B19', disp: 'cond' },
  roster: { bg: '#131110', ink: '#EFE9E1', soft: '#A39B91', acc: '#C27442', disp: 'cond', text: 'mono' },
  outfitter: { bg: '#EFE9E1', ink: '#131110', soft: '#5B544C', acc: '#7E4524', disp: 'cond' },
  readings: { bg: '#121212', ink: '#ECEAE6', soft: '#9C988F', acc: '#C9A24A', disp: 'cond' },
  store: { bg: '#ECE8DF', ink: '#1B1C1A', soft: '#2E4A4D', acc: '#8A4722', disp: 'archivo' },
  pressed: { bg: '#F6F3EC', ink: '#1B1C1A', soft: '#2E4A4D', acc: '#2E4A4D', disp: 'archivo' },
  kit: { bg: '#EBDDC7', ink: '#221610', soft: '#4A3527', acc: '#A2432A', disp: 'serif', text: 'hanken' },
};
for (const [id, s] of Object.entries(SPEC)) {
  for (const k of ['ink', 'soft']) if (ratio(s[k], s.bg) < 4.5) throw new Error(`${id} ${k} fails on ground`);
  s.onAcc = best(s.acc, s.bg, s.ink, '#FFFFFF', '#131110');
  if (ratio(s.onAcc, s.acc) < 4.5) throw new Error(`${id} button text fails`);
}

const FAM = {
  cond: "'Instrument Sans',system-ui,sans-serif;font-stretch:75%;text-transform:uppercase;font-weight:600;letter-spacing:.01em",
  archivo: "'Archivo',system-ui,sans-serif;font-stretch:62%;text-transform:uppercase;font-weight:700",
  serif: "'Instrument Serif',Georgia,serif;font-weight:400",
  text: "'Instrument Sans',system-ui,sans-serif",
  mono: "'IBM Plex Mono',ui-monospace,monospace",
  hanken: "'Hanken Grotesk',system-ui,sans-serif",
};

// ---------- page chrome ----------
const C = { paper: '#F2EFE9', card: '#FBFAF7', ink: '#171512', muted: '#57524A', rule: '#D5CFC4', acc: '#8A4722', night: '#131110', bone: '#EFE9E1', smoke: '#A39B91', brass: '#D1A650' };

const CSS = `
:root{--paper:${C.paper};--card:${C.card};--ink:${C.ink};--muted:${C.muted};--rule:${C.rule};--acc:${C.acc};--night:${C.night};--bone:${C.bone};--smoke:${C.smoke};--brass:${C.brass}}
body{background:var(--paper);color:var(--ink);font:400 16px/1.55 ${FAM.text}}
.wrap{max-width:1240px;margin:0 auto;padding:0 20px}
@media (min-width:900px){.wrap{padding:0 40px}}
.mono{font-family:${FAM.mono};font-size:13px;letter-spacing:.06em;text-transform:uppercase}
.cond{font-family:${FAM.cond}}
h1,h2,h3{font-weight:600;line-height:1.05}
h2{font-family:${FAM.cond};font-size:clamp(34px,6vw,64px)}
h3{font-size:20px;line-height:1.25;margin-bottom:10px}
p+p{margin-top:.8em}
.muted{color:var(--muted)}
/* header */
.top{background:var(--night);color:var(--bone);padding:28px 0 56px;position:relative;overflow:hidden}
.top .bar{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap}
.top .lockup{font-size:22px;color:var(--bone)}
.top .mono{color:var(--smoke)}
.top h1{font-family:${FAM.cond};font-size:clamp(52px,11vw,150px);letter-spacing:.005em;margin:56px 0 18px;max-width:11ch}
.top .lede{font-size:clamp(18px,2.2vw,22px);max-width:40ch;color:var(--bone)}
.top .lede em{font-style:normal;color:var(--brass)}
.top svg.bg{position:absolute;inset:auto -10% -30% auto;width:70%;opacity:.16;pointer-events:none}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:28px}
.chip{border:1px solid currentColor;border-radius:99px;padding:6px 12px;font-family:${FAM.mono};font-size:13px;letter-spacing:.04em}
.top .chip{color:var(--smoke)}
/* nav buttons */
.btn{display:inline-flex;align-items:center;gap:10px;min-height:44px;min-width:44px;padding:10px 16px;border:1px solid currentColor;border-radius:2px;text-decoration:none;font-weight:600}
.btn:hover{background:var(--ink);color:var(--paper)}
.top .btn{color:var(--bone)}
.top .btn:hover{background:var(--bone);color:var(--night)}
/* sections */
section.block{padding:64px 0;border-top:1px solid var(--rule)}
.eyebrow{font-family:${FAM.mono};font-size:13px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}
.grid2{display:grid;gap:28px}
@media (min-width:900px){.grid2{grid-template-columns:1fr 1fr;gap:40px}}
.grid3{display:grid;gap:18px}
@media (min-width:760px){.grid3{grid-template-columns:repeat(3,1fr)}}
.card{background:var(--card);border:1px solid var(--rule);padding:20px}
ul.list li{padding:8px 0 8px 22px;position:relative;border-bottom:1px solid var(--rule)}
ul.list li:last-child{border-bottom:0}
ul.list li::before{content:"";position:absolute;left:2px;top:19px;width:10px;height:1px;background:var(--acc)}
ul.list.no li::before{background:var(--muted);width:8px;height:8px;border-radius:50%;top:15px;opacity:.5}
dl.facts{display:grid;grid-template-columns:1fr;gap:0}
dl.facts>div{display:grid;grid-template-columns:1fr;gap:2px;padding:10px 0;border-bottom:1px solid var(--rule)}
@media (min-width:560px){dl.facts>div{grid-template-columns:150px 1fr;gap:16px}}
dl.facts dt{font-family:${FAM.mono};font-size:13px;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);padding-top:2px}
.callout{border-left:3px solid var(--acc);background:var(--card);padding:18px 20px;margin-top:22px}
.callout strong{display:block;margin-bottom:4px}
/* swatches */
.sw{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:10px}
.sw figure{background:var(--card);border:1px solid var(--rule)}
.sw i{display:block;height:64px;border-bottom:1px solid var(--rule)}
.sw figcaption{padding:8px 10px;font-size:13px;line-height:1.35}
.sw b{display:block;font-size:14px}
.sw .mono{font-size:12px;color:var(--muted);text-transform:none;letter-spacing:.02em}
.footer{background:var(--night);color:var(--bone);padding:48px 0 64px}
.footer .muted{color:var(--smoke)}
.footer ol{counter-reset:n}
.footer li{counter-increment:n;padding:8px 0 8px 36px;position:relative;border-bottom:1px solid #2c2724;max-width:80ch}
.footer li::before{content:counter(n,decimal-leading-zero);position:absolute;left:0;font-family:${FAM.mono};font-size:13px;color:var(--brass);top:10px}
.footer .btn{color:var(--bone);margin-top:24px}
.footer .btn:hover{background:var(--bone);color:var(--night)}
.thumbs{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.thumbs figure{background:#fff;border:1px solid var(--rule)}
.thumbs img{width:100%;aspect-ratio:4/5;object-fit:contain;background:#EEEDEA}
.thumbs figcaption{padding:8px 10px;font-size:13px;line-height:1.35}
.thumbs figcaption span{display:block;color:var(--muted);font-family:${FAM.mono};font-size:12px}
.tag{display:inline-block;font-family:${FAM.mono};font-size:12px;letter-spacing:.05em;text-transform:uppercase;padding:3px 8px;border:1px solid var(--rule);background:var(--card);color:var(--ink);white-space:nowrap}
.tag.must{background:var(--ink);color:var(--paper);border-color:var(--ink)}
.tag.have{background:#E3EBDF;border-color:#B9CBB0;color:#1F3A1A}
.tag.partial{background:#F3E6CF;border-color:#D9C08E;color:#4A3208}
.tag.need{background:#F2DCD3;border-color:#D7A995;color:#5A1E0B}
`;

const tagFor = (s) => `<span class="tag ${s}">${{ have: 'Have', partial: 'Partial', need: 'Need' }[s]}</span>`;
const byId = Object.fromEntries(ASSETS.map((a) => [a.id, a]));
const THUMBS = PRODUCTS.map((p) => ({ id: p.id, name: p.name, type: p.type, src: IMG[p.id] }));

function header({ title, lede, chips, links }) {
  return `<header class="top"><div class="wrap">
<div class="bar">${lockup()}<span class="mono">Website directions, reference only</span></div>
<h1 data-r>${title}</h1>
<p class="lede" data-r>${lede}</p>
<div class="chips" data-r>${chips.map((c) => `<span class="chip">${esc(c)}</span>`).join('')}</div>
<div class="chips" data-r>${links.map(([h, t]) => `<a class="btn" href="${h}">${esc(t)}</a>`).join('')}</div>
</div>${contourSVG({ seed: 21, levels: 12 }, 'bg')}</header>`;
}

function footer(extra) {
  return `<footer class="footer"><div class="wrap">
<p class="eyebrow" style="color:var(--smoke)">Not final</p>
<h2 style="margin-bottom:22px">What is still open</h2>
<ol>${[...extra, ...NOT_FINAL].map((n) => `<li>${esc(n)}</li>`).join('')}</ol>
</div></footer>`;
}

const FOOT_EXTRA = [
  'Nothing on this page is built. These are directions to choose from; the website is built only after you say go.',
  'Reference numbers come from reading each site’s shipped code (see brand-world/references/DNA.md). A live browser pass could not run in this session, so reveal travel and blur on reveals are not measured. Brunello Cucinelli blocked automated reading, so its direction uses our own motion numbers.',
  'Open from the handover: is the Linear Wilderness theme one of the round 1 worlds (Field Survey, Quiet Architecture, High Ground) or the idea on its own?',
];

// ---------- phone wireframe ----------
function phone(title, blocks, s) {
  const fill = { dark: s.bg, light: '#F7F5F1', accent: s.acc, media: 'repeating-linear-gradient(135deg,#CFC9BF 0 6px,#DDD8CF 6px 12px)' };
  const edge = { dark: s.bg, light: '#E4DFD6', accent: s.acc, media: '#CFC9BF' };
  return `<figure class="ph"><figcaption class="mono">${esc(title)}</figcaption><div class="ph-body">${blocks.map(([label, tone, h]) => `<div class="ph-b" style="height:${h * 22}px;background:${fill[tone]};border-color:${edge[tone]}"><span>${esc(label)}</span></div>`).join('')}</div></figure>`;
}
const PHONE_CSS = `
.phones{display:flex;flex-wrap:wrap;gap:18px}
.ph{width:min(100%,230px)}
.ph figcaption{color:var(--muted);margin-bottom:8px}
.ph-body{border:1px solid var(--ink);border-radius:22px;padding:14px 8px 18px;background:var(--card)}
.ph-b{border:1px solid;margin-bottom:4px;position:relative;display:flex;align-items:flex-end;padding:5px}
.ph-b span{background:var(--card);color:var(--ink);font-size:12px;line-height:1.3;padding:3px 6px;max-width:100%}
`;

// ---------- library page ----------
function themeCards() {
  const ent = THEMES.entrance, wild = THEMES.wilderness;
  const sw = (list, ground) => `<div class="sw">${list.map(([n, h]) => { const r = ratio(h, ground); return `<figure><i style="background:${h}"></i><figcaption><b>${esc(n)}</b><span class="mono">${h}${h.toLowerCase() === ground.toLowerCase() ? ' ground' : ` ${r.toFixed(1)}:1`}</span></figcaption></figure>`; }).join('')}</div>`;
  const count = (t) => DIRECTIONS.filter((d) => d.theme === t).map((d) => d.n).join(', ');
  return `<section class="block" id="themes"><div class="wrap">
<p class="eyebrow">Two themes, kept separate</p>
<h2 data-r>Every direction runs on one theme</h2>
<p class="muted" style="max-width:62ch;margin:14px 0 30px" data-r>The handover rule stands: the themes are not merged. Four directions run on The Entrance and four on Linear Wilderness. Ratios on the swatches are against the theme’s main ground.</p>
<div class="grid2">
<div class="card" data-r><p class="eyebrow">${esc(ent.source)}</p><h3 class="cond" style="font-size:36px">${esc(ent.name)}</h3><p style="margin-bottom:16px">${esc(ent.idea)}</p>${sw(ent.palette, '#131110')}<p class="muted" style="margin-top:14px">Type: ${esc(ent.type)}. Directions ${count('entrance')}.</p></div>
<div class="card" data-r><p class="eyebrow">${esc(wild.source)}</p><h3 class="cond" style="font-size:36px">${esc(wild.name)}</h3><p style="margin-bottom:16px">${esc(wild.idea)}</p>
${Object.values(wild.worlds).map((w) => `<p class="mono" style="margin:14px 0 8px">${esc(w.name)}. ${esc(w.type)}</p>${sw(w.palette, w.palette[0][1])}`).join('')}
<p class="muted" style="margin-top:14px">Directions ${count('wilderness')}.</p></div>
</div>
<div class="callout" data-r><strong>Open question</strong>${esc(wild.open)}</div>
</div></section>`;
}

function index() {
  const groups = [['entrance', 'The Entrance'], ['wilderness', 'Linear Wilderness']];
  return `<section class="block" id="index"><div class="wrap">
<p class="eyebrow">The library</p>
<h2 data-r>Eight directions</h2>
${groups.map(([t, name]) => `<p class="mono" style="margin:34px 0 12px">${name}</p><div class="idx">${DIRECTIONS.filter((d) => d.theme === t).map((d) => {
    const s = SPEC[d.id];
    return `<a class="ix" href="#d-${d.id}" data-r style="--bg:${s.bg};--fg:${s.ink};--sf:${s.soft}"><span class="mono">${d.n}</span><b class="ix-name" style="font-family:${FAM[s.disp]}">${esc(d.name)}</b><span class="ix-ref">From ${esc(d.ref.name)}</span><span class="ix-line">${esc(d.line)}</span></a>`;
  }).join('')}</div>`).join('')}
</div></section>`;
}
const IDX_CSS = `
.idx{display:grid;gap:12px}
@media (min-width:700px){.idx{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1100px){.idx{grid-template-columns:repeat(4,1fr)}}
.ix{display:flex;flex-direction:column;gap:8px;min-height:230px;padding:18px;background:var(--bg);color:var(--fg);text-decoration:none;border:1px solid var(--rule)}
.ix .mono{color:var(--sf)}
.ix-name{font-size:34px;line-height:1}
.ix-ref{font-size:14px;color:var(--sf)}
.ix-line{font-size:15px;line-height:1.45;margin-top:auto}
.ix:hover{outline:2px solid var(--acc);outline-offset:2px}
`;

function direction(d) {
  const s = SPEC[d.id];
  const theme = THEMES[d.theme];
  const world = d.world ? THEMES.wilderness.worlds[d.world] : null;
  const pal = d.how.palette.use;
  const ground = pal[0][1];
  const swatches = `<div class="sw">${pal.map(([n, h, role]) => {
    const isHex = /^#/.test(h);
    const r = isHex ? ratio(h, ground) : null;
    const noText = /never text|only/i.test(role);
    const note = !isHex ? 'Per section' : h === ground ? '' : `${r.toFixed(1)}:1 on ${pal[0][0]}${noText ? '' : `, ${grade(r)}`}`;
    return `<figure><i style="background:${isHex ? h : 'linear-gradient(90deg,#8A4722,#C27442,#1B1C1A,#9E3B2A,#B0703E,#1E2B44)'}"></i><figcaption><b>${esc(n)}</b><span class="mono">${isHex ? h : ''}</span><span class="muted" style="display:block">${esc(role)}</span><span class="mono">${esc(note)}</span></figcaption></figure>`;
  }).join('')}</div>`;
  const hero = d.how.voice[0][1];
  const second = d.how.voice[1] ? d.how.voice[1][1] : '';
  const textFam = FAM[s.text || 'text'];
  const specimen = `<div class="spec" style="background:${s.bg};color:${s.ink}">
<div class="spec-top"><span class="mono" style="color:${s.soft}">${esc(d.name)}, specimen</span></div>
<p class="spec-h" style="font-family:${FAM[s.disp]}">${esc(hero)}</p>
<p class="spec-t" style="font-family:${textFam};color:${s.soft}">${esc(second)}</p>
<span class="spec-btn" style="background:${s.acc};color:${s.onAcc};font-family:${textFam}">${d.theme === 'entrance' ? 'Shop the six' : 'See the bags'}</span>
<p class="mono" style="color:${s.soft};margin-top:18px;text-transform:none">Display: ${esc(d.how.type.display)}. Text: ${esc(d.how.type.text)}. Button text ${ratio(s.onAcc, s.acc).toFixed(1)}:1, body ${ratio(s.soft, s.bg).toFixed(1)}:1.</p>
</div>`;
  const assetRows = Object.entries(d.use).map(([id, pr]) => {
    const a = byId[id];
    return `<div class="ar"><span class="mono">${id}</span><div><b>${esc(a.name)}</b><span class="muted">${esc(a.count)}. ${esc(a.spec)}</span></div><div class="ar-tags"><span class="tag ${pr === 'must' ? 'must' : ''}">${pr === 'must' ? 'Must' : 'Nice'}</span>${tagFor(a.status)}</div></div>`;
  }).join('');
  const nImg = Object.keys(d.use).filter((k) => /^[SPI]/.test(k)).length;
  const nVid = Object.keys(d.use).filter((k) => /^V/.test(k)).length;
  return `<section class="block dir" id="d-${d.id}"><div class="wrap">
<div class="dir-head">
<div><p class="eyebrow">Direction ${d.n} · ${esc(theme.name)}${world ? `, ${esc(world.name)} palette` : ''}</p>
<h2 data-r style="font-size:clamp(44px,8vw,96px)">${esc(d.name)}</h2>
<p class="dir-line" data-r>${esc(d.line)}</p></div>
<div class="card dir-ref" data-r><p class="eyebrow">Reference</p><h3>${esc(d.ref.name)}</h3><p class="muted">${esc(d.ref.what)}</p><a class="btn" href="${d.ref.url}" rel="noopener" target="_blank">Open the reference site</a></div>
</div>

<div class="grid2" style="margin-top:40px">
<div data-r><h3>The reference, measured</h3><dl class="facts">${d.measured.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
<div data-r><h3>What we take</h3><ul class="list">${d.take.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
<h3 style="margin-top:26px">What we leave</h3><ul class="list no">${d.leave.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
</div>

<h3 style="margin-top:48px" data-r>How the Tuskrr brand world is used</h3>
<div class="grid2">
<div data-r>${specimen}</div>
<div data-r><dl class="facts">
<div><dt>Theme</dt><dd>${esc(theme.name)}${world ? `, with the ${esc(world.name)} palette and type from round 1` : ''}</dd></div>
<div><dt>Type</dt><dd>${esc(d.how.type.note)}</dd></div>
<div><dt>Logo</dt><dd>${esc(d.how.logo)}</dd></div>
<div><dt>Device</dt><dd>${esc(d.how.device)}</dd></div>
<div><dt>Products</dt><dd>${esc(d.how.products)}</dd></div>
<div><dt>Reused now</dt><dd>${esc(d.reuse.join('. '))}.</dd></div>
</dl></div>
</div>
<p class="mono" style="margin:28px 0 12px">Palette in use</p>
${swatches}

<div class="grid2" style="margin-top:40px">
<div data-r><h3>Voice samples</h3><dl class="facts">${d.how.voice.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
<div data-r><h3>Motion contract</h3><dl class="facts">${d.motion.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
</div>

<h3 style="margin-top:48px" data-r>Page structure, on the phone</h3>
<div class="phones" data-r>${phone('Home', d.structure.home, s)}${phone('Product page', d.structure.pdp, s)}</div>
<p class="muted" style="margin-top:12px;font-size:14px">Striped blocks are photography or video. Solid blocks take the direction’s ground or accent.</p>

<h3 style="margin-top:48px" data-r>Assets this direction needs</h3>
<p class="muted" style="margin-bottom:14px">${Object.values(d.use).filter((p) => p === 'must').length} must-haves, ${Object.values(d.use).filter((p) => p === 'nice').length} nice-to-haves. ${nImg} photo or drawing sets, ${nVid} video sets. Full specs on the asset page.</p>
<div class="assets">${assetRows}</div>

<div class="card" style="margin-top:28px" data-r><h3>Watch</h3><ul class="list no">${d.watch.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>
</div></section>`;
}
const DIR_CSS = `
.dir-head{display:grid;gap:24px;align-items:end}
@media (min-width:900px){.dir-head{grid-template-columns:1.6fr 1fr}}
.dir-line{font-size:clamp(18px,2vw,21px);max-width:46ch;margin-top:14px}
.dir-ref .btn{margin-top:14px}
.spec{padding:26px 22px;min-height:300px;display:flex;flex-direction:column;gap:12px}
.spec-top{display:flex;justify-content:space-between}
.spec-h{font-size:clamp(38px,5.5vw,62px);line-height:.98}
.spec-t{font-size:18px;line-height:1.45;max-width:36ch}
.spec-btn{align-self:flex-start;padding:12px 18px;font-weight:600;font-size:16px}
.assets{border-top:1px solid var(--rule)}
.ar{display:grid;grid-template-columns:44px 1fr;gap:8px 12px;padding:12px 0;border-bottom:1px solid var(--rule)}
.ar b{display:block}
.ar .muted{display:block;font-size:14px;line-height:1.45}
.ar-tags{grid-column:2;display:flex;gap:6px;flex-wrap:wrap}
@media (min-width:760px){.ar{grid-template-columns:52px 1fr 170px}.ar-tags{grid-column:auto;justify-content:flex-end;align-items:flex-start}}
`;

export function renderLibrary() {
  const body = `${header({
    title: 'Website directions',
    lede: 'Eight directions for the Tuskrr website, one for each reference site, each running on <em>one</em> theme. Nothing is built yet.',
    chips: ['8 references', '8 directions', '2 themes, not merged', 'Read 28 Sep 2026'],
    links: [['#index', 'Jump to the library'], ['asset-requirements.html', 'Assets and requirements']],
  })}
<main>
<section class="block" style="border-top:0"><div class="wrap grid2">
<div data-r><p class="eyebrow">How to read this</p><h2>Take the pacing, not the look</h2>
<p style="margin-top:16px;max-width:52ch">Each reference was read from its own code: its easing curves, timings, grid, type scale and colour tokens. Each direction then keeps the structure and pacing that suit Tuskrr and rebuilds everything else from the brand world: the tagline, the six product stories, one theme’s palette and type, and the logo.</p>
<p class="muted" style="max-width:52ch">For every direction you get the measured reference, what we take and leave, how the brand world is used, voice samples, a motion contract, a phone wireframe, and the full list of photos, videos and facts it needs.</p></div>
<div data-r><p class="eyebrow">Rules every direction keeps</p><ul class="list">${RULES.map((r) => `<li>${esc(r)}</li>`).join('')}</ul></div>
</div></section>
${themeCards()}
${index()}
${DIRECTIONS.map(direction).join('\n')}
</main>
${footer(FOOT_EXTRA)}`;
  return page({
    title: 'Tuskrr website directions',
    description: 'Eight website directions for Tuskrr, one per reference site, with the brand world use and assets each needs.',
    css: CSS + PHONE_CSS + IDX_CSS + DIR_CSS,
    fonts: FONTS.instrumentSans + FONTS.plexMono + FONTS.archivo + FONTS.instrumentSerif + FONTS.hanken,
    body,
  });
}

// ---------- asset page ----------
const MATRIX_CSS = `
.scroll{overflow-x:auto;border:1px solid var(--rule);background:var(--card)}
table.mx{border-collapse:collapse;width:100%;min-width:760px;font-size:14px}
.mx th,.mx td{padding:10px 8px;border-bottom:1px solid var(--rule);text-align:center;vertical-align:top}
.mx th:first-child,.mx td:first-child{text-align:left;min-width:220px}
.mx thead th{font-family:${FAM.mono};font-size:12px;letter-spacing:.04em;text-transform:uppercase;color:var(--muted);font-weight:500}
.mx thead th b{display:block;color:var(--ink);font-family:${FAM.text};text-transform:none;letter-spacing:0;font-size:13px}
.mx tr.grp td{background:var(--paper);font-family:${FAM.mono};font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);text-align:left}
.dot{display:inline-block;width:14px;height:14px;border-radius:50%;border:2px solid var(--ink)}
.dot.m{background:var(--ink)}
.stat{display:flex;flex-direction:column;gap:4px}
.stat b{font-family:${FAM.cond};font-size:64px;line-height:1}
.cat{display:grid;gap:12px}
@media (min-width:760px){.cat{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1100px){.cat{grid-template-columns:repeat(3,1fr)}}
.cat .card{display:flex;flex-direction:column;gap:8px}
.cat .card .row{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.cat .card p{font-size:15px}
.cat .card .have{font-size:14px;color:var(--muted)}
.plan{display:grid;gap:12px}
@media (min-width:900px){.plan{grid-template-columns:repeat(2,1fr)}}
`;

export function renderAssets() {
  const used = (id) => DIRECTIONS.filter((d) => d.use[id]);
  const mustAll = ASSETS.filter((a) => DIRECTIONS.every((d) => d.use[a.id] === 'must'));
  const vids = DIRECTIONS.map((d) => [d, Object.entries(d.use).filter(([k, v]) => k[0] === 'V' && v === 'must').length]);
  const most = vids.reduce((a, b) => (b[1] > a[1] ? b : a));
  const none = vids.filter(([, n]) => n === 0).map(([d]) => d.n);
  const vidNote = `Direction ${most[0].n} needs the most film (${most[1]} must-have sets); ${none.join(' and ')} need no must-have video.`;
  const counts = { have: 0, partial: 0, need: 0 };
  ASSETS.forEach((a) => counts[a.status]++);
  const matrix = `<div class="scroll" data-r><table class="mx"><thead><tr><th>Asset</th>${DIRECTIONS.map((d) => `<th>${d.n}<b>${esc(d.name)}</b></th>`).join('')}<th>Needed by</th><th>Status</th></tr></thead><tbody>
${ASSET_GROUPS.map(([g, gname]) => `<tr class="grp"><td colspan="${DIRECTIONS.length + 3}">${gname}</td></tr>${ASSETS.filter((a) => a.g === g).map((a) => `<tr><td><span class="mono" style="color:var(--muted)">${a.id}</span> ${esc(a.name)}</td>${DIRECTIONS.map((d) => { const u = d.use[a.id]; return `<td>${u ? `<span class="dot ${u === 'must' ? 'm' : ''}" role="img" aria-label="${u === 'must' ? 'Must' : 'Nice to have'}"></span>` : ''}</td>`; }).join('')}<td>${used(a.id).length}</td><td>${tagFor(a.status)}</td></tr>`).join('')}`).join('')}
</tbody></table></div>
<p class="muted" style="margin-top:10px;font-size:14px"><span class="dot m" style="vertical-align:-2px"></span> must have <span class="dot" style="vertical-align:-2px;margin-left:12px"></span> nice to have. Scroll sideways on a phone.</p>`;

  const catalogue = ASSET_GROUPS.map(([g, gname]) => `<p class="mono" style="margin:34px 0 12px">${gname}</p><div class="cat">${ASSETS.filter((a) => a.g === g).map((a) => {
    const ds = used(a.id);
    return `<div class="card" id="a-${a.id}" data-r><div class="row"><span class="mono" style="color:var(--muted)">${a.id}</span>${tagFor(a.status)}<span class="tag">${esc(a.count)}</span></div><h3 style="margin:0">${esc(a.name)}</h3><p>${esc(a.spec)}</p><p class="have">Now: ${esc(a.have)}</p><p class="have">Used by: ${ds.length ? ds.map((d) => `${d.n} ${esc(d.name)}${d.use[a.id] === 'nice' ? ' (nice)' : ''}`).join(', ') : 'none yet'}</p></div>`;
  }).join('')}</div>`).join('');

  const planBlocks = [
    ['Studio', 'One set, one light plan, colour card in every frame. Cover the whole product range in one pass so any direction can be built from it.', ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8']],
    ['People and cities', 'Indian cast aged 24 to 34, shot in Bengaluru, Mumbai or Delhi NCR. Book the street cast for The Roster separately from agency models.', ['P1', 'P2', 'P3', 'P4', 'P5', 'P6']],
    ['Motion', 'Shoot loops on the studio and city days where possible. The brand film and landscape loops are their own productions.', ['V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7']],
    ['Drawing', 'One illustrator for all sketches so the hand is consistent. Preloader frames are cut from the studio set.', ['I1', 'I2', 'B4']],
    ['From Tuskrr', 'Facts and decisions only Tuskrr can give. These block every direction, so they come first.', ['B1', 'B5', 'F1', 'F2', 'F3', 'F4', 'F5']],
  ];
  const plan = `<div class="plan">${planBlocks.map(([t, p, ids]) => {
    const dirs = DIRECTIONS.filter((d) => ids.some((i) => d.use[i]));
    return `<div class="card" data-r><h3>${t}</h3><p>${esc(p)}</p><dl class="facts" style="margin-top:12px">${ids.map((i) => `<div><dt>${i}</dt><dd>${esc(byId[i].name)}, ${esc(byId[i].count)}</dd></div>`).join('')}</dl><p class="muted" style="margin-top:10px;font-size:14px">Needed by ${dirs.length} of 8 directions.</p></div>`;
  }).join('')}</div>`;

  const body = `${header({
    title: 'Assets and requirements',
    lede: 'Every photo, video, drawing and fact the eight directions need, what exists today, and the spec to shoot and deliver to.',
    chips: [`${ASSETS.length} asset sets`, `${counts.have} have`, `${counts.partial} partial`, `${counts.need} to make`],
    links: [['website-directions.html', 'Back to the directions'], ['#matrix', 'Jump to the matrix']],
  })}
<main>
<section class="block" style="border-top:0"><div class="wrap">
<div class="grid3">
<div class="card stat" data-r><b>${mustAll.length}</b><span>asset sets every direction needs, whichever you choose: ${mustAll.map((a) => esc(a.name.toLowerCase())).join(', ')}.</span></div>
<div class="card stat" data-r><b>${ASSETS.filter((a) => a.g === 'video').length}</b><span>video sets across the library. ${vidNote}</span></div>
<div class="card stat" data-r><b>${counts.have}</b><span>sets are ready today: ${ASSETS.filter((a) => a.status === 'have').map((a) => esc(a.name.toLowerCase())).join(' and ')}. Everything else is partial or still to make.</span></div>
</div>
</div></section>

<section class="block"><div class="wrap">
<p class="eyebrow">What exists today</p>
<h2 data-r>The supplied files</h2>
<p class="muted" style="max-width:62ch;margin:14px 0 24px" data-r>Six product renders and the logo, supplied as JPEGs. They are fine as placeholders on these pages, but too small for a website: the largest is 1280px wide and a hero image needs 2048px or more. Each bag needs a full packshot set (S1) before any direction can launch.</p>
<div class="thumbs" data-r>${THUMBS.map((t) => `<figure><img src="${t.src}" alt="${esc(t.name)}, ${esc(t.type.toLowerCase())}, supplied render" loading="lazy"><figcaption><b>${esc(t.name)}</b><span>Supplied render</span></figcaption></figure>`).join('')}</div>
</div></section>

<section class="block" id="matrix"><div class="wrap">
<p class="eyebrow">Matrix</p>
<h2 data-r>Which direction needs what</h2>
<p class="muted" style="max-width:62ch;margin:14px 0 24px" data-r>Rows are asset sets, columns are the eight directions. Choosing a direction means shooting its column; choosing two means shooting both, and the overlap is large.</p>
${matrix}
</div></section>

<section class="block"><div class="wrap">
<p class="eyebrow">Production</p>
<h2 data-r>How it groups into shoots</h2>
<p class="muted" style="max-width:62ch;margin:14px 0 24px" data-r>No costs here: those depend on which directions you pick. This is only how the work falls together.</p>
${plan}
</div></section>

<section class="block"><div class="wrap">
<p class="eyebrow">Catalogue</p>
<h2 data-r>Every asset set, specified</h2>
${catalogue}
</div></section>

<section class="block"><div class="wrap grid2">
<div data-r><p class="eyebrow">Delivery</p><h2>File specs</h2><dl class="facts" style="margin-top:18px">${SPECS.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl></div>
<div data-r><p class="eyebrow">Rights and rules</p><h2>Before anything is shot</h2><ul class="list" style="margin-top:18px">
<li>No stock photos or stock footage in any direction. Landscape loops are shot by us in India.</li>
<li>The moodboard photos in the product PDF are reference only; we do not hold their rights.</li>
<li>Reference sites are studied for structure and pacing only. None of their images, fonts, code or copy is used.</li>
<li>Label every image until the shoot lands: "Supplied render" or "Drawn stand-in".</li>
<li>Signed releases for every person and every location, including the street cast.</li>
<li>Leather colour must match the real hide. Shoot a colour card with every setup.</li>
</ul></div>
</div></section>
</main>
${footer(FOOT_EXTRA)}`;
  return page({
    title: 'Tuskrr assets and requirements',
    description: 'Every photo, video, drawing and fact the Tuskrr website directions need, with specs and a direction matrix.',
    css: CSS + MATRIX_CSS,
    fonts: FONTS.instrumentSans + FONTS.plexMono,
    body,
  });
}

if (import.meta.url === `file://${process.argv[1]}`) {
  for (const [file, html] of [['website-directions.html', renderLibrary()], ['asset-requirements.html', renderAssets()]]) {
    writeFileSync(join(ROOT, file), html);
    console.log(file, (html.length / 1024).toFixed(0) + ' KB');
  }
}
