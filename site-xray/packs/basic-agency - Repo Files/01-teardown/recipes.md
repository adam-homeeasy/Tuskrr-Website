# Recipes: how to rebuild the BASIC/DEPT signature effects

All numbers below come from the pack (`teardown.md` has the evidence label for each). This site uses no GSAP and no Lenis, so the sketches are plain HTML, CSS and JavaScript. Where a library would help, it is named as an optional substitute and marked as not used by the site.

Shared tokens used by every recipe (source read, `d73929f14593582f.css`):

```css
:root {
  --ink: #252422;          /* text, dark background */
  --paper: #f4f4f4;        /* page background */
  --pink: #f9cdcd;         /* accent, text on dark */
  --ease-out: cubic-bezier(0.28, 0.44, 0.49, 1);
  --ease-out-soft: cubic-bezier(0.28, 0, 0.49, 1);
  --ease-in-out-soft: cubic-bezier(0.72, 0, 0.28, 1);
  --ease-in-out-hard: cubic-bezier(0.77, 0, 0.175, 1);
  --ease-garret: cubic-bezier(0.5, 0, 0, 1);
  --initial-animation-delay: 0.5s;
}
html { font-size: 62.5%; }                 /* 1rem = 10px */
@media (min-width: 1920px) { html { font-size: 0.5vw; } }
```

---

## Effect 1: Transform-based eased smooth scroll

### What it is

The browser still scrolls natively, so the scrollbar, keyboard and touch all work. But the visible content is not the native scroll position. A fixed wrapper holds every section, and each section is moved by an eased copy of the scroll position. The eased value is easeOutQuint over 60 frames and restarts from wherever it currently is every time the real scroll position changes. Sections outside the viewport are set to `visibility: hidden`. Everything else (header, sticky text, colour flip, video loading, cursors) reads the same eased number. Evidence: source read, and the model fits five clean scroll captures with rms 0.0005 to 0.0045.

### How to build it

1. Put all page sections in a wrapper. The wrapper is `position: fixed; top: 0; left: 0; width: 100%`.
2. Measure each section's `offsetTop` (walk `offsetParent`) and `clientHeight`. Set `document.body.style.height` to the bottom of the last section so the browser has something to scroll.
3. Run one `requestAnimationFrame` loop. Read `window.scrollY`. If it changed, restart the tween. Otherwise keep stepping the frame counter.
4. Write a transform and a visibility per section, only when the number changed.
5. Turn it all off on touch devices (first `touchstart`) and use native scroll, as the site does.
6. Re-measure on resize and after images or videos change layout.

### Code sketch (real numbers)

```html
<div id="scroll-root">
  <main data-uri>
    <section>...</section>
    <section>...</section>
  </main>
  <footer data-footer>...</footer>
</div>
```

```css
#scroll-root { position: fixed; top: 0; left: 0; width: 100%; }
#scroll-root section, #scroll-root footer { will-change: transform, visibility; }
```

```js
const FRAMES = 60;                       // 25 on touch, but touch uses native scroll
const easeOutQuint = (t, b, c, d) => c * ((t = t / d - 1) * t * t * t * t + 1) + b;

const parts = [...document.querySelectorAll('[data-uri] > section, [data-footer]')]
  .map(el => ({ el, offset: 0, height: 0, rendered: null, vis: 'hidden' }));

let target = 0, eased = 0, from = 0, frame = 0, isTouch = false;
addEventListener('touchstart', () => { isTouch = true; resetToNative(); }, { once: true });

function offsetTop(el) { let y = 0; while (el) { y += el.offsetTop || 0; el = el.offsetParent; } return y; }

function measure() {
  parts.forEach(p => { p.offset = offsetTop(p.el); p.height = p.el.clientHeight; });
  const last = parts[parts.length - 1];
  document.body.style.height = (last.offset + last.height) + 'px';
}

function step() {
  const y = window.scrollY;
  if (y !== target) { target = y; from = eased; frame = FRAMES; }   // restart from current eased value
  if (frame > 0) {
    frame--;
    const next = Math.round(from + easeOutQuint(FRAMES - frame, 0, target - from, FRAMES));
    if (next !== eased) { eased = next; return true; }
  }
  return false;
}

function render() {
  const vh = document.documentElement.clientHeight;
  parts.forEach(p => {
    let vis = 'visible', ty = eased;
    if (eased + vh <= p.offset)              { vis = 'hidden'; ty = p.offset - vh; }
    else if (eased >= p.offset + p.height)   { vis = 'hidden'; ty = p.offset + p.height; }
    if (vis !== p.vis || ty !== p.rendered) {
      p.vis = vis; p.rendered = ty;
      p.el.style.visibility = vis;
      p.el.style.transform = `matrix(1, 0, 0, 1, 0, -${ty})`;
    }
  });
}

function loop() { if (!isTouch && step()) render(); requestAnimationFrame(loop); }
addEventListener('resize', measure);
measure(); render(); requestAnimationFrame(loop);
```

