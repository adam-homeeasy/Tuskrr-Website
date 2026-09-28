// Direction 03, The Roster (The Entrance). Reference: OFFFORM.
// Faces first. The people who carry the bags are the roster; each bag has a
// sheet with mono specs and the faces who chose it.
import { BAGS, PROOF, TAGLINE, FONTS, esc, video, photo, still, sitePage, footNotes } from './kit.mjs';
import { wordmark, monogram } from '../../src/shared.mjs';

const C = { night: '#131110', room: '#1F1B19', bone: '#EFE9E1', smoke: '#A39B91', cognac: '#C27442' };
const UI = 'cubic-bezier(0.22,1,0.36,1)', REV = 'cubic-bezier(0.76,0,0.24,1)';
// Sample profiles for layout only. Faces are stock stand-ins, not these people.
const ROSTER = [
  ['study-0', 'Rohan', 26, 'Analyst', 'Pune', 'strata'],
  ['writer-0', 'Meera', 25, 'Product designer', 'Bengaluru', 'crest'],
  ['caller-0', 'Kabir', 29, 'Consultant', 'Mumbai', 'traverse'],
  ['bw-think-0', 'Ananya', 27, 'Founder', 'Hyderabad', 'axis'],
  ['p-phone-man', 'Arjun', 24, 'Developer', 'Bengaluru', 'ridge'],
  ['bw-profile-0', 'Zoya', 30, 'Editor', 'Delhi NCR', 'contour'],
  ['rooftop-0', 'Vikram', 32, 'Finance', 'Mumbai', 'strata'],
  ['bw-phone-0', 'Tara', 28, 'Marketing', 'Pune', 'ridge'],
  ['p-portrait-man', 'Dev', 31, 'Architect', 'Bengaluru', 'traverse'],
];
const split = (name) => { const k = Math.ceil(name.length / 2); return `<span aria-hidden="true">${esc(name.slice(0, k))}<span class="gap"></span>${esc(name.slice(k))}</span><span class="sr">${esc(name)}</span>`; };

