# OUTFIT by ++hellohello: recipes

How to rebuild each signature effect in plain HTML, CSS and JS, using GSAP 3.14 and Lenis 1.3 where the original does. Every number is copied from the pack (see `teardown.md` for the evidence label and section). Sketches are written for you to adapt: use your own wordmark, photos and copy. Do not copy the site's images, wordmark paths or text.

Shared setup used by several recipes:

```html
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/ScrollTrigger.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/lenis@1.3.11/dist/lenis.min.js"></script>
```

SplitText is now free in GSAP 3.13 and later, but this site only uses it for the bag page; the hero paragraph uses a small line splitter, so you can also split lines by hand.

## Effect 1: Preloader collage

**What it is.** A black full-screen panel. Six tilted photos pop in (scale 0 to 1, random rotation) in a stack behind a cream wordmark. The wordmark is an SVG whose letters rise from below in random order. A counter runs 000 to 100. Then the counter, letters and photos leave, and the whole panel wipes upward with a clip-path. Source: `Preloader.js`, timelines 1 to 6 in `motion_gsap.json`. Label: measured (GSAP values) and source read.

**How to build.**
1. Fixed panel, `inset: 0`, black, `clip-path: inset(0 0 0 0)`, `z-index: 50`.
2. Centre a wrapper. Inside it a fixed layer holds the 6 photos, absolutely positioned and centred, 9:12, `12vw` wide on desktop and `30vw` on phones.
3. Wordmark SVG (28rem wide, `viewBox` from your artwork) with one `<path>` per letter, wrapped in `overflow: hidden`. Fill cream, `mix-blend-mode: difference`.
4. Counter `<span>` in an `overflow: hidden` box, placed top right of the wordmark on desktop.
5. Hold the page: `history.scrollRestoration = "manual"`, `scrollTo(0,0)`, `lenis.stop()`.

**Code sketch (real numbers).**

```js
const imgs  = gsap.utils.toArray('.pre-photos img');
const paths = gsap.utils.toArray('.pre-word path');
const count = document.querySelector('.pre-count');
const panel = document.querySelector('.pre');

window.scrollTo(0, 0);
lenis.stop();

const intro = gsap.timeline({ paused: true,
  defaults: { duration: 0.6, ease: 'power3.out', force3D: true } })
  .fromTo(imgs, { scale: 0, rotate: 0 },
    { scale: 1, rotate: () => gsap.utils.random(-20, 20),
      stagger: { each: 0.2, from: 'start' } })
  .fromTo(paths, { yPercent: 110 },
    { yPercent: 0, stagger: { each: 0.2, from: 'random' } }, '<');

gsap.timeline({ delay: 0.4, defaults: { force3D: true },
  onComplete: () => { document.documentElement.classList.add('loaded'); } })
  .call(() => intro.play())
  .to(count, { duration: 3, innerText: '100',
      modifiers: { innerText: v => String(Math.round(+v)).padStart(3, '0') },
      ease: 'circ.inOut' })
  .to(count, { yPercent: -100, duration: 1, autoAlpha: 0, ease: 'circ.inOut' }, '<90%')
  .to(paths, { yPercent: -120, duration: 1.2, ease: 'expo.inOut',
      stagger: { each: 0.08, from: 'random' } }, '<')
  .to(imgs, { scale: 0, rotate: () => gsap.utils.random(-20, 20), duration: 0.6,
      ease: 'expo.inOut', stagger: { each: 0.1, from: 'end' } }, '<')
  .to(panel, { clipPath: 'inset(0% 0% 100% 0%)', duration: 1.4, ease: 'power2.inOut' }, '<30%')
  .call(() => { startHero(); gsap.delayedCall(0.8, () => lenis.start()); }, null, '<50%');
```

Timing check (measured): counter 0 to 3 s; exits start at 2.7 s; panel wipe starts at 3.03 s and ends at 4.43 s; the "loaded" callback fires at 3.73 s; total 4.43 s plus the 0.4 s delay. Run it once per full page load, not on in-site navigation.

