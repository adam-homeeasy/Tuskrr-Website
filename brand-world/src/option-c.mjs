// Option C, Sharp Lines, Wild Heart. Organising idea: an editorial magazine with
// a chapter rail; the signature is the wild line among straight channel lines.
import { IMG, FONTS, PRODUCTS, esc, skylineSVG, wildLinesSVG, lockup, wordmark, page } from './shared.mjs';
import { SECTIONS, WORLDS } from './worlds.mjs';
import { LAYOUT_CSS, pad, altText, ideaBody, paletteBody, typeBody, deviceBody, photoBody, voiceBody, giftingBody, phoneBody, verdictBody, footer } from './sections.mjs';

const W = WORLDS.c;

const CSS = `
:root{--bg:#F5F3EE;--fg:#111111;--muted:#5F5C57;--line:#CFCBC3;--accent:#B83418;--card:#FFFFFF;--card-fg:#111111;--card-muted:#5F5C57;--wild:#E0492A;
--display:"Archivo",system-ui,sans-serif;--display-stretch:62%;--display-weight:800;--display-case:uppercase;--display-track:.005em;
--label:"IBM Plex Mono",ui-monospace,monospace;--label-track:.06em;--label-weight:500;--screen-bg:#F5F3EE;--note-font:"Archivo",system-ui,sans-serif}
body{background:var(--bg);color:var(--fg);font-family:"Archivo",system-ui,sans-serif;font-size:17px;line-height:1.6}
.ink{--bg:#111111;--fg:#F5F3EE;--muted:#A8A49D;--line:#34322f;--accent:#E0492A;--card:#1c1c1c;--card-fg:#F5F3EE;--card-muted:#A8A49D;background:#111111;color:var(--fg)}
.thesis h3,.tk h3,.ph h3,.gcard h3,.proof h3{font-weight:700}
.verdict h3{font-size:40px}
.wild{stroke:var(--wild)}
html[data-motion=on] .drift .wild{animation:tk-drift 8s var(--ease) infinite alternate}
@keyframes tk-drift{from{transform:translateX(-6px)}to{transform:translateX(6px)}}
/* shell and rail */
.shell{display:grid;grid-template-columns:240px minmax(0,1fr)}
.rail{position:sticky;top:0;height:100vh;border-right:1px solid var(--fg);padding:26px 22px;display:flex;flex-direction:column;gap:24px;background:var(--bg);z-index:3}
.rail .home{display:flex;align-items:center;min-height:44px;color:#111}
.rail .home .mk-word{width:120px;height:auto}
.rail nav{display:flex;flex-direction:column;border-top:1px solid #111}
.rail nav a{display:flex;gap:12px;align-items:center;min-height:44px;border-bottom:1px solid var(--line);text-decoration:none;font-size:15px}
.rail nav a span{font-family:var(--label);font-size:12px;color:var(--muted);width:22px}
.rail nav a:hover{color:var(--accent)}
.rail .tag{margin-top:auto;font-family:var(--display);font-stretch:62%;font-weight:800;text-transform:uppercase;font-size:26px;line-height:.95}
.rail .tag em{font-style:normal;color:var(--accent)}
.rail .lines{height:70px;color:#111}
.rail .lines svg{width:100%;height:100%}
/* hero */
.hero{min-height:100vh;display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,.7fr);border-bottom:1px solid #111}
.hero .l{padding:48px 48px 40px;display:flex;flex-direction:column;justify-content:space-between;gap:32px}
.hero .kick{color:var(--muted);display:flex;gap:20px;flex-wrap:wrap}
.hero h1{font-size:clamp(72px,11.5vw,200px);line-height:.84}
.hero h1 em{font-style:normal;color:var(--accent)}
.hero .intro{max-width:32em;font-size:18px}
.hero .r{position:relative;border-left:1px solid #111;background:#fff;overflow:hidden}
.hero .r .lines{position:absolute;inset:0;color:#111}
.hero .r .lines svg{width:100%;height:100%}
.hero .r .prod{position:absolute;left:10%;right:10%;bottom:8%;aspect-ratio:1/1;background:#fff;border:1px solid #111}
.hero .r .prod img{width:100%;height:100%;object-fit:cover}
.hero .r .ask{position:absolute;left:10%;top:8%;background:#111;color:#F5F3EE;padding:8px 12px;z-index:2}
/* sections */
.sec{padding:104px 0;border-bottom:1px solid #111}
.sh{display:grid;grid-template-columns:110px minmax(0,1fr);gap:24px;align-items:baseline;margin-bottom:52px;border-top:1px solid var(--fg);padding-top:14px}
.sh .lab{color:var(--muted)}
.sh h2{font-size:clamp(48px,6.4vw,96px);line-height:.88}
/* device */
.wildart{position:absolute;inset:0;background:#fff;color:#111}
.wildart .gs-word{position:absolute;left:8%;bottom:8%;width:34%;color:#111;background:#fff;padding:6px 8px}
/* photo frames */
.fc3{background:#fff}
.fc3 svg path:last-child{fill:var(--wild)}
.fc2 img{transform:scale(2.4);transform-origin:50% 52%}
.fc4{display:grid;grid-template-rows:repeat(5,1fr)}
.fc4 i:nth-child(1){background:#fff}.fc4 i:nth-child(2){background:#F5F3EE}.fc4 i:nth-child(3){background:#8a8781}.fc4 i:nth-child(4){background:#111}.fc4 i:nth-child(5){background:#E0492A}
/* collection */
.mag{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border-top:1px solid #111;border-left:1px solid #111}
.mag article{border-right:1px solid #111;border-bottom:1px solid #111;background:#fff;display:flex;flex-direction:column}
.mag .im{aspect-ratio:1/1;position:relative;overflow:hidden;border-bottom:1px solid #111}
.mag .im img{width:100%;height:100%;object-fit:cover}
.mag .ask{position:absolute;left:12px;top:12px;background:#111;color:#F5F3EE;padding:4px 8px;font-size:11px;z-index:2}
.mag .t{padding:18px 18px 22px;display:flex;flex-direction:column;gap:8px;flex:1}
.mag h3{font-family:var(--display);font-stretch:62%;font-weight:800;font-size:46px;line-height:.9;text-transform:uppercase}
.mag .line{font-size:20px;font-weight:600;line-height:1.25}
.mag .alt{font-size:14px;color:var(--muted)}
.mag .idea{font-size:15px;color:var(--muted)}
.mag .facts{margin-top:auto;padding-top:10px;border-top:1px solid var(--line);color:var(--muted)}
/* gifting box */
.gbox{width:74%;aspect-ratio:1.3/1;background:#fff;border:1px solid #111;position:relative;display:flex;align-items:center;justify-content:center;box-shadow:0 24px 30px -20px rgba(0,0,0,.35);overflow:hidden}
.gbox .band{position:absolute;top:0;bottom:0;left:40%;width:22%;color:#111}
.gbox .band svg{width:100%;height:100%}
.gbox .mk-word{position:relative;width:40%;height:auto;color:#111;background:#fff;padding:4px 8px;box-sizing:content-box}
.note-obj{background:#EAE7E0}
/* phone */
.s-c{background:#F5F3EE;color:#111;padding:40px 16px 16px}
.s-c .bar{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #111;padding-bottom:8px}
.s-c .bar .mk-word{width:66px;height:auto}
.s-c .bar i{display:block;width:18px;height:2px;background:#111;box-shadow:0 5px 0 #111}
.s-c h4{font-family:"Archivo",sans-serif;font-stretch:62%;font-weight:800;text-transform:uppercase;font-size:50px;line-height:.86;margin:14px 0 12px}
.s-c h4 em{font-style:normal;color:#B83418}
.s-c .row{flex:1;display:grid;grid-template-columns:36px 1fr;gap:8px;min-height:0}
.s-c .row .lines{color:#111}
.s-c .row .lines svg{width:100%;height:100%}
.s-c .row .im{background:#fff;border:1px solid #111;overflow:hidden}
.s-c .row .im img{width:100%;height:100%;object-fit:cover}
.s-c .btns{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:12px}
.s-c .btns span{text-align:center;padding:11px 0;font-family:"IBM Plex Mono",monospace;font-size:12px;text-transform:uppercase;border:1.5px solid #111}
.s-c .btns span:first-child{background:#111;color:#F5F3EE}
@media (max-width:1100px){
.mag{grid-template-columns:1fr 1fr}
.hero{grid-template-columns:1fr}
.hero .r{min-height:560px;border-left:0;border-top:1px solid #111}
}
@media (max-width:900px){
.shell{grid-template-columns:1fr}
.rail{position:static;height:auto;border-right:0;border-bottom:1px solid #111;padding:18px 16px}
.rail nav{display:grid;grid-template-columns:1fr 1fr;column-gap:16px}
.rail .tag,.rail .lines{display:none}
.hero .l{padding:40px 16px 32px}
.sec{padding:72px 0}
.sh{grid-template-columns:1fr;gap:6px}
}
@media (max-width:560px){
.mag{grid-template-columns:1fr}
.hero .r{min-height:460px}
}
`;

