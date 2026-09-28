// Option A, The Entrance. Organising idea: a door of light. Sticky top bar,
// numbered sections, the collection as an index with the product in the light.
import { IMG, FONTS, PRODUCTS, esc, skylineSVG, lockup, wordmark, goldS, GOLD_S_CSS, page } from './shared.mjs';
import { SECTIONS, WORLDS, TAGLINE } from './worlds.mjs';
import { LAYOUT_CSS, pad, altText, ideaBody, paletteBody, typeBody, deviceBody, photoBody, voiceBody, giftingBody, phoneBody, verdictBody, footer } from './sections.mjs';

const W = WORLDS.a;

const CSS = `
:root{--bg:#131110;--bg2:#181513;--fg:#EFE9E1;--muted:#A39B91;--line:#3a332f;--accent:#D1A650;--card:#1F1B19;--card-fg:#EFE9E1;--card-muted:#A39B91;--cognac:#C27442;--light:#F6E3BD;--gold-s:#D1A650;
--display:"Instrument Sans",system-ui,sans-serif;--display-stretch:75%;--display-weight:600;--display-case:uppercase;--display-track:.02em;
--label:"Instrument Sans",system-ui,sans-serif;--label-track:.2em;--screen-bg:#131110;--note-font:"Instrument Sans",system-ui,sans-serif}
body{background:var(--bg);color:var(--fg);font-family:"Instrument Sans",system-ui,sans-serif;font-size:17px;line-height:1.6}
.thesis h3,.tk h3,.ph h3,.gcard h3,.proof h3{font-stretch:75%;text-transform:uppercase;letter-spacing:.08em;font-weight:600}
.door{background:linear-gradient(90deg,rgba(246,227,189,0) 0%,rgba(246,227,189,.16) 30%,rgba(246,227,189,.16) 70%,rgba(246,227,189,0) 100%)}
/* bar */
.top{position:sticky;top:0;z-index:5;background:rgba(19,17,16,.94);border-bottom:1px solid var(--line)}
.top .wrap{display:flex;align-items:center;justify-content:space-between;gap:24px;min-height:64px}
.top .home{display:flex;align-items:center;min-height:44px;width:120px;color:var(--fg)}
.top .home .gs{width:120px}
.top nav{display:flex}
.top nav a{min-width:44px;min-height:44px;display:flex;align-items:center;justify-content:center;text-decoration:none;color:var(--muted);font-stretch:75%;font-size:13px;letter-spacing:.14em}
.top nav a:hover{color:var(--accent)}
/* hero */
.hero{min-height:calc(100vh - 64px);position:relative;overflow:hidden;display:flex;align-items:stretch}
.hero::before{content:"";position:absolute;inset:0;background:radial-gradient(ellipse 40% 70% at 70% 55%,rgba(246,227,189,.12),rgba(19,17,16,0) 70%)}
.hero .wrap{position:relative;width:100%;display:grid;grid-template-columns:minmax(0,1.25fr) minmax(0,.75fr);gap:48px;align-items:center;padding-top:56px;padding-bottom:56px}
.hero .kick{color:var(--muted);display:flex;gap:24px;flex-wrap:wrap}
.hero h1{font-size:clamp(60px,9.5vw,152px);margin:24px 0 32px}
.hero h1 span{display:block}
.hero h1 .b{color:var(--accent)}
.hero .intro{font-size:19px;max-width:32em}
.doorway{position:relative;height:min(76vh,720px);max-width:360px;justify-self:center;width:100%}
.doorway .frame{position:absolute;inset:0;overflow:hidden;box-shadow:0 0 120px 20px rgba(246,227,189,.16)}
.doorway img{width:100%;height:100%;object-fit:cover;object-position:50% 50%}
.doorway .spill{position:absolute;left:-30%;right:-30%;bottom:-40px;height:60px;background:radial-gradient(ellipse at center,rgba(246,227,189,.22),rgba(246,227,189,0) 70%)}
/* sections */
.sec{padding:112px 0;border-top:1px solid var(--line)}
.sec:nth-of-type(even){background:var(--bg2)}
.sh{display:grid;grid-template-columns:120px minmax(0,1fr) auto;gap:24px;align-items:end;margin-bottom:56px}
.sh .n{font-stretch:75%;font-size:80px;line-height:.8;color:#4a423c}
.sh h2{font-size:clamp(32px,4vw,52px);letter-spacing:.1em}
.sh .lab{color:var(--muted)}
/* device art */
.room{position:absolute;inset:0;background:#0d0b0a}
.room .slit{position:absolute;top:8%;bottom:0;left:56%;width:15%;background:linear-gradient(180deg,#f6e3bd,#e9c98f);box-shadow:0 0 80px 18px rgba(246,227,189,.35)}
.room .floor{position:absolute;left:0;right:0;bottom:0;height:22%;background:linear-gradient(180deg,#1b1714,#0d0b0a)}
.room .spill{position:absolute;bottom:0;left:40%;width:47%;height:22%;background:linear-gradient(180deg,rgba(246,227,189,.35),rgba(246,227,189,0));clip-path:polygon(34% 0,66% 0,100% 100%,0 100%)}
.room .gs{position:absolute;left:8%;top:12%;width:30%;color:#3a332f}
/* photo frames */
.fa{background:#0d0b0a}
.fa .slit{position:absolute;top:10%;bottom:0;left:42%;width:22%;background:linear-gradient(180deg,#f6e3bd,#dcb77a)}
.fa .fig{position:absolute;bottom:0;left:47%;width:12%;height:52%;background:#0d0b0a;border-radius:40px 40px 0 0}
.fa .fig::before{content:"";position:absolute;top:-17%;left:15%;width:70%;height:17%;border-radius:50%;background:#0d0b0a}
.fb img{filter:brightness(.85) contrast(1.1)}
.fb::after{content:"";position:absolute;inset:0;background:linear-gradient(100deg,rgba(0,0,0,.85) 0%,rgba(0,0,0,.25) 45%,rgba(0,0,0,0) 60%,rgba(0,0,0,.7) 100%)}
.fc{background:linear-gradient(180deg,#0b0a0f,#1c1714)}
.fd{display:grid;grid-template-rows:repeat(5,1fr)}
.fd i:nth-child(1){background:#0d0b0a}.fd i:nth-child(2){background:#2a211c}.fd i:nth-child(3){background:#6e3f22}.fd i:nth-child(4){background:#C27442}.fd i:nth-child(5){background:#F6E3BD}
/* collection index */
.index{display:grid;grid-template-columns:minmax(0,1.1fr) minmax(0,.9fr);gap:56px;align-items:start}
.index ol{border-top:1px solid var(--line)}
.index li{border-bottom:1px solid var(--line)}
.index button{all:unset;box-sizing:border-box;cursor:pointer;display:grid;grid-template-columns:52px minmax(0,1fr) auto;gap:16px;align-items:baseline;width:100%;padding:20px 0;min-height:44px}
.index button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.index .no{font-stretch:75%;letter-spacing:.14em;font-size:14px;color:var(--muted)}
.index .nm{font-stretch:75%;text-transform:uppercase;letter-spacing:.08em;font-weight:600;font-size:clamp(28px,3.4vw,46px);line-height:1}
.index .ty{font-stretch:75%;letter-spacing:.14em;text-transform:uppercase;font-size:12px;color:var(--muted)}
.index li.on .nm{color:var(--accent)}
.index .more{display:grid;grid-template-rows:0fr;transition:grid-template-rows .25s var(--ease)}
.index .more>div{overflow:hidden;visibility:hidden;transition:visibility .25s var(--ease)}
.index li.on .more{grid-template-rows:1fr}
.index li.on .more>div{visibility:visible}
.index .more p{padding:0 0 6px 68px;font-size:16px;color:var(--muted)}
.index .more p.line{font-size:21px;color:var(--fg);font-weight:600}
.index .more p:last-child{padding-bottom:22px}
.index .mob{display:none}
.pane{position:sticky;top:96px;height:min(70vh,640px);box-shadow:0 0 120px 10px rgba(246,227,189,.12)}
.pane img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .25s var(--ease)}
.pane img.on{opacity:1}
/* gifting box */
.gbox{width:74%;aspect-ratio:1.3/1;background:#0d0b0a;position:relative;display:flex;align-items:center;justify-content:center;box-shadow:0 30px 40px -24px rgba(0,0,0,.9);color:#4a423c}
.gbox::before{content:"";position:absolute;top:0;bottom:0;left:46%;width:8%;background:linear-gradient(180deg,#f6e3bd,#dcb77a)}
.gbox .gs{position:relative;width:44%;background:#0d0b0a;padding:6px 10px}
.note-obj{background:#241f1c}
/* phone screen */
.s-a{background:#131110;color:#EFE9E1;padding:42px 18px 16px}
.s-a .bar{display:flex;justify-content:space-between;align-items:center}
.s-a .bar .gs{width:70px}
.s-a .bar i{display:block;width:18px;height:2px;background:#EFE9E1;box-shadow:0 5px 0 #EFE9E1}
.s-a h4{font-stretch:75%;text-transform:uppercase;font-weight:600;font-size:34px;line-height:.92;margin:22px 0 14px}
.s-a h4 span{color:#D1A650}
.s-a .dr{flex:1;margin:0 30px;overflow:hidden;box-shadow:0 0 50px 8px rgba(246,227,189,.18)}
.s-a .dr img{width:100%;height:100%;object-fit:cover}
.s-a .btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}
.s-a .btns span{text-align:center;padding:11px 0;font-stretch:75%;text-transform:uppercase;letter-spacing:.14em;font-size:12px;border:1px solid #EFE9E1}
.s-a .btns span:first-child{background:#EFE9E1;color:#131110}
${GOLD_S_CSS}
@media (max-width:1000px){
.hero .wrap{grid-template-columns:1fr}
.doorway{height:420px;max-width:300px}
.index{grid-template-columns:1fr}
.pane{display:none}
.index .mob{display:block;margin:0 0 16px 68px;aspect-ratio:4/5;max-width:340px;overflow:hidden}
.index .mob img{width:100%;height:100%;object-fit:cover}
}
@media (max-width:700px){
.top nav{display:none}
.sec{padding:72px 0}
.sh{grid-template-columns:1fr;gap:8px;margin-bottom:36px}
.sh .n{font-size:52px}
.index .more p,.index .mob{padding-left:0;margin-left:0}
}
`;