export function build() {
  const byBag = (id) => ROSTER.filter((r) => r[5] === id);
  const rows = ROSTER.map((r, i) => `<li class="ir" data-r><span class="ir-n">${String(i + 1).padStart(2, '0')}</span><span class="ir-name">${esc(r[1])}</span><span class="ir-m">${r[2]}</span><span class="ir-m">${esc(r[3])}</span><span class="ir-m">${esc(r[4])}</span><span class="ir-bag">${esc(BAGS.find((b) => b.id === r[5]).name)}</span><span class="ir-pic">${photo(r[0], `${r[1]}, sample profile`, { label: false })}</span></li>`).join('');
  const cards = ROSTER.map((r) => `<figure class="face"><div class="face-img clip" data-r>${photo(r[0], `${r[1]}, sample profile`)}</div><figcaption><b>${esc(r[1])}, ${r[2]}</b><span>${esc(r[3])}, ${esc(r[4])}</span><span class="c">Carries ${esc(BAGS.find((b) => b.id === r[5]).name)}</span></figcaption></figure>`).join('');
  const sheets = BAGS.map((b) => `<article class="sheet" id="bag-${b.id}">
<header class="sh-h"><span class="mono">Sheet ${b.n} / 06</span><span class="mono">Reading: ${esc(b.inspired)}</span></header>
<h3 class="cond sh-name">${split(b.name)}</h3>
<div class="sh-body"><div class="mv mv-render sh-img"><img class="mv-v" src="${b.img}" alt="${esc(b.name)}, ${esc(b.type.toLowerCase())}" decoding="async"><span class="tagx">Supplied render</span></div>
<dl class="sh-spec"><div><dt>Type</dt><dd>${esc(b.type)}</dd></div><div><dt>Finish</dt><dd>${esc(b.finish)}</dd></div><div><dt>Laptop</dt><dd>${esc(b.laptop)} (sample)</dd></div><div><dt>Price</dt><dd>${b.priceText} (sample)</dd></div><div><dt>Line</dt><dd>${esc(b.line)}</dd></div></dl></div>
<div class="sh-foot"><div class="chosen"><span class="mono">Chosen by ${byBag(b.id).length}</span><span class="av">${byBag(b.id).map((r) => `<img src="${still(r[0])}" alt="${esc(r[1])}" decoding="async">`).join('')}</span></div><button class="btn btn-cog" data-add="${esc(b.name)}">Sign ${esc(b.name)}</button></div>
</article>`).join('');
  const body = `
<header class="top"><a class="logo" href="#top" aria-label="Tuskrr, back to top">${wordmark('wm')}</a>
<nav class="nav mono" aria-label="Sections"><a href="#roster">Roster</a><a href="#sheets">Bags</a><a href="#join">Join</a></nav>
<a class="bagcount mono" href="#sheets" aria-label="Bag">Bag (<span data-count>0</span>)</a></header>
<main id="top">
<section class="hero">
<div class="loop" aria-label="Three portraits from the roster, stock stand-ins">${['study-0', 'writer-0', 'p-phone-man'].map((id, i) => `<img class="lp lp${i}" src="${still(id)}" alt="" decoding="async">`).join('')}<span class="tagx">Stock stand-in</span></div>
<div class="hero-t"><p class="mono" data-r>Tuskrr · The roster · AW26</p>
<h1 class="cond hero-h" data-r><span aria-hidden="true">Arrive</span><span class="sr">Arrive like you mean it.</span><span aria-hidden="true" class="h2">like you</span><span aria-hidden="true" class="h3">mean it.</span></h1>
<p class="hero-s" data-r>Nine people who walk in like they mean it, and the bag each one chose.</p>
<div class="row" data-r><a class="btn btn-cog" href="#roster">Meet the roster</a><a class="btn btn-line" href="#sheets">See the six bags</a></div></div>
</section>

<section class="index" id="roster"><header class="sec-h"><h2 class="cond sec-t" data-r><span aria-hidden="true">Ros<span class="gap"></span>ter</span><span class="sr">Roster</span></h2><p class="mono" data-r>Sample profiles · faces are stock stand-ins</p></header>
<ol class="il"><li class="ir ir-head mono" aria-hidden="true"><span>No.</span><span>Name</span><span>Age</span><span>Work</span><span>City</span><span>Carries</span></li>${rows}</ol>
<div class="faces">${cards}</div></section>

<section class="band">${video('bw-profile', { cls: 'band-v', alt: 'A woman checks her watch.' })}<blockquote class="band-q" data-r><p class="cond">“Where’s that from?”</p><footer class="mono">The question every roster member gets asked</footer></blockquote></section>

<section class="sheets" id="sheets"><header class="sec-h"><h2 class="cond sec-t" data-r>Six bags, signed</h2><p class="mono" data-r>Each one chosen by someone on the roster</p></header><div class="sh-g">${sheets}</div></section>

<section class="proof">${PROOF.map((p, i) => `<p data-r><span class="mono">0${i + 1}</span>${esc(p)}</p>`).join('')}</section>

<section class="join" id="join"><div class="join-in"><span class="jm">${monogram('jmk')}</span><h2 class="cond join-h" data-r>Join the roster</h2><p class="join-t" data-r>Carrying a Tuskrr? Send us your entrance: where you walk in, what you do, and which bag. We sign a new face every month.</p><a class="btn btn-night" href="#top">Send your entrance</a></div></section>
</main>
<footer class="foot"><p class="cond foot-t">${esc(TAGLINE)}</p>${footNotes({ fg: C.bone, soft: C.smoke, rule: '#3a3430' })}</footer>`;

  const css = `
:root{--rv-dur:.65s;--rv-ease:${REV};--rv-from:translateY(12px)}
body{background:${C.night};color:${C.bone};font:400 16px/1.55 'IBM Plex Mono',ui-monospace,monospace}
.cond{font-family:'Instrument Sans',system-ui,sans-serif;font-stretch:75%;font-weight:600;text-transform:uppercase;line-height:.9;letter-spacing:-.01em}
.mono{font:500 14px/1.4 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.045em;text-transform:uppercase;color:${C.smoke}}
.gap{display:inline-block;width:.35em}
html[data-motion=on] .clip[data-r]:not(.r-in){opacity:1;transform:none;clip-path:inset(0 0 100% 0)}
html[data-motion=on] .clip[data-r].r-in{transition:clip-path .65s ${REV};transition-delay:var(--d,0s);clip-path:inset(0)}
.top{position:fixed;inset:0 0 auto;z-index:20;display:flex;align-items:center;gap:12px;padding:8px clamp(16px,3vw,40px);background:${C.night};border-bottom:1px solid #2c2724}
.logo{display:flex;align-items:center;min-height:44px;color:${C.bone}}.wm{height:20px;width:auto}
.nav{display:none;margin-left:auto}.nav a,.bagcount{display:inline-flex;align-items:center;min-height:44px;padding:0 12px;color:${C.bone};text-decoration:none}
.nav a:hover,.bagcount:hover{color:${C.cognac}}
.bagcount{margin-left:auto}
@media (min-width:760px){.nav{display:flex}.bagcount{margin-left:0}}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 20px;font:600 14px/1.2 'IBM Plex Mono',monospace;letter-spacing:.05em;text-transform:uppercase;border:1px solid transparent;cursor:pointer;text-decoration:none;transition:background-color .22s ease,color .22s ease,border-color .22s ease,transform .35s ${UI}}
.btn:hover{transform:translateY(-2px)}
.btn-cog{background:${C.cognac};color:${C.night}}.btn-line{border-color:${C.bone};color:${C.bone};background:transparent}.btn-night{background:${C.night};color:${C.bone}}
.row{display:flex;flex-wrap:wrap;gap:8px}
.hero{display:grid;min-height:100svh;padding-top:61px}
@media (min-width:900px){.hero{grid-template-columns:1.1fr 1fr}.loop{min-height:62svh}}
.loop{position:relative;min-height:46svh;overflow:hidden;background:${C.room}}
.lp{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0}
.lp0{opacity:1}
html[data-motion=on] .lp{animation:lp 9s linear infinite}
html[data-motion=on] .lp1{animation-delay:3s}html[data-motion=on] .lp2{animation-delay:6s}
@keyframes lp{0%{opacity:0}4%{opacity:1}29%{opacity:1}33.333%{opacity:0}100%{opacity:0}}
html[data-motion=on] .lp0{opacity:0}
.hero-t{padding:clamp(28px,6vh,72px) clamp(16px,4vw,56px);display:flex;flex-direction:column;justify-content:flex-end;gap:20px}
.hero-h{font-size:clamp(76px,13vw,200px);display:flex;flex-direction:column}
.hero-h .h2,.hero-h .h3{display:block}.hero-h .h3{color:${C.cognac}}
.hero-s{font-size:17px;max-width:40ch}
.index,.sheets{padding:clamp(60px,10vh,120px) clamp(16px,4vw,56px)}
.sec-h{display:flex;justify-content:space-between;align-items:flex-end;flex-wrap:wrap;gap:12px;margin-bottom:28px}
.sec-t{font-size:clamp(64px,11vw,170px)}
.il{border-top:1px solid #3a3430}
.ir{display:grid;grid-template-columns:40px 1fr auto;gap:4px 12px;align-items:center;padding:12px 0;border-bottom:1px solid #3a3430;position:relative;font-size:15px;text-transform:uppercase;letter-spacing:.03em}
.ir .ir-m{display:none}.ir-n{color:${C.smoke}}.ir-bag{color:${C.cognac};font-weight:600}
.ir-name{font-weight:600}
.ir-pic{display:none}
.ir-head{display:none}
@media (min-width:900px){
.ir{grid-template-columns:60px 1.2fr 60px 1.4fr 1fr 1fr}.ir .ir-m{display:block}.ir-head{display:grid;color:${C.smoke}}
.ir-pic{display:block;position:absolute;right:22%;top:50%;width:180px;aspect-ratio:3/4;transform:translateY(-50%) scale(.96);opacity:0;pointer-events:none;z-index:5;transition:opacity .22s ease,transform .35s ${UI}}
.ir-pic .mv{height:100%}
.ir:hover .ir-pic{opacity:1;transform:translateY(-50%) scale(1)}
.ir:hover{color:${C.cognac}}}
.faces{display:grid;grid-template-columns:repeat(2,1fr);gap:12px;margin-top:40px}
@media (min-width:900px){.faces{grid-template-columns:repeat(3,1fr)}}
@media (min-width:1300px){.faces{grid-template-columns:repeat(5,1fr)}}
.face-img{aspect-ratio:3/4}.face-img .mv{height:100%}
.face figcaption{display:flex;flex-direction:column;padding-top:8px;font-size:14px;text-transform:uppercase;letter-spacing:.03em}
.face figcaption span{color:${C.smoke}}.face figcaption .c{color:${C.cognac}}
.band{position:relative;min-height:80svh;display:flex;align-items:flex-end}
.band-v{position:absolute;inset:0}.band-v::after{content:"";position:absolute;inset:0;background:linear-gradient(0deg,rgba(19,17,16,.92),rgba(19,17,16,.4) 60%,rgba(19,17,16,.2));z-index:1}
.band-q{position:relative;z-index:2;padding:40px clamp(16px,4vw,56px)}
.band-q p{font-size:clamp(60px,11vw,170px)}
.sh-g{display:grid;gap:14px}
@media (min-width:900px){.sh-g{grid-template-columns:repeat(2,1fr)}}
.sheet{border:1px solid #3a3430;padding:18px;display:flex;flex-direction:column;gap:14px;background:${C.room}}
.sh-h{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
.sh-name{font-size:clamp(64px,9vw,120px)}
.sh-body{display:grid;gap:14px}
@media (min-width:560px){.sh-body{grid-template-columns:1fr 1fr;align-items:center}}
.sh-img{height:260px}.sh-img .mv-v{object-fit:contain}
.sh-spec div{display:grid;grid-template-columns:80px 1fr;gap:8px;padding:8px 0;border-top:1px solid #3a3430;font-size:14px}
.sh-spec dt{color:${C.smoke};text-transform:uppercase;letter-spacing:.05em}
.sh-foot{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
.chosen{display:flex;align-items:center;gap:10px}.av{display:flex}.av img{width:40px;height:40px;border-radius:50%;object-fit:cover;border:2px solid ${C.room};margin-left:-8px}
.proof{display:grid;grid-template-columns:1fr;border-top:1px solid #3a3430}
@media (min-width:760px){.proof{grid-template-columns:repeat(4,1fr)}}
.proof p{padding:22px clamp(16px,3vw,32px);border-bottom:1px solid #3a3430;display:flex;gap:12px;font-size:15px;text-transform:uppercase;letter-spacing:.03em}
.join{background:${C.cognac};color:${C.night}}
.join-in{padding:clamp(60px,10vh,120px) clamp(16px,4vw,56px);max-width:1000px;display:flex;flex-direction:column;gap:18px;align-items:flex-start}
.jm{width:70px;color:${C.night}}.jmk{width:100%}
.join-h{font-size:clamp(60px,10vw,150px)}.join-t{font-size:17px;max-width:48ch}
.foot{padding:60px clamp(16px,4vw,56px)}.foot-t{font-size:clamp(44px,8vw,120px);margin-bottom:10px}
`;
  return sitePage({
    title: 'Tuskrr, The Roster (direction 03)',
    description: 'Direction 03 prototype for the Tuskrr website: The Roster, on The Entrance theme.',
    css, body, step: 0.04, cap: 0.24,
    fonts: FONTS.instrumentSans + FONTS.plexMono,
  });
}
