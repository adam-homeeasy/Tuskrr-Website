// Writes site/index.html and site/404.html from content.mjs.
// Run: node site/src/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TAGLINE, PRODUCTS, HERO, PRELOADER_PILLS, INSIDE, DAY, LINES, GIFTS, NAV } from './content.mjs';

const SITE = join(dirname(fileURLToPath(import.meta.url)), '..');
const svg = (f) => readFileSync(join(SITE, 'assets/logo', f), 'utf8').replace('<svg ', '<svg aria-hidden="true" focusable="false" ');
const WORDMARK = svg('wordmark.svg');
const MONOGRAM = svg('monogram.svg');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const P = Object.fromEntries(PRODUCTS.map((p) => [p.id, p]));
const two = (n) => String(n).padStart(2, '0');
const img = (id, cls = '', lazy = true) => `<img class="${cls}" src="assets/img/${id}.webp" alt="${esc(P[id].alt)}"${lazy ? ' loading="lazy"' : ''} decoding="async">`;
const eyebrow = ([n, t], cls = '') => `<p class="eyebrow ${cls}"><b>${n}</b><i>/</i><span>${esc(t)}</span></p>`;

const ICONS = {
  // Line icons, drawn on with stroke-dashoffset. 48 × 48, 1.25 stroke.
  leather: '<path d="M14 8c3 2 6 2 10 0 4 2 7 2 10 0 2 4 5 6 8 7-2 5-2 9 0 14-3 2-5 5-5 9-4 0-8 2-10 4-3-2-6-4-10-4 0-4-2-7-5-9 2-5 2-9 0-14 3-1 5-3 7-7Z"/><path d="M19 17v14M24 15v18M29 17v14"/>',
  warranty: '<path d="M24 6l14 5v11c0 9-6 16-14 20-8-4-14-11-14-20V11l14-5Z"/><path d="M18 24l4 4 8-9"/>',
  initials: '<path d="M8 14h24l8 10-8 10H8V14Z"/><circle cx="33" cy="24" r="2"/><path d="M14 28l3-8 3 8M15 26h4M23 20v8h4"/>',
  cod: '<path d="M8 17l16-8 16 8v16l-16 8-16-8V17Z"/><path d="M8 17l16 8 16-8M24 25v16"/><path d="M29 30h6M29 33h6M32 30c2 0 2 3 0 3l3 4"/>',
};

const head = (title, desc) => `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#EFE9E1">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:type" content="website">
<link rel="icon" href="assets/logo/favicon.svg" type="image/svg+xml">
<link rel="preload" href="assets/fonts/instrumentsans-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="assets/fonts/instrumentserif-400.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="css/site.css">
<noscript><style>.preloader,.cursor{display:none}.hero-col>*,.chapters,.st-rail{opacity:1!important}.st-intro{visibility:hidden}</style></noscript>
</head>`;

const nav = `<header class="nav" data-nav>
  <a class="nav-logo" href="#top" data-scroll aria-label="Tuskrr, back to the top"><span class="mono">${MONOGRAM}</span><span class="wm">${WORDMARK}</span></a>
  <nav class="nav-links" aria-label="Sections">${NAV.map(([t, h]) => `<a href="${h}" data-scroll data-magnetic>${t}</a>`).join('')}</nav>
  <div class="nav-right">
    <a class="nav-shop" href="#buy" data-scroll>Shop <span class="arr" aria-hidden="true">→</span></a>
    <button class="nav-cart" type="button" data-cart-open aria-label="Your bag, 0 items"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8Z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></svg><span class="badge" data-cart-count>0</span></button>
  </div>
</header>`;

const preloader = `<div class="preloader" data-preloader aria-hidden="true">
  <div class="pl-pills">${PRELOADER_PILLS.map((p) => `<span class="pill pill-${p.tone}" data-pop style="left:${p.x};top:${p.y};font-size:${p.size}px"><i style="background:${p.c}"></i>${esc(p.text)}</span>`).join('')}</div>
  <div class="pl-mark" data-pl-mark><span class="pl-mark-inner" data-pl-inner>${WORDMARK}</span></div>
  <div class="pl-foot"><span class="pl-count" data-pl-count>000</span><span class="pl-bar"><i data-pl-bar></i></span></div>
</div>`;

