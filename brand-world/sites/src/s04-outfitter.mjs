// Direction 04, The Outfitter (The Entrance, daylight). Reference: Ströms.
// A calm, well-run shop: service promises first, shop by occasion, edits,
// 4:5 portrait photography throughout.
import { BAGS, PROOF, TAGLINE, FONTS, esc, video, photo, sitePage, footNotes } from './kit.mjs';
import { wordmark } from '../../src/shared.mjs';

const C = { bone: '#EFE9E1', paper: '#F8F5F0', night: '#131110', saddle: '#7E4524', soft: '#5B544C', cognac: '#C27442', rule: '#D9D0C4' };
const EASE = 'ease-in-out';
const OCC = { ridge: ['workday', 'weekend'], traverse: ['flight', 'weekend'], strata: ['workday', 'gift'], crest: ['weekend', 'workday'], axis: ['weekend', 'flight'], contour: ['workday', 'gift'] };
const TILES = [['workday', 'For the workday', 'office-0'], ['weekend', 'For the weekend', 'hikers-0'], ['flight', 'For the flight', 'boarding-0'], ['gift', 'For someone else', 'gift-box-0']];

export function build() {
  const grid = BAGS.map((b) => `<article class="pc" data-occ="${OCC[b.id].join(' ')}" data-r>
<div class="pc-img"><div class="mv mv-render"><img class="mv-v" src="${b.img}" alt="${esc(b.name)}, ${esc(b.type.toLowerCase())}, ${esc(b.finish.toLowerCase())}" decoding="async"><span class="tagx">Supplied render</span></div></div>
<div class="pc-b"><p class="pc-n">${esc(b.name)}</p><p class="pc-t">${esc(b.type)} · ${esc(b.finish)}</p><p class="pc-l">${esc(b.line)}</p>
<p class="pc-p">${b.priceText} <span>sample price</span></p><button class="btn btn-night" data-add="${esc(b.name)}">Add to bag</button></div></article>`).join('');
  const edit = ['ridge', 'traverse', 'axis'].map((id) => BAGS.find((b) => b.id === id));
  const body = `
<div class="svc" role="note">${PROOF.map((p) => `<span>${esc(p)}</span>`).join('<i aria-hidden="true">·</i>')}</div>
<header class="top"><nav class="nav" aria-label="Sections"><a href="#shop">Shop</a><a href="#occasions">Occasions</a><a href="#edit">The Cognac Edit</a><a href="#gifting">Gifting</a></nav>
<a class="logo" href="#top" aria-label="Tuskrr, home">${wordmark('wm')}</a>
<a class="bagcount" href="#shop" aria-label="Bag">Bag (<span data-count>0</span>)</a></header>
<main id="top">
<section class="hero">
<div class="h-a" data-r>${video('bw-walk', { cls: 'fill', alt: 'A young professional walks to work.' })}</div>
<div class="h-b">${photo('bw-work-1', 'Working outdoors with a laptop.', { cls: 'fill h-b-img' })}
<div class="h-card" data-r><p class="kick">Autumn, in Bengaluru and Mumbai</p><h1 class="cond h-h">${esc(TAGLINE)}</h1><p class="h-s">Six leather bags for the working day, and every day after it.</p><div class="row"><a class="btn btn-night" href="#shop">Shop the six</a><a class="btn btn-ghost" href="#edit">The Cognac Edit</a></div></div></div>
</section>

<section class="occ" id="occasions"><div class="sh"><h2 class="cond s-h" data-r>Shop by occasion</h2><p class="s-s" data-r>Start from where you are going.</p></div>
<div class="tiles">${TILES.map(([k, t, img]) => `<a class="tile" href="#shop" data-go="${k}" data-r>${photo(img, '', { cls: 'tile-img' })}<span class="tile-t">${esc(t)} <b aria-hidden="true">→</b></span></a>`).join('')}</div></section>

<section class="shop" id="shop"><div class="sh"><h2 class="cond s-h" data-r>The six</h2>
<div class="chips" role="group" aria-label="Filter by occasion"><button class="chip on" data-f="all" aria-pressed="true">All</button>${TILES.map(([k, t]) => `<button class="chip" data-f="${k}" aria-pressed="false">${esc({ workday: 'Workday', weekend: 'Weekend', flight: 'Flight', gift: 'Gift' }[k])}</button>`).join('')}</div></div>
<div class="grid">${grid}</div></section>

<section class="edit" id="edit">
<div class="e-media" data-r>${video('leather', { cls: 'fill', alt: 'Brown leather, close up.' })}</div>
<div class="e-t"><p class="kick" data-r>The edit</p><h2 class="cond e-h" data-r>The Cognac Edit</h2><p class="e-s" data-r>Three bags that go with everything you already own. Cognac leather darkens as you carry it, so yours ends up like nobody else’s.</p>
<div class="e-g">${edit.map((b) => `<a class="e-c" href="#shop" data-r><img src="${b.img}" alt="${esc(b.name)}" decoding="async"><span><b>${esc(b.name)}</b>${b.priceText}</span></a>`).join('')}</div></div>
</section>

<section class="gift" id="gifting"><div class="g-img" data-r>${photo('gift-0', 'A gift box being opened.', { cls: 'fill' })}</div>
<div class="g-t"><p class="kick" data-r>Gifting</p><h2 class="cond s-h" data-r>I see who you’re becoming.</h2><p class="e-s" data-r>A bag they carry into every meeting and onto every flight. Add a note and their initials, pressed into the leather. Initials are a custom order, ready in 2 weeks.</p>
<ul class="gl" data-r><li><b>First job</b><span>First real bag. Arrive like you mean it.</span></li><li><b>Promotion</b><span>New role. New room. Same you, sharper.</span></li><li><b>Birthday or anniversary</b><span>Here’s to every room you walk into next.</span></li></ul>
<a class="btn btn-night" href="#shop">Choose a gift</a></div></section>

<section class="svc2"><div data-r><h3>Cash on delivery</h3><p>Pay when it reaches you, anywhere we deliver in India.</p></div><div data-r><h3>3-year warranty</h3><p>Stitching, hardware and zips, covered for three years.</p></div><div data-r><h3>Returns</h3><p>Free returns within 7 days of delivery. Sample policy, to confirm.</p></div></section>
</main>
<footer class="foot"><a class="logo" href="#top" aria-label="Tuskrr, back to top">${wordmark('wm')}</a>${footNotes({ fg: C.night, soft: C.soft, rule: C.rule })}</footer>
<script>(function(){var chips=[].slice.call(document.querySelectorAll("[data-f]")),cards=[].slice.call(document.querySelectorAll("[data-occ]"));
function f(k){chips.forEach(function(c){var m=c.getAttribute("data-f")===k;c.classList.toggle("on",m);c.setAttribute("aria-pressed",m)});cards.forEach(function(c){c.hidden=!(k==="all"||c.getAttribute("data-occ").indexOf(k)>-1)})}
chips.forEach(function(c){c.addEventListener("click",function(){f(c.getAttribute("data-f"))})});
[].forEach.call(document.querySelectorAll("[data-go]"),function(t){t.addEventListener("click",function(){f(t.getAttribute("data-go"))})});})();</script>`;

  const css = `
:root{--rv-dur:.8s;--rv-ease:${EASE};--rv-from:scale(.96)}
body{background:${C.bone};color:${C.night};font:400 16px/1.55 'Instrument Sans',system-ui,sans-serif}
.cond{font-family:'Instrument Sans',system-ui,sans-serif;font-stretch:75%;font-weight:600;text-transform:uppercase;line-height:.95;letter-spacing:-.005em}
.kick{font:500 12px/1.4 'IBM Plex Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:${C.soft}}
.fill{position:absolute;inset:0}
.svc{background:${C.night};color:${C.bone};display:flex;flex-wrap:wrap;justify-content:center;gap:4px 12px;padding:9px 16px;font-size:13px;text-align:center}
.svc i{color:#8d857c;font-style:normal}
.top{position:sticky;top:0;z-index:20;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;padding:6px clamp(16px,3vw,40px);background:${C.bone};border-bottom:1px solid ${C.rule}}
.nav{display:none}.nav a,.bagcount{display:inline-flex;align-items:center;min-height:44px;padding:0 10px;color:${C.night};text-decoration:none;font-weight:500;font-size:15px}
.nav a:hover,.bagcount:hover{color:${C.saddle}}
.logo{display:flex;align-items:center;justify-content:center;min-height:44px;min-width:44px;color:${C.night}}.wm{height:26px;width:auto}
.top .logo{grid-column:2}.bagcount{grid-column:3;justify-self:end}
@media (min-width:980px){.nav{display:flex;grid-column:1}}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 20px;font:600 15px/1.2 'Instrument Sans',system-ui,sans-serif;border:1px solid transparent;cursor:pointer;text-decoration:none;transition:background-color .25s ${EASE},color .25s ${EASE},border-color .25s ${EASE},transform .25s ${EASE}}
.btn-night{background:${C.night};color:${C.bone}}.btn-night:hover{background:${C.saddle}}
.btn-ghost{background:transparent;color:${C.night};border-color:${C.night}}.btn-ghost:hover{background:${C.night};color:${C.bone}}
.row{display:flex;flex-wrap:wrap;gap:8px}
.hero{display:grid;gap:6px;padding:6px}
@media (min-width:900px){.hero{grid-template-columns:1fr 1fr}}
.h-a,.h-b{position:relative;aspect-ratio:4/5;overflow:hidden}
.h-b{display:flex;align-items:flex-end}
.h-b-img{display:none}
@media (min-width:900px){.h-b-img{display:block}}
.h-card{position:relative;z-index:2;background:${C.paper};margin:0;padding:24px;width:100%;display:flex;flex-direction:column;gap:12px}
@media (min-width:900px){.h-card{margin:24px;width:auto}}
@media (max-width:899px){.h-b{aspect-ratio:auto}}
.h-h{font-size:clamp(52px,6.5vw,96px)}.h-s{font-size:18px;color:${C.soft}}
.occ,.shop{padding:clamp(48px,8vh,96px) clamp(16px,3vw,40px)}
.sh{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:14px;margin-bottom:22px}
.s-h{font-size:clamp(44px,6vw,84px)}.s-s{color:${C.soft};font-size:17px}
.tiles{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
@media (min-width:900px){.tiles{grid-template-columns:repeat(4,1fr)}}
.tile{display:flex;flex-direction:column;gap:10px;color:${C.night};text-decoration:none}
.tile-img{aspect-ratio:4/5}
.tile-t{font-weight:600;font-size:17px;min-height:26px}.tile b{color:${C.saddle};display:inline-block;transition:transform .25s ${EASE}}.tile:hover b{transform:translateX(4px)}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{min-height:44px;padding:8px 16px;border:1px solid ${C.night};background:transparent;color:${C.night};font:500 15px 'Instrument Sans',sans-serif;cursor:pointer;border-radius:30px;transition:background-color .25s ${EASE},color .25s ${EASE}}
.chip.on,.chip:hover{background:${C.night};color:${C.bone}}
.grid{display:grid;grid-template-columns:repeat(2,1fr);gap:8px}
@media (min-width:900px){.grid{grid-template-columns:repeat(3,1fr)}}
.pc{background:${C.paper};display:flex;flex-direction:column}
.pc[hidden]{display:none}
.pc-img{position:relative;aspect-ratio:4/5;padding:12%}
@media (min-width:900px){.pc-img{aspect-ratio:5/4;padding:8% 14%}}.pc-img .mv{height:100%}
.pc-b{padding:14px 16px 18px;display:flex;flex-direction:column;gap:4px;flex:1}
.pc-n{font-weight:700;font-size:18px;letter-spacing:.04em}.pc-t{font-size:14px;color:${C.soft}}.pc-l{font-size:15px}
.pc-p{margin:6px 0 10px;color:${C.saddle};font-weight:600}.pc-p span{color:${C.soft};font-weight:400;font-size:13px}
.pc .btn{margin-top:auto;align-self:flex-start}
.edit{display:grid;background:${C.paper}}
@media (min-width:900px){.edit{grid-template-columns:1fr 1fr}}
.e-media{position:relative;min-height:60svh}
.e-t{padding:clamp(40px,8vh,96px) clamp(16px,4vw,56px);display:flex;flex-direction:column;gap:16px;justify-content:center}
.e-h{font-size:clamp(48px,7vw,104px)}.e-s{font-size:18px;max-width:46ch;color:${C.soft}}
.e-g{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px}
.e-c{display:flex;flex-direction:column;gap:8px;text-decoration:none;color:${C.night};background:${C.bone};padding:10px}
.e-c img{aspect-ratio:1;object-fit:contain}.e-c span{display:flex;flex-direction:column;font-size:14px;color:${C.saddle}}.e-c b{color:${C.night}}
.gift{display:grid}
@media (min-width:900px){.gift{grid-template-columns:1fr 1fr}}
.g-img{position:relative;aspect-ratio:4/5}
.g-t{padding:clamp(40px,8vh,96px) clamp(16px,4vw,56px);display:flex;flex-direction:column;gap:16px;justify-content:center}
.gl li{display:flex;flex-direction:column;padding:12px 0;border-top:1px solid ${C.rule}}.gl span{color:${C.soft}}
.g-t .btn{align-self:flex-start}
.svc2{display:grid;gap:1px;background:${C.rule};border-top:1px solid ${C.rule};border-bottom:1px solid ${C.rule}}
@media (min-width:900px){.svc2{grid-template-columns:repeat(3,1fr)}}
.svc2>div{background:${C.bone};padding:28px clamp(16px,3vw,40px)}.svc2 h3{font-size:19px;margin-bottom:6px}.svc2 p{color:${C.soft}}
.foot{padding:48px clamp(16px,3vw,40px) 60px}.foot .logo{justify-content:flex-start}
`;
  return sitePage({
    title: 'Tuskrr, The Outfitter (direction 04)',
    description: 'Direction 04 prototype for the Tuskrr website: The Outfitter, on The Entrance theme in daylight.',
    css, body, step: 0.125, cap: 0.75,
    fonts: FONTS.instrumentSans + FONTS.plexMono,
  });
}
