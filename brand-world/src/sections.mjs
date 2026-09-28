// Section bodies shared by the three options. Each option wraps them in its own
// frame (header style, navigation, hero, collection) and restyles them through
// the CSS variables in LAYOUT_CSS.
import { IMG, PRODUCTS, esc, lockup, NOT_FINAL } from './shared.mjs';
import { FOUNDATION, TAGLINE } from './worlds.mjs';

export const pad = (n) => String(n).padStart(2, '0');
export const productById = (id) => PRODUCTS.find((p) => p.id === id);
export const altText = (p) => `${p.name} ${p.type.toLowerCase()}, ${p.finish.toLowerCase()}. Supplied product render`;

export const LAYOUT_CSS = `
.wrap{max-width:1280px;margin:0 auto;padding:0 48px}
.lab{font-family:var(--label);font-size:var(--label-size,12px);letter-spacing:var(--label-track,.18em);text-transform:uppercase;font-weight:var(--label-weight,500)}
.disp{font-family:var(--display);font-stretch:var(--display-stretch,100%);font-weight:var(--display-weight,400);text-transform:var(--display-case,none);letter-spacing:var(--display-track,0);line-height:.95}
.muted{color:var(--muted)}
.lead{font-size:clamp(21px,2.2vw,28px);line-height:1.4;max-width:34em}
.thesis{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:40px;margin-top:56px}
.thesis article{border-top:1px solid var(--line);padding-top:16px}
.thesis h3{font-size:22px;margin-bottom:8px}
.thesis p{font-size:16px;color:var(--muted)}
.found{margin-top:64px;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));border:1px solid var(--line);border-radius:var(--r,0)}
.found div{padding:18px 20px;border-right:1px solid var(--line)}
.found div:last-child{border-right:0}
.found .lab{color:var(--muted);display:block;margin-bottom:8px}
.found p{font-size:16px;line-height:1.4}
.swatches{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:12px}
.sw{border:1px solid var(--line);border-radius:var(--r,0);overflow:hidden;background:var(--card);color:var(--card-fg)}
.sw .chip{height:130px}
.sw .t{padding:14px}
.sw b{display:block;font-size:17px}
.sw .hex{display:block;font-family:var(--label);font-size:12px;letter-spacing:.08em;color:var(--card-muted);margin-top:2px}
.sw p{font-size:14px;margin-top:8px;line-height:1.4}
.sw .note{color:var(--card-muted);font-size:13px}
.spec{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:48px;align-items:start}
.spec .big{font-size:clamp(56px,8vw,124px)}
.tk{border-top:1px solid var(--line);padding:16px 0 24px}
.tk h3{font-size:20px}
.tk p{font-size:15px;color:var(--muted);margin-top:6px}
.tk .sample{color:var(--fg);font-size:17px;margin-top:10px}
.device{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,1fr);gap:48px;align-items:center}
.device .art{position:relative;aspect-ratio:4/3;overflow:hidden;border-radius:var(--r,0)}
.device .art svg{position:absolute;inset:0;width:100%;height:100%}
.device h3{font-size:clamp(34px,3.6vw,52px)}
.device p{margin-top:16px}
.chips{display:flex;flex-wrap:wrap;gap:8px;margin-top:22px}
.chips li{border:1px solid var(--line);border-radius:40px;padding:7px 14px;font-family:var(--label);font-size:12px;letter-spacing:.12em;text-transform:uppercase}
.photos{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:24px}
.ph .frame{aspect-ratio:3/4;position:relative;overflow:hidden;border-radius:var(--r,0)}
.ph .frame svg{position:absolute;inset:0;width:100%;height:100%}
.ph .frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cap{position:absolute;z-index:3;left:10px;bottom:10px;font-family:var(--label);font-size:10px;letter-spacing:.16em;text-transform:uppercase;background:rgba(12,12,12,.82);color:#F2EEE8;padding:3px 7px}
.ph h3{font-size:19px;margin-top:14px}
.ph p{font-size:15px;color:var(--muted);margin-top:4px}
.voice{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.5fr);gap:56px}
.rules{margin-top:28px;border-top:1px solid var(--line)}
.rules li{padding:10px 0;border-bottom:1px solid var(--line);font-size:15px;color:var(--muted)}
.vlist{border-top:1px solid var(--line)}
.vrow{display:grid;grid-template-columns:150px minmax(0,1fr);gap:20px;padding:20px 0;border-bottom:1px solid var(--line);align-items:baseline}
.vrow .lab{color:var(--muted);font-size:11px}
.vrow p{font-size:clamp(22px,2.4vw,32px);line-height:1.2}
.giftgrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}
.gcard{border:1px solid var(--line);border-radius:var(--r,0);overflow:hidden;display:flex;flex-direction:column;background:var(--card);color:var(--card-fg)}
.gcard .obj{aspect-ratio:1/1;position:relative;overflow:hidden;display:flex;align-items:center;justify-content:center}
.gcard .t{padding:16px 18px 20px}
.gcard h3{font-size:19px}
.gcard p{font-size:14px;color:var(--card-muted);margin-top:4px}
.note-card{width:70%;aspect-ratio:1.5/1;background:#FBF8F2;color:#1a1714;padding:9% 8%;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 20px 30px -18px rgba(0,0,0,.55);transform:rotate(-2deg)}
.note-card p{color:#1a1714!important;font-family:var(--note-font,var(--display));font-size:clamp(15px,1.5vw,19px);line-height:1.25}
.note-card .mk-word{width:40%;height:auto;color:#1a1714}
.emboss{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.emboss-plate{position:absolute;left:50%;top:78%;transform:translate(-50%,-50%);font-family:Georgia,serif;font-size:clamp(22px,2.6vw,34px);letter-spacing:.24em;color:#c9a24a;text-shadow:0 1px 1px rgba(0,0,0,.6);z-index:2}
.gift-rows{margin-top:32px;border-top:1px solid var(--line)}
.gift-rows div{display:grid;grid-template-columns:200px minmax(0,1fr);gap:20px;padding:16px 0;border-bottom:1px solid var(--line)}
.gift-rows dt{color:var(--muted)}
.gift-rows dd{font-size:17px}
.phonewrap{display:grid;grid-template-columns:auto minmax(0,1fr);gap:64px;align-items:start}
.phone{width:300px;height:620px;border-radius:40px;border:10px solid #0b0b0b;overflow:hidden;position:relative;box-shadow:0 30px 60px -30px rgba(0,0,0,.6);background:var(--screen-bg)}
.phone .notch{position:absolute;top:8px;left:50%;width:90px;height:22px;margin-left:-45px;border-radius:14px;background:#0b0b0b;z-index:5}
.screen{position:absolute;inset:0;display:flex;flex-direction:column}
.dl{border-top:1px solid var(--line)}
.dl div{display:grid;grid-template-columns:140px minmax(0,1fr);gap:18px;padding:14px 0;border-bottom:1px solid var(--line)}
.dl dt{color:var(--accent)}
.dl dd{font-size:16px}
.proof{margin-top:32px}
.proof h3{font-size:18px;margin-bottom:10px}
.proof ul{display:grid;grid-template-columns:1fr 1fr;gap:8px}
.proof li{border:1px solid var(--line);border-radius:var(--r,0);padding:10px 12px;font-size:14px;display:flex;justify-content:space-between;gap:10px;align-items:baseline}
.proof li .lab{font-size:10px;color:var(--muted)}
.proof li.ok .lab{color:var(--accent)}
.verdict{display:grid;grid-template-columns:1fr 1fr;gap:48px}
.verdict h3{font-size:28px;padding-bottom:12px;border-bottom:1px solid var(--line)}
.verdict li{padding:14px 0;border-bottom:1px solid var(--line);font-size:17px}
footer.nf{padding:88px 0 56px}
footer.nf h2{font-size:32px}
footer.nf ul{display:grid;grid-template-columns:1fr 1fr;gap:0 48px;margin-top:22px}
footer.nf li{padding:12px 0;border-top:1px solid var(--line);font-size:14px;color:var(--muted)}
footer.nf .end{display:flex;justify-content:space-between;align-items:center;gap:24px;margin-top:40px;flex-wrap:wrap;color:var(--muted)}
footer.nf .lockup{font-size:20px;color:var(--fg)}
footer.nf a{color:var(--fg);display:inline-flex;align-items:center;min-height:44px}
@media (max-width:1000px){
.thesis{grid-template-columns:1fr 1fr}
.found{grid-template-columns:1fr 1fr}
.found div:nth-child(2){border-right:0}
.found div:nth-child(-n+2){border-bottom:1px solid var(--line)}
.spec,.device,.voice{grid-template-columns:1fr}
.photos{grid-template-columns:1fr 1fr}
.giftgrid{grid-template-columns:1fr 1fr}
.phonewrap{grid-template-columns:1fr;justify-items:center}
.phonewrap>div:last-child{width:100%}
}
@media (max-width:700px){
.wrap{padding:0 16px}
.thesis,.photos,.giftgrid,.verdict{grid-template-columns:1fr}
.found{grid-template-columns:1fr}
.found div{border-right:0!important;border-bottom:1px solid var(--line)}
.found div:last-child{border-bottom:0}
.vrow,.gift-rows div,.dl div{grid-template-columns:1fr;gap:4px}
.proof ul{grid-template-columns:1fr}
.phone{width:280px;height:580px}
footer.nf ul{grid-template-columns:1fr}
}
`;