**Cost.** Medium. One timeline, one SVG wordmark, six images. About 4.8 s of blocking intro, so gate it with `sessionStorage` if you can, and skip it for `prefers-reduced-motion` (the original does not).

**Assets to replace.** The 6 preloader photos (`03-assets/images/preloader/`), the OUTFIT wordmark paths, the cream and black colours (use your own). Do not reuse the site's photos or paths.

## Effect 2: Hero wordmark rise, rule draw and text stagger

**What it is.** After the loader, the giant red wordmark's letters rise out of a mask in random order, a 5 px rule draws left to right, small uppercase labels float up in a stagger, and the paragraph's lines rise one by one. Source: `be5163f90bdc0a39.js`, timeline 17 to 20. Label: measured (GSAP) and source read.

**How to build.** Wordmark as an inline SVG at `width: 100%` of the content box (24 px gutters at desktop). Letters are separate paths. The SVG's own bounds clip the rising letters. A `div` 5 px tall with `transform-origin: left` and `background: currentColor` is the rule. Labels sit in a 16-column grid (8 on phones). Split the paragraph into line `div`s (keep them `display:block`).

**Code sketch.**

```js
function startHero() {
  const lines = document.querySelectorAll('#hero-paragraph .line');
  gsap.set('.hero-word path', { yPercent: 110 });
  gsap.set('#hero-line', { scaleX: 0 });
  gsap.set(['#hero-title', '#hero-subtitle', '#hero-link', '#hero-ship', '#hero-year'], { autoAlpha: 0 });

  gsap.timeline()
    .fromTo('.hero-word path', { yPercent: 110 },
      { yPercent: 0, duration: 1.4, ease: 'power4.out',
        stagger: { each: 0.06, from: 'random' } })
    .fromTo('#hero-line', { scaleX: 0 },
      { scaleX: 1, duration: 1.6, ease: 'expo.out' }, '<20%')
    .set('#hero-paragraph', { autoAlpha: 1 }, '<')
    .fromTo(['#hero-title', '#hero-subtitle', '#hero-link', '#hero-ship', '#hero-year'],
      { autoAlpha: 0, y: 32 },
      { autoAlpha: 1, y: 0, duration: 1.4, ease: 'expo.out',
        stagger: { each: 0.2, from: 'start' } }, '<')
    .fromTo(lines, { autoAlpha: 0, yPercent: 100 },
      { autoAlpha: 1, yPercent: 0, duration: 1.8, ease: 'expo.out', stagger: 0.15 }, '<15%');
}
```

Timing check (measured): total 2.812 s; the rule starts at 0.352 s; the paragraph lines start at 0.712 s. Before the loader ends everything must be held hidden.

**Cost.** Low to medium. One timeline. The only work is turning your wordmark into separate paths.

**Assets to replace.** Wordmark paths, hero copy, colours.

## Effect 3: Product tile reveal and second-photo hover

**What it is.** Each photo is covered by a pale block (`#d2cac3`). When the tile scrolls into view the block slides off to the right while the photo un-zooms from 1.4 and slides in from -50 percent. On hover a second photo wipes in from the left with a bright over-exposed flash that settles to normal. Row 1 also lifts up from 75 percent. Source: `Item.js`, `FirstRowItemsReveal.js`, timelines 21 to 35. Label: measured (GSAP), source read (hover CSS).

**How to build.**

```html
<a class="tile group" href="/product/x" data-product>
  <div class="ph">                              <!-- position:relative; overflow:hidden -->
    <img data-image="front" src="front.jpg" alt="Name">
    <img data-image="back"  src="back.jpg"  alt="" class="back">
    <div class="cover"></div>                   <!-- position:absolute; inset:0; background:#d2cac3 -->
  </div>
  <div class="meta"><p>Name</p><p>$00.00</p></div>
</a>
```

