# Spring/Summer recipes

How to rebuild each signature effect in plain HTML, CSS and JS (GSAP where the site uses it). Numbers are the site's own, labelled in `teardown.md` (source read unless noted). Replace all copy, colours, logos, photos and video with your own. Do not reuse the site's assets.

Shared setup used by several recipes:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/gsap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.13.0/CustomEase.min.js"></script>
```

```css
:root{
  --grid-margin: 1rem; --grid-gap: 1rem; --sidebar-width: 100%;
  --theme-transition-duration: .4s; --theme-transition-ease: ease-out;
  --theme-transition: var(--theme-transition-duration) var(--theme-transition-ease);
  --br: .2rem;
}
html{ font-size: max(20px, calc(8px + .83333vw)); overflow-x: hidden; }
@media (min-width:900px){ :root{ --grid-margin: 2.7rem; --sidebar-width: 12.5rem; } }
body{
  --text-color: var(--theme-text-color, 0 0% 0%);
  --background-color: var(--theme-background-color, 0 0% 100%);
  background-color: hsl(var(--background-color)); color: hsl(var(--text-color));
  transition: color var(--theme-transition), background-color var(--theme-transition);
  overscroll-behavior-y: none;
}
```

---

## Effect 1: Row-driven theme swap

**What it is.** The body background and text colour change when a row of the page crosses the vertical middle of the viewport. Nothing is scroll-scrubbed. The change is a plain CSS transition on two variables. The site keeps the theme in the CMS per row.

**How to build.** Give each section `data-text` and `data-bg` as `"H S% L%"` triplets. On scroll and resize pick the last section whose box contains the viewport midpoint. If none does, use the page default. At scroll 0 the section marked `data-top` wins.

```js
const DEFAULT = { text: '12 33% 3%', bg: '49 14% 85%' };      // site's default (replace)
const rows = [...document.querySelectorAll('[data-theme-row]')];
const half = () => innerHeight / 2;

function pick() {
  let hit = null;
  for (const el of rows) {                                   // "last match wins"
    const r = el.getBoundingClientRect();
    const isTop = scrollY === 0 && el.hasAttribute('data-top') && r.top <= 0;
    if (isTop || ((r.top <= 0 ? 0 : r.top) <= half() && r.bottom >= half())) hit = el;
  }
  const t = hit ? { text: hit.dataset.text, bg: hit.dataset.bg } : DEFAULT;
  document.body.style.setProperty('--theme-text-color', t.text);
  document.body.style.setProperty('--theme-background-color', t.bg);
}
let tick;                                                    // site throttles scroll to 30 ms
addEventListener('scroll', () => { clearTimeout(tick); tick = setTimeout(pick, 30); }, { passive: true });
addEventListener('resize', pick); pick();
```

Optional, touch only (below 1200): lerp the browser `theme-color` meta. Each frame add `.06` to `t`, mix the old hex to the new one, stop at `t >= 1` (about 17 frames).

**Real numbers.** Transition `.4s ease-out` on `color, background-color`. Site palette: ink hsl(12 33% 3%), red hsl(360 99% 61%), paper hsl(49 14% 85%). Row order: red on paper (4 rows), ink on paper (4 rows), paper on red (2 rows), then default.

**Cost.** Low. About 40 lines JS, no library.

**Replace.** All colours. Check contrast: the site's red on paper is 2.61, do not use that pair for body text.

---

## Effect 2: Word-cycling loader into a curtain wipe

**What it is.** On first load a centred stack reads "Creating / [word] / All seasons". The word swaps every 0.2 s through nine words. Then a curtain and the loader slide down together and the page drops in from 10vh above.

**How to build.** Two fixed layers: the loader (z 20000, text colour = theme text) and a curtain (z 19000, background = theme background, shadow). Hide the page until the loader mounts.

```html
<div class="loader"><h2>Creating</h2>
  <div class="middle-line"><div class="lines">Word one</div><div class="lines">Word two</div><!-- ... --></div>
  <h2>All seasons</h2></div>