export const ideaBody = (W) => `
  <p class="lead" data-r>${esc(W.reading)}</p>
  <div class="thesis">${W.thesis.map(([h, t]) => `<article data-r><h3>${esc(h)}</h3><p>${esc(t)}</p></article>`).join('')}</div>
  <div class="found" data-r>
    <div><span class="lab">Tagline</span><p>${esc(TAGLINE)}</p></div>
    <div><span class="lab">For</span><p>${esc(FOUNDATION.icp.title)}, ${esc(FOUNDATION.icp.age)}, metro India</p></div>
    <div><span class="lab">Trigger</span><p>“${esc(FOUNDATION.triggers[0][1])}”</p></div>
    <div><span class="lab">Feeling</span><p>${esc(FOUNDATION.emotion)}</p></div>
  </div>`;

export const paletteBody = (W, note) => `
  <div class="swatches">${W.palette.map((c) => `<div class="sw" data-r><div class="chip" style="background:${c.hex}"></div><div class="t"><b>${esc(c.name)}</b><span class="hex">${c.hex}</span><p>${esc(c.role)}</p>${c.note ? `<p class="note">${esc(c.note)}</p>` : ''}</div></div>`).join('')}</div>
  <p class="muted" style="margin-top:28px;max-width:44em" data-r>${esc(note)}</p>`;

