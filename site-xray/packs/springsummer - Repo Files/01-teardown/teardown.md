# Spring/Summer (springsummer.dk) teardown

## 1. Header

| Item | Value |
|---|---|
| Site | https://springsummer.dk/ |
| Captured | 2026-09-29, cloud Chromium |
| Main viewport | 1440 x 900 |
| Fresh loads | 360, 390, 768, 820, 1024, 1280, 1440, 1920 wide (responsive.json) |
| Live resize | 1440, 1024, 800, 760, 390, 760, 800, 1440 |
| Pack folder | `springsummer - Repo Files` |

**Evidence labels used on every value**

| Label | Meaning |
|---|---|
| measured | Read from the running page or a library's own objects (GSAP tween values, computed heights, font sizes) |
| source read | Copied from shipped CSS, JS or the server-rendered page data |
| fitted | Worked out from frame samples. The rms error is given. Over 0.05 is treated as inferred |
| inferred | From the video, a screenshot, or my own arithmetic on source values. The reason is given |

**Read this first: what the capture does and does not cover.** The map stages were first run with a capture bug (`Cannot read properties of undefined (reading 'trim')`, see `failures.txt`) and then re-run with a fixed script. The pack now has `map_desktop-1440.json`, `map_phone-390.json`, `tokens.json`, `scroll-map.json` and desktop and phone screenshots. Limits that remain:

- The map measured only five page-level boxes (header, layout, hero, footer, backdrop), so most section ranges in section 3 are read off screenshots and labelled inferred.
- Every screenshot has the cookie dialog over it, and the phone shots show no content below the hero (lazy content had not revealed). Only one home view plus route and 404 shots exist in `states/`. I extracted frames from the 25 second video to see the loader and the hero.
- `tokens.json` only measures elements present at scroll 0, so some type roles are source read.
- Hover diffs in `pointer.json` are empty for all 17 targets. Hover behaviour below is source read from CSS, not measured.

Every gap is repeated in `not-verified.md`.

---

## 2. Summary

**What it is.** The home page of Spring/Summer, a Copenhagen design and technology agency. One long page (measured height 4997 px at 1440) made of a red-on-paper hero, an autoplaying case-study carousel, a client logo grid, a fullscreen video, a red statement block, team copy and a footer. A right-hand column of glass "widgets" (link, newsletter) trails the scroll.

**Stack (measured or source read)**

| Layer | What | Version | Label |
|---|---|---|---|
| Framework | Nuxt (Vue 3 SSR, `window.__NUXT__` present) | Nuxt version not found in shipped code | measured |
| UI | Vue | 3.5.13 | source read |
| Router | vue-router | 4.5.1 | source read |
| Animation | GSAP core | 3.13.0 | source read |
| Animation plugins | ScrollTrigger and CustomEase are bundled; ScrollTrigger is created 0 times on the home page (`triggers: []`), CustomEase is used for the loader curve | 3.13.0 | source read |
| Other animation | anime.js is in the bundle (`yi.version="3.2.0"`) | 3.2.0 | source read |
| Carousel | Swiper (has `swiper-slide-fully-visible`, so v11 era) | major version inferred | inferred |
| Video | Mux `mux-video` component, HLS via hls.js | hls.js 1.5.20 string in the Mux chunk | inferred |
| 3D | three.js `__THREE__ = "149"` plus Spline runtime 1.9.89, in the big chunk. No canvas on the page | three r149, Spline 1.9.89 | measured / source read |
| Physics | Matter.js, only on the 404 page | 0.20.0 | source read |
| Smooth scroll | None. Native scroll. No Lenis, no ScrollSmoother | n/a | measured |
| CMS | Craft CMS with SEOmatic (`generator = SEOmatic`, `/actions/seomatic/...`, images from `live.springsummer.dk/media`) | n/a | source read |
| Images | imgix (`?auto=compress,format&fit=clip&q=35&w=...`, widths 320 to 2600) | n/a | source read |
| Errors and tracking | Sentry (nuxt SDK 10.14.0), Google Tag Manager `GTM-MF5T8XT2`, reCAPTCHA, Cookie Information consent banner | n/a | source read |
| Shop code | Shopify storefront cart code is bundled, not used on the home page | n/a | source read |

**Fonts and licence status.** All three brand faces come from Pangram Pangram. They are commercial fonts. I did not verify the exact licence terms online (see not-verified.md). The font files are NOT in this pack.