```

```css
.loader{position:fixed;inset:0;height:100dvh;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:20000;color:hsl(var(--text-color))}
.loader h2{font:40px/.75 "YourDisplay",Impact,sans-serif;text-transform:uppercase}
.middle-line{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px}
.lines{position:absolute;opacity:0;display:flex;align-items:center}
.overlay-wipe{position:fixed;inset:0;width:100vw;height:100vh;z-index:19000;
  box-shadow:0 0 50px rgba(0,0,0,.1)}
```

```js
gsap.registerPlugin(CustomEase);
const ease = CustomEase.create('custom', '0.5, 0, 0, 1');    // site: cubic-bezier(.5,0,0,1)
const D = 2, wordGap = 0.2;                                  // duration 2 s, 0.2 s between words

const wipe = Object.assign(document.createElement('div'), { className: 'overlay-wipe' });
wipe.style.background = getComputedStyle(document.body).backgroundColor;
document.body.append(wipe);

const tl = gsap.timeline({ paused: true });
tl.to(wipe,   { duration: D / 1.3, ease, y: '100vh' })                       // 1.538 s (measured)
  .to('.loader', { duration: D / 1.9, ease: 'power2.inOut', y: '100vh' }, '<') // 1.053 s (measured)
  .to('.loader', { duration: .6, ease: 'power2.inOut', opacity: 0 }, '<');

const page = gsap.from(['.page', '.top-bar'], { duration: D, ease, y: '-10vh', paused: true,
  onComplete: () => gsap.set(['.page', '.top-bar'], { clearProps: 'all' }) });

const words = gsap.utils.toArray('.lines'); let i = 0;
setTimeout(function next() {                                 // site waits 600 ms before starting
  words[i - 1] && (words[i - 1].style.opacity = 0);
  words[i].style.opacity = 1;                                // wordChangeDuration is 0: instant
  if (++i < words.length) setTimeout(next, wordGap * 1000);
  else setTimeout(() => { tl.play(); page.play(); }, 300);   // 300 ms after the last word
}, 600);
```

Total from mount: 0.6 + 8 x 0.2 + 0.3 + 2 = 4.5 s. Cloud-run timings were slower.

**Cost.** Medium. About 60 lines plus GSAP. Real cost is the copy and the icon set (each word has a small SVG in a 27 px chip, 33 px left of the word).

**Replace.** Words, icons, colours, font. For a shop, shorten it, run it once per session, and skip it under `prefers-reduced-motion` (the site does not).

---

## Effect 3: Giant headline plus lerped parallax card

**What it is.** "WE WON" is set at 34 grid units wide (386.24 px at 1440), two lines, line height .7502. A rounded looping video card sits at column 8 and drifts slower than the page.

**How to build.**

```css
:root{ --grid-vw: calc((100vw - var(--sidebar-width) - var(--grid-margin)) / 100); }
.hero-title{ font: calc(var(--grid-vw) * 34)/.7502 "YourDisplay",Impact,sans-serif; text-transform: uppercase; letter-spacing: 0; }
@media (max-width:899px){ .hero-title{ line-height:.78; letter-spacing:-.01em } }  /* sidebar term = 100% of parent font */
.hero{ position: relative; }
.hero .card{ position:absolute; top:0; left: calc(96px * 7); width: calc(96px * 5 - 16px);   /* col step 96 at 1440 */
  padding-top: 7.5rem; transform: translateY(-12%); border-radius: .2rem; overflow: hidden; opacity: 0; }
