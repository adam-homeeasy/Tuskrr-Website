# Site X-Ray teardown: BASIC/DEPT (basicagency.com)

## 1 Header

| Item | Value |
|---|---|
| Site | https://www.basicagency.com/ (home page; other routes only checked for status, title and height) |
| Capture date | 2026-09-29 |
| Main capture | Cloud Chromium, 1440 x 900, page height 9993 px |
| Phone capture | 390 x 844, page height 9335 px |
| Fresh loads | 360, 390, 768, 820, 1024, 1280, 1440, 1920 wide (responsive.json) |
| Live resize | 1440, 1024, 800, 760, 390, then back up (responsive.json) |
| Pack folder | `site-xray/packs/basic-agency - Repo Files` |

Evidence labels used on every value:

| Label | Meaning |
|---|---|
| measured | Read from the running page: computed styles, element rectangles, hover diffs, pixel samples, file headers, network weight |
| source read | Copied from the shipped CSS or JS in `04-code` |
| fitted | Worked out from frame samples in `motion.json`; the rms error is given, and anything over 0.05 is treated as inferred |
| inferred | Worked out by arithmetic or from screenshots; the reason is stated |

Key fact for anyone rebuilding: this site does not use GSAP, ScrollTrigger, Lenis or Three.js. `motion_gsap.json` shows 0 tweens, 0 timelines, 0 triggers, no Lenis; `probe.json` shows every animation global as undefined; `three.json` says "no canvas on page". All motion is CSS keyframes and transitions plus one custom `requestAnimationFrame` loop written in React. So there are no GSAP eases to quote. Every ease below is a CSS token or a formula from the source.

## 2 Summary

### What the site is

