# Recipes: UNIMATIC Impronte page

All numbers below come from the pack (source read unless marked). This site uses no GSAP and no Lenis, so no library is needed for any of these. Every recipe is plain HTML and CSS, with a little vanilla JS where noted. Use your own photos, copy and fonts. Nothing from the site's images, video, models, copy or code may be reused.

Shared tokens used by all recipes (source read):

```css
:root{
  font-size:10px;                      /* 1rem = 10px */
  --color-bg:#F6F6F6; --color-ink:#000; --color-white:#fff; --color-accent:#AFFF00;
  --color-ink-70:color-mix(in srgb,#000 70%,transparent);
  --color-ink-50:color-mix(in srgb,#000 50%,transparent);
  --color-hairline:color-mix(in srgb,#000 15%,transparent);
  --color-border:color-mix(in srgb,#000 20%,transparent);
  --color-surface:color-mix(in srgb,#000 5%,transparent);
  --color-glass-60:color-mix(in srgb,#fff 60%,transparent);
  --color-glass-40:color-mix(in srgb,#fff 40%,transparent);
  --blur-glass:30px; --blur-glass-soft:15px;
  --radius-sm:4px; --radius-md:6px; --radius-lg:8px;
  --transition:220ms ease;
  --page-margin:12px; --gutter:24px;
  --col:calc((min(100vw,1920px) - var(--page-margin)*2 - var(--gutter)*3)/4);
}
@media (min-width:768px){:root{--page-margin:24px}}
```

## 1 Frosted glass panels over photography

**What it is.** White at 60 percent with a backdrop blur. Used for the nav pills (blur 15), mega menu, drawers, inputs and buttons (blur 30), and the caption card (blur 60). It is the main look of the site.

**How to build.** CSS only. The parent must sit over an image so there is something to blur.

```css
.glass{
  background:var(--color-glass-60);
  -webkit-backdrop-filter:blur(var(--blur-glass));
  backdrop-filter:blur(var(--blur-glass));
  border-radius:var(--radius-lg);
}
.nav-pill{                       /* header pills */
  display:inline-flex; align-items:center; gap:2.4rem;
  padding:1rem 2rem; border-radius:var(--radius-lg);
  background:var(--color-glass-60);
  -webkit-backdrop-filter:blur(15px); backdrop-filter:blur(15px);
}
.nav-pill--sm{border-radius:var(--radius-md)}
.caption-card{ /* over a macro photo */
  background:var(--color-glass-60);
  -webkit-backdrop-filter:blur(60px); backdrop-filter:blur(60px);
  padding:1.2rem; border-radius:var(--radius-lg);
}
```

**Cost.** Low to build. Medium to tune: text sits at 30 to 70 percent alpha on the source, and contrast over photos was never measured, so test each photo. Backdrop blur is costly on old phones, so keep panels few and small.

**Replace.** All photography. Set `background-color` fallback for browsers without `backdrop-filter`.

## 2 Stacking "Highlights" cards (sticky)

**What it is.** Three tall entries, each stuck under the header at 60 px. Each has an opaque page-coloured background, so the next entry slides up and covers the last one. No script, no scrub, no pin library.

**How to build.**

```html
<section class="timeline">
  <div class="timeline__head"><p class="t-subtitle">Highlights</p></div>
  <div class="timeline__stack">
    <div class="shopify-block"><div class="entry">
      <div class="entry__inner">
        <div class="entry__media"><img src="detail-1.jpg" alt="…"></div>
        <div class="entry__card glass">…year chip, title, body…</div>
      </div>
    </div></div>
    <!-- repeat -->
  </div>
</section>
```