.hero .card.loaded{ opacity: 1; transition: opacity var(--theme-transition); }
```

Parallax loop (the site's exact formula):

```js
const lerp = (a, b, t) => (1 - t) * a + t * b;
let smooth = scrollY;
const items = [{ el: document.querySelector('.hero .card'), amount: -0.3, inTop: true }];
function frame() {
  smooth = lerp(smooth, scrollY, .05);                       // 0.05 per frame
  for (const it of items) {
    const r = it.el.getBoundingClientRect();
    let k = it.inTop ? -smooth / innerHeight
                     : (r.top + r.height / 2 - innerHeight / 2) / (innerHeight / 2 + r.height / 2);
    k = Math.max(-2, Math.min(2, k));
    it.el.style.transform = `translateY(${k * it.amount * 25}vmin)`;
  }
  if (Math.round(smooth * 2) / 2 !== Math.round(scrollY * 2) / 2) requestAnimationFrame(frame);
}
addEventListener('scroll', () => requestAnimationFrame(frame), { passive: true });
setTimeout(() => it0.el.classList.add('loaded'), 200);       // reveal 200 ms after registering
```

The video card's inline `translateY(-12%)` in the site is on a parent, so it does not fight the parallax transform.

**Real numbers.** Sizes at 1920: 528.768 px, at 1024: 244.8 px, at 390: 120.02 px (all measured). Amount -0.3, factor 25 vmin, lerp .05.

**Cost.** Low to medium.

**Replace.** Video or photo, headline text, font.

---

## Effect 4: Glass widget column with scroll lag

**What it is.** Small glass cards (link, newsletter) sit in the right sidebar. Each is positioned with `translateY` from a lerp, and nudged by how fast you scroll, scaled by its index, so the stack rubber-bands.

**How to build.** Style the card, then run one rAF loop.

```css
.widget{ backdrop-filter: blur(10px); border: 1px solid hsl(var(--text-color) / .2);
  border-radius: var(--br); padding: .7rem; display: grid; gap: .5rem;
  color: hsl(var(--text-color)); transition: color var(--theme-transition), opacity var(--theme-transition); }
.widget-bar{ position: absolute; right: 0; width: var(--sidebar-width); padding: 0 1rem; display: grid; gap: .5rem; }
```

```js
const GAP = Math.max(10, 10 + 10 * .6 * (innerWidth - 1440) / 1440);   // 10 px at 1440
let last = scrollY, widgets = [...document.querySelectorAll('.widget')].map((el, idx) => ({ el, idx, pos: null }));
function step() {
  const delta = last - Math.max(0, scrollY); last = Math.max(0, scrollY);
  let busy = false, prevH = 52;                              // header allowance = 5.2 x gap
  for (const w of widgets) {
    const target = prevH + GAP * w.idx;
    const goal = target + delta * (w.idx * .05);             // desktop factor
    w.pos = (1 - .1) * (w.pos ?? target) + .1 * goal;        // lerp 0.1
    w.el.style.position = 'fixed'; w.el.style.transform = `translateY(${w.pos}px)`;
    busy ||= Math.round(w.pos * 2) !== Math.round(target * 2);
    prevH += w.el.offsetHeight;
  }
  if (busy) requestAnimationFrame(step);
}
addEventListener('scroll', () => requestAnimationFrame(step), { passive: true });
```

The site also leaves a widget in normal flow ("idle") while its row is still below its slot, and on phones turns the stack into a bottom sheet (cards at `100vh - 50 px`, scale `1 - .035 x depth`, opens on a 100 px pull). Build those only if you need them.

**Real numbers.** Blur 10 px, border 20 percent, radius .2rem, padding .7rem, gap .5rem, sidebar 12.5rem, widget lerp .1, factor idx x .05.

**Cost.** Medium to high for the full behaviour. Low if you only copy the glass look.

**Replace.** Card content, icons.

---

## Effect 5: Route transitions (curtain and case expand)

**What it is.** Two transitions. The default is a themed curtain. Clicking a case teaser expands it to full bleed instead.

**Default curtain (900 and up).**

```js
async function leave(page, themeBg, scrollY) {
  const wipe = Object.assign(document.createElement('div'), { className: 'overlay-wipe' });
  Object.assign(wipe.style, { position:'fixed', width:'100vw', height:'120vh', top:0, left:0, zIndex:19,
    transform:'translateY(calc(-120vh - 1px))', background: themeBg, outline:'1px solid rgba(255,255,255,.3)' });
  document.body.append(wipe);
  const t = innerWidth < 1200 ? .5 : .8;                     // seconds
  const top = scrollY + 'px', bottom = scrollY + innerHeight + 'px';
  page.style.transition = `all ${t}s cubic-bezier(.32,0,.67,0)`;
  page.style.transform = 'translateY(10vh)';
  page.style.clipPath = `polygon(0vw ${bottom},100vw ${bottom},100vw ${bottom},0vw ${bottom})`;
  wipe.style.transition = `transform ${t}s cubic-bezier(.32,0,.67,0)`; wipe.style.transform = 'translateY(10vh)';
  await new Promise(r => setTimeout(r, (t + t) * 1000));
  return wipe;
}
async function enter(newPage, wipe) {
  const t = innerWidth < 1200 ? .5 : 1;
  newPage.style.transform = 'translateY(-10vh)';
  await new Promise(r => setTimeout(r, (innerWidth < 1200 ? .5 : .8) * 1000));
  newPage.style.transition = `transform ${t}s cubic-bezier(.33,1,.68,1)`; newPage.style.transform = 'translateY(0)';
  wipe.style.transition = `all ${t}s cubic-bezier(.33,1,.68,1)`; wipe.style.transform = 'translateY(120vh)';
  await new Promise(r => setTimeout(r, t * 1000)); wipe.remove();
}
```

Below 900 the site drops this and just fades the page: `opacity` 600 ms `cubic-bezier(.33,1,.68,1)`, out then in.

**Case expand.** Move the clicked card to `body` as `position:fixed` at its current rect, then animate it to cover the viewport (aspect-fit) in `.8s cubic-bezier(.5,0,0,1)` while its text fades in `.4s`. On the next page split the `h1` into inline-block letters, start each at `opacity:0; translateY(-50%)`, and animate over `1.1s cubic-bezier(.5,0,0,1)` with `delay = Math.random() * .25` seconds. Move the media block from its old top to the new one over 1.1 s, and start the foreground layer 1.1 / 25 s later. Copy video `currentTime` across so playback does not restart.

**Cost.** Default curtain: medium. Case expand: high. Needs a router with leave and enter hooks.

**Replace.** Everything visual. Keep the letter-split and random delay if you want the same feel.

---

## Small details worth borrowing (no separate effect)

```css
/* underline that draws on hover, 0.75 px, .5 s */
.link-title{ background: linear-gradient(currentColor,currentColor) 0 100% no-repeat;
  background-size: var(--line-size,0%) .75px; transition: background-size .5s; }
