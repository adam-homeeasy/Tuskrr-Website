// START-HERE: the brand foundation, the brand world (The Entrance), a
// five-person test kit, open items and exactly what we need back.
import { FONTS, esc, lockup, GOLD_S_CSS, page, NOT_FINAL } from './shared.mjs';
import { WORLDS, FOUNDATION as F, TAGLINE } from './worlds.mjs';

const CSS = `
:root{--paper:#F4F2EE;--ink:#161616;--muted:#5C5954;--line:#D6D2CA;--accent:#A8401F;--gold-s:#8F6412;--mono:"IBM Plex Mono",ui-monospace,monospace}
body{background:var(--paper);color:var(--ink);font-family:"Archivo",system-ui,sans-serif;font-size:17px;line-height:1.6}
.wrap{max-width:1240px;margin:0 auto;padding:0 40px}
.mono{font-family:var(--mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase}
.muted{color:var(--muted)}
.cond{font-stretch:62%;font-weight:800;text-transform:uppercase;line-height:.92}
header.top{border-bottom:1px solid var(--ink)}
header.top .wrap{display:flex;justify-content:space-between;align-items:center;gap:24px;min-height:72px;flex-wrap:wrap}
header.top .lockup{font-size:22px}
.intro{padding-top:80px;padding-bottom:64px}
.intro h1{font-size:clamp(64px,10vw,150px);max-width:10em}
.intro h1 em{font-style:normal;color:var(--accent)}
.intro p{font-size:clamp(19px,1.8vw,22px);line-height:1.5;max-width:40em;margin-top:26px}
section{padding:72px 0;border-top:1px solid var(--ink)}
h2{font-size:clamp(38px,4.6vw,60px);margin-bottom:12px}
.sub{max-width:46em;color:var(--muted);margin-bottom:40px}
/* foundation */
.fgrid{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:20px}
.fbox{background:#fff;border:1px solid var(--line);padding:22px 24px}
.fbox .mono{color:var(--muted);display:block;margin-bottom:10px}
.fbox h3{font-size:22px;line-height:1.2;margin-bottom:8px}
.fbox p{font-size:16px}
.fbox p+p{margin-top:8px}
.f-tag{grid-column:span 12;background:var(--ink);color:var(--paper);border:0;padding:40px}
.f-tag .mono{color:#b9b4ab}
.f-tag p.t{font-size:clamp(48px,7vw,104px)}
.f-tag p.s{margin-top:18px;color:#d8d4cc;max-width:44em}
.f-icp{grid-column:span 7}
.f-sec{grid-column:span 5}
.f-trig{grid-column:span 6}
.f-trig blockquote{margin:0;font-size:clamp(26px,2.6vw,34px);font-stretch:75%;font-weight:700;line-height:1.15}
.f-pers{grid-column:span 5}
.f-voice{grid-column:span 7}
.f-proof{grid-column:span 7}
.f-biz{grid-column:span 5}
.pers li{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid var(--line);font-size:18px}
.pers li span{color:var(--muted);font-size:15px}
.rules li,.biz li{padding:9px 0;border-bottom:1px solid var(--line);font-size:15px}
.proofl li{display:flex;justify-content:space-between;gap:12px;padding:9px 0;border-bottom:1px solid var(--line);font-size:15px}
.proofl .ok{color:#2F6B3A}
.proofl .tc{color:var(--accent)}
.changed{margin-top:28px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:20px}
.changed li{border-top:2px solid var(--ink);padding-top:12px;font-size:15px}
/* options */
.opts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}
.opt{display:flex;flex-direction:column;border:1px solid var(--ink);background:#fff;text-decoration:none;color:inherit}
.opt:hover .go{background:var(--ink);color:var(--paper)}
.prev{aspect-ratio:4/3;position:relative;overflow:hidden}
.prev .h{position:absolute;left:20px;right:20px;z-index:2;line-height:.92}
.pa{background:#131110;color:#EFE9E1}
.pa .slit{position:absolute;top:10%;bottom:0;left:62%;width:13%;background:linear-gradient(180deg,#f6e3bd,#dcb77a);box-shadow:0 0 60px 12px rgba(246,227,189,.3)}
.pa .h{bottom:20px;font-family:"Instrument Sans",sans-serif;font-stretch:75%;font-weight:600;text-transform:uppercase;font-size:38px}
.pa .h em{font-style:normal;color:#D1A650}
.pb{background:linear-gradient(180deg,#F1E6D6,#EFC7A0)}
.pb svg{position:absolute;left:0;right:0;bottom:0;width:100%;height:48%}
.pb .h{top:20px;font-family:"Instrument Serif",Georgia,serif;font-size:44px;color:#1C2433}
.pb .h em{color:#AC4428}
.pc{background:#fff}
.pc .lines{position:absolute;right:0;top:0;bottom:0;width:40%;color:#111;border-left:1px solid #111}
.pc .lines svg{width:100%;height:100%}
.pc .wild{stroke:#E0492A}
.pc .h{top:20px;right:44%;font-stretch:62%;font-weight:800;text-transform:uppercase;font-size:44px;color:#111}
.pc .h em{font-style:normal;color:#B83418}
.world{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);border:1px solid var(--ink);background:#fff;text-decoration:none;color:inherit}
.world .prev{aspect-ratio:auto;min-height:420px}
.world .body{padding:32px;display:flex;flex-direction:column;gap:14px}
.world h3{font-size:56px}
.world .big{font-size:22px;line-height:1.35}
.world .chips{display:flex;height:18px;border:1px solid var(--line)}
.world .chips i{flex:1}
.world .go{margin-top:auto;border:1px solid var(--ink);padding:0 16px;min-height:52px;display:flex;align-items:center;justify-content:space-between}
.world:hover .go{background:var(--ink);color:var(--paper)}
.opt .body{padding:20px 20px 0;display:flex;flex-direction:column;gap:10px;flex:1}
.opt h3{font-size:32px}
.opt .chips{display:flex;height:18px;border:1px solid var(--line)}
.opt .chips i{flex:1}
.opt .go{margin-top:auto;border-top:1px solid var(--ink);padding:0 20px;min-height:52px;display:flex;align-items:center;justify-content:space-between}
.table{overflow-x:auto;border:1px solid var(--ink);background:#fff}
table{border-collapse:collapse;width:100%;min-width:860px}
th,td{text-align:left;vertical-align:top;padding:14px 16px;border-bottom:1px solid var(--line);font-size:15px;line-height:1.5}
thead th{font-stretch:62%;font-weight:800;text-transform:uppercase;font-size:24px;border-bottom:1px solid var(--ink)}
tbody th{font-family:var(--mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:var(--muted);width:150px;font-weight:400}
tr:last-child th,tr:last-child td{border-bottom:0}
.notes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 48px}
.notes li{border-top:1px solid var(--line);padding:18px 0}
.notes b{display:block;font-size:17px;margin-bottom:4px}
.notes p{font-size:15px;color:var(--muted)}
/* test kit */
.kit{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:48px}
.kit ol{counter-reset:k}
.kit li{counter-increment:k;position:relative;padding:14px 0 14px 40px;border-top:1px solid var(--line);font-size:16px}
.kit li::before{content:counter(k,decimal-leading-zero);position:absolute;left:0;top:17px;font-family:var(--mono);font-size:12px;color:var(--accent)}
.kit li b{display:block}
.kit li span{color:var(--muted);font-size:15px}
.listen{margin-top:24px;background:#fff;border:1px solid var(--line);padding:18px 22px}
.kit .listen li{padding:6px 0;font-size:15px;border-top:0;counter-increment:none}
.kit .listen li::before{content:none}
.ask{background:var(--ink);color:var(--paper);padding:72px 0;border-top:0}
.ask ol{counter-reset:q;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 48px;margin-top:32px}
.ask li{counter-increment:q;border-top:1px solid #3c3a36;padding:18px 0 18px 48px;position:relative;font-size:17px}
.ask li::before{content:counter(q,decimal-leading-zero);position:absolute;left:0;top:20px;font-family:var(--mono);font-size:12px;color:#C9A24A}
.ask li.first{grid-column:1/-1;font-size:clamp(24px,2.6vw,34px);font-stretch:75%;font-weight:700;line-height:1.2}
.ask li.first::before{top:30px}
.lean{margin-top:40px;border:1px solid #3c3a36;padding:24px 28px;max-width:52em;color:#D8D4CC}
.lean b{color:var(--paper)}
.nf ul{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:0 48px}
.nf li{border-top:1px solid var(--line);padding:14px 0;font-size:15px;color:var(--muted)}
footer{padding:40px 0 56px;border-top:1px solid var(--ink)}
footer .wrap{display:flex;justify-content:space-between;align-items:center;gap:24px;flex-wrap:wrap}
footer .lockup{font-size:20px}
${GOLD_S_CSS}
@media (max-width:1000px){
.world{grid-template-columns:1fr}
.world .prev{min-height:320px}
.f-icp,.f-sec,.f-trig,.f-pers,.f-voice,.f-proof,.f-biz{grid-column:span 12}
.changed{grid-template-columns:1fr 1fr}
.kit{grid-template-columns:1fr}
}
@media (max-width:700px){
.wrap{padding:0 16px}
.intro{padding-top:56px;padding-bottom:48px}
section,.ask{padding:56px 0}
.f-tag{padding:28px 20px}
.changed,.notes,.ask ol,.nf ul{grid-template-columns:1fr}
.pa .h,.pb .h,.pc .h{font-size:34px}
}
`;