```css
.timeline{--top:60px;background:var(--color-bg);padding-block-start:4.9rem}
.timeline__stack>*{position:sticky;top:var(--top)}
.entry{background:var(--color-bg)}          /* opaque, so it covers the previous card */
.entry__inner{
  block-size:min(824px,calc(100svh - var(--top)));
  max-inline-size:1920px;margin-inline:auto;
  padding:1.6rem var(--page-margin);
  display:grid;grid-template-columns:982fr 394fr;gap:1.6rem;align-items:stretch;
}
.entry__media{grid-column:1;border-radius:8px;overflow:hidden;background:var(--color-surface)}
.entry__media img{width:100%;height:100%;object-fit:cover;object-position:50% 38%}
.entry__card{grid-column:2;align-self:start;min-block-size:26.4rem;padding:1.2rem;
  display:flex;flex-direction:column;gap:4rem}
@media (min-width:768px) and (max-width:1099px){.timeline{--top:calc(max(env(safe-area-inset-top),6.4rem) + 4rem)}}
@media (max-width:767px){
  .timeline__stack>*{position:static}
  .entry__inner{block-size:auto;grid-template-columns:1fr;gap:.8rem}
  .entry__card{grid-column:1;grid-row:1}
  .entry__media{grid-column:1;grid-row:2;aspect-ratio:351/358}
}
```

The 60 px top comes from `--drawer-top-base = 1.6 + 2 x 1.0 + 1.6 + 0.8 rem`. The section height at 1440 was 2573 px (measured) for a head plus 3 x 824 px entries.

**Cost.** Low. Needs 3 or more strong square-ish detail photos and short copy.

**Replace.** All images and text. Do not put `overflow: hidden` on any ancestor of the sticky items, or sticky will stop working.

## 3 Dark photo band with a sticky glass caption card

