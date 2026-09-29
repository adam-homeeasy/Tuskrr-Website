# Ströms Man: build recipes for the signature effects

Numbers below are from the pack (see teardown.md for the evidence label of each). Where I add something the site does not have, it is marked **addition**. No GSAP or Lenis is needed: the site uses none, and every recipe here is plain HTML, CSS and a little JavaScript. Swiper is the one library (from a CDN or npm).

Shared tokens used by all recipes:

```css
:root {
  --paper: #fdfcfb;      /* --background_color */
  --paper-2: #efe9e3;    /* --background_color_2 */
  --ink: #231f20;        /* --primary_text */
  --grey-1: #6c645c;     /* --primary_gray */
  --grey-2: #a39c94;     /* --secondary_gray */
  --grey-3: #d3ccc4;     /* --tertiary_gray */
  --accent: #9b6a45;     /* --secondary_accent */
  --focus: #1e242a;      /* --loader_color */
}
body { margin: 0; background: var(--paper); color: var(--ink); font-family: "YourLightGrotesque", sans-serif; font-weight: 300; font-size: .875rem; line-height: 130%; letter-spacing: 0; }
```

---

## 1. Zero-gap editorial photo grid

**What it is.** Full-bleed photo tiles butted together with no gap. A hero at 24:10, a pair of 5:4 tiles, a pair of 1:1 tiles, a 4-up row and a 3-up row of 4:5 tiles. Each tile is one big link with a small caption and, on desktop, a slow zoom on hover.

**How to build.** One CSS grid class does the strips. The hero and pairs change the aspect ratio only.

```html
<section class="tiles tiles--hero">
  <a class="tile" href="/collections/offer" style="--r: 4/5; --r-d: 24/10">
    <img src="hero.jpg" alt="" loading="eager" fetchpriority="high">
    <div class="tile__copy tile__copy--center">
      <p class="h1">Campaign title</p>
      <p class="p3">One line of offer text</p>
      <span class="cta">SHOP NOW <svg><!-- 18px arrow --></svg></span>
    </div>
  </a>
</section>
```

```css
/* Source: section-collection-showcase.css and the inline style block of each section */
.tiles { display: grid; grid-template-columns: repeat(1, 1fr); }              /* 1024 and below */
@media (min-width: 1025px) {
  .tiles { grid-template-columns: repeat(auto-fit, minmax(324px, 1fr)); }     /* no gap */
}
.tile { position: relative; display: block; overflow: hidden; aspect-ratio: var(--r); color: var(--paper); text-decoration: none; }
@media (min-width: 1025px) { .tile { aspect-ratio: var(--r-d, var(--r)); } }
.tile img { width: 100%; height: 100%; object-fit: cover; display: block; }
.tile__copy { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; align-items: flex-start; padding: 1rem; pointer-events: none; }
.tile__copy--center { justify-content: center; align-items: center; text-align: center; }
@media (min-width: 1025px) {
  .tile__copy { padding: 1.25rem; }
  .tile img { transition: transform .4s ease; }
  .tile:hover img { transform: scale(1.05); }
}
```

Section ratios and counts as measured/source read:

| Row | Desktop ratio | Phone ratio | Tiles | Desktop size at 1440 |
|---|---|---|---|---|
| Hero | 24/10 | 4/5 | 1 | 1440 x 600 |
| Gallery (JEANS, TRÖJOR / BYXOR, JACKOR) | 5/4 | 4/5 | 2 per row, gap 1rem desktop, .375rem phone | 594 and 586 tall (includes some top padding) |
| Pair (Nyheter, Höstkollektion) | 4/4 (1:1) | 4/5 | 2 | 720 x 720 |
| Brands | 4/5 | 4/5 | 4 (auto-fit gives 4 columns at 1440) | 360 x 450 |
| Departments | 4/5 | 4/5 | 3 | 480 x 600 |

The gallery rows are a separate 2-column grid: `grid-template-columns: repeat(2, minmax(0, 1fr)); gap: .375rem;` and `gap: 1rem` from 1025.

**Caption type.** Title 18/22 Regular (`u-h1`); sub line 12/16 Light; call-to-action 14/18 Regular with an 18 px arrow.

**Cost.** Low. About 40 lines of CSS. The cost is photography: the site ships 53 images, 5135 KB uncompressed.