const TESTERS = [
  ['The engineer', 'Software engineer, 25 to 28, Bengaluru or Pune, two or three years in. Carries the company backpack. The core self-buyer.'],
  ['The traveller', 'Consultant or analyst, 27 to 31, Mumbai or Gurugram, flies for client work most weeks. Tests STRATA and TRAVERSE.'],
  ['The stylist', 'Designer, marketer or content lead at a startup, 24 to 28, lives on Instagram. Tests how cool it reads.'],
  ['The newly promoted', 'Manager, 30 to 34, promoted in the last year and ready to spend on a better bag. Tests the upgrade trigger.'],
  ['The smart-formal professional', 'Finance, law or banking, 26 to 32, Delhi NCR, where dress codes are stricter. Include women and men across the five, and check the range reads as unisex.'],
  ['The gift giver', 'Someone who bought a ₹5,000 to ₹7,000 gift in the last year, for a partner’s or sibling’s new job, birthday or anniversary.'],
];

const SCRIPT = [
  ['Show The Entrance\u2019s first screen on a phone for ten seconds.', 'Ask: "What kind of brand is this? Would you buy from it?"'],
  ['Ask: "What kind of person carries this bag?"', 'Listen for "someone like me" or "for my office".'],
  ['Read the tagline aloud: "Arrive like you mean it."', 'Ask: "What does that make you think of?" Hope for a meeting, a first day, a pitch.'],
  ['Ask: "Would you buy this for yourself at ₹6,000? Would you gift it, and to whom?"', 'Note the hesitation, not only the answer.'],
  ['Ask: "What would stop you buying it online?"', 'This tells us which proof points to put first.'],
];

