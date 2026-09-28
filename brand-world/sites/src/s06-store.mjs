// Direction 06, The Small Store (Linear Wilderness, Field Survey palette).
// Reference: OUTFIT by ++hellohello. One page, six bags, a six-frame
// preloader, numbered sheets and a second photo on tap.
import { BAGS, PROOF, TAGLINE, FONTS, esc, still, sitePage, footNotes } from './kit.mjs';
import { wordmark, contourSVG } from '../../src/shared.mjs';

const C = { paper: '#ECE8DF', sheet: '#F6F3EC', ink: '#1B1C1A', slate: '#2E4A4D', cognac: '#8A4722', gold: '#8F6412', contour: '#C9C1AF', soft: '#4A4A45' };
const EASE = 'cubic-bezier(.4,0,.2,1)';
const DRY = {
  ridge: 'Or at least your own charger.',
  traverse: 'Pack for the short one.',
  strata: 'Your laptop is one of the layers.',
  crest: 'Or at least above the nylon backpack.',
  axis: 'Phone, keys, card. Done.',
  contour: 'The laptop sleeve, grown up.',
};
const OUT = { ridge: 'bw-walk-1', traverse: 'boarding-0', strata: 'caller-0', crest: 'hikers-0', axis: 'enters-0', contour: 'bw-work-0' };