**Assets to replace.** All photography (models, clothing, locations), the wording, the arrow icon if you do not draw your own. **Addition:** put a scrim under white captions, for example `.tile::after { content:""; position:absolute; inset:0; background:linear-gradient(to top, rgba(0,0,0,.35), transparent 60%); }`. The Ströms tiles have none (measured: no overlay element on the page), which risks poor contrast on light photos.

---

## 2. Product card with quiet hover reveal, in a 4-up slider

**What it is.** A 4:5 product photo on a #f5f5f5 backdrop. At rest you see only the photo, the "NYHET" chip, brand, price and name. On hover or keyboard focus: a column of colour dots appears at top left, a save (heart or bookmark) button at top right, arrows at the image edges, and the name line is replaced by the size list. The card images can have 2 to 3 photos with a hairline pager.

**How to build.**

```html
<article class="card">
  <a class="card__link" href="/products/x">
    <div class="card__media">
      <span class="card__chip">NYHET</span>
      <ul class="card__dots"><li style="--c:#62721a"></li></ul>
      <button class="card__save" aria-label="Save product">…</button>
      <div class="swiper card__swiper"> … 4:5 images … </div>
      <div class="card__pager"></div>
    </div>
    <div class="card__info">
      <div class="row"><span class="brand">BARBOUR</span><span class="price">4 499 kr</span></div>
      <span class="name">Product name</span>
      <div class="sizes" hidden><button>46</button><button>48</button>…</div>
    </div>
  </a>
</article>
```

```css
/* Source: component-product_card.css */
.card__media { position: relative; aspect-ratio: 4/5; background: #f5f5f5; }
.card__chip { position: absolute; left: 0; bottom: 0; padding: 1px 4px; background: rgba(239,233,227,.7); color: #231f20; font: 400 12px/16px var(--sans); }
.card__dots, .card__save, .card__arrow { opacity: 0; visibility: hidden; pointer-events: none; transition: opacity .3s ease-in-out, visibility .3s ease-in-out; }
.card__dots { position: absolute; top: .625rem; left: .625rem; display: flex; flex-direction: column; gap: .375rem; }
.card__save { position: absolute; top: .625rem; right: .625rem; background: none; border: 0; padding: 0; }
.card:hover .card__dots, .card:focus-within .card__dots,
.card:hover .card__save, .card:focus-within .card__save,
.card__media:hover .card__arrow, .card__media:focus-within .card__arrow { opacity: 1; visibility: visible; pointer-events: auto; }
@media (hover: none) { .card__save { opacity: 1; visibility: visible; pointer-events: auto; } }
/* dots: 10px circle */
.dot { width: .625rem; height: .625rem; border-radius: 50%; background: var(--c); border: 0; transition: border-color .2s ease, background-color .2s ease; }
.dot:hover, .dot[aria-checked="true"] { border: 1px solid var(--ink); background: transparent; }  /* inner 5px dot: ::before grows from 0 to .3125rem in .2s */
/* name swaps to sizes: instant, no fade */
.card__info .sizes { display: none; }
.card:hover .name, .card:focus-within .name { display: none; }
.card:hover .sizes, .card:focus-within .sizes { display: block; }
.sizes button { background: none; border: 0; padding: 0; color: var(--grey-1); font: 300 12px/16px var(--sans); transition: color .2s ease, font-weight .2s ease; }
.sizes button:hover { font-weight: 400; }
.sizes button:disabled { color: var(--grey-2); }
/* pager: hairlines */
.card__pager .swiper-pagination-bullet { width: .375rem; height: .0625rem; border-radius: 0; margin: 0 .125rem; }
```

The 4-up slider around the cards (measured settings from `data-swiper-settings`):

```js
new Swiper('.product-swiper', {
  slidesPerView: 1.265, spaceBetween: 6,
  slidesOffsetBefore: 16, slidesOffsetAfter: 16,
  rewind: true,
  mousewheel: { forceToAxis: true },
  scrollbar: { el: '.product-swiper .swiper-scrollbar', draggable: true },
  navigation: { nextEl: '.next', prevEl: '.prev' },
  breakpoints: { 1025: { slidesPerView: 4, spaceBetween: 16, slidesOffsetBefore: 0, slidesOffsetAfter: 0 } }
});
/* Each card's own image swiper: */
new Swiper('.card__swiper', {
  slidesPerView: 1, spaceBetween: 8, loop: true, nested: true, grabCursor: true,
  pagination: { el: '.card__pager', clickable: true },
  breakpoints: { 1025: { simulateTouch: false, allowTouchMove: false, mousewheel: false } }
});
```

