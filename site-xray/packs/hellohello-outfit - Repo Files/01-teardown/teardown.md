# OUTFIT by ++hellohello: teardown

## 1 Header

| Item | Value |
|---|---|
| Site | https://outfit.hellohello.is/ (merch store of the ++hellohello studio) |
| Captured | 2026-09-29, cloud Chromium |
| Main viewport | 1440 x 900 (desktop), 390 x 844 (phone map) |
| Fresh loads at 8 widths | 360, 390, 768, 820, 1024, 1280, 1440, 1920 |
| Live-resize widths | 1440, 1024, 800, 760, 390, then back up |
| Routes visited | 11 (home, bag, shipping-and-return, 8 product pages, one unknown path) |

Evidence labels used on every value:

| Label | Meaning |
|---|---|
| measured | read from the running page, or from a library's own objects (GSAP tween values in `06-raw/motion_gsap.json`, computed styles, pixel samples) |
| source read | copied from the shipped code in `04-code/` (JS chunks, inline CSS, HTML) |
| fitted | worked out from frame samples. There are none in this pack: `motion_sampled.json` found no moving elements, and GSAP is present so GSAP values are used instead |
| inferred | worked out from screenshots, arithmetic on measured numbers, or standard library behaviour. The reason is given each time |

Where a value is arithmetic on measured numbers I say "computed" and give the inputs.

## 2 Summary

**What it is.** A one-page Shopify-backed merch store for a design studio. It is a single long scroll: a huge OUTFIT wordmark, a short intro block, then 13 product tiles on an asymmetric grid, then a giant "Made to be worn. Or judged. Or both. (c)26" footer. Product pages, an empty-bag page and a shipping page exist behind it. There is no video, no canvas and no 3D.

**Page height.** 4061 px at 1440 (measured). Scroll range 3161 px. Phone 390: 4581 px (measured).

**Stack (all source read unless noted).**

| Layer | Library | Version | Where found |
|---|---|---|---|
| Framework | Next.js (App Router, Turbopack build) | 16.1.1 | `window.next.version` in chunk `b6c772e00f0f005f.js` |
| UI | React | 19.3.0 canary (build f93b9fd4-20251217) | same chunk |
| Data | Shopify Storefront (product images on cdn.shopify.com, cart server actions) | not shown | image URLs, `createServerReference` calls |
| Styling | Tailwind CSS v4 (theme variables `--spacing`, `--text-*`), built with Lightning CSS | version not shown | inline stylesheet |
| Animation | GSAP core | 3.14.2 | chunk banners, `CustomEase` reports 3.14.2 |
| GSAP plugins | ScrollTrigger, SplitText, CustomEase, plus the `useGSAP` hook | 3.14.2 | same |
| Smooth scroll | Lenis | 1.3.11 | `window.lenisVersion` (measured) and chunk `d71e6e0a240cbbbc.js` |
| Cart and layout animation | Motion (framer-motion) | 12.5.0 | chunk `933f77b4eb0acbfd.js` |
| Digit roll for prices and bag count | NumberFlow (`number-flow-react`) | version not shown | chunk `6fb404aee9b90fa0.js` |
| Toasts | Sonner | version not shown | `Toaster.js`, keyframes in tokens |
| Page transitions | a `TransitionRouter` context in the shape of the `next-transition-router` package | name inferred from code shape | `TransitionRouter.js` |
| Theme | a next-themes style provider, themes `light`, `dark`, `red`, default `red` | | `ThemeProvider.js`, `Providers.js` |
| Analytics | Google Tag Manager GTM-M68G69KW | | probe scripts list |
| Hosting | Vercel (`dpl_` deployment ids on every asset URL) | inferred from the `dpl_` query strings | probe |
| Polyfill | core-js | 3.38.1 | chunk `a6dad97d9634a72d.js` |

**Fonts and licence.**

| Font | Files | Licence | Note |
|---|---|---|---|
| Neue Haas Grotesk Text Pro (Monotype / Linotype) | 3 woff2: regular, Medium, Bold | **Paid.** Commercial web licence needed. Not free. | The CSS maps regular to weight 400, the Medium file to weight 700 and the Bold file to weight 800 (source read). Fonts are served through `next/font/local` under the family name `font`, with an Arial fallback at size-adjust 104.95% |

Fonts are not included in this pack (3 left out of `03-assets`, listed in `06-raw/assets.json` `fontsNotDownloaded`).

**Top 5 signature effects, ranked by how much they add.**

| Rank | Effect | What you see | Rebuild cost |
|---|---|---|---|
| 1 | Preloader collage | Black screen, six tilted photos pop in behind a cream OUTFIT wordmark that rises letter by letter, a 000 to 100 counter, then everything exits and the black panel wipes up | Medium: one GSAP timeline, one SVG wordmark, six photos |
| 2 | Hero wordmark rise and rule draw | Red OUTFIT letters slide up out of a mask in random order, a 5 px rule draws left to right, small labels and paragraph lines float up in a stagger | Low to medium: SVG paths plus one GSAP timeline |
| 3 | Product tile reveal and hover flip | A pale block slides off each photo while the photo un-zooms from 1.4; on hover a second photo wipes in from the left with an over-exposed flash | Low: two small GSAP tweens plus a CSS hover |
| 4 | Difference-blend nav and three-theme switch | Nav text is cyan with `mix-blend-mode: difference`, so it reads red on cream and flips over photos; three dots switch red, light and dark themes with a sliding marker | Low: CSS blend plus a theme attribute |
| 5 | Page-transition curtain | On link click the page shrinks and slides up while a red curtain with the OUTFIT letters wipes in, then letters exit | Medium: needs a router hook to hold navigation |

Also worth knowing: a custom cursor that grows into a red "View More" disc over product tiles (Low cost, section 6). Rebuild cost words: Low is CSS or a few tweens; Medium is a timeline plus glue code; High is not used here.

## 3 Page map

Desktop 1440, page height 4061 (measured, `map_desktop-1440.json`). `pinSpacers` is 0 at every tested width, so nothing is pinned. No snapping, no scrub, no horizontal scroll sections.

