// Option A, Field Survey. Organising idea: a map legend rail and numbered sheets.
import { IMG, FONTS, PRODUCTS, esc, contourSVG, lockup, wordmark, monogram, goldS, GOLD_S_CSS, page, NOT_FINAL } from './shared.mjs';
import { SECTIONS, WORLDS } from './worlds.mjs';

const W = WORLDS.a;
const pad = (n) => String(n).padStart(2, '0');

const CSS = `
:root{--paper:#ECE8DF;--sheet:#F6F3EC;--ink:#1B1C1A;--muted:#5E5A51;--slate:#2E4A4D;--cognac:#8A4722;--gold:#8F6412;--line:#C9C1AF;--gold-s:#8F6412;
--cond:"Archivo",system-ui,sans-serif;--mono:"IBM Plex Mono",ui-monospace,monospace}
body{background:var(--paper);color:var(--ink);font-family:"Archivo",system-ui,sans-serif;font-size:17px;line-height:1.6}
.shell{display:grid;grid-template-columns:272px minmax(0,1fr)}
.rail{position:sticky;top:0;height:100vh;border-right:1px solid var(--ink);padding:28px 24px 24px;display:flex;flex-direction:column;gap:26px;background:var(--paper);z-index:2}
.rail .lockup{font-size:22px;color:var(--ink)}
.mono{font-family:var(--mono);font-size:12px;letter-spacing:.06em;text-transform:uppercase}
.rail .key{display:flex;flex-direction:column;border-top:1px solid var(--ink)}
.rail .key a{display:flex;align-items:center;gap:12px;min-height:44px;border-bottom:1px solid var(--line);text-decoration:none;font-size:15px}
.rail .key a:hover{color:var(--cognac);border-bottom-color:var(--cognac)}
.rail .key .n{font-family:var(--mono);font-size:12px;color:var(--muted);width:22px}
.rail .foot{margin-top:auto;color:var(--muted)}
.rail .foot p+p{margin-top:6px}
.sheet{position:relative;padding:72px 56px 80px;border-bottom:1px solid var(--ink)}
.sheet::before,.sheet::after{content:"";position:absolute;width:14px;height:14px;border:0 solid var(--ink)}
.sheet::before{top:18px;left:18px;border-top-width:1px;border-left-width:1px}
.sheet::after{bottom:18px;right:18px;border-bottom-width:1px;border-right-width:1px}
.sh{display:grid;grid-template-columns:120px minmax(0,1fr) auto;gap:24px;align-items:baseline;border-top:1px solid var(--ink);padding-top:14px;margin-bottom:48px}
.sh h2{font-family:var(--cond);font-stretch:62%;font-weight:700;text-transform:uppercase;font-size:clamp(40px,5.2vw,72px);line-height:.95;letter-spacing:.01em}
.sh .mono{color:var(--muted)}
.lead{font-size:clamp(20px,2vw,24px);line-height:1.45;max-width:36em}
.muted{color:var(--muted)}
/* hero */
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:space-between;overflow:hidden;background:var(--paper)}
.hero .topo{position:absolute;inset:0;width:100%;height:100%;color:var(--line)}
.hero>*:not(.topo){position:relative}
.hero .meta{display:flex;flex-wrap:wrap;gap:10px 32px;color:var(--muted)}
.hero h1{font-family:var(--cond);font-stretch:62%;font-weight:800;text-transform:uppercase;font-size:clamp(64px,11vw,176px);line-height:.86;letter-spacing:.005em;margin:32px 0 28px}
.hero .lead{max-width:30em}
.hero .readout{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border-top:1px solid var(--ink);margin-top:48px}
.hero .readout div{padding:12px 16px 0 0}
.hero .readout b{display:block;font-family:var(--cond);font-stretch:62%;font-size:28px;font-weight:700;text-transform:uppercase;line-height:1.1;margin-top:4px}
/* world */
.cols{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;margin-top:40px}
.cols p{font-size:16px}
.cols .n{font-family:var(--mono);font-size:12px;color:var(--cognac);display:block;margin-bottom:10px}
.markcard{display:grid;grid-template-columns:200px minmax(0,1fr);gap:40px;align-items:center;margin-top:56px;padding:32px;background:var(--sheet);border:1px solid var(--line)}
.markcard .mk-mono{width:100%;height:auto;color:var(--ink)}
/* palette */
.swatches{display:grid;grid-template-columns:repeat(auto-fit,minmax(136px,1fr));gap:0;border-left:1px solid var(--ink);border-top:1px solid var(--ink)}
.sw{border-right:1px solid var(--ink);border-bottom:1px solid var(--ink);background:var(--sheet)}
.sw .chip{height:120px;border-bottom:1px solid var(--ink)}
.sw .t{padding:14px 14px 16px}
.sw b{display:block;font-family:var(--cond);font-stretch:62%;font-size:24px;text-transform:uppercase;font-weight:700;line-height:1.1}
.sw .mono{display:block;margin-top:4px}
.sw p{font-size:14px;margin-top:8px;line-height:1.45}
.sw .note{color:var(--muted);font-size:13px}
.ratio{display:flex;height:18px;margin-top:28px;border:1px solid var(--ink)}
.ratio span{display:block}
/* type */
.spec{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:40px}
.spec .big{font-family:var(--cond);font-stretch:62%;font-weight:800;text-transform:uppercase;font-size:clamp(56px,8.5vw,132px);line-height:.88}
.spec .big span{display:block}
.spec .big span:nth-child(2){color:var(--cognac)}
.spec .big span:nth-child(3){font-weight:300}
.tk{border-top:1px solid var(--ink);padding:14px 0 22px}
.tk h3{font-size:18px;font-weight:600}
.tk p{font-size:15px;color:var(--muted);margin-top:6px}
.tk .sample{margin-top:10px;color:var(--ink)}
.tk .sample.mono{font-size:14px}
/* device */
.device{display:grid;grid-template-columns:minmax(0,1.6fr) minmax(0,1fr);gap:40px;align-items:start}
.mapframe{position:relative;border:1px solid var(--ink);background:var(--sheet);aspect-ratio:10/6.6;overflow:hidden}
.mapframe svg{width:100%;height:100%;color:var(--slate)}
.mapframe .tag{position:absolute;left:14px;bottom:12px;background:var(--sheet);padding:4px 8px;border:1px solid var(--ink)}
.mapframe .cross{position:absolute;width:28px;height:28px}
.mapframe .cross::before,.mapframe .cross::after{content:"";position:absolute;background:var(--cognac)}
.mapframe .cross::before{left:13px;top:0;width:2px;height:28px}
.mapframe .cross::after{top:13px;left:0;height:2px;width:28px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:20px}
.chips li{border:1px solid var(--ink);padding:6px 10px}
/* photo */
.photos{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
.ph{border-top:1px solid var(--ink);padding-top:12px}
.ph .frame{aspect-ratio:4/5;background:var(--sheet);border:1px solid var(--line);margin-bottom:14px;position:relative;overflow:hidden}
.ph .frame svg{width:100%;height:100%}
.ph h3{font-size:18px;font-weight:600}
.ph p{font-size:15px;color:var(--muted);margin-top:4px}
.frame .cap{position:absolute;left:8px;bottom:8px;background:var(--sheet);padding:2px 6px;color:var(--muted);font-size:10px}
.frame.aerial{background:var(--slate)}
.frame.aerial svg{color:#7F9A9A}
.frame.spec-img img{width:100%;height:100%;object-fit:cover}
.frame.spec-img .scale{position:absolute;left:12px;right:12px;top:12px;height:8px;display:grid;grid-template-columns:repeat(5,1fr);border:1px solid var(--ink)}
.frame.spec-img .scale i:nth-child(odd){background:var(--ink)}
.frame.hands{background:var(--paper)}
.frame.hands svg{color:var(--cognac)}
.frame.grade{display:grid;grid-template-rows:1fr 1fr}
.frame.grade i:first-child{background:linear-gradient(135deg,#1f3336,#2E4A4D 60%,#51706f)}
.frame.grade i:last-child{background:linear-gradient(135deg,#6b3518,#8A4722 55%,#b36d3f)}
/* collection */
.grid6{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-left:1px solid var(--ink);border-top:1px solid var(--ink)}
.prod{border-right:1px solid var(--ink);border-bottom:1px solid var(--ink);background:var(--sheet);display:flex;flex-direction:column}
.prod .top{display:flex;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--line);color:var(--muted)}
.prod .img{aspect-ratio:1/1;background:#fff;overflow:hidden;border-bottom:1px solid var(--line)}
.prod .img img{width:100%;height:100%;object-fit:contain}
.prod .body{padding:18px 16px 22px;display:flex;flex-direction:column;gap:10px;flex:1}
.prod h3{font-family:var(--cond);font-stretch:62%;font-weight:800;font-size:44px;line-height:.9;text-transform:uppercase}
.prod .reading{color:var(--cognac)}
.prod .line{font-size:19px;font-weight:600;line-height:1.3}
.prod .alt{font-size:14px;color:var(--muted)}
.prod .story{font-size:15px;color:var(--muted);line-height:1.5}
.prod .spec{display:block;margin-top:auto;padding-top:10px;border-top:1px solid var(--line);color:var(--muted);grid-template-columns:none}
/* voice */
.voice{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.6fr);gap:48px}
.vrow{display:grid;grid-template-columns:160px minmax(0,1fr);gap:20px;border-top:1px solid var(--ink);padding:16px 0}
.vrow .mono{color:var(--muted);padding-top:6px}
.vrow p{font-family:var(--cond);font-stretch:75%;font-size:26px;line-height:1.2;font-weight:600}
.words{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.words li{background:var(--ink);color:var(--paper);padding:6px 12px;font-family:var(--mono);font-size:12px;text-transform:uppercase;letter-spacing:.06em}
/* touchpoints */
.touch{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px;align-items:end}
.tp figcaption{border-top:1px solid var(--ink);padding-top:10px;margin-top:16px}
.tp figcaption b{display:block;font-size:17px}
.tp figcaption span{font-size:14px;color:var(--muted)}
.tag-mock{position:relative;aspect-ratio:1/1.9;max-width:220px;margin:0 auto;background:var(--sheet);border:1px solid var(--ink);overflow:hidden;display:flex;flex-direction:column;justify-content:space-between;padding:56px 18px 18px}
.tag-mock::before{content:"";position:absolute;top:18px;left:50%;width:16px;height:16px;margin-left:-8px;border-radius:50%;border:1px solid var(--ink);background:var(--paper)}
.tag-mock svg{position:absolute;inset:0;width:100%;height:100%;color:var(--line)}
.tag-mock>*:not(svg){position:relative}
.tag-mock .mk-word{width:100%;height:auto;color:var(--ink)}
.tag-mock h4{font-family:var(--cond);font-stretch:62%;font-size:40px;line-height:.9;text-transform:uppercase}
.box-mock{position:relative;aspect-ratio:4/3;background:var(--slate);color:var(--paper);overflow:hidden;display:flex;align-items:center;justify-content:center;box-shadow:0 18px 30px -18px rgba(27,28,26,.6)}
.box-mock svg{position:absolute;inset:0;width:100%;height:100%;color:#46666a}
.box-mock .lockup{position:relative;font-size:22px;color:var(--paper)}
.social-mock{aspect-ratio:1/1;background:var(--paper);border:1px solid var(--ink);display:grid;grid-template-rows:auto 1fr auto;overflow:hidden}
.social-mock .bar{display:flex;justify-content:space-between;padding:10px 12px;border-bottom:1px solid var(--ink)}
.social-mock img{width:100%;height:100%;object-fit:contain;background:#fff;min-height:0}
.social-mock .cap{padding:10px 12px;border-top:1px solid var(--ink);font-family:var(--cond);font-stretch:75%;font-size:20px;font-weight:600;line-height:1.15}
/* web */
.web{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:48px;align-items:start}
.wire{border:1px solid var(--ink);background:var(--sheet);aspect-ratio:16/10;display:grid;grid-template-columns:24% 1fr}
.wire .wr{border-right:1px solid var(--ink);padding:12px;display:flex;flex-direction:column;gap:8px}
.wire .wr i{display:block;height:6px;background:var(--line)}
.wire .wr i:first-child{height:12px;background:var(--ink);width:70%;margin-bottom:10px}
.wire .wm{padding:12px;display:grid;grid-template-columns:repeat(3,1fr);grid-template-rows:40% 1fr 1fr;gap:8px}
.wire .wm .h{grid-column:1/-1;background:var(--paper);border:1px solid var(--line);position:relative;overflow:hidden}
.wire .wm .h svg{width:100%;height:100%;color:var(--line)}
.wire .wm .c{border:1px solid var(--line);background:#fff}
.wire .wm .c:nth-child(3){background:var(--cognac)}
.dl{border-top:1px solid var(--ink)}
.dl div{display:grid;grid-template-columns:130px minmax(0,1fr);gap:16px;padding:14px 0;border-bottom:1px solid var(--line)}
.dl dt{font-family:var(--mono);font-size:12px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);padding-top:3px}
.dl dd{font-size:16px}
/* verdict */
.verdict{display:grid;grid-template-columns:1fr 1fr;gap:48px}
.verdict h3{font-family:var(--cond);font-stretch:62%;font-size:36px;text-transform:uppercase;border-top:1px solid var(--ink);padding-top:12px}
.verdict li{padding:14px 0;border-bottom:1px solid var(--line);font-size:16px}
.verdict li::before{content:"+ ";font-family:var(--mono);color:var(--slate)}
.verdict .w li::before{content:"! ";color:var(--cognac)}
footer.nf{padding:56px;background:var(--ink);color:var(--paper)}
footer.nf h2{font-family:var(--cond);font-stretch:62%;font-size:36px;text-transform:uppercase}
footer.nf ul{margin-top:18px;display:grid;grid-template-columns:1fr 1fr;gap:12px 40px}
footer.nf li{font-size:14px;line-height:1.5;color:#CFCABF;border-top:1px solid #45443f;padding-top:10px}
footer.nf .end{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-top:40px;flex-wrap:wrap}
footer.nf .lockup{font-size:20px;color:var(--paper)}
footer.nf a{color:var(--paper);display:inline-flex;align-items:center;min-height:44px}
${GOLD_S_CSS}
.gsdemo{max-width:360px;margin-top:20px;color:var(--ink)}
@media (max-width:1100px){
.cols,.photos{grid-template-columns:repeat(2,minmax(0,1fr))}
.grid6{grid-template-columns:repeat(2,minmax(0,1fr))}
.spec,.device,.voice,.web{grid-template-columns:1fr}
}
@media (max-width:900px){
.shell{grid-template-columns:1fr}
.rail{position:static;height:auto;border-right:0;border-bottom:1px solid var(--ink);padding:20px 16px}
.rail .key{display:grid;grid-template-columns:1fr 1fr;column-gap:16px}
.rail .foot{display:none}
.sheet{padding:48px 16px 56px}
.sh{grid-template-columns:1fr;gap:6px}
.hero .readout{grid-template-columns:1fr 1fr}
.touch{grid-template-columns:1fr;gap:40px}
.markcard{grid-template-columns:1fr;gap:24px}
.markcard .mk-mono{max-width:160px}
.verdict{grid-template-columns:1fr;gap:24px}
footer.nf{padding:40px 16px}
footer.nf ul{grid-template-columns:1fr}
}
@media (max-width:560px){
.cols,.photos,.grid6{grid-template-columns:1fr}
.vrow{grid-template-columns:1fr;gap:4px}
.dl div{grid-template-columns:1fr;gap:4px}
.swatches{grid-template-columns:repeat(2,minmax(0,1fr))}
}
`;

