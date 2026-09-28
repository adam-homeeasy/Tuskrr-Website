// START-HERE: what each option is, what is shared, what is not final, and
// exactly what we need back.
import { IMG, FONTS, PRODUCTS, esc, contourSVG, ridgesSVG, lockup, goldS, GOLD_S_CSS, page, NOT_FINAL } from './shared.mjs';
import { WORLDS } from './worlds.mjs';

const CSS = `
:root{--paper:#F4F2EE;--ink:#161616;--muted:#5C5954;--line:#D6D2CA;--gold-s:#8F6412;--mono:"IBM Plex Mono",ui-monospace,monospace}
body{background:var(--paper);color:var(--ink);font-family:"Archivo",system-ui,sans-serif;font-size:17px;line-height:1.6}
.wrap{max-width:1240px;margin:0 auto;padding:0 40px}
.mono{font-family:var(--mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase}
.muted{color:var(--muted)}
header.top{border-bottom:1px solid var(--ink)}
header.top .wrap{display:flex;justify-content:space-between;align-items:center;gap:24px;min-height:72px;flex-wrap:wrap}
header.top .lockup{font-size:22px}
.intro{padding-top:88px;padding-bottom:72px}
.intro h1{font-stretch:62%;font-weight:800;text-transform:uppercase;font-size:clamp(52px,8vw,112px);line-height:.9;max-width:12em}
.intro p{font-size:clamp(19px,1.8vw,22px);line-height:1.5;max-width:40em;margin-top:28px}
section{padding:72px 0;border-top:1px solid var(--ink)}
h2{font-stretch:62%;font-weight:800;text-transform:uppercase;font-size:clamp(36px,4.4vw,56px);line-height:.95;margin-bottom:12px}
.sub{max-width:44em;color:var(--muted);margin-bottom:40px}
.fixed{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;border-left:1px solid var(--line)}
.fixed div{border-right:1px solid var(--line);padding:4px 20px 8px}
.fixed b{display:block;font-size:17px;margin:8px 0 6px}
.fixed p{font-size:14px;color:var(--muted)}
.fixed .gs{width:120px;margin-top:6px;color:var(--ink)}
.opts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:28px}
.opt{display:flex;flex-direction:column;border:1px solid var(--ink);background:#fff;text-decoration:none;color:inherit}
.opt:hover{border-color:#8A4722}
.opt:hover .go{background:var(--ink);color:var(--paper)}
.prev{aspect-ratio:4/3;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-end;padding:22px}
.prev svg{position:absolute;inset:0;width:100%;height:100%}
.prev>*:not(svg){position:relative}
.prev .h{line-height:.92}
.pa{background:#ECE8DF;color:#1B1C1A}
.pa svg{color:#C9C1AF}
.pa .h{font-stretch:62%;font-weight:800;text-transform:uppercase;font-size:44px}
.pb{background:#121212;color:#ECEAE6;background-image:linear-gradient(90deg,rgba(236,234,230,.08) 1px,transparent 1px);background-size:calc(100% / 12) 100%}
.pb .h{font-family:"Instrument Sans",system-ui,sans-serif;font-stretch:75%;font-weight:600;text-transform:uppercase;letter-spacing:.02em;font-size:40px}
.pb .h em{font-style:normal;color:#C9A24A}
.pc{background:linear-gradient(180deg,#150e14 0%,#2d1d2c 30%,#6a3f55 50%,#c46a47 62%,#e39a5b 72%);color:#EBDDC7}
.pc svg{top:auto;height:52%}
.pc .h{font-family:"Instrument Serif",Georgia,serif;font-size:48px;position:absolute!important;top:22px;left:22px;right:22px}
.pc .h em{color:#E39A5B}
.opt .body{padding:20px 20px 0;display:flex;flex-direction:column;gap:10px;flex:1}
.opt h3{font-stretch:62%;font-weight:800;text-transform:uppercase;font-size:34px;line-height:1}
.opt .reading{font-size:17px}
.opt .chips{display:flex;height:18px;border:1px solid var(--line);margin-top:4px}
.opt .chips i{flex:1}
.opt .feel{color:var(--muted)}
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
.badges{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px;margin-top:40px}
.badges figure{background:#fff;border:1px solid var(--line)}
.badges .im{aspect-ratio:1/1;overflow:hidden}
.badges img{width:100%;height:100%;object-fit:cover;object-position:50% 22%;transform:scale(1.6);transform-origin:50% 22%}
.badges figcaption{padding:10px;font-size:12px;line-height:1.45}
.badges figcaption b{display:block;font-family:var(--mono);letter-spacing:.06em;font-weight:500}
.ask{background:var(--ink);color:var(--paper);padding:72px 0;border-top:0}
.ask h2{color:var(--paper)}
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
.opts{grid-template-columns:1fr;max-width:560px}
.fixed{grid-template-columns:repeat(2,minmax(0,1fr));row-gap:24px}
.badges{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media (max-width:700px){
.wrap{padding:0 16px}
.intro{padding-top:56px;padding-bottom:48px}
section,.ask{padding:56px 0}
.fixed{grid-template-columns:1fr}
.notes,.ask ol,.nf ul{grid-template-columns:1fr}
.badges{grid-template-columns:repeat(2,minmax(0,1fr))}
.pa .h,.pb .h{font-size:36px}.pc .h{font-size:40px}
}
`;

