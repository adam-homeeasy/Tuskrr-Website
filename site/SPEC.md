# Tuskrr site: build spec

The mechanics, timings and page rhythm come from the drinkstill.nz teardown in
`01-teardown/` and `02-data/`. The brand, copy, palette and fonts come from the
Tuskrr brand world, **The Entrance** (branch `claude/ecstatic-cerf-eqi4ii`,
`brand-world/src/worlds.mjs` and `shared.mjs`). No STILL asset, image, font or
line of copy is used.

## What maps to what

| # | STILL zone | Tuskrr zone | Background | Pin | Mechanic kept |
|---|---|---|---|---|---|
| 0 | Preloader | Preloader | bone | n/a | Pills pop in/out around a small wordmark, 000 to 100 counter, then the wordmark flies into the hero wordmark (FLIP, 0.9 s `power3.inOut`) |
| 1 | Hero lens | Hero, "Arrive like you mean it." | bone wordmark over night | +=120% | Night layer clipped to a cursor lens: `r = 170·entrance + swell + breath·entrance + scrollBoost`. RIDGE stands in a threshold glow inside it |
| 2 | Flavours (3) | The collection (6 bags) | bone | +=6 × 0.75 screens | Snap per bag, hysteresis, bag slides in from alternating sides, glow crossfade, outlined ghost number, copy out/in swap, dot nav |
| 3 | Inside (4 ingredients) | Inside: the four confirmed proof points | night | +=4 screens | Snap per step, pill nav, line icons drawn on, bar and counter fill, halo recolour and pulse |
| 4 | Story (5 years) | A day, in entrances (5 times of day) | bone | +=4.6 screens | Illuminate paragraph, chapter swap with photo scale-in, ghost hour, progress rail |
| 5 | Press | Where's that from? | night | none | Three campaign lines (line reveal) and two scroll-speed marquees |
| 6 | Where available | Find yours, or send one | bone | none | Gift rows with ink panel hover and cursor-following bag preview, then six product cards |
| 7 | Footer | Footer | bone | none | Newsletter, links |

Rhythm, as on STILL: **bone, night, bone, night, bone, night, bone**, all plain
scroll-overs.

## Tokens

| STILL role | STILL value | Tuskrr token | Value | Source |
|---|---|---|---|---|
| ink | `#1a1b1d` | night | `#131110` | brand world |
| bone | `#efede6` | bone | `#EFE9E1` | brand world |
| mist (secondary on bone) | `#6a6965` | mist | `#665E56` | derived, 5.4:1 on bone |
| secondary on ink | bone 60% | smoke | `#A39B91` | brand world, 6.9:1 on night |
| alpine (hover, fills) | `#1e423e` | cognac | `#C27442` | brand world, night text on it 5.3:1 |
| clear (accent, full stop, rules) | `#bcd3d8` | brass | `#D1A650` | brand world, the gold S |
| glow light | flavour colours | threshold | `#F6E3BD` | brand world, light only |
| flavour glows | clear/dawn/dusk | per bag | RIDGE `#C27442`, TRAVERSE `#D39A6A`, STRATA `#A39B91`, CREST `#B8553A`, AXIS `#D1A650`, CONTOUR `#7F8DB5` | read off the product photos |

Glow ("Bloom") gradients, breathing (scale 0.95 to 1.05, 2 s `sine.inOut`),
hairline `rgba(140,132,122,.4)`, nav frost `rgba(239,233,225,.92)` + 20 px blur:
as STILL, recoloured.

## Type

STILL's Klim fonts are paid. The brand world already chose OFL fonts, so those
are used (files copied from the brand-world branch):

| STILL role | STILL font | Tuskrr font |
|---|---|---|
| Quiet headlines, flavour names, quotes | Tiempos Headline 300 / Tiempos Text italic | Instrument Serif 400 / italic |
| Loud brand words, ghost numbers | Söhne Breit 800 to 900, uppercase | Instrument Sans at 75% width, 600 to 700, uppercase |
| Body, labels, eyebrows | Söhne 400 to 500 | Instrument Sans 400 to 500 |
| Hero wordmark | "STILL." set in Söhne Breit | The Tuskrr wordmark itself, traced to SVG, with the S in brass |

The loud face is narrow where STILL's is wide. That is deliberate: the Tuskrr
wordmark is tall and narrow, and the brand world set its display face to match.
Sizes, line heights and tracking follow the teardown's type table.

## Motion values (from the teardown, unchanged)