| Role | Family (CSS name) | File | Status |
|---|---|---|---|
| Display | PP Right Grotesk Compact Black (`Grotesk`) | `PPRightGrotesk-CompactBlack.woff2` | Paid for commercial use |
| Body | PP Neue Montreal Regular (`Montreal`) | `PPNeueMontreal-Regular.woff2` | Paid for commercial use (free trial for personal use is the foundry's usual model, not checked) |
| Mono | PP Supply Mono Light (`Supply`) | `PPSupplyMono-Light.woff2` | Paid for commercial use |
| Chinese fallback | Noto Sans TC (`Noto`, never loaded on the home page) | `noto-sans-tc.woff2` | Free (open licence) |
| Icons | `swiper-icons` (inline base64, Swiper's own) | inline | Free (MIT) |

All are declared with `font-display: swap` and `local()` first (source read). Only one weight per family is shipped, so bold text is browser-faked (`strong` sets `--font-weight: 600`).

**Page height.** 4997 px at 1440 and 16039 px at 390 (measured, map files). Earlier reads gave 4187 at 1440 and 3862 at 390 because the fullscreen video row and other lazy content had not loaded yet (see section 3). The fresh-load heights in section 9 (768 = 4773, 820 = 4929, 1024 = 2744, 1280 = 3831, 1920 = 5480, 360 = 14487) come from that earlier, shorter state, so they are not comparable with 4997; treat 1024 and 360 as suspect.

### Top 5 signature effects, ranked by how much they add

| Rank | Effect | Why it matters | Rebuild cost |
|---|---|---|---|
| 1 | **Row-driven theme swap.** The whole page background and text colour change when a row crosses the middle of the viewport. Two colours, three combinations, 0.4 s ease-out. | Gives the page its rhythm and its brand feel with almost no assets | Low. About 40 lines of JS plus CSS variables |
| 2 | **Word-cycling loader into a curtain wipe.** "Creating / [word] / All seasons" cycles nine words at 0.2 s each, then a paper curtain and the loader slide down while the page drops in from -10vh over 2 s. | Turns first load into a brand moment | Medium. One GSAP timeline, one custom ease, about 60 lines |
| 3 | **Giant "WE WON" headline at 34 grid units wide plus a lerped parallax video card.** 386.24 px type at 1440, two lines, with a rounded video card that drifts slower than the scroll. | The most memorable frame on the site | Low to medium. CSS calc plus a 20 line rAF loop |
| 4 | **Glass widget column with scroll lag.** Newsletter and link cards in the right sidebar, each lerped toward its slot and nudged by scroll speed. | Makes the fixed column feel alive | Medium to high. Needs the stacking maths in section 7 |
| 5 | **Case page transition.** Clicking a case teaser expands it to full bleed while the new title's letters drop in with random 0 to 0.25 s delays. Other routes use a themed curtain. | Keeps the site feeling like one continuous object | High. Needs route hooks, a fixed clone and video time sync |

---

## 3. Page map

Desktop 1440. Rem is 20 px at 1440 (`html{font-size:max(20px, calc(8px + .83333vw))}`, source read, resolves to 20 px).

**Page height: 4997 px (measured, `scroll-map.json` and `map_desktop-1440.json`).** Earlier reads (probe, responsive.json) said 4187. The map's own section list was taken while the layout box was 4187 tall, and the document then grew to 4997. The 810 px difference equals a full width 16:9 video at 1440 (1440 x 9 / 16 = 810, arithmetic), so I read it as the fullscreen video row loading late. Consequence: `top` values of the hero (223) and the footer (3645) are from the 4187 state. Anything above the video row is unchanged; the footer sits 810 px lower in the final layout (4455 to 4997, arithmetic, and it matches the last screenshot).

**How the pixel columns were made.** Labels: **measured** = `map_desktop-1440.json` section boxes; **inferred (screenshot)** = read off `05-screens/desktop-1440/*.png` by adding the scroll offset in the file name to the y in the shot; **inferred (pointer)** = `pointer.json` `top` read as document y; **arithmetic** = source CSS plus the grid below. Only five boxes were measured (header, layout, hero, footer, backdrop), so the per-row ranges are not all measured. Every screenshot has the cookie dialog over it.

Grid at 1440 (arithmetic from source-read CSS): sidebar 250 px (`12.5rem`), outer margin 54 px (`2.7rem`), gap 16 px, 12 columns of 80 px, column step 96 px, content width 1136 px. Header 52 px (`2.6rem`).

| # | Section | y range at 1440 | Background / text | Pinned? | What it is |
|---|---|---|---|---|---|
| 0 | Loader and curtain | Fixed, first load only | Paper curtain, red text | Fixed overlay, removed after | Word cycler, see section 7 |
| 1 | Header | 0 to 52, fixed on every scroll | Follows page theme | Fixed (CSS), no ScrollTrigger | Logo, 3 dropdown menus, analog clock |
| 2 | Intro tagline row | 0 to 223 (ends where the hero box starts, measured 223; row has 100 px top padding, source read) | Red on paper (edge pixel #DEDCD3, measured) | No | "Spring/Summer is a Copenhagen based strategic design and technology agency..." in body-xl 43.2 px |
| 3 | Hero "WE WON" | 223 to 1057 (top 223, height 834, **measured**). Padding 100 / 250 / 54 / 54 px. Two lines of 289.757 px (h1 line box, measured) | Red on paper | No. The video card is parallax, not pinned | h1 at 386.24 px plus overlay video card at column 8 |
| 4 | Awards text row | About 950 to 1080 (5 lines of copy, inferred from screenshot at scroll 900). Overlaps the bottom of the hero box because the row has a -100 px top margin (source read) | Red on paper | No | "1 x Gold at Danish Digital Awards... 3 x Silver at Creative Circle Awards..." in body-l, 6 columns wide |
| 5 | Carousel "Some of our work" | About 1140 to 1880. Title and arrows at about 1148 (screenshot at 900; pointer says 1140). First slide top about 1190, slide bottom about 1880 (screenshot at 1500), so slides are about 690 px tall (arithmetic said 700) | Red on paper, slide text white (measured, 187 white text nodes) | No | Swiper, 17 case slides, autoplay |
| 6 | "Clients we helped in 2025" label | About 2086 (label y in the screenshot at 1500) | Ink on paper | No | Mono label, 12 px, 75 percent opacity |
| 7 | Logo grid | About 2116 to 2485 (first tile top 2118 in the screenshot at 1500, pointer says 2116; last row ends about 2485 in the screenshot at 2100). 6 columns, 3 rows, tiles about 179 x 112 px (arithmetic) | Ink on paper | No | 18 SVG client logos, "Our work" widget beside it |
| 8 | "Decade of experience" text row | About 2570 to 2625 (3 text lines in the right columns, screenshot at 2100) | Ink on paper | No | 2 column row, text in right column |
| 9 | Fullscreen video | Between about 2640 and 3690, 810 px tall (arithmetic, see page height note). Shows as empty paper in every screenshot because the Mux stream could not play | Ink on paper | No | Full width Mux video, separate desktop and mobile files |
| 10 | Red statement headline | About 3690 to 3950 (headline top about 3690 from the screenshots at 3000 and 3300: the same headline moves from viewport y 690 to 395; two lines of 129.504 px, measured, end it near 3950) | Paper on red (edge pixel #FE3939 from scroll 3300, measured) | No | "Lasting First Impressions", photo cluster, newsletter widget in the right column |
| 11 | Team copy row | About 3950 to 4455 (photo top about 3950 in the screenshot at 3300, copy beside it; ends where the footer starts, arithmetic) | Paper on red | No | Two paragraphs, arrow link "Working at Spring/Summer", two images |
| 12 | Footer | 4455 to 4997 (3645 + 810, h 542, padding 52 / 0 / 30, footer box **measured** in the 4187 state, shifted by arithmetic). At scroll 4097 the big heading "CAN WE HELP YOU?" sits at viewport y about 620 to 750 | Cream on near black: edge pixel #1A1A1A (measured at scroll 4097) | No | Address widget, contact links, sweeping "Can we help you?" heading (Grotesk 170.4 px, line 129.504, measured), social links, byline |

There is no pinning, snapping or scrubbing anywhere on the page. `responsive.json` reports `pinSpacers: 0` at all 8 widths, `motion_gsap.json` reports `triggers: []` and `stFound: false`.

### Phone map (390 x 844, `map_phone-390.json`, measured)

Page height 16039. The section list was taken with a 15551 px layout box, so the same late-loading effect applies (488 px extra; 390 x 1.25 = 487.5, so probably a portrait video, inferred). Header 0 to 52 fixed; the mobile nav overlay is a fixed 390 x 844 box with padding 52 / 20 / 25 and background rgba(222, 220, 211, 0.1); hero box top 231, height 427 (231 to 658), padding 60 / 20; footer top 14899, height 652, padding 52 / 0 / 60. At 390 the page is about 3.2 times as long as the desktop page (16039 / 4997, arithmetic). The phone screenshots show only paper, the header and the cookie sheet: lazy images and text rows had not been revealed when they were taken (see not-verified.md), so no phone section ranges below the hero can be trusted from the shots.

### Colour rhythm

**Measured (pixel samples, `pixelRhythm1440`).** The sampler read the left edge and the centre at 10, 25, 50, 75 and 97 percent of the viewport height at each scroll stop. The left edge is the page background. The centre column is polluted by the cookie dialog (the 75 percent centre is #CCCCCC in almost every row), so I use the edge only.

| Scroll y | Edge (background) | What it means |
|---|---|---|
| 0 to 3000 | #DEDCD3 paper | Red-on-paper and ink-on-paper rows |
| 3300, 3600, 3900 | #FE3939 red | Statement and team rows |
| 4097 (bottom) | #1A1A1A near black; a glyph pixel of the heading reads #F0EDE4 cream | Footer |

The flip to red happens between scroll 3000 and 3300. The headline top is about 3690, so the midpoint rule of section 7 (row top at or above scrollY + 450) fires at about scroll 3240, which fits. The flip to dark happens between 3900 and 4097: footer top is about 4455, so it fires at about scroll 4005, which also fits. Phone edges are paper all the way to scroll 14000, red at 14700 (#FE3939 in the middle samples) and #1A1A1A at 15195 (the end), matching the desktop order.

**Source read (per-row theme values from the server-rendered page data).** In order down the page:

| Order | Row | Text | Background |
|---|---|---|---|
| 1 | Intro, hero, awards, carousel (4 rows) | Red hsl(360 99% 61%) = #FE3939 | Paper hsl(49 14% 85%) = #DEDCD3 |
| 2 | Clients label, logo grid, decade text, fullscreen video (4 rows) | Ink hsl(12 33% 3%) = #0A0605 | Paper |
| 3 | Statement and team copy (2 rows) | Paper | Red |
| 4 | Footer | Cream, measured pixel #F0EDE4. The footer registers its own theme from the CMS footer data (`theme: footer.theme`, source read) but I did not read the values. #1A1A1A with cream matches the category page pair hsl(0 0% 10%) and hsl(43 39% 93%), so that is probably the same pair (inferred) | Near black #1A1A1A (measured) |

So the page runs red on paper, ink on paper, a full red slab, and closes on near black. My earlier reading, that the footer falls back to paper, was wrong: the pixel data shows it goes dark. Contrast of the footer pair, on the measured pixels: 14.9 (my arithmetic).

---

## 4. Colours

Sources: `tokens.json` (computed styles counted over the whole DOM at scroll 0, with the cookie dialog open, so the counts are inflated by the dialog), the page pixel samples, and the CMS theme data (source read). Hex for HSL values is my conversion.

**Measured colours in `tokens.json` (9 entries, 1440)**

| Measured value | Count | Where |
|---|---|---|
| text rgb(254, 57, 57) = #FE3939 | 362 | Cookie dialog and page text on the red-text rows |
| text rgb(255, 255, 255) | 187 | Case teaser titles and subtitles (white text on photos) |
| background rgb(222, 220, 211) = #DEDCD3 | 15 | Dialog panels, page paper |
| border 1px rgb(254, 57, 57) | 12 | Dialog, Decline and Accept buttons |
| gradient linear-gradient(#FE3939, #FE3939) | 12 | The underline-draw trick on links and buttons |
| background rgb(254, 57, 57) | 11 | Accept button, toggles |
| text rgb(222, 220, 211) | 9 | Accept button label (paper on red) |
| border 1px rgba(254, 57, 57, 0.2) | 4 | Widget cards and a bracket border |
| border 1px rgba(254, 57, 57, 0.3) | 2 | Email input and a bracket border |

Also measured: 98 CSS variables (the colour ones are `--color-white`, `--color-black`, `--color-grey`, `--color-beige`, `--color-yellow` and the derived `--white` and so on). The set also contains cookie-vendor defaults (`--main-color #2C622C`, `--link-color #234923`, `--hover-color #234923`, `--decline-color #f6f6f6`, `--decline-hover #dddddd`, `--footer-background #f6f6f6`, `--text-color #222`) that the site's own rules override, and Swiper's `--swiper-theme-color #007aff`. No blend modes were found. No box shadows except the reCAPTCHA badge. Measured radii: 4px (87 nodes, that is `--br` .2rem), 3px (buttons, tags), 100px (toggles), 50% (clock), 5px, 2px.

**Palette**

| Token | HSL | Hex | Used for |
|---|---|---|---|
| Ink | hsl(12 33% 3%) | #0A0605 | Text on the clients, logo grid, decade and video rows (source read; not in `tokens.json` because scroll 0 is a red-text row) |
| Red | hsl(360 99% 61%) | #FE3939 | Hero text, header text at top, loader text (tween ends at rgb(254.0, 57.1, 57.1)), the red slab background. Measured in `tokens.json` and in the pixel samples |
| Paper | hsl(49 14% 85%) | #DEDCD3 | Home page background, curtain colour (tween rgb(222.1, 220.1, 211.4)), text on the red slab. Measured |
| Footer black | not read from source | #1A1A1A | Footer background at the bottom of the page (measured pixel at scroll 4097 desktop and 15195 phone) |
| Footer cream | not read from source | #F0EDE4 | Footer heading (measured glyph pixel, blurred by the cookie backdrop, so it may be a few levels off) |
| Category black | hsl(0 0% 10%) | #1A1A1A | Background of `/category/*` pages (source read); same hex as the footer, so the footer pair is probably the same theme (inferred) |
| Category cream | hsl(43 39% 93%) | #F4F0E6 | Text on `/category/*` pages (source read) |
| White | hsl(0 0% 100%) | #FFFFFF | `--white`, `theme-color` meta, 404 page background |
| Black | hsl(0 0% 0%) | #000000 | `--black`, 404 headline |
| Grey | hsl(0 0% 21%) | #363636 | `--grey`, video control background at 90 percent |
| Beige | hsl(43 49% 90%) | #F2EBD9 | `--beige`, video UI text |
| Yellow | hsl(56 100% 50%) | #FFEE00 | `--yellow`, declared, not seen in use |
| Focus blue | n/a | #1E90FF | Focus ring and inline code chips |
| Clock second hand | n/a | #D00 | Analog clock second hand |

Other route themes (source read, `themeDefault`): `/page/apps` red on paper, `/page/brand` paper on ink, `/page/ecommerce` red on ink, `/page/websites` ink on red. Each case study carries its own pair (17 pairs are in the home page data, for example Polene text hsl(23 28% 85%) on hsl(75 18% 18%), Nationalmuseet hsl(12 22% 5%) on hsl(140 100% 59%), Nitex black on hsl(69 100% 50%)). These are applied on the case pages, not on the home page.

**Contrast (my arithmetic on the values above; `a11y.json` `contrastPairs` is empty)**

| Pair | Ratio |
|---|---|
| Ink on paper | 14.68 |
| Paper on ink | 14.68 |
| Ink on red | 5.63 |
| Red on ink | 5.63 |
| Red on paper | 2.61 (fails AA for normal and large text) |
| Paper on red | 2.61 (fails AA) |
| White on red | 3.58 |
| Category cream on category black | 15.29 |
| Footer cream #F0EDE4 on #1A1A1A (measured pixels) | 14.9 |

The hero copy and the whole statement slab sit on the 2.61 pairs. Type that big survives it. Small text on those rows does not.

**Recipes for glow, gradient and glass**

| Recipe | Value | Where |
|---|---|---|
| Curtain shadow | `box-shadow: 0 0 50px rgba(0,0,0,.1)`, `outline: 1px solid rgba(255,255,255,.3)` on route curtain | Loader curtain (measured) and route curtain (source read) |
| Glass card | `backdrop-filter: blur(10px)`, `border: 1px solid hsla(text / .2)`, `border-radius: .2rem`, `padding: .7rem` | Widgets |
| Dropdown glass | `backdrop-filter: blur(60px)`, `background: hsla(bg / .75)`, `border: 1px solid hsla(text / .2)` | Header menu panel |
| Mobile menu glass | `backdrop-filter: blur(100px)`, `background: hsla(bg / .1)` | Header overlay below 1200 |
| Header blur strip | `backdrop-filter: blur(8px)`, height 1.3461 x header (about 70 px), masked by an inline SVG with a rounded notch | Under the header |
| Cookie backdrop | `backdrop-filter: blur(5px)` | Consent dialog |
| Drawer backdrop | `blur(20px)` when a mobile widget stack is open | `main > .backdrop` |
| Card overlay | `linear-gradient(1turn, rgba(0,0,0,.3) 10%, transparent 50%)` | Profile cards |
| Text shade on scroll lists | `mask-image: linear-gradient(transparent, #000 .5rem)` pairs | Cart lists |
| Right fade on long headings | `mask-image: linear-gradient(90deg, #000 var(--start), rgba(0,0,0,.4) calc(var(--start) + sidebar x .2), transparent 90%)` with `--start: calc(100% - sidebar)`. Measured on the footer heading: `linear-gradient(90deg, #000 calc(100% - 250px), rgba(0,0,0,.4) calc(100% - 200px) ...)`, which confirms the formula at 1440 (sidebar 250, x .2 = 50) | Footer heading, moving hero headline |
| Bracket border | `border:1px solid hsla(text/.3); border-radius:.2rem; height:1.2rem; mask-image: linear-gradient(#000 50%, transparent 0)` shows only the top half (or `transparent 50%, #000 0` for the bottom half) | Header underline, footer top, form and newsletter frames |
| Blurred glow | `filter: blur(150px)` on a background media | Shopify product block (not on home) |

Measured in `tokens.json`: backdrop blur 10px (3 widgets), 5px (cookie overlay), 8px (header blur), 0px idle (the `main > .backdrop`), two half-masks (bracket borders), one masked footer heading, and 15 SVG clip paths (icons). There are no gradient backgrounds on the home page (the only gradients measured are the 1 px underline lines). Colour is flat.

---

## 5. Type

Fonts are set by three variables: display `Grotesk`, `Impact`, sans-serif; sans `Montreal`; mono `Supply`. Body inherits Montreal. Rem is 20 px at 1440 and at 390 (the `max(20px, ...)` floor), and 24 px at 1920 (`8px + .83333vw`).

### Desktop scale (1440, 900 and up)

`tokens.json` `typeScale1440` has 27 measured computed-style rows (font, weight, size, line height, tracking, node count). Below, every row that belongs to the site (not the cookie vendor) is matched to its class. **Size, line height and tracking in the "Measured at 1440" column are measured**; the `clamp()` and rem strings are source read, kept so the scale can be rebuilt. Rows marked "not on home" have no element on the home page at 1440, so the value is the source-read clamp resolved by arithmetic. All measured weights are 400 (each family ships one weight).

| Role | Class | Font | Source size | Measured at 1440 (size / line / tracking) | Nodes | Where |
|---|---|---|---|---|---|---|
| Hero exception h1 | `ts-h1-exception` | Grotesk, uppercase | `calc(var(--grid-vw) * 34)`, `--grid-vw = (100vw - sidebar - grid-margin) / 100`, line .7502, tracking 0 | 386.24 px / 289.757 px / normal | 1 | "WE WON". Also measured at 8 widths in section 9 |
| h1 in the global override | `ts-h1` inside `.ts-h1-overwrite` | Grotesk, uppercase | `calc(grid-vw x 15)` (CMS value 15), line .76. The bare class is `clamp(2.7rem, 10.5vw, 12.5rem)` = 151.2 px, not on home | 170.4 px / 129.504 px / normal | 2 | "LASTING FIRST IMPRESSIONS" and the footer heading "CAN WE HELP YOU?" |
| Loader line | `ts-h1-loader` | Grotesk, uppercase | 40px fixed, line .75, tracking 0 | Not in `tokens.json` (loader is gone by scroll 0). Source read: 40 px / 30 px | n/a | Loader text |
| h2 | `ts-h2` | Montreal | `clamp(3.5rem, 10vw, 7rem)`, line 1.1, tracking 0 | Not on home. Arithmetic: 140 px / 154 px | 0 | Only the "coming soon" list |
| body-xl | `ts-body-xl` | Montreal | `clamp(1.5rem, 3vw, 2.5rem)`, line 1.1, tracking .02em | 43.2 px / 47.52 px / 0.864 px | 1 | Intro tagline. The cookie headline uses the same size with a 51.84 px line |
| body-menu | `ts-body-menu` | Montreal | `clamp(1rem, 2vw, 1.25rem)`, line 1.4, tracking .02em | 25 px / 35 px / 0.5 px | 15 | Dropdown first-level links |
| body-l | `ts-body-l` | Montreal | `clamp(.85rem, 2vw, .9rem)`, line 1.4, tracking .02em | 18 px / 25.2 px / 0.36 px | 23 | Dropdown sub-level links. Main paragraphs use the same class |
| body-m | `ts-body-m` (body default) | Montreal | `.7rem`, line 1.5, tracking .02em | Not on home. Arithmetic: 14 px / 21 px / 0.28 px | 0 | Default text |
| body-s | `ts-body-s` | Montreal | `.6rem`, line 1.3, tracking .023em | 12 px / 15.6 px / 0.276 px | 55 | Logo text, menu buttons, case titles |
| body-s in mono | `ff-mono ts-body-s` | Supply | same as body-s | 12 px / 15.6 px / 0.276 px | 7 | Arrow-link labels, clock digits |
| body-xs | `ts-body-xs` | Montreal | `.5rem`, line normal, tracking .02em | Not on home. Arithmetic: 10 px | 0 | Fine print |
| Number | `ts-number` | Supply | `clamp(1rem, 2vw, 2rem)`, line `clamp(1.1rem, 2.2vw, 2.2rem)`, tracking .01em | Not on home. Arithmetic: 28.8 px / 31.68 px | 0 | Counters |
| Label m | `ts-label-m` | Supply | `.6rem`, line `.78rem`, tracking .01em | 12 px / 15.6 px / 0.12 px | 3 | "Some of our work", "Clients we helped in 2025", "Contact us" |
| Label s | `ts-label-s` | Supply | `.5rem`, line `.63rem`, tracking .01em | 10 px / 12.6 px / 0.1 px | 162 | Menu column titles, case subtitles |
| CTA | `ts-cta` | Supply | `.6rem`, line `.63rem`, tracking .01em | 12 px / 12.6 px / 0.12 px | 5 | Links and buttons (the five measured are the dialog's, styled with the same class values) |

Cookie dialog rows in `tokens.json` (vendor text styled by the site): 13.5 px, 15 px, 14 px on a 21 px line, 12.15 px, 27 px (Montreal weight 500) and small variants. Weights 500, 600 and 700 appear only there.

The whole scale is small. The everyday text is 10 to 18 px. Only headlines are large: 170.4 px and 386.24 px. The measured hero line box (289.757) matches 386.24 x .7502 exactly.

### Phone differences (below 900)

`tokens.json` `phone` has 30 measured rows at 390 (rem 20). The table lists the site's own rows; the "Measured at 390" column is measured (size / line / tracking). Source clamps are kept for rebuilding.

| Role | Source (below 900) | Measured at 390 | Nodes | Change from desktop |
|---|---|---|---|---|
| Hero exception h1 | `calc(grid-vw x 34)`, line .78, tracking -.01em | 120.02 px / 93.6156 px / -1.2002 px | 1 | Sidebar term becomes 100 percent of the parent font size (17 px), so the width term is 390 - 17 - 20 = 353. Also measured at 360, 768 and 820 in section 9 |
| h1 in the global override | `calc(grid-vw x 17)` (CMS value 17), line .76, tracking -.01em. Bare `ts-h1` is `clamp(2.7rem, 10.5vw, 12.5rem)` = 54 px, not on home | 60.01 px / 45.6076 px / -0.6001 px ("LASTING FIRST IMPRESSIONS") | 1 | 170.4 to 60.01 |
| Footer heading | Same class as above | 60.52 px / 45.9952 px / -0.6052 px | 1 | 60.52 differs from 60.01 because the footer text is 14 px, so the 100 percent term is 14 px, not 17 px (inferred) |
| h2 | `clamp(3.5rem, 10vw, 7rem)`, line 1, tracking .02em | Not on home. Arithmetic: 70 px (floor) | 0 | Line 1.1 to 1 |
| Menu h2 (overlay nav) | `clamp(2rem, 8vw, 2.75rem)`, line 100%, tracking .02em | 40 px / 40 px / 0.8 px | 3 | Only exists below 1200 |
| body-xl | `clamp(1.5rem, 3vw, 2.5rem)`, line 1.1 | 30 px / 33 px / 0.6 px | 1 | 43.2 to 30 (floor) |
| body-menu | `clamp(1rem, 2vw, 1.25rem)`, line 1.4 | 20 px / 28 px / 0.4 px | 15 | 25 to 20 (floor) |
| body-l | `clamp(.85rem, 2vw, .9rem)`, line 1.38 | 17 px / 23.46 px / 0.34 px | 27 | Line 1.4 to 1.38 |
| body-m | `.85rem`, line 1.38 | Not on home. Arithmetic: 17 px / 23.46 px | 0 | 14 px on desktop |
| body-s | `.7rem`, line 1.15, tracking .03em | 14 px / 16.1 px / 0.42 px | 52 | 12 to 14 |
| body-s in mono | same | 14 px / 16.1 px / 0.42 px (Supply) | 7 | |
| body-xs | `.7rem`, line 1.15 | Not on home. Arithmetic: 14 px | 0 | 10 to 14 |
| Number | `clamp(1rem, 2vw, 2rem)`, tracking -.02em | Not on home. Arithmetic: 20 px / 22 px | 0 | Tracking flips |
| Label m | `.7rem`, line `.91rem`, tracking 0 | 14 px / 18.2 px / normal | 3 | 12 to 14 |
| Label s | `.6rem`, line `.6rem`, tracking 0 | 12 px / 12 px / normal | 150 | 10 to 12 |
| CTA | `.6rem`, line `.826rem`, tracking .01em | 12 px / 16.52 px / 0.12 px | 6 | Line 12.6 to 16.52 |
| CTA inside widgets | `.widget-mobile-scale-container .ts-cta{font-size:.5rem}` (source read) | 10 px / 16.52 px / 0.1 px | 3 | "See all of our work", newsletter line, address |

Cookie dialog rows at 390: headline 30 px on a 36 px line, body 17 px on 18.7 px, 15 px and 13.5 px vendor text, 12.6 px labels (weight 500). Below 900 the small text grows (12 to 14, 10 to 12), which is the sensible direction; only the widget CTA drops to 10 px.

---

## 6. Components

Hover data: `pointer.json` recorded 17 hover targets and **no computed-style changes for any of them**. Every hover below is therefore source read from CSS (the sampler cannot see child-span background-size or transform-only changes on `::after`). Focus: one measured value from `a11y.json`, plus the source-read global rule.

Global focus rule (source read): `a:focus-visible, button:focus-visible { outline: 2px solid #1e90ff; outline-offset: .25rem; border-radius: .05rem }`. Measured on the cookie dialog's "Show details" button: `outline rgb(0,0,0) solid 2px`, offset 2px (that is the consent vendor's own style, not the site's).

| Component | Default | Hover | Focus | Active / open |
|---|---|---|---|---|
| **Header bar** (fixed, 52 px) | Logo mark 1.2rem plus text "Spring/Summer(tm)" at ts-body-s, three menu buttons, clock and "Copenhagen" on the right, bracket line under it. z-index 20 (30 below 1200) | n/a | Global blue ring | n/a |
| **Desktop menu item** ("What we do", "Our work", "About us") | ts-body-s button, tiny 1 px vertical tick (height .6rem - 1px) at scaleY 0 | Mouse enter opens the panel. Tick goes to scaleY .5 | Enter or Space toggles at 1024 and up. Arrow left and right move between items, Arrow down enters the panel, Escape closes | Open: tick scaleY 1, panel fades in. Mouse leave closes after 150 ms (source read) |
| **Dropdown panel** | Hidden. Fixed at top 51 px, left 54 px, width 1136 px, padding 1rem, glass (see section 4), radius .2rem. Three columns (links, sub-links, featured case teaser) | Links slide `translate(.2em)` in .25 s ease-in-out | Global blue ring | Enter: opacity 0 to 1 and `translateY(-10px)` to 0 over .4 s ease-out (theme transition) |
| **Mobile "Menu" button** (below 1200) | ts-cta, underlined text | n/a | Global blue ring | Opens a full screen overlay, opacity .4 s in and 1 s out, page scroll locked. Accordion rows open in .3 s ease-in-out with a 4x6 px triangle that rotates 180 deg in .2 s. Rows end in a 1 px dashed line at 20 percent opacity |
| **Analog clock and digits** | 11 px round face, hour, minute and second hands (second is #D00), "HH:MM" in mono, `aria-label` "Current time in Copenhagen" | none | none | Live time |
| **Arrow link** ("Write us", phone, "Working at Spring/Summer") | 1.35rem square icon chip (radius .2rem, background = text colour, glyph = page colour), mono ts-body-s label | Underline draws left to right: `background-size 0% to 100%` at .75 px height over .5 s. Icon svg scales 1.2 in .2 s | Global blue ring | Below 900 the underline is always shown |
| **Widget link** ("Our work / See all of our work", "Office address") | Glass card, gap .5rem, icon chip plus mono link | Same underline and icon scale as arrow link | Global blue ring | Follows the scroll-lag system in section 7 |
| **Newsletter widget** | Glass card. Title, mono explainer, email input (1 px border at 30 percent, radius .2rem, padding 8px 6px), submit chip. Consent checkbox 16 px | Submit icon rotates in a "wave": 0 to 14 to -8 to 14 to -4 to 10 to 0 deg at 0, 15, 30, 40, 50, 60, 70 percent over 2 s, origin bottom centre (900 and up only) | Global blue ring (input outline removed) | Checked box fills 20 percent and shows an "X". Not submitted during capture |
| **Lead form fields** (other routes) | 1 px bordered boxes | Field flips to solid text-colour fill with page-colour text once valid (`:has(input:valid)`) | Global | Errors: `shake .5s cubic-bezier(.36,.07,.19,.97)` with 1px, 2px, 4px offsets. Each row fades and slides `translate3d(0,-20px,0)` to 0 as it appears |
| **Tag pill** (case tags) | 1 px border at 20 percent, radius 3px, mono, padding .4rem .65rem (.5rem .7rem on phone) | (hover devices only) border goes to 10 percent and an `::after` layer fades to opacity 1 in .2 s | Global | Active: solid text fill, page-colour text, .2 s |
| **Carousel slide (case teaser)** | Aspect 1 : 1.25, 560 px wide at 1440, padding .6rem. Title body-s, subtitle label-s, tags. Text white (black if `darkTeaserTextColor`). Opacity .3 | Background image scale is declared to transition (background 1 s ease-out, foreground .5 s ease-out) but no scale target exists in shipped CSS or JS; treat as unclear | Global | Active and next slide opacity 1 in .5 s ease-in-out. Previous slide fades to 0 with a 1 s delay |
| **Carousel arrows** | Two arrow buttons, gap 1rem, rotated -135 deg and 45 deg | none in CSS | Global | Click calls `slidePrev` or `slideNext`. A hidden strip the width of the sidebar (250 px) on the right edge also advances the slide |
| **Logo grid tile** | SVG, aspect 8 : 5, radius .2rem, 6 columns, gap .6rem (3 columns and .4rem on phone) | none in CSS | Global | Links to the case |
| **Loading cursor** | 60 px fixed follower, 10 hidden icon chips (palm, lightning, camera, handshake, globe, glitter...) | See section 7 | n/a | Only visible while a route is loading (see section 7) |
| **Video wrapper** | Mux video, autoplay, muted, loop, no controls. Overlay UI (sound, fullscreen, scrub) at opacity 0 | Hover: UI fades in over .3 s | Global | HLS failed in the capture browser (`manifestIncompatibleCodecsError`), poster thumbnails were used |
| **Footer** | Address widget, contact block, heading, social list, byline | Social links draw a 1 px vertical tick below the word, scaleY 0 to 1 in .2 s (900 and up) | Global | n/a |
| **Cookie dialog** (Cookie Information, site-styled) | Centre modal on `blur(5px)` backdrop, 1 px text-colour border, radius .2rem, Decline outlined, Accept solid, four toggles | Policy link draws its underline (.5 s background-size) | Vendor 2 px black outline | Was open in every screenshot, which is why the home page has no clean shots |
| **404 page** | White page, emoji bodies falling under Matter.js, "PAGE NOT FOUND" and "Home page" link | Emoji react to the pointer (Matter mouse events) | Global | n/a |

---

## 7. Motion, section by section

### Smooth scroll

None. Scrolling is native (`overscroll-behavior-y: none` on body). A scroll tracker reads `window.scrollY` throttled to 30 ms (source read). All scroll-linked motion is a hand-written rAF lerp, not GSAP scrub. `motion_gsap.json`: 28 tweens, 7 timelines, 0 ScrollTriggers, no Lenis (measured).

### Loader and first-load sequence (home page)

The home page uses the "long loader" variant because the CMS supplies a first line, second lines and a third line. Values are source read from the loader chunk; the GSAP durations and targets were checked against `motion_gsap.json` (measured).

| Step | Value | Label |
|---|---|---|
| Layout starts at `opacity: 0`, set to 1 after a `0 ms` wait and a `600 ms` wait | 600 ms | source read |
| Curtain div `.overlay-wipe` created: fixed, 100vw x 100vh, z-index 19000, background = current theme background (paper), `box-shadow 0 0 50px rgba(0,0,0,.1)` | paper rgb(222.1, 220.1, 211.4) | measured |
| Loader text colour set to the theme text colour | rgb(254.0, 57.1, 57.1) | measured |
| Layout of loader | "Creating" (line 1, static), a cycling middle line with an icon chip (27 px, 33 px to the left of the word) and the word, "All seasons" with a trademark mark (line 3). Text 40 px Grotesk uppercase, line height .75 | source read |
| Words in order | Flagship Stores, Websites, Brand Identities, Apps, E-commerce, Proud moments, Real Results, Good Coffee, Lasting Impressions | source read |
| Word change | Each word swaps in with duration 0 (instant), then the next after `delayBetweenWords` = .2 s. Measured tween creation times step about 200 ms apart (2834, 3038, 3241, 3542, 3743, 3943, 4144, 4344, 4545 ms) | source read, measured |
| After the last word | Wait 300 ms, then play the main timeline | source read |
| Curtain | `to y:"100vh"`, duration 1.538 s (= 2 / 1.3), ease `CustomEase("0.5, 0, 0, 1")` | measured 1.538 s, ease source read |
| Loader block | `to y:"100vh"`, duration 1.053 s (= 2 / 1.9), ease `power2.inOut`, starts with the curtain | measured |
| Loader fade | `to opacity:0`, duration 0.6 s, `power2.inOut`, starts with the curtain | measured |
| Page and top bar | `from y:"-10vh"`, duration 2 s, ease `CustomEase("0.5, 0, 0, 1")`, then `clearProps: "all"` | measured 2 s, ease source read |
| Total after the loader mounts | 0.6 + 8 x 0.2 + 0.3 + 2 = 4.5 s | arithmetic |

Variants in the same file (not used on home): 1.6 s with `CustomEase("0.25, 0, 0, 1")` when the CMS has no loader text; 2 s with the .25 curve on the 404; 1.2 s with the .5 curve on case pages. Loader timings in the cloud run are slower than a real connection.

Frame samples (inferred, ignore where GSAP has the answer): layout `opacity` 0 to 1 at 1712 ms for 55 ms; hero video card `opacity` 0 to 1 starting 1192 ms over 424 ms, fitted cubic-bezier(.094, .55, 0, .414), rms 0.0472 (fitted, close to the .05 limit).

Reduced motion: the code has no `prefers-reduced-motion` rule. `responsive.json` `reducedMotion` still shows 28 tweens (measured), so the loader plays regardless.

### Loading cursor (not a general custom cursor)

Only exists at 900 and up with no `ontouchstart`. Values are source read.

- 60 x 60 px fixed follower, z-index 10000, pointer-events none.
- `mousemove`: `gsap.to(follower, {x, y, duration: .7, ease: "power2", opacity: 1})`. `mouseleave` on the document fades it to 0 over .7 s.
- While a route is loading (`isPageLoading`, set on navigation, cleared on `page:finish`, skipped category to category) a repeating timeline runs. For each of the 10 chips: random angle 0 to 2 pi, random radius 0 to 40 px, then `to {opacity 1, scale 1, x, y, duration .2, ease power2.inOut}` and `to {opacity 0, scale 0, duration .2, ease power2.inOut}` at `+=0.15`. Chips reset to x 0, y 0 on complete.
- Measured: follower at (1030, 330) with opacity 1, chips at scale 0 and opacity 0.

### Hero (intro tagline, "WE WON", video card)

| Item | Value | Label |
|---|---|---|
| h1 size | `calc(grid-vw x 34)` = 386.24 px at 1440; line height .7502; Grotesk uppercase | measured, source read |
| Overlay card | Column 8 (`left: 96 x 7 = 672 px`), width 5 columns (464 px), `translateY(-12%)` inline, top padding 7.5rem (150 px), rounded 0.2rem, muted looping Mux video | source read |
| Card parallax | `amount = -0.3`, `inTop = true`, no rotation | source read |
| Parallax formula (per frame) | `smooth = lerp(smooth, scrollY, .05)` where `lerp(a,b,t) = (1-t)*a + t*b`. If `inTop`: `r = -smooth / innerHeight`, else `r = (rectTop + rectH/2 - innerH/2) / (innerH/2 + rectH/2)`, clamped to -2 to 2. Then `transform = translateY(r * amount * 25 vmin)` (plus `rotate(deg)` if set). The loop runs while `round(smooth*2)/2 != round(scrollY*2)/2` | source read |
| Reveal | Element is `opacity: 0` until class `loaded` is added 200 ms after registration, then `opacity` .4 s ease-out (theme transition) | source read |
| Sampled card drift | y 24.62 to 33.73 over 962 ms at scroll 450, fitted rms 0.0029. It is the lerp, not an ease, so ignore the fitted curve | fitted, explained |

### Theme swap (the page's main scroll effect)

Source read from the theme module.

- Each row registers `{element, theme}`. The hero row is flagged `isTopElement`.
- On every scroll or resize update, pick the **last** registered row where `top <= viewportHeight/2 && bottom >= viewportHeight/2`. At `scrollY = 0` an `isTopElement` row with `top <= 0` wins.
- If no row matches (footer, gaps) use the page default theme (`themeDefault`).
- Write two CSS variables on `body`: `--theme-text-color` and `--theme-background-color` as `"H S% L%"` triplets.
- Body transition: `color, background-color` over `.4s ease-out` (`--theme-transition-duration: .4s`, `--theme-transition-ease: ease-out`). Widgets, icons and pills reuse `var(--theme-transition)`.
- Below 1200 wide (touch), also lerp the browser `theme-color` meta: each frame `t += .06`, hex colour mix from old to new, stop at `t >= 1` (about 17 frames).
- Route change: `clearThemes()` on leave, `initThemes()` on enter and again 500 ms after mount.

### Carousel "Some of our work"

Swiper params (source read): `slidesPerView: "auto"`, `autoplay: {delay: 3000, disableOnInteraction: true}`, `mousewheel: {forceToAxis: true}`, `speed: 1300`, `loop: true`, `navigation: true`. The entries list is rendered twice for the loop.

- Slide width `cols x 6 - gutter` = 560 px (5 columns on phone), margin-right 16 px, left padding 54 px.
- Opacity: idle slides .3, active and next 1, previous 0 (with a 1 s delay). All `.5s ease-in-out`.
- Measured CSS transition on `.swiper-wrapper`: 1300 ms, `ease` (measured). Frame fit of one slide move: x -3712 to -4046 in 969 ms, fitted cubic-bezier(.141, .379, .367, 1), rms 0.0012, nearest power3.out. That is the visible tail of Swiper's transition, not a GSAP tween.
- Cases in the home data (17, source read): Langelands Efterskole, Hempel Foundation, Polene, Susanne Kaufmann, Nationalmuseet, Implement, Support Greenland, NORR11, Nitex, CURIN, Perez Art Museum Miami, The Footprint Firm, ORCA Labs, Soren Rose Studio, Hans Just, Satius, American Express.

### Logo grid, text rows, video

No scroll animation. Images and media get `opacity 0 to 1` in .4 s ease-out when the `is-seen` class is added by an IntersectionObserver (`rootMargin 50px 0`, `threshold .1`; video wrappers use `800px 0` and `.25`) (source read, probe).

### Sidebar widgets (scroll lag)

Source read from the widget manager. `WIDGET_GAP = max(10, 10 + 10 x .6 x (width - 1440) / 1440)` = 10 px at 1440, 12 px at 1920. Header allowance = 5.2 x gap = 52 px.

Desktop (900 and up), per animation frame while anything is still moving:

```
deltaScroll  = lastScroll - max(0, scrollY)
factor       = idx * 0.05                    // desktop
target       = heightOfPreviousWidgets + GAP * idx
interpolated = lerp(interpolated ?? target, target + deltaScroll * factor + pull, 0.1)   // pull = min(5, -pulledY/10) * idx
element.style.position = "fixed"; element.style.transform = `translateY(${interpolated}px)`
stop when round(interpolated*2)/2 == round(target*2)/2
```

A widget is "idle" (left in normal flow, no transform) while its container is below its target line. Phone (900 and under): widgets become a bottom sheet. Idle cards sit at `viewportHeight + 100`, active cards stack at `viewportHeight - 50 - (stack gap 5 px each)`, each scaled `1 - .035 x depth`. Pulling a card up more than 100 px opens the stack, pulling down more than 100 px with the stack at the top closes it. Body scroll is locked while open. Card z-index `100 - idx`.

Sampled newsletter card y: 118.59 to 117.43 over 1297 ms (inferred, settled false).

### Footer and headline sweep

`@keyframes sweep { to { transform: translate(min(0px, calc(var(--cols) x var(--grid-cols) - var(--gutter) - 100%))) } }`. Class `.sweep { animation: sweep calc(var(--width) x 4ms) infinite alternate ease-in-out; width: fit-content }` where `--width` is the element's measured px width (JS). For "CAN WE HELP YOU?" the measured duration was 4884.125 ms, so `--width` = 1221.03. The animation pans the heading left by (its width - 1136 px) and back. The sampler reported the ease as `linear`; the shipped CSS says `ease-in-out`. I trust the CSS and flag the mismatch. It only runs when no page transition is running.

Footer image (15rem, 10rem below 1399, 7rem on phone) is positioned `bottom: -60%` on desktop; static.

### Route transitions

Global hooks (source read): on leave the old page is fixed in place at `top: -scrollY`, z-index -1, widgets and parallax cleared.

| Transition | Used for | Values |
|---|---|---|
| Default, 900 and up ("wipe") | Any route change except to a case | Curtain 100vw x 120vh at `translateY(-120vh - 1px)`, z-index 19, colour = outgoing theme. Leave: old page `transform: translateY(10vh)` plus `clip-path` collapsing to the bottom edge, curtain `translateY(10vh)`, both `.8 s` (`.5 s` below 1200) `cubic-bezier(.32, 0, .67, 0)`. Then new page starts at `translateY(-10vh)` and eases to 0 in `1 s` (`.5 s` below 1200) `cubic-bezier(.33, 1, .68, 1)` while the curtain goes to `translateY(120vh)` in the same time |
| Default, below 900 | Any route change | Opacity only: 600 ms `cubic-bezier(.33, 1, .68, 1)`, out then in |
| `toCase` | Clicking a case teaser | The teaser element is moved to `body`, made `position: fixed`, and grows to cover the screen (aspect-fit) in `.8 s` `cubic-bezier(.5, 0, 0, 1)` while its text fades in `.4 s`. New page fades in after .8 s. Title letters are split, each starts `opacity 0`, `translateY(-50%)` and animates over `1.1 s` `cubic-bezier(.5, 0, 0, 1)` with a random delay of 0 to .25 s. The media container moves from its old top to its new one over 1.1 s, the foreground video 1.1/25 s later. Uses per-letter kerning pairs to keep the headline tight. Background and foreground video times are copied across |
| `fromError` | Leaving the 404 | GSAP curtain, duration .75 s (.5 s below 1200), `power3.inOut`, white curtain that tints to the page theme |
| CSS classes left in the stylesheet | `page-fade` .45 s ease-in-out, `page-slide` .8 s `cubic-bezier(.33,1,.68,1)` in and `cubic-bezier(.32,0,.67,0)` out, `fade` .5 s `cubic-bezier(.55,0,.1,1)` | Declared, not confirmed as used |

### Headline letters (other routes, not home)

`AnimatedHeadlineSimple` splits text into inline-block spans, applies a kerning table, and animates each with `slide-enter` (`opacity 0, translateY(-50%)` to `1, 0`) or `slide-leave` (to `opacity 0, translateY(50%)`) over `--transition-duration`, with easing `cubic-bezier(.83, 0, .17, 1)` on width changes. Exact durations are set in JS and were not read.

---

## 8. 3D

No 3D on the home page. `three.json` and `scene-3d.json`: 0 renderers, 0 canvases, 0 compiled programs, 0 raw shader sources, empty scroll and mouse samples. The bundle does contain three.js r149 and the Spline runtime 1.9.89 (with its WebAssembly modules), and a lazy `ModulesInfiniteGallery` that draws an image gallery on a canvas (`touch-action: none`). Those modules exist for other pages and were not exercised. The lazy chunks `BaZGfXvX.js` and `Bo7JC-W3.js` were not downloaded, so any shader inside them is unread. The 404 page uses Matter.js physics in 2D DOM, not WebGL.

---

## 9. Responsive

**Breakpoints in the code (source read).** `responsive.json` reports `breakpointsFound: []` because its metrics (h1 size, pin spacers, cursor) did not change in a way it looks for, but the shipped code has real ones:

| Width | What changes | Where |
|---|---|---|
| 600 | Named `sm`, only in the JS breakpoint table | JS |
| 900 | 6 columns to 12 columns; grid margin 1rem to 2.7rem; sidebar 100 percent to 12.5rem; `.desktop` and `.mobile` swap; type scale changes (section 5); hover underlines become always-on below; widgets become a bottom sheet; route transition falls back to the opacity fade; loading cursor disabled; logo grid 3 to 6 columns; carousel slide 5 to 6 columns wide and idle slides drop to .3 opacity | CSS and JS |
| 1024 | Dropdown keyboard toggle switches from accordion to panel | JS |
| 1200 | Header switches from a "Menu" button with a full screen overlay to inline nav plus dropdown panels; header z-index 30 to 20; route transition timings .5 s to .8 s and 1 s; theme-color meta lerp only below | CSS and JS |
| 1399 | Footer image 15rem to 10rem | CSS |
| 1440 | `page-max`, widget gap starts growing above it | JS |

**Fresh loads (measured, responsive.json)**

| Width | Page height | h1 px | Touch | Tweens | Nav links seen | Overflow-x |
|---|---|---|---|---|---|---|
| 360 | 14487 | 109.82 | yes | 27 | 3 | no |
| 390 | 3862 | 120.02 | yes | 27 | 3 | no |
| 768 | 4773 | 248.54 | yes | 27 | 3 | no |
| 820 | 4929 | 266.22 | yes | 27 | 3 | no |
| 1024 | 2744 | 244.8 | no | 1 | 3 | no |
| 1280 | 3831 | 331.84 | no | 28 | 1 | no |
| 1440 | 4187 (early state; the map later measured 4997) | 386.24 | no | 28 | 1 | no |
| 1920 | 5480 | 528.768 | no | 28 | 1 | no |

The h1 sizes all equal the formula (checked by arithmetic): at 1920 rem is 24, sidebar 300, margin 64.8, `(1920 - 300 - 64.8)/100 x 34` = 528.768. `visibleNavLinks` drops from 3 to 1 between 1024 and 1280, which matches the 1200 breakpoint. The 360 page height (14487) and the 1024 fresh load (height 2744, only 1 tween, so the loader likely did not play) look like capture problems, not design. `canvases`, `pinSpacers` and `customCursor` are 0 or false everywhere.

**Live resize (measured).** Going 1440 to 1024 to 800 to 760 to 390 and back to 1440, the h1 tracked the formula (386.24, 244.8, 259.42, 245.82, 120.02) and returned to 386.24 with height 4187 (the early-state height; the map later measured 4997). No pin spacers, no overflow, tweens stayed at 28. Page height changed with width (3411 at 1024, 4751 at 800, 4686 at 760, 3862 at 390, all early-state heights; the phone map later measured 16039), so layout reflows live without a reload.

**Reduced motion.** Not honoured. No CSS or JS rule. `reducedMotion` run: height 4187 (early state), 28 tweens, same h1, all animation present (measured).

---

## 10. Accessibility, meta and extras

**From `a11y.json` (measured)**

| Check | Result |
|---|---|
| Dark mode | None. No `prefers-color-scheme` rules; body background under dark preference stays rgb(255,255,255) |
| Images | 5 checked, 0 without alt, 0 empty alt. Alt text is auto-made from file names (for example "3 Z3 A5679", "IM Cover Final 1", "Icon 3 palmtree"), so it is present but not useful |
| Skip link | None |
| Language | `en` (Danish site copy is English) |
| Landmarks | header 1, nav 1, main 1, footer 1. Also `aside` for the clock and `complementary` regions |
| `aria-hidden` elements | 24 |
| Heading order | Cookie dialog headings (H2 "A few cookies" and five H3s and the cookie policy) come first in the DOM, then H2 "CREATING", the loader words as H2s, then the page. The home page H1 is "WE WON". Three H3 "Have you seen" and six other menu H3 titles are hidden menu content |
| Focus | Visible 2px blue ring on site elements (source read); black ring on the vendor dialog (measured) |
| Contrast | No automated pairs recorded. My arithmetic: red on paper 2.61 (fails), ink on paper 14.68 (passes) |
| Keyboard | Menu: Enter, Space, Escape, four arrow keys, roving `tabindex="0"` on every item (source read) |
| Text size | Body 14 px desktop, labels 10 to 12 px |

**Meta (source read)**

- Title: "Spring/Summer | Copenhagen based digital first Design & Brand Agency"
- Description: "Strategic digital experiences & brand identities from Copenhagen, Scandinavian design meets innovative technology."
- Open Graph: locale en_US, type website, image 1200x630 crop of `Meta.jpg` (declared width 1120, height 630), alt text has a typo ("Snapshots of key kages of the site"). Twitter `summary`, 800 x 800 image (declared 800 x 450).
- `theme-color #ffffff` (static in HTML, then written by JS below 1200), `robots: all`, canonical, JSON-LD blocks (WebSite, Organization identity, creator, BreadcrumbList), `humans.txt` link, favicon `favicon.svg` (39 kB SVG).
- Routes captured (states.json, all status 200): `/page/ecommerce` (h 7199), `/page/websites` (6810), `/page/brand` (6377), `/page/apps` (6626), `/category/shopify` (7463), `/category/sanity-cms` (7741), `/category/craft-cms` (8195), `/category/webflow` (2775), `/category/wordpress` (4417), `/category/native-app` (2815). Missing route gives a real 404 page (h 907) with its own physics animation.
- The menu-open states failed (`Locator.click` timeout on all 6 targets), so the open dropdown was never screenshotted.

**Extras**

- Consent banner (Cookie Information) restyled to the site theme and shows on every first visit, blocking the first view.
- Video: 8 Mux playback ids; the capture browser could not play them (`manifestIncompatibleCodecsError` on each), so only posters were seen.
- Lazy images: `img[loading=lazy]` starts at opacity 0 and gets `.loaded` for a .3 s fade.
- Errors in console: `requestStorageAccess: Permission denied` (consent vendor).

---

## 11. Page weight and cost (`weight.json`)

Transfer sizes are uncompressed. FPS is cloud software rendering.

| Type | Files | KB |
|---|---|---|
| Script | 30 | 3804 |
| Image | 25 | 2586 |
| Document | 3 | 628 |
| Other | 2 | 346 |
| Font | 4 | 148 |
| Stylesheet | 12 | 56 |
| Fetch | 38 | 47 |
| XHR | 8 | 6 |

Largest single files: `DV7xZ0xt.js` 1953 kB (three.js plus Spline runtime, loaded although the home page draws no 3D), the HTML 565 kB, `CvX7_p1a.js` 555 kB (Mux and hls.js), reCAPTCHA 346 kB, one Unsplash hero-sized photo 314 kB, Mux thumbnails 152 to 277 kB each, `Awward.png` 173 kB.

Timing (cloud, so slower than real): first paint 1240 ms, DOMContentLoaded 1736 ms, load 3579 ms, first contentful paint 3352 ms (the loader hides content on purpose). FPS at top of page: 6 (software rendering, not a real number).

Cost read: about 7.6 MB uncompressed to see the home page, of which roughly half is JavaScript and more than 1.9 MB of that is unused 3D code.

---

## 12. What is worth porting, in order

1. **Row theme swap** (section 7). Highest payoff for lowest cost. Keep the midpoint rule, two CSS variables and the .4 s ease-out.
2. **Fluid oversized headline tied to a sidebar-aware unit** (`--grid-vw`). One line of CSS, huge presence.
3. **Curtain page transition** (default wipe values) and a shorter version of the loader curtain (2 s drop, `cubic-bezier(.5,0,0,1)`).
4. **Carousel with faded neighbours** (.3 opacity idle, 1 active, autoplay 3000, speed 1300, stop on touch).
5. **Underline-draw links and bracket borders** (background-size .5 s, half-masked 1 px frame). Tiny cost, strong identity.
6. **Lerped parallax card** (`lerp .05`, `amount x 25 vmin`).
7. **Glass widget column** (blur 10 px, 20 percent border). Port the look first, the scroll-lag maths only if it earns its keep.
8. **Focus ring** (2px #1e90ff with .25rem offset) as a default.

Do not port: the 3D bundle, the loading cursor, the widget bottom sheet, the 10 to 12 px type, red-on-paper small text, the missing reduced-motion handling.

### Why this reference matters for a leather-bag store

- **Theme swap per row, keeping ink for reading, and a dark close** (sections 3, 4 and 7). A bag brand can change the page from warm paper to tan to deep oxblood as the shopper moves through collections, using the same two-variable trick. Copy the ink-on-paper pair that passes contrast, and keep the loud accent for headlines only, because this site's red-on-paper pair fails contrast (2.61). The measured pixels show the page ending on near black (#1A1A1A) with cream text at about 14.9 contrast, a calm, high-contrast footer that suits a leather brand's contact and care information.
- **One very large headline, sized from the layout rather than the device** (sections 5 and 7). The `grid-vw` unit lets a product name or collection word fill the hero on every screen (386.24 px at 1440 and 120.02 px at 390, both measured). It suits leather, where a single confident word and one photo sell the mood.
- **A short, one-time curtain moment, then quiet** (section 7). A brief branded wipe on first load feels premium. Keep it shorter than this site's 4.5 s and add a reduced-motion switch, which this site lacks.
- **A carousel that dims its neighbours and stops autoplay when touched** (sections 6 and 7). Good for showing product photos one at a time on a shop page while keeping the next one visible as a hint.
- **Small mono labels, hairline frames and underline-on-hover links, with real focus rings** (sections 4, 6 and 10). They give an editorial, crafted feel that fits a leather goods brand. Keep the visible blue focus ring, and raise the 10 to 12 px label sizes to a readable size for an accessible-premium store.
