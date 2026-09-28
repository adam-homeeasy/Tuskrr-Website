# Rebuild recipes

These are written for our stack: plain HTML, CSS and JS, GSAP 3 (ScrollTrigger and SplitText are free now), Lenis, and three.js. The mechanics and numbers come from the teardown. **None of the site's assets carry over.** The can model, label art, photos and Klim fonts all belong to STILL or Klim.

## 1. Hero lens

**What it is:** a dark layer clipped to a circle that follows the cursor, sitting over a light layer with the wordmark. The circle's size comes from four inputs added together.

**Build:**

- **Stack the layers:** a light layer (the wordmark) with `pointer-events: none`, a dark layer on top of it with `clip-path: circle(0px at 50% 48%)`, and a rim ring div above both.
- **Keep one state object:** `{x, y, entrance: 0, swell: 0, breath: 0, scrollBoost: 0}`.
- **Follow the mouse:** `gsap.quickTo(state, 'x', {duration: 0.62, ease: 'power2.out'})`, and the same for y.
- **Breathe:** `gsap.to(state, {breath: 9, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut'})`.
- **Swell on each pointermove:**
  - work out the speed in px/s,
  - `swell = min(130, speed / 2200 * 130)`,
  - tween it up over 0.3 s,
  - then use a delayed call to tween it back to 0 over 1.1 s after 0.3 s of no movement.
- **Open on load:** `gsap.to(state, {entrance: 1, duration: 1.2, delay: 0.15, ease: 'power2.inOut'})`.
- **Update every frame** with `gsap.ticker.add`:
  - `r = 170*entrance + swell + breath*entrance + scrollBoost`
  - `dark.style.clipPath = circle(r px at x px y px)`
  - ring transform: `translate(x, y) scale(r / 170)`
  - ring opacity: `entrance * (1 - scrollBoost / 240)`
- **Scroll:** pin the hero for `+=120%` with `scrub: true`. Tween `scrollBoost` to `1.2 * hypot(innerWidth, innerHeight)` over the first 55% (`power2.in`). Fade the light layer out between 48% and 63%.
- **Guard it:** only run on `(pointer: fine)` and when reduced motion is off. On phones, show the dark layer plainly.

**Cost:** cheap. The clip-path repaints one layer each frame, which runs fine at 60 fps. The 3D object inside is optional: a large product photo or a looping video works too.

## 2. Preloader wordmark handoff

**Build:**

- **The overlay:** a fixed bone div with a small wordmark and some looping pills. Each pill:
  - pops in from `scale .55, y 10, rot ±3.5, blur(8px)` over 0.45 s `back.out(1.6)`,
  - floats up 6 px over 0.95 s,
  - leaves to `y -18, scale .94, blur(5px)` over 0.32 s,
  - with a new pill every 0.42 s.
- **Lock scroll** while it's up: `lenis.stop()`, plus blocking wheel and touchmove events.
- **When assets are ready:**
  1. measure both wordmarks with `getBoundingClientRect`,
  2. work out the scale from the width ratio, and the x and y from the centre difference,
  3. `gsap.to(small, {x, y, scale, duration: .9, ease: 'power3.inOut'})`,
  4. fade the overlay over the last 0.35 s,
  5. `lenis.start()`.

## 3. Pinned product stage with snapping

**Build:**

- `ScrollTrigger.create({trigger, start: 'top top', end: () => '+=' + N*innerHeight, pin: true, scrub: 1, snap: {snapTo: [0, 1/N, …, 1], duration: {min: .25, max: .55}, ease: 'power2.inOut', delay: .1}})`
- **Hysteresis:** when working out the active index in `onUpdate`, only switch once progress is 0.05 past a boundary. This stops flicker at the snap points.
- **On index change:**
  - bring the new item in from the alternating side (`x ±3 units` or `±200px`, rotate `∓0.16 rad` or `∓9°`, scale .94 → 1, 0.85 s `power2.out`),
  - send the old item out the other way (0.45 s `power2.in`),
  - crossfade the colour glow (0.8 s),
  - fade the ghost number and drift it 40 px in the scroll direction,
  - swap the copy with a short out (0.25 s) and in (0.45 s), staggering its lines.
- **Dot nav:** `lenis.scrollTo(pinStart + (pinEnd - pinStart) * i / N, {duration: 1})`.
- **Phones:** skip the pin and use a CSS `scroll-snap` carousel instead.

## 4. Scroll-speed marquee

**Build:**

- Two tracks, each holding the list twice. One uses `gsap.to(track, {xPercent: -50, duration: 38, ease: 'none', repeat: -1})`, the other `fromTo(xPercent -50 → 0, 52s)`.
- Add a ScrollTrigger over the section with an `onUpdate(self)` handler:
  - `v = self.getVelocity()`
  - `skew = clamp(-6, 6, -v / 420)`: set it directly, then tween it back to 0 over 0.9 s
  - `factor = clamp(1, 4, 1 + abs(v) / 1200)`: tween both marquees' `timeScale` to it over 0.4 s, then back to 1 over 1.4 s after a 0.4 s delay.

## 5. Text reveals

- **Masked line, word or character rise:**
  - `SplitText.create(el, {type: 'lines', mask: 'lines', autoSplit: true})`,
  - animate from `yPercent 115` to 0,
  - lines take 0.9 s with a .09 stagger, characters take 0.8 s with a .02 stagger, all `power2.out`,
  - trigger once when the element's top reaches 85% of the screen.
- **Illuminate:**
  - split into words and set them to opacity 0.24,
  - `gsap.to(words, {opacity: 1, stagger: .35, ease: 'none', scrollTrigger: {start: 'top 82%', end: 'top 34%', scrub: true}})`.

## 6. The 3D can look (for any product)

- **Renderer:** ACES Filmic tone mapping at exposure 1.05, and a small studio HDRI for reflections only.
- **Lights:** ambient 0.15, key at (4, 6, 5) intensity 1.4 casting a shadow, fill at (-4, 2, 3) intensity 0.5, rim at (0, 4, -5) intensity 1.2.
- **Label:** roughness .65, metalness .05. **Metal:** `#c8c8c8`, roughness .42, metalness .95.
- **Contact shadow:** drei's `<ContactShadows opacity={.32} scale={4} blur={2} far={2} resolution={512} color="#1a1b1d" />`, or the plain three.js equivalent.
- **Idle:** bob 0.06 units on a 6 s sine. **Section control:** ease rotation toward a target at 0.06 per frame.
- **Our replacement:** our own can or product model. A GLB can in the look library would make this reusable.

## 7. Custom cursor

- A 6 px dot and a 36 px ring, both `mix-blend-mode: difference`.
- `quickTo` durations: 0.08 s for the dot, 0.45 s for the ring.
- Over links, the ring grows to 56 px and the dot shrinks to half. A labelled state is a 76 px dark filled circle.
- Only on `(pointer: fine)`.

## 8. Fonts

The site uses Söhne, Söhne Breit and Tiempos from Klim, which are paid. Pick one:

- **License them** from Klim: best match, and it costs money.
- **Free lookalikes:**
  - Tiempos Headline → **Newsreader** or **Source Serif 4** (light weight)
  - Söhne → **Inter** or **Geist**
  - Söhne Breit → **Unbounded** or **Archivo Expanded** (wide weights)

You decide which. I haven't embedded any font.