**What it is.** A full-width photo at a fixed ratio (1440 by 854). Inside it a 349 px glass card sticks 64 px from the top as the band scrolls past. Dark band sits between light shelves (#F6F6F6), which gives the page its rhythm: dark hero, light shelf, dark band, long light stretch, photo footer, light footer.

```html
<section class="band" style="--ratio:1440/854;--card-w:349px;--card-offset:32px">
  <div class="band__media"><img class="fill" src="macro.jpg" alt=""></div>
  <div class="band__overlay">
    <div class="band__card glass">
      <span class="tag">COLLECTION</span>
      <p class="t-subtitle" style="opacity:.3">Light, texture and touch.</p>
      <h2 class="t-title-l">Caption text…</h2>
    </div>
  </div>
</section>
```

```css
.band{position:relative}
.band__media{position:relative;aspect-ratio:var(--ratio);background:#D9D9D9}
.fill{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.band__overlay{
  position:absolute;inset-block:0 6.4rem;
  inset-inline-start:calc((100% - min(100%,1920px))/2 + var(--page-margin));
  inline-size:var(--card-w);max-inline-size:calc(100% - var(--page-margin)*2);
}
.band__card{
  position:sticky;top:6.4rem;margin-block-start:var(--card-offset);
  display:flex;flex-direction:column;align-items:flex-start;gap:.8rem;
  padding:1.2rem;color:var(--color-ink-70);
  -webkit-backdrop-filter:blur(60px);backdrop-filter:blur(60px);
}
@media (max-width:767px){
  .band{--ratio:375/588}
  .band__card{margin-block-start:25.4rem}
  .band__overlay{inset-inline-start:var(--page-margin);inline-size:calc(100% - var(--page-margin)*2);max-inline-size:35.1rem}
}
```

**Cost.** Low to medium. The effect depends on the photo having a calm area under the card.

**Replace.** Photo, tag, copy.

## 4 Product card with hover image swap

**What it is.** A 330 by 500 media box (ink 5 percent background, radius 8) holding a packshot and an in-use shot stacked. On hover (768 px and up) the packshot fades out and the second image fades in over 220 ms. Below the box: rows 26 px high split by 1 px hairlines. On phones the two images become a swipe strip.

```html
<article class="card">
  <a class="card__media" href="/p/1" aria-label="Product name">
    <div class="card__tags"><span class="t-eyebrow card__tag">41.5mm</span></div>
    <div class="card__frames">
      <img class="card__img" src="pack.png" alt="…" width="900" height="900" loading="lazy">
      <img class="card__img card__img--hover" src="wrist.jpg" alt="…" width="900" height="900" loading="lazy">
    </div>
  </a>
  <div class="card__info">
    <div class="row"><a href="/p/1">Name</a><span>795€</span></div><hr>
    <div class="row"><span>Subtitle</span></div><hr>
    <div class="row"><span>Edition of 250</span><span class="swatches">…</span></div>
  </div>
</article>
```

```css
.card{flex:0 0 var(--col);display:flex;flex-direction:column}
.card__media{position:relative;display:block;aspect-ratio:330/500;
  background:var(--color-surface);border-radius:8px;overflow:hidden}
.card__frames{display:contents}
.card__img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;
  transition:opacity var(--transition)}
@media (min-width:768px){
  .card__img--hover{opacity:0}
  .card:hover:not(:has(.swatches:hover)) .card__img--hover{opacity:1}
  .card:hover:not(:has(.swatches:hover)) .card__img:not(.card__img--hover){opacity:0}
}
.card__tags{position:absolute;inset:.74rem 0 auto 0;display:flex;padding-inline:.5rem;z-index:1}
.card__tag{padding:.2rem .8rem;border-radius:4px;color:#222;opacity:.3;text-transform:uppercase;
  font-feature-settings:"zero" 1}
.card__info{padding-inline:.8rem;color:var(--color-ink-70)}
.row{display:flex;align-items:center;justify-content:space-between;gap:1.2rem;min-block-size:2.6rem}
hr{block-size:1px;border:0;margin:0;background:var(--color-hairline)}
.swatches{display:flex;gap:.4rem}
.swatch{inline-size:.8rem;block-size:.8rem;border-radius:50%;outline:1px solid transparent;
  outline-offset:.15rem;transition:outline-color var(--transition)}
.swatch--active,a.swatch:hover{outline-color:color-mix(in srgb,#000 30%,transparent)}
@media (max-width:767px){
  .card{flex:0 0 29.3rem}
  .card__media{aspect-ratio:293/344}
  .card__frames{position:absolute;inset:0;display:flex;overflow-x:auto;scroll-snap-type:x mandatory;scrollbar-width:none}
  .card__img{position:relative;inset:auto;flex:0 0 100%;scroll-snap-align:start}
}
```

Measured hover diff: packshot opacity 1 to 0, second image 0 to 1.

**Slider that holds the cards (native scroll snap, count, disabled ends).**

```css
.track{display:flex;gap:1.2rem;overflow-x:auto;scroll-snap-type:x mandatory;
  scroll-behavior:smooth;scrollbar-width:none}
.track>*{scroll-snap-align:start}
@media (prefers-reduced-motion:reduce){.track{scroll-behavior:auto}}
```

```js
// from slider.js, simplified. rAF-gated update, 8px tolerance, "n/total" counter
const track=document.querySelector('[data-track]'),count=document.querySelector('[data-count]');
const prev=document.querySelector('[data-prev]'),next=document.querySelector('[data-next]');
const cells=()=>[...track.children];
const step=()=>cells()[1].offsetLeft-cells()[0].offsetLeft;
let raf=0;
const update=()=>{raf=0;
  const c=cells(),s=step(),x=Math.abs(track.scrollLeft),max=track.scrollWidth-track.clientWidth;
  prev.disabled=x<=8; next.disabled=x>=max-8;
  const gap=s-c[0].offsetWidth,perView=Math.max(1,Math.floor((track.clientWidth+gap)/s));
  count.textContent=Math.min(c.length,Math.round(x/s)+perView)+'/'+c.length;
};
const req=()=>{raf||(raf=requestAnimationFrame(update))};
track.addEventListener('scroll',req,{passive:true});
new ResizeObserver(req).observe(track);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
prev.onclick=()=>track.scrollBy({left:-step(),behavior:reduce?'auto':'smooth'});
next.onclick=()=>track.scrollBy({left: step(),behavior:reduce?'auto':'smooth'});
update();
```

**Cost.** Low. **Replace.** All product images, names, prices, colours, copy.

## 5 Type system and the blinking accent dot

**What it is.** Bold neo-grotesque with tight tracking for titles, small uppercase monospace for labels and navigation, and a single lime dot that pulses with a glow next to CART. Line heights are set by hand.

```css
body{font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;font-size:1.2rem;line-height:1.221;
  background:var(--color-bg);color:#000;-webkit-font-smoothing:antialiased}
.t-title-l{font-weight:700;font-size:2.4rem;line-height:1.221;letter-spacing:-.02em}
.t-subtitle{font-weight:700;font-size:1.6rem;line-height:1.221;letter-spacing:-.02em}
.t-mono{font-family:"JetBrains Mono",ui-monospace,Menlo,monospace;font-size:1.2rem;line-height:1.32;
  text-transform:uppercase;font-feature-settings:"zero" 1}
.t-eyebrow{font-family:"JetBrains Mono",ui-monospace,Menlo,monospace;font-size:1rem;line-height:1.32;
  text-transform:uppercase;font-feature-settings:"zero" 1}
@media (max-width:767px){.t-title-l{font-size:1.8rem}.t-subtitle{font-size:1.4rem}}

.accent-dot{display:inline-block;width:.7rem;height:.7rem;border-radius:50%;
  background:#AFFF00;box-shadow:0 0 6px 2px color-mix(in srgb,#AFFF00 70%,transparent);
  animation:blink .8s ease-in-out infinite}
@keyframes blink{0%,100%{opacity:1}50%{opacity:.25}}
@media (prefers-reduced-motion:reduce){.accent-dot{animation:none}}
```

Focus ring used across the site (measured): `:focus-visible{outline:2px solid #000!important;outline-offset:2px!important;box-shadow:0 0 0 4px #F6F6F6}`.

**Cost.** Low. A licensed neo-grotesque is the only spend. **Replace.** Fonts (see below), and the accent colour if your palette differs.

## Also worth copying (small)

- **Fixed pill header with a difference-blend logo.** Logo: `position:fixed;top:2.4rem;left:calc((100% - min(100%,1920px))/2 + var(--page-margin));height:19px;mix-blend-mode:difference;z-index:120`. Pills at `top:16px`. On 1099 px and down, hide pills on scroll down when `y > lastY && y > 120` and the move is at least 8 px, using `abs(y - lastY) >= 8` in an rAF-gated scroll handler.
- **Click-open mega menu.** Fade the panel with `transition: opacity 220ms ease, display 220ms allow-discrete` and `@starting-style{ .megamenu:not([hidden]){opacity:0} }`. Close on Escape, pointer down outside, and scroll. Drop the transition when switching between panels (`is-switching`).
- **Dialog drawers.** `<dialog>` with `show()` for non-modal panels. Open transition: opacity 0 to 1, `translateY(-.8rem)` to 0, 220 ms, using `@starting-style`. Scrim on `body:after` at 60 percent black.
- **Footer clock and weather.** Optional, see teardown section 7 for the exact API call, cache and timeouts.

## Assets that must be replaced

| Asset on the site | Notes |
|---|---|
| Hero photo (still life with red light line), media band macro, three highlight detail photos, footer macro banner | Replace with your own. Footer banner is the heaviest image at 246 KB served |
| 20 product images (10 packshot PNG, 10 wrist shots) | Replace, keep the two-image pair per product |
| Logo, favicon, share image | Replace |
| Copy: headline, product names, highlight text, USP text, newsletter text | Write your own |
| Fonts | Not included in the pack. See below |
| Klaviyo, apps and scripts | Not needed for a plain rebuild |

## Fonts

| Font on the site | Licence | Free lookalikes (family names) |
|---|---|---|
| Helvetica Neue (400 and 700) | PAID. Commercial. The pack does not include the files | **Inter** (Google Fonts) and **Switzer** (Fontshare). Also close: Public Sans (Google Fonts), General Sans (Fontshare) |
| JetBrains Mono (400, 700 declared) | FREE (open source, SIL OFL). Available on Google Fonts. Files are not included in this pack, so fetch it yourself | Already free. If you want alternatives: **IBM Plex Mono** (Google Fonts) or **DM Mono** (Google Fonts) |
| IBM Plex Mono (declared by Klaviyo, never loaded on the page) | FREE (OFL) | Not needed |

When you swap Helvetica Neue for Inter or Switzer, re-measure line height: the site's own note says browser `normal` line height differed from the design, so it sets 1.221 (sans) and 1.32 (mono) by hand. Keep the explicit values and check the title tracking of -0.02em still looks right.
