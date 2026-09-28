// Direction 05, Six Readings (Linear Wilderness, Quiet Architecture palette).
// Reference: Spring/Summer. A fixed index, one word per section sized to fill
// the column, a landscape per reading, and a colour theme that swaps per bag.
import { BAGS, PROOF, TAGLINE, FONTS, esc, video, sitePage, footNotes } from './kit.mjs';
import { wordmark, monogram, strataSVG } from '../../src/shared.mjs';

const C = { carbon: '#121212', graphite: '#1E1E1E', concrete: '#D8D6D1', bone: '#ECEAE6', stone: '#9C988F', brass: '#C9A24A', brassDeep: '#6E5419' };
const THEME = { ridge: '#3A2416', traverse: '#3B2518', strata: '#242424', crest: '#40201A', axis: '#3A2717', contour: '#17223A' };
const LAND = { ridge: 'ridge', traverse: 'trail', strata: 'strata', crest: 'crest', axis: 'axis', contour: 'contour' };
const LAND_ALT = { ridge: 'A mountain ridge at dusk.', traverse: 'A stone trail along a mountain top.', strata: 'Layered rock formations.', crest: 'Waves breaking at sunset.', axis: 'A braided river through mountains.', contour: 'A river bending around rock.' };

// One word that fills the column: SVG text stretched to the full width.
function bigWord(word, cls = '') {
  const F = Math.min(1000 / (0.43 * word.length), 480), H = Math.round(F * 0.74);
  return `<svg class="bw ${cls}" viewBox="0 0 1000 ${H}" role="img" aria-label="${esc(word)}"><text x="0" y="${H - 2}" textLength="1000" lengthAdjust="spacingAndGlyphs" font-size="${F.toFixed(0)}">${esc(word)}</text></svg>`;
}

