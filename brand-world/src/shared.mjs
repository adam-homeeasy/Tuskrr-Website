// Shared inputs for every brand-world option: assets, product facts, generated
// line art and the motion layer. Every option carries the same product facts, so
// the only variables between options are the world, the design and the voice.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const asset = (p) => readFileSync(join(ROOT, 'assets', p));
const uri = (p, type) => `data:${type};base64,${asset(p).toString('base64')}`;

export const IMG = {
  wordmark: uri('img/logo-wordmark.png', 'image/png'),
  monogram: uri('img/logo-monogram.png', 'image/png'),
  ridge: uri('img/ridge.jpg', 'image/jpeg'),
  traverse: uri('img/traverse.jpg', 'image/jpeg'),
  strata: uri('img/strata.jpg', 'image/jpeg'),
  crest: uri('img/crest.jpg', 'image/jpeg'),
  axis: uri('img/axis.jpg', 'image/jpeg'),
  contour: uri('img/contour.jpg', 'image/jpeg'),
};

const font = (family, file, weight = '400', style = 'normal', stretch = '100%') =>
  `@font-face{font-family:"${family}";src:url(${uri('fonts/' + file, 'font/woff2')}) format("woff2");font-weight:${weight};font-style:${style};font-stretch:${stretch};font-display:swap}`;

export const FONTS = {
  archivo: font('Archivo', 'archivo-var.woff2', '100 900', 'normal', '62% 125%'),
  plexMono: font('IBM Plex Mono', 'plexmono-400.woff2', '400') + font('IBM Plex Mono', 'plexmono-500.woff2', '500'),
  instrumentSans: font('Instrument Sans', 'instrumentsans-var.woff2', '400 700', 'normal', '75% 100%'),
  instrumentSerif: font('Instrument Serif', 'instrumentserif-400.woff2', '400') + font('Instrument Serif', 'instrumentserif-italic.woff2', '400', 'italic'),
  hanken: font('Hanken Grotesk', 'hankengrotesk-var.woff2', '300 700'),
};

// Product facts. Names, inspirations, stories and campaign lines are Tuskrr's own
// words from "Tuskrr Product Names copy.pdf", with dashes turned into ordinary
// punctuation. "type" and "finish" are working descriptions read off the photos.
export const PRODUCTS = [
  {
    id: 'ridge', name: 'RIDGE', inspired: 'terrain', type: 'Backpack', finish: 'Cognac leather',
    idea: 'A ridge is where two worlds meet: earth and sky, ascent and descent, wilderness and direction.',
    story: 'The ridges of a mountain never run perfectly straight. They rise, fall and adapt to the terrain. We translated that movement into leather, giving structure to something designed for movement.',
    line: 'Carry your own direction.', alt: null, note: 'Hero backpack of the launch',
  },
  {
    id: 'traverse', name: 'TRAVERSE', inspired: 'movement', type: 'Weekender', finish: 'Cognac leather, frame top',
    idea: 'TRAVERSE is not about where you are going. It is about everything you cross to get there.',
    story: 'Forests. Cities. Offices. Airports. Roads. Unknown places. Inspired by trails carved through wild landscapes, TRAVERSE carries the spirit of movement in a form designed for modern travel.',
    line: 'Take the long way.', alt: 'Made for the distance between here and there.', note: null,
  },
  {
    id: 'strata', name: 'STRATA', inspired: 'layers', type: 'Laptop briefcase', finish: 'Black, textured weave',
    idea: 'Layers of earth. Layers of architecture. Layers of work, ambition and experience.',
    story: 'Its disciplined vertical lines echo geological formations, while its clean silhouette belongs firmly in the modern city. Because a life well built is made in layers.',
    line: 'Built in layers.', alt: null, note: null,
  },
  {
    id: 'crest', name: 'CREST', inspired: 'elevation', type: 'Backpack', finish: 'Brick red leather',
    idea: 'Every wild landscape has a high point. A mountain peak. A wave breaking. A bird in flight.',
    story: 'CREST takes inspiration from that moment of elevation, where form gathers energy before moving forward. Its curved silhouette meets disciplined lines, equally at home in the wild and in the city.',
    line: 'Rise above ordinary.', alt: 'Find your high point.', note: null,
  },
  {
    id: 'axis', name: 'AXIS', inspired: 'direction', type: 'Vertical sling', finish: 'Cognac leather, brass zips',
    idea: 'In nature, everything has a line of movement. A predator follows its path. A river finds its course.',
    story: 'AXIS is built around one simple idea: everything begins with a line. Compact. Focused. Purposeful. Carry only what matters.',
    line: 'Nothing unnecessary.', alt: null, note: null,
  },
  {
    id: 'contour', name: 'CONTOUR', inspired: 'form', type: 'Laptop folio', finish: 'Navy leather',
    idea: 'Nature rarely follows a perfect line. It follows contours. The curve of a mountain. The edge of a river.',
    story: 'CONTOUR follows the same principle: clean lines shaped around what it protects. Minimal on the outside. Considered on the inside.',
    line: 'Protection, shaped beautifully.', alt: null, note: null,
  },
];