Sticky text inside a section (the site's spotlight quote) is done the same way, with its own translate:

```js
// el: the [data-sticky] block, space: its parent's clientHeight, top = 80 + headerOffset
const t = 80 + stickyOffset;
const r = el.height + 2 * 80;
if (r > vh) { adjustment = clamp(adjustment + easedDelta, 0, r - vh); } else { adjustment = 0; }
let n;
if (eased < offset - t + adjustment)                          n = 0;
else if (eased > offset - t + adjustment + space - height)    n = space - height;
else                                                          n = eased - offset + t - adjustment;
el.style.transform = `matrix(1, 0, 0, 1, 0, ${n})`;
```

Header hide and return, proportional at 1.5 x scroll speed (source read):

```js
let prev = 0, c = 0;                    // c = pixels the header is pushed up
function headerFrame() {
  const e = 1.5 * eased;
  const d = e - prev; prev = Math.max(e, 0);
  c = Math.min(Math.max(c + d, 0), headerHeight);   // headerHeight is 126 at 1440
  header.style.transform = `matrix(1, 0, 0, 1, 0, -${c})`;
  header.dataset.transparent = eased < innerHeight;  // white text, no background over the hero
}
```

### Cost

Medium to high. Under 200 lines and no dependency, but it needs a re-measure whenever content height changes (images, fonts, videos loading), it fights browser find-in-page and anchor links unless you add a jump path (the site's `jumpTo` sets `from = target; frame = 1`), it is frame-counted (a high-refresh display runs the tween faster; not tested), and the site adds no reduced-motion fallback. Optional substitute, not used by the site: Lenis gives a similar feel with time-based easing and reduced-motion handling.

### Assets to replace

None. It is pure code. Replace the class names and section list with your own.

---

## Effect 2: Scroll-driven page colour flip

### What it is

The whole page changes colour pair as a section crosses the middle of the screen. Three pairs exist: Bright (#f4f4f4 background, #252422 text), Dark (#252422 background, #f9cdcd text) and Pink (#f9cdcd background, #252422 text). On the home page the spotlight is Dark and clients and news are Bright. The body transitions colour and background over 650 ms with `cubic-bezier(0.72,0,0.28,1)`. The header background follows the same variables; the footer flips to a light footer if the page is dark. Evidence: source read.

### How to build it

1. Define `--background-color` and `--text-color` on `:root`. Set `body { background-color: var(--background-color); color: var(--text-color); transition: ... }`.
2. Give each section a scheme name.
3. Every frame, find the section whose vertical span contains the middle of the viewport and, if it has a scheme, write the two variables. Sections without a scheme leave the colours alone.

### Code sketch

```css
body {
  background-color: var(--background-color);
  color: var(--text-color);
  transition: color 0.65s var(--ease-in-out-soft), background-color 0.65s var(--ease-in-out-soft);
  will-change: background-color, color;
}
::selection { background: var(--text-color); color: var(--background-color); -webkit-text-fill-color: var(--background-color); }
```

```js
const SCHEMES = {
  bright: { bg: '#f4f4f4', text: '#252422' },
  dark:   { bg: '#252422', text: '#f9cdcd' },
  pink:   { bg: '#f9cdcd', text: '#252422' },
};
// Same logic as the site: t between 0 and 1 means the middle line is inside the section.
function colourFrame(eased, vh, watched) {
  for (const s of watched) {                       // s = { el, offset, height, scheme }
    const t = (eased + vh / 2 - s.offset) / s.height;
    if (t >= 0 && t < 1) {
      const c = SCHEMES[s.scheme];
      document.documentElement.style.setProperty('--background-color', c.bg);
      document.documentElement.style.setProperty('--text-color', c.text);
    }
  }
}
```

Substitute that works with native scroll (not what the site does, same result):

```js
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const c = SCHEMES[e.target.dataset.scheme];
    document.documentElement.style.setProperty('--background-color', c.bg);
    document.documentElement.style.setProperty('--text-color', c.text);
  });
}, { rootMargin: '-50% 0px -50% 0px' });   // fires when the section covers the middle line
document.querySelectorAll('[data-scheme]').forEach(el => io.observe(el));
```

Behaviour to copy: a section with no scheme does not reset the colour. On the home page the page therefore stays Dark through the gap after the spotlight and turns Bright only when the news section reaches the middle line.

### Cost

Low. Three colour pairs, about 15 lines of JS, one CSS transition. Test the contrast of every text colour on both grounds (the site's ratios are in teardown section 4).

### Assets to replace

Your own colour pairs. For a leather-bag brand check any accent against both the light and dark ground before shipping.

---

## Effect 3: Cursor bubbles with a lerped drag carousel

### What it is

On desktop (not touch) two round labels replace the cursor over specific areas: a white 120 px "WATCH REEL" disc with a small subtitle over the hero, and a pink 120 px "DRAG" disc over the client row and the menu project row. The disc trails the pointer with a lerp. When the pointer leaves the area the disc glides back to a resting point (centre for the hero, 90 percent across for the drag rows). The row itself is dragged by pointer: the pointer distance is multiplied by 4.5, clamped to the scroll range, and the visible scroll position chases it with a lerp of 0.05. A 2 px progress line under the row shows position. Evidence: source read; disc size, position and copy measured (`pointer.json`: followers at x 1000, y 300, body width 120).

### How to build it

Cursor bubble:

```html
<div class="zone" data-cursor-zone>
  <!-- content -->
  <div class="cursor-layer"><div class="cursor"><div class="cursor-body">
    <div class="bubble" data-active="false" data-dragging="false">
      <span class="label"><span>Drag</span><span>Drag</span><span>Drag</span></span>
    </div>
  </div></div></div>
</div>
```

```css
.zone { position: relative; cursor: none; }
.cursor-layer { position: absolute; inset: 0; pointer-events: none; }
.cursor { position: absolute; top: 0; left: 0; will-change: transform; }
.cursor-body { position: absolute; transform: translate(-50%, -50%); }
.bubble {
  width: 12rem; height: 12rem; padding: 2rem; border-radius: 50%;
  background: var(--pink); color: var(--ink);
  font: 700 1.4rem/1.2 'YourFont', sans-serif; text-transform: uppercase; text-align: center;
  display: flex; align-items: center; justify-content: center;
  transition: width .25s var(--ease-out-soft), height .25s var(--ease-out-soft);
}
.bubble[data-dragging="true"] { width: 7rem; height: 7rem; }
/* label roll: three stacked copies, the first is invisible and sets the width */
.label { position: relative; overflow: hidden; padding: .5rem 0; }
.label > span:first-child { padding-top: .5rem; opacity: 0; display: block; }
.label > span:nth-child(2) { position: absolute; inset: 0; padding-top: .5rem; }
.label > span:nth-child(3) { position: absolute; top: 100%; left: 0; width: 100%; height: 100%; padding-top: .5rem; }
.bubble[data-active="true"] .label span { animation: translate-up-100 .65s var(--ease-garret) forwards; }
@keyframes translate-up-100 { from { transform: translateY(0); } to { transform: translateY(-100%); } }
@media (max-width: 1023px) { .bubble { width: 8rem; height: 8rem; padding: 1rem; font-size: 1rem; } }
```

```js
// Lerp follower. k = 0.25 while the pointer is inside the zone, 0.15 while gliding home.
const lerp = (a, b, t) => (1 - t) * a + t * b;
let inside = false, mouse = { x: 0, y: 0 }, pos = { x: 0, y: 0 };
zone.addEventListener('mouseover', () => { inside = true; bubble.dataset.active = 'true'; });
zone.addEventListener('mouseout',  () => { inside = false; bubble.dataset.active = 'false'; });
document.addEventListener('mousemove', e => { mouse = { x: e.clientX, y: e.clientY }; });

function cursorFrame() {
  const r = zone.getBoundingClientRect();
  const rest = { x: r.width * 0.9, y: r.height * 0.5 };        // hero uses x: 0.5
  const goal = inside ? { x: mouse.x - r.left, y: mouse.y - r.top } : rest;
  const k = inside ? 0.25 : 0.15;
  pos.x = lerp(pos.x, goal.x, k);
  pos.y = lerp(pos.y, goal.y, k);
  cursor.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
  requestAnimationFrame(cursorFrame);
}
requestAnimationFrame(cursorFrame);
```

Over a link inside the row, the disc drops to opacity 0.5 and its label hides (`data-is-over-anchor`). While dragging, the disc shrinks to 7 rem, the label fades and two 8 px caret arrows fade and scale in from 0.6 to 1 over 200 ms.

Drag row:

```css
.row-stage { overflow: scroll visible; scrollbar-width: none; padding-left: 8rem; }
.row-stage::-webkit-scrollbar { display: none; }
.progress { position: relative; height: .2rem; margin: 11rem 8rem 0; }
.progress::before { content: ""; position: absolute; inset: 0; background: currentColor; opacity: .25; }
.progress-bar { position: absolute; top: 0; left: 0; height: .2rem; background: currentColor; }
```

```js
let startX = 0, saved = 0, target = 0, cur = 0, dragging = false;
const max = () => stage.scrollWidth - stage.clientWidth;

stage.addEventListener('pointerdown', e => { e.preventDefault(); startX = e.clientX; dragging = true; bubble.dataset.dragging = 'true'; });
addEventListener('pointermove', e => {
  if (!dragging) return;
  target = Math.max(Math.min(saved + (e.clientX - startX) * 4.5, 0), -max());
});
addEventListener('pointerup', () => { saved = target; dragging = false; bubble.dataset.dragging = 'false'; });

function rowFrame() {
  cur = lerp(cur, target, 0.05);
  cur = Math.floor(cur * 100) / 100;
  stage.scrollLeft = -cur;
  bar.style.width = (stage.clientWidth / stage.scrollWidth * 100) + '%';
  bar.style.left  = ((100 - stage.clientWidth / stage.scrollWidth * 100) / 100 * (stage.scrollLeft / max() * 100)) + '%';
  requestAnimationFrame(rowFrame);
}
requestAnimationFrame(rowFrame);
```

Touch fallback: do nothing. The stage is already a native horizontal scroller with hidden scrollbar; hide the bubble and the drag handlers when the first `touchstart` fires.

### Cost

Low to medium. Two small rAF loops. Keep the keyboard route: the site has no keyboard way to move the row, so add arrow-key or button controls in your build.

### Assets to replace

Labels, the disc colour, and the caret arrow SVG (8 px wide). The hero disc subtitle ("BASIC/DEPT 2010-infinity") is site copy; write your own.

---

## Effect 4: Hero curtain reveal, wordmark wipe and staggered header

### What it is

On first load a large wordmark sits in the middle of the page for 0.25 s and wipes upward over 0.5 s. From 0.5 s the header logo fades up, the six nav links fade up in a 30 ms stagger, and the menu dots follow. At the same time the hero video block rises from the bottom over 1 s: a masked window moves from `translateY(100%)` to 0 while the media inside it moves from `translateY(-100%)` to 0 and settles from scale 1.25 to 1. After the first load the delay is set to 0 so later pages skip the wait. Evidence: source read; fitted values agree in shape (see teardown 7.3).

### Code sketch (CSS only)

```html
<div class="takeover"><div class="takeover-mask"><div class="takeover-logo"><!-- wordmark svg, fill: currentColor --></div></div></div>
<section class="hero"><div class="hero-mask"><div class="hero-media"><video ...></video></div></div></section>
```

```css
/* wordmark wipe: mask goes up, logo goes down by the same amount, so the logo stays put while the window slides off */
.takeover { position: fixed; inset: 0; display: flex; align-items: center; justify-content: center; pointer-events: none; }
.takeover-mask { position: relative; overflow: hidden; flex: 0 0 35vw;
  animation: mask-up .5s var(--ease-garret) .25s forwards; }
.takeover-logo { position: relative; top: .1rem; padding-bottom: .1rem;
  animation: logo-down .5s var(--ease-garret) .25s forwards; }
@keyframes mask-up  { from { transform: translateY(0); } to { transform: translateY(-100%); } }
@keyframes logo-down { from { transform: translateY(0); } to { transform: translateY(100%); } }

/* hero curtain */
.hero { height: 100vh; position: relative; overflow: hidden; }
.hero-mask { overflow: hidden; transform: translateY(100%);
  animation: rise 1s var(--ease-in-out-soft) var(--initial-animation-delay) forwards; }
.hero-media { transform: translateY(-100%);
  animation: settle 1s var(--ease-in-out-soft) var(--initial-animation-delay) forwards; }
@keyframes rise   { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes settle { from { transform: translateY(-100%) scale3d(1.25, 1.25, 1); } to { transform: translateY(0) scaleX(1); } }

/* header stagger: delay = initial + 0.1s + n * 0.03s, 0.5s long */
@keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes rise-10 { from { transform: translateY(1rem); } to { transform: translateY(0); } }
.logo { opacity: 0; animation: fade-in .5s var(--ease-out-soft) var(--initial-animation-delay) forwards,
                              rise-10 .5s var(--ease-out-soft) var(--initial-animation-delay); }
.nav li { opacity: 0; }
.nav li:nth-child(1) { animation: fade-in .5s var(--ease-out-soft) calc(var(--initial-animation-delay) + .1s + 1 * .03s) forwards,
                                   rise-10 .5s var(--ease-out-soft) calc(var(--initial-animation-delay) + .1s + 1 * .03s); }
/* repeat for nth-child(2) to (7) with 2 * .03s ... 7 * .03s */
.menu-dots { opacity: 0;   /* from 1024 up: delay 0.5 + 0.38 s; below 1024: 0.5 + 0.1 s */
  animation: fade-in .5s var(--ease-out-soft) calc(var(--initial-animation-delay) + .38s) forwards,
             rise-10 .5s var(--ease-out-soft) calc(var(--initial-animation-delay) + .38s); }

/* cursor hit area appears after the curtain starts */
.hit-box { opacity: 0; animation: fade-in .25s linear calc(.5s + var(--initial-animation-delay)) forwards; }
```

```js
// Later page views: no waiting
router.on('routeChangeComplete', () => document.documentElement.style.setProperty('--initial-animation-delay', '0s'));
```

### Cost

Low. Pure CSS and one variable. Add `@media (prefers-reduced-motion: reduce)` to set all of these to `animation: none; opacity: 1; transform: none` (the site does not).

### Assets to replace

The wordmark SVG (the site's B/D artwork must not be reused), the hero video, and the `35vw` width to suit your logo.

---

## Effect 5: Animated film grain

### What it is

A fixed, full-screen layer of noise sits over the page and jitters in steps, giving flat colours a print texture. One copy covers the whole page; a second copy lives inside the header background. Measured effect: light areas read from #e6e6e6 to #f4f4f4 and dark areas from #252422 to #2b2a28. Evidence: source read; amplitude measured from pixel samples.

### Code sketch

```html
<div class="noise"></div>
```

```css
.noise { position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; }
.noise::after {
  content: ""; position: absolute;
  top: -10rem; left: -10rem;
  width: calc(100% + 20rem); height: calc(100% + 20rem);
  background-image: url('/img/grain.png'); background-position: 50%;
  animation: noise 1s steps(2) infinite;
  will-change: transform;
}
@keyframes noise {
  0%   { transform: translate3d(0, 9rem, 0); }
  10%  { transform: translate3d(-1rem, -4rem, 0); }
  20%  { transform: translate3d(-8rem, 2rem, 0); }
  30%  { transform: translate3d(9rem, -9rem, 0); }
  40%  { transform: translate3d(-2rem, 7rem, 0); }
  50%  { transform: translate3d(-9rem, -4rem, 0); }
  60%  { transform: translate3d(2rem, 6rem, 0); }
  70%  { transform: translate3d(7rem, -8rem, 0); }
  80%  { transform: translate3d(-9rem, 1rem, 0); }
  90%  { transform: translate3d(6rem, -5rem, 0); }
  100% { transform: translate3d(-7rem, 0, 0); }
}
```

`steps(2)` applies inside each of the ten keyframe gaps, so the texture repositions about 20 times a second (inferred from CSS timing rules). Place the layer under the header (z-index below 800) if you want a solid header to hide it.

### Cost

Low. One image, one rule. The paint cost is a full-screen layer that repaints continuously, so test on low-end phones and add `prefers-reduced-motion: reduce { animation: none }`.

### Assets to replace

The grain PNG. The site's file is `noise.e8298e81.png` (23 KB in the probe list) and is NOT in the pack, so make your own tileable noise (monochrome, mid-grey, low contrast) and tune until the light and dark pixel shifts are similar to the numbers above.

---

## Smaller recipes worth having

Values are source read.

**Pill button with rising fill**

```css
.pill { position: relative; display: inline-flex; overflow: hidden; align-items: center;
  padding: .2rem 3rem 0; border: .1rem solid; border-radius: 1.6rem; color: currentColor;
  font: 700 1.2rem/2.8rem 'YourFont', sans-serif; letter-spacing: -.02em; text-transform: uppercase; white-space: nowrap;
  transform: translateZ(0);
  transition: border-color .65s var(--ease-out), color .25s var(--ease-out); }
.pill::before { content: ""; position: absolute; z-index: -1; bottom: -.1rem; left: 0; width: 100%; height: calc(100% + .2rem);
  background: var(--text-color); transform: translate3d(0, 100%, 0); transition: transform .25s var(--ease-out); }
.pill:hover, .pill:focus-visible { color: var(--background-color); outline: 0; }
.pill:hover::before, .pill:focus-visible::before { transform: translateZ(0); }
.pill:active { background: var(--text-color); color: var(--background-color); }
.pill:disabled { opacity: .25; cursor: default; }
```

Note: the site removes the focus outline. Keep a visible focus style of your own.

**Nav underline trace**

```css
.nav a { position: relative; display: inline-block; overflow: hidden; }
.nav a::after { content: ""; position: absolute; bottom: 0; left: 0; width: 100%; height: .1rem; background: currentColor;
  transform: translateX(calc(-100% - .1rem)); animation: trace-out .25s var(--ease-out) forwards; }
.nav a:hover::after, .nav a:focus-visible::after { animation: trace-in .25s var(--ease-out) forwards; }
.nav a[data-active="true"]::after { animation: trace-in 0s var(--ease-out) forwards; }
@keyframes trace-in  { from { transform: translate3d(-101%, 0, 0); } to { transform: translateZ(0); } }
@keyframes trace-out { from { transform: translateZ(0); } to { transform: translate3d(101%, 0, 0); } }
```

**Card image that settles on hover**

```css
.card .media { overflow: hidden; }
.card .media > * { transform: scale3d(1.05, 1.05, 1); transition: transform .25s var(--ease-out-soft); }
.card a:hover .media > *, .card a:focus-visible .media > * { transform: scaleX(1); }
.card a:hover h5, .card a:focus-visible h5 { text-decoration: underline; }
```

**Arrow push** (news rows, 0.55 s)

```css
.arrow { overflow: hidden; width: 3rem; height: 3rem; }
.row a:hover .arrow svg, .row a:focus-visible .arrow svg { animation: push-arrow .55s var(--ease-in-out-hard) forwards; }
@keyframes push-arrow { 0% { transform: none; } 50% { transform: translateX(100%); } 50.1% { transform: translateX(-100%); } 100% { transform: none; } }
```

**Menu dots opening on hover** (0.13 s)

```css
.menu-btn:hover circle:nth-child(1) { transform: translateX(-.2rem); }
.menu-btn:hover circle:nth-child(3) { transform: translateX(.2rem); }
.menu-btn circle { transition: transform .13s var(--ease-out-soft); }   /* token --bd-time-transition-125 = 0.13s */
```

**Video that exists only while in view** (saves memory and bandwidth)

```js
function updateVideo(block, src) {
  const inView = eased + vh >= block.top && eased <= block.top + block.height;
  if (inView && !block.video) {
    const v = document.createElement('video');
    v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata'; v.src = src;
    v.oncanplay = () => v.setAttribute('data-can-play', 'true');   // CSS fades it in over .35s
    v.play().catch(() => {}); block.placeholder.after(v); block.video = v;
  } else if (!inView && block.video) { block.video.remove(); block.video = null; }
}
```
The placeholder is an SVG whose `viewBox` is set from the video's `videoWidth` and `videoHeight`, so the layout height matches the file. Set the aspect ratio in HTML instead so the page height does not jump.

**Cookie bar** (slides up, checks conditions after 1 s)

```js
setTimeout(() => {
  const bot = /bot|crawler|spider|crawling/i.test(navigator.userAgent);
  const dnt = navigator.doNotTrack; const ok = dnt == null ? true : (dnt !== 'yes' && dnt !== '1');
  if (!bot && ok && !localStorage.getItem('basic-cc')) bar.dataset.visible = 'true';
}, 1000);
/* .bar[data-visible=true] { animation: up .5s var(--ease-out-soft) var(--initial-animation-delay) forwards; transform: translateY(100%); } */
```
Also set a bottom padding equal to the bar height (6 rem) on the footer while it shows, as the site does.

---

## Fonts

| Font | Where used | Status | Free lookalikes |
|---|---|---|---|
| Scto Grotesk A (weights 300, 400, 700) | Everything on the site (headings, body, buttons, labels) | Paid (commercial licence, not on Google Fonts or Fontshare; foundry and terms not in the pack). Not included in this pack. | Google Fonts: **Inter Tight** (tight grotesque, weights 100 to 900, good for the -0.05em uppercase headings). Fontshare: **Switzer** (Swiss-style neo-grotesque, weights 100 to 900). |
| Wordmark "BASIC/DEPT" and "B/D" | Header, footer, overview, load wipe | Custom SVG artwork, not a font | Do not copy. Draw your own wordmark. |

Notes for the swap: keep the weight roles (300 for footer links and the "Adweek" label, 400 for body and most headlines, 700 for uppercase headings, pill labels and cursor labels). Keep the tracking values from teardown section 5 (-0.05em on H1 and H2, -0.035em on H3, -0.02em on H5, H6 and small text, -0.01em on body). Check that the replacement's uppercase width does not force wraps in the 42 px news headlines (413 px image plus 8-column body) and the 90 px quote (it must fit five short lines in a 630 px column).