| # | Section | Range (px) | Height | Background | Pinned | What it is |
|---|---|---|---|---|---|---|
| 0 | Header `nav#header` | fixed, top -2 | 100 | transparent (page cream shows through) | Fixed by CSS, not by ScrollTrigger | `++` logo, Shop, Bag (n), theme dots. z-index 3, `mix-blend-mode: difference` |
| 1 | Hero | 104 to 533 | 429 | transparent over body `#ede4dd` | No | SVG wordmark 100% wide, 5 px rule, 16-column info row |
| 2 | Product area (wrapper) | 573 to 3194 | 2621 | same | No | 4 rows of tiles, 13 products |
| 2a | Row 1 `section.mb-34.grid` | 573 to 1068 | 495 | same | No | 4 equal tiles, 9:12 photos |
| 2b | Rows 2 to 4 | 1204 to 3194 (computed: 573 + 495 + 136 px row gap, to wrapper end) | 1990 (computed) | same | No | Asymmetric 16-column rows, 3 tiles each. Individual row edges were not sampled |
| 3 | Footer | 3331 to 4022 | 691 | same | No | Rule, statement, giant (c)26, address, links |
| end | Bottom margin | 4022 to 4061 | 39 (computed) | same | No | `mb-10` |

The 136 px row gap is `mb-34` (34 x 0.25rem, source read) at a 16 px root. Above 1472 px viewport the root becomes 18 px so gaps and rem type scale up by 12.5 percent (source read, `@media (min-width: 92em){html{font-size:18px}}`).

Phone 390, page height 4581 (measured):

| Section | Range (px) | Height |
|---|---|---|
| Header (fixed) | 0 | 88 |
| Hero | 104 to 457 | 353 |
| Product area | 497 to 3444 | 2947 |
| Row 1 (2 columns) | 497 to 1134 | 637 |
| Footer | 3580 to 4541 | 961 |

Fresh-load page heights: 360 = 4505, 390 = 4581, 768 = 3769, 820 = 3916, 1024 = 3354, 1280 = 3768, 1440 = 4061, 1920 = 5106 (all measured).

**Grid, source read from classes.**

| Block | Mobile | Desktop (md up, 768+) |
|---|---|---|
| Page gutter | `px-4` = 16 px | `lg:px-6` = 24 px (from 1024) |
| Hero info row | 8 columns, gap-x 24, gap-y 40 | 16 columns, gap 24: title 4, "Why" + paragraph 8, links 3, year 1 |
| Product row 1 | 2 columns, gap 16 | `lg:grid-cols-4`, gap 24 |
| Product rows 2 to 4 | 8 columns, gap 24 | 16 columns, gap 24 |
| Row 2 placement | Neutral Grotesk and Red Dot span 3 columns each; Gridlocked from column 3 to 9 | Neutral Grotesk and Red Dot 3 columns each; Gridlocked columns 9 to the end |
| Row 3 placement | Hello Week 001 span 4; 002 columns 3 to 6; Monochrome 6 to 9 | 001 span 3; 002 columns 6 to 9; Monochrome 9 to 12 |
| Row 4 placement | Positive Space span 5; Whitespace 2 to 5; Command + K 5 to 9 | Positive Space span 5; Whitespace 11 to 14; Command + K 14 to 17 |
| Footer info grid | 16 columns, gap-x 24, gap-y 80 | 16 columns, gap 24; address 3, privacy 4, links 5, brand 4 |

**Colour rhythm from the pixel data.** `pixelRhythm1440` has 12 scroll stops and 5 sample heights each, edge pixel and centre pixel: 60 pairs.
- Edge pixel is `#ede4dd` in all 60 pairs.
- Centre pixel is `#ede4dd` in 58 pairs and `#ff0001` in 2 pairs (scroll 0 at the 25 percent line, scroll 300 at the 10 percent line). Both hits are the red wordmark.
- There is no dark band and no colour block change at any scroll depth. The rhythm is one cream field, red type, and the photographs. The only full-screen colour changes are the black preloader at load and the red menu overlay on mobile.
- The desktop samples fell in the margins between tiles. Phone samples (35 pairs) do hit photos: `#c9c9c9`, `#1e1e1e`, `#575757`, `#b5b1ac`, `#cdcdcd`, `#b5b6bb` come from photo pixels, and red `#ff0001` shows at the footer statement (scroll 3500). Values like `#fe0d0e`, `#fa2f16` and `#f47f64` are the red text edge with anti-aliasing.

## 4 Colours

Default theme is `red` (`data-theme="red"` on `<html>`, source read). Values measured from computed styles unless noted.

| Name | Value | Used for | Count in map |
|---|---|---|---|
| Cream (`--color-cream`, also `--color-white`) | `#ede4dd` = rgb(237,228,221) | Page background in red and light themes; text in dark theme; text on black preloader; selection text | bg on 4 elements plus body |
| Red (`--color-red`) | `#ff0001` = rgb(255,0,1) | All display type in the red theme (text on 65 elements); fills on 21 elements (theme dot, menu overlay, page-transition layer); cursor colour via `--cursor-color` | 65 text, 21 bg |
| Black (`--color-black`) | `#000` | Preloader background; dark theme background; light theme text; text selection background in red theme; hover ring inset | bg on 3 elements |
| Image placeholder | `#d2cac3` = rgb(210,202,195) | Block that covers each product photo before the reveal slides it away. In dark theme it is `neutral-800` | 13 elements |
| Nav cyan | `#00bcdf` = lab(69.6685 -41.2795 -36.3883), written in source as `oklab(0.73 -0.14 -0.1)` | Header text colour in the red theme, used with blend mode difference | 5 text hits |
| Nav cyan, menu open | `#12e4dc` | Header colour while the mobile menu is open, red theme only | source read |
| Grey text | `#5A5A5A` | Second line of the footer statement and of the empty-bag message in the light and dark themes. In the red theme it switches to red | source read |
| Focus ring | `#a1a1a1` (neutral-400) with a 2 px offset in `#fafafa` (neutral-50). Dark theme: `#525252` ring on `#171717` offset | Keyboard focus on every link and button | measured (a11y.json boxShadow) |
| Tailwind defaults not used on the shop | neutral 50 to 900, blue-600 `#155dfc`, gray-200 | Blue-600 only in the error-boundary button | source read |

**How the nav turns red.** The nav text is cyan `#00bcdf` with `mix-blend-mode: difference`. The difference of cyan on cream `(237,228,221)` is `(237,40,2)`, which reads as near-red (computed from the two measured colours). Over a dark photo the same text turns light. In the light and dark themes the nav is white (cream) with the same blend. The preloader wordmark also uses `mix-blend-mode: difference` (`multiply` with red fill in the dark theme), which is why the letters flash teal where the photos overlap them in the screenshots.