const hero = `<section id="hero" class="hero" data-hero>
  <div class="hero-dark" data-hero-dark>
    <div class="door" aria-hidden="true"></div>
    <div class="bloom bloom-soft hero-glow" data-hero-glow style="--c:#F6E3BD" aria-hidden="true"></div>
    <div class="hero-bag" data-hero-bag><div class="tilt" data-tilt><div class="bob" data-bob>${img('ridge', '', false)}</div></div></div>
    <div class="hero-col" data-hero-col>
      ${eyebrow(HERO.eyebrow, 'on-dark')}
      <h2 class="hero-title">${esc(HERO.title)}</h2>
      <span class="rule" aria-hidden="true"></span>
      <p class="hero-body">${esc(HERO.body)}</p>
      <ul class="hero-stats">${HERO.stats.map(([a, b]) => `<li><b>${a}</b> ${b}</li>`).join('')}</ul>
    </div>
  </div>
  <div class="hero-light" data-hero-light>
    <h1 class="hero-mark" data-hero-mark><span class="sr-only">Tuskrr. ${esc(TAGLINE)}</span>${WORDMARK}</h1>
    <p class="hero-tag" aria-hidden="true">Arrive like<br>you mean it.</p>
    <div class="scroll-cue" data-cue aria-hidden="true"><span>Scroll</span><span class="pill-out"><i data-cue-dot></i></span></div>
    <p class="hero-meta" aria-hidden="true">${HERO.meta.map(esc).join('<br>')}</p>
  </div>
  <div class="hero-ring" data-hero-ring aria-hidden="true"></div>
</section>`;

const collection = `<section id="collection" class="stage-sec" data-stage>
  <div class="stage">
    <div class="stage-head">
      ${eyebrow(['02', 'The collection'])}
      <h2 class="stage-title" data-split-chars>Six bags. One line.</h2>
    </div>
    <p class="stage-count" aria-hidden="true"><span data-count>1</span> / ${PRODUCTS.length}</p>
    <div class="stage-glows" aria-hidden="true">${PRODUCTS.map((p, i) => `<div class="bloom bloom-strong" data-glow="${i}" style="--c:${p.glow}"></div>`).join('')}</div>
    <div class="stage-ghosts" aria-hidden="true">${PRODUCTS.map((p, i) => `<span data-ghost="${i}">${two(i + 1)}</span>`).join('')}</div>
    <p class="stage-side" aria-hidden="true">${PRODUCTS.map((p, i) => `<span data-side="${i}">${p.inspired}</span>`).join('')}</p>
    <div class="slides" data-slides>
      ${PRODUCTS.map((p, i) => `<article class="slide${i ? '' : ' on'}" data-slide="${i}" style="--c:${p.glow}" aria-label="${p.name.toUpperCase()}">
        <div class="slide-art">${img(p.id, 'bag', i > 1)}</div>
        <div class="slide-copy" data-copy>
          <p class="lbl" data-line>TUSKRR.<b>${two(i + 1)}</b><span>${esc(p.type)}</span></p>
          <h3 class="p-name" data-name>${p.name}<span class="dot" style="color:${p.glow}">.</span></h3>
          <p class="p-insp" data-line>Inspired by ${p.inspired}</p>
          <p class="p-story" data-line>${esc(p.story)}</p>
          <dl class="p-spec" data-line>
            <div><dt>Finish</dt><dd>${esc(p.finish)}</dd></div>
            <div><dt>Fits</dt><dd>${esc(p.fits)} <span class="smp">sample</span></dd></div>
          </dl>
          <p class="p-line" data-line>${esc(p.line)}</p>
        </div>
      </article>`).join('\n      ')}
    </div>
    <div class="stage-dots" data-dots>${PRODUCTS.map((p, i) => `<button type="button" data-dot="${i}" aria-label="Show ${p.name.toUpperCase()}">${two(i + 1)}</button>`).join('')}</div>
    <p class="swipe-hint" aria-hidden="true">Swipe</p>
  </div>
</section>`;