- Lenis `{lerp: 0.1, smoothWheel: true}` on GSAP's ticker, `lagSmoothing(0)`.
- Preloader: wordmark drops from -0.6em (0.45 s `power2.out`). Pills pop from `scale .55, y 10, rot ±3.5°, blur 8px` (0.45 s `back.out(1.6)`), float -6 px (0.95 s), leave to `y -18, scale .94, blur 5px` (0.32 s `power2.in`), one every 0.42 s. Minimum 2.2 s, maximum 9 s. Phone: scale to 1.6 and fade.
- Lens: entrance 0 to 1 over 1.2 s after 0.15 s `power2.inOut`; swell `min(130, speed/2200·130)` up 0.3 s, back over 1.1 s after 0.3 s idle; breath 0 to 9 px, 2.2 s yoyo; follow `quickTo` 0.62 s `power2.out`; start 50% / 48%. Ring 459 px, `scale(r/170)`, opacity `entrance·(1 − scrollBoost/240)`.
- Hero scroll (scrub): scrollBoost to 1.2 × diagonal over 0 to 0.55 (`power2.in`); glow scale 1 to 1.09; cue fades 0 to 0.15; wordmark layer fades 0.48 to 0.63; left column plays past 0.58 (y 26, 0.08 s stagger, 0.55 s) and resets below 0.35.
- Stage swaps: incoming from ±220 px, rot ∓9°, scale .94, 0.85 s `power2.out` after 0.1 s; outgoing to ∓160 px, 0.45 s `power2.in`; glow crossfade 0.8 s; ghost number drift 40 px; copy out y −26 (0.25 s `power3.in`) and in from y 26 (0.45 s `power3.out`), lines 0.05 s apart; name characters from yPercent 108, 0.02 s stagger, 0.5 s.
- Snap durations 0.25 to 0.55 s `power2.inOut`, 0.1 s delay. Hysteresis 15% of one step (STILL: ±0.05 on thirds).
- Inside: icons draw 0.9 s `power1.inOut`, 0.08 s stagger, 0.15 s delay, rock ±3.5° over 5 s; bar 0.8 s after 0.25 s; halo pulse 1.45 to 1.6 over 0.9 s.
- Story: intro fades and lifts 40 px over the first 8%; frame fades in 4% to 12%; rail fills 10% to 100%; photo in from scale 0.86 (1.14 backwards), y ±46, 0.9 s; illuminate words 0.24 to 1 between top 82% and top 34%.
- Marquees: 38 s and 52 s loops; speed `clamp(1, 4, 1 + |v|/1200)` up 0.4 s, back 1.4 s after 0.4 s; lean `clamp(−6°, 6°, −v/420)`, back 0.9 s.
- Reveals: text from yPercent 115 inside a mask (lines 0.9 s / 0.09 s, characters 0.8 s / 0.02 s), `ScrollReveal` from y 12 (0.6 s) at top 85%. Cards from `y 80, scale .96` (1.0 s `power3.out`, 0.2 s apart).
- Cursor: 6 px dot (0.08 s) and 36 px ring (0.45 s), `difference` blend; ring 56 px over links. `(pointer: fine)` only.
- Nav: 72 px (56 on phones), frosted after 80 px (400 ms), hides on scroll down past the hero, never on phones. Magnetic links (0.3 strength, 0.4 s).

## Phone (below 768 px), as STILL

No lens, no pins, no cursor. The hero is night with the bone wordmark and the
bag. The collection and Inside become swipe carousels (82vw cards, 5vw gap,
scroll-snap). The day becomes a stack of chapters. The preloader scales and
fades instead of flying.

## Reduced motion

Reveals, marquees, pills, lens follow and idle motion are skipped; content
shows at full opacity; the lens opens without animation and doesn't follow the
pointer; pins still work and swaps are instant.

## What had to change, and why

- **No 3D model.** Tuskrr has product photos, not a GLB. The bags are cut out
  of their studio backgrounds (rembg, isnet model) and used as flat images
  with a CSS perspective tilt toward the pointer where STILL turns its can.
- **Six items, not three.** The collection pin is 0.75 screens per bag so the
  stage doesn't run to six full screens.
- **No press yet.** The press section carries Tuskrr's own campaign lines,
  labelled as such, not invented reviews.
- **No stockists.** Tuskrr sells direct and as a gift, so the stockist rows
  become gift occasions, using the brand world's gift notes.
- **No prices.** Only the range (₹5,000 to ₹7,000) is known, so cards say
  "Price at launch". Laptop sizes are the brand world's sample values and are
  labelled as samples.
- **No checkout.** As on STILL, "Checkout" opens a notify form. It doesn't
  send anywhere yet.