**Theme matrix (source read from the `body` class list and `MenuOverlay`, `Providers`).**

| Theme | Body background | Body text | Selection | Menu overlay | Transition layer |
|---|---|---|---|---|---|
| red (default) | cream | red | black background, cream text | red bg, cream text | red bg, cream text |
| light | cream | black | red background, cream text | black bg, cream text | black bg, cream text |
| dark | black | cream | red background, cream text | cream bg, black text | cream bg, black text |

**Glow and gradient recipes.** None. There are no gradients, no glows, no drop shadows, no blur and no overlays on photos. The only shadows are 0.05em inset rings on the theme dots (0.8 px measured at the header size, 3 px in the mobile menu). Photo hover uses a filter flash: `brightness(400%) contrast(150%)` easing to `brightness(100%) contrast(100%)` (measured on 13 images, source read for the end state).

**Radii.** Everything round is `rounded-full` (theme dots, cursor). Nothing else has a radius.

## 5 Type

One family, Neue Haas Grotesk Text Pro, in three files. No `clamp()` exists anywhere in the CSS (source read, searched). Sizes use rem steps and `vw` units instead, and they are kept as written below.

**Desktop scale at 1440 (measured from computed styles; source column is the class from the shipped markup).**

| Role | Font and weight | Size | Source rule (no clamp; rem or vw) | Line height | Tracking |
|---|---|---|---|---|---|
| Hero wordmark OUTFIT | SVG artwork, not text. viewBox 1391 x 296, `width:100%` of the 1392 px content box | about 296 px tall (computed from viewBox ratio) | n/a | n/a | n/a |
| Footer statement "Made to be worn. Or judged. Or both." | Neue Haas Grotesk, weight 900 requested, so the Bold (800) file renders | 86.4 px | `md:text-[6vw]` | 86.4 px (1) | -4.32 px (`tracking-tighter`, -0.05em) |
| Footer giant "(c)26" | same | 183.6 px | `md:text-[12.75vw]` | 183.6 px (1) | -9.18 px |
| Nav links Shop, Bag | 400 | 24 px | `md:text-2xl` (1.5rem) | 32 px | -0.6 px (`tracking-tight`, -0.025em) |
| Footer sentence | 400 | 24 px | `md:text-2xl`, `max-w-[52ch]`, `text-balance` | 32 px | -0.6 px |
| Product title and price | 400 | 18 px | `text-lg` (1.125rem) | 20 px (`leading-5`) | normal |
| Category tag "APPAREL" | 400, uppercase | 11 px | `text-[11px]` | 16.5 px | normal |
| Hero labels (OUTFIT, WHY, VISIT ++ WEBSITE, SHIPPING & RETURNS, year) | weight 700 (draws the Medium file), uppercase | 12 px | `text-xs font-bold` (0.75rem) | 16 px | normal |
| Hero paragraph | 700 (Medium file) | 14 px | `text-sm leading-4 tracking-tight`, `md:max-w-[60%]` | 16 px | -0.35 px |
| Footer address, links, copyright | 700 (Medium file) | 14 px | `text-sm font-bold` | 20 px | normal |
| Menu overlay items (mobile only) | 400 | 60 px | `text-6xl` | 60 px | -1.5 px |
| Preloader counter | 400 | 24 px | `text-2xl` | 32 px | normal |

**Font weight mapping.** Declared in `@font-face` (source read): the regular file is weight 400, the Medium file is declared as weight 700, the Bold file is declared as weight 800. What each utility class actually draws follows the standard CSS font-matching rules (inferred): `font-bold` (700) draws the Medium file; `font-extrabold` (800) draws the Bold file; `font-[900]` has no 900 face so it draws the 800 (Bold) file; `font-medium` (500) has no 500 face and matches the 400 regular file first, so the product page title, which uses `font-medium`, most likely draws the regular file, not Medium. Treat that last one as unverified.

**Root size step.** From viewport width 1472 px (`92em`) the root font-size becomes 18 px, so all rem sizes grow by 12.5 percent. Measured proof: the hero labels compute to 12 px at 1440 and 13.5 px at 1920.

**Other type in the code, not sampled by the map (source read).**

| Role | Rule |
|---|---|
| Product page title | `text-6xl` with `leading-[1]` on mobile; `md:text-8xl md:leading-[.9]`; `font-medium tracking-tight` |
| Product price | `text-3xl` mobile, `md:text-5xl` |
| Product description | `md:text-2xl leading-[1.25] text-balance` |
| Empty-bag message | `text-[10vw] leading-[0.9] font-extrabold tracking-tighter`, `sm:text-[10.75vw]` |
| Bag heading | SVG "YOUR BAG" artwork, viewBox 343 x 54, followed by a 5 px rule |
| Cart line | `text-xl leading-6`, `xl:text-4xl xl:leading-10`; Subtotal `xl:text-5xl`; Checkout button `text-[4rem]` |

**Phone differences (390, from `map_phone-390.json`).**

| Role | Desktop | Phone |
|---|---|---|
| Nav links | 24 / 32, -0.6 px | 16 / 24, -0.4 px (`text-md` is not a real Tailwind class, so it falls back to the inherited 16 px) |
| Footer statement | 86.4 / 86.4, -4.32 px | 44 / 44, -2.2 px (`text-[2.75rem]`) |
| Footer giant (c)26 | 183.6 px (12.75vw) | 175.5 px (`text-[45vw]`, 45 percent of 390), -8.775 px |
| Footer sentence | 24 / 32, -0.6 px | 14 / 20, -0.35 px |
| Hero wordmark | about 296 px tall | scales with the 358 px content box |
| Menu overlay items | not shown | 60 / 60, -1.5 px |
| Everything else (title 18/20, tag 11/16.5, hero labels 12/16, hero paragraph 14/16, footer info 14/20) | same | same |
| Gutter | 24 px | 16 px |

## 6 Components

All hover diffs in `pointer.json` are empty: 10 hover targets were tried and none showed a computed-style change on the hovered element itself. The cause is that this site's hover effects live on pseudo-elements and child elements (an `::after` underline, a second image, `group-hover` classes), which the diff does not see. Every hover value below is therefore **source read** from the inline CSS and the component code, not measured. Whether the effects actually render is also shown by the video only, which I cannot review, so see `not-verified.md`.

