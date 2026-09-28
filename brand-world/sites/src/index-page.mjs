// Index of the eight direction sites. Built by build-sites.mjs.
import { FONTS, esc, still, clip, sitePage } from './kit.mjs';
import { lockup } from '../../src/shared.mjs';
import { DIRECTIONS, THEMES } from '../../src/directions-data.mjs';

const FILES = { reel: '01-the-reel.html', host: '02-the-host.html', roster: '03-the-roster.html', outfitter: '04-the-outfitter.html', readings: '05-six-readings.html', store: '06-the-small-store.html', pressed: '07-pressed-in.html', kit: '08-everyday-kit.html' };
const THUMB = { reel: () => clip('corridor').poster, host: () => clip('citynight').poster, roster: () => still('study-0'), outfitter: () => clip('bw-walk').poster, readings: () => clip('traffic').poster, store: () => still('caller-0'), pressed: () => clip('leather').poster, kit: () => clip('bw-work').poster };

export function build() {
  const cards = DIRECTIONS.map((d) => `<a class="c" href="${FILES[d.id]}" data-r><span class="c-img"><img src="${THUMB[d.id]()}" alt="" decoding="async"><span class="tagx">Stock stand-in</span></span>
<span class="c-b"><span class="mono">${d.n} · ${esc(THEMES[d.theme].name)}${d.world ? `, ${esc(THEMES.wilderness.worlds[d.world].name)}` : ''}</span><span class="c-n">${esc(d.name)}</span><span class="c-r">From ${esc(d.ref.name)}</span><span class="c-l">${esc(d.line)}</span></span></a>`).join('');
  const body = `<header class="top">${lockup()}<span class="mono">Direction prototypes · not the website</span></header>
<main><h1 class="h" data-r>Eight directions, built</h1><p class="lede" data-r>One single-page prototype per direction, each on one theme. Stock photos and video stand in for the shoot and are labelled on every frame. Bags are the supplied renders, cut out. Prices, laptop sizes and the returns policy are samples.</p>
<div class="g">${cards}</div>
<p class="note">The direction library is at <a class="lnk" href="../website-directions.html">website-directions.html</a> and the asset list at <a class="lnk" href="../asset-requirements.html">asset-requirements.html</a>.</p></main>`;
  const css = `
body{background:#F2EFE9;color:#171512;font:400 16px/1.55 'Instrument Sans',system-ui,sans-serif}
.mono{font:500 12px/1.4 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#57524A}
.top{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;padding:18px clamp(16px,3vw,40px);border-bottom:1px solid #D5CFC4}.top .lockup{font-size:20px}
main{padding:clamp(32px,6vh,72px) clamp(16px,3vw,40px)}
.h{font:600 clamp(48px,8vw,110px)/.95 'Instrument Sans',sans-serif;font-stretch:75%;text-transform:uppercase}
.lede{max-width:62ch;margin:16px 0 32px;color:#3F3A33}
.g{display:grid;gap:14px;grid-template-columns:repeat(auto-fill,minmax(280px,1fr))}
.c{display:flex;flex-direction:column;background:#FBFAF7;border:1px solid #D5CFC4;color:#171512;text-decoration:none;transition:border-color .25s ease-in-out,transform .25s ease-in-out}
.c:hover{border-color:#8A4722}
.c-img{position:relative;aspect-ratio:16/10;overflow:hidden;display:block}.c-img img{width:100%;height:100%;object-fit:cover}
.c-b{display:flex;flex-direction:column;gap:6px;padding:16px}
.c-n{font:600 34px/1 'Instrument Sans',sans-serif;font-stretch:75%;text-transform:uppercase}.c-r{color:#57524A;font-size:14px}.c-l{font-size:15px}
.note{margin-top:28px;color:#57524A}
.lnk{display:inline-flex;align-items:center;min-height:44px;min-width:44px;color:#8A4722;font-weight:600}
`;
  return sitePage({ title: 'Tuskrr direction prototypes', description: 'Index of the eight Tuskrr website direction prototypes.', css, body, fonts: FONTS.instrumentSans + FONTS.plexMono });
}