```css
.tile .back {
  position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;
  transform: scale(1.2);
  clip-path: polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%);
  filter: brightness(400%) contrast(150%);
  transition: transform .5s cubic-bezier(.87,0,.13,1),
              clip-path .5s cubic-bezier(.87,0,.13,1),
              filter .5s cubic-bezier(.87,0,.13,1);
}
@media (hover: hover) {
  .tile:hover .back {
    transform: scale(1);
    clip-path: polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);
    filter: brightness(100%) contrast(100%);
  }
}
```

```js
// reveal on scroll, once per tile (IntersectionObserver threshold 0)
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target, cover = t.querySelector('.cover'), front = t.querySelector('[data-image=front]');
    const delay = parseFloat(t.dataset.delay || 0);           // row 1: 0, .12, .24, .36. other rows: 0, .2, .4
    gsap.timeline({ paused: true })
      .to(cover, { duration: 0.8, ease: 'expo.out', x: '100%', delay })
      .from(front, { scale: 1.4, x: '-50%', duration: 0.8, ease: 'expo.out' }, '<')
      .timeScale(0.85).play();
    io.unobserve(t);
  });
}, { threshold: 0 });
document.querySelectorAll('.ph').forEach(el => io.observe(el));

// row 1 lift, after the loader
gsap.fromTo('.row1 a', { autoAlpha: 0, y: '75%' },
  { autoAlpha: 1, y: '0%', duration: 1.2, delay: 0.6, ease: 'expo.out', stagger: { each: 0.08 } });
```

Effective reveal length is 0.8 / 0.85, about 0.94 s. Set `will-change: transform` during the tween and clear it after. Give the photo `overflow:hidden` on the wrapper so the zoom is clipped.

**Cost.** Low. About 30 lines of JS and 12 lines of CSS. It works with plain images and an `IntersectionObserver`.

**Assets to replace.** Product photos (two per product: front and back), cover colour if your ground changes.

## Effect 4: Difference-blend nav and three-theme switch

**What it is.** The fixed nav is coloured cyan with `mix-blend-mode: difference`. On the cream page cyan minus cream gives near-red, so it reads red. Over a dark photo it lightens. Three dots (black, cream, red) switch the theme; a small marker slides to the active dot. Source: `nav#header` classes, CSS, `default.js`. Label: source read (CSS), measured (marker tween).

**How to build.**

```css
:root { --cream:#ede4dd; --red:#ff0001; --black:#000; }
html[data-theme="red"]   body { background: var(--cream); color: var(--red); }
html[data-theme="light"] body { background: var(--cream); color: var(--black); }
html[data-theme="dark"]  body { background: var(--black); color: var(--cream); }

#header { position: fixed; inset: 0 0 auto 0; z-index: 3; mix-blend-mode: difference;
  color: var(--cream); opacity: 0; transform: translateY(-6rem);
  transition: opacity 2s cubic-bezier(.19,1,.22,1) .5s, transform 2s cubic-bezier(.19,1,.22,1) .5s; }
html[data-theme="red"] #header { color: #00bcdf; }          /* oklab(0.73 -0.14 -0.1) */
html.loaded #header { opacity: 1; transform: none; }
#header > div { transition: color .4s ease-in-out; }

.dot { width: 1.125rem; height: 1.125rem; border-radius: 9999px;
  box-shadow: inset 0 0 0 .05em currentColor; transition: all .2s ease-out; }
@media (hover:hover) { .dot:hover { scale: 1.1; } }
```

```js
function place(marker, dot, theme) {
  gsap.to(marker, {
    x: dot.offsetLeft + dot.offsetWidth / 2 - marker.offsetWidth / 2,
    y: dot.offsetTop + dot.offsetHeight / 2 - marker.offsetHeight / 2,
    backgroundColor: theme === 'light' ? '#000' : '#ede4dd',
    duration: 0.3, ease: 'power2.out' });
}
dots.forEach(d => d.addEventListener('click', () => {
  document.documentElement.dataset.theme = d.dataset.theme;
  localStorage.setItem('theme', d.dataset.theme);
  place(marker, d, d.dataset.theme);
}));
```