export function build() {
  const idx = [['top', '00', 'Arrive'], ...BAGS.map((b) => [b.id, b.n, b.name])];
  const sections = BAGS.map((b) => `<section class="rd" id="${b.id}" data-theme="${THEME[b.id]}" aria-label="${esc(b.name)}, reading: ${esc(b.inspired)}">
${video(LAND[b.id], { cls: 'rd-v', alt: LAND_ALT[b.id] })}
<div class="rd-in">
<p class="mono rd-k" data-r>${b.n} · Reading: ${esc(b.inspired)}</p>
<div data-r>${bigWord(b.name)}</div>
<div class="rd-g">
<div class="rd-t" data-r><p class="rd-line">${esc(b.line)}</p><p class="rd-idea">${esc(b.idea)}</p><p class="rd-story">${esc(b.story)}</p></div>
<div class="plinth" data-r style="--th:${THEME[b.id]}"><div class="mv mv-render pl-img"><img class="mv-v" src="${b.img}" alt="${esc(b.name)}, ${esc(b.type.toLowerCase())}" decoding="async"><span class="tagx">Supplied render</span></div>
<div class="pl-b"><p class="pl-n">${esc(b.name)} <span>${esc(b.type)}</span></p><p class="pl-p">${b.priceText} <span>sample price · ${esc(b.laptop)} (sample)</span></p><button class="btn btn-brass" data-add="${esc(b.name)}">Add to bag</button></div></div>
</div></div></section>`).join('');

  const body = `
<aside class="side" aria-label="Index">
<a class="s-logo" href="#top" aria-label="Tuskrr, back to top">${wordmark('wm')}</a>
<nav class="s-idx">${idx.map(([id, n, name]) => `<a href="#${id}" data-idx="${id}"><span>${n}</span>${esc(name)}</a>`).join('')}</nav>
<a class="bagcount s-bag" href="#close" aria-label="Bag">Bag <span data-count>0</span></a>
</aside>
<main class="main">
<section class="rd hero" id="top" data-theme="${C.graphite}">
${video('traffic', { cls: 'rd-v', alt: 'City traffic at night from above, lines of light.' })}
<div class="rd-in">
<p class="mono rd-k" data-r>Tuskrr · Linear Wilderness</p>
<div data-r>${bigWord('ARRIVE')}</div>
<p class="hero-s" data-r>like you mean it.</p>
<p class="hero-t" data-r>Nature makes the lines. We give them structure. Six bags, six readings of the land: terrain, movement, layers, elevation, direction, form.</p>
<a class="btn btn-brass" href="#ridge" data-r>Begin with RIDGE</a>
</div></section>
${sections}
<section class="close" id="close" data-theme="${C.concrete}">
<div class="cl-in"><p class="mono cl-k" data-r>Every line has purpose</p>
<h2 class="cond cl-h" data-r>Six readings.<br>One promise.</h2>
<ul class="cl-p">${PROOF.map((p) => `<li data-r>${esc(p)}</li>`).join('')}</ul>
<div class="cl-gift" data-r><h3>For someone climbing</h3><p>Add a note and their initials. Initials are a custom order, ready in 2 weeks.</p><a class="btn btn-carbon" href="#ridge">Choose a reading to gift</a></div>
</div>${strataSVG({ w: 1200, h: 260, lines: 22, seed: 5, cls: 'cl-strata' })}</section>
<footer class="foot"><span class="f-mk">${monogram('fmk')}</span><p class="cond f-t">${esc(TAGLINE)}</p>${footNotes({ fg: C.bone, soft: C.stone, rule: '#333' })}</footer>
</main>
<script>(function(){var side=document.querySelector(".side"),links=[].slice.call(document.querySelectorAll("[data-idx]"));
var secs=[].slice.call(document.querySelectorAll("[data-theme]"));
if(!("IntersectionObserver" in window))return;
var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){side.style.setProperty("--th",e.target.getAttribute("data-theme"));side.classList.toggle("light",e.target.id==="close");links.forEach(function(l){var m=l.getAttribute("data-idx")===e.target.id;l.classList.toggle("on",m);if(m){l.setAttribute("aria-current","true");if(side.scrollWidth>side.clientWidth+4)side.scrollTo({left:Math.max(0,l.offsetLeft-70)})}else l.removeAttribute("aria-current")})}})},{rootMargin:"-45% 0px -45% 0px"});
secs.forEach(function(s){io.observe(s)});})();</script>`;

  const css = `
:root{--rv-dur:.5s;--rv-ease:ease-in-out;--rv-from:translateY(-16px);--side:12.5rem}
body{background:${C.carbon};color:${C.bone};font:400 17px/1.55 'Instrument Sans',system-ui,sans-serif}
.cond{font-family:'Instrument Sans',system-ui,sans-serif;font-stretch:75%;font-weight:600;text-transform:uppercase;line-height:.92}
.mono{font:500 12px/1.4 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase}
.bw{display:block;width:100%;height:auto;overflow:visible}
.bw text{fill:currentColor;font-family:'Instrument Sans',sans-serif;font-stretch:75%;font-weight:600;text-transform:uppercase}
.side{position:fixed;z-index:30;inset:0 0 auto 0;display:flex;align-items:center;gap:10px;padding:6px 12px;background:var(--th,${C.graphite});color:${C.bone};overflow-x:auto}
html[data-motion=on] .side{transition:background-color .4s ease-out,color .4s ease-out}
.side::before{content:"";position:absolute;inset:0;background:repeating-linear-gradient(90deg,rgba(236,234,230,.07) 0 1px,transparent 1px 12px);pointer-events:none}
.s-logo{display:flex;align-items:center;min-height:44px;min-width:44px;color:inherit;flex:none}.wm{height:18px;width:auto}
.s-idx{display:flex;gap:2px}
.s-idx a{display:inline-flex;align-items:center;gap:8px;min-height:44px;padding:0 10px;color:inherit;text-decoration:none;font:500 13px/1 'IBM Plex Mono',monospace;letter-spacing:.06em;white-space:nowrap;position:relative}
.s-idx a span{color:inherit}
.s-idx a.on{box-shadow:inset 0 -2px 0 ${C.brass}}
.s-bag{color:inherit;text-decoration:none;font-weight:600;padding:0 10px;flex:none}
.side.light{color:${C.carbon}}.side.light .s-idx a.on{box-shadow:inset 0 -2px 0 ${C.brassDeep}}
@media (min-width:1000px){
.side{inset:0 auto 0 0;width:var(--side);flex-direction:column;align-items:stretch;padding:20px 10px;overflow:visible}
html[data-motion=on] .side{transition:background-color .4s ease-out,color .4s ease-out}
.side::before{background:repeating-linear-gradient(90deg,rgba(236,234,230,.07) 0 1px,transparent 1px 10px)}
.s-logo{padding:0 8px 20px}.wm{height:22px}
.s-idx{flex-direction:column;gap:0}
.s-idx a.on{box-shadow:inset 3px 0 0 ${C.brass}}.side.light .s-idx a.on{box-shadow:inset 3px 0 0 ${C.brassDeep}}
.s-bag{margin-top:auto;min-height:44px;display:flex;align-items:center}
.main{margin-left:var(--side)}}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 20px;font:600 16px/1.2 'Instrument Sans',system-ui,sans-serif;border:0;cursor:pointer;text-decoration:none;transition:background-color .2s ease-in-out,color .2s ease-in-out,transform .2s ease-in-out}
.btn-brass{background:${C.brass};color:${C.carbon}}.btn-brass:hover{background:${C.bone}}
.btn-carbon{background:${C.carbon};color:${C.bone}}.btn-carbon:hover{background:${C.brassDeep}}
.rd{position:relative;min-height:100svh;display:flex;align-items:flex-end;overflow:hidden}
.rd-v{position:absolute;inset:0}
.rd-v::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(18,18,18,.92) 0%,rgba(18,18,18,.78) 45%,rgba(18,18,18,.45) 100%);z-index:1}
.rd-in{position:relative;z-index:2;width:100%;padding:90px clamp(16px,3vw,44px) clamp(28px,6vh,60px);display:flex;flex-direction:column;gap:18px}
.rd-k{color:${C.bone};background:rgba(18,18,18,.88);padding:5px 8px;align-self:flex-start}
.rd-g{display:grid;gap:16px;align-items:end}
@media (min-width:900px){.rd-g{grid-template-columns:1.2fr 1fr}}
.rd-line{font-size:clamp(26px,3vw,40px);line-height:1.1;font-weight:600;margin-bottom:12px}
.rd-idea{font-size:18px;max-width:52ch}.rd-story{font-size:16px;max-width:56ch;color:#D6D3CD;margin-top:10px}
.plinth{background:var(--th);display:grid;grid-template-columns:1fr;border-top:3px solid ${C.brass}}
@media (min-width:560px){.plinth{grid-template-columns:1fr 1fr;align-items:center}}
.pl-img{height:230px;margin:14px}.pl-img .mv-v{object-fit:contain;filter:drop-shadow(0 20px 24px rgba(0,0,0,.45))}
.pl-b{padding:16px 18px 18px;display:flex;flex-direction:column;gap:8px}
.pl-n{font-weight:700;font-size:20px;letter-spacing:.04em}.pl-n span{font-weight:400;font-size:15px;letter-spacing:0;display:block}
.pl-p{font-weight:600}.pl-p span{display:block;font-weight:400;font-size:14px;color:#D6D3CD}
.pl-b .btn{align-self:flex-start}
.hero-s{font-size:clamp(30px,4vw,56px);font-weight:500;letter-spacing:-.01em;margin-top:-6px}
.hero-t{max-width:52ch;font-size:18px}
.hero .btn{align-self:flex-start}
.close{position:relative;background:${C.concrete};color:${C.carbon};overflow:hidden}
.cl-in{position:relative;z-index:2;padding:clamp(60px,12vh,140px) clamp(16px,3vw,44px);display:flex;flex-direction:column;gap:22px}
.cl-k{color:${C.brassDeep}}
.cl-h{font-size:clamp(56px,9vw,140px)}
.cl-p{display:grid;gap:0;border-top:1px solid #B9B6AF}
@media (min-width:900px){.cl-p{grid-template-columns:repeat(4,1fr)}}
.cl-p li{padding:16px 12px 16px 0;border-bottom:1px solid #B9B6AF;font-size:19px;font-weight:600}
.cl-gift{background:${C.bone};padding:22px;max-width:560px;display:flex;flex-direction:column;gap:10px}.cl-gift h3{font-size:22px}.cl-gift .btn{align-self:flex-start}
.cl-strata{position:absolute;right:0;bottom:0;width:70%;height:auto;opacity:.35;color:#8C8983}
.foot{padding:60px clamp(16px,3vw,44px)}.f-mk{display:block;width:70px;color:${C.brass}}.fmk{width:100%}
.f-t{font-size:clamp(40px,7vw,110px);margin:18px 0}
`;
  return sitePage({
    title: 'Tuskrr, Six Readings (direction 05)',
    description: 'Direction 05 prototype for the Tuskrr website: Six Readings, on the Linear Wilderness theme.',
    css, body, step: 0.1, cap: 0.5,
    fonts: FONTS.instrumentSans + FONTS.plexMono,
  });
}
