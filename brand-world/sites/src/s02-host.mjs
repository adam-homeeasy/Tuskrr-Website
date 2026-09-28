// Direction 02, The Host (The Entrance). Reference: Brunello Cucinelli "Callimacus".
// No catalogue first: a host at the door. Tap a cue or type where you are
// headed; the answer assembles as glass blocks in a dark room.
import { BAGS, PROOF, TAGLINE, FONTS, esc, video, photo, still, sitePage, footNotes } from './kit.mjs';
import { monogram, lockup } from '../../src/shared.mjs';

const C = { night: '#131110', room: '#1F1B19', bone: '#EFE9E1', smoke: '#A39B91', cognac: '#C27442', brass: '#D1A650', threshold: '#F6E3BD' };
const EASE = 'cubic-bezier(0.42,0,0.58,1)';
const by = Object.fromEntries(BAGS.map((b) => [b.id, b]));

// Rules-based finder: the stand-in for asset F5 (finder logic, to write with Tuskrr).
const ANSWERS = [
  { key: 'job', cue: 'First day at a new job', words: 'job new first joining office start', bag: 'ridge', scene: 'bw-walk-0', why: 'For a first day: RIDGE. A backpack that looks like you already belong there.', also: ['strata', 'contour'] },
  { key: 'flight', cue: 'Flying to Mumbai on Monday', words: 'fly flight flying travel trip mumbai delhi airport weekend away', bag: 'traverse', scene: 'boarding-0', why: 'For Monday’s flight: TRAVERSE. Made for the distance between here and there.', also: ['axis', 'ridge'] },
  { key: 'room', cue: 'The meeting where it gets decided', words: 'meeting pitch client board room decided presentation interview', bag: 'strata', scene: 'caller-0', why: 'For the room where it gets decided: STRATA. Built in layers.', also: ['contour', 'ridge'] },
  { key: 'weekend', cue: 'Out of the city this weekend', words: 'weekend trek hike hills out city road', bag: 'crest', scene: 'hikers-0', why: 'For the weekend: CREST. Rise above ordinary.', also: ['traverse', 'axis'] },
  { key: 'light', cue: 'Just my phone, keys and a card', words: 'light phone keys card minimal small nothing', bag: 'axis', scene: 'enters-0', why: 'For a light day: AXIS. Nothing unnecessary.', also: ['contour', 'crest'] },
  { key: 'gift', cue: 'A gift for someone climbing', words: 'gift present promotion birthday anniversary partner sister brother someone', bag: 'contour', scene: 'gift-box-0', why: 'For someone climbing: CONTOUR, with their initials pressed in. Protection, shaped beautifully.', also: ['strata', 'ridge'], gift: true },
];