| Component | Default | Hover | Focus | Active | Open / other |
|---|---|---|---|---|---|
| **Text link `.link-hover`** (nav, hero links, footer, menu) | Plain text, `::after` underline is `scaleX(0)`, height `max(2px, .1em)`, `bottom:-.1em`, colour `currentColor` | Underline draws to `scaleX(1)` from the left, `.5s`, `cubic-bezier(.83,0,.17,1)`. Only where `(hover:hover)` | Global ring below | none | Current page: `data-selected` shows the underline permanently, no animation |
| **Header nav** | Fixed, z-3, blend difference, starts at `opacity:0; translateY(-6rem)` | n/a | Ring on each link | n/a | Reveal: when `html.loaded` is set the nav and theme dots fade to `opacity:1; translateY(0)` over `2s`, delay `.5s`, `cubic-bezier(.19,1,.22,1)`. Text colour transitions `.4s ease-in-out`. Menu open turns it `#12e4dc` in the red theme |
| **Logo link** (`++`) | SVG 3.375em x 1.5em (54 x 24 at 16 px root), `currentColor`, screen-reader text "OUTFIT(r)" | no diff recorded | Ring | none | Links to `/` |
| **Bag count** | "Bag (0)", digits inside `<number-flow-react>` | Text link hover | Ring | none | When the count changes digits roll: transform `900ms` on a long `linear()` spring curve, opacity `450ms ease-out` (source read from the library defaults). The library has `respectMotionPreference: true` |
| **Theme switcher** (three dots) | 3 dots, 1.125rem (18 px), gap 4 px, colours black, cream, red, each with a `0.05em` inset ring. A 4 px marker dot sits on the active one. Fixed at top 2.56rem, right 1.5rem, desktop only | `hover:scale-110`, `transition-all 200ms ease-out`. Only `(hover:hover)` | Ring | none | Selecting a dot moves the marker with `gsap.to` `.3s power2.out` to that dot's centre (measured: marker at x 51, y 7 on red) and sets its colour cream (black on the light theme). Choice saved in `localStorage` key `theme` |
| **Menu button** (mobile) | Text "Menu", `min-w-[2.625rem]` | none | Ring | none | Toggles to "Close". Clicks are ignored for `700ms` after each toggle. No `aria-expanded` in source |
| **Menu overlay** (below 768) | `invisible`, `clip-path: polygon(0% 0%,100% 0%,100% 0%,0% 0%)` | List links use `.link-hover` | Ring | none | Open: see section 7.8. Fills the screen `h-dvh`, red bg / cream text in the red theme. Contains 60 px links, a larger theme switcher (4.25rem dots, gap 20 px) and a footer row "(c) 2026 / Montevideo, Uruguay." |
| **Product tile `a.group`** | Column: photo, then title and price (18/20), then tag with an 8 px dot and "APPAREL" (11 px). Two stacked photos: front, and a back photo hidden with `clip-path: polygon(0 0,0 0,0 100%,0 100%)`, `scale 1.2`, `filter: brightness(400%) contrast(150%)`. A `#d2cac3` block covers both until the reveal | Back photo: clip-path opens to the full rectangle, scale to 1, filter to normal. `transition-all duration-500`, `cubic-bezier(0.87,0,0.13,1)`. The wipe runs left to right. Cursor becomes the "View More" disc (below). All 13 tiles carry a back photo (13 back images with this filter were measured) | Ring on the anchor | none | Reveal on scroll: section 7.5 and 7.6. `draggable=false` on images |
| **Custom cursor** | 8 px red dot (`bg-[var(--cursor-color)]` = `#ff0001`), z-9999, `pointer-events-none`, follows the mouse with `gsap.to` `.8s expo.out` (first move is instant) | Over `data-cursor="text"` (every product tile): 100 px filled red disc with cream "View More", 12 px, medium, uppercase, text fades in `.4s ease-in-out`. Over `data-cursor="grab"` (not used on the captured pages): 50 px red ring with 10 percent black fill. Size changes `200ms ease-in-out` on width, height, margin, opacity | n/a | n/a | Hidden when the mouse leaves the document (opacity 0, `200ms`). Not created at all when `(hover:none) and (pointer:coarse)` or width 768 or less. The native cursor is not hidden by any rule found (see not-verified) |
| **Hero block** | Wordmark, rule, info row | Hero links use `.link-hover` | Ring | none | Entry animation: section 7.4 |
| **Footer** | Static | Links use `.link-hover` | Ring | none | No animation at all |
| **Arrow button** (Checkout, from `31325`) | Inline-flex, text with a hidden arrow parked at `-1em` on the left and a second arrow at rest | Text slides `1em` right and the two arrows shift `1em` right, `500ms`, `cubic-bezier(0.8,-0.01,0.34,1.01)`. `block` variant also draws a 1 px underline from the left over a 30 percent opacity base line | Ring | none | `disabled` shows "Loading..." during checkout |
| **Quantity button** (round plus / minus, cart) | Icon buttons, stroke 0.06em | `hover:opacity-80` | Ring | `active:scale-90`, `transition-all 100ms` | Server-action form, optimistic update |
| **Cart line** | `border-b-[3px]` row, photo, title, options, price, quantity, "Delete" link | Delete uses `.link-hover` | Ring | none | Motion `layout` and `exit={{opacity:0}}`; list block fades in with `transition-opacity delay-500 duration-1000` via `data-inview` |
| **Empty bag** | Big message "Not even one thing? That's sad." with a lazy "Screensaver" layer behind | none | none | none | Message reveals with `AnimatedText` (section 7.11). The Screensaver code is in a chunk that was not captured |
| **Preloader** | Section 7.2 | | | | Runs on every full page load |
| **Page-transition layer `#layer`** | Fixed, z-3, `clip-path: inset(100% 0 0 0)`, red bg, OUTFIT letters in a `max-w-[14rem]` box | | | | Section 7.9 |
| **Toaster** (Sonner) | Region `aria-label="Notifications alt+T"` | | | | `prefers-reduced-motion` turns its transitions off (library CSS). No toast was triggered in the capture |

