// Shared kit for the eight direction sites: product facts, sample prices,
// embedded stock media, the bag counter, a reveal engine configured per
// direction, and the credits and "Not final" footer.
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { IMG, FONTS, PRODUCTS, esc, LOGO_VARS, BASE_CSS, MOTION_HEAD } from '../../src/shared.mjs';
import { LAPTOP, TAGLINE } from '../../src/worlds.mjs';

export { IMG, FONTS, esc, TAGLINE };
const HERE = dirname(fileURLToPath(import.meta.url));
export const MEDIA_DIR = join(HERE, '..', 'media');
const CREDITS = JSON.parse(readFileSync(join(MEDIA_DIR, 'credits.json'), 'utf8'));

// Sample prices inside the confirmed Rs 5,000 to 7,000 band. Labelled as samples.
const PRICE = { ridge: 6490, traverse: 6990, strata: 6490, crest: 6290, axis: 5290, contour: 5490 };
export const inr = (n) => '₹' + n.toLocaleString('en-IN');
const cut = (id) => `data:image/webp;base64,${readFileSync(join(MEDIA_DIR, `cut-${id}.webp`)).toString('base64')}`;
export const BAGS = PRODUCTS.map((p, i) => ({ ...p, n: String(i + 1).padStart(2, '0'), price: PRICE[p.id], priceText: inr(PRICE[p.id]), laptop: LAPTOP[p.id], img: cut(p.id), raw: IMG[p.id] }));
export const PROOF = ['Genuine leather', '3-year warranty', 'Cash on delivery', 'Initials embossed to order, ready in 2 weeks'];

// ---------- media ----------
const cache = new Map();
const b64 = (file, type) => {
  if (!cache.has(file)) cache.set(file, `data:${type};base64,${readFileSync(join(MEDIA_DIR, file)).toString('base64')}`);
  return cache.get(file);
};
export const used = new Set();
const base = (id) => id.replace(/-\d+$/, '').replace(/-poster$/, '');
// A still: "<clip>-<n>" (frame from a clip), "<clip>-poster", or a photo id "p-...".
export function still(id) {
  if (!existsSync(join(MEDIA_DIR, id + '.jpg'))) throw new Error('missing still ' + id);
  used.add(base(id));
  return b64(id + '.jpg', 'image/jpeg');
}
export function clip(id) {
  used.add(id);
  return { src: b64(id + '.mp4', 'video/mp4'), poster: b64(id + '-poster.jpg', 'image/jpeg') };
}
// Video that plays only when motion is on; the poster stands in otherwise.
export function video(id, { cls = '', label = true, alt = '' } = {}) {
  const c = clip(id);
  return `<div class="mv ${cls}"><video class="mv-v" muted loop playsinline preload="auto" poster="${c.poster}" data-play aria-hidden="true"><source src="${c.src}" type="video/mp4"></video>${alt ? `<span class="sr">${esc(alt)}</span>` : ''}${label ? stockTag() : ''}</div>`;
}
export function photo(id, alt, { cls = '', label = true } = {}) {
  return `<div class="mv ${cls}"><img class="mv-v" src="${still(id)}" alt="${esc(alt)}" decoding="async">${label ? stockTag() : ''}</div>`;
}
export function render(bag, { cls = '', label = true } = {}) {
  return `<div class="mv mv-render ${cls}"><img class="mv-v" src="${bag.img}" alt="${esc(bag.name)}, ${esc(bag.type.toLowerCase())}, ${esc(bag.finish.toLowerCase())}" decoding="async">${label ? `<span class="tagx">Supplied render</span>` : ''}</div>`;
}
export const stockTag = () => '<span class="tagx">Stock stand-in</span>';

export const KIT_CSS = `
.mv{position:relative;overflow:hidden}
.mv-v{display:block;width:100%;height:100%;object-fit:cover}
.mv-render{overflow:visible}.mv-render .mv-v{object-fit:contain}
.tagx{position:absolute;left:8px;bottom:8px;z-index:3;background:#111;color:#fff;font:500 11px/1.2 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.04em;padding:4px 6px;text-transform:uppercase;pointer-events:none}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
.bagcount{display:inline-flex;align-items:center;justify-content:center;min-width:44px;min-height:44px;gap:6px;text-decoration:none}
.toast{position:fixed;left:50%;bottom:20px;transform:translate(-50%,calc(100% + 40px));visibility:hidden;z-index:99;background:#111;color:#fff;padding:12px 18px;font:500 15px/1.3 'Instrument Sans',system-ui,sans-serif;transition:transform .25s ease-out,visibility .25s;pointer-events:none;max-width:calc(100vw - 32px)}
.toast.on{transform:translate(-50%,0);visibility:visible}
html[data-motion=on] [data-r]:not(.r-in){opacity:0;transform:var(--rv-from,translateY(16px))}
html[data-motion=on] [data-r].r-in{transition:opacity var(--rv-dur,1s) var(--rv-ease,ease),transform var(--rv-dur,1s) var(--rv-ease,ease);transition-delay:var(--d,0s)}
html[data-motion=on]:not([data-hash]) body>*:not(script){animation:tk-page 1s cubic-bezier(0.42,0,0.58,1)}
@keyframes tk-page{from{opacity:0}to{opacity:1}}
@media (prefers-reduced-motion:reduce){.toast{transition:none}}
`;