const BADGES = [
  ['ridge', 'Drawn wordmark, gold S'],
  ['traverse', 'Standard letters, gold S'],
  ['strata', 'Standard letters, gold S'],
  ['crest', 'Drawn wordmark, no gold'],
  ['axis', 'Standard letters, no gold'],
  ['contour', 'Standard letters, gold S'],
];

export function renderStart() {
  const A = WORLDS.a, B = WORLDS.b, C = WORLDS.c;
  const chips = (w) => `<span class="chips" aria-hidden="true">${w.palette.map((c) => `<i style="background:${c.hex}"></i>`).join('')}</span>`;
  const card = (w, prev) => `<a class="opt" href="${w.file}" data-r>
    ${prev}
    <div class="body"><span class="mono muted">Option ${w.letter}</span><h3>${esc(w.name)}</h3><p class="reading">${esc(w.reading)}</p>${chips(w)}<p class="feel mono">${w.feeling.map(esc).join(' / ')}</p></div>
    <span class="go mono">Open option ${w.letter}<span aria-hidden="true">&rarr;</span></span>
  </a>`;

  const cards = [
    card(A, `<div class="prev pa" aria-hidden="true">${contourSVG({ seed: 7, cols: 70, levels: 13 })}<span class="h">The wild,<br>measured.</span></div>`),
    card(B, `<div class="prev pb" aria-hidden="true"><span class="h">Every line<br>has <em>purpose.</em></span></div>`),
    card(C, `<div class="prev pc" aria-hidden="true">${ridgesSVG({ w: 800, h: 320, seed: 3, layers: [{ base: 0.5, amp: 0.3, freq: 2.2, fill: '#7a4a5e' }, { base: 0.66, amp: 0.3, freq: 2.8, fill: '#4f3547' }, { base: 0.82, amp: 0.3, freq: 3.4, fill: '#3a2530' }, { base: 1, amp: 0.25, freq: 4.1, fill: '#221610' }] })}<span class="h">Take the <em>long</em> way.</span></div>`),
  ].join('');

  const rows = [
    ['The idea', A.reading, B.reading, C.reading],
    ['Feeling', A.feeling.join(', '), B.feeling.join(', '), C.feeling.join(', ')],
    ['Ground', 'Survey paper and ink, slate and cognac', 'Carbon and concrete, brass S as the only accent', 'Bark and sand, terracotta and ember'],
    ['Type', 'Archivo Condensed, IBM Plex Mono', 'Instrument Sans, one family', 'Instrument Serif, Hanken Grotesk'],
    ['Graphic device', 'Contour map, numbered sheets', 'Vertical channels, strata bands, the gold S', 'Layered ridgelines, elevation line, grain'],
    ['Photography', 'Aerial terrain, product as specimen', 'Architecture, product as sculpture', 'Dusk landscapes, people in motion'],
    ['Website', 'Legend rail and sheets', 'Index list with a product pane', 'Full-screen scenes with an elevation line'],
    ['Strongest for', 'A system that scales to many products', 'Corporate, gifting, the city', 'Launch campaign, social, travel'],
    ['Watch for', A.watch[0], B.watch[0], C.watch[0]],
    ['Cost to shoot', 'Medium: studio plus some landscape', 'Lowest: studio and architecture', 'Highest: location and lifestyle'],
  ];

  const body = `<header class="top"><div class="wrap"><a href="#" aria-label="Tuskrr" style="display:flex;align-items:center;min-height:44px;text-decoration:none;color:inherit">${lockup()}</a><span class="mono muted">Brand world options / working draft / 28 September 2026</span></div></header>
<main>
  <div class="wrap intro">
    <p class="mono muted" data-r>Start here</p>
    <h1 data-r>Three worlds for Tuskrr</h1>
    <p data-r>Before we design the website, we need to agree what world Tuskrr lives in. The product deck already named it: <b>Linear Wilderness</b>, nature’s lines made disciplined. These are three ways to tell it.</p>
    <p data-r class="muted">The name, the logo, the six products and every word about them are the same in all three. What changes is the idea behind the brand, the palette, the type, the graphic language, the photography, the voice and how the website is built. Each option is a single page that works on its own, built the way its website would be.</p>
  </div>

  <section aria-labelledby="h-opts"><div class="wrap">
    <h2 id="h-opts" data-r>The three options</h2>
    <p class="sub" data-r>Open each one and scroll the whole page. They take about three minutes each.</p>
    <div class="opts">${cards}</div>
  </div></section>

  <section aria-labelledby="h-fixed"><div class="wrap">
    <h2 id="h-fixed" data-r>Already true in every option</h2>
    <p class="sub" data-r>These come from Tuskrr’s own files and are not up for choice here.</p>
    <div class="fixed">
      <div data-r><span class="mono muted">01</span><b>The name and the mark</b><p>An elephant drawn as one disciplined line, fused into a t and an R. The wild, drawn with control. It is Linear Wilderness in a single symbol.</p></div>
      <div data-r><span class="mono muted">02</span><b>Linear Wilderness</b><p>The idea named in the product deck: nature creates lines, and Tuskrr gives them structure.</p></div>
      <div data-r><span class="mono muted">03</span><b>The channel</b><p>Every bag carries the same vertical stitched channels. It is the product’s signature, and each world treats it as its core graphic.</p></div>
      <div data-r><span class="mono muted">04</span><b>Six names, six stories</b><p>${PRODUCTS.map((p) => esc(p.name)).join(', ')}. Names, inspirations, stories and lines are used as written.</p></div>
      <div data-r><span class="mono muted">05</span><b>The gold S</b><p>Picked out on several product badges.</p>${goldS()}</div>
    </div>
  </div></section>

  <section aria-labelledby="h-compare"><div class="wrap">
    <h2 id="h-compare" data-r>Side by side</h2>
    <p class="sub" data-r>The short version, if you only have a minute.</p>
    <div class="table" data-r role="region" aria-labelledby="h-compare" tabindex="0"><table>
      <thead><tr><th scope="col"><span class="sr">Aspect</span></th><th scope="col">A. ${esc(A.name)}</th><th scope="col">B. ${esc(B.name)}</th><th scope="col">C. ${esc(C.name)}</th></tr></thead>
      <tbody>${rows.map(([k, a, b, c]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(a)}</td><td>${esc(b)}</td><td>${esc(c)}</td></tr>`).join('')}</tbody>
    </table></div>
  </div></section>

  <section aria-labelledby="h-found"><div class="wrap">
    <h2 id="h-found" data-r>What we found in the files</h2>
    <p class="sub" data-r>Things to settle whichever world is chosen. None of them blocks the choice.</p>
    <ul class="notes">
      <li data-r><b>The badges use two different wordmarks</b><p>RIDGE and CREST carry the drawn Tuskrr wordmark. TRAVERSE, STRATA, AXIS and CONTOUR carry ordinary letters that do not match the logo. Production should use one. We recommend the drawn wordmark, since it is the logo.</p></li>
      <li data-r><b>The gold S is used on some badges and not others</b><p>It is on RIDGE, TRAVERSE, STRATA and CONTOUR, and missing on CREST and AXIS. Is the gold S part of the brand? Option B builds the most on it.</p></li>
      <li data-r><b>Two products have two campaign lines</b><p>TRAVERSE: “Take the long way” or “Made for the distance between here and there”. CREST: “Rise above ordinary” or “Find your high point”. Each option shows both for now.</p></li>
      <li data-r><b>We only have the logo as JPEG images</b><p>Vector files (SVG, AI or PDF) are needed for the website and anything printed.</p></li>
      <li data-r><b>The moodboard photos cannot go on the site</b><p>They are reference images that Tuskrr does not own. The website will need commissioned or licensed photography. The product images are renders; confirm whether final photography is planned.</p></li>
      <li data-r><b>AXIS is described as “slightly masculine”</b><p>The moodboards show women and men carrying the range. Worth deciding whether any product is positioned by gender, or whether the whole range is unisex.</p></li>
    </ul>
    <div class="badges">${BADGES.map(([id, note]) => `<figure data-r><div class="im"><img src="${IMG[id]}" alt="${esc(id.toUpperCase())} badge, supplied product render"></div><figcaption><b>${esc(id.toUpperCase())}</b>${esc(note)}</figcaption></figure>`).join('')}</div>
  </div></section>

  <section class="ask" aria-labelledby="h-ask"><div class="wrap">
    <h2 id="h-ask" data-r>What we need back</h2>
    <ol>
      <li class="first" data-r>Which one, first instinct? One letter is enough.</li>
      <li data-r>Is there anything you would steal from the other two? A voice, a palette, a device.</li>
      <li data-r>Which wordmark goes on the badges: the drawn one or the ordinary letters?</li>
      <li data-r>Is the gold S part of the brand, or a finish on some products only?</li>
      <li data-r>The campaign lines for TRAVERSE and CREST: which one of each?</li>
    </ol>
    <div class="lean" data-r><p><b>Our lean, for what it is worth:</b> A, Field Survey, as the system, because it scales to every future product and its vocabulary (ridge, strata, contour) is already in your product names. For launch campaigns we would borrow the warmth of C’s voice. But your first instinct matters more than our reasoning, so please answer question 01 before reading this twice.</p></div>
  </div></section>

  <section class="nf" aria-labelledby="h-nf"><div class="wrap">
    <h2 id="h-nf" data-r>Not final</h2>
    <ul>${NOT_FINAL.map((n) => `<li data-r>${esc(n)}</li>`).join('')}</ul>
  </div></section>
</main>
<footer><div class="wrap">${lockup()}<span class="mono muted">Keep this file next to the three option files so the links work.</span></div></footer>`;

  return page({
    title: 'Tuskrr brand world options',
    description: 'Three brand world options for Tuskrr, with a comparison and the decisions needed before the website is designed.',
    fonts: FONTS.archivo + FONTS.plexMono + FONTS.instrumentSans + FONTS.instrumentSerif,
    css: CSS,
    body,
  });
}