export const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// ---------- generated line art ----------

function rng(seed) {
  let s = seed >>> 0;
  return () => ((s = (Math.imul(s, 1664525) + 1013904223) >>> 0) / 4294967296);
}

function noise2(seed) {
  const r = rng(seed), N = 256, g = new Float64Array(N * N);
  for (let i = 0; i < g.length; i++) g[i] = r();
  const at = (i, j) => g[(((j % N) + N) % N) * N + (((i % N) + N) % N)];
  const sm = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x), yi = Math.floor(y), u = sm(x - xi), v = sm(y - yi);
    const a = at(xi, yi), b = at(xi + 1, yi), c = at(xi, yi + 1), d = at(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
}

function fbm(n, x, y, oct = 4) {
  let s = 0, amp = 0.5, f = 1, norm = 0;
  for (let o = 0; o < oct; o++) { s += amp * n(x * f, y * f); norm += amp; amp *= 0.5; f *= 2.03; }
  return s / norm;
}

const r1 = (v) => Math.round(v * 10) / 10;

// Topographic contour map by marching squares over a noise field with peaks.
export function contourMap({ seed = 7, w = 1000, h = 660, cols = 110, levels = 16, peaks = [[0.3, 0.42, 0.9], [0.72, 0.6, 0.7]], scale = 3.2 } = {}) {
  const n = noise2(seed);
  const rows = Math.round(cols * h / w);
  const field = [];
  for (let j = 0; j <= rows; j++) {
    const row = [];
    for (let i = 0; i <= cols; i++) {
      const x = i / cols, y = j / rows;
      let v = fbm(n, x * scale, y * scale * h / w) * 0.9;
      for (const [px, py, a] of peaks) {
        const dx = x - px, dy = (y - py) * h / w;
        v += a * Math.exp(-(dx * dx + dy * dy) / 0.045);
      }
      row.push(v);
    }
    field.push(row);
  }
  let lo = Infinity, hi = -Infinity;
  for (const row of field) for (const v of row) { lo = Math.min(lo, v); hi = Math.max(hi, v); }
  const sx = w / cols, sy = h / rows;
  const paths = [];
  for (let k = 1; k <= levels; k++) {
    const t = lo + (hi - lo) * k / (levels + 1);
    const segs = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const a = field[j][i], b = field[j][i + 1], c = field[j + 1][i + 1], d = field[j + 1][i];
      const idx = (a > t ? 8 : 0) | (b > t ? 4 : 0) | (c > t ? 2 : 0) | (d > t ? 1 : 0);
      if (idx === 0 || idx === 15) continue;
      const lerp = (p, q) => (t - p) / (q - p);
      const top = [(i + lerp(a, b)) * sx, j * sy];
      const right = [(i + 1) * sx, (j + lerp(b, c)) * sy];
      const bottom = [(i + lerp(d, c)) * sx, (j + 1) * sy];
      const left = [i * sx, (j + lerp(a, d)) * sy];
      const T = {
        1: [[left, bottom]], 2: [[bottom, right]], 3: [[left, right]], 4: [[top, right]],
        5: [[left, top], [bottom, right]], 6: [[top, bottom]], 7: [[left, top]], 8: [[left, top]],
        9: [[top, bottom]], 10: [[left, bottom], [top, right]], 11: [[top, right]], 12: [[left, right]],
        13: [[bottom, right]], 14: [[left, bottom]],
      }[idx];
      for (const s of T) segs.push(s);
    }
    // chain segments into polylines
    const key = (p) => r1(p[0]) + ',' + r1(p[1]);
    const ends = new Map();
    segs.forEach((s, si) => {
      for (const e of [0, 1]) {
        const kk = key(s[e]);
        if (!ends.has(kk)) ends.set(kk, []);
        ends.get(kk).push(si);
      }
    });
    const used = new Uint8Array(segs.length);
    let d = '';
    for (let si = 0; si < segs.length; si++) {
      if (used[si]) continue;
      used[si] = 1;
      const line = [segs[si][0], segs[si][1]];
      for (const dir of [1, 0]) {
        for (;;) {
          const tip = dir ? line[line.length - 1] : line[0];
          const next = (ends.get(key(tip)) || []).find((x) => !used[x]);
          if (next === undefined) break;
          used[next] = 1;
          const s = segs[next];
          const other = key(s[0]) === key(tip) ? s[1] : s[0];
          if (dir) line.push(other); else line.unshift(other);
        }
      }
      if (line.length < 4) continue;
      d += 'M' + line.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L');
    }
    paths.push({ d, index: k % 5 === 0 });
  }
  return paths;
}