.link:hover{ --line-size: 100%; }
.link:hover svg{ transform: scale(1.2); } .link svg{ transition: transform .2s; }
@media (max-width:899px){ .link-title{ --line-size:100% } }

/* bracket frame: only the top half of a 1 px box */
.bracket{ border:1px solid hsl(var(--text-color)/.3); border-radius:.2rem; height:1.2rem;
  mask-image: linear-gradient(#000 50%, transparent 0); }

/* footer heading pan, width set from JS in px */
@keyframes sweep{ to{ transform: translate(min(0px, calc(1136px - 100%))) } }   /* 1136 = content width at 1440 */
.sweep{ animation: sweep calc(var(--width) * 4ms) infinite alternate ease-in-out; width: fit-content; }

/* focus ring */
a:focus-visible, button:focus-visible{ outline:2px solid #1e90ff; outline-offset:.25rem; }

/* carousel */
.slide{ opacity:.3; transition: opacity .5s ease-in-out; }
.swiper-slide-active, .swiper-slide-next{ opacity:1 }
.swiper-slide-prev{ opacity:0; transition-delay:1s }
```

Swiper options: `slidesPerView:'auto', loop:true, speed:1300, autoplay:{delay:3000, disableOnInteraction:true}, mousewheel:{forceToAxis:true}`.

---

## Fonts

The site's three brand faces are all paid (Pangram Pangram). Fonts are not in the pack. Lookalikes below are on Google Fonts or Fontshare and free for commercial use. They are close in feel, not identical.

| Site font | Role | Status | Free lookalike 1 | Free lookalike 2 |
|---|---|---|---|---|
| PP Right Grotesk Compact Black | Display, uppercase headlines | Paid | Anton (Google Fonts) | League Gothic (Google Fonts) |
| PP Neue Montreal Regular | Body | Paid | General Sans (Fontshare) | Instrument Sans (Google Fonts) |
| PP Supply Mono Light | Labels, links, inputs | Paid | DM Mono Light (Google Fonts) | IBM Plex Mono Light (Google Fonts) |
| Noto Sans TC | Chinese fallback, not loaded on home | Free | Use Noto Sans TC itself | n/a |

Notes: Anton and League Gothic are narrower than Compact Black at the same size, so retune the `34` grid-unit multiplier by eye. Neue Montreal has a single weight on the site, so pick one weight of the lookalike and avoid synthesised bold.