const inside = `<section id="inside" class="inside" data-inside>
  <div class="in-stage">
    <div class="in-head">
      ${eyebrow(['03', 'What comes with it'], 'on-dark')}
      <h2 class="in-title">Inside.</h2>
      <div class="in-pills" data-pills>${INSIDE.map((s, i) => `<button type="button" data-pill="${i}">${esc(s.name)}</button>`).join('')}</div>
    </div>
    <div class="in-halo bloom bloom-soft" data-halo style="--c:${INSIDE[0].halo}" aria-hidden="true"></div>
    <div class="steps" data-steps>
      ${INSIDE.map((s, i) => `<article class="step${i ? '' : ' on'}" data-step="${i}" style="--c:${s.halo}">
        <div class="step-art">${img(s.bag, 'bag')}</div>
        <div class="step-name">
          <h3 class="in-name" data-name>${esc(s.name)}</h3>
          <svg class="in-icon" viewBox="0 0 48 48" aria-hidden="true" data-icon>${ICONS[s.id]}</svg>
          <p class="in-sub" data-line>${esc(s.sub)}</p>
        </div>
        <div class="step-info">
          <p class="in-no" data-line>${two(i + 1)} / ${two(INSIDE.length)}</p>
          <p class="in-body" data-line>${esc(s.body)}</p>
          <dl class="in-rows" data-line>${s.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
          <div class="meter" data-line data-meter data-from="${s.meter.from}" data-to="${s.meter.to}" data-of="${s.meter.of}" data-fmt="${s.id}">
            <span class="meter-k">${esc(s.meter.label)}</span>
            <span class="meter-v" data-meter-v>${esc(s.meter.fmt(s.meter.to))}</span>
            <span class="meter-bar"><i data-meter-bar style="transform:scaleX(${s.meter.to / s.meter.of})"></i></span>
          </div>
        </div>
      </article>`).join('\n      ')}
    </div>
    <p class="in-caption" aria-hidden="true">Four promises. No small print.</p>
  </div>
</section>`;

const frame = (c, i) => `<figure class="ch-frame">
  <div class="frame" style="--sx:${c.slit[0]}%;--sw:${c.slit[1]}%">
    <div class="f-strata" aria-hidden="true"></div>
    <div class="f-slit" aria-hidden="true"></div>
    <div class="f-floor" aria-hidden="true"></div>
    <div class="f-spill" aria-hidden="true"></div>
    ${img(c.bag, 'f-bag')}
  </div>
  <figcaption>Fig. ${two(i + 1)} · ${c.bag.toUpperCase()}, ${c.time}</figcaption>
</figure>`;

const day = `<section id="day" class="day" data-day>
  <div class="story">
    <div class="st-ghosts" aria-hidden="true">${DAY.chapters.map((c, i) => `<span data-hour="${i}">${c.hour}</span>`).join('')}</div>
    <div class="st-intro" data-intro>
      ${eyebrow(DAY.eyebrow)}
      <h2 class="st-title" data-split-lines>${esc(DAY.title)}</h2>
      <p class="st-lede" data-illuminate>${esc(DAY.intro)}</p>
    </div>
    <div class="chapters" data-chapters>
      ${DAY.chapters.map((c, i) => `<article class="chapter${i ? '' : ' on'}" data-chapter="${i}">
        <div class="ch-copy" data-copy>
          <p class="eyebrow" data-line><b>Chapter ${two(i + 1)}</b><i>/</i><span>${c.time}</span></p>
          <h3 class="ch-title" data-line>${esc(c.title)}</h3>
          <p class="ch-body" data-line>${esc(c.body)}</p>
        </div>
        ${frame(c, i)}
      </article>`).join('\n      ')}
    </div>
    <div class="st-rail" aria-hidden="true">
      <ol>${DAY.chapters.map((c, i) => `<li data-rail="${i}">${c.time}</li>`).join('')}</ol>
      <span class="rail-line"><i data-rail-fill></i></span>
    </div>
  </div>
</section>`;

const names = PRODUCTS.map((p) => `<span>${p.name}</span><b aria-hidden="true">·</b>`).join('');
const insp = PRODUCTS.map((p) => `<span>${p.inspired}</span><b aria-hidden="true">/</b>`).join('');
const lines = `<section id="lines" class="lines" data-lines>
  <div class="wrap">
    ${eyebrow(LINES.eyebrow, 'on-dark')}
    <h2 class="loud lines-title" data-split-lines>${esc(LINES.title)}</h2>
    <p class="lines-sub" data-reveal>${esc(LINES.sub)}</p>
    <div class="quotes">${LINES.quotes.map(([q, n, t]) => `<figure class="quote" data-quote><blockquote><p data-split-lines>${esc(q)}</p></blockquote><figcaption>${n} · campaign line, inspired by ${t}</figcaption></figure>`).join('')}</div>
  </div>
  <div class="marquees" aria-hidden="true">
    <div class="marquee m-solid"><div class="track" data-track="0"><div class="set">${names}</div><div class="set">${names}</div></div></div>
    <div class="marquee m-outline"><div class="track" data-track="1"><div class="set">${insp}</div><div class="set">${insp}</div></div></div>
  </div>
</section>`;

const card = (p, i) => `<article class="card" data-card="${p.id}">
  <div class="card-img">${img(p.id)}</div>
  <div class="card-body">
    <p class="card-no">${two(i + 1)} · ${esc(p.type)}</p>
    <h3 class="card-name">${p.name.toUpperCase()}</h3>
    <p class="card-line">${esc(p.line)}</p>
    <div class="toggle" role="radiogroup" aria-label="${p.name.toUpperCase()} options">
      <button type="button" role="radio" aria-checked="true" data-opt="plain">As it is</button>
      <button type="button" role="radio" aria-checked="false" data-opt="initials">With initials</button>
    </div>
    <p class="card-note" data-card-note>Ships ready. Cash on delivery.</p>
    <p class="card-price"><span>Price at launch</span><em>₹5,000 to ₹7,000 range</em></p>
    <button type="button" class="btn-add" data-add="${p.id}"><span class="t-add">Add to bag</span><span class="t-done" aria-hidden="true">Added ✓</span></button>
  </div>
</article>`;

const shop = `<section id="shop" class="shop" data-shop>
  <div class="wrap">
    ${eyebrow(GIFTS.eyebrow)}
    <h2 class="loud shop-title" data-split-lines>${esc(GIFTS.title)}</h2>
    <p class="shop-sub" data-reveal>${esc(GIFTS.sub)}</p>
    <div class="gifts">${GIFTS.columns.map(([h, rows]) => `<div class="gcol" data-gcol>
      <h3>${esc(h)}</h3>
      <ul>${rows.map(([t, note, bag]) => `<li data-grow><a href="#buy-${bag}" data-gift="${bag}" data-preview="${bag}"><span class="g-t">${esc(t)}</span><span class="g-n">${esc(note)}</span><span class="g-b">${bag.toUpperCase()}</span><span class="g-arr" aria-hidden="true">→</span></a></li>`).join('')}</ul>
    </div>`).join('')}</div>
    <div class="or" id="buy"><span class="or-rule" data-rule></span><span>Or order direct</span><span class="or-rule" data-rule></span></div>
    <div class="cards">${PRODUCTS.map((p, i) => `<div id="buy-${p.id}" class="card-wrap">${card(p, i)}</div>`).join('')}</div>
  </div>
  <div class="preview" data-preview-box aria-hidden="true">${PRODUCTS.map((p) => `<img src="assets/img/${p.id}.webp" alt="" data-pv="${p.id}" loading="lazy">`).join('')}</div>
</section>`;

const footer = `<footer class="footer">
  <div class="wrap">
    <div class="f-news">
      <p class="eyebrow"><b>Newsletter</b></p>
      <h2 class="f-title" data-split-lines>Get told the day your bag ships.</h2>
      <form class="f-form" data-notify novalidate>
        <label class="sr-only" for="f-email">Email address</label>
        <input id="f-email" type="email" name="email" placeholder="Email address" autocomplete="email" required>
        <button type="submit">Sign up</button>
        <p class="f-msg" role="status" data-msg></p>
      </form>
    </div>
    <div class="f-grid">
      <div class="f-brand"><span class="wm">${WORDMARK}</span><p>Genuine leather bags for the person you’re becoming. ${esc(TAGLINE)}</p></div>
      <nav class="f-col" aria-label="Site"><p>Site</p>${NAV.map(([t, h]) => `<a href="${h}" data-scroll>${t}</a>`).join('')}</nav>
      <div class="f-col"><p>Promises</p><span>Genuine leather</span><span>3-year warranty</span><span>Cash on delivery</span><span>Initials in 2 weeks</span></div>
    </div>
    <p class="f-copy">© 2026 Tuskrr. Returns policy and laptop sizes shown are samples until launch.</p>
  </div>
</footer>`;

const cart = `<div class="scrim" data-scrim hidden></div>
<aside class="drawer" data-drawer aria-label="Your bag" aria-hidden="true" tabindex="-1">
  <div class="d-head"><h2>Your bag</h2><button type="button" class="x" data-cart-close aria-label="Close your bag">×</button></div>
  <ul class="d-items" data-items></ul>
  <p class="d-empty" data-empty>Nothing in here yet. The collection is one scroll up.</p>
  <div class="d-foot">
    <ul class="d-trust"><li>Cash on delivery</li><li>3-year warranty</li><li>Free returns within 7 days <span class="smp">sample</span></li></ul>
    <button type="button" class="btn-add" data-checkout>Checkout</button>
  </div>
</aside>
<div class="modal" data-modal role="dialog" aria-modal="true" aria-labelledby="m-title" hidden>
  <div class="m-box">
    <button type="button" class="x" data-modal-close aria-label="Close">×</button>
    <p class="eyebrow"><b>Soon</b></p>
    <h2 id="m-title">Tuskrr opens for orders soon.</h2>
    <p>Leave your email and we’ll tell you the day your bag can ship. Cash on delivery when it does.</p>
    <form class="f-form" data-notify novalidate>
      <label class="sr-only" for="m-email">Email address</label>
      <input id="m-email" type="email" name="email" placeholder="Email address" autocomplete="email" required>
      <button type="submit">Notify me</button>
      <p class="f-msg" role="status" data-msg></p>
    </form>
  </div>
</div>
<div class="cursor" aria-hidden="true"><i class="c-dot" data-c-dot></i><i class="c-ring" data-c-ring></i></div>`;

const scripts = `<script src="vendor/gsap.min.js"></script>
<script src="vendor/ScrollTrigger.min.js"></script>
<script src="vendor/SplitText.min.js"></script>
<script src="vendor/lenis.min.js"></script>
<script src="js/main.js"></script>`;

const index = `${head(`Tuskrr. ${TAGLINE}`, 'Genuine leather bags for the person you’re becoming. Six bags, one line. 3-year warranty, cash on delivery.')}
<body class="is-loading" id="top">
<a class="skip" href="#collection">Skip to the collection</a>
${preloader}
${nav}
<main id="main">
${hero}
${collection}
${inside}
${day}
${lines}
${shop}
</main>
${footer}
${cart}
${scripts}
</body>
</html>
`;

const notFound = `${head('Wrong door. Tuskrr', 'This page does not exist.')}
<body class="nf">
<main class="nf-main">
  <div class="bloom bloom-soft" style="--c:#F6E3BD" aria-hidden="true"></div>
  <div class="door" aria-hidden="true"></div>
  <p class="eyebrow on-dark"><b>404</b><i>/</i><span>Not found</span></p>
  <h1>Wrong door.</h1>
  <a class="btn-home" href="./">Try this one</a>
</main>
</body>
</html>
`;

writeFileSync(join(SITE, 'index.html'), index);
writeFileSync(join(SITE, '404.html'), notFound);
writeFileSync(join(SITE, 'assets/logo/favicon.svg'), readFileSync(join(SITE, 'assets/logo/monogram.svg'), 'utf8').replace('fill="currentColor"', 'fill="#131110"'));

// Single-file build: CSS, JS, fonts and images inlined into tuskrr.html, which
// makes no requests at all. Each image is embedded once and assigned to every
// <img data-img> by a tiny script, rather than repeated per use.
const b64 = (p) => readFileSync(join(SITE, p)).toString('base64');
const css = readFileSync(join(SITE, 'css/site.css'), 'utf8')
  .replace(/url\(\.\.\/assets\/fonts\/([\w-]+\.woff2)\)/g, (_, f) => `url(data:font/woff2;base64,${b64('assets/fonts/' + f)})`);
const imgs = Object.fromEntries(PRODUCTS.map((p) => [p.id, `data:image/webp;base64,${b64(`assets/img/${p.id}.webp`)}`]));
const inline = (f) => `<script>${readFileSync(join(SITE, f), 'utf8').replace(/<\/script/gi, '<\\/script')}</script>`;
const single = index
  .replace(/<link rel="preload"[^>]*>\n/g, '')
  .replace('<link rel="stylesheet" href="css/site.css">', () => `<style>${css}</style>`)
  .replace('href="assets/logo/favicon.svg"', () => `href="data:image/svg+xml;base64,${b64('assets/logo/favicon.svg')}"`)
  .replace(/src="assets\/img\/(\w+)\.webp"/g, 'data-img="$1"')
  .replace(/<script src="vendor\/gsap\.min\.js"><\/script>/, () => `<script>window.TUSKRR_IMG=${JSON.stringify(imgs)};document.querySelectorAll('img[data-img]').forEach(function(i){i.src=TUSKRR_IMG[i.dataset.img]})</script>\n${inline('vendor/gsap.min.js')}`)
  .replace(/<script src="(vendor\/[\w.]+|js\/main\.js)"><\/script>/g, (_, f) => inline(f));
if (/(src|href)="(?!data:|#|\.\/)[^"]*\.(css|js|webp|woff2|svg)"/.test(single)) throw new Error('single file still references an external file');
writeFileSync(join(SITE, 'tuskrr.html'), single);
console.log('wrote index.html, 404.html, favicon.svg, tuskrr.html (' + Math.round(single.length / 1024) + ' KB)');