const sec = (i, inner) => {
  const [id, label] = SECTIONS[i];
  return `<section class="sec" id="${id}" aria-labelledby="h-${id}"><div class="wrap"><header class="sh" data-r><span class="n disp" aria-hidden="true">${pad(i + 1)}</span><h2 class="disp" id="h-${id}">${esc(label)}</h2><span class="lab">${esc(W.name)}</span></header>${inner}</div></section>`;
};

export function renderA() {
  const header = `<header class="top"><div class="wrap"><a class="home" href="#top" aria-label="Tuskrr, back to top">${goldS()}</a><nav aria-label="Sections">${SECTIONS.map(([id, label], i) => `<a href="#${id}" title="${esc(label)}"><span class="sr">${esc(label)} </span>${pad(i + 1)}</a>`).join('')}</nav></div></header>`;

  const hero = `<section class="hero" id="top" aria-label="${esc(W.name)}"><div class="wrap">
    <div>
      <div class="kick lab" data-r><span>Tuskrr</span><span>Brand world, option ${W.letter}</span><span>${esc(W.name)}</span></div>
      <h1 class="disp" data-r><span>Arrive like</span><span>you <span class="b" style="display:inline">mean it.</span></span></h1>
      <p class="intro" data-r>${esc(W.intro)}</p>
    </div>
    <div class="doorway" data-r><div class="frame"><img src="${IMG.ridge}" alt="${esc(altText(PRODUCTS[0]))}"></div><span class="spill" aria-hidden="true"></span><span class="cap">Supplied render</span></div>
  </div></section>`;

  const art = `<div class="room" aria-hidden="true"><span class="slit"></span><span class="floor"></span><span class="spill"></span>${goldS()}</div>`;

  const frames = [
    `<div class="frame fa"><span class="slit"></span><span class="fig"></span><span class="cap">Drawn stand-in</span></div>`,
    `<div class="frame fb"><img src="${IMG.strata}" alt="STRATA briefcase in raking light, supplied product render"><span class="cap">Supplied render</span></div>`,
    `<div class="frame fc">${skylineSVG({ w: 400, h: 540, seed: 11, fill: '#060505', lit: '#E9C98F', litRate: 0.08 })}<span class="cap">Drawn stand-in</span></div>`,
    `<div class="frame fd" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>`,
  ];

  const collection = `
    <div class="index">
      <ol>${PRODUCTS.map((p, i) => `<li class="${i === 0 ? 'on' : ''}" data-r>
        <button type="button" aria-expanded="${i === 0}" aria-controls="more-${p.id}"><span class="no">${pad(i + 1)}</span><span class="nm">${esc(p.name)}</span><span class="ty">${esc(p.type)}</span></button>
        <div class="more" id="more-${p.id}"><div>
          <div class="mob"><img src="${IMG[p.id]}" alt=""></div>
          <p class="line">${esc(p.line)}</p>
          ${p.alt ? `<p>Alternative line: ${esc(p.alt)}</p>` : ''}
          <p>${esc(p.idea)}</p>
          <p class="lab">${esc(p.finish)}. Genuine leather.${p.note ? ' ' + esc(p.note) + '.' : ''}</p>
        </div></div>
      </li>`).join('')}</ol>
      <div class="pane" data-r>${PRODUCTS.map((p, i) => `<img src="${IMG[p.id]}" alt="${esc(altText(p))}" class="${i === 0 ? 'on' : ''}"${i === 0 ? '' : ' aria-hidden="true"'}>`).join('')}<span class="cap">Supplied render</span></div>
    </div>
    <script>(function(){var lis=[].slice.call(document.querySelectorAll(".index li")),imgs=[].slice.call(document.querySelectorAll(".pane img"));
    function pick(i){lis.forEach(function(li,j){li.classList.toggle("on",j===i);li.querySelector("button").setAttribute("aria-expanded",j===i)});imgs.forEach(function(im,j){im.classList.toggle("on",j===i);if(j===i)im.removeAttribute("aria-hidden");else im.setAttribute("aria-hidden","true")})}
    lis.forEach(function(li,i){var b=li.querySelector("button");b.addEventListener("click",function(){pick(i)});b.addEventListener("mouseenter",function(){if(matchMedia("(hover:hover)").matches)pick(i)})})})();</script>`;

  const box = `<div class="gbox">${goldS()}</div>`;

  const screen = `<div class="s-a screen"><div class="bar">${goldS()}<i></i></div><h4>Arrive like you <span>mean it.</span></h4><div class="dr"><img src="${IMG.crest}" alt=""></div><div class="btns"><span>Shop</span><span>Gift it</span></div></div>`;

  const body = `${header}<main>${hero}
    ${sec(0, ideaBody(W))}
    ${sec(1, paletteBody(W, 'Dark rooms, warm light. Night and bone carry the page; cognac is the leather; brass appears once per view, on the S or on the one button that matters.'))}
    ${sec(2, typeBody(W, 'Arrive<br><span style="color:var(--accent)">like you</span><br>mean it.', 'The lobby. The meeting room. The pitch. Every day has ten seconds when you walk in.', 'STRATA / Laptop briefcase / Genuine leather'))}
    ${sec(3, deviceBody(W, art))}
    ${sec(4, photoBody(W, frames))}
    ${sec(5, collection)}
    ${sec(6, voiceBody(W))}
    ${sec(7, giftingBody(W, box))}
    ${sec(8, phoneBody(W, screen))}
    ${sec(9, verdictBody(W))}
  </main>${footer(W)}`;

  return page({
    title: `Tuskrr brand world A: ${W.name}`,
    description: `Brand world option A for Tuskrr. ${W.reading}`,
    fonts: FONTS.instrumentSans,
    css: LAYOUT_CSS + CSS,
    body,
  });
}