export function build() {
  const sheets = BAGS.map((b, i) => `<article class="sh" data-r>
<header class="sh-h mono"><span>Sheet ${b.n}</span><span>${esc(b.inspired)}</span></header>
<div class="sh-stage" data-stage>
${contourSVG({ seed: 11 + i * 7, levels: 11 }, 'sh-ct')}
<div class="mv mv-render sh-bag"><img class="mv-v" src="${b.img}" alt="${esc(b.name)}, ${esc(b.type.toLowerCase())}" decoding="async"><span class="tagx">Supplied render</span></div>
<div class="mv sh-out"><img class="mv-v" src="${still(OUT[b.id])}" alt="" decoding="async"><span class="tagx">Stock stand-in</span></div>
</div>
<div class="sh-b"><h3 class="arch sh-n">${esc(b.name)}</h3><p class="sh-l">${esc(b.line)} <span>${esc(DRY[b.id])}</span></p>
<p class="sh-p">${b.priceText} <span class="mono">sample</span></p>
<div class="sh-a"><button class="btn btn-ink" data-add="${esc(b.name)}">Add to bag</button><button class="btn btn-line" data-see aria-pressed="false">See it out</button></div></div>
</article>`).join('');
  const body = `
<div class="pre" aria-hidden="true">${BAGS.map((b, i) => `<img class="pre-f" style="--i:${i}" src="${b.img}" alt="">`).join('')}</div>
<header class="top"><span class="mono">Tuskrr · The small store · ${esc(TAGLINE)}</span><a class="bagcount mono" href="#store" aria-label="Bag">Bag (<span data-count>0</span>)</a></header>
<main id="top">
<h1 class="big"><span class="sr">Tuskrr</span>${wordmark('big-wm')}</h1>
<section class="intro"><p class="arch intro-h" data-r>Six bags. That’s the whole store.</p><p class="intro-t" data-r>Genuine leather, a 3-year warranty and cash on delivery. No maze, no sale. Tap <b>See it out</b> on any sheet to see it in the world.</p></section>
<section class="store" id="store" aria-label="The six bags">${sheets}</section>
<section class="why"><p class="mono why-k" data-r>Why these six</p><div class="why-g">${PROOF.map((p, i) => `<p data-r><span class="arch">0${i + 1}</span>${esc(p)}</p>`).join('')}</div></section>
<section class="gift"><div class="g-c" data-r><p class="mono">Sheet 07, sort of</p><h2 class="arch g-h">For someone climbing</h2><p>Add a note and their initials. Initials are a custom order, ready in 2 weeks. The note is free and so is our opinion: STRATA for a new job, CONTOUR for a promotion.</p><a class="btn btn-ink" href="#store">Pick a sheet</a></div>
<div class="g-img" data-r><img src="${still('gift-box-0')}" alt="A gift box, opened." decoding="async"><span class="tagx">Stock stand-in</span></div></section>
</main>
<footer class="foot">${contourSVG({ seed: 3, levels: 14 }, 'f-ct')}<div class="f-in">${wordmark('f-wm')}${footNotes({ fg: C.ink, soft: C.soft, rule: C.contour })}</div></footer>
<script>(function(){[].forEach.call(document.querySelectorAll("[data-see]"),function(b){b.addEventListener("click",function(){var st=b.closest(".sh").querySelector("[data-stage]"),on=!st.classList.contains("out");st.classList.toggle("out",on);b.setAttribute("aria-pressed",on);b.textContent=on?"See the bag":"See it out"})});
var pre=document.querySelector(".pre");if(document.documentElement.getAttribute("data-motion")!=="on"){pre.remove();return}setTimeout(function(){pre.classList.add("done");setTimeout(function(){pre.remove()},500)},1150);})();</script>`;

  const css = `
:root{--rv-dur:.4s;--rv-ease:ease-in-out;--rv-from:translateY(12px)}
body{background:${C.paper};color:${C.ink};font:400 17px/1.5 'Archivo',system-ui,sans-serif}
.arch{font-family:'Archivo',system-ui,sans-serif;font-stretch:62%;font-weight:700;text-transform:uppercase;line-height:.92;letter-spacing:-.005em}
.mono{font:500 13px/1.4 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}
.pre{position:fixed;inset:0;z-index:90;background:${C.paper};display:flex;align-items:center;justify-content:center;transition:opacity .4s ease-in-out}
.pre.done{opacity:0}
.pre-f{position:absolute;width:min(46vw,300px);height:min(46vw,300px);object-fit:contain;opacity:0;animation:pf .15s linear calc(var(--i) * .15s)}
.pre-f:last-child{animation-fill-mode:forwards}
@keyframes pf{from,to{opacity:1}}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:6px clamp(12px,2vw,24px);border-bottom:1px solid ${C.ink}}
.bagcount{color:${C.ink};text-decoration:none;padding:0 6px}.bagcount:hover{color:${C.cognac}}
.big{padding:10px clamp(12px,2vw,24px) 0;color:${C.ink};margin:0}
.big-wm{width:100%;height:auto}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:46px;padding:10px 16px;font:600 15px/1.2 'Archivo',system-ui,sans-serif;border:1px solid ${C.ink};cursor:pointer;text-decoration:none;transition:background-color .15s ${EASE},color .15s ${EASE},border-color .15s ${EASE},transform .15s ${EASE}}
.btn-ink{background:${C.ink};color:${C.sheet}}.btn-ink:hover{background:${C.cognac};border-color:${C.cognac}}
.btn-line{background:transparent;color:${C.ink}}.btn-line:hover{background:${C.ink};color:${C.sheet}}
.intro{display:grid;gap:12px;padding:clamp(24px,5vh,56px) clamp(12px,2vw,24px);border-bottom:1px solid ${C.ink}}
@media (min-width:900px){.intro{grid-template-columns:1.3fr 1fr;align-items:end}}
.intro-h{font-size:clamp(44px,6vw,96px)}.intro-t{max-width:44ch}
.store{display:grid;grid-template-columns:repeat(2,1fr);gap:1px;background:${C.ink};border-bottom:1px solid ${C.ink}}
@media (min-width:1000px){.store{grid-template-columns:repeat(3,1fr)}}
.sh{background:${C.sheet};display:flex;flex-direction:column}
.sh-h{display:flex;justify-content:space-between;padding:10px 12px;border-bottom:1px solid ${C.contour}}
.sh-stage{position:relative;aspect-ratio:4/5;overflow:hidden}
.sh-ct{position:absolute;inset:0;width:100%;height:100%;color:${C.contour};opacity:.9}
.sh-bag{position:absolute;inset:14% 12% 10%;transition:opacity .5s ${EASE},transform .5s ${EASE}}
.sh-out{position:absolute;inset:0;opacity:0;transition:opacity .5s ${EASE}}
.sh-stage.out .sh-out{opacity:1}.sh-stage.out .sh-bag{opacity:0}
@media (hover:hover){.sh-stage:hover .sh-out{opacity:1}.sh-stage:hover .sh-bag{opacity:0}}
.sh-b{padding:12px 12px 16px;display:flex;flex-direction:column;gap:6px;flex:1}
.sh-n{font-size:clamp(38px,5vw,64px)}
.sh-l{font-size:15px}.sh-l span{color:${C.soft}}
.sh-p{font-weight:700;color:${C.cognac};font-size:18px}.sh-p .mono{color:${C.soft};font-size:11px}
.sh-a{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}
@media (max-width:520px){.sh-a .btn{flex:1 1 100%}}
.why{background:${C.slate};color:${C.sheet};padding:clamp(40px,8vh,96px) clamp(12px,2vw,24px)}
.why-k{color:${C.sheet}}
.why-g{display:grid;gap:0;margin-top:18px}
@media (min-width:900px){.why-g{grid-template-columns:repeat(4,1fr)}}
.why-g p{display:flex;flex-direction:column;gap:6px;padding:18px 16px 18px 0;border-top:1px solid rgba(246,243,236,.3);font-size:20px;font-weight:600}
.why-g .arch{font-size:48px;color:#E8D3A8}
.gift{display:grid;gap:1px;background:${C.ink};border-bottom:1px solid ${C.ink}}
@media (min-width:900px){.gift{grid-template-columns:1fr 1fr}}
.g-c{background:${C.sheet};padding:clamp(28px,6vh,64px) clamp(12px,2vw,24px);display:flex;flex-direction:column;gap:12px}
.g-h{font-size:clamp(44px,6vw,90px)}.g-c .btn{align-self:flex-start}
.g-img{position:relative;min-height:320px;background:${C.paper}}.g-img img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.foot{position:relative;overflow:hidden}
.f-ct{position:absolute;inset:0;width:100%;height:100%;color:${C.contour};opacity:.6}
.f-in{position:relative;padding:48px clamp(12px,2vw,24px) 60px;background:linear-gradient(${C.paper}E6,${C.paper}F2)}
.f-wm{width:min(420px,70%);height:auto;color:${C.ink}}
`;
  return sitePage({
    title: 'Tuskrr, The Small Store (direction 06)',
    description: 'Direction 06 prototype for the Tuskrr website: The Small Store, on the Linear Wilderness theme.',
    css, body, step: 0.125, cap: 0.75,
    fonts: FONTS.archivo + FONTS.plexMono,
  });
}