export function renderStart() {
  const A = WORLDS.a;
  const chips = (w) => `<span class="chips" aria-hidden="true">${w.palette.map((c) => `<i style="background:${c.hex}"></i>`).join('')}</span>`;
  const body = `<header class="top"><div class="wrap"><a href="#" aria-label="Tuskrr" style="display:flex;align-items:center;min-height:44px;text-decoration:none;color:inherit">${lockup()}</a><span class="mono muted">Brand world / working draft / 28 September 2026</span></div></header>
<main>
  <div class="wrap intro">
    <p class="mono muted" data-r>Start here</p>
    <h1 class="cond" data-r>Arrive like you <em>mean it.</em></h1>
    <p data-r>The Tuskrr brand world. It starts from who buys Tuskrr and why, carries Linear Wilderness from round 1 underneath, and comes to life in one direction: The Entrance.</p>
  </div>

  <section aria-labelledby="h-found"><div class="wrap">
    <h2 id="h-found" class="cond" data-r>The foundation</h2>
    <p class="sub" data-r>What the brand is. The Entrance is how it looks, sounds and behaves.</p>
    <div class="fgrid">
      <div class="fbox f-tag" data-r><span class="mono">Tagline</span><p class="t cond">${esc(TAGLINE)}</p><p class="s">Promise: ${esc(F.promise)} Idea: ${esc(F.idea)}</p></div>
      <div class="fbox f-icp" data-r><span class="mono">Who buys it</span><h3>${esc(F.icp.title)}, ${esc(F.icp.age)}</h3><p>${esc(F.icp.who)}</p><p>${esc(F.icp.life)}</p><p>${esc(F.icp.money)} ${esc(F.icp.first)}</p></div>
      <div class="fbox f-sec" data-r><span class="mono">Also buys it</span>${F.secondary.map(([h, t]) => `<h3>${esc(h)}</h3><p>${esc(t)}</p>`).join('<br>')}<p class="muted" style="margin-top:12px">Not for: ${esc(F.notFor)}</p></div>
      ${F.triggers.map(([who, line, pay]) => `<div class="fbox f-trig" data-r><span class="mono">Trigger: ${esc(who)}</span><blockquote>“${esc(line)}”</blockquote><p style="margin-top:10px" class="muted">${esc(pay)}</p></div>`).join('')}
      <div class="fbox f-pers" data-r><span class="mono">Personality</span><ul class="pers">${F.personality.map(([a, b]) => `<li>${esc(a)}<span>${esc(b)}</span></li>`).join('')}</ul><p style="margin-top:12px">Feeling: <b>${esc(F.emotion)}</b></p></div>
      <div class="fbox f-voice" data-r><span class="mono">Voice rules</span><ul class="rules">${F.voice.map((v) => `<li>${esc(v)}</li>`).join('')}</ul></div>
      <div class="fbox f-proof" data-r><span class="mono">Proof on every product page</span><ul class="proofl">${F.proof.map(([t, s]) => `<li>${esc(t)}<span class="mono ${s === 'confirmed' ? 'ok' : 'tc'}">${esc(s)}</span></li>`).join('')}</ul></div>
      <div class="fbox f-biz" data-r><span class="mono">Price, market, channel</span><ul class="biz"><li>${esc(F.price)}</li><li>${esc(F.market)}</li><li>${esc(F.material)} ${esc(F.gifting.initials)}</li></ul></div>
    </div>
    <p class="mono muted" style="margin-top:40px" data-r>What changed</p>
    <ul class="changed">${F.changed.map((c) => `<li data-r>${esc(c)}</li>`).join('')}</ul>
  </div></section>

  <section aria-labelledby="h-world"><div class="wrap">
    <h2 id="h-world" class="cond" data-r>The brand world</h2>
    <p class="sub" data-r>Open it on a phone as well as a laptop; the phone is where Tuskrr will be found and bought.</p>
    <a class="world" href="${A.file}" data-r>
      <div class="prev pa" aria-hidden="true"><span class="slit"></span><span class="h">Arrive like<br>you <em>mean it.</em></span></div>
      <div class="body">
        <span class="mono muted">Brand world</span><h3 class="cond">${esc(A.name)}</h3><p class="big">${esc(A.reading)}</p>
        <p>${esc(A.intro)}</p>
        <p class="muted">Underneath: ${esc(A.linear.title.replace(', underneath', ''))}. ${esc(A.linear.pairs.map(([k, v]) => k + ': ' + v).join(' '))}</p>
        ${chips(A)}
        <p class="mono muted">${A.feeling.map(esc).join(' / ')}</p>
        <span class="go mono">Open The Entrance<span aria-hidden="true">&rarr;</span></span>
      </div>
    </a>
  </div></section>

  <section aria-labelledby="h-kit"><div class="wrap">
    <h2 id="h-kit" class="cond" data-r>Test it with five people</h2>
    <p class="sub" data-r>Before the website is built, show The Entrance and the tagline to five or six people who match the buyer. Five minutes each, on their own phone if possible. Record their exact words.</p>
    <div class="kit">
      <div data-r><p class="mono muted" style="margin-bottom:10px">Who to ask</p><ol>${TESTERS.map(([h, t]) => `<li><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join('')}</ol></div>
      <div data-r><p class="mono muted" style="margin-bottom:10px">What to ask</p><ol>${SCRIPT.map(([h, t]) => `<li><b>${esc(h)}</b><span>${esc(t)}</span></li>`).join('')}</ol>
        <div class="listen"><p class="mono muted">Red flags to listen for</p><ul><li>“Looks like a travel or outdoor brand.”</li><li>“Too formal” or “looks like my dad’s bag”.</li><li>“Is it real leather?” asked before anything else.</li><li>The tagline read as aggressive rather than confident.</li></ul></div>
      </div>
    </div>
  </div></section>

  <section aria-labelledby="h-found2"><div class="wrap">
    <h2 id="h-found2" class="cond" data-r>Still open</h2>
    <ul class="notes">
      <li data-r><b>Two wordmarks on the badges</b><p>RIDGE and CREST carry the drawn Tuskrr wordmark; TRAVERSE, STRATA, AXIS and CONTOUR carry ordinary letters. Production should use one; we recommend the drawn one.</p></li>
      <li data-r><b>The gold S</b><p>The Entrance uses it as the single accent. Today it is on RIDGE, TRAVERSE, STRATA and CONTOUR, and missing on CREST and AXIS. Confirm it goes on every badge.</p></li>
      <li data-r><b>Sample values in place</b><p>Laptop sizes for each bag and the returns policy are sample values, labelled as samples. Real figures are needed before launch.</p></li>
      <li data-r><b>Custom-order initials</b><p>Ready in 2 weeks. The price is still to confirm.</p></li>
      <li data-r><b>Logo files and photography</b><p>Vector logo files are needed, and a photo shoot to The Entrance\u2019s brief: controlled warm light, interiors, Indian cities, Indian models. The moodboard photos cannot be used.</p></li>
      <li data-r><b>Tagline clearance</b><p>Run a trademark search on \u201cArrive like you mean it\u201d (IP India) before anything is printed.</p></li>
      <li data-r><b>Campaign lines</b><p>TRAVERSE and CREST each still have two lines. The tagline now leads, so these become product lines only.</p></li>
    </ul>
  </div></section>

  <section class="ask" aria-labelledby="h-ask"><div class="wrap">
    <h2 id="h-ask" class="cond" data-r>What we need back</h2>
    <ol>
      <li class="first" data-r>Does The Entrance feel like Tuskrr? What would you change?</li>
      <li data-r>Does the foundation feel true: the buyer, the triggers, the personality?</li>
      <li data-r>Which wordmark goes on the badges, and does the gold S go on every one?</li>
      <li data-r>The price for custom initials.</li>
      <li data-r>Real laptop sizes and the returns policy, when ready.</li>
      <li data-r>The reference websites you want the Tuskrr site measured against.</li>
    </ol>
    <div class="lean" data-r><p><b>Next:</b> the website, designed in The Entrance and checked against your reference sites.</p></div>
  </div></section>

  <section class="nf" aria-labelledby="h-nf"><div class="wrap">
    <h2 id="h-nf" class="cond" data-r>Not final</h2>
    <ul>${NOT_FINAL.map((n) => `<li data-r>${esc(n)}</li>`).join('')}</ul>
  </div></section>
</main>
<footer><div class="wrap">${lockup()}<span class="mono muted">Keep this file next to the-entrance.html so the link works.</span></div></footer>`;

  return page({
    title: 'Tuskrr brand world',
    description: 'The Tuskrr brand foundation and brand world, The Entrance, built on the tagline Arrive like you mean it.',
    fonts: FONTS.archivo + FONTS.plexMono + FONTS.instrumentSans + FONTS.instrumentSerif,
    css: CSS,
    body,
  });
}