**Global focus ring (measured, a11y.json).** On `:focus-visible` for `a`, `input`, `button`: outline none; `box-shadow` 2 px ring in neutral-50 `#fafafa` then a 4 px ring in neutral-400 `#a1a1a1` (offset 2 px). Dark theme: neutral-900 and neutral-600. In forced-colors mode a 2 px transparent outline with 2 px offset is added. Keyboard shot: `05-screens/states/keyboard_focus.png` shows the "Shop" link boxed.

## 7 Motion, section by section

### 7.1 Smooth scroll (source read, `d71e6e0a240cbbbc.js`)

| Setting | Value |
|---|---|
| Library | Lenis 1.3.11, created with an empty options object, so all defaults |
| Effective options | `lerp: 0.1`, `smoothWheel: true`, `syncTouch: false`, `wheelMultiplier: 1`, `touchMultiplier: 1`, `orientation: "vertical"`, `infinite: false`, `autoRaf: false`, `anchors: false` |
| Ticker | Lenis is driven by the GSAP ticker: `gsap.ticker.add(t => lenis.raf(t * 1000))`, then `gsap.ticker.lagSmoothing(0)` |
| ScrollTrigger link | `lenis.on("scroll", ScrollTrigger.update)`, then `ScrollTrigger.refresh()` |
| Per-frame formula | `value = (1 - k) * value + k * target`, with `k = 1 - exp(-60 * lerp * dt)`, `dt` in seconds. With `lerp 0.1` that is `k = 1 - exp(-6 * dt)`. It ends when `Math.round(value) === target` |
| Touch | With `syncTouch: false` touch devices scroll natively |
| Stops | Stopped during the preloader, restarted `0.8 s` after it finishes; stopped while the mobile menu is open, restarted on close; `history.scrollRestoration = "manual"` and `scrollTo(0,0)` on load |
| Classes | `<html>` gets `lenis` (measured in the rendered HTML) |

### 7.2 Loader / preloader (measured from `motion_gsap.json` timeline 1 to 6; structure source read from `Preloader.js`)

Runs on every full page load, not on in-site navigation. It is a fixed black full-screen panel (`z-50`, `contain: layout paint style`) holding six photos (`/preloader/image-01.jpg` to `image-06.jpg`, 450 x 600, 9:12, `w-[30vw]` mobile, `md:w-[12vw]`) and the OUTFIT wordmark SVG (`width:28rem`, `max-w-[70%]` on mobile, cream fill, `mix-blend-mode: difference`). The counter sits at top -40 percent, left 105 percent of the wordmark box on desktop, and at top 200 percent, left 80 percent on mobile. Start times below are seconds from the moment the master timeline plays (it is created with `delay: 0.4`).

| Start (s) | Duration (s) | Target | From, to | Ease | Stagger |
|---|---|---|---|---|---|
| 0 | 1.6 total (0.6 each) | 6 photos | scale 0 to 1, rotate 0 to a random value in -20..20 degrees | power3.out | each 0.2, from start |
| 0 | 1.8 total (0.6 each) | 7 wordmark paths (O U T F I T and (r)) | yPercent 110 to 0 | power3.out | each 0.2, from random |
| 0 | 3 | counter text | 000 to 100 (integer, zero-padded to 3 digits) | circ.inOut | none |
| 2.7 | 1 | counter | yPercent 0 to -100, autoAlpha 1 to 0 | circ.inOut | none |
| 2.7 | 1.68 total (1.2 each) | wordmark paths | yPercent 0 to -120 | expo.inOut | each 0.08, from random |
| 2.7 | 1.1 total (0.6 each) | photos | scale 1 to 0, rotate to a new random -20..20 | expo.inOut | each 0.1, from end |
| 3.03 | 1.4 | whole panel | `clipPath: inset(0% 0% 0% 0%)` to `inset(0% 0% 100% 0%)` (the black panel retracts upward) | power2.inOut | none |
| 3.73 | 0 | callback | `isPreloaderComplete = true`, `<html>` gets `loaded`, Lenis restarts after a further 0.8 s | | |

Timeline total is 4.43 s plus the 0.4 s start delay, so the panel is gone at about 4.83 s after mount. Cross-check (measured): the master timeline was created at 1371 ms and the hero timeline at 5486 ms, a gap of 4115 ms; 0.4 + 3.73 s = 4.13 s. So the sequence ran at true speed in the cloud, and the loader was only late because the page took about 1.4 s to become interactive.

### 7.3 Header and theme switcher entrance

CSS only (source read). `#header` and `#theme-switcher`: `opacity 0; transform translateY(-6rem)`; on `html.loaded` they go to `opacity 1; translateY(0)` with `transition: opacity 2s, transform 2s`, timing `cubic-bezier(.19,1,.22,1)` (`--ease-out-extreme`), `transition-delay .5s`. So the nav settles about 0.5 s after the loader ends.

### 7.4 Hero (measured timelines 17 to 20; source read `be5163f90bdc0a39.js`)

Before the loader ends everything is held hidden (`path` yPercent 110, `#hero-line` scaleX 0, text autoAlpha 0). One timeline (2.812 s) then plays at `t = 0` when the loader completes:

| Start (s) | Duration (s) | Target | From, to | Ease | Stagger |
|---|---|---|---|---|---|
| 0 | 1.76 total (1.4 each) | 7 hero wordmark paths | yPercent 110 to 0 | power4.out | each 0.06, from random |
| 0.352 (20 percent of the previous tween) | 1.6 | `#hero-line` (5 px rule, `origin-left`) | scaleX 0 to 1 | expo.out | none |
| 0.352 | 0 | `#hero-paragraph` | autoAlpha 1 (so its lines can animate) | | |
| 0.352 | 2.4 total (1.4 each) | `#hero-title`, `#hero-subtitle`, `#hero-link`, `#hero-shipping-returns-link`, `#hero-copyright`, `#hero-shipping-returns-link-mobile` | autoAlpha 0 to 1, y 32 to 0 | expo.out | each 0.2, from start |
| 0.712 (15 percent of the previous tween) | 2.1 total (1.8 each) | 3 paragraph lines | autoAlpha 0 to 1, yPercent 100 to 0 | expo.out | each 0.15 |

The paragraph is split into `div.line` rows by a bundled splitter (rendered markup shows `display:block; text-align:start; width:100%`, the SplitType pattern, so this is not GSAP SplitText). It reverts the split and clears props when the timeline ends. The wordmark is an SVG, so the letters are clipped by the SVG's own bounds while they rise.