export const typeBody = (W, big, sample, dataSample) => `
  <div class="spec">
    <p class="big disp" data-r aria-hidden="true">${big}</p>
    <div>
      <div class="tk" data-r><h3>${esc(W.type.display)}</h3><p>${esc(W.type.displayWhy)}</p></div>
      <div class="tk" data-r><h3>${esc(W.type.text)}</h3><p>${esc(W.type.textWhy)}</p><p class="sample">${esc(sample)}</p></div>
      <div class="tk" data-r><h3>${esc(W.type.data)}</h3><p>${esc(W.type.dataWhy)}</p><p class="sample lab">${esc(dataSample)}</p></div>
    </div>
  </div>`;

export const deviceBody = (W, art) => `
  <div class="device">
    <div class="art" data-r>${art}</div>
    <div data-r><h3 class="disp">${esc(W.device.title)}</h3><p>${esc(W.device.text)}</p><ul class="chips">${W.device.supports.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
  </div>`;

export const photoBody = (W, frames) => `
  <div class="photos">${W.photo.map(([h, p], i) => `<div class="ph" data-r>${frames[i]}<h3>${esc(h)}</h3><p>${esc(p)}</p></div>`).join('')}</div>
  <p class="muted" style="margin-top:28px;font-size:15px" data-r>These frames describe the photography; they are not photographs. The real shoot should use Indian cities and Indian models.</p>`;

