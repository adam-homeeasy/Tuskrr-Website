// Direction 01, The Reel (The Entrance). Reference: BASIC/DEPT.
// Film-first hero, masked line reveals, a numbered drag reel of the six bags.
import { BAGS, PROOF, TAGLINE, FONTS, esc, video, photo, render, clip, sitePage, footNotes, stockTag } from './kit.mjs';
import { lockup, monogram } from '../../src/shared.mjs';

const C = { night: '#131110', room: '#1F1B19', bone: '#EFE9E1', smoke: '#A39B91', brass: '#D1A650', threshold: '#F6E3BD' };
const OUT = 'cubic-bezier(0.28,0.44,0.49,1)', HARD = 'cubic-bezier(0.77,0,0.175,1)', SOFT = 'cubic-bezier(0.28,0,0.49,1)';
const lines = (arr, cls = '') => arr.map((l) => `<span class="ln"><span class="li ${cls}" data-r>${esc(l)}</span></span>`).join('');
const FILM = ['jacket', 'corridor', 'enters', 'rooftop', 'door'];

export function build() {
  const film = FILM.map((id, i) => { const c = clip(id); return `<video class="fm-v${i === 0 ? ' on' : ''}" muted playsinline preload="auto" poster="${c.poster}" data-film><source src="${c.src}" type="video/mp4"></video>`; }).join('');
  const cards = BAGS.map((b) => `<article class="card" id="bag-${b.id}">
<div class="card-stage"><i class="door" aria-hidden="true"></i>${render(b, { cls: 'card-img' })}</div>
<div class="card-body"><p class="mono">${b.n} / 06 · ${esc(b.inspired)}</p>
<h3 class="cond card-name">${esc(b.name)}</h3>
<p class="card-line">${esc(b.line)}</p>
<dl class="card-facts"><div><dt>Type</dt><dd>${esc(b.type)}</dd></div><div><dt>Laptop</dt><dd>${esc(b.laptop)} (sample)</dd></div><div><dt>Price</dt><dd>${b.priceText} (sample)</dd></div></dl>
<button class="btn btn-brass" data-add="${esc(b.name)}">Add to bag</button></div></article>`).join('');
  const journal = [
    ['rooftop-1', 'Ten seconds before the pitch', 'What you carry into the room says something before you do.'],
    ['departures-0', 'The Monday flight', 'Bengaluru to Mumbai and back by dinner. A packing list for the day trip.'],
    ['citynight-0', 'Leaving late', 'The walk out is an entrance too. Somebody is always watching the lift doors.'],
    ['bw-profile-0', 'What the first salary buys', 'Five people on the first thing they bought for themselves.'],
  ];
  const body = `
<header class="top"><a href="#top" class="logo" aria-label="Tuskrr, back to top">${lockup()}</a>
<nav class="nav" aria-label="Sections"><a href="#film">Film</a><a href="#reel">The reel</a><a href="#gifting">Gifting</a><a href="#journal">Journal</a></nav>
<a class="bagcount" href="#reel" aria-label="Bag">Bag <span data-count>0</span></a></header>
<main id="top">
<section class="hero" id="film">
${video('corridor', { cls: 'hero-v', alt: 'A man walks down a lit corridor towards a door.' })}
<div class="hero-in">
<p class="mono hero-k" data-r>Tuskrr · Leather bags for the working day</p>
<h1 class="cond hero-h">${lines(['Arrive', 'like you', 'mean it.'])}</h1>
<div class="hero-cta" data-r><button class="btn btn-brass" data-open-film>Watch the film. 30 seconds.</button><a class="btn btn-line" href="#reel">Shop the six</a></div>
</div>
</section>

<section class="state">
<p class="mono" data-r>The idea</p>
<p class="state-t">${lines(['Every day has an entrance.', 'The lobby. The meeting room. The pitch.', 'Ten seconds when you walk in', 'and people look up.'], 'state-l')}</p>
</section>

<section class="reel" id="reel" aria-label="The reel, six bags">
<div class="reel-head"><div><p class="mono" data-r>Six ways in</p><h2 class="cond reel-h">${lines(['The reel'])}</h2></div>
<div class="reel-ctl"><span class="mono count" aria-live="polite"><b data-cur>01</b> / 06</span><button class="rb" data-dir="-1" aria-label="Previous bag">←</button><button class="rb" data-dir="1" aria-label="Next bag">→</button></div></div>
<div class="track" data-track tabindex="0" aria-label="Drag or scroll through six bags">${cards}</div>
<p class="mono drag" aria-hidden="true">Drag →</p>
</section>

<section class="proof" aria-label="What comes with every bag">${PROOF.map((p) => `<p data-r>${esc(p)}</p>`).join('')}</section>

<section class="gift" id="gifting">
${photo('gift-0', 'Hands opening a gift box.', { cls: 'gift-img' })}
<div class="gift-in"><p class="mono" data-r>Gifting</p>
<h2 class="cond gift-h">${lines(['For the one', 'who is climbing.'])}</h2>
<p class="gift-t" data-r>A bag goes to every meeting, every flight, every day. Add a note and their initials, embossed. Initials are a custom order, ready in 2 weeks.</p>
<ul class="notes" data-r><li>New role. Arrive like you mean it.</li><li>First job. First real bag.</li><li>Here’s to every room you walk into next.</li></ul>
<a class="btn btn-brass" href="#reel">Choose a bag to gift</a></div>
</section>

<section class="journal" id="journal"><p class="mono" data-r>Journal</p><h2 class="cond reel-h">${lines(['Stories'])}</h2>
<ol class="jl">${journal.map(([img, t, d], i) => `<li class="jr" data-r>${photo(img, '', { cls: 'jr-img' })}<span class="mono">0${i + 1} · Sample story</span><h3 class="jr-t">${esc(t)}</h3><p class="jr-d">${esc(d)}</p></li>`).join('')}</ol></section>
</main>

<footer class="foot"><div class="foot-mark">${monogram('fm')}</div><p class="cond foot-t">${esc(TAGLINE)}</p>
${footNotes({ fg: C.bone, soft: C.smoke, rule: '#3a3430' })}</footer>

<div class="film" role="dialog" aria-modal="true" aria-label="Brand film, stock stand-in" hidden>${film}${stockTag()}<p class="mono film-cap">Brand film stand-in: five stock clips in sequence</p><button class="btn btn-line film-x" data-close-film>Close film</button></div>
<script>(function(){var f=document.querySelector(".film"),vs=[].slice.call(f.querySelectorAll("[data-film]")),i=0,last;
function play(k){vs.forEach(function(v,j){v.classList.toggle("on",j===k);if(j!==k)v.pause()});i=k;vs[k].currentTime=0;var p=vs[k].play();if(p&&p.catch)p.catch(function(){})}
vs.forEach(function(v,j){v.addEventListener("ended",function(){play((j+1)%vs.length)})});
document.querySelector("[data-open-film]").addEventListener("click",function(e){last=e.currentTarget;f.hidden=false;play(0);f.querySelector("[data-close-film]").focus()});
function close(){f.hidden=true;vs.forEach(function(v){v.pause()});if(last)last.focus()}
f.querySelector("[data-close-film]").addEventListener("click",close);document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!f.hidden)close()});
var t=document.querySelector("[data-track]"),cur=document.querySelector("[data-cur]"),cards=[].slice.call(t.children);
function idx(){var x=t.scrollLeft,best=0,d=1e9;cards.forEach(function(c,k){var dd=Math.abs(c.offsetLeft-t.offsetLeft-x);if(dd<d){d=dd;best=k}});return best}
t.addEventListener("scroll",function(){cur.textContent="0"+(idx()+1)},{passive:true});
[].forEach.call(document.querySelectorAll("[data-dir]"),function(b){b.addEventListener("click",function(){var k=Math.max(0,Math.min(cards.length-1,idx()+(+b.getAttribute("data-dir"))));t.scrollTo({left:cards[k].offsetLeft-t.offsetLeft,behavior:document.documentElement.getAttribute("data-motion")==="on"?"smooth":"auto"})})});
var down=false,sx=0,sl=0;t.addEventListener("pointerdown",function(e){if(e.pointerType!=="mouse")return;down=true;sx=e.clientX;sl=t.scrollLeft;t.classList.add("grab")});
addEventListener("pointerup",function(){down=false;t.classList.remove("grab")});t.addEventListener("pointermove",function(e){if(down)t.scrollLeft=sl-(e.clientX-sx)});
})();</script>`;

  const css = `
:root{--rv-dur:.65s;--rv-ease:${OUT};--rv-from:translateY(103%)}
body{background:${C.night};color:${C.bone};font:400 17px/1.55 'Instrument Sans',system-ui,sans-serif}
.cond{font-family:'Instrument Sans',system-ui,sans-serif;font-stretch:75%;font-weight:600;text-transform:uppercase;letter-spacing:-.005em;line-height:.92}
.mono{font:500 12px/1.4 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:${C.smoke}}
.ln{display:block;overflow:hidden;padding-bottom:.04em}
.li{display:block}
.top{position:fixed;inset:0 0 auto 0;z-index:20;display:flex;align-items:center;gap:20px;padding:10px clamp(16px,3vw,40px);background:linear-gradient(${C.night}F2,${C.night}B3);backdrop-filter:blur(8px)}
.logo{display:flex;align-items:center;min-height:44px;color:${C.bone};text-decoration:none}.logo .lockup{font-size:18px}
.nav{display:none;margin-left:auto;gap:4px}.nav a,.bagcount{color:${C.bone};text-decoration:none;font-weight:600;font-size:15px;display:inline-flex;align-items:center;min-height:44px;padding:0 12px}
.nav a:hover,.bagcount:hover{color:${C.brass}}
.bagcount{margin-left:auto;border:1px solid #3a3430}
@media (min-width:820px){.nav{display:flex}.bagcount{margin-left:8px}}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 22px;font:600 16px/1.2 'Instrument Sans',system-ui,sans-serif;border:1px solid transparent;cursor:pointer;text-decoration:none;transition:background-color .25s ${SOFT},color .25s ${SOFT},border-color .25s ${SOFT},transform .25s ${SOFT}}
.btn-brass{background:${C.brass};color:${C.night}}.btn-brass:hover{background:${C.threshold}}
.btn-line{background:transparent;color:${C.bone};border-color:${C.bone}}.btn-line:hover{background:${C.bone};color:${C.night}}
.hero{position:relative;min-height:100svh;display:flex;align-items:flex-end}
.hero-v{position:absolute;inset:0}
.hero-v::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(19,17,16,.94) 0%,rgba(19,17,16,.72) 45%,rgba(19,17,16,.35) 100%);z-index:1}
.hero-in{position:relative;z-index:2;padding:120px clamp(16px,4vw,56px) clamp(40px,7vh,80px);width:100%}
.hero-k{color:${C.bone}}
.hero-h{font-size:clamp(64px,15vw,220px);margin:16px 0 28px}
.hero-cta{display:flex;flex-wrap:wrap;gap:10px}
.state{padding:clamp(80px,14vh,160px) clamp(16px,4vw,56px);max-width:1400px}
.state-t{margin-top:24px;font-size:clamp(30px,4.6vw,64px);line-height:1.08;font-weight:500;letter-spacing:-.02em}
.state-l{padding-bottom:.02em}
.reel{padding:40px 0 60px;border-top:1px solid #2c2724}
.reel-head{display:flex;justify-content:space-between;align-items:flex-end;gap:20px;flex-wrap:wrap;padding:0 clamp(16px,4vw,56px) 28px}
.reel-h{font-size:clamp(56px,10vw,150px);margin-top:10px}
.reel-ctl{display:flex;align-items:center;gap:8px}.count b{color:${C.bone};font-weight:500}
.rb{min-width:48px;min-height:48px;border:1px solid ${C.bone};background:transparent;color:${C.bone};font-size:20px;cursor:pointer;transition:background-color .25s ${SOFT},color .25s ${SOFT},transform .25s ${SOFT}}.rb:hover{background:${C.bone};color:${C.night}}
.track{display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 clamp(16px,4vw,56px) 20px;scrollbar-width:thin;scrollbar-color:${C.smoke} transparent;cursor:grab}
.track.grab{cursor:grabbing;scroll-snap-type:none}
.card{flex:0 0 min(86vw,560px);scroll-snap-align:start;background:${C.room};display:flex;flex-direction:column}
.card-stage{position:relative;aspect-ratio:4/5;overflow:hidden;background:radial-gradient(120% 90% at 50% 40%,#2a2420,${C.night} 70%)}
.door{position:absolute;left:50%;top:0;bottom:0;width:34%;transform:translateX(-50%);background:linear-gradient(90deg,transparent,${C.threshold}14 18%,${C.threshold}40 36%,${C.threshold}66 50%,${C.threshold}40 64%,${C.threshold}14 82%,transparent)}
.card-img{position:absolute;inset:12% 12% 8%}
.card-img .mv-v{filter:drop-shadow(0 30px 40px rgba(0,0,0,.6))}
.card-body{padding:22px 22px 26px;display:flex;flex-direction:column;gap:12px}
.card-name{font-size:clamp(52px,7vw,84px)}
.card-line{font-size:20px}
.card-facts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;border-top:1px solid #3a3430;padding-top:12px}
.card-facts dt{font:500 11px/1.3 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:${C.smoke}}.card-facts dd{font-size:15px}
.card .btn{align-self:flex-start;margin-top:6px}
.drag{padding:0 clamp(16px,4vw,56px)}
.proof{display:grid;grid-template-columns:repeat(2,1fr);border-top:1px solid #2c2724;border-bottom:1px solid #2c2724}
.proof p{padding:28px clamp(16px,3vw,40px);font-size:clamp(18px,2vw,24px);font-weight:600;border-right:1px solid #2c2724}
@media (min-width:900px){.proof{grid-template-columns:repeat(4,1fr)}}
.gift{display:grid;min-height:90svh}
@media (min-width:900px){.gift{grid-template-columns:1.1fr 1fr}}
.gift-img{min-height:60svh}
.gift-in{padding:clamp(40px,8vh,96px) clamp(16px,4vw,56px);display:flex;flex-direction:column;gap:18px;justify-content:center}
.gift-h{font-size:clamp(48px,7vw,110px)}
.gift-t{max-width:44ch;font-size:19px}
.notes li{padding:12px 0;border-top:1px solid #3a3430;font-size:18px;color:${C.threshold}}
.gift .btn{align-self:flex-start}
.journal{padding:clamp(60px,10vh,120px) clamp(16px,4vw,56px)}
.jl{display:grid;gap:28px;margin-top:32px}
@media (min-width:760px){.jl{grid-template-columns:repeat(2,1fr)}}
@media (min-width:1200px){.jl{grid-template-columns:repeat(4,1fr)}}
.jr{display:flex;flex-direction:column;gap:10px}.jr-img{aspect-ratio:3/2}
.jr-t{font-size:24px;line-height:1.2;font-weight:600}.jr-d{color:${C.smoke}}
.foot{padding:80px clamp(16px,4vw,56px) 60px;border-top:1px solid #2c2724}
.foot-mark{width:88px;color:${C.brass}}.fm{width:100%}
.foot-t{font-size:clamp(44px,8vw,120px);margin:24px 0 20px}
.film{position:fixed;inset:0;z-index:50;background:#000;display:flex;align-items:center;justify-content:center}
.film[hidden]{display:none}
.fm-v{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 1s ${HARD}}.fm-v.on{opacity:1}
.film-cap{position:absolute;left:16px;top:18px;color:${C.bone};background:#000;padding:6px 8px}
.film-x{position:absolute;right:16px;top:12px;background:#000}
.film .tagx{left:16px;bottom:16px}
`;
  return sitePage({
    title: 'Tuskrr, The Reel (direction 01)',
    description: 'Direction 01 prototype for the Tuskrr website: The Reel, on The Entrance theme.',
    css, body, step: 0.1, cap: 0.6,
    fonts: FONTS.instrumentSans + FONTS.plexMono,
  });
}
