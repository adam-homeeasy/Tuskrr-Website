# drinkstill.nz teardown

Measured on the live site on 28 Sep 2026, in a cloud Chromium at 1440×900, plus fresh loads at 390 and 820 wide. Values come from four places, and each one is labelled:

- **Measured:** read from the running page (computed styles, GSAP's own tween and trigger objects, the three.js scene graph, the network log).
- **Source read:** read from the site's shipped JavaScript. It's minified but readable, so these are the exact numbers the developer typed.
- **Screenshot:** seen in screenshots or the recorded video.
- **Cloud-measured:** true in the cloud browser, but it has no graphics card, so speed numbers will be worse than on a real laptop.

## Summary

- **What it is:** a one-page brand site for STILL, a caffeine-free focus drink from Wellington. It won an Awwwards Honors badge (pinned on the right edge).
- **Built with:** Next.js (Turbopack build) on Vercel. GSAP 3 with ScrollTrigger, SplitText and DrawSVG. Lenis 1.3.23 for smooth scroll. three.js r184 through React Three Fiber, with 3 WebGL canvases. Tailwind CSS.
- **Fonts:** Klim Type Foundry's Söhne, Söhne Breit, Tiempos Headline and Tiempos Text. **All four are paid fonts.** You'd need to license them or pick free lookalikes (see recipes).
- **Page height:** 18,794 px at 1440 wide, because three sections are pinned (held in place while you keep scrolling). At 390 wide it's about 10,600 px, since the phone layout drops the pins.

### Five signature effects, ranked by how much they add

| # | Effect | What it does | Rebuild cost |
|---|---|---|---|
| 1 | Hero lens | A dark circle follows the cursor over a light "STILL." wordmark and shows a 3D can inside it. The circle swells when you move the mouse fast, breathes slowly, and grows to fill the screen as you scroll. | Medium. It's a CSS `clip-path: circle()` updated every frame, plus one three.js can. |
| 2 | Preloader that flies into the hero | Ingredient pills pop in and out around a small "STILL" wordmark while assets load, then the wordmark scales and moves into the giant hero wordmark. | Low to medium. It's a GSAP timeline plus one measured move-and-scale (the FLIP technique). |
| 3 | Pinned flavour stage | The section holds still for 3 screens of scrolling. Each flavour's 3D can slides in from alternating sides, its colour glow crossfades, a giant outlined number fades behind it, and the scroll snaps to each flavour. | Medium. |
| 4 | Pinned "Inside" ingredient stage | The same pin-and-snap idea over 4 screens. The can turns a quarter each step, ingredient icons draw themselves line by line, and a dose bar and counter fill up. | Medium. |
| 5 | Scroll-speed marquees | Two press-name tickers run in opposite directions. Scroll fast and they speed up (up to 4×) and lean over (up to 6°), then settle back. | Low. |

## 1. Page map (desktop, 1440×900)

| # | Section | Pixel range | Background | Pinned? | What it is |
|---|---|---|---|---|---|
| 0 | Preloader | fixed overlay | bone `#efede6` | n/a | Scroll is locked while it runs. Covered in section 5. |
| 1 | Hero `#hero` | 0 to 1,980 | bone wordmark layer over ink `#1a1b1d` | Yes, for 120% of the screen height (1,080 px) | The lens effect. |
| 2 | Flavours `#flavors` | 1,980 to 5,580 | bone | Yes, for 3 screens (2,700 px), snapping at 0, ⅓, ⅔ and 1 | "Three formulations." Clear, Dawn and Dusk. |
| 3 | Inside `#inside` | 5,580 to 9,180 (plus a short tail to about 10,000) | ink | Yes, for 4 screens (3,600 px), snapping at quarters | "Inside." Four ingredients. |
| 4 | Story `#story` | 10,080 to 15,120 | bone | Yes, for 4.6 screens (4,140 px), with 6 snap points | "Quietly built over five years." Five chapters, 2021 to 2025. |
| 5 | Press `#press` | 15,120 to 16,015 | ink | No | "Quietly noticed." Three quotes and two marquees. |
| 6 | Where available `#shop` | 16,015 to 18,142 | bone | No | Stockists in 3 cities, "coming soon" cities, and 3 product cards. |
| 7 | Footer | 18,142 to 18,794 | bone | No | Newsletter sign-up and links. |

Other routes: `/privacy` and `/terms` are plain text pages. The 404 page returns a real 404 status and shows "Be still." with a pale blue glow and a "Return home" button.

### Colour rhythm

Read from the actual screenshot pixels, sampled at 5 heights in the viewport every 300 px of scroll:

**bone → ink → bone → ink → bone → ink → bone**

- The hero starts bone, because the wordmark layer sits on top. It turns fully ink between scroll 300 and 600, as the lens grows to fill the screen.
- Hero to Flavours: bone rises from the bottom of the screen at about 1,200 and fills it by 2,100.
- Flavours to Inside: ink rises from about 4,800 and fills the screen by 5,700.
- Inside to Story: bone rises from about 9,300 and fills it by 10,200.
- Story to Press: ink from 14,400 to 15,000.
- Press to Shop: bone from 15,300 to 16,200. It then stays bone to the end.

These are all normal scroll-overs with no colour fades. The pinned sections just make the dark and light blocks last longer.

**Lesson for the skill:** the first colour pass read the hero wrong. The browser's "what's under this point" check skips any layer marked `pointer-events: none`, and the hero's bone wordmark layer is marked that way. Reading pixels from screenshots got it right.

## 2. Colours (exact)

| Token | Value | Used for |
|---|---|---|
| ink | `#1a1b1d` | Main text, dark sections, buttons, the hero's revealed layer |
| bone | `#efede6` | Light sections, text on dark |
| mist | `#6a6965` | Secondary labels, nav links, eyebrows (small labels above headings) |
| alpine | `#1e423e` | Dark green. The square after the wordmark, the free-shipping bar fill, and the hover colour on "Add to cart" and "Checkout". |
| clear | `#bcd3d8` | Pale blue. Flavour 01 glow, the full stop in "STILL.", divider rules, and the scroll-cue dot. |
| dawn | `#e8c9a0` | Flavour 02 glow |
| dusk | `#c9b5c8` | Flavour 03 glow, and the Rhodiola halo |
| Lion's Mane halo | `#d4b896` | Inside section |
| Bacopa halo | `#b5c8b0` | Inside section |
| nav when scrolled | `rgba(239,237,230,0.92)` + `backdrop-filter: blur(20px)` + a 1px `rgba(140,139,134,0.4)` bottom border | Nav after 80 px of scroll |
| hairline | `rgba(140,139,134,0.4)` | Card borders, the drawer edge |
| bone at 15% on ink | `oklab(... / 0.15)` | Dividers in dark sections |
| error | `#9a4a3f` | Form error text |

### Glows (the "Bloom" component)

- **Strong:** `radial-gradient(circle, c 0%, c·ee 18%, c·b3 35%, c·66 55%, c·26 75%, c·00 92%)`, with `blur(2px)` and opacity 0.92. (`c·ee` means the colour with hex alpha `ee`, which is about 93%.)
- **Soft:** `radial-gradient(circle, c 0%, c·cc 20%, c·66 45%, c·1f 65%, c·00 80%)`, with `blur(6px)` and opacity 0.85.
- **Motion:** it always breathes. Scale goes from 0.95 to 1.05 and opacity from its base to 1, over 2 s each way, `sine.inOut`, forever.

## 3. Type

| Role | Font | Desktop size | Line height | Tracking | Notes |
|---|---|---|---|---|---|
| Hero wordmark "STILL." | Söhne Breit 800 | 23vw (331 px at 1440) | 0.78 | -0.03em | Measured. The full stop is in clear `#bcd3d8`. |
| Section display (e.g. "Quietly built…") | Tiempos Headline 300 | 72 px | 1.05 | -0.01em | Measured |
| Flavour name ("Clear.") | Tiempos Headline 300 | `clamp(52px, min(7.6vw, 12vh), 128px)` | 0.92 | n/a | Source read. The full stop takes the flavour colour. |
| Section heading ("Three formulations.") | Tiempos Headline 300 | `clamp(32px, min(4.6vw, 6.5vh), 64px)` | n/a | n/a | Source read (58.5 px measured at 1440×900) |
| "Inside." | Tiempos Headline 300 italic | `clamp(36px, 4.4vw, 56px)` | 1.2 | n/a | Source read |
| Loud headings ("QUIETLY NOTICED.", "FIND STILL…") | Söhne Breit 900, uppercase | `clamp(30px, 4.2vw, 56px)` | 0.9 | -0.03em | Source read |
| Ingredient names ("L-THEANINE") | Söhne Breit 900, uppercase | 32 to 36.5 px | 0.9 | -0.03em | Measured |
| Ghost numbers (flavour and year watermarks) | Söhne Breit 800 | `clamp(260px, 26vw, 430px)` for flavours, `clamp(340px, 40vw, 640px)` for story years | 1 | -0.02em | Transparent fill with a `1.5px rgba(26,27,29,0.08)` outline |
| Body | Söhne 400 | 16 px (hero), 15 px, 14 px | 1.65 | 0 | Measured |
| Eyebrows ("02 / THREE FLAVORS") | Söhne 400 to 500, uppercase | 12 to 13 px | 1.65 | 0.2em to 0.6em | Measured |
| Micro labels ("SOURCE", "FIG. 01") | Söhne 400, uppercase | 10 to 11 px | 1.65 | 0.24em | Measured |
| Quotes | Tiempos Text 400 italic | 20 px | 1.45 | n/a | Measured |
| Marquee names | Tiempos Headline 300 | `clamp(28px, 3.4vw, 50px)` solid, `clamp(22px, 2.6vw, 38px)` outline | n/a | n/a | Source read |
| Nav links | Söhne 400 | 14 px | n/a | 0.04em | Measured |

**The pairing:** Tiempos, a sharp serif, carries the quiet headlines. Söhne Breit, a very wide bold grotesk, shouts the brand words. Söhne handles all the small uppercase labels, which have wide letter spacing. This contrast is most of the brand's look.

## 4. Components

- **Nav:**
  - Fixed, 72 px tall on desktop and 56 on mobile. Transparent over the hero.
  - After 80 px of scroll it gets the frosted bone background above. The change is a 400 ms ease-out CSS transition.
  - Once you're past the hero, it hides when you scroll down (moves up 100%) and comes back when you scroll up. On mobile it never hides.
  - The logo is "STILL" in Söhne Breit 900 at 22 px, followed by an 8×8 px alpine square.
  - The links (Flavors, Inside, Story, Stockists) are magnetic: they lean toward the cursor.
  - "Shop" has an arrow that nudges right on hover.
  - The cart icon has a count badge that pops from scale 1.4 to 1 when you add something.
- **Custom cursor:** a 6 px white dot plus a 36 px ring with a 0.55 white border, both using the `difference` blend mode (they invert whatever is behind them).
  - The dot follows in 0.08 s and the ring in 0.45 s, both `power2.out`, so the ring trails behind.
  - Over links and buttons, the ring grows to 56 px and the dot shrinks to half size.
  - Over an element tagged `data-cursor-label`, the ring becomes a 76 px dark filled circle showing a label (the default text is "Drag"). No element on the live page uses a label today.
  - Only shows on devices with a precise pointer (mouse or trackpad).
- **Eyebrow pattern:** "01 / The formula". The number is full strength, the slash is at 40%, and the text is at 60%. Uppercase, 12 px, 0.2em tracking.
- **Divider rule:** a 1 px × 72 px line in clear `#bcd3d8`, which scales in from the left.
- **Scroll cue:** "SCROLL" in 11 px with 0.28em tracking, above a 22×38 px pill outline with an 11 px radius. A 5 px pale blue dot drops 19 px inside it and fades, looping every 1.15 s with a 0.5 s pause.
- **Flavour stage copy panel:** "STILL.01" label, then the big flavour name and a coloured full stop, an italic flavour pair ("Cucumber & Yuzu"), a pitch paragraph, the ingredient list with mg doses (lead ingredient first and tagged "Lead"), and "Active blend 1,150 mg". The bottom right shows numbered dots and a "1 / 3" counter.
- **Ingredient pill nav (Inside):** 4 pills with a 999 px radius. The active one is filled bone with ink text.
- **Stockist row:** name and address. On hover:
  - an ink panel scales up from the bottom (350 ms ease-out),
  - the text flips to bone and shifts 12 px right,
  - an arrow slides in,
  - a small 3D can preview (170×215 px) follows the cursor, offset 26 px right and 200 px up.
- **Product card:**
  - A 1 px hairline border, can image, name, flavour pair, one-liner.
  - 4-pack and 12-pack pill toggles, 36 px tall. The active one is filled ink.
  - Price: $24 or $66 NZD. A "Subscribe and save 15%" line in serif italic.
  - A full-width ink "ADD TO CART" button with 0.4em tracking. On hover it turns alpine, and after a click it shows an "Added" tick for 1.5 s.
  - Hover lifts the card 4 px, scales the image to 1.04 and adds a `0 12px 32px rgba(26,27,29,0.06)` shadow.
- **Cart drawer:**
  - Slides in from the right, `min(420px, 100vw)` wide, over a 450 ms ease-out, with a `rgba(26,27,29,0.32)` backdrop.
  - Contains a free-shipping progress bar (NZ$50 target, alpine fill), quantity steppers and "Checkout".
  - Checkout opens a "Shipping begins fall 2026" modal with an email capture form, because online ordering isn't live yet.
- **Footer:** "Get notified when we ship to your city." in Tiempos, an email field with an underline, a "SIGN UP" button, then logo and short blurb, a site links column, a legal links column, and the copyright line.
- **Radii:** 999 px pills, 18 to 19 px steppers and toggles, 11 px scroll cue, 3 px small parts. Everything else is square.
- **Shadows:** only two. The drawer uses `-16px 0 48px rgba(26,27,29,0.1)` and the modal uses `0 24px 64px rgba(26,27,29,0.18)`.

## 5. Motion, section by section

All GSAP values below are **measured** (captured from GSAP's own objects at runtime), and I cross-checked them against the source. The site has 1,535 tweens and 27 ScrollTriggers in total.

### Smooth scroll

- Lenis is set up with only `{ lerp: 0.1, smoothWheel: true }`. Everything else uses library defaults.
- GSAP's ticker drives it, with `lagSmoothing(0)`, and every Lenis scroll event updates ScrollTrigger.
- Nav links scroll with `lenis.scrollTo(target, { duration: 1.2 })`.

### Preloader (screenshot and source read)

1. The screen is plain bone while scroll is locked. The code blocks wheel and touch events and keeps Lenis stopped.
2. A small "STILL" wordmark drops in from -0.6em to 0 over 0.45 s, `power2.out`.
3. 8 ingredient pills loop around it. They're dark or outlined, with a small flavour-coloured square in each: "L-Theanine 200 mg", "Caffeine-free", "Lion's Mane 500 mg" and so on.
   - Each pops in from `scale 0.55, y 10, rotation ±3.5°, blur(8px)` to sharp, over 0.45 s with `back.out(1.6)` (a slight overshoot).
   - It then floats up 6 px over 0.95 s `sine.inOut`, and leaves to `y -18, scale 0.94, blur(5px)` over 0.32 s `power2.in`.
   - A new pill starts every 0.42 s. The loop is 4.66 s long, then pauses 0.3 s.
4. A progress bar fills with a hard-edged ink gradient, next to a 3-digit counter ("000" to "100").
5. **The handoff (desktop):** once loading is done, the small wordmark is measured against the hero's giant wordmark. It then moves and scales onto it over 0.9 s `power3.inOut`, and the overlay fades out over the last 0.35 s.
   - On mobile it just scales to 1.6 over 0.55 s and fades.
6. In the cloud run, the preloader was still up at 7.5 s and the hero was fully in by 12 s (video frames). A real machine will be faster, because most of that wait is the 3D assets and software rendering.

### Hero (source read, confirmed on video)

**Layers, from back to front:**

1. An ink layer holding a soft clear-blue glow (60vh) and the 3D can.
2. A bone layer with the giant "STILL." wordmark, "Stay still. / Stay sharp.", the scroll cue and the tagline. This layer has no pointer events.
3. A 459 px ring, a `radial-gradient(circle, transparent 56%, rgba(26,27,29,0.10) 70%, transparent 84%)`, which acts as the lens rim.

The ink layer sits above the bone layer, but it's clipped to a circle. That circle is the lens.

**The lens radius is recalculated every frame on GSAP's ticker:**

`radius = 170 × entrance + swell + breath × entrance + scrollBoost`

- **entrance:** goes from 0 to 1 over 1.2 s (0.15 s delay, `power2.inOut`) when the preloader finishes. So the lens opens from nothing to 170 px.
- **swell:** mouse speed. Speed in px/s is divided by 2,200, then multiplied by 130, and capped at 130 px. It rises over 0.3 s `power2.out`. After 0.3 s without movement it falls back to 0 over 1.1 s. Move fast and the lens bulges.
- **breath:** goes between 0 and 9 px and back, over 2.2 s each way, `sine.inOut`, forever. The lens gently pulses.
- **scrollBoost:** driven by scroll (see below). It grows to 1.2 × the screen's diagonal, so the circle covers everything.
- **Position:** the circle centre follows the mouse with `quickTo` over 0.62 s `power2.out`, which makes it lag slightly behind the cursor. It starts at 50% across and 48% down.
- **The rim ring** follows the same point. It's scaled to `radius / 170`, and its opacity is `entrance × (1 - scrollBoost / 240)`, so it fades as you start scrolling.
- **The glow layer** drifts toward the mouse, up to 0.85 × the mouse's distance from centre, eased at 0.06 per frame. That drift fades out as scroll progress passes 0.6.
- **The can turns toward the mouse.** Its rotation is set by how far across the screen the mouse is. The can also moves slightly with the pointer: position offsets up to ±1.2 units and rotation up to ±1.2 radians were measured while the mouse circled.

**On scroll**, the hero pins for 120% of the viewport height, with `scrub: true` (the animation follows the scrollbar directly):

| Progress | What happens | Ease |
|---|---|---|
| 0 to 0.55 | scrollBoost grows 0 → 1.2 × diagonal. The lens eats the screen. | `power2.in` |
| 0 to 0.6 | Blend value 0 → 1. The can's pointer-follow fades out and it recentres. | `power1.inOut` |
| 0 to 1 | The glow layer scales 1 → 1.09, and the camera dollies in by 9% (the can scales 1 → 1.09). | linear |
| 0 to 0.15 | The scroll cue fades out. | `power1.out` |
| 0.48 to 0.63 | The whole bone wordmark layer fades to 0. | linear |
| past 0.58 | The left column plays once: "01 / The formula", "Sustained natural focus, without caffeine." (Tiempos 300, `clamp(28px, 2.8vw, 44px)`), the rule, the paragraph, and "1,150 mg active blend · 0 mg caffeine". Items rise from y 26 with 0.08 s stagger, 0.55 s, `power2.out`, and the rule scales in from the left. | |
| back below 0.35 | That column fades out over 0.25 s and resets, so it can play again. | |

Measured lens radius by scroll position: 172 px at 0, then 2,210 px once it's fully open.

**The 3D can's entrance** (source read): it drops in over 1.6 s. It starts 4 units up, tipped 35° forward, spun -540° and at scale 0.8. Position uses an ease-out-quart curve, and rotation uses a custom quint in/out curve. The materials fade from 0 to 1 over the same time. After that it bobs up and down 0.06 units on a 6 s sine wave.

**Mobile hero:** no lens. The wordmark is bone on ink at 24vw, and the can sits in a 52vh box where you can drag it to spin (0.005 radians per pixel dragged). A "Drag to spin" hint fades once you've dragged.

### Flavours (measured)

- **Heading reveal:** the eyebrow rises from y 14 over 0.6 s. "Three formulations." is split into characters that rise from `yPercent 115` inside a mask, over 0.8 s each, with a 0.022 s stagger (1.17 s in total), `power2.out`, once, when the section top reaches 80% down the screen.
- **Copy block and counter:** rise from y 70 over 1.0 s, with a 0.12 s stagger, when the top reaches 55%.
- **The pin:** `start "top top"`, `end +=3×viewport`, `scrub: 1` (the animation catches up with the scrollbar over 1 s, so it feels smooth rather than rigid), and `snap: [0, ⅓, ⅔, 1]`. Snaps take 0.25 to 0.55 s, `power2.inOut`, after a 0.1 s pause.
  - The active flavour switches at progress 1/6 ± 0.05 and 0.5 ± 0.05. The ±0.05 gap stops it flickering between flavours.
- **When the flavour changes:**
  - **The incoming can** (3D) moves from `x ±3, y 0.12, rotZ ∓0.16, scale 0.94, opacity 0` to rest over 0.85 s `power2.out`, after 0.1 s. The side flips each time (right, left, right).
  - **The outgoing can** goes to `x ∓2.2, y -0.1, rotZ ±0.14, scale 0.94, opacity 0` over 0.45 s `power2.in`.
  - **The flavour glow** crossfades over 0.7 to 0.8 s, `power2.inOut`.
  - **The ghost number** ("01", "02", "03" in outline) fades and drifts 40 px up or down, depending on scroll direction, over 0.8 s.
  - **The copy panel** leaves to y -26 over 0.25 s `power3.in`, swaps its text, then comes back from y 26 over 0.45 s `power3.out`. Its lines stagger in from y 18 (0.05 s apart).
  - **The flavour name** is re-split into characters, which rise from `yPercent 108` over 0.5 s with a 0.02 s stagger.
- Clicking a number dot jumps with Lenis to that flavour's snap point over 1 s.
- **3D camera:** fov 26, at (0, 0.3, 7.6). The cans are tilted forward 0.16 radians. All three cans are in one scene and swap by opacity.

### Inside (measured)

- **The pin:** `end +=4×viewport`, `scrub: 1`, snaps at 0, ¼, ½, ¾ and 1 (0.2 to 0.5 s), desktop only. Active step = `floor(4 × progress)`.
- **The can:** it turns a quarter (π/2) per step, easing toward that angle at 0.06 per frame. It's tilted 0.2 radians and leans slightly toward the pointer. The camera is fov 28 at (0, 0.4, 7.2), with a real shadow plus a soft contact shadow underneath (opacity 0.32).
- **When the step changes:**
  - The text leaves to y -26 over 0.22 s and comes back in over 0.45 s, 0.05 s apart.
  - The ingredient name characters rise from `yPercent 60` with 0.028 s stagger over 0.55 s.
  - The halo behind the can recolours over 0.5 s and pulses from scale 1.45 to 1.6 over 0.9 s.
- **Line-drawn icons** (DrawSVG, which draws an SVG path from 0% to 100% of its length): 0.9 s `power1.inOut`, 0.08 s stagger, 0.15 s delay. They redraw when you hover the name, and rock ±3.5° over 5 s, forever.
- **Dose bar:** scales from 0 to `dose / 1,150` over 0.8 s after 0.25 s. The number next to it counts up at the same time.
- **Hovering the name** grows the halo to scale 1.75 at opacity 0.7.

### Story (measured)

- **Intro:** the eyebrow rises from y 32 over 0.9 s `power3.out`. The headline characters rise from `yPercent 115` with 0.016 s stagger.
- **The pin:** `end +=4.6×viewport`, `scrub: 1`, with 6 snap points (0, then 5 chapters spread between 0.1 and 1).
- **Frame-by-frame work on scroll:**
  - the intro fades and lifts 40 px over the first 8%,
  - the photo stack fades in from 4% to 12%,
  - the 180 px progress line on the right fills from 10% to 100%.
- **Chapter change:**
  - The incoming photo (4:5 ratio) comes in from scale 0.86 (or 1.14 when you scroll back), y ±46 and opacity 0, over 0.9 s `power2.out`.
  - The outgoing photo goes the opposite way over 0.6 s `power2.in`.
  - A giant outlined year ("21", "22" …) crossfades behind them.
  - The text swaps with the same leave-and-return pattern as Flavours.
- **"Illuminate" text:** paragraph words start at 24% opacity and light up one by one as you scroll. This is scrubbed, with a 0.35 s stagger, from when the paragraph's top reaches 82% of the screen to when it reaches 34%.
- **Mobile:** a 440svh tall wrapper with a sticky frame inside. Each photo wipes up with `clip-path: inset(0 0 92%→0% 0)` while its scale drops from 1.12 to 1.

### Press (measured)

- **Quotes:** lines rise from `yPercent 115` over 0.85 s, 0.09 s apart. Each quote starts 0.12 s after the one before. The sources fade in 0.45 s after that.
- **Marquee 1:** solid bone names moving left, a full loop in 38 s, linear, forever.
- **Marquee 2:** outlined names (`1px rgba(239,237,230,0.35)` stroke, see-through fill) moving right, a full loop in 52 s.
- **Scroll-speed reaction:**
  - **Speed-up factor:** `clamp(1, 4, 1 + |scroll speed| / 1,200)`. It ramps up over 0.4 s and eases back to 1 over 1.4 s, after a 0.4 s wait.
  - **Lean:** `clamp(-6°, 6°, -scroll speed / 420)`. It jumps straight to the new angle, then eases back to 0 over 0.9 s `power2.out`.

### Where available and footer (measured)

- **Stockist columns:** rise from y 60 over 0.8 s `power3.out`, 0.15 s apart. Their rows rise from y 12 with 0.06 s stagger. On phones all of this runs at 0.7× the timing.
- **"Coming soon" block:** rises from y 20 after a 0.45 s delay.
- **The two rules beside "OR ORDER DIRECT":** scale in from 0 over 0.6 s.
- **Product cards:** come in from `y 80, scale 0.96, opacity 0` over 1.0 s `power3.out`, 0.2 s apart.
- **Footer headline:** a line reveal. Nothing else in the footer moves.

### Shared reveal helpers (source read)

- `ScrollReveal`: from `opacity 0, y 12` over 0.6 s `power2.out`, when the element's top reaches 85% down the screen.
- `TextReveal`: splits text into lines, words or characters inside a mask, then moves them from `yPercent 115` to 0. Lines and words take 0.9 s with a 0.09 s stagger. Characters take 0.8 s with a 0.02 s stagger.
- `ScrollIlluminate`: words start at 24% opacity and are scrubbed to 100% between top 82% and top 34%.

## 6. 3D (measured scene graph)

- **Three canvases:** hero (full screen), Flavours (714×650) and Inside (425×504). They only draw while near the viewport, within 600 to 1,600 px. More small canvases appear for the cursor-follow can and the phone cards.
- **Renderer:** ACES Filmic tone mapping at exposure 1.05, sRGB output, antialias on, transparent background. Pixel ratio is capped at 1.5 on phones and 2 on desktop (the hero is capped at 1.5).
- **Model:** `/models/can.glb` (291 KB), a slim 250 ml can with 4 meshes:
  - body: 1,750 vertices,
  - top: 3,594 vertices,
  - tab: 978 vertices,
  - rivet: 498 vertices.
  - It's scaled to fit a target height (2.2 to 2.7 units) at load time.
- **Materials:**
  - **Body:** `MeshStandardMaterial`, white, roughness 0.65, metalness 0.05, env intensity 0.6, with the flavour label PNG as its texture (about 330 KB each).
  - **Metal parts:** `#c8c8c8`, roughness 0.42, metalness 0.95, env intensity 0.85.
- **Lighting:**
  - A 1k studio HDRI environment, `studio_small_03_1k.hdr` (972 KB), used for reflections only and not shown as a backdrop.
  - Ambient light at 0.15 to 0.2.
  - Three directional lights: at (4, 6, 5) intensity 1.4, which casts a 1,024 px shadow in the hero and Inside; at (-4, 2, 3) intensity 0.5; and at (0, 4, -5) intensity 1.1 to 1.2 as a rim light from behind.
- **Contact shadow:** a custom version of drei's soft shadow. It renders the scene from below into a 512 px texture, blurs it in two passes and tints it ink. It sits 1.4 units below the can at 0.32 to 0.35 opacity.
- **Cameras:**
  - hero: fov 30 at (0, 1.1, 8.4), looking down 0.13 radians,
  - Flavours: fov 26 at (0, 0.3, 7.6),
  - Inside: fov 28 at (0, 0.4, 7.2).
- **No custom shaders:** everything is standard three.js materials. The only shader code the site wrote is the contact shadow's blur and tint.
- **Frame rate (cloud-measured):** about 36 to 40 fps for the hero scene with software rendering. Expect 60 fps or more on a real GPU. Not verified.

## 7. Responsive

- **Breakpoint:** one real breakpoint, at 767/768 px. It's used in both CSS (`max-width: 767px`) and JS (`matchMedia`). Nothing else changes layout above it.
- **Phones (fresh load at 390, see `evidence/sheet_390.png`):**
  - the nav shrinks to the logo, "Shop →", the cart icon and a menu icon,
  - no lens, no pins, no custom cursor,
  - the hero can is draggable,
  - Flavours and Inside become side-swiping carousels with snap (82vw cards, 5vw gap),
  - Story becomes a sticky photo sequence,
  - stockists collapse into an accordion,
  - the page is 10,622 px tall.
- **Tablets (fresh load at 820):** the full desktop layout, 23,190 px tall.
- **Resizing a live page** across 767 px broke it in the cloud browser (the content disappeared). See not-verified.
- **Reduced motion (`prefers-reduced-motion`):**
  - text reveals, marquees, the lens pointer-follow, idle wobbles and the preloader pills are all skipped, and content shows at full opacity,
  - the pins still work,
  - the page still ran 328 tweens against 1,535 normally.

## 7b. Accessibility, meta and extras (measured)

- **Dark mode:** none. The page looks the same with the system set to dark.
- **Contrast:**
  - ink on bone is 14.7:1,
  - mist `#6a6965` on bone is 4.7:1, which just passes the WCAG AA standard for body text,
  - 60% bone on ink is about 6.6:1,
  - the clear-blue accent on bone is 1.3:1, which is fine for decoration but can't carry text.
- **Keyboard:** Tab reaches the nav links, and the focus outline is the browser's default ring in mist (1 px, 1 px offset). There's no custom focus style and no skip link.
- **Screen readers:** all 13 images have alt text. Every split-text animation has an `sr-only` copy of the full text, with the animated letters hidden from screen readers (280 `aria-hidden` elements). The `lang` is `en`, and it uses `nav`, `main` and `footer` landmarks.
- **Reduced motion:** covered in section 7.
- **Sound, tilt, vibration:** none. three.js ships audio classes, but no audio context or media element was created at runtime, and there are no device-orientation listeners.
- **Meta:**
  - `theme-color #efede6`,
  - a description,
  - Open Graph title, description and a 2400×1260 `og.png` with alt text,
  - an SVG favicon and an Apple touch icon.
- **Extras:** the tab title doesn't change when you leave the tab. The only console output is a leftover debug line (`[Can3D] GLB meshes: …`) plus three.js deprecation warnings. The Awwwards "W. Honors" tab is fixed to the right edge on every page.

## 8. Page weight and cost (cloud-measured, uncompressed sizes)

| Type | Files | Size |
|---|---|---|
| Scripts | 11 | 1,821 KB (the main app plus three.js chunk alone is 1,137 KB) |
| Images | 11 | 1,623 KB (three can PNGs at about 160 KB, three label textures at about 330 KB) |
| 3D data (fetch) | 5 | 1,278 KB (HDRI 972 KB, GLB 291 KB) |
| Fonts | 7 | 228 KB |
| CSS | 1 | 36 KB |

- First paint was at 1.18 s and load finished at 2.06 s.
- The most expensive effects are the three live WebGL canvases and the HDRI. Everything else is cheap transform and opacity animation.

## 9. What's worth porting, in order

1. **The hero lens.** It's cheap to build, looks unusual, and works with any product photo or 3D object. The core is one `clip-path: circle()` updated on a ticker from mouse position, mouse speed, a breathing sine wave and scroll.
2. **The preloader-to-hero wordmark handoff.** A strong first impression, and it works on any brand with a wordmark.
3. **The pinned stage with hysteresis and snapping.** It suits any product range of 3 to 5 items. It can use 3D or plain images.
4. **The scroll-speed marquee** for press logos or client names.
5. **The system itself:** bone, ink and one soft accent. A serif headline paired with a wide grotesk. Uppercase micro labels with wide tracking. Outlined ghost numbers. Breathing glows.

Rebuild notes for each one are in `recipes.md`.
