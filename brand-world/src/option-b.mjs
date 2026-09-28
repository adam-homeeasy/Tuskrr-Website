// Option B, Quiet Architecture. Organising idea: strata bands over a channel
// field, with the collection as an index list and a product pane beside it.
import { IMG, FONTS, PRODUCTS, esc, strataSVG, lockup, monogram, goldS, GOLD_S_CSS, page, NOT_FINAL } from './shared.mjs';
import { SECTIONS, WORLDS } from './worlds.mjs';

const W = WORLDS.b;
const pad = (n) => String(n).padStart(2, '0');

const CSS = `
:root{--carbon:#121212;--graphite:#1E1E1E;--concrete:#D8D6D1;--bone:#ECEAE6;--stone:#9C988F;--shadow:#55524C;--brass:#C9A24A;--brass-deep:#7A5F1E;--gold-s:#C9A24A;
--sans:"Instrument Sans",system-ui,sans-serif}
body{background:var(--carbon);color:var(--bone);font-family:var(--sans);font-size:17px;line-height:1.6}
.wrap{max-width:1320px;margin:0 auto;padding:0 48px}
.caps{font-stretch:75%;text-transform:uppercase;letter-spacing:.22em;font-size:12px;font-weight:500}
.chan{background-image:linear-gradient(90deg,rgba(236,234,230,.075) 1px,transparent 1px);background-size:calc(100% / 12) 100%}
.band{position:relative;padding:112px 0}
.band.light{background:var(--concrete);color:var(--carbon)}
.band.light .chan-l{position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(18,18,18,.07) 1px,transparent 1px);background-size:calc(100% / 12) 100%;pointer-events:none}
.band>.wrap{position:relative}
.strata{display:block;width:100%;height:56px;color:var(--stone);opacity:.5}
.band.light .strata{color:var(--shadow)}
/* header */
.top{position:sticky;top:0;z-index:5;background:rgba(18,18,18,.94);border-bottom:1px solid #2a2a2a}
.top .wrap{display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:64px}
.top .home{display:block;width:120px;min-height:44px;display:flex;align-items:center;color:var(--bone)}
.top .home .gs{width:120px}
.top nav{display:flex}
.top nav a{min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;text-decoration:none;color:var(--stone);font-stretch:75%;font-size:13px;letter-spacing:.14em}
.top nav a:hover{color:var(--brass)}
/* hero */
.hero{min-height:calc(100vh - 64px);display:flex;flex-direction:column;justify-content:flex-end;padding:48px 0 64px;position:relative;overflow:hidden}
.hero .mono-big{position:absolute;right:48px;top:56px;width:min(22vw,260px);color:#2a2a2a}
.hero .kick{color:var(--stone);display:flex;gap:28px;flex-wrap:wrap}
.hero h1{font-stretch:75%;font-weight:600;text-transform:uppercase;letter-spacing:.02em;font-size:clamp(56px,10.5vw,168px);line-height:.9;margin:28px 0 36px}
.hero h1 span{display:block}
.hero h1 .b{color:var(--brass)}
.hero .row{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:0 24px;border-top:1px solid #333;padding-top:22px}
.hero .row p{grid-column:1/7;font-size:19px;line-height:1.55;color:var(--bone)}
.hero .row ul{grid-column:9/13;display:flex;flex-direction:column;gap:6px;color:var(--stone)}
/* section heads */
.sh{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:0 24px;margin-bottom:64px;align-items:end}
.sh .n{grid-column:1/3;font-stretch:75%;font-size:88px;line-height:.8;font-weight:400;color:var(--stone)}
.band.light .sh .n{color:var(--shadow)}
.sh h2{grid-column:3/10;font-stretch:75%;text-transform:uppercase;letter-spacing:.14em;font-weight:500;font-size:clamp(28px,3.4vw,44px);line-height:1}
.sh .caps{grid-column:10/13;text-align:right;color:var(--stone)}
.band.light .sh .caps{color:var(--shadow)}
.lead{font-size:clamp(22px,2.4vw,32px);line-height:1.35;font-weight:400;max-width:26em}
.g12{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:40px 24px}
/* world */
.thesis p{grid-column:span 4;font-size:16px;color:var(--stone);border-top:1px solid #333;padding-top:16px}
.thesis p b{display:block;color:var(--bone);font-weight:500;font-stretch:75%;letter-spacing:.18em;text-transform:uppercase;font-size:12px;margin-bottom:10px}
.markrow{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px;margin-top:80px;align-items:center}
.markrow .m{grid-column:1/4;background:var(--graphite);aspect-ratio:1/1;display:flex;align-items:center;justify-content:center}
.markrow .m .mk-mono{width:56%;height:auto;color:var(--bone)}
.markrow .m.gold{grid-column:4/7;background:var(--carbon);border:1px solid #333}
.markrow .m.gold .gs{width:78%}
.markrow p{grid-column:7/13;font-size:19px}
/* palette */
.cols7{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:12px}
.col{display:flex;flex-direction:column}
.col .bar{height:340px;border:1px solid rgba(18,18,18,.18)}
.col b{margin-top:14px;font-stretch:75%;text-transform:uppercase;letter-spacing:.16em;font-size:13px;font-weight:600}
.col span{font-size:13px;color:var(--shadow)}
.col p{font-size:14px;margin-top:6px;line-height:1.4}
.col .note{color:var(--shadow);font-size:13px}
/* type */
.spec .display{grid-column:1/8;font-stretch:75%;text-transform:uppercase;font-weight:600;letter-spacing:.06em;font-size:clamp(48px,7vw,104px);line-height:.95}
.spec .display .l{font-weight:400;color:var(--stone)}
.spec .notes{grid-column:9/13;display:flex;flex-direction:column;gap:28px}
.spec .notes div{border-top:1px solid #333;padding-top:14px}
.spec .notes h3{font-size:18px;font-weight:600}
.spec .notes p{font-size:15px;color:var(--stone);margin-top:6px}
.spec .sample{color:var(--bone)!important}
.tracking{grid-column:1/-1;display:flex;flex-wrap:wrap;gap:12px 48px;border-top:1px solid #333;padding-top:20px;color:var(--stone)}
/* device */
.device .fig{grid-column:1/8;aspect-ratio:4/3;background:var(--carbon);position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.device .fig .flute{position:absolute;inset:0;background:repeating-linear-gradient(90deg,#161616 0 18px,#1f1f1f 18px 20px,#0e0e0e 20px 22px,#161616 22px 40px)}
.device .fig{color:#3a3a3a}.device .fig .gs{position:relative;width:52%}
.device .txt{grid-column:9/13}
.device .txt h3{font-stretch:75%;text-transform:uppercase;letter-spacing:.14em;font-size:28px;font-weight:500}
.device .txt p{margin-top:14px;color:#3d3b37}
.device .txt ul{margin-top:24px;border-top:1px solid rgba(18,18,18,.25)}
.device .txt li{padding:12px 0;border-bottom:1px solid rgba(18,18,18,.25);font-stretch:75%;text-transform:uppercase;letter-spacing:.16em;font-size:13px;font-weight:500}
.device .strip{grid-column:1/-1;height:120px;color:var(--shadow)}
.device .strip svg{width:100%;height:100%}
/* photo */
.photos .ph{grid-column:span 3}
.ph .frame{aspect-ratio:3/4;position:relative;overflow:hidden;background:var(--graphite)}
.ph h3{font-size:17px;font-weight:600;margin-top:16px}
.ph p{font-size:15px;color:var(--stone);margin-top:4px}
.frame .cap{position:absolute;z-index:2;left:10px;bottom:10px;color:var(--bone)!important;background:rgba(18,18,18,.85);padding:3px 6px;font-size:10px}
.f1{background:repeating-linear-gradient(90deg,#3a3936 0 26px,#6d6a64 26px 30px,#262523 30px 34px,#3a3936 34px 60px)!important}
.f1::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,rgba(0,0,0,.65),rgba(0,0,0,0) 55%,rgba(255,255,255,.08))}
.f2{display:flex;align-items:flex-end;justify-content:center;background:radial-gradient(ellipse at 25% 15%,#d9d7d2,#9e9b95 75%)!important}
.f2 .plinth{width:64%;height:24%;background:linear-gradient(90deg,#3c3a37,#57544f 60%,#2a2927)}
.f2 img{position:absolute;left:18%;bottom:22%;width:64%;mix-blend-mode:multiply;filter:contrast(1.08)}
.f3{background:linear-gradient(180deg,#bdbab3,#a3a09a)!important}
.f3 i{position:absolute;bottom:14%;left:58%;width:6%;height:46%;background:#1b1b1b;border-radius:30px 30px 4px 4px}
.f3 i::before{content:"";position:absolute;top:-16%;left:10%;width:80%;height:14%;background:#1b1b1b;border-radius:50%}
.f3::after{content:"";position:absolute;left:0;right:0;bottom:0;height:14%;background:#8f8c86}
.f4{display:grid;grid-template-columns:repeat(6,1fr)}
.f4 i:nth-child(1){background:#121212}.f4 i:nth-child(2){background:#2b2a28}.f4 i:nth-child(3){background:#55524C}.f4 i:nth-child(4){background:#8d8a84}.f4 i:nth-child(5){background:#D8D6D1}.f4 i:nth-child(6){background:#8A4722}
/* collection: index */
.index{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px;align-items:start}
.index ol{grid-column:1/7;border-top:1px solid rgba(18,18,18,.3)}
.index li{border-bottom:1px solid rgba(18,18,18,.3)}
.index button{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:56px minmax(0,1fr) auto;gap:16px;align-items:baseline;width:100%;padding:22px 0;min-height:44px}
.index button:focus-visible{outline:2px solid var(--carbon);outline-offset:2px}
.index .no{font-stretch:75%;font-size:14px;letter-spacing:.14em;color:var(--shadow)}
.index .nm{font-stretch:75%;text-transform:uppercase;letter-spacing:.1em;font-size:clamp(28px,3.4vw,46px);font-weight:500;line-height:1}
.index .ty{font-size:13px;color:var(--shadow);font-stretch:75%;letter-spacing:.14em;text-transform:uppercase}
.index li .more{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s var(--ease)}
.index li .more>div{overflow:hidden;visibility:hidden;transition:visibility .25s var(--ease)}.index li.on .more>div{visibility:visible}
.index li.on .more{grid-template-rows:1fr}
.index li.on .nm{color:var(--brass-deep)}
.index .more p{padding:0 0 6px 72px;font-size:16px;color:#2e2d2a}
.index .more p.line{font-size:21px;font-weight:600;color:var(--carbon)}
.index .more p:last-child{padding-bottom:24px}
.index .more .alt{font-size:14px;color:var(--shadow)}
.index .more .mob{display:none}
.pane{grid-column:8/13;position:sticky;top:96px;background:#fff;aspect-ratio:4/5;overflow:hidden}
.pane img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;opacity:0;transition:opacity .25s var(--ease)}
.pane img.on{opacity:1}
.pane .cap{position:absolute;left:14px;bottom:12px;color:var(--bone);background:rgba(18,18,18,.85);padding:3px 6px;font-size:11px;z-index:1}
/* voice */
.vlist{border-top:1px solid #333}
.vlist div{display:grid;grid-template-columns:repeat(12,minmax(0,1fr));gap:24px;padding:28px 0;border-bottom:1px solid #333;align-items:baseline}
.vlist .caps{grid-column:1/4;color:var(--stone)}
.vlist p{grid-column:4/13;font-stretch:75%;text-transform:uppercase;letter-spacing:.06em;font-size:clamp(24px,3vw,40px);line-height:1.1;font-weight:500}
.vsum{margin-bottom:56px}
.vsum .words{display:flex;gap:28px;margin-top:22px;color:var(--brass);flex-wrap:wrap}
/* touch */
.touch .tp{grid-column:span 4}
.tp .obj{aspect-ratio:1/1;background:var(--graphite);display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden}
.tp figcaption{margin-top:16px;border-top:1px solid rgba(18,18,18,.3);padding-top:12px}
.tp figcaption b{display:block;font-size:17px}
.tp figcaption span{font-size:14px;color:#3d3b37}
.box{width:72%;aspect-ratio:1.3/1;background:var(--carbon);display:flex;align-items:center;justify-content:center;box-shadow:0 30px 40px -22px rgba(0,0,0,.7);position:relative}
.box::before{content:"";position:absolute;inset:0;background-image:linear-gradient(90deg,rgba(236,234,230,.06) 1px,transparent 1px);background-size:calc(100% / 12) 100%}
.box{color:#3a3a3a}.box .gs{width:46%;position:relative}
.htag{width:48%;aspect-ratio:1/1.9;background:var(--bone);position:relative;display:flex;flex-direction:column;justify-content:space-between;padding:22% 10% 10%;color:var(--carbon);box-shadow:0 24px 30px -20px rgba(0,0,0,.6)}
.htag::before{content:"";position:absolute;top:8%;left:50%;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:var(--graphite)}
.htag .gs{width:100%;--gold-s:#7A5F1E}
.htag .l{font-stretch:75%;text-transform:uppercase;letter-spacing:.08em;font-size:11px;font-weight:600;line-height:1.5}
.soc{width:78%;aspect-ratio:1/1;background:var(--carbon);display:grid;grid-template-rows:1fr auto;box-shadow:0 24px 30px -20px rgba(0,0,0,.6)}
.soc .im{background:#fff;overflow:hidden;min-height:0}
.soc .im img{width:100%;height:100%;object-fit:contain}
.soc p{padding:12px 14px;font-stretch:75%;text-transform:uppercase;letter-spacing:.1em;font-size:14px;color:var(--bone)}
/* web */
.web .wire{grid-column:1/8;aspect-ratio:16/10;background:var(--graphite);border:1px solid #333;display:grid;grid-template-columns:1fr 1fr;gap:16px;padding:22px}
.wire .l i{display:block;height:14px;background:#2d2d2d;margin-bottom:14px}
.wire .l i:nth-child(3){background:var(--brass)}
.wire .r{background:#e9e8e4}
.web dl{grid-column:9/13;border-top:1px solid #333}
.web dl div{padding:14px 0;border-bottom:1px solid #333}
.web dt{color:var(--brass)}
.web dd{margin-top:6px;font-size:16px;color:var(--bone)}
/* verdict */
.verdict .c{grid-column:span 6}
.verdict h3{font-stretch:75%;text-transform:uppercase;letter-spacing:.14em;font-size:22px;font-weight:500;padding-bottom:16px;border-bottom:1px solid rgba(18,18,18,.3)}
.verdict li{padding:16px 0;border-bottom:1px solid rgba(18,18,18,.3);font-size:17px}
footer.nf{padding:96px 0 64px;background:var(--carbon)}
footer.nf h2{font-stretch:75%;text-transform:uppercase;letter-spacing:.14em;font-size:22px;font-weight:500}
footer.nf ul{display:grid;grid-template-columns:1fr 1fr;gap:0 48px;margin-top:24px}
footer.nf li{padding:14px 0;border-top:1px solid #333;font-size:14px;color:var(--stone)}
footer.nf .end{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-top:48px;flex-wrap:wrap;color:var(--stone)}
footer.nf .lockup{font-size:20px;color:var(--bone)}
footer.nf a{color:var(--bone);display:inline-flex;align-items:center;min-height:44px}
${GOLD_S_CSS}
@media (max-width:1000px){
.cols7{grid-template-columns:repeat(4,minmax(0,1fr));row-gap:28px}
.col .bar{height:180px}
.thesis p,.photos .ph{grid-column:span 6}
.spec .display,.spec .notes,.device .fig,.device .txt,.web .wire,.web dl{grid-column:1/-1}
.touch .tp{grid-column:span 6}
}
@media (max-width:760px){
.wrap{padding:0 16px}
.band{padding:72px 0}
.top nav{display:none}
.hero .mono-big{right:16px;top:24px;width:34vw}
.hero .row p,.hero .row ul{grid-column:1/-1}
.hero .row ul{margin-top:16px}
.sh{grid-template-columns:1fr;gap:10px;margin-bottom:40px}
.sh .n,.sh h2,.sh .caps{grid-column:1/-1;text-align:left}
.sh .n{font-size:56px}
.thesis p,.photos .ph,.touch .tp,.verdict .c{grid-column:1/-1}
.markrow{margin-top:48px}
.markrow .m{grid-column:span 6}
.markrow p{grid-column:1/-1}
.cols7{grid-template-columns:repeat(2,minmax(0,1fr))}
.index ol{grid-column:1/-1}
.pane{display:none}
.index .more .mob{display:block;background:#fff;margin:0 0 16px 72px;aspect-ratio:1/1}
.index .more .mob img{width:100%;height:100%;object-fit:contain}
.index .more p{padding-left:0}
.index .more .mob{margin-left:0}
.vlist .caps,.vlist p{grid-column:1/-1}
footer.nf ul{grid-template-columns:1fr}
}
`;