export function contourSVG(opts = {}, cls = '') {
  const { w = 1000, h = 660 } = opts;
  const paths = contourMap(opts);
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-linejoin="round" stroke-linecap="round">${paths.map((p) => `<path d="${p.d}" stroke-width="${p.index ? 1.6 : 0.7}"${p.index ? '' : ' opacity="0.7"'}/>`).join('')}</g></svg>`;
}

// One ridge line as a list of points.
function ridgeLine(n, { w, base, amp, freq, seed, steps = 120 }) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    const x = i / steps;
    const v = fbm(n, x * freq + seed, seed * 0.37, 5);
    // sharpen into ridges
    const ridge = 1 - Math.abs(v * 2 - 1);
    pts.push([x * w, base - (ridge * 0.65 + v * 0.35) * amp]);
  }
  return pts;
}

// Layered mountain silhouettes, back to front.
export function ridgesSVG({ w = 1440, h = 640, seed = 3, layers, cls = '' }) {
  const n = noise2(seed);
  const body = layers.map((L, i) => {
    const pts = ridgeLine(n, { w, base: L.base * h, amp: L.amp * h, freq: L.freq, seed: i * 3.1 + seed });
    const d = 'M0 ' + h + 'L' + pts.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L') + 'L' + w + ' ' + h + 'Z';
    return `<path d="${d}" fill="${L.fill}"${L.stroke ? ` stroke="${L.stroke}" stroke-width="1"` : ''}/>`;
  }).join('');
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false">${body}</svg>`;
}

// Horizontal strata: stacked, gently deformed lines.
export function strataSVG({ w = 1200, h = 360, lines = 26, seed = 11, cls = '' }) {
  const n = noise2(seed);
  let d = '';
  for (let k = 0; k < lines; k++) {
    const y0 = (k + 0.5) * h / lines;
    const pts = [];
    for (let i = 0; i <= 80; i++) {
      const x = i / 80;
      const dy = (fbm(n, x * 2.2, k * 0.18, 4) - 0.5) * h * 0.22 + Math.sin(x * 3 + k * 0.2) * h * 0.02;
      pts.push(r1(x * w) + ' ' + r1(y0 + dy));
    }
    d += 'M' + pts.join('L');
  }
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${d}" fill="none" stroke="currentColor" stroke-width="1" vector-effect="non-scaling-stroke"/></svg>`;
}

// An elevation profile: returns the path and six waypoint positions.
export function profile({ w = 1000, h = 60, seed = 5, marks = 6 }) {
  const n = noise2(seed);
  const pts = [];
  for (let i = 0; i <= 200; i++) {
    const x = i / 200;
    const v = fbm(n, x * 4.2, 0.5, 5);
    const rise = Math.sin(x * Math.PI * 0.92) * 0.55;
    pts.push([x * w, h - 6 - (v * 0.5 + rise) * (h - 12)]);
  }
  const d = 'M' + pts.map((p) => r1(p[0]) + ' ' + r1(p[1])).join('L');
  const wp = [];
  for (let m = 0; m < marks; m++) {
    const i = Math.round((m + 0.5) / marks * 200);
    wp.push({ x: pts[i][0] / w, y: pts[i][1] / h });
  }
  return { d, wp };
}