### 7.5 Product row 1

Two things run.

1. **Tile lift (source read `FirstRowItemsReveal`, measured timeline 21/22).** The four anchors are set to `autoAlpha 0, y 75%`. After the loader completes: `autoAlpha 0 to 1, y 75% to 0%`, `duration 1.2`, `delay 0.6`, `expo.out`, `stagger each 0.08`. Total 2.04 s including the delay.
2. **Photo reveal (measured timelines 23 to 26; source read `Item.js`).** When a tile enters the viewport (IntersectionObserver, `threshold 0`) a paused timeline plays at `timeScale(0.85)`: the cover block `div.absolute.inset-0` goes `x: 0 to 100%`, `duration 0.8`, `expo.out`, after the tile's own `delay`; at the same moment the front photo goes from `scale 1.4, x -50%` to natural (`gsap.from`, `0.8`, `expo.out`). Effective duration is 0.8 / 0.85 = 0.94 s, effective delay is delay / 0.85. Row 1 delays are 0, 0.12, 0.24, 0.36 s (source read from the page payload). `will-change: transform` is set during the tween and cleared after.

### 7.6 Product rows 2 to 4

Same photo reveal as 7.5, triggered by the same IntersectionObserver as each tile scrolls in (measured timelines 27 to 35). Delays are 0, 0.2 and 0.4 s from left to right in each of the three rows (source read from the page payload). No lift animation on the anchors themselves after row 1.

Scroll triggers (measured, `motion_gsap.json` triggers, plus source read `GridItemsScroll.js`):

| Trigger | Start | End | Scrub | Pin | Snap | Once | Action |
|---|---|---|---|---|---|---|---|
| Each `[data-product]` tile (13) | `top 75%` | none | no | no | no | yes | `toggleClass: "is-inview"` (no CSS in the shipped stylesheet uses this class, so it is a marker only) |

Only 1 ScrollTrigger was still alive when captured (start 1954 px, end 3195 px, once true). The others were probably killed after firing, but this was not checked (not-verified). ScrollTrigger scrub, pin and snap are used **nowhere** on the home page. There are no marquees and no horizontal scroll sections. There is no scroll-velocity effect in the site's own code.

### 7.7 Footer

Static. No tween targets the footer in the capture. The statement, giant year and links are plain markup.

### 7.8 Mobile menu overlay (source read `MenuOverlay.js`; not seen open in the capture)

Open (`isMenuOpen` true), one timeline with `overwrite`:
1. set overlay `autoAlpha 1` and add `has-menu-open` to `<html>`.
2. overlay `clipPath` `polygon(0% 0%,100% 0%,100% 0%,0% 0%)` to `polygon(0% 100%,100% 100%,100% 0%,0% 0%)` (grows down from the top edge), `1 s`, `power3.inOut`.
3. at "<40%": every `li > *` from `y 80, autoAlpha 0` to `y 0, autoAlpha 1`, `1 s`, `power3.out`, stagger `0.15`.
4. at "<60%": `.menu-footer` from `autoAlpha 0, y 40` to `autoAlpha 1, y 0`, `0.6 s`, `power3.inOut`.

Close: `li > *` to `y -80, autoAlpha 0`, `0.2 s`, `power2.inOut`, stagger `0.05`; `.menu-footer` to `autoAlpha 0, y 80`, `0.2 s`; at "<80%" overlay clip back to the collapsed polygon, `0.4 s`, `power2.out`; at "<20%" remove `has-menu-open`; then set `autoAlpha 0`. The measured closed-state timelines (7 to 16) match: 0.3 / 0.2 / 0.4 s durations.

Also: Lenis stops while open. The menu closes automatically if the viewport grows past 768, and on any route change.

### 7.9 Page transitions (source read `Providers.js` and `TransitionRouter.js`; not captured live)

The router hook (`auto: true`) intercepts every same-origin `a[href]` click, except: `data-transition-ignore`, same path, `target=_blank`, modifier keys, middle click, hash links. The "Return to Shop" link on product pages opts out.

Leave (one timeline, then the route changes):
1. `<html>` loses `ready`; `#layer` set to `autoAlpha 1`.
2. `#page` to `autoAlpha 0.9`, `0.2 s`.
3. at "<": `#page` to `scale 0.9`, `transformOrigin: top`, `y: -16vh`, `1 s`, `power3.inOut`.
4. at "<": `#layer` clip `inset(100% 0% 0% 0%)` to `inset(0% 0% 0% 0%)`, `1 s`, `power3.inOut` (curtain rises from the bottom).
5. at "<20%": `#layer path` `yPercent 110` to `0`, `0.6 s`, `power2.inOut`, stagger `0.06` from random.

Enter:
1. `#layer path` `yPercent 0` to `-110`, `0.6 s`, `power2.inOut`, stagger `0.06` from random.
2. at "<30%": `#layer` clip `inset(0%)` to `inset(0% 0% 100% 0%)`, `0.8 s`, `power3.inOut`.
3. at "<60%": add `ready` to `<html>` and release the navigation.

`#layer` is red with cream letters in the red theme (`max-w-[14rem]`, the same OUTFIT wordmark component).

### 7.10 Cursor (source read `Cursor.js`)

`mousemove` on `window` calls `gsap.to(cursor, {x: clientX, y: clientY, duration: 0.8 * hasMovedBefore, ease: "expo.out"})`. There is no `requestAnimationFrame` loop and no `quickTo`; the `quickTo` and `lerp` hits in the bundle index are library code (GSAP core and Lenis). State classes swap on `mouseenter` / `mouseleave` of `[data-cursor]` elements, re-bound on route change.

### 7.11 Bag and product pages (source read)

- Bag hero: 7 letter paths `yPercent 110` to `0`, `1.4 s`, `power4.out`, stagger `0.08` random; `#hero-line-bag` `scaleX 0` to `1`, `1.2 s`, `expo.out`, at "<20%".
- Empty state: `AnimatedText`: GSAP SplitText by lines with a mask; lines from `y: 1.2em`, `stagger 0.1`, `duration 1`, `delay 0.2` (bag passes `0.4`), `expo.out`; ScrollTrigger `start: "top 85%"`; splits revert on complete. Whole state fades with Motion (`opacity 0 to 1`, `0.3 s`).
- Cart with items: list fades in (`transition-opacity delay-500 duration-1000`, driven by `data-inview`); rows use Motion `layout` and fade out on delete.
- Product page: sticky info column (`lg:sticky lg:top-28`); gallery is a vertical stack on desktop and a horizontal scroller on mobile (`w-[85vw]` slides, `scrollbar-hidden`). Same cover-block reveal on each image.