Set `data-theme` from `localStorage` in an inline script in `<head>` to avoid a flash. The marker is 4 px (`h-1 w-1`); dots are 18 px with a 4 px gap.

**Cost.** Low. CSS and about 15 lines of JS.

**Assets to replace.** The three theme colours; pick an accent that clears contrast (the original red on cream is 3.19:1). Tune the blend colour by testing it on your own ground: the trick only works when `difference(navColour, ground)` gives the colour you want.

## Effect 5: Page-transition curtain

**What it is.** On an internal link click, the page fades slightly, scales to 0.9 and slides up 16vh while a full-screen curtain wipes up from the bottom. Wordmark letters rise inside the curtain. Then the route swaps and the letters exit upward while the curtain wipes away upward. Source: `Providers.js`, `TransitionRouter.js`. Label: source read (not captured live).

**How to build.** Use a router that lets you await an exit animation (Next.js with a transition-router package, Barba, Swup, or your own fetch-and-swap). Keep a fixed `#layer` (`inset:0; z-index:3; clip-path: inset(100% 0 0 0)`) holding a `max-width: 14rem` wordmark SVG. Skip the intercept for external links, `target=_blank`, modifier keys, hash links and the current path.

```js
function leave(done) {
  return gsap.timeline({ onStart: () => document.documentElement.classList.remove('ready'), onComplete: done })
    .set('#layer', { autoAlpha: 1 })
    .to('#page', { autoAlpha: 0.9, duration: 0.2 })
    .to('#page', { scale: 0.9, transformOrigin: 'top', y: '-16vh', duration: 1, ease: 'power3.inOut' }, '<')
    .fromTo('#layer', { clipPath: 'inset(100% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1, ease: 'power3.inOut' }, '<')
    .fromTo('#layer path', { yPercent: 110 },
      { yPercent: 0, duration: 0.6, ease: 'power2.inOut', stagger: { each: 0.06, from: 'random' } }, '<20%');
}
function enter(done) {
  return gsap.timeline()
    .fromTo('#layer path', { autoAlpha: 1, yPercent: 0 },
      { yPercent: -110, duration: 0.6, ease: 'power2.inOut', stagger: { each: 0.06, from: 'random' } })
    .fromTo('#layer', { clipPath: 'inset(0% 0% 0% 0%)' },
      { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: 'power3.inOut' }, '<30%')
    .call(() => { document.documentElement.classList.add('ready'); done(); }, null, '<60%');
}
```

The leave animation takes about 1.6 s before the route can change, so it slows every click. Consider shortening for repeat visitors.

**Cost.** Medium. The tweens are simple; the router hook is the work.

**Assets to replace.** Wordmark, colours.

## Extra recipes

### Link underline draw (used on every text link)

```css
.link-hover:not([data-selected]) { position: relative; --ease: cubic-bezier(.83,0,.17,1); }
.link-hover:not([data-selected])::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -.1em;
  height: max(2px, .1em); background: currentColor;
  transform-origin: 0; transform: scaleX(0); transition: transform .5s var(--ease); }
@media (hover:hover) { .link-hover:not([data-selected]):hover::after { transform: scaleX(1); } }
.link-hover[data-selected]::after { content:""; position:absolute; left:0; right:0; bottom:-.1em; height:max(2px,.1em); background:currentColor; }
```

Source read. Cost: Low. No assets.

### Custom cursor with "View More" disc

```js
const cur = document.querySelector('.cursor > div'); let moved = false;
addEventListener('mousemove', e => {
  gsap.to(cur, { x: e.clientX, y: e.clientY, duration: moved ? 0.8 : 0, ease: 'expo.out' });
  moved = true;
});
document.querySelectorAll('[data-cursor="text"]').forEach(el => {
  el.addEventListener('mouseenter', () => dot.classList.add('is-text'));
  el.addEventListener('mouseleave', () => dot.classList.remove('is-text'));
});
```