// Film grain as an SVG data URI (feTurbulence fractalNoise, baseFrequency 0.875).
export function grain(alpha = 0.22, tint = '0 0 0') {
  const [r, g, b] = tint.split(' ');
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.875' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${r} 0 0 0 0 ${g} 0 0 0 0 ${b} 0 0 0 ${alpha * 2} -${alpha * 0.5}'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`;
  return `url("data:image/svg+xml,${svg.replace(/</g, '%3C').replace(/>/g, '%3E').replace(/"/g, "'")}")`;
}

// ---------- motion layer ----------
// Timing contract: ease-in-out cubic-bezier(0.42,0,0.58,1), 1s entrances, 16px
// travel, delays on a 0.125s grid capped at 0.75s, controls at 0.25s, and a 1s
// whole-page opacity fade underneath, skipped when the URL carries a hash.
// ?motion=off and ?motion=force override the OS reduced-motion setting.

export const MOTION_HEAD = `<script>(function(){var q=null,r=false;try{q=new URLSearchParams(location.search).get("motion")}catch(e){}try{r=matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}var on=q==="force"?true:q==="off"?false:!r,d=document.documentElement;d.setAttribute("data-motion",on?"on":"off");if(location.hash)d.setAttribute("data-hash","")})();</script>`;

export const MOTION_CSS = `
:root{--ease:cubic-bezier(0.42,0,0.58,1)}
html[data-motion=on]:not([data-hash]) body>*:not(script){animation:tk-page 1s var(--ease)}
@keyframes tk-page{from{opacity:0}to{opacity:1}}
html[data-motion=on] [data-r]:not(.r-in){opacity:0;transform:translateY(16px)}
html[data-motion=on] [data-r].r-in{transition:opacity 1s var(--ease),transform 1s var(--ease);transition-delay:var(--d,0s)}
a,button,summary{transition:color .25s var(--ease),background-color .25s var(--ease),border-color .25s var(--ease),opacity .25s var(--ease),transform .25s var(--ease)}
`;

export const MOTION_JS = `<script>(function(){
var root=document.documentElement;if(root.getAttribute("data-motion")!=="on")return;
var els=[].slice.call(document.querySelectorAll("[data-r]"));
function show(list){list.sort(function(a,b){return a.compareDocumentPosition(b)&4?-1:1});
list.forEach(function(el,i){el.style.setProperty("--d",Math.min(i*0.125,0.75)+"s");el.classList.add("r-in");
el.addEventListener("transitionend",function h(e){if(e.target!==el)return;el.style.removeProperty("--d");el.removeEventListener("transitionend",h)})})}
if(!("IntersectionObserver" in window)){show(els);return}
var io=new IntersectionObserver(function(entries){var list=[];entries.forEach(function(e){if(e.isIntersecting){list.push(e.target);io.unobserve(e.target)}});if(list.length)show(list)},{rootMargin:"0px 0px -6% 0px"});
els.forEach(function(el){io.observe(el)});
setTimeout(function(){var vh=innerHeight;var list=els.filter(function(el){if(el.classList.contains("r-in"))return false;var b=el.getBoundingClientRect();return b.bottom>0&&b.top<vh});list.forEach(function(el){io.unobserve(el)});if(list.length)show(list)},2500);
})();</script>`;

export const BASE_CSS = `
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%;scroll-behavior:auto}
body{margin:0;overflow-x:hidden}
img,svg{display:block;max-width:100%}
h1,h2,h3,h4,p,figure,ul,ol,dl,dd{margin:0}
ul,ol{padding:0;list-style:none}
a{color:inherit}
:focus-visible{outline:2px solid currentColor;outline-offset:3px}
.mk{display:block;background:currentColor;-webkit-mask:var(--m) center/contain no-repeat;mask:var(--m) center/contain no-repeat}
.mk-word{--m:var(--wordmark);aspect-ratio:516/157}
.mk-mono{--m:var(--monogram);aspect-ratio:450/359}
.lockup{display:flex;align-items:center;gap:.9em}
.lockup .mk-mono{height:1.35em;width:auto}
.lockup .rule{width:1px;align-self:stretch;background:currentColor;opacity:.4}
.lockup .mk-word{height:1em;width:auto}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
`;

export const LOGO_VARS = `:root{--wordmark:url(${IMG.wordmark});--monogram:url(${IMG.monogram})}`;

