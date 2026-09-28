// Option B, Monday to Monday. Organising idea: the week as the journey. A fixed
// route bar with a station per moment; the collection is walked in time order.
import { IMG, FONTS, esc, skylineSVG, ridgesSVG, grain, wordmark, page } from './shared.mjs';
import { SECTIONS, WORLDS, ROUTE } from './worlds.mjs';
import { LAYOUT_CSS, pad, productById, altText, ideaBody, paletteBody, typeBody, deviceBody, photoBody, voiceBody, giftingBody, phoneBody, verdictBody, footer } from './sections.mjs';

const W = WORLDS.b;
// station x positions on a 1000-wide route; the weekend leg bends
const SX = [60, 230, 400, 570, 740, 930];
const ROUTE_D = `M0 22H740C790 22 800 6 840 10S900 36 930 22H1000`;

const CSS = `
:root{--bg:#F1E6D6;--fg:#1C2433;--muted:#6A5D4E;--line:rgba(28,36,51,.18);--accent:#AC4428;--card:#FBF5EC;--card-fg:#1C2433;--card-muted:#6A5D4E;--r:6px;
--display:"Instrument Serif",Georgia,serif;--label:"Hanken Grotesk",system-ui,sans-serif;--label-weight:600;--label-track:.2em;--screen-bg:#F1E6D6;--note-font:"Instrument Serif",Georgia,serif;--grain:${grain(0.2, '0.1 0.1 0.15')}}
body{background:var(--bg);color:var(--fg);font-family:"Hanken Grotesk",system-ui,sans-serif;font-size:17px;line-height:1.6;font-variant-numeric:tabular-nums}
.night{--fg:#F1E6D6;--muted:#A9B0BE;--line:rgba(241,230,214,.2);--accent:#E7A554;--card:#243047;--card-fg:#F1E6D6;--card-muted:#A9B0BE;background:#1C2433;color:var(--fg)}
.alt{background:var(--card)}
.disp em{font-style:italic;color:var(--accent)}
.lead{font-family:var(--display);font-size:clamp(26px,2.8vw,38px);line-height:1.25}
.thesis h3,.tk h3,.ph h3,.gcard h3,.proof h3,.verdict h3{font-family:var(--display);font-weight:400;font-size:26px}
.grain{position:relative;isolation:isolate}
.grain::after{content:"";position:absolute;inset:0;background-image:var(--grain);pointer-events:none;z-index:2}
/* route bar */
.route{position:fixed;top:0;left:0;right:0;z-index:10;background:rgba(241,230,214,.95);border-bottom:1px solid var(--line)}
.route .wrap{display:flex;align-items:center;gap:28px;height:64px;max-width:none}
.route .home{display:flex;align-items:center;min-height:44px;color:#1C2433}
.route .home .mk-word{height:20px;width:auto}
.route .track{position:relative;flex:1;height:44px}
.route svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
.route .base{stroke:rgba(28,36,51,.25)}
.route .done{stroke:#AC4428}
.route .st{position:absolute;top:50%;transform:translate(-50%,-50%);min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;text-decoration:none}
.route .st i{display:block;width:10px;height:10px;border-radius:50%;background:#F1E6D6;border:2px solid #1C2433}
.route .st.past i{background:#AC4428;border-color:#AC4428}
.route .st span{position:absolute;top:32px;font-size:11px;font-weight:600;letter-spacing:.06em;color:#6A5D4E;white-space:nowrap}
main{padding-top:64px}
/* hero */
.hero{min-height:calc(100vh - 64px);position:relative;overflow:hidden;background:linear-gradient(180deg,#F1E6D6 0%,#F4DCC0 55%,#EFC7A0 100%);display:flex;flex-direction:column}
.hero .sun{position:absolute;right:16%;top:34%;width:160px;height:160px;border-radius:50%;background:radial-gradient(circle,#F7C98F,rgba(247,201,143,0) 70%)}
.hero .ground{position:relative;z-index:3;margin-top:auto;background:#1C2433;color:#F1E6D6;padding:22px 0 40px}
.hero .ground .city{position:absolute;left:0;right:0;bottom:100%;width:100%;height:20vh;min-height:110px}
.hero .top{padding-bottom:calc(20vh + 24px)}
.hero .ground p{max-width:34em;font-size:18px}
.hero .top{position:relative;z-index:3;padding-top:72px}
.hero .kick{color:#1C2433;display:flex;gap:24px;flex-wrap:wrap}
.hero h1{font-size:clamp(64px,10vw,168px);line-height:.92;margin-top:20px}
.hero .when{position:relative;z-index:3;margin-top:28px;display:flex;align-items:baseline;gap:18px;flex-wrap:wrap}
.hero .when b{font-family:var(--display);font-weight:400;font-size:44px;color:#AC4428}
/* sections */
.sec{padding:112px 0}
.sh{display:flex;align-items:baseline;gap:24px;flex-wrap:wrap;margin-bottom:52px}
.sh .lab{color:var(--muted)}
.sh h2{font-size:clamp(44px,5.4vw,76px)}
/* device */
.art-route{position:absolute;inset:0;background:linear-gradient(180deg,#141b27,#26314a)}
.art-route .city{position:absolute;left:0;right:0;bottom:0;width:100%;height:60%}
.art-route .line{position:absolute;left:0;right:0;top:26%;height:60px}
.art-route .line svg{position:absolute;inset:0;width:100%;height:100%;overflow:visible}
/* photo frames */
.fb1{background:linear-gradient(180deg,#F4DCC0,#E9B98A)}
.fb3{background:linear-gradient(180deg,#121826,#2a3550)}
.fb4{background:linear-gradient(180deg,#F4DCC0,#E7A554)}
/* collection */
.stops{counter-reset:s}
.stop{padding:88px 0;border-top:1px solid var(--line);scroll-margin-top:64px}
.stop .wrap{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:64px;align-items:center}
.stop:nth-child(even) .card{order:-1}
.stop .time{font-family:var(--display);font-size:clamp(72px,9vw,132px);line-height:.9;color:var(--accent)}
.stop .day{margin-top:10px;color:var(--muted)}
.stop h3{font-family:var(--display);font-weight:400;font-size:clamp(40px,4.6vw,64px);line-height:1;margin:22px 0 10px}
.stop .line{font-family:var(--display);font-style:italic;font-size:26px;line-height:1.2}
.stop .alt-line{font-size:15px;color:var(--muted);margin-top:6px}
.stop .story{margin-top:18px;max-width:32em}
.stop .facts{margin-top:18px;display:flex;flex-wrap:wrap;gap:6px 22px;color:var(--muted)}
.card{aspect-ratio:4/5;border-radius:6px;overflow:hidden;position:relative;background:#e6e4e1}
.card.wide{aspect-ratio:16/11}
.card img{width:100%;height:100%;object-fit:cover}
/* gifting box */
.gbox{width:74%;aspect-ratio:1.3/1;background:#AC4428;position:relative;display:flex;align-items:center;justify-content:center;color:#F1E6D6;box-shadow:0 30px 40px -24px rgba(28,36,51,.6);overflow:hidden}
.gbox svg{position:absolute;left:0;right:0;top:50%;width:100%;height:40px;transform:translateY(-50%)}
.gbox .mk-word{position:relative;width:42%;height:auto;background:#AC4428;padding:0 10px;box-sizing:content-box}
.note-obj{background:#E8D8C1}
.note-card p{color:#1a1714}
/* phone */
.s-b{background:#F1E6D6;color:#1C2433;padding:40px 16px 16px}
.s-b .bar{display:flex;justify-content:space-between;align-items:center}
.s-b .bar .mk-word{width:66px;height:auto}
.s-b .bar i{display:block;width:18px;height:2px;background:#1C2433;box-shadow:0 5px 0 #1C2433}
.s-b .rt{height:18px;margin:14px 0 6px;position:relative}
.s-b .rt svg{position:absolute;inset:0;width:100%;height:100%}
.s-b h4{font-family:"Instrument Serif",Georgia,serif;font-weight:400;font-size:38px;line-height:.95;margin:10px 0 8px}
.s-b h4 em{color:#AC4428}
.s-b .t{font-size:11px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:#6A5D4E}
.s-b .im{flex:1;margin-top:12px;border-radius:6px;overflow:hidden}
.s-b .im img{width:100%;height:100%;object-fit:cover}
.s-b .btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.s-b .btns span{text-align:center;padding:11px 0;font-size:12px;font-weight:600;letter-spacing:.08em;border-radius:40px;border:1.5px solid #1C2433}
.s-b .btns span:first-child{background:#1C2433;color:#F1E6D6}
@media (max-width:1000px){
.stop .wrap{grid-template-columns:1fr;gap:36px}
.stop:nth-child(even) .card{order:0}
}
@media (max-width:760px){
.route .st span{display:none}
.route .wrap{gap:14px}
.route .home .mk-word{height:16px}
.sec{padding:72px 0}
.stop{padding:64px 0}
.hero .top{padding-top:40px}
}
`;