export const voiceBody = (W) => `
  <div class="voice">
    <div data-r><p class="lead">${esc(W.voice.summary)}</p><ul class="rules">${FOUNDATION.voice.map((v) => `<li>${esc(v)}</li>`).join('')}</ul></div>
    <div class="vlist">${W.voice.samples.map(([k, v]) => `<div class="vrow" data-r><span class="lab">${esc(k)}</span><p class="disp">${esc(v)}</p></div>`).join('')}</div>
  </div>`;

export const giftingBody = (W, box) => {
  const g = FOUNDATION.gifting;
  return `
  <p class="lead" data-r>For the gift giver: “${esc(FOUNDATION.triggers[1][1])}” A bag goes to every meeting and every flight, so the gift gets remembered every day.</p>
  <div class="giftgrid" style="margin-top:40px">
    <figure class="gcard" data-r><div class="obj">${box}</div><figcaption class="t"><h3>The box</h3><p>Ships gift-ready: box, tissue, dust bag.</p></figcaption></figure>
    <figure class="gcard" data-r><div class="obj note-obj"><div class="note-card"><p>${esc(g.notes[0])}</p><span class="mk mk-word" role="img" aria-label="Tuskrr"></span></div></div><figcaption class="t"><h3>The note</h3><p>Written by the giver, printed on card. Suggested lines: “${esc(g.notes[1])}” “${esc(g.notes[2])}”</p></figcaption></figure>
    <figure class="gcard" data-r><div class="obj"><img class="emboss" src="${IMG.contour}" alt="CONTOUR folio with initials, illustration on a supplied product render"><span class="emboss-plate" aria-hidden="true">K.S.</span><span class="cap">Illustration</span></div><figcaption class="t"><h3>Initials</h3><p>${esc(g.initials)}</p></figcaption></figure>
  </div>
  <dl class="gift-rows" data-r>
    <div><dt class="lab">Corporate</dt><dd>${esc(g.corporate)}</dd></div>
    <div><dt class="lab">Diwali</dt><dd>${esc(g.diwali)}</dd></div>
  </dl>`;
};

export const phoneBody = (W, screen) => `
  <div class="phonewrap">
    <div class="phone" data-r role="img" aria-label="Phone mock-up of the ${esc(W.name)} home screen"><span class="notch"></span><div class="screen" aria-hidden="true">${screen}</div></div>
    <div>
      <dl class="dl" data-r>${W.phone.map(([k, v]) => `<div><dt class="lab">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      <div class="proof" data-r><h3>Proof on every product page</h3><ul>${FOUNDATION.proof.map(([t, s]) => `<li class="${s === 'confirmed' ? 'ok' : ''}"><span>${esc(t)}</span><span class="lab">${esc(s)}</span></li>`).join('')}</ul></div>
    </div>
  </div>`;

export const verdictBody = (W) => `
  <div class="verdict">
    <div data-r><h3 class="disp">Why choose it</h3><ul>${W.strengths.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
    <div data-r><h3 class="disp">Watch for</h3><ul>${W.watch.map((s) => `<li>${esc(s)}</li>`).join('')}</ul></div>
  </div>`;

export const footer = (W) => `<footer class="nf" aria-label="What is not final"><div class="wrap">
  <h2 class="disp">Not final</h2>
  <ul>${NOT_FINAL.map((n) => `<li>${esc(n)}</li>`).join('')}</ul>
  <div class="end">${lockup()}<span class="lab">Option ${W.letter} of C / <a href="START-HERE.html">Back to all options</a></span></div>
</div></footer>`;
