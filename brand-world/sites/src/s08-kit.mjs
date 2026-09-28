// Direction 08, Everyday Kit (Linear Wilderness, High Ground palette).
// Reference: Bread & Boxers. A proof ticker, serif occasion banners with
// people in cities, product rails, and a gift pair. No discount stories.
import { BAGS, PROOF, TAGLINE, FONTS, esc, video, photo, inr, sitePage, footNotes } from './kit.mjs';
import { wordmark, monogram } from '../../src/shared.mjs';

const C = { sand: '#EBDDC7', card: '#F4EADB', bark: '#221610', barkL: '#2E1E16', terra: '#A2432A', ember: '#E39A5B', soft: '#5A4636', dry: '#B9A68C' };
const EASE = 'cubic-bezier(.4,0,.2,1)';
const by = Object.fromEntries(BAGS.map((b) => [b.id, b]));

// A thin ridgeline that rises at each product position.
function ridge(seed = 1, peaks = 3) {
  const pts = [];
  for (let i = 0; i <= 120; i++) {
    const x = i / 120;
    const y = 30 - 12 * Math.sin(x * Math.PI * peaks + seed) * Math.sin(x * 7.3 + seed * 2) - 6 * Math.sin(x * 23 + seed);
    pts.push(`${(x * 1200).toFixed(1)},${y.toFixed(1)}`);
  }
  return `<svg class="ridge" viewBox="0 0 1200 60" preserveAspectRatio="none" aria-hidden="true"><polyline points="${pts.join(' ')}" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>`;
}
const card = (b) => `<article class="kc" data-r><div class="kc-img"><div class="mv mv-render"><img class="mv-v" src="${b.img}" alt="${esc(b.name)}, ${esc(b.type.toLowerCase())}" decoding="async"><span class="tagx">Supplied render</span></div></div>
<div class="kc-b"><p class="kc-n">${esc(b.name)}</p><p class="kc-t">${esc(b.type)}, ${esc(b.laptop)} (sample)</p><p class="kc-p">${b.priceText} <span>sample price</span></p><button class="btn btn-terra" data-add="${esc(b.name)}">Add to bag</button></div></article>`;
const rail = (title, ids, id) => `<section class="rail" id="${id}"><div class="rail-h"><h2 class="serif rail-t" data-r>${esc(title)}</h2><p class="rail-c">${ids.length} bags</p></div><div class="rail-g">${ids.map((i) => card(by[i])).join('')}</div></section>`;
const banner = (media, kicker, title, text, href, cta) => `<section class="ban">${media}<div class="ban-in"><p class="kick" data-r>${esc(kicker)}</p><h2 class="serif ban-t" data-r>${title}</h2><p class="ban-s" data-r>${esc(text)}</p><a class="btn btn-sand" href="${href}" data-r>${esc(cta)}</a></div></section>${ridge(href.length, 3)}`;