const sec = (i, inner, cls = '') => {
  const [id, label] = SECTIONS[i];
  return `<section class="sec ${cls}" id="${id}" aria-labelledby="h-${id}"><div class="wrap"><header class="sh" data-r><span class="lab">${pad(i + 1)} / ${esc(label)}</span><h2 class="disp" id="h-${id}">${TITLES[i]}</h2></header>${inner}</div></section>`;
};
const TITLES = ['Your week is <em>the climb.</em>', 'Morning to <em>streetlight.</em>', 'Type with <em>a pulse.</em>', 'The <em>route.</em>', 'Real cities, <em>real days.</em>', 'Six <em>stops.</em>', 'A voice that <em>knows your week.</em>', 'For the one <em>who’s rising.</em>', 'Built for <em>the thumb.</em>', 'The <em>verdict.</em>'];

const routeSvg = (stroke, extra = '') => `<svg viewBox="0 0 1000 44" preserveAspectRatio="none" aria-hidden="true"><path d="${ROUTE_D}" fill="none" stroke="${stroke}" stroke-width="3" vector-effect="non-scaling-stroke" stroke-linecap="round"${extra}/></svg>`;

export function renderB() {
  const bar = `<header class="route"><div class="wrap">
    <a class="home" href="#top" aria-label="Tuskrr, back to top">${wordmark()}</a>
    <div class="track"><svg viewBox="0 0 1000 44" preserveAspectRatio="none" aria-hidden="true"><defs><clipPath id="rt-clip"><rect id="rt-rect" x="0" y="-20" width="0" height="84"/></clipPath></defs><path class="base" d="${ROUTE_D}" fill="none" stroke-width="3" vector-effect="non-scaling-stroke"/><path class="done" d="${ROUTE_D}" fill="none" stroke-width="3" vector-effect="non-scaling-stroke" clip-path="url(#rt-clip)"/></svg>
    ${ROUTE.map(([id, t, d], i) => `<a class="st" href="#t-${id}" style="left:${SX[i] / 10}%" aria-label="${esc(d)} ${t}, ${esc(productById(id).name)}"><i></i><span>${esc(d.slice(0, 3))} ${t}</span></a>`).join('')}</div>
  </div></header>`;

  const hero = `<section class="hero grain" id="top" aria-label="${esc(W.name)}">
    <span class="sun" aria-hidden="true"></span>
    <div class="wrap top">
      <div class="kick lab" data-r><span>Tuskrr</span><span>Brand world, option ${W.letter}</span><span>${esc(W.name)}</span></div>
      <h1 class="disp" data-r>Arrive like<br>you <em>mean it.</em></h1>
      <div class="when" data-r><b>08:40</b><span class="lab">Monday. The week starts now.</span></div>
    </div>
    <div class="ground">${skylineSVG({ w: 1440, h: 380, seed: 21, fill: '#1C2433', lit: '#E7A554', litRate: 0.05, cls: 'city' })}<div class="wrap"><p data-r>${esc(W.intro)}</p></div></div>
  </section>`;

  const art = `<div class="art-route" aria-hidden="true">${skylineSVG({ w: 800, h: 360, seed: 8, fill: '#0e131d', lit: '#E7A554', litRate: 0.09, cls: 'city' })}<div class="line">${routeSvg('#E7A554')}${SX.map((x) => `<span style="position:absolute;left:${x / 10}%;top:50%;width:14px;height:14px;margin:-7px 0 0 -7px;border-radius:50%;background:#1C2433;border:3px solid #E7A554"></span>`).join('')}</div></div>`;

  const frames = [
    `<div class="frame fb1">${skylineSVG({ w: 400, h: 400, seed: 3, fill: '#1C2433', lit: '#E7A554', litRate: 0.03 })}<span class="cap">Drawn stand-in</span></div>`,
    `<div class="frame"><img src="${IMG.strata}" alt="STRATA briefcase, supplied product render"><span class="cap">Supplied render</span></div>`,
    `<div class="frame fb3">${skylineSVG({ w: 400, h: 420, seed: 17, fill: '#0b0f18', lit: '#E7A554', litRate: 0.14 })}<span class="cap">Drawn stand-in</span></div>`,
    `<div class="frame fb4">${ridgesSVG({ w: 400, h: 540, seed: 5, layers: [{ base: 0.6, amp: 0.3, freq: 2, fill: '#C9855A' }, { base: 0.8, amp: 0.3, freq: 3, fill: '#8A4722' }, { base: 1, amp: 0.25, freq: 4, fill: '#1C2433' }] })}<span class="cap">Drawn stand-in</span></div>`,
  ];

  const collection = `</div><div class="stops">${ROUTE.map(([id, t, d, moment], i) => {
    const p = productById(id);
    const night = t >= '18' || d === 'Thursday';
    return `<article class="stop ${night ? 'night' : i % 2 ? 'alt' : ''}" id="t-${id}" aria-label="${esc(p.name)}"><div class="wrap">
      <div>
        <p class="time" data-r>${t}</p>
        <p class="day lab" data-r>${esc(d)} / ${esc(moment)}</p>
        <h3 data-r>${esc(p.name)}</h3>
        <p class="line" data-r>${esc(p.line)}</p>
        ${p.alt ? `<p class="alt-line" data-r>Alternative line: ${esc(p.alt)}</p>` : ''}
        <p class="story" data-r>${esc(p.idea)} ${esc(p.story)}</p>
        <p class="facts lab" data-r><span>${esc(p.type)}</span><span>Genuine leather</span><span>${esc(p.finish)}</span></p>
      </div>
      <div class="card${['traverse', 'contour'].includes(id) ? ' wide' : ''}" data-r><img src="${IMG[id]}" alt="${esc(altText(p))}"><span class="cap">Supplied render</span></div>
    </div></article>`;
  }).join('')}</div><div class="wrap">`;

  const box = `<div class="gbox">${routeSvg('#F1E6D6')}${wordmark()}</div>`;

  const screen = `<div class="s-b screen"><div class="bar">${wordmark()}<i></i></div><div class="rt">${routeSvg('#AC4428')}</div><p class="t">Monday / 08:40</p><h4>Arrive like you <em>mean it.</em></h4><div class="im"><img src="${IMG.ridge}" alt=""></div><div class="btns"><span>Shop the week</span><span>Gift it</span></div></div>`;

  const script = `<script>(function(){var rect=document.getElementById("rt-rect"),sts=[].slice.call(document.querySelectorAll(".route .st")),stops=[].slice.call(document.querySelectorAll(".stop")),q=false;
  function up(){q=false;var h=document.documentElement.scrollHeight-innerHeight,p=h>0?Math.min(1,Math.max(0,scrollY/h)):0;rect.setAttribute("width",String(p*1000));
  stops.forEach(function(s,i){sts[i]&&sts[i].classList.toggle("past",s.getBoundingClientRect().top<innerHeight*0.6)})}
  addEventListener("scroll",function(){if(!q){q=true;requestAnimationFrame(up)}},{passive:true});addEventListener("resize",up);up()})();</script>`;

  const body = `${bar}<main>${hero}
    ${sec(0, ideaBody(W))}
    ${sec(1, paletteBody(W, 'The palette follows the light through a day: sand in the morning, terracotta at the pitch, navy and streetlight after dark. Cognac is the leather in every hour.'), 'alt')}
    ${sec(2, typeBody(W, 'Friday,<br><em>18:15.</em>', 'The journey leaves the line. You follow it.', 'Mon 08:40 / Tue 10:30 / Fri 18:15'))}
    ${sec(3, deviceBody(W, art), 'night')}
    ${sec(4, photoBody(W, frames))}
    ${sec(5, collection)}
    ${sec(6, voiceBody(W), 'night')}
    ${sec(7, giftingBody(W, box))}
    ${sec(8, phoneBody(W, screen), 'alt')}
    ${sec(9, verdictBody(W), 'night')}
  </main>${footer(W).replace('class="nf"', 'class="nf night"')}${script}`;

  return page({
    title: `Tuskrr brand world B: ${W.name}`,
    description: `Brand world option B for Tuskrr. ${W.reading}`,
    fonts: FONTS.instrumentSerif + FONTS.hanken,
    css: LAYOUT_CSS + CSS,
    body,
  });
}