### 7.12 GSAP trigger summary

| Item | Trigger | Pin | Snap | Scrub | Once |
|---|---|---|---|---|---|
| Preloader timeline | page mount | no | no | no | runs each full load |
| Hero timeline | loader complete | no | no | no | yes |
| Row 1 lift | loader complete | no | no | no | yes |
| Tile cover-block reveal | IntersectionObserver `threshold 0` | no | no | no | function returns a cleanup, so re-entry behaviour is not proven |
| `is-inview` marker | ScrollTrigger `top 75%` | no | no | no | yes |
| AnimatedText (bag, product) | ScrollTrigger `top 85%` | no | no | no | split reverted after first play |
| Menu, theme marker, transitions | state change | no | no | no | per event |

Frame samples (`motion_sampled.json`): 58 to 63 candidate elements at each of 10 scroll stops, zero moving. That is consistent with the site having no scroll-linked motion (GSAP scrub count is zero).

## 8 3D

None. `three.json` and `scene-3d.json` both read "no canvas on page". `canvases: []`, `draws: 0`, no WebGL, no shaders, no models, no `<video>`, no audio (probe). The only "depth" effects are CSS transforms and clip-paths.

## 9 Responsive

Breakpoints found in the CSS (source read, media queries in the inline stylesheet). `responsive.json` `breakpointsFound` came back empty, because the checker looked for structural change, not media queries, so these come from the CSS.

| Query | What changes |
|---|---|
| `min-width: 40rem` (640) | `sm:` helpers: the empty-bag message grows to 10.75vw |
| `min-width: 48rem` (768) | The main switch (`md:`): 16-column grids; hero info row spreads to 16 columns; nav shows Shop and the theme dots, Menu button hides; footer sentence 24/32; footer statement 6vw and giant year 12.75vw; preloader photos 12vw wide and counter moves beside the wordmark |
| `min-width: 64rem` (1024) | `lg:` gutter 24 px; row 1 goes from 2 to 4 columns; product page becomes two columns with a sticky info panel |
| `min-width: 80rem` (1280) | `xl:` cart layout goes to 16 columns; empty-bag block height 40vh |
| `min-width: 92em` (1472) | Root font-size 18 px, so every rem size grows 12.5 percent |
| `min-width: 96rem` (1536) | container max-width only |
| `min-width: 475px` | one width helper only |
| `(hover: hover)` | all hover effects are wrapped in this |
| `(forced-colors: active)` | focus outline fallback |
| JS `(max-width: 768px)` | cursor is removed and the menu logic runs. Note this is 768 inclusive, while CSS `md:` starts at 768, so exactly 768 px gets both the desktop nav and no custom cursor |
| JS `(hover: none) and (pointer: coarse)` | cursor removed |

Fresh-load results at each width (measured):

| Width | Height | Nav links visible | Custom cursor | Overflow X | Touch | Tweens |
|---|---|---|---|---|---|---|
| 360 | 4505 | 2 (Bag, Menu) | no | no | yes | 259 |
| 390 | 4581 | 2 | no | no | yes | 273 |
| 768 | 3769 | 3 | no | no | yes | 270 |
| 820 | 3916 | 3 | no | no | yes | 272 |
| 1024 | 3354 | 3 | yes | no | no | 282 |
| 1280 | 3768 | 3 | yes | no | no | 278 |
| 1440 | 4061 | 3 | yes | no | no | 272 |
| 1920 | 5106 | 3 | yes | no | no | 268 |

The `hamburger: false` field in the results is a checker miss: the mobile menu is a plain text button "Menu" with no icon, which the checker did not count (source read, section 6).

**Live-resize (measured):** 1440 to 1024 to 800 to 760 to 390 and back to 800 and 1440. Page heights were 4061, 3354, 3859, 6637, 4581, 6637, 3859, 4061. Points to note:
- At 800 px the page had horizontal overflow (`overflowX: true`) both times. Fresh loads at 768 and 820 did not. Cause not found.
- At 760 px the page was 6637 px tall, far taller than fresh 768 (3769). This is the mobile grid holding at 760 with wide photos (inferred from the 768 CSS switch; not checked in pixels).
- The tween count kept climbing during live-resize (281 up to 338), so animations are re-created on resize without all old ones being cleared. Cause unclear.
- After shrinking, `has-custom-cursor` stayed on `<html>` because the code only removes it when the touch flag changes. The cursor component itself is removed at 768 or less. Harmless (source read plus inference).

**Reduced motion (measured `responsive.json.reducedMotion` and `reduced_motion_top.png`):** the page looks and animates the same: 275 tweens against 272 in the normal load; the screenshot equals the first view. The site's own code has no `prefers-reduced-motion` handling (searched: the only hits are NumberFlow, Sonner and Motion internals). GSAP, Lenis and the preloader all run for reduced-motion users.

## 10 Accessibility, meta and extras