```css
.dot { width: 8px; height: 8px; margin: -4px 0 0 -4px; border-radius: 9999px; background: var(--cursor, #ff0001);
  transition: width .2s ease-in-out, height .2s ease-in-out, margin .2s ease-in-out, opacity .2s ease-in-out; }
.dot.is-text { width: 100px; height: 100px; margin: -50px 0 0 -50px; color: #ede4dd;
  display: grid; place-items: center; }
.dot.is-text::after { content: "View More"; font: 500 12px/1 var(--font); text-transform: uppercase;
  animation: fadeIn .4s ease-in-out; }
@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
```

Disable when `(hover:none) and (pointer:coarse)` or width is 768 or less. Wrapper: `position:fixed; z-index:9999; pointer-events:none`. Label: source read. Cost: Low. The original never hides the native cursor with CSS that we found; decide for yourself. Optional ring state (`data-cursor="grab"`): 50 px, 1 px red border, `rgb(0 0 0 / 10%)` fill.

### Smooth scroll (Lenis) with GSAP

```js
const lenis = new Lenis();                     // defaults: lerp 0.1, smoothWheel true, syncTouch false
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add(t => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

Per frame Lenis moves `value = (1 - k) * value + k * target` with `k = 1 - exp(-60 * 0.1 * dt)`. Stop it while a menu is open and during the preloader, restart 0.8 s after the preloader ends. Label: source read. Cost: Low. Note the site has nothing scroll-linked, so Lenis is optional; leave it out if you want the lightest page.

### Big footer type

`Made to be worn.` block: `font-size: 6vw; line-height: 1; letter-spacing: -0.05em; font-weight: 900` (renders the bold file). Giant year: `12.75vw`, same line height and tracking. On phones use `2.75rem` and `45vw`. The second line of the statement swaps to the accent colour in the red theme and to `#5A5A5A` in the other two. Label: source read. Cost: Low.

### Arrow button (checkout)

Two copies of an arrow icon, one parked at `-1em` (absolute, left) and one at rest; on hover the text and the resting arrow slide `1em` right and the parked arrow slides in. Timing `500ms`, `cubic-bezier(0.8,-0.01,0.34,1.01)`. Label: source read. Cost: Low.

## Fonts

The site uses one family in three files. Fonts are not in this pack.

| Site font | Files and weight slots | Licence | Two free lookalikes |
|---|---|---|---|
| Neue Haas Grotesk Text Pro (Monotype / Linotype) | Regular = 400, Medium = 700 slot, Bold = 800 slot | **Paid** (commercial web licence) | **Inter Tight** (Google Fonts, variable, weights 100 to 900, tighter than Inter and close in width once tracked at -0.025em). **Switzer** (Fontshare, free for commercial use, a Helvetica-style grotesk). Spare options: Hanken Grotesk (Google Fonts), Instrument Sans (Google Fonts) |

Setup advice for the lookalikes:
- Keep the same weight mapping so the type feels the same: body 400, bold copy at the medium weight, giant type at the bold weight. Inter Tight has all three; Switzer has Regular, Medium and Bold.
- Keep the site's tracking (`-0.025em` on nav and paragraphs, `-0.05em` on giant type) and line height 1 for display sizes, then check widths: both alternatives are a little different from Neue Haas, so re-check the 6vw and 12.75vw footer lines for wrapping.
- Fallback stack: `font-family: "Inter Tight", "Switzer", Arial, sans-serif;` The original falls back to Arial with `size-adjust: 104.95%`, `ascent-override: 93.19%`, `descent-override: 23.34%`, `line-gap-override: 0%`, which you can copy to reduce layout shift.
- Check the licence of any font you choose before shipping. Google Fonts are open licences (OFL); Fontshare fonts are free for commercial use under the Fontshare licence.
