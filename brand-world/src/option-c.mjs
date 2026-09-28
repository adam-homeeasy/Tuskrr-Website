// Option C, High Ground. Organising idea: a sequence of scenes with a fixed
// elevation line that fills as you scroll and marks each product as a waypoint.
import { IMG, FONTS, PRODUCTS, esc, ridgesSVG, profile, grain, lockup, wordmark, monogram, page, NOT_FINAL } from './shared.mjs';
import { SECTIONS, WORLDS } from './worlds.mjs';

const W = WORLDS.c;
const pad = (n) => String(n).padStart(2, '0');

const DUSK = [
  { base: 0.52, amp: 0.3, freq: 2.2, fill: '#7a4a5e' },
  { base: 0.66, amp: 0.3, freq: 2.8, fill: '#4f3547' },
  { base: 0.8, amp: 0.3, freq: 3.4, fill: '#3a2530' },
  { base: 0.92, amp: 0.26, freq: 4.1, fill: '#2a1a1c' },
  { base: 1.02, amp: 0.2, freq: 5, fill: '#221610' },
];

const CSS = `
:root{--bark:#221610;--bark2:#2E1E16;--sand:#EBDDC7;--grass:#B9A68C;--terra:#D0603F;--ember:#E39A5B;--dusk:#8C6A8E;--terra-deep:#A2432A;
--serif:"Instrument Serif",Georgia,serif;--sans:"Hanken Grotesk",system-ui,sans-serif;--grain:${grain(0.22, '1 0.9 0.8')}}
body{background:var(--bark);color:var(--sand);font-family:var(--sans);font-size:17px;line-height:1.6}
.wrap{max-width:1280px;margin:0 auto;padding:0 48px}
.lab{font-size:12px;letter-spacing:.24em;text-transform:uppercase;font-weight:600}
.serif{font-family:var(--serif);font-weight:400}
.grain{position:relative;isolation:isolate}
.grain::after{content:"";position:absolute;inset:0;background-image:var(--grain);pointer-events:none;z-index:3;opacity:.9}
/* elevation bar */
.elev{position:fixed;top:0;left:0;right:0;z-index:10;background:rgba(34,22,16,.92);border-bottom:1px solid rgba(185,166,140,.18)}
.elev .wrap{display:flex;align-items:center;gap:28px;height:64px;max-width:none}
.elev .home{display:flex;align-items:center;min-height:44px;color:var(--sand)}
.elev .home .mk-word{height:20px;width:auto}
.elev .track{position:relative;flex:1;height:44px}
.elev svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.elev .base{stroke:rgba(185,166,140,.4)}
.elev .done{stroke:var(--ember)}
.elev .wp{position:absolute;transform:translate(-50%,-50%);min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;text-decoration:none}
.elev .wp i{display:block;width:9px;height:9px;border-radius:50%;background:var(--bark);border:1.5px solid var(--grass)}
.elev .wp.past i{background:var(--ember);border-color:var(--ember)}
.elev .wp span{position:absolute;top:30px;white-space:nowrap;font-size:10px;letter-spacing:.2em;color:var(--grass);opacity:0;transition:opacity .25s var(--ease)}
.elev .wp:hover span,.elev .wp:focus-visible span{opacity:1}
.elev .pct{font-size:11px;letter-spacing:.2em;color:var(--grass);min-width:48px;text-align:right}
main{padding-top:64px}
/* hero */
.hero{min-height:calc(100vh - 64px);position:relative;overflow:hidden;background:linear-gradient(180deg,#150e14 0%,#2d1d2c 28%,#6a3f55 48%,#c46a47 60%,#e39a5b 70%);display:flex;flex-direction:column}
.hero .sun{position:absolute;left:62%;top:44%;width:180px;height:180px;border-radius:50%;background:radial-gradient(circle,#f2b27a 0%,rgba(242,178,122,.35) 45%,rgba(242,178,122,0) 70%)}
.hero .ridges{position:absolute;left:0;right:0;bottom:0;width:100%;height:50%}
.hero .top{position:relative;z-index:2;padding-top:72px}
.hero .kick{color:var(--sand);display:flex;gap:28px;flex-wrap:wrap}
.hero h1{font-family:var(--serif);font-weight:400;font-size:clamp(64px,11vw,184px);line-height:.92;margin-top:24px;letter-spacing:-.01em}
.hero h1 em{color:var(--ember)}
.hero .bottom{position:relative;z-index:2;margin-top:auto;padding-bottom:56px;display:grid;grid-template-columns:minmax(0,1fr) auto;gap:32px;align-items:end}
.hero .bottom p{max-width:34em;font-size:19px;line-height:1.55}
.hero .bottom .mk-mono{width:96px;height:auto;color:var(--sand)}
/* scenes */
.scene{padding:128px 0;position:relative}
.scene.alt{background:var(--bark2)}
.scene.sand{background:var(--sand);color:var(--bark)}
.sh{display:flex;align-items:baseline;gap:24px;margin-bottom:56px;flex-wrap:wrap}
.sh .lab{color:var(--grass)}
.scene.sand .sh .lab{color:var(--terra-deep)}
.sh h2{font-family:var(--serif);font-weight:400;font-size:clamp(44px,5.6vw,80px);line-height:1}
.sh h2 em{font-style:italic;color:var(--ember)}
.scene.sand .sh h2 em{color:var(--terra-deep)}
.lead{font-family:var(--serif);font-size:clamp(26px,3vw,40px);line-height:1.25;max-width:22em}
.two{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:64px}
.muted{color:var(--grass)}
/* world */
.thesis{margin-top:56px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px}
.thesis p{font-size:16px;color:var(--grass);border-top:1px solid rgba(185,166,140,.3);padding-top:18px}
.thesis p b{display:block;font-family:var(--serif);font-weight:400;font-size:26px;color:var(--sand);margin-bottom:8px;line-height:1.1}
.markband{margin-top:80px;display:grid;grid-template-columns:auto minmax(0,1fr);gap:48px;align-items:center;border-top:1px solid rgba(185,166,140,.3);padding-top:48px}
.markband .mk-mono{width:180px;height:auto;color:var(--ember)}
.markband p{font-family:var(--serif);font-size:28px;line-height:1.3;max-width:24em}
/* palette */
.sky{display:flex;flex-direction:column;border-radius:4px;overflow:hidden}
.sky .b{box-shadow:inset 0 0 0 1px rgba(235,221,199,.08);display:grid;grid-template-columns:200px 110px minmax(0,1fr) minmax(0,1fr);gap:20px;align-items:center;padding:22px 24px;min-height:88px}
.sky .b b{font-family:var(--serif);font-weight:400;font-size:28px;line-height:1}
.sky .b span{font-size:13px;letter-spacing:.14em}
.sky .b p{font-size:15px}
.sky .b .note{font-size:13px;opacity:.85}
/* type */
.spec .big{font-family:var(--serif);font-size:clamp(56px,8vw,120px);line-height:.95}
.spec .big em{color:var(--terra-deep)}
.spec .tk{border-top:1px solid rgba(34,22,16,.25);padding:16px 0 24px}
.spec .tk h3{font-family:var(--serif);font-weight:400;font-size:30px;line-height:1.1}
.spec .tk p{font-size:15px;color:#5a4636;margin-top:6px}
.spec .tk .sample{color:var(--bark);font-size:17px;margin-top:10px}
.spec .tk .sample.lab{font-size:12px}
/* device */
.device .art{position:relative;aspect-ratio:16/8;border-radius:4px;overflow:hidden;background:linear-gradient(180deg,#2b1d2b,#5b3b52 55%,#a15a45)}
.device .art svg{position:absolute;inset:0;width:100%;height:100%}
.device .prof{margin-top:40px;position:relative;height:120px}
.device .prof svg{width:100%;height:100%;overflow:visible}
.device .prof .pt{position:absolute;transform:translate(-50%,-50%)}
.device .prof .pt i{display:block;width:12px;height:12px;border-radius:50%;background:var(--ember);margin:0 auto}
.device .prof .pt span{display:block;margin-top:10px;font-size:11px;letter-spacing:.2em;color:var(--grass);text-align:center;white-space:nowrap}
.chips{display:flex;flex-wrap:wrap;gap:10px;margin-top:24px}
.chips li{border:1px solid rgba(185,166,140,.4);border-radius:40px;padding:8px 16px;font-size:13px;letter-spacing:.12em;text-transform:uppercase}
/* photo */
.photos{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
.ph .frame{aspect-ratio:3/4;border-radius:4px;overflow:hidden;position:relative}
.ph .frame svg{position:absolute;inset:0;width:100%;height:100%}
.ph .frame .cap{position:absolute;left:10px;bottom:10px;z-index:4;font-size:10px;color:var(--sand);letter-spacing:.2em;text-transform:uppercase;background:rgba(34,22,16,.7);padding:3px 6px}
.ph h3{font-family:var(--serif);font-weight:400;font-size:26px;margin-top:16px;line-height:1.1}
.ph p{font-size:15px;color:var(--grass);margin-top:6px}
.fr1{background:linear-gradient(180deg,#3a2438,#8a4f4a 60%,#e0925a)}
.fr2{background:linear-gradient(180deg,#c9a77e,#8c6a4c)}
.fr2 svg path{stroke:#EBDDC7}
.fr3{background:var(--sand);display:flex;align-items:center;justify-content:center}
.fr3 img{width:92%;mix-blend-mode:multiply}
.fr4{display:grid;grid-template-rows:repeat(5,1fr)}
.fr4 i:nth-child(1){background:#1a1113}.fr4 i:nth-child(2){background:#4f3547}.fr4 i:nth-child(3){background:#a15a45}.fr4 i:nth-child(4){background:#E39A5B}.fr4 i:nth-child(5){background:#EBDDC7}
/* collection */
.waypoint{min-height:80vh;display:flex;align-items:center;padding:96px 0;position:relative;overflow:hidden;scroll-margin-top:64px}
.waypoint:nth-child(even){background:var(--bark2)}
.waypoint .ridge-foot{position:absolute;left:0;right:0;bottom:0;height:120px;width:100%;opacity:.55}
.waypoint .wrap{position:relative;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:64px;align-items:center;width:100%}
.waypoint:nth-child(even) .card{order:-1}
.waypoint .no{color:var(--grass)}
.waypoint h3{font-family:var(--serif);font-weight:400;font-size:clamp(64px,9vw,136px);line-height:.9;margin:14px 0 18px;letter-spacing:.01em}
.waypoint .line{font-family:var(--serif);font-style:italic;font-size:clamp(26px,2.6vw,36px);line-height:1.2;color:var(--ember)}
.waypoint .alt{font-size:15px;color:var(--grass);margin-top:8px}
.waypoint .story{margin-top:22px;font-size:17px;max-width:32em}
.waypoint .facts{margin-top:22px;display:flex;flex-wrap:wrap;gap:8px 24px;color:var(--grass)}
.card{background:#e6e4e1;border-radius:4px;aspect-ratio:4/5;overflow:hidden;position:relative}.card.wide{aspect-ratio:16/11}
.card img{width:100%;height:100%;object-fit:cover}
.card .cap{position:absolute;left:12px;bottom:10px;font-size:10px;letter-spacing:.2em;text-transform:uppercase;color:var(--sand);background:rgba(34,22,16,.8);padding:3px 6px}
/* voice */
.vlist{border-top:1px solid rgba(185,166,140,.3)}
.vlist div{display:grid;grid-template-columns:200px minmax(0,1fr);gap:24px;padding:26px 0;border-bottom:1px solid rgba(185,166,140,.3);align-items:baseline}
.vlist .lab{color:var(--grass);font-size:11px}
.vlist p{font-family:var(--serif);font-style:italic;font-size:clamp(28px,3.2vw,44px);line-height:1.15}
.vsum{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:40px;align-items:end;margin-bottom:48px}
.vsum ul{display:flex;gap:10px;flex-wrap:wrap}
.vsum li{border:1px solid rgba(185,166,140,.4);border-radius:40px;padding:6px 14px;font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:var(--grass)}
/* touch */
.touch{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:32px}
.tp .obj{aspect-ratio:1/1;border-radius:4px;display:flex;align-items:center;justify-content:center;overflow:hidden;position:relative}
.tp figcaption{margin-top:16px;border-top:1px solid rgba(34,22,16,.25);padding-top:12px}
.tp figcaption b{display:block;font-family:var(--serif);font-weight:400;font-size:24px}
.tp figcaption span{font-size:14px;color:#5a4636}
.o1{background:#d7c6ab}
.htag{width:42%;aspect-ratio:1/1.9;background:var(--bark);color:var(--sand);border-radius:4px;position:relative;overflow:hidden;display:flex;flex-direction:column;justify-content:flex-start;gap:14px;padding:22% 10% 10%;box-shadow:0 24px 30px -20px rgba(34,22,16,.7)}
.htag::before{content:"";position:absolute;top:8%;left:50%;width:12px;height:12px;margin-left:-6px;border-radius:50%;background:#d7c6ab;z-index:2}
.htag svg{position:absolute;left:0;right:0;bottom:0;width:100%;height:28%}
.htag>*:not(svg){position:relative;z-index:1}
.htag .mk-word{width:100%;height:auto}
.htag p{font-family:var(--serif);font-style:italic;font-size:15px;line-height:1.2}
.o2{background:linear-gradient(180deg,#b88a5f,#8c6a4c)}
.box{width:74%;aspect-ratio:1.35/1;background:var(--terra-deep);display:flex;align-items:center;justify-content:center;color:var(--sand);position:relative;overflow:hidden;box-shadow:0 30px 40px -24px rgba(34,22,16,.8)}
.box svg{position:absolute;left:0;right:0;bottom:0;width:100%;height:50%}
.box .lockup{position:relative;font-size:20px}
.o3{background:var(--bark)}
.soc{width:80%;display:grid;grid-template-rows:auto auto;background:var(--bark2);box-shadow:0 24px 30px -20px rgba(0,0,0,.7)}
.soc .im{background:var(--sand);overflow:hidden;aspect-ratio:1.25/1}
.soc .im img{width:100%;height:100%;object-fit:contain;mix-blend-mode:multiply}
.soc p{padding:12px 14px;font-family:var(--serif);font-style:italic;font-size:19px;line-height:1.2;color:var(--sand)}
/* web */
.wire{aspect-ratio:16/10;border-radius:4px;overflow:hidden;background:var(--bark2);border:1px solid rgba(185,166,140,.25);display:grid;grid-template-rows:14% 1fr 1fr}
.wire .bar{border-bottom:1px solid rgba(185,166,140,.25);position:relative}
.wire .bar svg{position:absolute;inset:0;width:100%;height:100%}
.wire .s1{background:linear-gradient(180deg,#2b1d2b,#a15a45);position:relative;overflow:hidden}
.wire .s1 svg{position:absolute;inset:0;width:100%;height:100%}
.wire .s2{display:grid;grid-template-columns:1fr 1fr;gap:14px;padding:14px}
.wire .s2 i{display:block;background:rgba(185,166,140,.18)}
.wire .s2 i:last-child{background:var(--sand)}
.dl div{display:grid;grid-template-columns:140px minmax(0,1fr);gap:20px;padding:16px 0;border-bottom:1px solid rgba(185,166,140,.3)}
.dl{border-top:1px solid rgba(185,166,140,.3)}
.dl dt{color:var(--ember)}
.dl dd{font-size:16px}
/* verdict */
.verdict h3{font-family:var(--serif);font-weight:400;font-size:40px;border-bottom:1px solid rgba(34,22,16,.25);padding-bottom:12px}
.verdict li{padding:16px 0;border-bottom:1px solid rgba(34,22,16,.25);font-size:17px}
footer.nf{padding:96px 0 56px;background:#170f0b;position:relative;overflow:hidden}
footer.nf h2{font-family:var(--serif);font-weight:400;font-size:48px}
footer.nf ul{display:grid;grid-template-columns:1fr 1fr;gap:0 48px;margin-top:24px}
footer.nf li{padding:14px 0;border-top:1px solid rgba(185,166,140,.2);font-size:14px;color:var(--grass)}
footer.nf .end{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-top:48px;flex-wrap:wrap;color:var(--grass)}
footer.nf .lockup{font-size:20px;color:var(--sand)}
footer.nf a{color:var(--sand);display:inline-flex;align-items:center;min-height:44px}
@media (max-width:1000px){
.two,.waypoint .wrap{grid-template-columns:1fr;gap:40px}
.waypoint:nth-child(even) .card{order:0}
.thesis,.photos{grid-template-columns:repeat(2,minmax(0,1fr))}
.sky .b{grid-template-columns:160px 90px minmax(0,1fr)}
.sky .b .note{grid-column:3}
.touch{grid-template-columns:1fr 1fr}
}
@media (max-width:760px){
.wrap{padding:0 16px}
.elev .wrap{gap:14px}
.elev .wp span,.elev .pct,.device .prof .pt span{display:none}
.elev .home .mk-word{height:16px}
.scene{padding:80px 0}
.hero .top{padding-top:40px}
.hero .bottom{grid-template-columns:1fr}
.hero .bottom .mk-mono{display:none}
.thesis,.photos,.touch{grid-template-columns:1fr}
.markband{grid-template-columns:1fr;gap:24px}
.markband .mk-mono{width:120px}
.sky .b{grid-template-columns:1fr 1fr;gap:6px 16px}
.sky .b p,.sky .b .note{grid-column:1/-1}
.vlist div,.dl div{grid-template-columns:1fr;gap:6px}
.vsum{grid-template-columns:1fr}
.waypoint{min-height:0;padding:72px 0 120px}
footer.nf ul{grid-template-columns:1fr}
}
`;