| Topic | Finding | Label |
|---|---|---|
| Dark mode | No `prefers-color-scheme` rules (`prefersDarkRules: false`). "Dark" is a manual theme chosen with the dots and saved in `localStorage` (`theme`). There is no system-following mode in the theme list | measured, source read |
| Language | `lang="en"` | measured |
| Landmarks | `nav: 1`, `main: 1`, `footer: 1`, `header: 0` (the header is a `<nav id="header">`) | measured |
| Headings | Only two: H1 "OUTFIT" and H2 "WHY", both 12 px labels. The visual wordmark is an SVG with no accessible name. Product titles are `<p>`, not headings | measured |
| Skip link | None | measured |
| Images | 32 images, 0 without an `alt`. 6 have empty alt (the preloader photos, correctly decorative). Tiles use the product title as alt on both front and back photos, so screen readers hear each name twice | measured, source read |
| Screen-reader text | 3 `sr-only` spans (logo "OUTFIT(r)", "++hellohello") | measured |
| Theme dots | Buttons with `aria-label` "Switch to dark / light / red theme". No pressed state is exposed | source read |
| Menu button | No `aria-expanded` or `aria-controls`; the closed overlay is `invisible` so it is out of the tab order; no focus trap | source read |
| Keyboard focus | Visible ring on every link and button: grey `#a1a1a1` 2 px ring with a light offset. Against the cream page that is about 2.06:1 (computed from `#a1a1a1` and `#ede4dd`), under the 3:1 non-text guideline | measured ring, computed ratio |
| Contrast (measured `contrastPairs`) | Red on cream 3.19; cream on red 3.19; red on black 5.25; black on red 5.25; cream on black 16.74; black on cream 16.74; black on `#d2cac3` 12.98; red on `#d2cac3` 2.47; cream on `#d2cac3` 1.29 | measured |
| What that means | The default red on cream is 3.19:1. It passes only for large text (18.66 px bold or 24 px and up). The site's 11, 12, 14 and 18 px red copy fails 4.5:1 for normal text. `#5A5A5A` on cream (light theme second line) is about 5.5:1 (computed) | measured, computed |
| Cyan nav | Contrast changes with what is behind it because of the blend. It cannot be pinned to one ratio | inferred |
| Live regions | Sonner toaster region; NumberFlow exposes `role="img"` with `aria-label="$36.50"`; cart forms have `aria-live="polite"` status lines; Next route announcer exists | source read |
| Meta | `<title>OUTFIT(r) by ++hellohello</title>`; description "Created by the ++hellohello team, this store and signature collection celebrates our collective creativity and passion for apparel. Carefully designed."; `robots: index, follow`; Open Graph title, description, image 1200 x 630 PNG, type website; Twitter `summary_large_image` with the same image; icons `favicon.ico` and `icon.png` (both 32 x 32) | source read |
| Route titles | Pattern "Product name \| OUTFIT(r)": Your Bag, Shipping & Return Policy, and each product | measured |
| Unknown URL | `/xray-page-that-does-not-exist` returns HTTP 200 with the home title and a blank 900 px page. A soft 404 | measured |
| Links | 28 links found on the home page: internal shop and product links, plus external ++hellohello, Dribbble, Instagram, LinkedIn, Twitter (X), Work, Services, About, Careers, Contact, Privacy. External links use `rel="noopener noreferrer"` | measured |
| Selection colour | Black background with cream text in the red theme; red with cream in the other themes | source read |
| Third parties | Google Tag Manager only | measured |

## 11 Page weight and cost

From `weight.json` (uncompressed sizes; cloud software rendering).

| Type | Files | KB |
|---|---|---|
| Script | 21 | 1007 |
| Document (HTML with Flight payload) | 1 | 342 |
| Image | 23 | 106 |
| Font | 3 | 104 |
| Fetch / other | 29 | 2 |
| **Total** | 77 | about 1561 (computed sum) |

- Largest requests: the HTML at 342 KB and chunk `b6c772e00f0f005f.js` (Next runtime) at 218 KB.
- Timing in the cloud: first paint and first contentful paint 400 ms; `DOMContentLoaded` 8121 ms and `load` 8129 ms. The 8 s figures are inflated by the cloud proxy and by the GTM script; do not read them as real-user timings.
- Frame rate at the top of the page: 61 fps (no WebGL, so the software-rendering limit does not bite here).
- Images: only 23 image requests / 106 KB counted, because the product photos are lazy and served through `next/image`. The full-size Shopify originals saved in `03-assets/images/1455/` are 26 photos of 294 to 635 KB each, about 12.9 MB in total, and the 6 preloader photos add 148 KB. Those are the source files, not what the page downloads.
- Fonts: three woff2 files, 34, 35 and 36 KB (probe resource list).
- Scripts: 21 chunks. GSAP, ScrollTrigger, SplitText, CustomEase, Lenis, Motion, NumberFlow, Sonner and core-js all ship in the main path, even though the home page uses no scrub, pin or snap.

## 12 What is worth porting, in order

1. **The 4-tone system**: one cream ground, one loud accent, black, and nothing else. Costs nothing and carries the whole look (section 4).
2. **Giant type as the layout**: an SVG wordmark at the full content width, a 5 px rule, and a 6vw / 12.75vw footer statement (section 5).
3. **Product tile reveal**: cover block slide plus 1.4 counter-zoom, expo.out, with per-row delays (section 7.5 and 7.6).
4. **Second-photo hover wipe**: clip-path plus brightness flash, 500 ms, `cubic-bezier(0.87,0,0.13,1)` (section 6).
5. **The `.link-hover` underline draw**: eight lines of CSS (section 6).
6. **Difference-blend nav** for a header that stays legible over any photo (section 4).
7. **Preloader collage**: one timeline, use once per session, and skip it for reduced motion (section 7.2).
8. **Page-transition curtain**: only if the router already supports leave / enter hooks (section 7.9).
9. **Custom "View More" cursor**: desktop only, with the native cursor kept (section 7.10).
10. **Lenis at defaults with `lagSmoothing(0)`**: only if smooth scroll is wanted; the page has no scroll-linked motion that needs it (section 7.1).
11. **Do not port**: the missing reduced-motion handling, the 3.19:1 red-on-cream body copy, the missing skip link and the soft 404.

### Why this reference matters for a leather-bag store

- **A warm neutral ground with one accent.** The cream `#ede4dd` field with a single strong accent and black sits well with leather tones and product photography; swap the red for a deep brand colour that passes contrast (section 4).
- **Image-first asymmetric grid with quiet metadata.** Product name and price at 18 px, a tiny 11 px category tag, and tiles of different widths on a 16-column grid let bag photography lead without heavy card chrome (section 3 grid table and section 5).
- **Second-photo hover for a detail shot.** The clip-path wipe from left is a natural fit for showing stitching or grain on hover, and tiles already carry two images each (section 6, product tile).
- **One restrained reveal, used everywhere.** The cover-block slide with a counter-zoom on `expo.out` feels premium at almost no cost and works for every product row; keep it to once per tile (section 7.5 and 7.6).
- **Copy the structure, fix the accessibility.** The site scores 3.19:1 for its default red on cream, a grey focus ring near 2:1, no skip link and no reduced-motion handling. An accessible-premium brand should keep the layout and type but use an accent with at least 4.5:1 for small text, a stronger focus ring, a skip link, and switch the preloader and Lenis off for reduced-motion users (sections 9 and 10).