Scrollbar row: track #d3ccc4, thumb #231f20, width `calc(100% - 4.25rem)` from 1025 so the two 18 px arrows sit at the ends. Colour dots are desktop only (hidden on phone and tablet).

**Cost.** Medium. The CSS is short; the work is the card data (colour siblings, sizes) and the cart hook. The site's quick-add drawer, size drawer and notify-me drawer are further work and are not part of this recipe.

**Assets to replace.** Product photography on a #f5f5f5 studio backdrop, brand names, prices, the save icon, the arrow icons. **Additions:** override the default Swiper blue on the active pager line (the site leaks #007aff); give the save button visible text for screen readers; use a bag-appropriate detail (strap length or colour) in place of sizes.

---

## 3. Shoppable lookbook

**What it is.** A tall photo at the left half with three small dot hotspots on it. A copy block (heading, paragraph, text link) and a one-product slider sit at the right. Clicking a hotspot moves the slider to that product; moving the slider lights the matching hotspot.

**How to build.**

```html
<section class="lookbook" data-lookbook>
  <div class="lookbook__media" style="aspect-ratio:4/5">
    <img src="look.jpg" alt="">
    <button class="hotspot" data-id="a" style="--x:29%;--y:38%" aria-label="Show Firenze blazer"></button>
    <button class="hotspot" data-id="b" style="--x:47%;--y:56%" aria-label="Show polo"></button>
    <button class="hotspot" data-id="c" style="--x:22%;--y:78%" aria-label="Show trousers"></button>
  </div>
  <div class="lookbook__side">
    <h2 class="h2">Heading</h2><p class="p2">Copy</p><a class="cta">SEE THE COLLECTION →</a>
    <div class="swiper lookbook__slider"> <div class="swiper-wrapper"> … slides with data-id … </div> <div class="swiper-scrollbar"></div> </div>
  </div>
</section>
```

```css
/* Source: section-lookbook.css */
.lookbook { display: flex; gap: 2rem; flex-direction: column; }
@media (min-width: 1025px) { .lookbook { flex-direction: row; gap: 3rem; align-items: stretch; } .lookbook > * { flex: 1 1 0; } }
.lookbook__media { position: relative; width: 100%; isolation: isolate; }
.hotspot { position: absolute; left: var(--x); top: var(--y); transform: translate(-50%, -50%); background: transparent; border: 0; padding: 0; cursor: pointer; }
.hotspot::before { content: ""; position: absolute; left: 50%; top: 50%; width: 1.5rem; height: 1.5rem; transform: translate(-50%, -50%); border-radius: 50%; background: var(--paper); opacity: .4; transition: opacity .2s ease-in-out; }
.hotspot::after  { content: ""; position: absolute; left: 50%; top: 50%; width: .375rem; height: .375rem; transform: translate(-50%, -50%); border-radius: 50%; border: .6px solid var(--ink); box-sizing: border-box; opacity: .9; transition: border-color .2s ease-in-out, background-color .2s ease-in-out; }
.hotspot.is-active { cursor: default; }
.hotspot.is-active::before { opacity: 1; }
.hotspot.is-active::after { background: var(--ink); opacity: 1; }
.hotspot:not(.is-active):hover::after { background: var(--accent); border-color: var(--accent); opacity: 1; }
.hotspot:not(.is-active):hover::before { opacity: 1; }
.lookbook__slider { max-width: min(328px, 100%); aspect-ratio: 328 / 464; margin-inline: auto; }   /* phone: max 235px, 235/392 */
@media (prefers-reduced-motion: reduce) { .hotspot::before, .hotspot::after { transition: none; } }
```

```js
// Source: class LookbookSection (global.min.js), simplified
const slider = new Swiper('.lookbook__slider', { slidesPerView: 1, spaceBetween: 0,
  scrollbar: { el: '.lookbook__slider .swiper-scrollbar', draggable: true } });
const ids = [...document.querySelectorAll('.lookbook__slider .swiper-slide')].map(s => s.dataset.id);
const spots = [...document.querySelectorAll('.hotspot')];
const setActive = id => spots.forEach(h => h.classList.toggle('is-active', h.dataset.id === id));
spots.forEach(h => h.addEventListener('click', () => {
  const i = ids.indexOf(h.dataset.id); if (i > -1) { slider.slideTo(i); setActive(h.dataset.id); }
}));
slider.on('slideChange', () => setActive(ids[slider.activeIndex]));
setActive(ids[0]);
```