// Reveal engine: step and cap per direction. Scoped to the viewport so nothing
// below the fold is force-shown.
export const kitJS = ({ step = 0.125, cap = 0.75 } = {}) => `<script>(function(){
var root=document.documentElement,on=root.getAttribute("data-motion")==="on";
[].forEach.call(document.querySelectorAll("video[data-play]"),function(v){if(on){v.autoplay=true;var p=v.play();if(p&&p.catch)p.catch(function(){})}else{v.removeAttribute("autoplay");v.pause()}});
var n=0,cnt=[].slice.call(document.querySelectorAll("[data-count]")),toast=document.createElement("div");toast.className="toast";toast.setAttribute("role","status");document.body.appendChild(toast);var tt;
document.addEventListener("click",function(e){var b=e.target.closest("[data-add]");if(!b)return;e.preventDefault();n++;cnt.forEach(function(c){c.textContent=n});toast.textContent=b.getAttribute("data-add")+" is in your bag. Cash on delivery available.";toast.classList.add("on");clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove("on")},2600)});
if(!on)return;
var els=[].slice.call(document.querySelectorAll("[data-r]"));
function show(list){list.sort(function(a,b){return a.compareDocumentPosition(b)&4?-1:1});list.forEach(function(el,i){el.style.setProperty("--d",Math.min(i*${step},${cap})+"s");el.classList.add("r-in")})}
if(!("IntersectionObserver" in window)){show(els);return}
function tg(el){var p=el.parentElement;return p&&p.classList.contains("ln")?p:el}
var io=new IntersectionObserver(function(en){var l=[];en.forEach(function(e){if(e.isIntersecting){io.unobserve(e.target);els.forEach(function(el){if(tg(el)===e.target&&!el.classList.contains("r-in"))l.push(el)})}});if(l.length)show(l)},{rootMargin:"0px 0px -6% 0px"});
els.forEach(function(el){io.observe(tg(el))});
setTimeout(function(){var vh=innerHeight,l=els.filter(function(el){if(el.classList.contains("r-in"))return false;var b=tg(el).getBoundingClientRect();return b.bottom>0&&b.top<vh});l.forEach(function(el){io.unobserve(tg(el))});if(l.length)show(l)},2500);
})();</script>`;

export const NOT_FINAL_SITE = [
  'This is a direction prototype, not the website. Links other than the section links and the bag counter do not go anywhere yet.',
  'Every photo and video marked "Stock stand-in" is licensed free stock, used to show the direction. None of it shows Tuskrr bags, Tuskrr people or Tuskrr places, and all of it is replaced by the real shoot.',
  'Bags are the renders supplied by Tuskrr, marked "Supplied render". They are not final photography.',
  'Prices are samples inside the confirmed ₹5,000 to ₹7,000 range. Laptop sizes and the returns policy are samples too.',
  'The logo is cut from the supplied JPEGs. Vector artwork is still needed.',
  '"Arrive like you mean it." needs a trademark search (IP India) before launch.',
];

export function credits() {
  const rows = [...used].sort().map((id) => CREDITS[id]).filter(Boolean);
  return rows.map((c) => `${esc(c.title)} (${esc(c.source === 'coverr' ? 'Coverr' : c.source === 'mixkit' ? 'Mixkit' : 'Burst by Shopify')}, ${esc(c.license)})`);
}

// Footer block with the not-final list and stock credits. Colours passed in.
export function footNotes({ fg, soft, rule, head = 'Not final' }) {
  const cr = credits();
  return `<div class="fn" style="color:${fg}">
<p class="fn-h" style="color:${soft}">${head}</p>
<ul class="fn-l">${NOT_FINAL_SITE.map((t) => `<li style="border-color:${rule}">${esc(t)}</li>`).join('')}</ul>
<p class="fn-h" style="color:${soft}">Stock used on this page (${cr.length})</p>
<ul class="fn-c" style="color:${soft}">${cr.map((t) => `<li>${t}</li>`).join('')}</ul>
</div>`;
}
export const FOOT_CSS = `.fn{font-size:14px;line-height:1.5}.fn-h{font:500 12px/1.3 'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.08em;text-transform:uppercase;margin:28px 0 10px}.fn-l li{padding:8px 0;border-top:1px solid;max-width:80ch}.fn-c{columns:2 280px;column-gap:28px;font-size:13px}.fn-c li{break-inside:avoid;padding:3px 0}`;

export function sitePage({ title, description, css, body, fonts, step, cap, lang = 'en-IN' }) {
  return `<!doctype html>
<html lang="${lang}">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex">
${MOTION_HEAD}
<style>${fonts}${LOGO_VARS}${BASE_CSS}${KIT_CSS}${FOOT_CSS}${css}</style>
</head>
<body>
${body}
${kitJS({ step, cap })}
</body>
</html>
`;
}

// Resets media usage between pages so each page credits only what it shows.
export function resetUsed() { used.clear(); }
export const ALL_FONTS = FONTS;