export const lockup = (cls = '') => `<span class="lockup ${cls}" role="img" aria-label="Tuskrr"><span class="mk mk-mono"></span><span class="rule"></span><span class="mk mk-word"></span></span>`;
export const wordmark = (cls = '') => `<span class="mk mk-word ${cls}" role="img" aria-label="Tuskrr"></span>`;
export const monogram = (cls = '') => `<span class="mk mk-mono ${cls}" role="img" aria-label="Tuskrr monogram"></span>`;

// The badge treatment seen on STRATA, CONTOUR and TRAVERSE: the S picked out in gold.
export const goldS = (cls = '') => `<span class="gs ${cls}" role="img" aria-label="Tuskrr"><span class="mk mk-word"></span><span class="mk mk-word gs-s" aria-hidden="true"></span></span>`;
export const GOLD_S_CSS = `.gs{position:relative;display:block}.gs .mk{width:100%;height:auto}.gs .gs-s{position:absolute;inset:0;color:var(--gold-s);clip-path:inset(0 54.4% 0 34.6%)}`;

export function page({ title, description, css, body, fonts }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<meta name="robots" content="noindex">
${MOTION_HEAD}
<style>${fonts}${LOGO_VARS}${BASE_CSS}${MOTION_CSS}${css}</style>
</head>
<body>
${body}
${MOTION_JS}
</body>
</html>
`;
}

export const NOT_FINAL = [
  'Product images are the renders supplied by Tuskrr, shown as they are. They are not final photography.',
  'City scenes on these pages are drawn stand-ins, not photography. The real shoot should be in Indian cities with Indian models. The moodboard photos in the PDF are reference only and are not used, because we do not hold the rights to them.',
  'Anything marked "to confirm" is a placeholder: laptop sizes, warranty, returns, cash on delivery and gifting dates.',
  'Initials embossing is shown as a custom order, as confirmed. Lead time and price are still to confirm.',
  'The logo is cut from the supplied JPEG files. Vector artwork is needed before anything goes to print or to the website.',
  '"Arrive like you mean it." needs a trademark search (IP India) before it is printed.',
  'Type choices are proposals. Every font shown is free for commercial use (SIL Open Font License).',
  'Voice samples illustrate tone. They are not approved copy.',
];

// A drawn city skyline: blocks of varying height with a few lit windows.
export function skylineSVG({ w = 1440, h = 360, seed = 4, fill = '#000', lit = '#fff', litRate = 0.12, cls = '' }) {
  const r = rng(seed);
  let x = 0, blocks = '', wins = '';
  while (x < w) {
    const bw = 34 + r() * 70, bh = h * (0.28 + r() * 0.62), top = h - bh;
    blocks += `M${r1(x)} ${h}V${r1(top)}H${r1(x + bw)}V${h}Z`;
    for (let wy = top + 12; wy < h - 14; wy += 16) for (let wx = x + 8; wx < x + bw - 10; wx += 13) if (r() < litRate) wins += `M${r1(wx)} ${r1(wy)}h5v7h-5Z`;
    x += bw + 2 + r() * 6;
  }
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMax slice" aria-hidden="true" focusable="false"><path d="${blocks}" fill="${fill}"/><path d="${wins}" fill="${lit}"/></svg>`;
}

// Sharp lines, wild heart: evenly spaced straight lines with one that goes its own way.
export function wildLinesSVG({ w = 600, h = 800, n = 11, wild = 7, seed = 9, cls = '' }) {
  const nz = noise2(seed), gap = w / (n + 1);
  let straight = '', wl = '';
  for (let i = 1; i <= n; i++) {
    const x = r1(i * gap);
    if (i !== wild) { straight += `M${x} 0V${h}`; continue; }
    const pts = [];
    for (let k = 0; k <= 80; k++) {
      const t = k / 80, amp = Math.sin(t * Math.PI) * gap * 1.6;
      pts.push(r1(x + (fbm(nz, t * 3.2, 0.3, 4) - 0.5) * 2 * amp) + ' ' + r1(t * h));
    }
    wl = 'M' + pts.join('L');
  }
  return `<svg class="${cls}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true" focusable="false"><path d="${straight}" fill="none" stroke="currentColor" stroke-width="1.5" vector-effect="non-scaling-stroke"/><path class="wild" d="${wl}" fill="none" stroke-width="3" stroke-linecap="round" vector-effect="non-scaling-stroke"/></svg>`;
}