const sh = (i, light) => {
  const [id, label] = SECTIONS[i];
  return `<header class="sh" data-r><span class="n" aria-hidden="true">${pad(i + 1)}</span><h2 id="h-${id}">${esc(label)}</h2><span class="caps">${esc(W.name)}</span></header>`;
};
const band = (i, inner, light = false) => {
  const id = SECTIONS[i][0];
  return `<section class="band${light ? ' light' : ' chan'}" id="${id}" aria-labelledby="h-${id}">${light ? '<div class="chan-l" aria-hidden="true"></div>' : ''}<div class="wrap">${sh(i, light)}${inner}</div></section>`;
};

export function renderB() {
  const header = `<header class="top"><div class="wrap"><a class="home" href="#top" aria-label="Tuskrr, back to top">${goldS()}</a><nav aria-label="Sections">${SECTIONS.map(([id, label], i) => `<a href="#${id}" title="${esc(label)}"><span class="sr">${esc(label)} </span>${pad(i + 1)}</a>`).join('')}</nav></div></header>`;

  const hero = `<section class="hero chan" id="top" aria-label="${esc(W.name)}"><div class="wrap" style="width:100%">
    ${monogram('mono-big')}
    <div class="kick caps" data-r><span>Tuskrr</span><span>Brand world, option ${W.letter}</span><span>${esc(W.name)}</span></div>
    <h1 data-r><span>Every line</span><span>has <span class="b" style="display:inline">purpose.</span></span></h1>
    <div class="row" data-r><p>${esc(W.intro)}</p><ul class="caps">${W.feeling.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>
  </div></section>`;

  const world = band(0, `
    <p class="lead" data-r>${esc(W.reading)}</p>
    <div class="g12 thesis" style="margin-top:56px">${W.thesis.map((t, i) => `<p data-r><b>${['The channel', 'The colour', 'The place'][i]}</b>${esc(t)}</p>`).join('')}</div>
    <div class="markrow" data-r><div class="m">${monogram()}</div><div class="m gold">${goldS()}</div><p>The monogram and the wordmark stay exactly as drawn. What changes is how sparingly they are used: one mark per view, generous space around it, and the S in brass wherever the wordmark is cast in metal.</p></div>`);

  const palette = band(1, `
    <div class="cols7">${W.palette.map((c) => `<div class="col" data-r><div class="bar" style="background:${c.hex}"></div><b>${esc(c.name)}</b><span>${c.hex}</span><p>${esc(c.role)}</p>${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}</div>`).join('')}</div>
    <p style="margin-top:40px;max-width:40em;color:#3d3b37" data-r>Seven values and almost no hue. Warmth comes from the leather in the photography, never from the page. Brass is reserved for the S and for a single call to action per view.</p>`, true);

  const type = band(2, `
    <div class="g12 spec">
      <div class="display" data-r aria-hidden="true">Strata<br><span class="l">Contour</span><br>Axis</div>
      <div class="notes">
        <div data-r><h3>${esc(W.type.display)}</h3><p>${esc(W.type.displayWhy)}</p></div>
        <div data-r><h3>${esc(W.type.text)}</h3><p>${esc(W.type.textWhy)}</p><p class="sample">Layers of earth. Layers of architecture. Layers of work, ambition and experience.</p></div>
        <div data-r><h3>${esc(W.type.data)}</h3><p>${esc(W.type.dataWhy)}</p></div>
      </div>
      <div class="tracking caps" data-r><span>Tracking 0.22em for labels</span><span>0.14em for headings</span><span>0.06em for display</span></div>
    </div>`);

  const device = band(3, `
    <div class="g12 device">
      <div class="fig" data-r><div class="flute" aria-hidden="true"></div>${goldS()}</div>
      <div class="txt" data-r><h3>${esc(W.device.title)}</h3><p>${esc(W.device.text)}</p><ul>${W.device.supports.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
      <div class="strip" data-r>${strataSVG({ seed: 23, lines: 22, h: 120 })}</div>
    </div>`, true);

  const frames = [
    `<div class="frame f1"><span class="cap caps">Drawn stand-in</span></div>`,
    `<div class="frame f2"><span class="plinth"></span><img src="${IMG.strata}" alt="STRATA briefcase, supplied product render"><span class="cap caps" style="color:#3d3b37">Supplied render</span></div>`,
    `<div class="frame f3"><i></i><span class="cap caps" style="color:#3d3b37">Drawn stand-in</span></div>`,
    `<div class="frame f4" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div>`,
  ];
  const photo = band(4, `<div class="g12 photos">${W.photo.map(([h, p], i) => `<div class="ph" data-r>${frames[i]}<h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
    <p style="margin-top:32px;color:var(--stone);font-size:15px" data-r>These frames describe the photography. They are not photographs. No stock images are used anywhere in this option.</p>`);

  const collection = band(5, `
    <div class="index">
      <ol>${PRODUCTS.map((p, i) => `<li class="${i === 0 ? 'on' : ''}" data-r>
        <button type="button" aria-expanded="${i === 0}" aria-controls="more-${p.id}" data-i="${i}"><span class="no">${pad(i + 1)}</span><span class="nm">${esc(p.name)}</span><span class="ty">${esc(p.type)}</span></button>
        <div class="more" id="more-${p.id}"><div>
          <div class="mob"><img src="${IMG[p.id]}" alt=""></div>
          <p class="line">${esc(p.line)}</p>
          ${p.alt ? `<p class="alt">Alternative line: ${esc(p.alt)}</p>` : ''}
          <p>${esc(p.idea)}</p>
          <p class="alt">Inspired by ${esc(p.inspired)}. ${esc(p.finish)}.${p.note ? ' ' + esc(p.note) + '.' : ''}</p>
        </div></div>
      </li>`).join('')}</ol>
      <div class="pane" data-r aria-live="polite">${PRODUCTS.map((p, i) => `<img src="${IMG[p.id]}" alt="${esc(p.name)} ${esc(p.type.toLowerCase())}, ${esc(p.finish.toLowerCase())}. Supplied product render" class="${i === 0 ? 'on' : ''}"${i === 0 ? '' : ' aria-hidden="true"'}>`).join('')}<span class="cap caps">Supplied render</span></div>
    </div>
    <script>(function(){var lis=[].slice.call(document.querySelectorAll(".index li")),imgs=[].slice.call(document.querySelectorAll(".pane img"));
    function pick(i){lis.forEach(function(li,j){li.classList.toggle("on",j===i);li.querySelector("button").setAttribute("aria-expanded",j===i)});imgs.forEach(function(im,j){im.classList.toggle("on",j===i);if(j===i)im.removeAttribute("aria-hidden");else im.setAttribute("aria-hidden","true")})}
    lis.forEach(function(li,i){var b=li.querySelector("button");b.addEventListener("click",function(){pick(i)});b.addEventListener("mouseenter",function(){if(matchMedia("(hover:hover)").matches)pick(i)})})})();</script>`, true);

  const voice = band(6, `
    <div class="vsum" data-r><p class="lead">${esc(W.voice.summary)}</p><div class="words caps">${W.feeling.map((f) => `<span>${esc(f)}</span>`).join('')}</div></div>
    <div class="vlist">${W.voice.samples.map(([k, v]) => `<div data-r><span class="caps">${esc(k)}</span><p>${esc(v)}</p></div>`).join('')}</div>`);

  const touch = band(7, `<div class="g12 touch">
    <figure class="tp" data-r><div class="obj"><div class="box">${goldS()}</div></div><figcaption><b>Box</b><span>Carbon board, blind channel emboss, the wordmark foiled with a brass S.</span></figcaption></figure>
    <figure class="tp" data-r><div class="obj" style="background:#c9c7c1"><div class="htag">${goldS()}<span class="l">STRATA<br>Laptop briefcase<br>Every line placed.<br>Nothing added.</span></div></div><figcaption><b>Hang tag</b><span>Bone card, deep brass S. Three lines of copy, no more.</span></figcaption></figure>
    <figure class="tp" data-r><div class="obj"><div class="soc"><div class="im"><img src="${IMG.contour}" alt="CONTOUR folio, supplied product render"></div><p>CONTOUR. Now available.</p></div></div><figcaption><b>Social post</b><span>One object, one line, nothing else in the frame.</span></figcaption></figure>
  </div>`, true);

  const web = band(8, `<div class="g12 web">
    <div class="wire" data-r aria-hidden="true"><div class="l"><i></i><i></i><i></i><i></i><i></i><i></i></div><div class="r"></div></div>
    <dl data-r>${W.web.map(([k, v]) => `<div><dt class="caps">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </div>
  <p style="margin-top:28px;color:var(--stone);font-size:15px" data-r>This page is built the way the website would be: try the collection index above.</p>`);

  const verdict = band(9, `<div class="g12 verdict">
    <div class="c" data-r><h3>Why choose it</h3><ul>${W.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
    <div class="c" data-r><h3>Watch for</h3><ul>${W.watch.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
  </div>`, true);

  const footer = `<footer class="nf" aria-label="What is not final"><div class="wrap">
    <h2>Not final</h2>
    <ul>${NOT_FINAL.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    <div class="end">${lockup()}<span class="caps">Option ${W.letter} of C / <a href="START-HERE.html">Back to all options</a></span></div>
  </div></footer>`;

  const body = `${header}<main>${hero}${world}${palette}${type}${device}${photo}${collection}${voice}${touch}${web}${verdict}</main>${footer}`;

  return page({
    title: `Tuskrr brand world B: ${W.name}`,
    description: `Brand world option B for Tuskrr. ${W.reading}`,
    fonts: FONTS.instrumentSans,
    css: CSS,
    body,
  });
}