const TITLES = ['Sharp lines. <em>Wild heart.</em>', 'Ink, paper, <em>one red line.</em>', 'Big type. <em>Straight face.</em>', 'The <em>wild line.</em>', 'Street, not <em>studio.</em>', 'Where’s that <em>from?</em>', 'Say less. <em>Mean it.</em>', 'Gift the <em>edge.</em>', 'Thumb <em>first.</em>', 'The <em>verdict.</em>'];

const sec = (i, inner, cls = '') => {
  const [id, label] = SECTIONS[i];
  return `<section class="sec ${cls}" id="${id}" aria-labelledby="h-${id}"><div class="wrap"><header class="sh" data-r><span class="lab">Ch. ${pad(i + 1)} / ${esc(label)}</span><h2 class="disp" id="h-${id}">${TITLES[i].replace(/<em>/g, '<em style="font-style:normal;color:var(--accent)">')}</h2></header>${inner}</div></section>`;
};

export function renderC() {
  const rail = `<aside class="rail" aria-label="Chapters">
    <a class="home" href="#top" aria-label="Tuskrr, back to top">${wordmark()}</a>
    <nav aria-label="Sections">${SECTIONS.map(([id, label], i) => `<a href="#${id}"><span>${pad(i + 1)}</span>${esc(label)}</a>`).join('')}</nav>
    <div class="lines drift" aria-hidden="true">${wildLinesSVG({ w: 200, h: 70, n: 9, wild: 6, seed: 2 })}</div>
    <p class="tag">Arrive like you <em>mean it.</em></p>
  </aside>`;

  const hero = `<section class="hero" id="top" aria-label="${esc(W.name)}">
    <div class="l">
      <div class="kick lab" data-r><span>Tuskrr</span><span>Brand world, option ${W.letter}</span><span>${esc(W.name)}</span></div>
      <h1 class="disp" data-r>Arrive like you <em>mean it.</em></h1>
      <p class="intro" data-r>${esc(W.intro)}</p>
    </div>
    <div class="r" data-r><div class="lines drift" aria-hidden="true">${wildLinesSVG({ w: 500, h: 900, n: 11, wild: 7, seed: 9 })}</div><span class="ask lab">Where’s that from?</span><div class="prod"><img src="${IMG.crest}" alt="${esc(altText(PRODUCTS[3]))}"><span class="cap">Supplied render</span></div></div>
  </section>`;

  const art = `<div class="wildart drift" aria-hidden="true">${wildLinesSVG({ w: 800, h: 600, n: 15, wild: 9, seed: 13 })}<span class="gs-word">${wordmark()}</span></div>`;

  const frames = [
    `<div class="frame"><img src="${IMG.crest}" alt="CREST backpack, supplied product render"><span class="cap">Supplied render</span></div>`,
    `<div class="frame fc2"><img src="${IMG.contour}" alt="Close-up of the CONTOUR badge and channels, supplied product render"><span class="cap">Supplied render, cropped</span></div>`,
    `<div class="frame fc3">${skylineSVG({ w: 400, h: 540, seed: 29, fill: '#111', lit: '#E0492A', litRate: 0.02 })}<span class="cap">Drawn stand-in</span></div>`,
    `<div class="frame fc4" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></div>`,
  ];

  const collection = `<div class="mag">${PRODUCTS.map((p) => `<article data-r>
    <div class="im"><span class="ask lab">Where’s that from?</span><img src="${IMG[p.id]}" alt="${esc(altText(p))}"></div>
    <div class="t"><h3>${esc(p.name)}</h3><p class="line">${esc(p.line)}</p>${p.alt ? `<p class="alt">Alternative line: ${esc(p.alt)}</p>` : ''}<p class="idea">${esc(p.idea)}</p><p class="facts lab">${esc(p.type)} / Genuine leather / ${esc(p.finish)}</p></div>
  </article>`).join('')}</div>`;

  const box = `<div class="gbox"><div class="band drift" aria-hidden="true">${wildLinesSVG({ w: 120, h: 200, n: 5, wild: 3, seed: 4 })}</div>${wordmark()}</div>`;

  const screen = `<div class="s-c screen"><div class="bar">${wordmark()}<i></i></div><h4>Arrive like you <em>mean it.</em></h4><div class="row"><div class="lines">${wildLinesSVG({ w: 36, h: 300, n: 4, wild: 3, seed: 6 })}</div><div class="im"><img src="${IMG.ridge}" alt=""></div></div><div class="btns"><span>Shop</span><span>Gift it</span></div></div>`;

  const body = `<div class="shell">${rail}<main>${hero}
    ${sec(0, ideaBody(W))}
    ${sec(1, paletteBody(W, 'Paper and ink do almost all the work. Wild red is used once per view, as the wild line or a single word. The gold S appears only on ink, where it shines.'))}
    ${sec(2, typeBody(W, 'Sharp<br>lines.<br><span style="color:var(--accent)">Wild</span><br>heart.', 'Straight lines for the working world. One line that goes its own way.', 'CONTOUR / Laptop folio / Genuine leather'))}
    ${sec(3, deviceBody(W, art))}
    ${sec(4, photoBody(W, frames))}
    ${sec(5, collection)}
    ${sec(6, voiceBody(W), 'ink')}
    ${sec(7, giftingBody(W, box))}
    ${sec(8, phoneBody(W, screen))}
    ${sec(9, verdictBody(W), 'ink')}
    ${footer(W)}
  </main></div>`;

  return page({
    title: `Tuskrr brand world C: ${W.name}`,
    description: `Brand world option C for Tuskrr. ${W.reading}`,
    fonts: FONTS.archivo + FONTS.plexMono,
    css: LAYOUT_CSS + CSS,
    body,
  });
}
