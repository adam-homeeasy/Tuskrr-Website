// Direction 07, Pressed In (Linear Wilderness, Field Survey palette).
// Reference: UNIMATIC Impronte. Relief as landscape: an essay, detail bands,
// a process filmstrip, and a live initials preview pressed into leather.
import { BAGS, PROOF, TAGLINE, FONTS, esc, video, still, sitePage, footNotes } from './kit.mjs';
import { monogram, contourSVG } from '../../src/shared.mjs';

const C = { sheet: '#F6F3EC', paper: '#ECE8DF', ink: '#1B1C1A', slate: '#2E4A4D', cognac: '#8A4722', gold: '#8F6412', contour: '#C9C1AF', soft: '#4A4A45' };
const REV = 'cubic-bezier(0.64,0,0.78,0)', FILM = 'cubic-bezier(1,0,0,1)';
const by = Object.fromEntries(BAGS.map((b) => [b.id, b]));
// Zoomed crops of the supplied renders: [bag, object-position, scale]
const zoom = (id, pos, sc, alt) => `<div class="zm"><img src="${by[id].raw}" alt="${esc(alt)}" style="object-position:${pos};transform:scale(${sc})" decoding="async"><span class="tagx">Supplied render, detail</span></div>`;

export function build() {
  const bands = [
    ['The channel', 'Run your thumb along it. Every Tuskrr bag carries the same vertical lines: nature’s lines, given structure.', zoom('ridge', '50% 70%', 2.4, 'RIDGE, the stitched channels, close up.'), 'sheet'],
    ['The gold S', 'One letter picked out in gold on the badge. The only thing on the bag allowed to shine.', zoom('strata', '52% 40%', 3.2, 'STRATA, the badge with the gold S, close up.'), 'slate'],
    ['The grain', 'Genuine leather. It will look lived in, in the best way, and it is covered by a 3-year warranty while it does.', `<div class="zm par"><img src="${still('leather-1')}" alt="Brown leather grain, close up." data-par decoding="async"><span class="tagx">Stock stand-in</span></div>`, 'sheet'],
    ['The hide', 'Leather starts as hide, tanned in drums like these before it is cut. Where it comes from is on the list of things we will show you.', `<div class="zm">${video('tannery', { cls: 'fillv', alt: 'Tanning drums in a leather factory.', label: true })}</div>`, 'slate'],
  ];
  const film = [['tannery-0', 'Tanning'], ['leather-0', 'Grain'], ['tannery-1', 'Drums'], ['leather-1', 'Surface']];
  const body = `
<header class="top"><a class="logo" href="#top" aria-label="Tuskrr, back to top">${monogram('mk')}<span class="arch">Pressed in</span></a>
<nav class="nav mono" aria-label="Sections"><a href="#craft">Craft</a><a href="#initials">Initials</a><a href="#bags">Bags</a></nav>
<a class="bagcount mono" href="#bags" aria-label="Bag">Bag <span data-count>0</span></a></header>
<main id="top">
<section class="hero">${video('leather', { cls: 'hero-v', alt: 'Brown leather, close up, in raking light.' })}${contourSVG({ seed: 17, levels: 13 }, 'hero-ct')}
<div class="hero-in"><p class="mono hero-k" data-r>Tuskrr · The craft</p><h1 class="arch hero-h" data-r>Pressed in.</h1><p class="hero-s" data-r>Leather remembers pressure. Every channel on a Tuskrr bag is a line you can feel.</p></div></section>

<section class="essay"><p class="es" data-r>Every object carries the memory of how it was made.</p><p class="es" data-r>Nature makes the lines. We give them structure.</p><p class="es es-c" data-r>Then you carry them for years, and add your own.</p></section>

<section id="craft">${bands.map(([t, d, media, tone], i) => `<div class="band ${tone} ${i % 2 ? 'rev' : ''}"><div class="b-media" data-r>${media}</div><div class="b-t"><p class="mono" data-r>Detail 0${i + 1}</p><h2 class="arch b-h" data-r>${esc(t)}</h2><p class="b-d" data-r>${esc(d)}</p></div></div>`).join('')}</section>

<section class="film"><div class="f-h"><h2 class="arch f-t" data-r>From hide to bag</h2><div class="f-c"><button class="fb" data-fd="-1" aria-label="Previous frame">←</button><button class="fb" data-fd="1" aria-label="Next frame">→</button></div></div>
<div class="f-view"><div class="f-strip" data-strip>${film.map(([id, cap], i) => `<figure class="f-fr"><img src="${still(id)}" alt="${esc(cap)}" decoding="async"><figcaption class="mono">0${i + 1} · ${esc(cap)}</figcaption><span class="tagx">Stock stand-in</span></figure>`).join('')}</div></div></section>

<section class="ini" id="initials"><div class="ini-t"><p class="mono" data-r>Custom order · ready in 2 weeks</p><h2 class="arch b-h" data-r>Your initials, pressed in.</h2><p class="b-d" data-r>Type up to three letters to see them on the leather. The real press uses its own letter set; this preview is a stand-in. Price to confirm.</p>
<label class="lab" for="ini">Initials</label><input id="ini" class="field" maxlength="3" value="AK" autocomplete="off" data-ini-in>
<div class="bag-pick" role="group" aria-label="Choose a bag">${BAGS.map((b, i) => `<button class="pick${i ? '' : ' on'}" data-pick="${b.id}" aria-pressed="${i ? 'false' : 'true'}">${esc(b.name)}</button>`).join('')}</div>
<button class="btn btn-ink" data-add="Initials on RIDGE" data-add-ini>Add with initials</button></div>
<div class="ini-v" data-r><div class="press" aria-hidden="true" style="background-image:url(${still('leather-0')})"><span class="pr-l" data-ini>A K</span></div><p class="mono pr-cap">Preview on grain · stock stand-in</p></div></section>

<section class="bags" id="bags"><h2 class="arch f-t" data-r>Six bags, each pressed</h2><div class="bg-g">${BAGS.map((b) => `<article class="bc" data-r><div class="mv mv-render bc-img"><img class="mv-v" src="${b.img}" alt="${esc(b.name)}, ${esc(b.type.toLowerCase())}" decoding="async"><span class="tagx">Supplied render</span></div><p class="arch bc-n">${esc(b.name)}</p><dl class="bc-s mono"><div><dt>Type</dt><dd>${esc(b.type)}</dd></div><div><dt>Finish</dt><dd>${esc(b.finish)}</dd></div><div><dt>Laptop</dt><dd>${esc(b.laptop)}*</dd></div><div><dt>Price</dt><dd>${b.priceText}*</dd></div></dl><button class="btn btn-line" data-add="${esc(b.name)}">Add to bag</button></article>`).join('')}</div><p class="mono note">* Sample values</p></section>

<section class="proof">${PROOF.map((p) => `<p data-r>${esc(p)}</p>`).join('')}</section>
</main>
<footer class="foot"><p class="arch foot-t">${esc(TAGLINE)}</p>${footNotes({ fg: C.ink, soft: C.soft, rule: C.contour })}</footer>
<script>(function(){var on=document.documentElement.getAttribute("data-motion")==="on";
var st=document.querySelector("[data-strip]"),k=0,n=st.children.length;[].forEach.call(document.querySelectorAll("[data-fd]"),function(b){b.addEventListener("click",function(){k=(k+(+b.getAttribute("data-fd"))+n)%n;st.style.transform="translateX("+(-k*st.children[0].getBoundingClientRect().width-k*12)+"px)"})});
var ii=document.querySelector("[data-ini-in]"),io=document.querySelector("[data-ini]"),add=document.querySelector("[data-add-ini]"),bag="RIDGE";
function upd(){var v=ii.value.toUpperCase().replace(/[^A-Z]/g,"");io.textContent=v.split("").join(" ")||"A K";add.setAttribute("data-add","Initials "+(v||"AK")+" on "+bag)}ii.addEventListener("input",upd);
[].forEach.call(document.querySelectorAll("[data-pick]"),function(p,_,all){p.addEventListener("click",function(){[].forEach.call(document.querySelectorAll("[data-pick]"),function(q){q.classList.toggle("on",q===p);q.setAttribute("aria-pressed",q===p)});bag=p.textContent;upd()})});
if(!on)return;var par=[].slice.call(document.querySelectorAll("[data-par]")),tick=false;
function run(){tick=false;par.forEach(function(im){var r=im.getBoundingClientRect(),p=Math.min(1,Math.max(0,(innerHeight-r.top)/(innerHeight+r.height)));im.style.objectPosition="center "+(25+50*p)+"%"})}
addEventListener("scroll",function(){if(!tick){tick=true;requestAnimationFrame(run)}},{passive:true});run();})();</script>`;

  const css = `
:root{--rv-dur:.45s;--rv-ease:${REV};--rv-from:translateY(8px)}
body{background:${C.sheet};color:${C.ink};font:400 17px/1.55 'Archivo',system-ui,sans-serif}
.arch{font-family:'Archivo',system-ui,sans-serif;font-stretch:62%;font-weight:700;text-transform:uppercase;line-height:.92}
.mono{font:500 13px/1.4 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.06em;text-transform:uppercase}
.top{position:fixed;inset:0 0 auto;z-index:20;display:flex;align-items:center;gap:10px;padding:6px clamp(12px,2.5vw,32px);background:rgba(246,243,236,.86);backdrop-filter:blur(30px);-webkit-backdrop-filter:blur(30px);border-bottom:1px solid rgba(27,28,26,.12)}
.logo{display:flex;align-items:center;gap:10px;min-height:44px;color:${C.ink};text-decoration:none}.mk{width:30px}.logo .arch{font-size:22px}
.nav{display:none;margin-left:auto}.nav a,.bagcount{display:inline-flex;align-items:center;min-height:44px;padding:0 10px;color:${C.ink};text-decoration:none;transition:color .22s ease}
.nav a:hover,.bagcount:hover{color:${C.cognac}}.bagcount{margin-left:auto}
@media (min-width:760px){.nav{display:flex}.bagcount{margin-left:0}}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 20px;font:600 15px/1.2 'Archivo',system-ui,sans-serif;border:1px solid ${C.ink};border-radius:6px;cursor:pointer;text-decoration:none;transition:background-color .22s ease,color .22s ease,transform .22s ease}
.btn-ink{background:${C.ink};color:${C.sheet}}.btn-ink:hover{background:${C.cognac};border-color:${C.cognac}}
.btn-line{background:transparent;color:${C.ink}}.btn-line:hover{background:${C.ink};color:${C.sheet}}
.hero{position:relative;min-height:100svh;display:flex;align-items:flex-end;overflow:hidden}
.hero-v{position:absolute;inset:0}.hero-v::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(27,28,26,.84),rgba(27,28,26,.5) 55%,rgba(27,28,26,.3));z-index:1}
.hero-ct{position:absolute;inset:0;width:100%;height:100%;color:#F1D9B8;opacity:.28;z-index:1}
.hero-in{position:relative;z-index:2;padding:100px clamp(12px,3vw,44px) clamp(32px,7vh,72px);color:${C.sheet}}
.hero-k{color:${C.sheet}}
.hero-h{font-size:clamp(90px,19vw,300px);text-shadow:0 2px 0 rgba(0,0,0,.35),0 -1px 0 rgba(255,236,210,.18)}
.hero-s{font-size:clamp(19px,2vw,24px);max-width:36ch;margin-top:10px}
.essay{padding:clamp(70px,14vh,160px) clamp(12px,3vw,44px);display:flex;flex-direction:column;gap:8px}
.es{font-size:clamp(28px,4.4vw,64px);line-height:1.08;letter-spacing:-.02em;font-weight:500;max-width:24ch}.es-c{color:${C.cognac}}
.band{display:grid}
@media (min-width:900px){.band{grid-template-columns:1fr 1fr}.band.rev .b-media{order:2}}
.band.slate{background:${C.slate};color:${C.sheet}}.band.slate .mono{color:${C.sheet}}
.band.sheet{background:${C.paper}}
.b-media{position:relative;min-height:62svh}
.zm{position:absolute;inset:0;overflow:hidden;background:#EDECEA}
.zm img{width:100%;height:100%;object-fit:cover;transform-origin:center}
.zm .fillv{position:absolute;inset:0}
.b-t{padding:clamp(40px,8vh,96px) clamp(12px,3vw,44px);display:flex;flex-direction:column;gap:14px;justify-content:center}
.b-h{font-size:clamp(52px,7vw,110px)}.b-d{font-size:19px;max-width:40ch}
.film{padding:clamp(60px,10vh,120px) 0;overflow:hidden}
.f-h{display:flex;justify-content:space-between;align-items:flex-end;gap:12px;padding:0 clamp(12px,3vw,44px) 24px;flex-wrap:wrap}
.f-t{font-size:clamp(48px,7vw,100px)}
.f-c{display:flex;gap:8px}.fb{min-width:48px;min-height:48px;border:1px solid ${C.ink};border-radius:6px;background:transparent;font-size:20px;cursor:pointer;color:${C.ink};transition:background-color .22s ease,color .22s ease,transform .22s ease}.fb:hover{background:${C.ink};color:${C.sheet}}
.f-view{padding:0 clamp(12px,3vw,44px)}
.f-strip{display:flex;gap:12px;transition:transform 1s ${FILM}}
.f-fr{position:relative;flex:0 0 min(78vw,620px)}.f-fr img{width:100%;aspect-ratio:684/485;object-fit:cover;border-radius:8px}
.f-fr figcaption{margin-top:8px}.f-fr .tagx{bottom:34px}
@media (prefers-reduced-motion:reduce){.f-strip{transition:none}}
.ini{display:grid;background:${C.paper};border-top:1px solid ${C.contour}}
@media (min-width:900px){.ini{grid-template-columns:1fr 1fr}}
.ini-t{padding:clamp(40px,8vh,96px) clamp(12px,3vw,44px);display:flex;flex-direction:column;gap:12px}
.lab{font:500 13px 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;margin-top:8px}
.field{min-height:52px;width:160px;border:1px solid ${C.ink};border-radius:6px;background:${C.sheet};font:700 24px 'Archivo',sans-serif;letter-spacing:.3em;padding:8px 14px;text-transform:uppercase;color:${C.ink}}
.bag-pick{display:flex;flex-wrap:wrap;gap:6px}
.pick{min-height:44px;padding:8px 12px;border:1px solid ${C.ink};border-radius:30px;background:transparent;color:${C.ink};font:600 13px 'IBM Plex Mono',monospace;letter-spacing:.05em;cursor:pointer;transition:background-color .22s ease,color .22s ease}
.pick.on,.pick:hover{background:${C.ink};color:${C.sheet}}
.ini-t .btn{align-self:flex-start;margin-top:6px}
.ini-v{padding:clamp(20px,5vh,56px) clamp(12px,3vw,44px);display:flex;flex-direction:column;gap:10px;justify-content:center}
.press{height:min(56vw,420px);border-radius:10px;background-size:cover;background-position:center;display:flex;align-items:center;justify-content:center}
.pr-l{font:800 clamp(80px,13vw,170px)/1 'Archivo',sans-serif;font-stretch:62%;letter-spacing:.08em;color:#6a3a1c;text-shadow:0 2px 1px rgba(255,214,176,.35),0 -2px 2px rgba(0,0,0,.6)}
.bags{padding:clamp(60px,10vh,120px) clamp(12px,3vw,44px)}
.bg-g{display:grid;gap:12px;margin-top:24px;grid-template-columns:repeat(auto-fill,minmax(260px,1fr))}
.bc{background:${C.paper};border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:10px}
.bc-img{height:220px}.bc-img .mv-v{object-fit:contain}
.bc-n{font-size:44px}.bc-s div{display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-top:1px solid ${C.contour};font-size:12px}.bc-s dt{color:${C.soft}}
.bc .btn{align-self:flex-start}
.note{margin-top:10px;color:${C.soft}}
.proof{display:grid;border-top:1px solid ${C.contour}}
@media (min-width:900px){.proof{grid-template-columns:repeat(4,1fr)}}
.proof p{padding:22px clamp(12px,3vw,32px);border-bottom:1px solid ${C.contour};font-weight:600;font-size:18px}
.foot{padding:60px clamp(12px,3vw,44px)}.foot-t{font-size:clamp(44px,8vw,120px)}
`;
  return sitePage({
    title: 'Tuskrr, Pressed In (direction 07)',
    description: 'Direction 07 prototype for the Tuskrr website: Pressed In, on the Linear Wilderness theme.',
    css, body, step: 0.125, cap: 0.75,
    fonts: FONTS.archivo + FONTS.plexMono,
  });
}