The home page of BASIC/DEPT, a branding and eCommerce design agency. Light warm-grey page (#f4f4f4) with near-black ink (#252422), one pink accent (#f9cdcd), heavy uppercase grotesque headlines, big photography, and one dark "spotlight" band in the middle. The page is a stack of eight blocks: a reel hero, an awards strip, a one-paragraph statement, three case studies, a draggable client row, an agency-spotlight quote, ten news rows, and a dark footer.

### Built with

| Layer | What | Version | Evidence |
|---|---|---|---|
| Framework | Next.js, pages router, static generation (`gsp: true`) | 16.2.4 | source read (`main-d6ff...js`, `__NEXT_DATA__`) |
| UI library | React and React DOM | 19.2.5 | source read (`framework-2f1a...js`) |
| Styling | CSS Modules (hashed class names) plus styled-jsx (`jsx-2547979358`) plus a token file of CSS variables (`--bd-*`) | styled-jsx version not stated | source read |
| CMS and images | Sanity (project `8nn8fua5`, dataset `production`), images from `cdn.sanity.io` as `?w=1024&fm=webp&q=65`, video files from the same CDN | API version `v2023-03-01`; package versions not stated | source read |
| Smooth scroll | Custom transform-based scroller, no library | n/a | source read (`_app` module 7679) |
| Animation | CSS keyframes and transitions, custom rAF loop | n/a | measured (no gsap, no Lenis) |
| 3D, canvas, WebGL | None | n/a | measured (0 canvases) |
| Route APIs | `/api/subscribe` (newsletter), `/api/soundcloud` (audio player) | n/a | source read |
| Third parties | Google Tag Manager `GTM-5K5ZTR6`, gtag `AW-10775445431` and `G-V2WMRJYJMH`, Universal Analytics `analytics.js`, Hotjar `137118`, LinkedIn Insight `3599532`, accessiBe accessibility overlay | n/a | measured (`probe.json` scripts) |

Hotjar and LinkedIn were blocked by the site's own Content Security Policy in the capture (console errors in `probe.json`).

### Fonts and licence

| Font | Weights on the site | Files | Licence status |
|---|---|---|---|
| Scto Grotesk A (`SctoGroteskA`) | 300 (Regular file), 400 (Medium file), 700 (Bold file) | Self-hosted at `/_next/static/media/SctoGroteskA-{Regular,Medium,Bold}.*.woff2` (30, 30 and 26 KB), plus woff and ttf fallbacks; `font-display: swap` | Treat as paid. It is a commercial grotesque that is not on Google Fonts or Fontshare (inferred; the foundry and licence terms are not in the pack). Fonts were deliberately not downloaded (run.log: "3 fonts left out"). |
| Wordmark "BASIC/DEPT" and "B/D" | n/a | Inline SVG paths, not a font | Brand artwork, do not reuse |

Weight mapping to remember: CSS weight 300 loads the Regular file, 400 loads the Medium file, 700 loads the Bold file (source read, `@font-face` rules).

### Page height

| Viewport | Height | Evidence |
|---|---|---|
| 1440 x 900 | 9993 px | measured |
| 390 x 844 | 9335 px | measured |
| 1920 | 11878 px | measured (fresh load) |

Two caveats that change the real height (details in section 3 and in `not-verified.md`): the 60 px cookie bar adds 60 px of footer padding, and none of the four mp4 files painted in the cloud browser, so the spotlight section is measured shorter than it will be for a real visitor.

### Top 5 signature effects, ranked by how much they add

| Rank | Effect | What it does | Rebuild cost |
|---|---|---|---|
| 1 | Transform-based eased smooth scroll | Native scroll drives a fixed container; each section is moved by an eased number (easeOutQuint over 60 frames), hidden when off screen. Header, sticky text, video loading and the colour flip all read the same eased number. | Medium to high. About one small module (no library) but it needs careful testing, has accessibility trade-offs, and is frame-based. |
| 2 | Scroll-driven page colour flip | The whole page (background and text colour) turns from bright to dark ink-and-pink and back as sections cross the middle of the screen, over 650 ms. | Low. Three colour pairs, one check per frame or one IntersectionObserver, one CSS transition. |
| 3 | Cursor bubbles with a drag carousel | A pink "DRAG" disc and a white "WATCH REEL" disc replace the cursor and trail it with a lerp; the client row scrolls by dragging with a lerped follow. | Low to medium. |
| 4 | Hero curtain reveal, logo wipe and staggered header | On load the reel rises from below inside a counter-moving mask (1 s), a wordmark wipes away, and the logo, links and menu dots fade up in a 30 ms stagger. | Low. Pure CSS with tokens. |
| 5 | Animated film grain | A fixed noise PNG jitters in steps across the whole page and inside the header, giving every flat colour a print texture. | Low. One PNG and one keyframe rule. The PNG itself is not in the pack. |

Details and code sketches are in `recipes.md`.

## 3 Page map

Positions are for 1440 x 900. The `top` values inside `scroll-map.json` were recorded at a moment when sections were mid-transform (all read 900), so they are not used. Section starts below are computed from measured rectangles plus the eased translate in `motion_sampled.json` (rect top + translate = page offset), and cross-checked against the "capped" translate values in `motion.json`. Example: overview rect top 865 at translate 634 gives 1499.

| # | Section (class) | Pixel range | Height | Background | Pinned? | What it is | Evidence |
|---|---|---|---|---|---|---|---|
| F1 | Header (`header_container`) | fixed, y 0 to 126 | 126 | Transparent over the hero, then page colour with grain | Fixed, but slides up on scroll down and back on scroll up | Logo, six links, dots menu button | measured |
| F2 | Menu overlay (`menu_menu`) | fixed, full screen | 840 (900 minus the 60 px cookie bar) | #252422 | Fixed, hidden until opened | Full-screen menu with a draggable "Internal Works" row | measured |
| F3 | Cookie bar (`pop-up_container`) | fixed, bottom 60 px | 60 | #191918 | Fixed | Consent bar | measured |
| F4 | Grain (`noise_noise`) and logo takeover | fixed, full screen | 900 | Transparent | Fixed | Grain layer, load-time wordmark | source read |
| 1 | Hero (`home-intro`) | 0 to 1499 | 1499 | Page #f4f4f4 (reel video on top; not painted in capture) | No | Reel poster loop filling 100vh (0 to 900), then awards strip (900 to 1499): three award logos with captions | measured |
| 2 | Overview (`home-overview`) | 1499 to 1998 | 499 | #f4f4f4 | No | 1 px rule, statement paragraph, "See the work" pill, giant B/D logo | measured |
| 3 | Case studies (`home-case-studies`) | 1998 to 2639 | 641 | #f4f4f4 | No | Three cards (Patagonia, Wilson, Google Store), 4 columns wide each | measured |
| gap | Section margin | 2639 to 2818 | 179 | n/a | n/a | `--page-section` 12.5vw = 180 px | source read |
| 4 | Clients (`home-clients`) | 2818 to 3675 | 857 | #f4f4f4 (scheme "Bright") | No | "00 /05" meta bar, "Featured engagements", 5-item drag row, progress line | measured |
| gap | Section margin | 3675 to 3855 | 180 | n/a | n/a | 12.5vw | source read |
| 5 | Spotlight (`home-spotlight`) | 3855 to 4423 | 568 in capture | Page flips to #252422 (scheme "Dark") | Text column is JS-sticky, not CSS sticky | Giant pink quote, "Adweek Agency Spotlight", "About us" pill, video column | measured |
| gap | Section margin | 4423 to 4604 | 181 | n/a | n/a | 12.5vw | measured |
| 6 | News (`home-news`) | 4604 to 8969 | 4365 | #f4f4f4 (scheme "Bright") | No | Header row plus ten thumbnail and headline rows | measured |
| gap | Footer margin | 8969 to 9193 | 224 | n/a | n/a | 15.625vw = 225 px | source read |
| 7 | Footer (`footer_footer`) | 9193 to 9993 | 800 | #252422, copyright band #191918 | No | Wordmark, sign-off line with email, newsletter, social, initiatives, offices, legal band | measured |

Reading the table: no section is pinned (`pinSpacers: 0` at every width). The only "sticky" thing is the spotlight quote, moved by the smooth-scroll module.

Two measured distortions, both inferred to change the numbers for a real visitor:

1. The footer includes `padding-bottom: 60px` from the cookie bar (`--bottom-panel-height: 6rem`, measured in `scroll-map.json` as padding "0px 0px 60px"). After a visitor accepts cookies the page is 60 px shorter (9933).
2. The spotlight video file is 866 x 1214 (measured from the mp4 header). The site sizes its placeholder from the loaded video's dimensions, and the cloud browser could not decode the H.264 file, so the placeholder had zero height and the section shrank to the text column (568). With the video, the column is 630 px wide (from the grid formula) so the video is about 883 px tall (630 x 1214 / 866). That would make the section about 315 px taller and the page about 10308 px. Inferred, not observed.

Phone (390) section heights, measured: hero 1098, overview 411, case studies 474, clients 600, spotlight 297, news 5078, footer 1152. Phone start offsets were not derived.

### Colour rhythm from the pixel data (`map_desktop-1440.json`)

The pixel rhythm samples five rows (10, 25, 50, 75 and 97 percent of the viewport) at 32 scroll stops, 300 px apart. The 97 percent row reads #191918 at every stop because that row is the cookie bar (#191918), not the page.

| Scroll stops | Reading | Meaning |
|---|---|---|
| 0 to 900 | #f0f0f0, #ededed, #e8e8e8, centre #ffffff at 0 and 300 | Hero area. Base #f4f4f4 with grain. The white centre is the "Watch reel" disc. In the real site the reel video fills this area; here it did not paint. |
| 1200 to 3000 | #f4f4f4 down to #e7e7e7 (grain range), photo pixels #cbd5d0, #d3dcd7, #eef5ea, #c5d1cd, #d6e5e6, #a36346, #a06247 | Light page; the muted greens and rust are the Patagonia and Wilson photographs |
| 3300 | Edges still light; one centre sample #3b3a38 | Start of the flip zone or a text glyph; unclear from one sample |
| 3600 and 3900 | #252422, #262523, #292826, #2b2a28 across all four rows | Full dark band: #252422 plus grain that lifts pixels by up to 6 levels |
| 4200 and later | #f3f3f3, #f1f1f1, #f0f0f0, #e6e6e6 | Light again. Grain darkens light pixels by up to 14 levels (#f4f4f4 to #e6e6e6). |
| 5100 | Centre #252422 | A dark thumbnail in the news list, not the page |
| 8700 | 75 percent row #252422 | Footer entering (viewport y 675 + 8700 = 9375, footer starts 9193) |
| 9000 and 9093 | #252422 on rows 25 to 75 | Footer |

Rhythm in plain terms: bright (0 to about 3400) then dark (about 3400 to 4150) then bright (about 4150 to 9100) then dark footer. The dark window is worked out from the code, not sampled at the flip: the page turns dark when the middle of the viewport (eased scroll + 450) is inside the spotlight (3855 to 4423), so from scrollY 3405; it stays dark until the middle of the viewport reaches the news section (4604), so back to bright at scrollY 4154 (source read plus measured offsets). With the real video the spotlight is taller, so this window would end later (inferred, see above).

## 4 Colours

Every colour is a CSS variable in `d73929f14593582f.css` and again in `_app` module 8893 (source read). Counts are how many home-page elements used the value (measured, `tokens.json`).

| Name | Hex | Token | Used for | Elements |
|---|---|---|---|---|
| Tuatara, "ink" | #252422 | `--bd-color-base-tuatara`, `--bd-color-text-base`, `--bd-color-background-dark` | Default text, dark scheme background, menu overlay, footer, button borders | 80 text, 5 bg, 4 border |
| Wild Sand, "paper" | #f4f4f4 | `--bd-color-background-light` | Page background, header background, overlay panel, dark-scheme body text | 3 bg, 22 text |
| Azalea, "pink" | #f9cdcd | `--bd-color-brand-primary-pink` | Accent: drag disc, hero "watch reel" disc (non-bright variant), text on dark, progress fill, contact pop-up | 35 text, 3 bg |
| White | #ffffff | `--bd-color-base-white` | Header text over the hero, cookie bar text, white "Watch reel" disc, menu close ring | 15 text, 1 bg |
| Cod Gray | #191918 | `--bd-color-base-cod-gray`, cookie and copyright band | Cookie bar, footer copyright band | 2 bg |
| Scorpion, "grey" | #5e5e5e | `--bd-color-base-scorpion`, `--bd-color-text-footer-copyright` | Copyright text, menu copyright | 7 text |
| Gallery | #eaeaea | `--bd-color-base-gallery` | Sound player close button; light-footer copyright band | 1 bg |
| Black | #000000 | `--bd-color-brand-secondary-black` | Spotify embed background | 0 on home |
| Red 400 | #d64121 | `--bd-color-brand-secondary-red` | Defined, no home-page use found (likely form errors; inferred) | 0 |
| Green 400 | #088843 | `--bd-color-brand-secondary-green` | Defined, no home-page use found (likely form success; inferred) | 0 |
| Dodger blue | #3a97f9 | `--bd-color-base-dodger-blue` | Defined, no home-page use found | 0 |

Colour schemes (source read, `_app` module 392). These three pairs are what the scroll flip switches between:

| Scheme | Background | Text | Used on home |
|---|---|---|---|
| Bright (default) | #f4f4f4 | #252422 | Page start, clients, news |
| Dark | #252422 | #f9cdcd | Spotlight |
| Pink | #f9cdcd | #252422 | Defined, not used on home |

Translucent variants (source read): ink 80 percent `rgba(37,36,34,0.8)` and 25 percent `rgba(37,36,34,0.25)`; white 80 and 25 percent; pink 80 and 25 percent. The 25 percent versions are disabled-button colours; 25 percent opacity is also used for the carousel progress track.

Button colour sets (source read): primary base white on ink text, hover ink fill and white text; secondary base ink with white text, hover white fill; tertiary base pink with ink text, hover ink fill with pink text; active states use the 80 percent versions.

Contrast pairs (measured, `a11y.json`), the ones that matter:

| Text on background | Ratio | Result at normal size |
|---|---|---|
| #252422 on #f4f4f4 | 14.1 | Pass |
| #f9cdcd on #252422 | 10.81 | Pass |
| #f9cdcd on #191918 | 12.27 | Pass |
| #ffffff on #252422 | 15.51 | Pass |
| #5e5e5e on #f4f4f4 | 5.9 | Pass |
| #5e5e5e on #f9cdcd | 4.52 | Pass, only just |
| #5e5e5e on #252422 | 2.39 | Fail (menu copyright line) |
| #5e5e5e on #191918 | 2.71 | Fail (footer copyright band) |
| #f9cdcd on #f4f4f4 | 1.3 | Fail, and never used that way |
| #ffffff on #f4f4f4 | 1.1 | Fail: this is the header over the hero when no video is behind it |

Glow, gradient and shadow recipes: none. `box-shadow`, `filter`, `backdrop-filter`, `clip-path` and gradients do not appear in the site CSS (measured empty in `tokens.json`; source read grep). The only blend mode is `mix-blend-mode: difference` on the video time readout. The "depth" comes from flat colour and the grain layer:

| Recipe | Value | Evidence |
|---|---|---|
| Grain layer | Fixed full-screen pseudo-element, 200 rem wider and taller than the viewport (`top/left: -10rem`, `width/height: calc(100% + 20rem)`), background `noise.e8298e81.png`, centred, `will-change: transform` | source read |
| Grain motion | `animation: noise 1s steps(2) infinite`; 11 keyframes moving by up to 9 rem: `0% (0,9rem)`, `10% (-1,-4)`, `20% (-8,2)`, `30% (9,-9)`, `40% (-2,7)`, `50% (-9,-4)`, `60% (2,6)`, `70% (7,-8)`, `80% (-9,1)`, `90% (6,-5)`, `100% (-7,0)` rem | source read |
| Grain steps | `steps(2)` applies inside each keyframe gap, so the texture repositions about 20 times a second | inferred from CSS timing rules |
| Second grain copy | Inside the header background, so the header keeps grain when solid | source read |
| Dark mode of the page | Body `background-color` and `color` transition 650 ms `cubic-bezier(0.72,0,0.28,1)` | source read |
| Selection colour | Background = current text colour, text = current background colour | source read |

## 5 Type

One family, three weights, one token scale. There is no `clamp()` anywhere in the CSS (0 matches in all four stylesheets). Sizes are `rem` tokens stepped at breakpoints, with one `vw` value for the largest heading. `html` font size is 62.5 percent (1 rem = 10 px) up to 1919 px; from 1920 px it becomes `0.5vw` (`--rem-base`), so the whole rem-based design scales with the window above that width.

Letter spacing is set in em on the tokens. The measured pixel value on links (-0.18 px) is the body's computed spacing (-0.01em of 18 px) inherited as a fixed length, not a separate token.

### Desktop scale at 1440 (measured), with the source expression

| Role | Font and weight | Size at 1440 | Source expression (breakpoints) | Line height | Tracking | Case | Where |
|---|---|---|---|---|---|---|---|
| H1 giant | Scto Grotesk A 700 | 90 px | `6.25vw` from 1024; `4.6rem` 480 to 1023; `4rem` below 480 | 0.9 (81 px) | -0.05em (-4.5 px) | Upper | Spotlight quote |
| H2 | 700 | 42 px | `4.2rem` from 1280; `2.4rem` below | 1.1 (46.2 px) | -0.05em (-2.1 px) | Upper | "Featured engagements", "Featured news" |
| News headline (h5 styled as H2) | 400 | 42 px | H2 size and spacing, weight from `--font-weight-medium` | 1.1 (46.2 px) | -0.05em (-2.1 px) | Upper | News rows |
| H3 statement | 400 | 38 px | `3.8rem` from 1280; `2.2rem` below | 1.1 (41.8 px) | -0.035em (-1.33 px) | Sentence | Overview paragraph |
| H4 | 700 | 28 px | `2.8rem` from 1280; `2rem` below | 1.2 | -0.02em | Mixed | Not on home |
| H5 | 700 | 22 px | `2.2rem` from 1280; `1.8rem` below | 1.1 (24.2 px) | -0.02em (-0.44 px) | Upper | Case study titles, client names |
| H5 in menu cards | 700 | 22 px | Same size | 1.1 | -0.035em (-0.77 px) | Upper | "B/D JAMS" etc. |
| H6 (footer headings) | 400 | 18 px | Footer override `1.8rem` from 1280, `1.4rem` below (token is `2.2rem`) | 1.1 (19.8 px) | -0.02em (-0.36 px) | Upper | "Stay in the know", "Social" |
| Body | 400 | 18 px | `1.8rem` from 1280; `1.4rem` below | 1.4 (25.2 px) | -0.01em (-0.18 px) | Sentence | Client paragraphs |
| Body large | 400 | 22 px | `2.2rem` from 1280; `1.8rem` below | 1.45 | -0.04em | Sentence | Token only |
| Small / meta | 400 | 14 px | `1.4rem` from 1280; `1.1rem` below | 1.14 (15.96 px) | -0.02em (-0.28 px) | Upper | Menu text, bold `<b>` labels, "Press 4.16.25" |
| Header nav link | 400 | 14 px | Small size, `line-height: 1` | 1 (14 px) | -0.18 px inherited | Upper | Work, About, News... |
| Menu overlay nav | 700 | 24 px | `2.4rem` from 720; `1.8rem` below | 1 | -0.18 px | Upper | Menu list on small screens |
| Footer statement | 400 | 32 px | `3.2rem` from 1280; `2.2rem` below | 1 | -0.18 px | Sentence | "We collaborate with..." |
| Footer links | 300 | 18 px | Body size, weight `--font-weight-regular` | 1 | -0.18 px | Sentence | Social, offices |
| Pill button label | 700 | 12 px | `1.2rem` | 28 px (`2.8rem`) | -0.02em (-0.24 px) | Upper | "See the work" |
| Cursor label | 700 | 14 px | `1.4rem` from 1024; `1rem` below | 1.2 (video), 1.4 (drag) | -0.18 px | Upper | "Watch reel", "Drag" |
| Award caption | 400 | 13 px | `1.3rem` from 1024; `1rem` below | 1.4 (18.2 px) | -0.18 px | Upper | Under award logos |
| Case study blurb | 400 | 14 px | Small size, `line-height: 1.25` | 1.25 (17.5 px) | -0.18 px | Upper | Under card titles |
| Spotlight label | 300 | 18 px | Body size, weight 300, "Agency spotlight" is 700 | 1.4 (25.2 px) | -0.18 px | Upper | Under the quote |
| Cookie text | 400 | 12 px | `1.2rem` from 1280; `1rem` below | 1.14 | -0.02em | Upper | Cookie bar |
| Copyright band | 400 | 11 px | `1.1rem` | 20 px | -0.18 px | Upper | Footer bottom |
| Video time readout | 400 | 18 px | Body size | 20 px | -0.18 px | Digits | Reel seeker |

### Phone differences (390 wide, `map_phone-390.json`, measured)

| Role | 390 phone | Change from desktop |
|---|---|---|
| H1 giant | 40 px / 36 px / -2 px, 700, upper | 90 px down to 40 px; below 480 the token is `4rem`, from 480 it is `4.6rem` |
| H2 | 24 px / 26.4 px / -1.2 px | 42 px down to 24 px |
| H3 statement | 22 px / 24.2 px / -0.77 px | 38 px down to 22 px |
| H5 | 18 px / 19.8 px / -0.36 px (menu cards -0.63 px) | 22 px down to 18 px |
| H6 (footer) | 14 px / 15.4 px / -0.28 px | 18 px down to 14 px |
| Body | 14 px / 19.6 px / -0.14 px | 18 px down to 14 px |
| Small / meta | 11 px / 12.54 px / -0.22 px | 14 px down to 11 px |
| Menu nav | 18 px / 18 px | 24 px on 720 and up |
| Header nav | Hidden (shown from 1280); a "MENU" text button (16 px, upper) shows instead of the dots | Nav 14 px |
| Footer statement | 22 px / 22 px | 32 px down to 22 px |
| Cursor label | 10 px / 14 px; award captions 10 px / 14 px; cookie text 10 px / 11.4 px | Small steps |
| Pill label | 12 px / 28 px (unchanged) | None |
| Line-height ratios and weights | Same | None |

Grid and spacing that go with the type (source read): below 1280 there are 6 columns, side padding `5.4vw` (21.06 px at 390) and gutter `1.6rem`; from 1280 there are 12 columns, padding `8rem` and gutter `2rem`. Column width formula: `(grid-width + gutter - 2 x padding) / columns x n - gutter`. At 1440 one column is 108.33 px, so a 4-column card is 413.3 px (matches the measured screenshot, x 80 to 493).

## 6 Components

Focus rule for the whole site (source read): `button:focus, input:focus { outline: none }`, and link `:focus-visible` rules copy the hover look (fill, underline, trace) with `outline: 0`. There is no separate focus ring anywhere. `keyboard_focus.png` confirms no visible ring on the one element the harness reached (the accessiBe widget).

| Component | Default | Hover | Focus-visible | Active / pressed | Open / other states | Evidence |
|---|---|---|---|---|---|---|
| Header (`header_container`) | Fixed, 126 px tall, padding 50 px top and bottom, content z 800. Over the hero (eased scroll below the window height): `data-transparent=true`, text white, background opacity 0. After that: background = page colour with grain, text = page text colour, both fade 650 ms `cubic-bezier(0.72,0,0.28,1)` | n/a | n/a | n/a | Slides up on scroll down, returns on scroll up (section 7). Route `/about/sprint-engagements` swaps the menu for a "Contact" pill. | source read |
| Header logo | Wordmark SVG 160 x 22 px (137 x 18 below 1280), fades in | No change | No change | n/a | n/a | source read; hover diff empty (measured) |
| Header nav link | 14 px upper, `overflow: hidden`, underline 1 px hidden off to the left (`translateX(-100% - 1px)`) | Underline sweeps in from the left (`trace-in`, 250 ms `cubic-bezier(0.28,0.44,0.49,1)`), sweeps out to the right on leave (`trace-out`, 250 ms) | Same as hover | n/a | Current page: underline held (`trace-in`, 0 ms). Shown from 1280 up only. | source read |
| Header menu button (dots) | Three 5 px dots (21 x 5 icon shown 22 x 7 px at 1440), text "MENU" below 1280 | Outer dots move apart 2 px: circle 1 `translateX(-2px)`, circle 3 `translateX(2px)`, 0.13 s (token `--bd-time-transition-125`) `cubic-bezier(0.28,0,0.49,1)` | No outline | n/a | Click opens menu | measured (matrix -2 and 2) and source read |
| Menu overlay | Hidden: `opacity 0`, `pointer-events: none`, `aria-hidden` | n/a | n/a | n/a | Open: fade 500 ms in, 250 ms out (`cubic-bezier(0.28,0,0.49,1)`); a dark curtain (`:after`) slides left by 100 percent over 1 s `cubic-bezier(0.77,0,0.175,1)`; the project row slides in from `translateX(15%)` over 1 s the same ease; copyright and intro text fade in 250 ms after 0.75 s delay. Below 1280 the overlay shows a nav list first and "Initiatives" extends into the row. | source read; open screenshot measured |
| Menu close button | 40 px circle (30 below 1280), 1 px white border, close icon 16 px | No change recorded | No outline | n/a | Closes menu | measured (empty diff) and source read |
| Menu project card (5 cards) | Image with `scale(1.1)`, info panel pushed down 150 px, number label bottom-left | The image frame lifts 150 px (the image inside counter-moves 150 px and goes from scale 1.1 to 1); the info panel slides up 150 px; body text fades in from 75 px higher; all 350 ms `cubic-bezier(0.28,0,0.49,1)` | Not styled | n/a | Draggable row with "DRAG" disc, fixed cursor | source read |
| Pill button (`button-pill`) | Transparent, 1 px border in current colour, radius 16 px, padding 2 px 30 px 0, 12 px bold upper, line height 28 px, `overflow: hidden` | A fill in the text colour rises from below (`translate3d(0,100%,0)` to 0, 250 ms `cubic-bezier(0.28,0.44,0.49,1)`), text turns to the page background colour (250 ms), border colour transition 650 ms | Same as hover | Solid text-colour background with page-colour text | Disabled: opacity 0.25. Inverted (`data-inverted`): white background, ink text, ink fill on hover. | source read |
| Cookie accept pill | White text on #191918 bar, 1 px white border | Text colour goes from rgb(255,255,255) to rgb(37,36,34) (white fill rises behind it) | Same as hover | n/a | Click stores `basic-cc = Date.now()` in localStorage | measured (colour diff) and source read |
| Cookie close (X) | 12 px icon, hit area full bar height, at least 40 px wide | No change recorded | No outline | n/a | Click stores the same key and expires the Google Analytics cookies (`__utma`, `__utmb`, `__utmc`, `__utmt`, `__utmv`, `__utmz`, `_ga`, `_gat`, `_gid`) | source read |
| Cookie bar | 60 px high, #191918, white text, logo hidden below 720, slides up | n/a | n/a | n/a | Appears only if the checker (run 1 s after load) finds no bot user agent, no Do Not Track flag set to yes or 1, and no `basic-cc` key; slide-up 500 ms `cubic-bezier(0.28,0,0.49,1)` after the 0.5 s initial delay | source read |
| Hero cursor disc "Watch reel" (`video-player_cursor`) | 120 px circle (80 below 1024), white when `brightCursor`, pink otherwise; label 14 px bold upper; subtitle "BASIC/DEPT 2010-infinity" 120 px wide, 10 px below the disc | Follows the pointer (section 7) | Not applicable (mouse only, `cursor: none`) | Click starts the full reel player | Player open: `data-player=true`, video controls layer visible | measured (followers at x 1000, y 300, body width 120) and source read |
| Video player seeker | Time readout 18 px with `mix-blend-mode: difference`, `cursor: grab`, 20 px from the bottom | n/a | n/a | Drag sets `currentTime` = (pointer x - left) / width x duration | Click on the video pauses | source read |
| Drag disc (`carousel_cursor`) | 120 px pink circle (80 below 1024), label "DRAG" 14 px bold, three stacked label spans | Follows the pointer; on entry the label rolls (`translate-up-100`, 650 ms `cubic-bezier(0.5,0,0,1)`) | n/a | Dragging: disc shrinks to 70 px over 250 ms, label fades, two caret arrows (8 px) fade in and scale from 0.6 to 1 in 200 ms | Over a link inside the row: disc opacity 0.5 and label hidden | source read; disc and label copy measured |
| Award tile (3) | Logo SVG at 40 percent width (55 percent below 1024, 75 percent below 720), 13 px caption | Logo scales to 1.05 (250 ms `cubic-bezier(0.28,0,0.49,1)`), caption underlined 2 px | Same as hover | n/a | n/a | source read |
| Case study card (3) | Image or video at `scale(1.05)` inside an `overflow: hidden` frame; title upper 22 px; blurb 14 px | Image scale returns to 1 (250 ms `cubic-bezier(0.28,0,0.49,1)`), title underlined | Same as hover | n/a | Video is created only while in view | source read |
| Client card (5) | Logo 40 px high, 20 x 2 px tick, 22 px upper name with 100 px top padding (50 below 1280), body copy with underlined "here" links | Link hover follows normal underline; drag disc changes opacity over anchors | n/a | n/a | Row scrolls by drag (section 7) | source read |
| Carousel progress line | 2 px line in current colour, track at 25 percent opacity, 62.4 percent wide bar at load | n/a | n/a | n/a | Bar width = visible width / total width; left offset follows scroll | measured (inline width 62.4187%) and source read |
| Meta bar | 1 px rule, "00" left, "/05" and a dot right, 14 px upper | n/a | n/a | n/a | n/a | source read |
| News row (10) | 1 px top rule, image 413 px wide at `scale(1.05)`, 42 px upper headline, "Press 4.16.25" date, 30 px arrow top right | Image scale to 1, headline underlined, arrow exits right and re-enters from the left (`push-arrow`, 0.55 s `cubic-bezier(0.77,0,0.175,1)`) | Same as hover | n/a | n/a | source read |
| Footer links | 18 px light, no underline | Underline | Same | n/a | n/a | source read |
| Footer email link | Underlined by default | n/a | n/a | n/a | n/a | measured (screenshot) |
| Newsletter field | 55 px high input, placeholder in current colour, underline 2 px at 50 percent height | n/a | Underline grows to full height (`scaleY(.5)` to 1, 250 ms `cubic-bezier(0.5,0,0,1)`) via `:focus-within` | n/a | Response text: "Thank you for signing up!" or "There was an error. please try again." (site's own spelling) | source read |
| Sound player (bottom panel) | Hidden (`display: none`) | Controls overlay shows at opacity 1 (150 ms) | n/a | n/a | Appears when a track plays: 100 px cover, 50 percent play ring, progress bar 3 px in pink | source read |
| Lightbox overlay (awards, team) | Hidden off screen right | n/a | n/a | n/a | Opens on /about: panel slides in 500 ms, scrim to 75 percent opacity, background scroll locked (`body overflow: hidden`) | source read |
| Grain layer | Always on, `pointer-events: none` | n/a | n/a | n/a | n/a | source read |
| accessiBe widget | Circle button bottom-left (about x 42, y 857) | Third party | Third party | n/a | Third party | measured (screenshot) |

## 7 Motion, section by section

### 7.1 Timing tokens (source read)

| Token | Value |
|---|---|
| Transition durations | 100, 130, 150, 200, 250, 350, 500, 550, 650, 750, 1000 ms (`--bd-time-transition-*`; the token named 125 holds 0.13 s) |
| Delays | 30, 100, 200, 250, 350, 380, 500, 600, 750, 1000 ms (`--bd-time-delay-*`); initial delay 500 ms on first load, set to 0 on later page views |
| `--ease-out` | `cubic-bezier(0.28,0.44,0.49,1)` |
| `--ease-out-soft` | `cubic-bezier(0.28,0,0.49,1)` |
| `--ease-in-out-soft` | `cubic-bezier(0.72,0,0.28,1)` |
| `--ease-in-out-hard` | `cubic-bezier(0.77,0,0.175,1)` |
| `--ease-garret` | `cubic-bezier(0.5,0,0,1)` |
| `--bounce` | `cubic-bezier(0.6,0,0.1,1.4)` (defined, no home use found) |

Keyframes defined in every module's CSS (source read): `fade-in`, `fade-out`, `push-arrow` (0% none, 50% `translateX(100%)`, 50.1% `translateX(-100%)`, 100% none), `translate-up-0` (100% to 0), `translate-up-25`, `translate-up-0-masked` (103% to 0), `translate-up-100` (0 to -100%), `translate-down-0`, `translate-down-100`, `scale-in` and `scale-out` (scaleX with left/right origin), `trace-in` (`translate3d(-101%,0,0)` to 0), `trace-out` (0 to `translate3d(101%,0,0)`), `wipe-in` (`scale(1.75) translateX(-100%)` to identity), `wipe-out`, `wipe-in-up`, `wipe-out-up`, `overlay-slide-left`. Used on the home page: `fade-in`, `translate-up` (1 rem), `translate-up-100`, `trace-in`, `trace-out`, `push-arrow`, plus the module-specific ones below. The `wipe-*` and `scale-*` sets are used on other pages.

GSAP triggers: none exist. So the questions "pin, snap, scrub, once" have these answers for the whole page: pin: none (the only sticky is a JS translate on the spotlight quote); snap: none (`scroll-snap` absent from all CSS); scrub: every scroll-linked change is continuous and follows the eased scroll value, not a GSAP scrub; once: every load animation is CSS `forwards`, played once per page mount.

### 7.2 Smooth scroll setup (source read, `_app` module 7679; fit checked against `motion_sampled.json`)

| Part | Value |
|---|---|
| Mechanism | The browser scrolls natively (the `<body>` is given an explicit height equal to the bottom of the last section, 9993 px). A wrapper is set to `position: fixed; top: 0; left: 0; width: 100%`. Each section and the footer (`[data-uri] > section`, `[data-footer]`) gets `transform: matrix(1,0,0,1,0,-N)` and `visibility`. |
| Ease | easeOutQuint: `c * ((t = t/d - 1) * t*t*t*t + 1) + b` |
| Length | `duration = 60` frames on desktop; the tween is counted in animation frames, not milliseconds |
| Restart rule | Every time `window.scrollY` changes, the tween restarts from the current eased value (`from = eased`, `frame = 60`) toward the new target. Each frame: `eased = Math.round(from + easeOutQuint(60 - frame, 0, target - from, 60))` |
| Visibility culling | If `eased + viewportHeight <= section.offset`, the section is `visibility: hidden` with translate `offset - viewportHeight`; if `eased >= offset + height` it is hidden with translate `offset + height`; otherwise visible with translate `eased` |
| Render step | Style writes happen in a second pass, only for sections flagged as changed |
| Touch devices | On the first `touchstart` the site sets `isTouchDevice`, turns transform rendering off, clears all inline transforms and position styles, and uses native scrolling. The tween length becomes 25 frames but only feeds derived values (header, colour flip). |
| Jump scroll | `jumpTo` and route changes set a flag that skips easing (`from = target`, `frame = 1`) |
| Route changes | On `routeChangeStart` easing is switched off; 250 ms after `routeChangeComplete` it is switched back on |
| Resize | Offsets and body height are re-measured; the scroll ratio is preserved |
| Fit check (fitted) | A model with 60 frames at 60 fps and a start position equal to the previous stop fits five clean scroll series with rms 0.0005 to 0.0045 (fraction of travel): stops 450 (0.0010), 900 (0.0024), 1350 (0.0014), 2700 clients (0.0005), 3150 clients (0.0010). Trying 30, 40, 50, 70, 80 and 90 frames on stops 450, 900, 1350 and 3150 gives rms 0.011 to 0.055, so 60 is confirmed. Series that began before the previous tween finished, or were capped by the section end (stops 1800, 2250, 3600 and later), fit worse (rms 0.02 to 0.11) and are inferred only. |
| Nearest named ease from `motion.json` | Fitted cubic-beziers range across power3.out and power4.out. These are approximations of easeOutQuint (about `cubic-bezier(0.22,1,0.36,1)`); the formula above is the truth. |

Because the counter is frames, a 120 Hz or 144 Hz screen would run the same tween twice as fast (inferred from the code; not tested).

### 7.3 Loader and load sequence (source read; `--initial-animation-delay` = 0.5 s)

There is no percentage preloader. The "loader" is a wordmark wipe plus staggered reveals. Order in time after the HTML paints:

| Time | What | Duration | Ease | From to | Evidence |
|---|---|---|---|---|---|
| 0 to 250 ms | Fixed wordmark "B/D" (427 x 200 SVG, 35vw = 504 px wide at 1440) sits centred over the page | hold | n/a | n/a | source read |
| 250 to 750 ms | Wordmark wipes away upward: the mask (`logo-takeover__mask`, `overflow: hidden`) goes `translateY(0)` to `translateY(-100%)` while the inner logo goes `translateY(0)` to `translateY(100%)`. Both use the same timing so the logo stays put while the window slides off. | 500 ms | `cubic-bezier(0.5,0,0,1)` | 0 to -100% and 0 to 100% | source read; fitted final end offsets -237.06 and 237.06 px (rms 0.0137) |
| 500 ms | Header logo: fade 0 to 1 and `translateY(1rem)` to 0 (10 px) | 500 ms | `cubic-bezier(0.28,0,0.49,1)` | opacity 0 to 1 | source read; fitted from 8 px to 0 over 383 ms (rms 0.0144) |
| 630, 660, 690, 720, 750, 780, 810 ms | Nav items 1 to 7 fade in and rise 10 px, delay `0.5 + 0.1 + i x 0.03` s | 500 ms each | `cubic-bezier(0.28,0,0.49,1)` | opacity 0 to 1 | source read; item 1 delay 630 ms measured in the animation list |
| 880 ms (1024 and up) | Menu dots button fades in and rises 10 px, delay `0.5 + 0.38` s (below 1024 it uses `0.5 + 0.1` s) | 500 ms | same | same | source read; delay 880 ms measured |
| 500 ms to 1500 ms | Hero reel curtain: mask `translateY(100%)` to 0, inner media `translateY(-100%) scale(1.25)` to `translateY(0) scale(1)`. The mask rises from the bottom while the media moves the opposite way and settles down in scale | 1000 ms | `cubic-bezier(0.72,0,0.28,1)` | 100% to 0; scale 1.25 to 1 | source read; fitted 890.8 px to 0 and scale 1.2474 to 1 over 1336 ms, rms 0.0209 |
| 1000 ms | Hero cursor hit area fades in | 250 ms | linear | opacity 0 to 1 | source read; fitted 271 ms, rms 0.0227 |
| 500 ms | Footer fade in (invisible until scrolled to) | 650 ms | `cubic-bezier(0.72,0,0.28,1)` | opacity 0 to 1 | source read; fitted 515 ms, rms 0.0166 |
| 500 ms | Every non-first `main > section` fades in once | 650 ms | `cubic-bezier(0.28,0.44,0.49,1)` | opacity 0 to 1 | source read (`animation: fade-in ... forwards; opacity: 0`) |
| about 1500 to 2000 ms | Cookie bar slides up (checker runs after 1 s, then 500 ms slide after the 0.5 s delay) | 500 ms | `cubic-bezier(0.28,0,0.49,1)` | `translateY(100%)` to 0 | source read |

Why the fitted curves differ from the CSS: the frame sampler began mid-delay, so the fits (for example 1336 ms on the hero) mix the delay into the duration and pick different bezier shapes. The CSS values are used. The "fitted timings read 10 to 15 percent long" cloud limit applies to any fitted number quoted.

Later page views: `--initial-animation-delay` is set to 0 s, `data-header=false` turns off the header entrance, and `initialPage` becomes false. The wordmark takeover is not replayed because it is mounted once in `_app`.

### 7.4 Section by section

| Section | Trigger | Pin | Snap | Reveal (from to, duration, delay, ease, stagger) | Per-frame code | Evidence |
|---|---|---|---|---|---|---|
| Header | Scroll (any) | Fixed | None | Slides away and back at 1.5 x scroll speed. Transparent state while eased scroll is below the window height. | See 7.5 "Header" | source read |
| Hero (reel) | Load | None | None | Curtain reveal as in 7.3. Poster video loops muted; the video element is created only while the block is in view and removed when it leaves. | See 7.5 "Video virtualisation" | source read |
| Hero cursor disc | Pointer | None | None | Disc follows pointer with lerp 0.15 (0.25 inside) | See 7.5 "Cursor" | source read; positions measured |
| Awards strip | Hover | None | None | No scroll reveal. Hover: logo scale 1.05, 250 ms | None | source read |
| Overview | None | None | None | No reveal beyond the one-time section fade-in (650 ms). Body text is plain. | None | source read |
| Case studies | Hover | None | None | Image scale 1.05 to 1 in 250 ms `cubic-bezier(0.28,0,0.49,1)` | None | source read |
| Clients | Pointer drag | None | None | Drag disc; row moves by delta x 4.5 with lerp 0.05; progress line width and left position follow | See 7.5 "Carousel" | source read |
| Spotlight | Scroll (middle of screen inside the section) | Text column: JS sticky, top offset 80 px plus the header's remaining offset | None | Page colour flips to Dark over 650 ms; quote stays put while the video column scrolls | See 7.5 "Colour flip" and "Sticky" | source read; flip end points inferred |
| News | Hover; scroll (colour returns to Bright when its top reaches mid-screen) | None | None | Image scale 1.05 to 1; arrow push 0.55 s | None | source read |
| Footer | Load only (fade), link hover | None | None | Footer fade 650 ms (invisible until reached). Newsletter underline 250 ms. | None | source read |
| Menu overlay | Click | Fixed | None | See section 6 | None | source read |
| Page transitions | Link click (Next router) | n/a | n/a | No exit animation. Easing is off from route start to 250 ms after route complete; new sections fade in 650 ms; header stays mounted | None | source read |
| Marquees and tickers | None found | n/a | n/a | n/a | None | source read (grep) |

### 7.5 Per-frame formulas found in the code (source read)

Frame loop: `_app` module 6391 runs one `requestAnimationFrame` loop. Components register `(update, render)` pairs. Each frame runs every `update`; a `render` runs only when its `update` returned true.

Smooth scroll, visibility and sticky: see 7.2. Sticky text (`[data-sticky]`, module 7679, function `O`): with `top = --sticky-top (80) + stickyOffset` and `r = height + 2 x 80`; if `r > viewport` the element keeps an `adjustment` that accumulates the eased delta and is clamped to `[0, r - viewport]`, otherwise 0. Translate `n` is 0 before `offset - top + adjustment`, it is `space - height` after `offset - top + adjustment + space - height`, and in between it is `scroll - offset + top - adjustment`. Written as `matrix(1,0,0,1,0,n)`.

Header (`_app` module 6103, component `Q`):
```
e = 1.5 * eased
delta = e - previous            // previous is clamped at >= 0
c = clamp(c + delta, 0, headerHeight)      // headerHeight = 126 at 1440
header.style.transform = matrix(1,0,0,1,0,-c)
transparent = eased < window.innerHeight
stickyOffset = headerHeight - c
```
So the header hides after 84 px of scroll (126 / 1.5) and comes back at the same rate when scrolling up. It is proportional, with no threshold or timer.

Colour flip (module 5349, hook `useColorScheme`): each frame, for each section with a scheme: `t = (eased + viewportHeight/2 - section.offset) / section.height`; when `0 <= t < 1` the hook calls `updateColorScheme`, which sets `--text-color` and `--background-color` on `:root`. Sections without a scheme do not change it, so the last scheme stays until another section's middle-line test passes. Home wiring: clients = Bright, spotlight = Dark, news = Bright; hero, overview and case studies set none (page default Bright). The footer reads the current scheme and switches to a light footer when the scheme background equals its own dark background.

Cursor (module 6171):
```
mouse target = (event.pageX, event.pageY - window.scrollY)
box = element offset (left, top) and size
if not hovering: target = box.x + box.width * (position.x ?? 0.5), box.y + box.height * (position.y ?? 0.5)
goal.x = target.x - box.x
goal.y = target.y - box.y + (hovering and not fixed ? eased : 0)
k = hovering ? 0.25 : 0.15
pos.x += (goal.x - pos.x) * k    // lerp(a, b, t) = (1 - t) * a + t * b
pos.y += (goal.y - pos.y) * k
element.style.transform = translate3d(pos.x px, pos.y px, 0)
```
Drag disc uses `position.x = 0.9` as its resting spot (90 percent across the row). Hero disc uses the centre. The disc is centred with `transform: translate(-50%, -50%)` on an inner body.

Carousel (module 9190):
```
onPointerDown: startX = clientX; dragging = true
onPointerMove: target = clamp(savedTarget + (clientX - startX) * 4.5, -(scrollWidth - clientWidth), 0)
onPointerUp: savedTarget = target; dragging = false
each frame: cur = lerp(cur, target, 0.05); cur = floor(cur * 100) / 100; stage.scrollLeft = -cur
progress bar width = clientWidth / scrollWidth * 100 %
progress bar left = (100 - clientWidth / scrollWidth * 100) / 100 * (scrollLeft / (scrollWidth - clientWidth) * 100) %
```
The disc is shown only when not a touch device (`showCursor` medium from 1024 or large from 1280). On touch the stage is a native horizontal scroller (`overflow: scroll visible`, scrollbar hidden).

Video virtualisation (module 1336): the video element is created only while `eased + viewportHeight >= block.top && eased <= block.top + block.height`. It is `muted`, `loop`, `playsInline`, `preload = metadata`, inserted after the placeholder SVG; when the block leaves the range the element is removed. On `canplay` it gets `data-can-play=true` and fades in 350 ms `cubic-bezier(0.72,0,0.28,1)`. The SVG placeholder gets its `viewBox` and size from the video's real width and height on `loadedmetadata`, which is why the layout height depends on the file.

Reel player (module 142 `d`): click on the hit box sets `data-player=true` and plays; click on the video pauses. Time readout position: `transform: translateX(progress x 100 %)`; dragging the seeker sets `currentTime = (x - left) / width x duration`. Time text is `mm:ss`.

Sliding text (module 6403, used by inner-page H1 and the team overlay): each word is `overflow: hidden`, its inner span animates `translateY(103%)` to 0 over 750 ms `cubic-bezier(0.5,0,0,1)`. Delay per word = `initial delay + 0.1 s x line index` (line index found by comparing each word's `offsetTop`). Not present on the home page.

Sticky "dot" handling in headings: the "●" character is split into its own word so it can take a column width (`1 column` from 1280).

### 7.6 Scroll-fit table for reference (fitted, `motion.json`)

The 45 effects in `motion.json` are: 9 on-load effects (header, hero mask, cursor hit area, footer fade, wordmark) and 36 scroll effects that are all the same eased-scroll motion moving sections. Rms for the on-load fits runs 0.0137 to 0.0299 and for the scroll fits 0.0014 to 0.0311; all are under 0.05, so they count as fitted. Twelve entries are labelled inferred in the file (`fx010`, `fx018` to `fx020`, `fx033`, `fx035` to `fx037`, `fx039` to `fx042`) because the series had not settled or was too short to fit. Where GSAP would normally supply the ease, this site supplies a formula, so the formula in 7.2 replaces all of them.

## 8 3D

None. Measured: 0 canvases at every width, `three.json` "no canvas on page", `scene-3d.json` "no canvas on page", `probe.json` shows no `THREE`, no WebGL contexts, no draw calls. No models, shaders, camera or renderer exist. Nothing to port.

## 9 Responsive

### Fresh loads (measured, `responsive.json`)

| Width | Page height | Touch mode | Overflow X | Pin spacers | Notes |
|---|---|---|---|---|---|
| 360 | 9057 | yes | none | 0 | Native scroll, no cursors |
| 390 | 9335 | yes | none | 0 | Matches the phone map |
| 768 | 7261 | yes | none | 0 | 2-column cards start (720 rule) |
| 820 | 7576 | yes | none | 0 | Same rules as 768 |
| 1024 | 8156 | no | none | 0 | Desktop scroller and cursors on; H1 becomes 6.25vw |
| 1280 | 9238 | no | none | 0 | 12-column grid, header nav shown, desktop type sizes |
| 1440 | 9993 | no | none | 0 | Reference |
| 1920 | 11878 | no | none | 0 | 1 rem becomes 0.5vw, so everything scales |

Every width reported `hamburger: true`, `visibleNavLinks: 7`, `h1: null`, `canvases: 0`, `tweens: 0`. `breakpointsFound` was empty. That detector looks for h1 and nav changes, and the site has no h1 and always keeps the nav in the DOM, so it found nothing (section 10 and `not-verified.md`). The real breakpoints below come from the CSS.

### Real breakpoints (source read, all `min-width` unless stated)

| Breakpoint | What changes |
|---|---|
| 480 | H1 token goes from 4rem to 4.6rem; overview body width 5 columns |
| 720 | Two-side-by-side layouts start: spotlight columns sit side by side (video right, text left), case study and client cards shrink to 3 columns, news rows go horizontal (2 + 4 columns), menu nav 24 px, cookie bar shows the logo, awards logos 55 percent width, footer top margin 16 rem |
| 1024 | H1 becomes 6.25vw; cursor discs grow from 80 to 120 px, cursor labels 14 px, drag disc shown on medium carousels; award captions 13 px; client card 2 columns; hero button delay changes; header height rules unchanged |
| 1150 | One rule uses `(min-width: 1150px)`; it targets the contact page intro, not the home page (source read) |
| 1280 | 12-column grid (padding 8 rem, gutter 2 rem); header nav visible, menu label hidden and dots shown, header height 12.8 rem, wordmark 160 px; type tokens jump to desktop sizes; overview row goes side by side; menu becomes the full-screen curtain layout with the project row; footer margin 15.625vw |
| 1440 | Small tweaks on other pages (max widths, padding); nothing on the home page |
| 1680 | Larger quote and result sizes on other pages; nothing on the home page |
| 1920 | `--rem-base` switches to `0.5vw`; the whole page scales with width |
| max 719 and max 1023 | Used for promise-page infographic rules; nothing on the home page |

### Live resize (measured)

| Step | Width | Height |
|---|---|---|
| 1 | 1440 | 9993 |
| 2 | 1024 | 8288 |
| 3 | 800 | 7219 |
| 4 | 760 | 7106 |
| 5 | 390 | 9391 |
| 6 | 760 | 7106 |
| 7 | 800 | 7219 |
| 8 | 1440 | 9993 |

Going down and back up returns to the same heights (760 to 7106, 800 to 7219, 1440 to 9993), so the layout re-measures cleanly and is reversible. Live resize at 1024 (8288) and 390 (9391) differs from the fresh load at the same width (8156 and 9335) by 132 and 56 px; the reason is not established. Also, while resizing the eased-scroll module re-measures offsets and body height (source read).

### Reduced motion (measured and source read)

The reduced-motion run gave the same height (9993) as the normal run, with no change in tweens. There is no `prefers-reduced-motion` rule in any stylesheet and none in the site's scripts (the only `prefers-color-scheme` text in the bundle is inside Next's error page styles). All motion plays regardless of the user's setting.

## 10 Accessibility, meta and extras

| Topic | Finding | Evidence |
|---|---|---|
| Dark mode | None. Under dark colour-scheme emulation the body stayed rgb(244,244,244); no `prefers-color-scheme` rules. The "dark" band is a scroll scheme, not a user setting. | measured |
| Contrast | See section 4. Main pairs pass strongly; grey copyright text on the dark footer bands fails (2.39 and 2.71). | measured |
| Keyboard focus | Buttons and inputs have `outline: none`; links use hover styles as focus styles; no visible ring; no skip link (`skipLink: false`; only the accessiBe screen-reader link exists) | measured and source read |
| Landmarks | header 1, nav 2, main 1, footer 1 (`role=contentinfo` on the footer). Header nav is `role="menubar"` with `role="menuitem"` items, a pattern meant for app menus rather than site navigation. | measured and source read |
| Headings | No `h1` on the home page (`h1: null` at every width). Found: H3 (overview), H2 (clients), H2 (news); news titles are `h5` styled as H2. The giant spotlight text is a `<q>` element. | measured |
| Images | 23 images, 0 without an `alt` attribute, 12 with empty alt (decorative or covered by nearby text); the rest carry real alt text such as "Red purse on person" and "Store parking lot". All are `loading="lazy"`; `picture` sources switch at 720 px. | measured |
| ARIA | 4 `aria-hidden` elements; the menu overlay toggles `aria-hidden`; menu and header buttons have `aria-label` ("Open menu", "Close overlay", "Home"); the close and cookie buttons carry titles | measured and source read |
| Language | `lang="en"` | measured |
| Route announcer | Next's `next-route-announcer` is present | measured |
| Title | `BASIC/DEPT (R) \| Digital Branding & Product Design Agency` (the site writes the registered mark as a symbol) | measured |
| Description | "We design digital products, services, and eCommerce experiences for brands like Google, Airbnb, Patagonia, Apple, Beats by Dre and other category leaders." | measured |
| Other meta | `keywords`, `author`, `robots: index, follow`, `viewport: width=device-width, initial-scale=1`, `twitter:card: summary` plus title, description, url, creator; `og:site_name`, `og:type: article`, `og:title`, `og:description`, `og:image` (1200 x 630 png, saved in `03-assets/brand`), `og:url` | measured |
| Favicon | `.ico` from the Sanity CDN | measured |
| Structured data, canonical link | None found in the rendered head | measured |
| Content Security Policy | A strict `connect-src` policy is in force and blocked Hotjar and LinkedIn calls | measured (console) |
| Third-party overlay | accessiBe injects `access-widget-ui` elements and a floating button; it may affect any automated accessibility result | measured |
| Cookie consent | Own bar, key `basic-cc` in localStorage, respects Do Not Track and skips bots | source read |
| Pages | 11 routes checked: `/`, `/services`, `/about`, `/blog`, `/thinking`, `/careers`, `/contact`, `/thinking/category/applied`, two blog posts return 200; `/thinking/categories/brandbeats` and a made-up URL return 404 (the menu's Brandbeats card links to that 404 URL; the footer uses the singular `/thinking/category/brandbeats`, which was not checked) | measured |
| Route heights | services 4761, about 9413, blog 38589, thinking 34308, careers 6699, contact 5334, category applied 14288, blog posts 3806 and 5258, 404 page 1850 | measured |
| Other odd details | Audio: the reel mp4 has an audio track (aac, measured from the mp4 header); a sticky SoundCloud player exists in code but did not appear on the home page. The footer and menu copy carry a year value ("10 - 26") generated in code. Newsletter error copy is "There was an error. please try again." | measured and source read |

## 11 Page weight and cost

All figures are uncompressed and from the cloud capture (`weight.json`).

| Type | Files | KB | Comment |
|---|---|---|---|
| Media (mp4) | 4 | 34372 | 24212 reel, 7302 hero loop, 2122 spotlight video, 736 Google Store loop. About 71 percent of everything. |
| Fetch (Next data JSON) | 38 | 10494 | Route data prefetched for links in view (rootMargin 200 px on 39 link targets); `careers.json` alone is 2618, `blog.json` 1344, `thinking.json` 1142 |
| Script | 31 | 2194 | Includes third parties: accessiBe `app.js` 873, gtag 181 and 149, GTM 160 |
| Image | 26 | 634 | All Sanity webp at `w=720` or `w=1024`, `q=65` |
| Stylesheet | 4 | 275 | 152 KB is the home and pages sheet |
| Document | 1 | 180 | |
| Font | 3 | 86 | woff2 only |
| Other | 9 | 1 | |
| Total | 116 | 48236 | Sum of the rows above |

Timing (measured, cloud): first paint 776 ms, first contentful paint 776 ms, DOMContentLoaded 992 ms, load 993 ms, 61 fps at the top of the page (software-rendered).

What a visitor pays before the page looks ready (from the probe's per-file transfer sizes, which appear compressed, so they are smaller than the uncompressed list): `main` 43 KB, `framework` 60 KB, `_app` 68 KB, chunk 651 25 KB, fonts 86 KB, grain PNG 23 KB, four stylesheets 41 KB in total. Everything else is media and prefetch.

Runtime cost: one rAF loop that runs all the time; hidden sections have `visibility: hidden` so the browser skips their painting; videos are created and destroyed by viewport; grain is a `will-change: transform` layer that repaints about 20 times a second.

## 12 What is worth porting, in order

1. The colour scheme rules: three pairs (#f4f4f4 on #252422, #252422 with #f9cdcd, #f9cdcd on #252422), tokens named by role, and the 650 ms body transition. Cheapest thing to copy and carries most of the brand.
2. The type system: one family, three weights, uppercase tight headings at -0.05em, rem tokens that step at 1280, and a vw value only for the single largest heading.
3. Card hover: image rests at 1.05 and settles to 1.0 in 250 ms with `cubic-bezier(0.28,0,0.49,1)`, title gets an underline. Low risk, works on touch as "no hover".
4. Pill button with the rising fill (250 ms), the nav underline trace (250 ms), and the arrow push (0.55 s).
5. Load choreography: header stagger (0.03 s steps), 1 s curtain reveal, wordmark wipe. Pure CSS.
6. Scroll colour flip for one story band (use an IntersectionObserver version unless you also build the smooth scroller).
7. Cursor discs and the drag row, only for pointer devices, with native touch scrolling as the fallback (as the site does).
8. Grain layer. Needs your own PNG.
9. The custom smooth scroller last, and only after weighing the costs below. It gives the "heavy, expensive" feel but the site pays for it with no reduced-motion handling, frame-based timing, and a body-height spacer that must be re-measured after every layout change. Lenis is the closest off-the-shelf alternative (not used by this site).

What not to copy: no `h1`, no visible focus ring, no skip link, no reduced-motion support, 2.4 to 2.7 contrast on the copyright bands, ten prefetched route files (10.5 MB) and a 24 MB reel file fetched in the background.

### Why this reference matters for a leather-bag store

- Colour: an ink-and-paper base (#252422 on #f4f4f4 at 14.1:1) plus one soft accent, and a single dark story band, gives an accessible premium feel that lets product photography carry the colour. A tan or oxblood accent could take the pink's place, but check the accent's ratio on both grounds the way section 4 does. See section 4 and the rhythm in section 3.
- Type: a single grotesque family in three weights, large uppercase headings with tight tracking and a calm 18 px body at 1.4 line height, gives a confident look without a display font budget. See section 5 (scale table and the rem-token steps).
- Product cards: the resting 1.05 scale that settles to 1.0 on hover (250 ms), a plain underline on the title, and a 1 px hairline above each row suit bag cards and keep layout still on hover. See sections 6 (case study card, news row) and 7.4.
- Motion: use the colour flip and the load curtain for the brand or craft story, keep everything else native scroll, and add the things this site skipped (reduced-motion rule, visible focus ring, an h1) so the premium feel stays accessible. See sections 7.3, 7.5 and 10.
- Weight: keep the hero media small and prefetch less. This site ships a 7.3 MB looping hero plus a 24 MB reel and 10.5 MB of route data; a bag store should lazy-load and cap video so product pages stay fast. See section 11.