Hotspot positions are the site's own (measured from the HTML); replace them with yours. Navigation arrows show from 1025 up. The site's overlay is set to "none" here.

**Cost.** Medium. Small JS, plus the photo art direction so the dots sit on real garments.

**Assets to replace.** The photo, the hotspot coordinates, the product data, the copy.

---

## 4. Sticky header, hairline underline draw, and the mega menu

**What it is.** A 50 px sticky bar. Nav links and icons get a 1 px underline that draws in on hover. At 1025 and up, hovering a top item opens a full-width panel of 4 columns, with a 3:4 photo card.

**Header and underline.**

```css
/* Source: base.min.css */
.header { position: sticky; top: 0; z-index: 6; background: var(--paper); color: var(--ink); transition: background-color .2s ease; }
.header__wrapper { display: flex; align-items: center; justify-content: space-between; padding: 0 2.5rem; }  /* 40px; .625rem on phone */
.header-menu-items { display: flex; gap: 2.5rem; }
.hoverLink { position: relative; width: fit-content; text-decoration: none; }
.hoverLink::before { content: ""; position: absolute; left: 0; bottom: -2px; width: 100%; height: 1px; background: currentColor; transform: scaleX(0); transform-origin: bottom right; transition: transform .3s cubic-bezier(.4, 0, .2, 1); }
.hoverLink:hover::before { transform: scaleX(1); }
.hoverLink.is-current::before, .hoverLink[aria-expanded="true"]::before { transform: scaleX(1); transform-origin: bottom left; }
```

```js
// Source: class Header.toggleColor. The site adds and removes classes past 25px of scroll,
// batched with requestAnimationFrame. (No visible style change ships with them on this page.)
let ticking = false;
addEventListener('scroll', () => {
  if (ticking) return; ticking = true;
  requestAnimationFrame(() => { header.classList.toggle('is-scrolled', scrollY > 25); ticking = false; });
}, { passive: true });
```

**Mega menu (desktop only).**

```css
/* Source: desktop-menu.css */
@media (min-width: 1025px) {
  .mega { position: absolute; top: 54px; left: 0; width: 100%; padding: 2.5rem; background: var(--paper);
          max-height: calc(100vh - 28px - 50px); overflow-y: auto; display: none; }
  [aria-expanded="true"] > .mega { display: block; }
  .mega__layout { display: grid; gap: 1rem; min-height: 20rem; grid-template-columns: repeat(4, minmax(0, 1fr)); }
  .mega__link { display: inline-flex; gap: .5rem; align-items: center; color: var(--ink); text-decoration: none; }
  .mega__arrow { opacity: 0; transition: opacity .2s ease; }
  .mega__link:hover .mega__arrow, .mega__link:focus-visible .mega__arrow, .mega__link.is-active .mega__arrow { opacity: 1; }
  .mega__card { position: relative; aspect-ratio: 3/4; min-height: 16rem; overflow: hidden; background: var(--paper-2); color: var(--paper); }
  .mega__card img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
  .mega__card::after { content: ""; position: absolute; inset: 0; background: linear-gradient(to top, #0000008c, #0000); pointer-events: none; }
}
```

```js
// Source: class Header (openMenu, closeMenu, handleDesktopMenuKeydown), simplified
item.addEventListener('mouseenter', open);  item.addEventListener('focusin', open);
item.addEventListener('mouseleave', close); // close all on mouseleave of the panel
panel.addEventListener('keydown', e => {
  if (e.key === 'Escape') { close(); item.focus(); }
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { /* move focus within the column, wrapping */ }
  if (e.key === 'ArrowRight') { /* activate the next level for the focused item */ }
  if (e.key === 'ArrowLeft')  { /* go back one level */ }
});
// open(): set aria-expanded="true", lock page scroll (the site uses body-scroll-lock), close siblings.
// close(): reset panels, aria-expanded="false", unlock scroll.
```

The menu has three levels (top, second, third) with a right-hand collection card. The open state was not screenshotted (see not-verified.md), so the visual polish (spacing per column, card copy) is unverified.

**Cost.** Underline and sticky bar: low. Full mega menu with keyboard and three levels: high.

**Assets to replace.** Logo (a trademarked wordmark plus lion), icons, menu items and copy, card photos. **Addition:** add a `<nav>` landmark, which the site lacks.

---

## 5. Scroll fade-ins and page fades

**What it is.** Sections start invisible and fade in once, when 15 percent of them is on screen. Pages fade between each other in 0.2 s.