export function build() {
  const tick = [...PROOF, 'Made for the working day', TAGLINE];
  const pairTotal = by.strata.price + by.contour.price;
  const body = `
<div class="tick" aria-label="What comes with every bag"><div class="tick-r">${[0, 1].map((k) => `<div class="tick-s"${k ? ' aria-hidden="true"' : ''}>${tick.map((t) => `<span class="tm">${monogram('tmk')}</span><span>${esc(t)}</span>`).join('')}</div>`).join('')}</div></div>
<header class="top"><a class="logo" href="#top" aria-label="Tuskrr, back to top">${wordmark('wm')}</a>
<nav class="nav" aria-label="Sections"><a href="#workday">Workday</a><a href="#flight">Flight</a><a href="#weekend">Weekend</a><a href="#pair">Gifts</a></nav>
<a class="bagcount" href="#workday" aria-label="Bag">Bag (<span data-count>0</span>)</a></header>
<main id="top">
<section class="hero">${video('bw-work', { cls: 'hero-v', alt: 'A young professional working outdoors on a laptop.' })}
<div class="hero-in"><p class="kick" data-r>Everyday kit · AW26</p><h1 class="serif hero-h" data-r>For the workday.<br><em>And the one after that.</em></h1><p class="ban-s" data-r>Six leather bags built for the commute, the meeting, the flight and the weekend. ${esc(TAGLINE)}</p><div class="row" data-r><a class="btn btn-sand" href="#workday">Shop the workday</a><a class="btn btn-ghost" href="#pair">Find a gift</a></div></div></section>
${ridge(2, 4)}
${rail('For the workday', ['ridge', 'strata', 'contour'], 'workday')}
${banner(video('boarding', { cls: 'ban-v', alt: 'Passengers boarding a plane.' }), 'Monday, 6:40 am', 'For the Monday flight.', 'Bengaluru to Mumbai and back by dinner. A weekender for the overnight, a sling for the gate.', '#flight', 'Shop the flight')}
${rail('For the flight', ['traverse', 'axis'], 'flight')}
${banner(photo('hikers-0', 'Two people walking up a grassy hill.', { cls: 'ban-v' }), 'Saturday', 'Out of the city<br>by ten.', 'A backpack that is as good on a hill as it is in a lift.', '#weekend', 'Shop the weekend')}
${rail('For the weekend', ['crest', 'traverse'], 'weekend')}
<section class="pair" id="pair"><div class="pair-t"><p class="kick" data-r>Gift set</p><h2 class="serif pair-h" data-r>The Pair.</h2><p class="ban-s" data-r>STRATA and CONTOUR, for the new job. The briefcase for the room where it gets decided, the folio for everything in between. Add a note and their initials, ready in 2 weeks.</p>
<p class="pair-p" data-r>${inr(pairTotal)} for both <span>(sample prices)</span></p><button class="btn btn-terra" data-add="The Pair" data-r>Add The Pair</button></div>
<div class="pair-v" data-r><img src="${by.strata.img}" alt="STRATA" decoding="async"><img src="${by.contour.img}" alt="CONTOUR" decoding="async"><span class="tagx">Supplied renders</span></div></section>
${banner(photo('gift-0', 'Opening a gift box.', { cls: 'ban-v' }), 'For someone else', 'I see who<br>you’re becoming.', 'A gift that goes to every meeting, every flight, every day.', '#pair', 'See The Pair')}
<section class="basics"><h2 class="serif rail-t" data-r>Back to the point</h2><div class="bs-g">${PROOF.map((p, i) => `<div class="bs" data-r><span class="bs-n serif">${i + 1}</span><p>${esc(p)}</p></div>`).join('')}</div></section>
<section class="news"><h2 class="serif rail-t" data-r>Letters from the road</h2><p class="ban-s" data-r>One email a month. New bags, real people, no countdowns.</p><form class="nf" data-r onsubmit="this.querySelector('button').textContent='Thanks, you are on the list';return false"><label class="sr" for="em">Email address</label><input id="em" type="email" class="nf-i" placeholder="you@work.com" autocomplete="email"><button class="btn btn-terra" type="submit">Sign up</button></form></section>
</main>
<footer class="foot">${wordmark('fwm')}${footNotes({ fg: C.sand, soft: C.dry, rule: '#4a382c' })}</footer>
<script>(function(){var t=document.querySelector(".tick");if(document.documentElement.getAttribute("data-motion")!=="on")t.classList.add("still")})();</script>`;

  const css = `
:root{--rv-dur:.3s;--rv-ease:${EASE};--rv-from:translateY(16px)}
body{background:${C.sand};color:${C.bark};font:400 17px/1.55 'Hanken Grotesk',system-ui,sans-serif}
.serif{font-family:'Instrument Serif',Georgia,serif;font-weight:400;line-height:1;letter-spacing:-.01em}
.serif em{font-style:italic;color:${C.terra}}
.kick{font:600 13px/1.4 'Hanken Grotesk',sans-serif;letter-spacing:.12em;text-transform:uppercase}
.tick{background:${C.barkL};color:${C.sand};overflow:hidden;white-space:nowrap;font-size:14px}
.tick-r{display:flex;width:max-content;animation:run 50s linear infinite}
.tick:hover .tick-r{animation-play-state:paused}
.tick.still .tick-r{animation:none}
.tick-s{display:flex;align-items:center;gap:14px;padding:10px 7px}
.tm{width:18px;color:${C.ember}}.tmk{width:100%}
@keyframes run{to{transform:translateX(-50%)}}
.top{position:sticky;top:0;z-index:20;display:flex;align-items:center;gap:10px;padding:6px clamp(16px,3vw,40px);background:${C.sand};border-bottom:1px solid #D6C3A5}
.logo{display:flex;align-items:center;min-height:44px;color:${C.bark}}.wm{height:22px;width:auto}
.nav{display:none;margin:0 auto}.nav a,.bagcount{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;color:${C.bark};text-decoration:none;font-weight:600}
.nav a:hover,.bagcount:hover{color:${C.terra}}.bagcount{margin-left:auto}
@media (min-width:860px){.nav{display:flex}.bagcount{margin-left:0}}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 22px;border-radius:40px;font:600 15px/1.2 'Hanken Grotesk',sans-serif;border:1px solid transparent;cursor:pointer;text-decoration:none;transition:background-color .15s ${EASE},color .15s ${EASE},border-color .15s ${EASE},transform .15s ${EASE}}
.btn-terra{background:${C.terra};color:#FFF7EC}.btn-terra:hover{background:${C.bark}}
.btn-sand{background:${C.sand};color:${C.bark}}.btn-sand:hover{background:${C.card}}
.btn-ghost{background:transparent;color:${C.sand};border-color:${C.sand}}.btn-ghost:hover{background:${C.sand};color:${C.bark}}
.row{display:flex;flex-wrap:wrap;gap:8px}
.hero,.ban{position:relative;min-height:88svh;display:flex;align-items:flex-end;color:${C.sand};overflow:hidden}
.ban{min-height:72svh}
.hero-v,.ban-v{position:absolute;inset:0}
.hero-v::after,.ban-v::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(34,22,16,.9) 0%,rgba(34,22,16,.66) 45%,rgba(34,22,16,.18) 100%);z-index:1}
.hero-in,.ban-in{position:relative;z-index:2;padding:40px clamp(16px,4vw,56px) clamp(32px,6vh,64px);display:flex;flex-direction:column;gap:14px;max-width:880px}
.hero-h{font-size:clamp(56px,9vw,132px)}.hero-h em{color:${C.ember}}
.ban-t{font-size:clamp(52px,8vw,112px)}
.ban-s{font-size:18px;max-width:46ch}
.ban-in .btn,.hero-in .row{align-self:flex-start}
.ridge{display:block;width:100%;height:40px;color:${C.terra}}
.rail{padding:clamp(32px,6vh,64px) 0 clamp(40px,7vh,72px)}
.rail-h{display:flex;justify-content:space-between;align-items:baseline;gap:12px;padding:0 clamp(16px,4vw,56px) 18px}
.rail-t{font-size:clamp(40px,5.5vw,76px)}.rail-c{color:${C.soft}}
.rail-g{display:grid;grid-auto-flow:column;grid-auto-columns:min(78vw,340px);gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding:0 clamp(16px,4vw,56px) 10px}
@media (min-width:1100px){.rail-g{grid-auto-flow:row;grid-template-columns:repeat(3,1fr);overflow:visible}}
.kc{background:${C.card};border-radius:14px;scroll-snap-align:start;display:flex;flex-direction:column;overflow:hidden}
.kc-img{position:relative;aspect-ratio:1;padding:12%}.kc-img .mv{height:100%}
.kc-b{padding:14px 18px 20px;display:flex;flex-direction:column;gap:4px;flex:1}
.kc-n{font-weight:700;letter-spacing:.06em;font-size:18px}.kc-t{color:${C.soft};font-size:15px}
.kc-p{font-weight:700;margin:6px 0 10px}.kc-p span{font-weight:400;color:${C.soft};font-size:13px}
.kc .btn{align-self:flex-start;margin-top:auto}
.pair{display:grid;background:${C.card}}
@media (min-width:900px){.pair{grid-template-columns:1fr 1fr;align-items:center}}
.pair-t{padding:clamp(40px,8vh,96px) clamp(16px,4vw,56px);display:flex;flex-direction:column;gap:14px}
.pair-h{font-size:clamp(70px,11vw,160px);color:${C.terra}}
.pair-p{font-weight:700;font-size:20px}.pair-p span{font-weight:400;font-size:14px;color:${C.soft}}
.pair-t .btn{align-self:flex-start}
.pair-v{position:relative;display:flex;align-items:flex-end;justify-content:center;gap:4%;padding:40px 16px}
.pair-v img{width:44%;object-fit:contain;filter:drop-shadow(0 18px 20px rgba(34,22,16,.25))}
.basics,.news{padding:clamp(48px,8vh,96px) clamp(16px,4vw,56px)}
.bs-g{display:grid;gap:12px;margin-top:20px}
@media (min-width:900px){.bs-g{grid-template-columns:repeat(4,1fr)}}
.bs{background:${C.card};border-radius:14px;padding:20px;display:flex;flex-direction:column;gap:8px;font-weight:600;font-size:18px}
.bs-n{font-size:56px;color:${C.terra}}
.news{border-top:1px solid #D6C3A5;display:flex;flex-direction:column;gap:12px}
.nf{display:flex;flex-wrap:wrap;gap:8px;max-width:560px}
.nf-i{flex:1 1 240px;min-height:48px;border-radius:40px;border:1px solid ${C.bark};background:${C.card};padding:10px 18px;font:400 16px 'Hanken Grotesk',sans-serif;color:${C.bark}}
.nf-i::placeholder{color:${C.soft};opacity:1}
.foot{background:${C.barkL};color:${C.sand};padding:56px clamp(16px,4vw,56px) 64px}.fwm{height:30px;width:auto;color:${C.sand}}
@media (prefers-reduced-motion:reduce){.tick-r{animation:none}}
`;
  return sitePage({
    title: 'Tuskrr, Everyday Kit (direction 08)',
    description: 'Direction 08 prototype for the Tuskrr website: Everyday Kit, on the Linear Wilderness theme.',
    css, body, step: 0.125, cap: 0.75,
    fonts: FONTS.instrumentSerif + FONTS.hanken + FONTS.plexMono,
  });
}