export function build() {
  const answers = ANSWERS.map((a, i) => {
    const b = by[a.bag];
    return (i ? (h) => h.replace(/ data-r>/g, ' data-rr>') : (h) => h)(`<article class="ans" data-ans="${a.key}"${i ? ' hidden' : ''} aria-label="Answer: ${esc(b.name)}">
<div class="blk blk-main glass" data-r><div class="am-stage"><i class="door" aria-hidden="true"></i><div class="mv mv-render am-img"><img class="mv-v" src="${b.img}" alt="${esc(b.name)}, ${esc(b.type.toLowerCase())}" decoding="async"><span class="tagx">Supplied render</span></div></div>
<div class="am-body"><p class="mono">The host suggests</p><p class="am-why">${esc(a.why)}</p>
<dl class="facts"><div><dt>Type</dt><dd>${esc(b.type)}</dd></div><div><dt>Laptop</dt><dd>${esc(b.laptop)} (sample)</dd></div><div><dt>Price</dt><dd>${b.priceText} (sample)</dd></div></dl>
<div class="row"><button class="btn btn-cog" data-add="${esc(b.name)}">Add ${esc(b.name)} to bag</button><a class="btn btn-line" href="#all">See all six</a></div></div></div>
<div class="blk blk-scene" data-r>${photo(a.scene, '', { cls: 'scene-img' })}<p class="scene-cap">${a.gift ? 'Every day they carry it, they think of you.' : 'Where it goes next.'}</p></div>
${a.gift ? `<div class="blk glass blk-gift" data-r><p class="mono">Make it theirs</p><p class="gift-q">Their initials, pressed into the leather.</p>
<div class="initials" aria-hidden="true"><span data-ini>A K</span></div>
<label class="lab" for="ini">Initials (up to 3 letters)</label><input id="ini" class="field" maxlength="3" value="AK" autocomplete="off" data-ini-in>
<p class="small">A custom order, ready in 2 weeks. Price to confirm.</p>
<p class="mono" style="margin-top:14px">Add a note</p><ul class="notes"><li>New role. Arrive like you mean it.</li><li>Here’s to every room you walk into next.</li></ul></div>` : ''}
<div class="blk blk-also" data-r><p class="mono">Also for this</p><div class="also">${a.also.map((id) => { const o = by[id]; return `<div class="also-c glass"><img src="${o.img}" alt="${esc(o.name)}" decoding="async"><p><b>${esc(o.name)}</b><span>${o.priceText}</span></p></div>`; }).join('')}</div></div>
</article>`);
  }).join('');

  const body = `
<header class="top"><a class="logo" href="#top" aria-label="Tuskrr, back to top">${lockup()}</a><a class="bagcount" href="#all" aria-label="Bag">Bag <span data-count>0</span></a></header>
<main id="top">
<section class="room">
${video('citynight', { cls: 'room-v', alt: 'A city at night through a window.' })}
<i class="room-door" aria-hidden="true"></i>
<div class="host">
<p class="mono host-k" data-r>Tuskrr · ${esc(TAGLINE)}</p>
<h1 class="cond host-h" data-r>Where are you headed?</h1>
<form class="prompt glass" data-r role="search" onsubmit="return false"><span class="pm">${monogram('pm-mk')}</span><label class="sr" for="ask">Tell the host where you are headed</label><input id="ask" class="ask" placeholder="Tell us, or tap a cue below" autocomplete="off"><button class="go" type="submit">Ask</button></form>
<div class="cues" data-r role="group" aria-label="Suggested cues">${ANSWERS.map((a, i) => `<button class="cue${i ? '' : ' on'}" data-cue="${a.key}" aria-pressed="${i ? 'false' : 'true'}">${esc(a.cue)}</button>`).join('')}</div>
</div>
</section>
<section class="feed" aria-live="polite">${answers}</section>

<section class="all" id="all"><p class="mono" data-r>Or just browse</p><h2 class="cond all-h" data-r>All six</h2>
<div class="all-g">${BAGS.map((b) => `<div class="all-c glass" data-r><img src="${b.img}" alt="${esc(b.name)}, ${esc(b.type.toLowerCase())}" decoding="async"><p class="all-n cond">${esc(b.name)}</p><p class="all-l">${esc(b.line)}</p><p class="all-p">${b.priceText} <span>(sample)</span></p><button class="btn btn-line" data-add="${esc(b.name)}">Add to bag</button></div>`).join('')}</div>
<p class="small" style="margin-top:14px">Bags are supplied renders.</p></section>

<section class="proof">${PROOF.map((p) => `<p data-r>${esc(p)}</p>`).join('')}</section>
<section class="loop">${video('leather', { cls: 'loop-v', alt: 'Close up of brown leather.' })}<p class="loop-t cond" data-r>Genuine leather. 3 years. Cash on delivery.</p></section>
</main>
<footer class="foot">${footNotes({ fg: C.bone, soft: C.smoke, rule: '#3a3430' })}</footer>
<script>(function(){var cues=[].slice.call(document.querySelectorAll("[data-cue]")),ans=[].slice.call(document.querySelectorAll("[data-ans]")),on=document.documentElement.getAttribute("data-motion")==="on";
var W=${JSON.stringify(Object.fromEntries(ANSWERS.map((a) => [a.key, a.words])))};
function show(k){cues.forEach(function(c){var m=c.getAttribute("data-cue")===k;c.classList.toggle("on",m);c.setAttribute("aria-pressed",m)});ans.forEach(function(a){var m=a.getAttribute("data-ans")===k;a.hidden=!m;if(m){[].forEach.call(a.querySelectorAll("[data-rr]"),function(el){el.removeAttribute("data-rr");el.setAttribute("data-r","")})}if(m&&on){[].forEach.call(a.querySelectorAll("[data-r]"),function(el,i){el.classList.remove("r-in");el.style.setProperty("--d",Math.min(i*0.125,0.75)+"s");void el.offsetWidth;el.classList.add("r-in")})}})}
cues.forEach(function(c){c.addEventListener("click",function(){show(c.getAttribute("data-cue"));document.querySelector(".feed").scrollIntoView({behavior:on?"smooth":"auto",block:"start"})})});
document.querySelector(".prompt").addEventListener("submit",function(){var q=document.getElementById("ask").value.toLowerCase(),best="job",sc=0;Object.keys(W).forEach(function(k){var s=0;W[k].split(" ").forEach(function(w){if(q.indexOf(w)>-1)s++});if(s>sc){sc=s;best=k}});show(best);document.querySelector(".feed").scrollIntoView({behavior:on?"smooth":"auto",block:"start"})});
var ii=document.querySelector("[data-ini-in]"),io=document.querySelector("[data-ini]");if(ii)ii.addEventListener("input",function(){io.textContent=ii.value.toUpperCase().replace(/[^A-Z]/g,"").split("").join(" ")||"A K"});
})();</script>`;

  const css = `
:root{--rv-dur:1s;--rv-ease:${EASE};--rv-from:translateY(16px)}
body{background:${C.night};color:${C.bone};font:400 17px/1.55 'Instrument Sans',system-ui,sans-serif}
.cond{font-family:'Instrument Sans',system-ui,sans-serif;font-stretch:75%;font-weight:600;text-transform:uppercase;line-height:.95}
.mono{font:500 12px/1.4 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.1em;text-transform:uppercase;color:${C.smoke}}
.small{font-size:14px;color:${C.smoke}}
.glass{background:rgba(31,27,25,.78);border:1px solid rgba(239,233,225,.12);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px)}
.top{position:fixed;inset:0 0 auto;z-index:20;display:flex;justify-content:space-between;align-items:center;padding:10px clamp(16px,3vw,40px)}
.logo,.bagcount{display:flex;align-items:center;min-height:44px;color:${C.bone};text-decoration:none;font-weight:600}.logo .lockup{font-size:18px}
.bagcount{padding:0 14px;background:rgba(19,17,16,.8);border:1px solid rgba(239,233,225,.2)}
.btn{display:inline-flex;align-items:center;justify-content:center;min-height:48px;padding:12px 20px;font:600 16px/1.2 'Instrument Sans',system-ui,sans-serif;border:1px solid transparent;cursor:pointer;text-decoration:none;transition:background-color .25s ${EASE},color .25s ${EASE},border-color .25s ${EASE},transform .25s ${EASE}}
.btn-cog{background:${C.cognac};color:${C.night}}.btn-cog:hover{background:${C.threshold}}
.btn-line{background:transparent;color:${C.bone};border-color:rgba(239,233,225,.6)}.btn-line:hover{background:${C.bone};color:${C.night}}
.room{position:relative;min-height:100svh;display:flex;align-items:center;justify-content:center;padding:110px 16px 60px;overflow:hidden}
.room-v{position:absolute;inset:0}
.room-v::after{content:"";position:absolute;inset:0;background:rgba(19,17,16,.82);z-index:1}
.room-door{position:absolute;left:50%;top:0;bottom:0;width:min(30vw,260px);transform:translateX(-50%);z-index:1;background:linear-gradient(90deg,transparent,${C.threshold}10 20%,${C.threshold}30 42%,${C.threshold}42 50%,${C.threshold}30 58%,${C.threshold}10 80%,transparent)}
.host{position:relative;z-index:2;width:min(760px,100%);text-align:center;display:flex;flex-direction:column;align-items:center;gap:22px}
.host-k{color:${C.bone}}
.host-h{font-size:clamp(48px,9vw,120px)}
.prompt{display:flex;align-items:center;gap:10px;width:100%;padding:8px 8px 8px 16px;border-radius:40px}
.pm{width:34px;flex:none;color:${C.brass}}.pm-mk{width:100%}
.ask{flex:1;min-width:0;min-height:48px;background:transparent;border:0;color:${C.bone};font:400 18px/1.3 'Instrument Sans',system-ui,sans-serif;outline:none}
.ask::placeholder{color:${C.smoke};opacity:1}
.prompt:focus-within{border-color:${C.cognac}}
.go{min-height:48px;min-width:64px;border-radius:30px;border:0;background:${C.bone};color:${C.night};font:600 16px 'Instrument Sans',sans-serif;cursor:pointer;transition:background-color .25s ${EASE},transform .25s ${EASE}}.go:hover{background:${C.threshold}}
.cues{display:flex;flex-wrap:wrap;justify-content:center;gap:8px}
.cue{min-height:44px;padding:10px 16px;border-radius:30px;border:1px solid rgba(239,233,225,.35);background:rgba(19,17,16,.7);color:${C.bone};font:500 15px/1.2 'Instrument Sans',sans-serif;cursor:pointer;transition:background-color .25s ${EASE},color .25s ${EASE},border-color .25s ${EASE},transform .25s ${EASE}}
.cue:hover{border-color:${C.cognac}}.cue.on{background:${C.cognac};color:${C.night};border-color:${C.cognac}}
.feed{max-width:1100px;margin:0 auto;padding:40px 16px 80px;scroll-margin-top:70px}
.ans{display:grid;gap:14px}
@media (min-width:900px){.ans{grid-template-columns:1.25fr 1fr}.blk-main{grid-row:span 2}}
.blk{border-radius:18px;overflow:hidden}
.blk-main{display:flex;flex-direction:column}
.am-stage{position:relative;aspect-ratio:5/4;background:radial-gradient(110% 90% at 50% 45%,#2a2420,${C.night} 75%)}
.door{position:absolute;left:50%;top:0;bottom:0;width:36%;transform:translateX(-50%);background:linear-gradient(90deg,transparent,${C.threshold}14 20%,${C.threshold}50 50%,${C.threshold}14 80%,transparent)}
.am-img{position:absolute;inset:10% 18% 8%}.am-img .mv-v{object-fit:contain}
.am-body{padding:22px;display:flex;flex-direction:column;gap:14px}
.am-why{font-size:clamp(22px,2.4vw,30px);line-height:1.2;font-weight:500}
.facts{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;border-top:1px solid rgba(239,233,225,.14);padding-top:12px}
.facts dt{font:500 11px/1.3 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:${C.smoke}}.facts dd{font-size:15px}
.row{display:flex;flex-wrap:wrap;gap:8px}
.blk-scene{position:relative;min-height:260px;background:${C.room}}
.scene-img{position:absolute;inset:0}
.scene-cap{position:absolute;right:12px;bottom:12px;z-index:3;background:${C.night};color:${C.bone};padding:6px 10px;font-size:15px}
.blk-gift{padding:22px;display:flex;flex-direction:column;gap:8px}
.gift-q{font-size:22px;line-height:1.25}
.initials{height:120px;border-radius:12px;display:flex;align-items:center;justify-content:center;background:url(${still('leather-0')}) center/cover}
.initials span{font:700 56px/1 'Instrument Sans',sans-serif;font-stretch:75%;letter-spacing:.06em;color:#5a2f17;text-shadow:0 1px 0 rgba(255,210,170,.35),0 -1px 1px rgba(0,0,0,.55)}
.lab{font-size:14px;color:${C.smoke};margin-top:6px}
.field{min-height:48px;background:rgba(19,17,16,.8);border:1px solid rgba(239,233,225,.3);color:${C.bone};font:600 20px 'Instrument Sans',sans-serif;padding:8px 14px;letter-spacing:.2em;text-transform:uppercase;width:140px}
.notes li{padding:8px 0;border-top:1px solid rgba(239,233,225,.14);color:${C.threshold}}
.blk-also{padding:0}
.also{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:10px}
.also-c{border-radius:14px;padding:12px;display:flex;flex-direction:column;gap:8px}.also-c img{height:120px;object-fit:contain}
.also-c p{display:flex;justify-content:space-between;gap:8px;font-size:15px}.also-c span{color:${C.smoke}}
.all{max-width:1200px;margin:0 auto;padding:60px 16px}
.all-h{font-size:clamp(56px,9vw,120px);margin:8px 0 24px}
.all-g{display:grid;gap:12px;grid-template-columns:repeat(auto-fill,minmax(250px,1fr))}
.all-c{border-radius:16px;padding:18px;display:flex;flex-direction:column;gap:6px}.all-c img{height:200px;object-fit:contain;margin-bottom:8px}
.all-n{font-size:40px}.all-l{color:${C.bone}}.all-p{font-weight:600}.all-p span{color:${C.smoke};font-weight:400;font-size:14px}.all-c .btn{align-self:flex-start;margin-top:6px}
.proof{display:grid;grid-template-columns:repeat(2,1fr);max-width:1200px;margin:0 auto;padding:0 16px 40px;gap:10px}
.proof p{padding:18px;border:1px solid rgba(239,233,225,.14);border-radius:14px;font-weight:600}
@media (min-width:900px){.proof{grid-template-columns:repeat(4,1fr)}}
.loop{position:relative;min-height:60svh;display:flex;align-items:center;justify-content:center;padding:40px 16px}
.loop-v{position:absolute;inset:0}.loop-v::after{content:"";position:absolute;inset:0;background:rgba(19,17,16,.72);z-index:1}
.loop-t{position:relative;z-index:2;font-size:clamp(40px,7vw,96px);text-align:center;max-width:14ch}
.foot{max-width:1200px;margin:0 auto;padding:40px 16px 60px}
`;
  return sitePage({
    title: 'Tuskrr, The Host (direction 02)',
    description: 'Direction 02 prototype for the Tuskrr website: The Host, on The Entrance theme.',
    css, body, step: 0.125, cap: 0.75,
    fonts: FONTS.instrumentSans + FONTS.plexMono,
  });
}