**Scroll fade (source read, class RevolutionAnimation).**

```css
.animated { opacity: 0; }
```

```js
const DURATION = 425;     // window.theme.animationDuration
const STAGGER  = 225;     // window.theme.animationBetweenElements
const presets = {
  fadeIn:     [{ opacity: 0 }, { opacity: 1 }],
  fromBottom: [{ transform: 'translateY(30px)',  opacity: 0 }, { transform: 'translateY(0px)', opacity: 1 }],
  fromLeft:   [{ transform: 'translateX(-30px)', opacity: 0 }, { transform: 'translateX(0px)', opacity: 1 }],
  scaleIn:    [{ transform: 'scale(96%)',  opacity: 0 }, { transform: 'scale(100%)', opacity: 1 }]   // runs 2 x DURATION
};
document.querySelectorAll('[data-animation]').forEach(block => {
  const name = block.dataset.animation;
  const io = new IntersectionObserver(entries => {
    const hits = entries.filter(e => e.isIntersecting || e.intersectionRatio > 0).map(e => e.target);
    if (!hits.length) return;
    hits.forEach(t => io.unobserve(t));
    hits.forEach((el, i) => {
      if (el.dataset.loaded) return; el.dataset.loaded = 'true';
      setTimeout(() => el.animate(presets[name], { duration: name === 'scaleIn' ? DURATION * 2 : DURATION, fill: 'forwards' }), STAGGER * i);
    });
  }, { threshold: 0.15 });
  if (block.classList.contains('animated')) io.observe(block);
  block.querySelectorAll('.animated').forEach(el => io.observe(el));
});
```

The Web Animations default ease is linear, so no `easing` key is passed. The fit from frames agrees (start 73 ms, length 438 ms, fitted curve 0.055, 0.001, 1, 1 with rms 0.037, nearest named ease linear). Fitted timings read 10 to 15 percent long on this capture rig; use the source values (425 ms).

**Page fades (source read, base.min.css).**

```css
@view-transition { navigation: auto; }
::view-transition-old(root)   { animation: vt-fade-out .2s ease-out both; }
::view-transition-new(root)   { animation: vt-fade-in  .2s ease-in  both; }
::view-transition-group(root) { animation-duration: 0s; }
@keyframes vt-fade-out { from { opacity: 1 } to { opacity: 0 } }
@keyframes vt-fade-in  { from { opacity: 0 } to { opacity: 1 } }
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(root), ::view-transition-new(root), ::view-transition-old(root) { animation: none !important; animation-duration: 1ms !important; }
}
```

Works in Chromium; other browsers simply navigate without a fade (the site has a JS overlay fallback of 250 ms out and 100 ms in, which is optional).

**Cost.** Low. About 30 lines total.

**Assets to replace.** None. **Addition:** wrap the fade-in in `if (!matchMedia('(prefers-reduced-motion: reduce)').matches)`; the site does not, and its `.animatedContent` starts at opacity 0 (also add a `no-js` fallback that shows content, as the site does).

---

## Assets that must be replaced (all recipes)

| Asset | Why |
|---|---|
| All photographs and the campaign copy (93 files in 03-assets) | Reference only, not licensed for reuse |
| The STRÖMS wordmark with lion, favicon | Trademark |
| Product names, brand names, prices | Client data |
| Icons (search, saved, account, bag, arrows, close) | Redraw or use an open icon set |
| Fonts | See below |
| Video / models | None on this site |

---

## Fonts

The site uses one family in two weights. **Fonts are not included in this pack.**

| Site font | Weight | Status | Free lookalike 1 | Free lookalike 2 |
|---|---|---|---|---|
| Akzidenz-Grotesk Pro Regular | 400 | **Paid** (Berthold commercial licence) | Hanken Grotesk 400 (Google Fonts) | Switzer 400 (Fontshare) |
| Akzidenz-Grotesk Pro Light | 300 | **Paid** (same family) | Hanken Grotesk 300 (Google Fonts) | Switzer 300 (Fontshare) |

Other free options if those two do not suit: Public Sans (Google Fonts, has 300 and 400) and General Sans (Fontshare, has 300 and 400). These are neo-grotesques of the same tradition as Akzidenz, but they are not exact matches; the choice is a visual judgement (inferred, not measured). Test the numerals and the "ä ö å" glyphs, since the copy is Swedish. Keep the same sizes: 14/18 body, 12/16 small, 10/12 tiny, 18/22 and 16/20 for headings, 0 letter spacing.