const head = (i, title) => {
  const [id, label] = SECTIONS[i];
  return `<header class="sh" data-r><span class="lab">${pad(i + 1)} / ${esc(label)}</span><h2 class="serif" id="h-${id}">${title}</h2></header>`;
};
const scene = (i, title, inner, cls = '') => {
  const id = SECTIONS[i][0];
  return `<section class="scene ${cls}" id="${id}" aria-labelledby="h-${id}"><div class="wrap">${head(i, title)}${inner}</div></section>`;
};

export function renderC() {
  const prof = profile({ w: 1000, h: 44, seed: 5, marks: 6 });
  const elev = `<header class="elev"><div class="wrap">
    <a class="home" href="#top" aria-label="Tuskrr, back to top">${wordmark()}</a>
    <div class="track"><svg viewBox="0 0 1000 44" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id="elev-clip"><rect id="elev-rect" x="0" y="-20" width="0" height="84"/></clipPath></defs><path class="base" d="${prof.d}" fill="none" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path class="done" d="${prof.d}" fill="none" stroke-width="2" vector-effect="non-scaling-stroke" clip-path="url(#elev-clip)"/></svg>
    ${PRODUCTS.map((p, i) => `<a class="wp" href="#p-${p.id}" style="left:${(prof.wp[i].x * 100).toFixed(2)}%;top:${(prof.wp[i].y * 100).toFixed(2)}%" aria-label="Waypoint ${i + 1}, ${esc(p.name)}"><i></i><span>${esc(p.name)}</span></a>`).join('')}</div>
    <span class="pct" aria-hidden="true">0%</span>
  </div></header>`;

  const hero = `<section class="hero grain" id="top" aria-label="${esc(W.name)}">
    <span class="sun" aria-hidden="true"></span>
    ${ridgesSVG({ w: 1440, h: 560, seed: 3, layers: DUSK, cls: 'ridges' })}
    <div class="wrap top"><div class="kick lab" data-r><span>Tuskrr</span><span>Brand world, option ${W.letter}</span><span>${esc(W.name)}</span></div>
    <h1 data-r>Take the <em>long</em> way.</h1></div>
    <div class="wrap bottom"><p data-r>${esc(W.intro)}</p><div data-r>${monogram()}</div></div>
  </section>`;

  const world = scene(0, `Linear Wilderness, <em>walked.</em>`, `
    <p class="lead" data-r>${esc(W.thesis[0])}</p>
    <div class="thesis">${[['The tusker', W.thesis[1]], ['The stories', W.thesis[2]], ['The feeling', W.feeling.join(', ') + '. Every product is a waypoint, and the brand is the companion for the whole route, not the summit photo.']].map(([h, t]) => `<p data-r><b>${esc(h)}</b>${esc(t)}</p>`).join('')}</div>
    <div class="markband" data-r>${monogram()}<p>A tusker drawn in one unbroken line: the path it walks. In High Ground the monogram can take the ember colour of the last light, the only world where the mark is warm.</p></div>`);

  const palette = scene(1, `The colours of the <em>last hour.</em>`, `
    <div class="sky" data-r>${W.palette.map((c) => {
      const dark = ['#221610', '#2E1E16', '#8C6A8E', '#A2432A'].includes(c.hex);
      const ink = c.hex === '#8C6A8E' ? '#FFFFFF' : dark ? '#EBDDC7' : '#221610';
      return `<div class="b" style="background:${c.hex};color:${ink}"><b>${esc(c.name)}</b><span>${c.hex}</span><p>${esc(c.role)}</p>${c.note ? `<p class="note">${esc(c.note)}</p>` : '<p class="note"></p>'}</div>`;
    }).join('')}</div>
    <p class="muted" style="margin-top:28px;max-width:40em" data-r>Ordered like a dusk sky, from the dark ground up to the last light. Bark and sand carry the page; terracotta and ember are the sun on the leather.</p>`, 'alt');

  const type = scene(2, `Type that <em>tells a story.</em>`, `
    <div class="two spec">
      <p class="big" data-r aria-hidden="true">Find your<br><em>high point.</em></p>
      <div>
        <div class="tk" data-r><h3>${esc(W.type.display)}</h3><p>${esc(W.type.displayWhy)}</p></div>
        <div class="tk" data-r><h3>${esc(W.type.text)}</h3><p>${esc(W.type.textWhy)}</p><p class="sample">The journey leaves the line. You follow it.</p></div>
        <div class="tk" data-r><h3>${esc(W.type.data)}</h3><p>${esc(W.type.dataWhy)}</p><p class="sample lab">Waypoint 04 / Elevation</p></div>
      </div>
    </div>`, 'sand');

  const bigProf = profile({ w: 1000, h: 120, seed: 5, marks: 6 });
  const device = scene(3, `The <em>ridgeline.</em>`, `
    <div class="two">
      <div class="art grain" data-r>${ridgesSVG({ w: 1440, h: 720, seed: 17, layers: DUSK.map((l, i) => ({ ...l, base: l.base * 0.95 + 0.05 })) })}</div>
      <div data-r><p class="lead" style="font-size:clamp(24px,2.4vw,32px)">${esc(W.device.text)}</p><ul class="chips">${W.device.supports.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
    </div>
    <div class="prof" data-r><svg viewBox="0 0 1000 120" preserveAspectRatio="none" aria-hidden="true"><path d="${bigProf.d}" fill="none" stroke="#B9A68C" stroke-width="1.5" vector-effect="non-scaling-stroke"/></svg>
      ${PRODUCTS.map((p, i) => `<span class="pt" style="left:${(bigProf.wp[i].x * 100).toFixed(2)}%;top:${(bigProf.wp[i].y * 100).toFixed(2)}%"><i></i><span>${esc(p.name)}</span></span>`).join('')}
    </div>`, 'device');

  const frames = [
    `<div class="frame fr1 grain">${ridgesSVG({ w: 600, h: 800, seed: 29, layers: [{ base: 0.62, amp: 0.25, freq: 2, fill: '#5b3348' }, { base: 0.78, amp: 0.25, freq: 3, fill: '#3a2230' }, { base: 0.95, amp: 0.22, freq: 4, fill: '#221610' }] })}<span class="cap">Drawn stand-in</span></div>`,
    `<div class="frame fr2 grain"><svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true"><path d="M150 400 C 120 330, 200 300, 170 240 S 110 170, 150 120 S 190 60, 160 0" fill="none" stroke-width="10" stroke-linecap="round"/></svg><span class="cap">Drawn stand-in</span></div>`,
    `<div class="frame fr3"><img src="${IMG.traverse}" alt="TRAVERSE weekender, supplied product render"><span class="cap">Supplied render</span></div>`,
    `<div class="frame fr4" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>`,
  ];
  const photo = scene(4, `Low light, <em>long shadows.</em>`, `<div class="photos">${W.photo.map(([h, p], i) => `<div class="ph" data-r>${frames[i]}<h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
    <p class="muted" style="margin-top:32px;font-size:15px" data-r>These frames describe the photography. They are not photographs. No stock images are used anywhere in this option.</p>`, 'alt');

  const collection = `<section id="collection" aria-labelledby="h-collection">
    <div class="scene" style="padding-bottom:0"><div class="wrap">${head(5, `Six <em>waypoints.</em>`)}<p class="lead" data-r style="margin-bottom:24px">The collection, walked in order. Each product is a stage of the route.</p></div></div>
    <div class="wps">${PRODUCTS.map((p, i) => `<article class="waypoint" id="p-${p.id}" aria-label="${esc(p.name)}">
      ${ridgesSVG({ w: 1440, h: 120, seed: 40 + i, layers: [{ base: 0.7, amp: 0.6, freq: 3 + i * 0.3, fill: i % 2 && i < 5 ? '#221610' : '#2E1E16' }], cls: 'ridge-foot' })}
      <div class="wrap">
        <div>
          <span class="lab no" data-r>Waypoint ${pad(i + 1)} / ${esc(p.inspired)}</span>
          <h3 data-r>${esc(p.name.charAt(0) + p.name.slice(1).toLowerCase())}</h3>
          <p class="line" data-r>${esc(p.line)}</p>
          ${p.alt ? `<p class="alt" data-r>Alternative line: ${esc(p.alt)}</p>` : ''}
          <p class="story" data-r>${esc(p.idea)} ${esc(p.story)}</p>
          <p class="facts lab" data-r><span>${esc(p.type)}</span><span>${esc(p.finish)}</span>${p.note ? `<span>${esc(p.note)}</span>` : ''}</p>
        </div>
        <div class="card${['traverse', 'contour'].includes(p.id) ? ' wide' : ''}" data-r><img src="${IMG[p.id]}" alt="${esc(p.name)} ${esc(p.type.toLowerCase())}, ${esc(p.finish.toLowerCase())}. Supplied product render"><span class="cap">Supplied render</span></div>
      </div>
    </article>`).join('')}</div>
  </section>`;

  const voice = scene(6, `A voice that <em>invites.</em>`, `
    <div class="vsum" data-r><p class="lead" style="font-size:clamp(22px,2.2vw,30px)">${esc(W.voice.summary)}</p><ul>${W.feeling.map((f) => `<li>${esc(f)}</li>`).join('')}</ul></div>
    <div class="vlist">${W.voice.samples.map(([k, v]) => `<div data-r><span class="lab">${esc(k)}</span><p>${esc(v)}</p></div>`).join('')}</div>`, 'alt');

  const touch = scene(7, `Carried <em>into the world.</em>`, `<div class="touch">
    <figure class="tp" data-r><div class="obj o1"><div class="htag">${wordmark()}<p>Made for the distance between here and there.</p>${ridgesSVG({ w: 200, h: 120, seed: 8, layers: [{ base: 0.55, amp: 0.5, freq: 2, fill: '#8C6A8E' }, { base: 0.8, amp: 0.5, freq: 3, fill: '#A2432A' }, { base: 1, amp: 0.4, freq: 4, fill: '#170f0b' }] })}</div></div><figcaption><b>Hang tag</b><span>Bark card with a dusk ridgeline printed at the foot.</span></figcaption></figure>
    <figure class="tp" data-r><div class="obj o2"><div class="box">${ridgesSVG({ w: 400, h: 150, seed: 12, layers: [{ base: 0.7, amp: 0.6, freq: 2.5, fill: '#8a3822' }, { base: 1, amp: 0.5, freq: 3.5, fill: '#6e2c1b' }] })}${lockup()}</div></div><figcaption><b>Box</b><span>Terracotta board, ridgeline wrapping the base, sand lockup.</span></figcaption></figure>
    <figure class="tp" data-r><div class="obj o3"><div class="soc"><div class="im"><img src="${IMG.crest}" alt="CREST backpack, supplied product render"></div><p>Every wild landscape has a high point. Find yours.</p></div></div><figcaption><b>Social post</b><span>Story first, product second, always in warm light.</span></figcaption></figure>
  </div>`, 'sand');

  const web = scene(8, `Scroll it <em>like a climb.</em>`, `<div class="two">
    <div class="wire" data-r aria-hidden="true"><div class="bar"><svg viewBox="0 0 1000 44" preserveAspectRatio="none"><path d="${prof.d}" fill="none" stroke="#E39A5B" stroke-width="2" vector-effect="non-scaling-stroke"/></svg></div><div class="s1">${ridgesSVG({ w: 800, h: 300, seed: 3, layers: DUSK.slice(1) })}</div><div class="s2"><i></i><i></i></div></div>
    <dl class="dl" data-r>${W.web.map(([k, v]) => `<div><dt class="lab">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
  </div>
  <p class="muted" style="margin-top:28px;font-size:15px" data-r>This page is built the way the website would be: watch the elevation line at the top of the screen.</p>`);

  const verdict = scene(9, `The <em>verdict.</em>`, `<div class="two verdict">
    <div data-r><h3>Why choose it</h3><ul>${W.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
    <div data-r><h3>Watch for</h3><ul>${W.watch.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
  </div>`, 'sand');

  const footer = `<footer class="nf" aria-label="What is not final"><div class="wrap">
    <h2>Not final</h2>
    <ul>${NOT_FINAL.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
    <div class="end">${lockup()}<span class="lab">Option ${W.letter} of C / <a href="START-HERE.html">Back to all options</a></span></div>
  </div></footer>`;

  const script = `<script>(function(){
  var rect=document.getElementById("elev-rect"),pct=document.querySelector(".elev .pct"),wps=[].slice.call(document.querySelectorAll(".elev .wp")),
  scenes=[].slice.call(document.querySelectorAll(".waypoint")),queued=false;
  function update(){queued=false;var h=document.documentElement.scrollHeight-innerHeight,p=h>0?Math.min(1,Math.max(0,scrollY/h)):0;
  rect.setAttribute("width",String(p*1000));pct.textContent=Math.round(p*100)+"%";
  scenes.forEach(function(s,i){var b=s.getBoundingClientRect();wps[i]&&wps[i].classList.toggle("past",b.top<innerHeight*0.6)})}
  addEventListener("scroll",function(){if(!queued){queued=true;requestAnimationFrame(update)}},{passive:true});addEventListener("resize",update);update()})();</script>`;

  const body = `${elev}<main>${hero}${world}${palette}${type}${device}${photo}${collection}${voice}${touch}${web}${verdict}</main>${footer}${script}`;

  return page({
    title: `Tuskrr brand world C: ${W.name}`,
    description: `Brand world option C for Tuskrr. ${W.reading}`,
    fonts: FONTS.instrumentSerif + FONTS.hanken,
    css: CSS,
    body,
  });
}