const sh = (i, id) => `<header class="sh" data-r><span class="mono">Sheet ${pad(i + 1)}</span><h2 id="h-${id}">${esc(SECTIONS[i][1])}</h2><span class="mono">${esc(W.reading)}</span></header>`;
const sec = (i, inner, extra = '') => { const id = SECTIONS[i][0]; return `<section class="sheet ${extra}" id="${id}" aria-labelledby="h-${id}">${sh(i, id)}${inner}</section>`; };

export function renderA() {
  const heroTopo = contourSVG({ seed: 7, cols: 120, levels: 18 }, 'topo');
  const deviceMap = contourSVG({ seed: 21, cols: 110, levels: 16, peaks: [[0.25, 0.35, 0.8], [0.62, 0.62, 1], [0.86, 0.25, 0.5]] });
  const small = (seed) => contourSVG({ seed, cols: 60, levels: 11, peaks: [[0.5, 0.5, 1]] });

  const rail = `<aside class="rail" aria-label="Legend">
  <a href="#top" aria-label="Tuskrr, back to top" style="display:block;min-height:44px;text-decoration:none">${lockup()}</a>
  <div class="mono muted">Brand world option ${W.letter}<br>${esc(W.name)}</div>
  <nav class="key" aria-label="Sections">${SECTIONS.map(([id, label], i) => `<a href="#${id}"><span class="n">${pad(i + 1)}</span>${esc(label)}</a>`).join('')}</nav>
  <div class="foot mono"><p>Working draft</p><p>Not for publication</p></div>
</aside>`;

  const hero = `<section class="sheet hero" id="top" aria-label="${esc(W.name)}">
  ${heroTopo}
  <div class="meta mono" data-r><span>Tuskrr</span><span>Brand world, option ${W.letter}</span><span>${esc(W.name)}</span></div>
  <div>
    <h1 data-r>${esc(W.headline)}</h1>
    <p class="lead" data-r>${esc(W.intro)}</p>
    <div class="readout" data-r>
      ${W.feeling.map((f, i) => `<div><span class="mono muted">Reading ${pad(i + 1)}</span><b>${esc(f)}</b></div>`).join('')}
    </div>
  </div>
</section>`;

  const world = sec(0, `
  <p class="lead" data-r>${esc(W.thesis[0])}</p>
  <div class="cols">${W.thesis.slice(1).concat(['Linear Wilderness is Tuskrr’s own phrase from the product deck. This option reads it literally: the wilderness, surveyed. The product names already speak this language: ridge, strata, crest, axis, contour.']).map((t, i) => `<p data-r><span class="n">${pad(i + 1)}</span>${esc(t)}</p>`).join('')}</div>
  <div class="markcard" data-r>${monogram()}<div><p class="mono muted">The mark, read in this world</p><p class="lead" style="margin-top:10px">A tusker drawn in a single controlled line: the wild, measured. In Field Survey the monogram is used like a surveyor’s stamp, small and exact, in the corner of every sheet.</p></div></div>`);

  const total = W.palette.length;
  const palette = sec(1, `
  <div class="swatches">${W.palette.map((c) => `<div class="sw" data-r><div class="chip" style="background:${c.hex}"></div><div class="t"><b>${esc(c.name)}</b><span class="mono muted">${c.hex}</span><p>${esc(c.role)}</p>${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}</div></div>`).join('')}</div>
  <p class="mono muted" style="margin-top:28px" data-r>Proportion in use</p>
  <div class="ratio" data-r aria-hidden="true"><span style="flex:46;background:#ECE8DF"></span><span style="flex:16;background:#F6F3EC"></span><span style="flex:16;background:#1B1C1A"></span><span style="flex:10;background:#2E4A4D"></span><span style="flex:8;background:#8A4722"></span><span style="flex:2;background:#8F6412"></span><span style="flex:2;background:#C9C1AF"></span></div>
  <p class="muted" style="margin-top:14px;font-size:15px" data-r>${total} colours. Paper and ink carry the page; slate and cognac come from the landscape and the leather; gold is used the way a map uses a marker.</p>`);

  const type = sec(2, `
  <div class="spec">
    <div class="big" data-r aria-hidden="true"><span>Ridge</span><span>Traverse</span><span>Strata</span></div>
    <div>
      <div class="tk" data-r><h3>${esc(W.type.display)}</h3><p>${esc(W.type.displayWhy)}</p></div>
      <div class="tk" data-r><h3>${esc(W.type.text)}</h3><p>${esc(W.type.textWhy)}</p><p class="sample">The ridges of a mountain never run perfectly straight. They rise, fall and adapt to the terrain.</p></div>
      <div class="tk" data-r><h3>${esc(W.type.data)}</h3><p>${esc(W.type.dataWhy)}</p><p class="sample mono">Sheet 03 / Reading: layers / Finish: black weave</p></div>
    </div>
  </div>`);

  const device = sec(3, `
  <div class="device">
    <div class="mapframe" data-r>${deviceMap}<span class="cross" style="left:25%;top:35%;margin:-14px 0 0 -14px" aria-hidden="true"></span><span class="tag mono">Sheet 00 / generated contour field</span></div>
    <div data-r>
      <h3 style="font-family:var(--cond);font-stretch:62%;font-size:44px;text-transform:uppercase;line-height:.95">${esc(W.device.title)}</h3>
      <p style="margin-top:14px">${esc(W.device.text)}</p>
      <ul class="chips mono">${W.device.supports.map((s) => `<li>${esc(s)}</li>`).join('')}</ul>
      <p class="mono muted" style="margin-top:28px">The gold S, as on the STRATA badge</p>
      ${goldS('gsdemo')}
    </div>
  </div>`);

  const photoFrames = [
    `<div class="frame aerial">${small(31)}<span class="cap mono">Drawn stand-in</span></div>`,
    `<div class="frame spec-img"><img src="${IMG.ridge}" alt="RIDGE backpack, supplied product render"><span class="scale" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span><span class="cap mono">Supplied render</span></div>`,
    `<div class="frame hands">${small(44)}<span class="cap mono">Drawn stand-in</span></div>`,
    `<div class="frame grade" aria-hidden="true"><i></i><i></i></div>`,
  ];
  const photo = sec(4, `<div class="photos">${W.photo.map(([h, p], i) => `<div class="ph" data-r>${photoFrames[i]}<h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
  <p class="muted" style="margin-top:28px;font-size:15px" data-r>These frames describe the photography. They are not photographs. No stock images are used anywhere in this option.</p>`);

  const collection = sec(5, `<div class="grid6">${PRODUCTS.map((p, i) => `<article class="prod" data-r>
    <div class="top mono"><span>Sheet ${pad(i + 1)} / 06</span><span>${esc(p.type)}</span></div>
    <div class="img"><img src="${IMG[p.id]}" alt="${esc(p.name)} ${esc(p.type.toLowerCase())}, ${esc(p.finish.toLowerCase())}. Supplied product render"></div>
    <div class="body">
      <h3>${esc(p.name)}</h3>
      <span class="mono reading">Reading: ${esc(p.inspired)}</span>
      <p class="line">${esc(p.line)}</p>
      ${p.alt ? `<p class="alt">Alternative line: ${esc(p.alt)}</p>` : ''}
      <p class="story">${esc(p.idea)}</p>
      <span class="spec mono">${esc(p.finish)}${p.note ? ' / ' + esc(p.note) : ''}</span>
    </div>
  </article>`).join('')}</div>`);

  const voice = sec(6, `<div class="voice">
    <div data-r><p class="lead">${esc(W.voice.summary)}</p><ul class="words">${W.feeling.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>
    <div>${W.voice.samples.map(([k, v]) => `<div class="vrow" data-r><span class="mono">${esc(k)}</span><p>${esc(v)}</p></div>`).join('')}</div>
  </div>`);

  const touch = sec(7, `<div class="touch">
    <figure class="tp" data-r><div class="tag-mock">${small(52)}<div><span class="mono muted">Sheet 01 / 06</span><h4 style="margin-top:8px">Ridge</h4><span class="mono">Reading: terrain</span></div>${wordmark()}</div><figcaption><b>Hang tag</b><span>Paper stock printed with the product’s own contour sheet.</span></figcaption></figure>
    <figure class="tp" data-r><div class="box-mock">${contourSVG({ seed: 9, cols: 80, levels: 14 })}${lockup()}</div><figcaption><b>Box and dust bag</b><span>Slate board with a tone-on-tone contour print. The same field works as a lining jacquard.</span></figcaption></figure>
    <figure class="tp" data-r><div class="social-mock"><div class="bar mono"><span>Field note 04</span><span>Tuskrr</span></div><img src="${IMG.crest}" alt="CREST backpack, supplied product render"><div class="cap">CREST. Reading: elevation. Find your high point.</div></div><figcaption><b>Social post</b><span>Every post is a field note, numbered.</span></figcaption></figure>
  </div>`);

  const web = sec(8, `<div class="web">
    <div class="wire" data-r aria-hidden="true"><div class="wr"><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="wm"><div class="h">${small(61)}</div><div class="c"></div><div class="c"></div><div class="c"></div><div class="c"></div><div class="c"></div><div class="c"></div></div></div>
    <dl class="dl" data-r>${W.web.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </div>
  <p class="muted" style="margin-top:24px;font-size:15px" data-r>This page is built the way the website would be: the legend rail on the left is the navigation.</p>`);

  const verdict = sec(9, `<div class="verdict">
    <div data-r><h3>Why choose it</h3><ul>${W.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
    <div class="w" data-r><h3>Watch for</h3><ul>${W.watch.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
  </div>`);

  const footer = `<footer class="nf" aria-label="What is not final">
  <h2>Not final</h2>
  <ul>${NOT_FINAL.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
  <div class="end">${lockup()}<span class="mono">Option ${W.letter} of C / <a href="START-HERE.html">Back to all options</a></span></div>
</footer>`;

  const body = `<div class="shell">${rail}<main>${hero}${world}${palette}${type}${device}${photo}${collection}${voice}${touch}${web}${verdict}${footer}</main></div>`;

  return page({
    title: `Tuskrr brand world A: ${W.name}`,
    description: `Brand world option A for Tuskrr. ${W.reading}`,
    fonts: FONTS.archivo + FONTS.plexMono,
    css: CSS,
    body,
  });
}
