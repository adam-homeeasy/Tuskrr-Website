# Ströms Man (stroms.com/pages/man): site teardown

## 1. Header

| Item | Value |
|---|---|
| Site | https://stroms.com/pages/man (Swedish menswear, Ströms Man & Woman) |
| Captured | 2026-09-29, cloud Chromium |
| Main viewport | 1440 x 900 (desktop), 390 x 844 (phone map) |
| Fresh loads | 360, 390, 768, 820, 1024, 1280, 1440, 1920 wide |
| Live resize | 1440, 1024, 800, 760, 390, 760, 800, 1440 |
| Page height | 6154 px at 1440 (measured) |

Evidence labels used on every value:

| Label | Meaning |
|---|---|
| measured | Read from the running page (computed styles, tokens, DOM rects, library objects). |
| source read | Copied from the shipped CSS, JS or HTML in 04-code. |
| fitted | Worked out from frame samples. The rms error is given. Over 0.05 is treated as inferred. |
| inferred | Worked out from screenshots, arithmetic on measured values, or feature checks. The reason is given. |

GSAP is not on this site (motion_gsap.json shows 0 tweens, 0 timelines, 0 triggers, no Lenis, no ScrollTrigger). So all easing and duration values come from the site's own JavaScript and CSS (source read), and the frame fit is only a cross-check.

## 2. Summary

**What it is.** A men's landing page for a Stockholm fashion retailer. It is a stack of full-width photo tiles, two small headline strips, one product slider, one shoppable lookbook, a brand strip, a department strip and a footer. There is no hero video, no canvas, no 3D and no smooth-scroll library. The mood is calm and editorial: cream paper, charcoal text, warm photography, light-weight grotesque type.

**Stack.**

| Layer | Finding | Evidence |
|---|---|---|
| Platform | Shopify store, theme "Stroms x coi MAIN theme", schema name "coi", footer credit "MADE BY COI" | source read (Shopify.theme object in index.server.html) |
| Components | About 45 native web components (`header-component`, `collection-showcase`, `product-card`, `swiper-init`, `section-lookbook`, `mobile-menu` and so on). No React, Vue or jQuery. | source read (customElements.define list in global.min.js) |
| Carousel | Swiper, wrapped in a `swiper-init` element. The version string is not in the bundle. The Lazy module and `loopAddBlankSlides` point to Swiper 8, low confidence. | inferred |
| Link prefetch | instant.page v5.2.0 (hover prefetch after 65 ms) | source read (libs.min.js banner) |
| Scroll lock | body-scroll-lock (used by the mega menu) | source read |
| Page transitions | CSS cross-document View Transitions (`@view-transition { navigation: auto }`) | source read (base.min.css) |
| Shopify runtime | shopify-perf-kit 3.9.4, trekkie storefront analytics, shop cart sync | source read (file names) |
| Tracking | Google tag (AW-10807748726, G-1QX538ESQF), Meta Pixel | measured (probe.json scripts and console) |
| Motion libraries | None. GSAP, Lenis, ScrollTrigger, Three: all undefined | measured (probe.json globals) |

**Fonts.**

| Font | Files loaded | Used for | Licence |
|---|---|---|---|
| Akzidenz-Grotesk Pro Regular (weight 400) | Akzidenz-Grotesk-Pro-Regular.woff2, served as "Heading Font", "Paragraph Secondary Font" and "Button Font" | headings, labels, buttons | Paid. Commercial font from Berthold. Not in the pack. (inferred: paid status is general knowledge, the pack only shows the file names) |
| Akzidenz-Grotesk Pro Light (weight 300) | Akzidenz-Grotesk-Pro-Light.woff2, served as "Paragraph Primary Font" | body, nav, links, sizes | Paid. Same family. Not in the pack. |

Both files are 75 KB together (weight.json). Font files were not downloaded (assets.json lists both under fontsNotDownloaded).

**Page height.** 6154 px at 1440 wide, 8214 px at 390 wide (map_phone).

**Top 5 signature effects, ranked by how much they add.**

| Rank | Effect | Why it matters | Rebuild cost |
|---|---|---|---|
| 1 | Edge-to-edge, zero-gap photo grid: 24:10 hero, 2-up 5:4 tiles, 1:1 pair, 4-up and 3-up 4:5 strips, each with a small caption and a slow 5 percent zoom on hover | It is 80 percent of what you see. The whole page reads as a magazine spread. | Low. Plain CSS grid and one image transition. Cost is in the photography. |
| 2 | Product card with quiet hover reveal: name swaps to a size list, colour dots and a save icon fade in, image arrows appear, hairline image pager | Turns a plain catalogue card into a quick-buy card with no clutter at rest. | Medium. CSS plus a Swiper slider. Cart and quick-add wiring is extra. |
| 3 | Shoppable lookbook: one tall photo with three dot hotspots that drive a product slider beside it | The only interactive storytelling block on the page. | Medium. About 60 lines of JS plus Swiper. |
| 4 | Sticky 50 px header with hairline underline draw on nav and icons, and a full-width three-level mega menu | Feels precise and premium, keeps navigation always in reach. | High for the mega menu (keyboard, focus and scroll-lock logic). Low for the underline alone. |
| 5 | Scroll fade-ins (25 lines of Web Animations API, 425 ms linear) and 200 ms fade between pages | Adds polish for almost no code. | Low. |

## 3. Page map

All ranges are measured from scroll-map.json / map_desktop-1440.json at 1440 wide. Header and announcement heights come from tokens.json. Headline strips are not in the section list, so their heights are the measured gaps between listed sections (derived).

| # | Range (px) | Height | What it is | Background | Pinned |
|---|---|---|---|---|---|
| A | 0 to 28 | 28 | Announcement bar, one line of 12 px text "Erbjudande Made by Ströms: Köp 2 - få 700 kr avdrag" | #efe9e3 | No. Scrolls away. |
| B | 28 to 78 | 50 | Header: Man, Woman, Om oss at left, logo centred, search, saved, account, bag at right | #fdfcfb | Sticky, top 0, z-index 6, stays visible for the whole scroll |
| 1 | 78 to 678 | 600 | Hero tile "Made by Ströms - Erbjudande", 24:10 photo, centred text and "SHOPPA NU" link | Photo (olive doors), page colour behind | No |
| 2 | 678 to 738 | 60 (derived) | Strip: "UPPTÄCK KOLLEKTIONEN" | #fdfcfb | No |
| 3 | 738 to 1332 | 594 | Two tiles: JEANS, TRÖJOR (2 columns, 16 px gap, 5:4) | Photos | No |
| 4 | 1332 to 1918 | 586 | Two tiles: BYXOR, JACKOR | Photos | No |
| 5 | 1918 to 1977 | 59 (derived) | Strip: "UTVALT AV OSS" | #fdfcfb | No |
| 6 | 1977 to 2554 | 577 | Product slider, 4 cards at a time, 4:5 images, scrollbar and arrows | #fdfcfb with #f5f5f5 product shots | No (Swiper drag only) |
| 7 | 2554 to 2634 | 80 (derived) | Strip: "I BLICKFÅNGET" | #fdfcfb | No |
| 8 | 2634 to 3354 | 720 | Two 1:1 tiles: "Nyheter", "Made by Ströms - Höstkollektionen" | Photos | No |
| 9 | 3354 to 3434 | 80 (derived) | Strip: "VARUMÄRKEN I FOKUS" | #fdfcfb | No |
| 10 | 3434 to 4314 | 880 | Lookbook: photo with 3 hotspots at left, heading, copy, link and 1-product slider at right | #fdfcfb | No |
| 11 | 4314 to 4764 | 450 | Brand strip, 4 tiles 4:5: Gran Sasso, Caruso, Eton, Jacob Cohën | Photos | No |
| 12 | 4764 to 4862 | 98 (derived) | Strip: "AVDELNINGAR" | #fdfcfb | No |
| 13 | 4862 to 5462 | 600 | Department strip, 3 tiles 4:5: Business Formal, Business Casual, Festkläder | Photos | No |
| 14 | 5462 to 6154 | 692 | Footer: logo, three link columns, newsletter, social, legal | #fdfcfb | No |

Nothing on the page is pinned, snapped or scrubbed (pinSpacers 0 at every width, no ScrollTrigger). The header is the only sticky element.

Phone (390 wide, map_phone-390.json, measured):

| Section | Top | Height |
|---|---|---|
| Hero | 78 | 488 |
| JEANS / TRÖJOR | 646 | 248 |
| BYXOR / JACKOR | 894 | 248 |
| Product slider | 1202 | 551 |
| Nyheter / Höstkollektionen | 1832 | 975 |
| Lookbook | 2887 | 1112 |
| Brand strip | 3999 | 1970 |
| Department strip | 6027 | 1483 |
| Footer | 7509 | 662 |
| Page height | | 8214 |

**Colour rhythm** (pixelRhythm in map_desktop-1440.json: 5 rows of edge and centre samples at each 300 px scroll step, so 10 samples per step; "light" means a sample at #fdfcfb, #f5f5f5 or #ffffff; luminance is my calculation from the hex values).

| scrollY | Light samples | Mean luminance (0 to 255) | What is on screen |
|---|---|---|---|
| 0 | 1 of 10 | 110 | Olive hero photo (#735c2b to #a78951) |
| 300 to 600 | 4 to 6 of 10 | 162 to 191 | Hero ends, cream strip, first dark tile edges |
| 900 to 1200 | 5 to 6 of 10 | 171 to 185 | Gallery photos, dark green (#101c18, #18221c) and brown |
| 1500 to 1800 | 8 to 9 of 10 | 217 to 240 | Product shots on #f5f5f5, lightest stretch of the top half |
| 2100 | 6 of 10 | 200 | Card info row, then 1:1 tiles start (#302418) |
| 2400 to 2700 | 4 of 10 | 173 to 177 | Brown and blue-grey photo pair (#382716, #cfd9e1) |
| 3000 | 6 of 10 | 200 | Tiles end, strip |
| 3300 | 10 of 10 | 252 | Brightest point: strip plus lookbook text side |
| 3600 to 3900 | 8 to 6 of 10 | 224 to 196 | Lookbook photo at left, product on #fdfcfb at right |
| 4200 to 4500 | 2 to 0 of 10 | 137 to 90 | Darkest stretch: brand and department photos (#b47f4c, #0f0a0a) |
| 4800 to 5100 | 4 to 6 of 10 | 156 to 173 | Last photo strip, then footer |
| 5254 | 8 of 10 | 214 | Footer, cream |

Reading: light and dark alternate about every 600 to 900 px. The page starts dark (hero), relaxes to cream around 1500 to 1800 and 3300, and has its deepest stretch at 4200 to 4500 before the cream footer. All the light parts use the same #fdfcfb, so the change of tempo comes from the photos, not from coloured section backgrounds. (inferred from the pixel table)

## 4. Colours

All measured from tokens.json (CSS custom properties on `:root` and computed colour counts) unless marked.

| Name / variable | Value | Used for |
|---|---|---|
| --background_color, --body_color | #fdfcfb | Page, header, footer, cards, drawers, mega menu |
| --background_color_2, --primary_accent, --button-bg | #efe9e3 | Announcement bar, mega menu card placeholder, "NYHET" chip (at 70 percent) |
| --primary_text | #231f20 | All body text, dark button fill, slider scrollbar thumb, active lookbook hotspot |
| --secondary_text | #fdfcfb | Text laid over photos, dark-button text |
| --secondary_accent | #9b6a45 | Hover on lookbook hotspot dot, hover fill on dropdown items, hover on newsletter checkbox. One measured text use (rgb 155, 106, 69). The only warm accent on the site. |
| --primary_gray | #6c645c | Size numbers, placeholder text, swatch hover ring (154 text uses) |
| --secondary_gray | #a39c94 | Unavailable sizes, struck prices, disabled states |
| --tertiary_gray | #d3ccc4 | Slider scrollbar track, footer divider, inactive pager line |
| --loader_color | #1e242a | Keyboard focus ring, add-to-cart progress bar |
| --alert_success / --alert_error | #2fa34e / #dc0428 | Form and cart messages |
| --label_custom_Bg | rgba(239, 233, 227, 0.7) | "NYHET" chip over the product image |
| --label_soldOut_Bg / text | rgba(245, 245, 245, 0.2) / #1e242a | Sold-out chip |
| Page overlay (base.min.css) | #362e27 at opacity 0.4 | Dim behind search, cart and menu drawers. Clipped to start under the header. (source read) |
| Product image background | #f5f5f5 | The white studio backdrop inside the product photos (pixel data, measured) |
| --swiper-theme-color | #007aff | Leaks into the active dot of the card image pager (15 elements at rgb 0, 122, 255). Looks like a default nobody overrode. |
| Swiper bullets | rgb(0,0,0) | Inactive pager lines (30 elements) |
| Button tokens | Primary on light: fill rgb(35,31,32), text rgb(253,252,251), border rgb(35,31,32). Primary on dark: fill rgb(253,252,251), text rgb(19,22,25). Hover tokens: on light, text rgb(35,31,32) and border rgb(253,252,251); on dark, text and border rgb(239,233,227). Secondary hover fill: rgba(35,31,32,0.2) on light, rgba(253,252,251,0.2) on dark. | Buttons (see section 6) |

Gradients, glows, shadows and blend modes:

| Recipe | Value | Evidence |
|---|---|---|
| Mega menu collection card scrim | `linear-gradient(to top, #0000008c, #0000)` (black at 55 percent fading to clear) | source read (desktop-menu.css) |
| Tile overlay options | `.collection-showcase__overlay` at opacity 0.3, solid #231f20 or `linear-gradient(180deg, #231f20 0%, transparent 100%)`; 0.2 on the active slide. **Not present in the rendered page**: the overlay element is absent, so the tiles have no scrim and the white captions sit straight on the photos. | source read (CSS) and measured (rendered HTML has no overlay element) |
| Lookbook overlay | Option exists (default rgba(0,0,0,0.35), 180 degrees, fades over 60 percent) but this page uses `--none` | source read |
| Box shadows | None on the page (shadows list empty) | measured |
| Blend modes | None | measured |
| Blur | `backdrop-filter: blur(5px)` on the cart line loader; `blur(15px)` on hsla(0,0%,100%,0.2) in the spinning loader. Both only in cart. | measured / source read |
| Glow | None | measured |

Swatch colours seen in product data (not theme colours): rgb(1,88,129), rgb(188,36,0), rgb(102,70,56), rgb(214,196,163), rgb(29,30,24), rgb(162,194,200), rgb(163,156,148). (measured)

## 5. Type

Font families: "Heading Font", "Paragraph Secondary Font" and "Button Font" are all Akzidenz-Grotesk Pro Regular (400). "Paragraph Primary Font" is Akzidenz-Grotesk Pro Light (300). Letter spacing is 0 everywhere. There is **no clamp()** in the theme CSS (only inside Shopify's accelerated-checkout stylesheet), so nothing is fluid: sizes are fixed rem values and are the same at every width. Base rule: `* { font-size: .875rem; line-height: 130%; letter-spacing: 0 }` (source read).

Desktop scale at 1440 (sizes from base.min.css, counts from the computed type list in tokens.json):

| Role | Class | Font | Size / line height | clamp() | Tracking | Weight | Where used (measured count) |
|---|---|---|---|---|---|---|---|
| Heading 1 | .u-h1 | Regular | 18 px / 22 px (1.125rem / 1.375rem) | none | 0 | 400 | Tile titles "Made by Ströms - Erbjudande", "Nyheter" (11) |
| Heading 2 | .u-h2 | Regular | 16 px / 20 px (1rem / 1.25rem) | none | 0 | 400 | Strip headlines "UPPTÄCK KOLLEKTIONEN", "UTVALT AV OSS", cart title (6) |
| Heading 3 | .u-h3 | Regular | 14 px / 17 px (.875rem / 1.0625rem) | none | 0 | 400 | Search drawer sub-heads (3) |
| Paragraph 1 | .u-p1 | Light | 16 px / 21 px | none | 0 | 300 | Newsletter "Skicka" (1) |
| Paragraph 2 | .u-p2 | Light | 14 px / 18 px | none | 0 | 300 | Nav, links, product names, most text (433) |
| Paragraph 3 | .u-p3 | Light | 12 px / 16 px | none | 0 | 300 | Sizes, announcement text, tile captions (190) |
| Paragraph 4 | .u-p4 | Light | 10 px / 12 px | none | 0 | 300 | Skip link, social links, legal line (11) |
| Paragraph 5 | .u-p5 | Light | 8 px / 8 px measured (CSS says 10 px line) | none | 0 | 300 | Colour count "+1" (1) |
| Secondary 2 | .u-s2 | Regular | 14 px / 18 px | none | 0 | 400 | Menu labels, card brand names (42) |
| Secondary 3 | .u-s3 | Regular | 12 px / 16 px | none | 0 | 400 | "NYHET" chip (15) |
| Button | .u-pb1 | Regular | 14 px / 18 px | none | 0 | 400 | "SHOPPA NU", "JEANS", "Fortsätt handla" (17) |
| Footer column head | .custom__dropdown-heading | Light face at 700, uppercase | 14 px / 18 px | none | 0 | 700 | "OM OSS", "BUTIK", "SUPPORT" (3) |
| Default text | `*` | Light | 14 px / 18.2 px (130 percent) | none | 0 | 300 | Fallback, noscript (90) |

Notes:
- Capital letters on "UPPTÄCK KOLLEKTIONEN", "SHOPPA NU" and brand names come from the copy itself; no `text-transform` was found in the type styles (inferred from the type list, which shows `UP` only for the footer heads).
- Only two font files load, and no Bold. The 700 footer heads are therefore a browser-made faux bold (inferred: no bold file in fontFaces).
- Strong tags are forced to 700 by `b, strong { font-weight: 700 !important }` (source read).

Phone differences (map_phone-390.json, measured): the type list is the same sizes and line heights as desktop (14/18, 12/16, 10/12, 18/22, 16/20, 14/17, 16/21 all present). Only counts differ (for example 436 instead of 433 at 14/18) and the colour count reads "+1" rather than empty. So the phone gets smaller layouts, not smaller type. Header side padding is 10 px on phone against 40 px on desktop. (measured: `pad` values in the section maps)

## 6. Components

Hover diffs come from pointer.json (23 hover targets, 4 with measured style changes). The diff tool reads element styles only, so effects done on a child image or a pseudo-element (underlines, zoom) are read from CSS instead and marked source read.

**Global rules (source read).** Focus: `:focus { outline: 1px solid #1e242a; outline-offset: 1px }`, but `body:not(.user-is-tabbing) :focus { outline: none }`, so the ring appears only after the first Tab press. Measured focus ring: `rgb(30, 36, 42) auto 1px`. Transitions used everywhere are ease or ease-in-out at 0.2 to 0.4 s.

| Component | Default | Hover | Focus | Active / open |
|---|---|---|---|---|
| Announcement bar | 28 px, #efe9e3, centred 12 px text, Swiper vertical fade (measured settings, section 7) | No change measured | Screenshot shows a dark ring around the link text (keyboard_focus.png) | n/a |
| Header (sticky) | 50 px, #fdfcfb, side padding 40 px (10 px on phone) | n/a | n/a | Class `Header--Scrolled` added past 25 px of scroll; `Header--Transparent` removed at the same point. No visual change found: no shipped CSS gives `Header--Transparent` a background, and both states look identical in screenshots. |
| Nav links (Man, Woman, Om oss) | 14/18 Light, #231f20 | 1 px underline draws in: `::before`, bottom -2 px, `scaleX(0)` to `scaleX(1)`, origin bottom right, 0.3 s `cubic-bezier(.4,0,.2,1)` (source read). No style change measured on the link itself. | Opens the mega menu on focusin | Open or current page: line stays at `scaleX(1)`, origin flips to bottom left |
| Header icons (search, saved, account, bag) | 18 px, 1.125rem, fill #231f20 | Same underline draw as nav | Same | Search open: the magnifier swaps for a close cross (`body:has(.search[aria-expanded=true])`) |
| Mega menu (desktop only, 1025 and up) | Hidden | Opens on mouseenter of a top item, closes on mouseleave | Opens on focusin; Arrow Up/Down move within a column, Right goes deeper, Left goes back, Escape closes and returns focus (source read) | Full-width panel, absolute at top `--submenu-position` (54 px), padding 2.5rem, background #fdfcfb, max-height `100vh - announcement - header`, page scroll locked. Grid of 1, 2 or 4 columns, gap 1rem, min-height 20rem. Link arrow fades in 0.2 s on hover or focus. Collection card: 3:4, min-height 16rem, black-to-clear scrim. **The open menu was not captured in a screenshot** (see not-verified). |
| Mobile menu (1024 and below) | Left drawer, hidden | n/a | n/a | `aria-expanded` toggles; opacity 0 to 1 over 0.2 s ease; first-level list, then sub-levels in place, plus a tab bar (source read) |
| Search drawer | Closed | n/a | Input outline removed; the field gets a dark bottom border | Right drawer, 483 px wide at 1440 (measured from open_00_Search.png), page dimmed with #362e27 at 0.4 under the header, sections: "Föreslagna sökningar" and "Senaste sökningar" |
| Cart drawer | Closed, not opened in the capture | n/a | n/a | Right drawer, same 0.2 s fade. Contents not captured. |
| Text button "SHOPPA NU →", "UPPTÄCK →" (Tertiary) | 14/18 Regular, arrow icon 18 px, colour #fdfcfb on photos, #231f20 on cream (74 on dark, 1 on light) | No change measured | Standard ring | `:active` draws a 1 px underline: `::after` `scaleX(0)` to `scaleX(1)`, origin left, 0.3 s ease. The underline is on press, not on hover. |
| Solid button (Primary on light) | Fill #231f20, text #fdfcfb, 1 px border, padding .5rem 1.25rem, `transition: all .2s ease-in-out` | Tokens give text rgb(35,31,32) and border rgb(253,252,251), which reads as a fill-to-outline swap; the quick-add variant explicitly sets `background: transparent` on hover. The general hover fill rule was not found. | Standard ring | Disabled: fill and border #a39c94, text #fdfcfb (source read) |
| Outline button (Secondary on dark) | Transparent, 1 px #fdfcfb border, used for the country submit | Fill rgba(253,252,251,0.2) (token) | Standard ring | Disabled: transparent, border #a39c94 |
| Section strip headline | 16/20 Regular, left aligned, **flush to x = 0 on a 1440 layout** (0 side padding on desktop, 16 px on phone) | n/a | n/a | n/a |
| Photo tile (collection showcase) | Full-bleed image, `overflow: hidden`, caption block 20 px inset (16 px below 1025), bottom-left or centred | Image `scale(1.05)`, 0.4 s ease, only at 1025 and up (source read). Whole tile is one link. | Ring on the link | n/a |
| Gallery tile (2-up) | Same, caption bottom-left, 20 px inset (10 px on phone) | Same class of behaviour is not set on gallery tiles | Ring | n/a |
| Product card | 4:5 image on #f5f5f5, brand (14/18 Regular, caps in the data) and price on one line, product name under it (14/18 Light), sizes at 12/16. "NYHET" chip bottom-left of the image on rgba(239,233,227,0.7) with text set inline to #231f20 (the theme token says #ffffff, the inline style wins). | Measured: colour-dot column opacity 0 to 1; favourite button opacity 0.006 to 1 (0.3 s ease-in-out, plus visibility). Source read: name line is replaced by the size list (instant swap, no fade); image arrows fade in 0.3 s. | Focus-within does the same as hover | Keyboard: same reveal via `:focus-within`. On touch (`hover: none`) the save icon is always visible. |
| Colour dot (desktop only, hidden on phone and tablet) | 10 px circle, filled with the colour | 1 px ring in #231f20 (#6c645c if the colour is white or all-out); fill shrinks to a 5 px centre dot. 0.2 s ease. | 1 px ring, offset 2 px | Selected: 1 px #231f20 ring. Unavailable: 13.6 px x 1 px diagonal line at -45 degrees. |
| Size list item | 12/16 Light, #6c645c, up to 6 shown plus "+N" | Weight and family switch to Regular 400, colour eases 0.2 s | Same | Unavailable: #a39c94 |
| Card image pager | Lines 6 px wide by 1 px tall, bottom right of the image, 2 px side margin. Active line is #007aff (default Swiper blue). | n/a | n/a | Click a line to go to that image |
| Card image arrows | Hidden (opacity 0) | Measured: previous button opacity 0 to 1, next 0.006 to 1, on hover of the image | Shown on focus-within | Disabled at the ends |
| Slider arrows and scrollbar | Arrows at both ends of a scrollbar row; scrollbar width is `100% - 4.25rem`; track #d3ccc4, thumb #231f20; thumb draggable | No measured change | Ring | `.swiper-button-lock` hides the row if all slides fit |
| Lookbook hotspot | 24 px disc in #fdfcfb at 40 percent, with a 6 px dot with a 0.6 px #231f20 border at 90 percent | Disc goes to 100 percent, dot fills #9b6a45 (0.2 s ease-in-out) | Standard ring | Active: dot filled #231f20, disc 100 percent, cursor default |
| Lookbook product slider | One product visible, max 328 px wide, 328:464 ratio (235:392 on phone), scrollbar below | n/a | n/a | Arrows only from 1025 |
| Footer column headings | Bold uppercase 14/18 | n/a | n/a | Phone: accordion rows with a chevron that rotates 180 degrees in 160 ms ease (source read) |
| Footer links and social links (`.link-underline`) | 10 to 14 px Light | 1 px underline grows from the left: `::after` `scaleX(0)` to `scaleX(1)`, origin flips from right to left, 0.18 s ease-out (source read) | Same via `:focus-visible` | n/a |
| Newsletter field | 42 px high, underline field, placeholder #6c645c | Subscribe button: fill changes over 0.18 s ease-in | Field border goes to #231f20 | Disabled "Skicka" text rgba(16,16,16,0.3) until a valid email; error text #dc0428 |
| Country selector | Button "Sverige" | Item hover fill #9b6a45 over 0.3 s ease-in-out | Ring | Opens a modal list |
| Skip link | Off-screen (`translate(10%, -100%)`) | n/a | Slides in over 0.3 s ease, white fill, 10 px text | n/a |
| Page loader bar | 4 px tall, #1e242a, fixed top, width 0 | n/a | n/a | Only used by add-to-cart: width to 100 percent over 0.5 s ease-in-out. Not a page preloader. |

## 7. Motion, section by section

**Smooth scroll.** None. Native browser scrolling. lenis is null, ScrollTrigger is absent, no `scroll-behavior` smoothing on the page. (measured, motion_gsap.json and probe.json) Scroll work is limited to one shared listener that batches callbacks with `requestAnimationFrame` (`passive: true`), used to update header classes and the announcement height. (source read, GlobalScrollListener)

**Loader / preloader.** There is no loading screen. The `.pageLoader` element is a 4 px top bar that only animates on add-to-cart. (source read) The page-transition overlay (`.pageTransition`) is set to `display: none` in the `.js` state. It is a fallback: if the browser cannot do View Transitions, links fade to `--pageTransitionColor` (#FFFFFF) over 250 ms linear on leave and back out over 100 ms ease-in-out on load. (source read, class Transition)

**Page transitions.** Chrome-style cross-document View Transitions:

| Property | Value | Evidence |
|---|---|---|
| Trigger | `@view-transition { navigation: auto }` | source read |
| Old page | `vt-fade-out` opacity 1 to 0, 0.2 s ease-out, both | source read |
| New page | `vt-fade-in` opacity 0 to 1, 0.2 s ease-in, both | source read |
| Group | duration 0 s | source read |
| Reduced motion | all three set to `animation: none` and 1 ms | source read |

**Scroll reveals (RevolutionAnimation class).** One system runs everything.

| Setting | Value | Evidence |
|---|---|---|
| Enabled | `window.theme.enableAnimations = true` | source read |
| Duration | `animationDuration: 425` ms | source read |
| Stagger | `animationBetweenElements: 225` ms x index | source read |
| Trigger | `IntersectionObserver`, threshold 0.15, no root margin, one observer per `[data-animation]` block, unobserved after first hit (fires once) | source read; probe.json lists the observers at t = 2511 ms |
| Start state | `.animatedContent { opacity: 0 }` | source read |
| Ease | Web Animations default, which is linear | source read |
| Fill | forwards | source read |
| A `MutationObserver` on body | Picks up new `[data-animation]` nodes added later (for example lazy-loaded slider) | source read |

Presets, all in the same function (from, to):

| Name | From | To | Duration |
|---|---|---|---|
| elementFadeIn | opacity 0 | opacity 1 | 425 ms |
| elementFromBottom | translateY(30px), opacity 0 | 0, 1 | 425 ms |
| elementFromTop | translateY(-30px), opacity 0 | 0, 1 | 425 ms |
| elementFromLeft | translateX(-30px), opacity 0 | 0, 1 | 425 ms |
| elementFromRight | translateX(30px), opacity 0 | 0, 1 | 425 ms |
| elementFromLeftBig / RightBig | translateX(-120px / 120px), opacity 0 | 0, 1 | 425 ms |
| elementScaleIn | scale(96%), opacity 0 | scale(100%), 1 | 850 ms (2 x duration) |
| elementScaleOut | scale(104%), opacity 0 | scale(100%), 1 | 850 ms (2 x duration) |

Which blocks use which preset on this page (source read):

| Block | Preset | Notes |
|---|---|---|
| Hero tile (4Mr8Cr) | elementFadeIn | Fades on load. **Fitted: start 73 ms, length 438 ms, fitted cubic-bezier 0.055, 0.001, 1, 1, rms 0.037 (accepted, under 0.05), nearest named curve linear.** Matches the source (425 ms linear). |
| First gallery (yzC7X6) | elementFadeIn | Same fit as hero (same sample window). |
| Second gallery (qtybRC) | elementFadeIn | When 15 percent visible. |
| Product slider wrapper | elementFadeIn | When 15 percent visible. |
| Product slider heading | elementFromLeft (30 px) | **Dead setting**: the element has no `.animatedContent` class and no child does, and the observer only watches elements with that class, so it never runs (inferred from the code). |
| The other three tile blocks (zyyM7b, A63KwB, cjGgJT) | elementFadeIn | When 15 percent visible. |
| Footer | elementFadeIn | When 15 percent visible. |
| Lookbook, strips | None | Shown at once. |
| Mobile menu drawer | elementFadeIn attribute | Drawer itself is animated by CSS (0.2 s). |

The stagger only shows if several observed nodes come into view in the same observer callback. Here each observer watches one block, so in practice the delay is 0. (inferred)

No per-frame maths: no `lerp`, `quickTo`, `getVelocity`, `clipPath` or pointer-follow code was found (bundle_index.json lists only rAF, pointermove, matchMedia, IntersectionObserver, mousemove and prefers-reduced-motion). `pointermove` is Swiper's own drag handling. There is no custom cursor (cursorFollowers is empty).

**Header.** Sticky by CSS (`position: sticky; top: 0`). At 25 px of scroll, `Header--Scrolled` is added. `header--ready` (added after two animation frames) enables `transition: background-color .2s ease`. Mega menu opens on hover or focus and locks page scroll. Height variables are recomputed 550 ms after scroll (`HEADER_TRANSITION_DURATION`). (source read)

**Announcement bar (Swiper, measured settings from data-swiper-settings).**

| Setting | Value |
|---|---|
| Direction / effect | vertical / fade with crossFade |
| Autoplay | delay 10000 ms, does not stop after interaction |
| Speed | 600 ms |
| Loop | true (with loopAdditionalSlides 2). The console warns twice that there are not enough slides for loop, so with one message it does not rotate. (inferred) |
| Mousewheel | true |

**Hero and tile grids.** Fade-in only, plus hover zoom (`transform: scale(1.05)`, 0.4 s ease) on the images at 1025 and up. (source read)

**Product slider (Swiper, measured settings).**

| Setting | Phone / tablet | 1025 and up |
|---|---|---|
| slidesPerView | 1.265 | 4 |
| spaceBetween | 6 | 16 |
| slidesOffsetBefore / After | 16 / 16 | 0 / 0 |
| rewind | true | true |
| Speed | Swiper default 300 ms (not set on this slider) | 300 ms |
| Ease | Swiper's built-in transition | same |
| Mousewheel | forceToAxis true | same |
| Scrollbar | draggable | draggable |
| Lazy loading | true | true |

**Product card image swiper (12 of them).** slidesPerView 1, spaceBetween 8, loop, nested, grabCursor, pagination clickable; at 1025 and up, touch and wheel are turned off (`simulateTouch: false`, `allowTouchMove: false`, `mousewheel: false`). The console warns loop is not possible when there are too few images. (measured)

**Lookbook.** Clicking a hotspot calls `slideTo(index)` on the product slider and marks the hotspot active. When the slider changes, the matching hotspot becomes active. Hotspot positions (measured from the HTML): (29 %, 38 %), (47 %, 56 %), (22 %, 78 %). Hotspot transitions are 0.2 s ease-in-out. (source read)

**Links.** instant.page prefetches a link 65 ms after the pointer rests on it (mouseover mode), skipping the first 1111 ms after a touch. (source read)

**Video capture.** load_pointer_scroll.webm exists with marks at loaded 9.1 s, circle 12.3 s, flick 13.9 s, scroll 19.4 s. It was not reviewed frame by frame (see not-verified).

## 8. 3D

None. No canvas element on the page (`canvases: 0`, three.json "no canvas on page"), no Three.js, no WebGL context, no shaders, no models. One 2D canvas of 200 x 50 px was created by a third-party script (probe.json contexts) and is not part of the design. (measured)

## 9. Responsive

**Breakpoints in the code (source read).**

| Source | Values |
|---|---|
| JavaScript `Responsive` class | phone: max 640. tablet: 641 to 1024. tablet_and_up: min 768. pocket: max 1024. lap_and_up: min 1025. desktop: min 1280. desktop_wide: min 1440. Current breakpoint = phone (max 640), pocket (max 1024), tablet (641 to 1024), desktop (min 1025). |
| CSS media queries | max 750 (and `width <= 750px`), max 767, 768 to 1024, min 768, 1025 to 1440, min 1025, max 1024, 1025 to 1280, 1280 to 1380, min 1440, min 1920, `hover: hover` with `pointer: fine`, `hover: none`, `prefers-reduced-motion: reduce`, `forced-colors: active` |

The single breakpoint that matters for layout is **1025**. Everything below it is the "pocket" layout.

**What changes at 1025 (source read from section CSS and inline styles).**

| Item | 1024 and below | 1025 and up |
|---|---|---|
| Header | Hamburger left, search, logo centre, account and bag right; mobile drawer | Text nav at left, mega menu, side padding 40 px |
| Tile grid | One column (`repeat(1, 1fr)`), each tile full width | `repeat(auto-fit, minmax(324px, 1fr))`, no gap |
| Gallery grid | 2 columns, gap .375rem (6 px) | 2 columns, gap 1rem (16 px) |
| Caption padding | 1rem (tile), .625rem (gallery) | 1.25rem |
| Tile hover zoom | Off | On |
| Product slider | 1.265 slides, 6 px gap, 16 px offset | 4 slides, 16 px gap, no offset, arrows shown |
| Card image swiper | Swipe on | Swipe off, arrows on hover |
| Lookbook | Stacked, gap 2rem, slider 235:392 | Side by side, gap 3rem, slider 328:464 |
| Strip headline padding | 16 px | 0 |

**Fresh loads (responsive.json, measured).**

| Width | Page height | Hamburger flag | Horizontal overflow | Pin spacers |
|---|---|---|---|---|
| 360 | 7709 | true | no | 0 |
| 390 | 8171 | true | no | 0 |
| 768 | 14141 | true | no | 0 |
| 820 | 14972 | true | no | 0 |
| 1024 | 18233 | true | no | 0 |
| 1280 | 6297 | true | no | 0 |
| 1440 | 6154 | true | no | 0 |
| 1920 | 7378 | true | no | 0 |

Reading the heights: from 768 to 1024 the page is very tall because every photo tile becomes a full-width single column (source read: `repeat(1, 1fr)` at 1024 and below). The step back down at 1280 is where the desktop grid takes over. 1280 is 143 px taller than 1440: with `minmax(324px, 1fr)`, four tiles need 1296 px, so at 1280 the brand strip should wrap to 3 + 1 (inferred from CSS and the height, not seen in a screenshot). At 1920 the full-bleed images keep scaling, so the page grows to 7378 (inferred). Note: the "hamburger true" and "0 visible nav links" flags are the tool's own detector and are wrong at 1440, where the screenshots clearly show the text nav. The tool's `breakpointsFound` list is empty and "no layout change found" is a tool limit; the height table above shows the change plainly.

**Live resize (measured).**

| Step | Width | Height |
|---|---|---|
| 1 | 1440 | 6154 |
| 2 | 1024 | 18383 |
| 3 | 800 | 14802 |
| 4 | 760 | 14162 |
| 5 | 390 | 8321 |
| 6 | 760 | 14162 |
| 7 | 800 | 14802 |
| 8 | 1440 | 6154 |

Going out and back returns exactly to the starting heights (760 = 14162 both ways, 800 = 14802 both ways, 1440 = 6154 both ways), so the layout has no resize hysteresis. Live heights differ slightly from fresh loads at the same size (1024: 18383 vs 18233; 390: 8321 vs 8171). Cause unclear, probably lazy images settling. No horizontal overflow at any width.

**Reduced motion.** Measured: page height is unchanged (6154) and the top of the page renders the same (reduced_motion_top.png). Source read: View Transitions are switched off; the mega menu link arrow loses its 0.2 s fade; lookbook hotspot fades are switched off; autoplay videos with `data-respect-reduced-motion` are paused; smooth `scrollTo` falls back to instant. **The scroll fade-ins are not gated**: RevolutionAnimation has no reduced-motion check, so the 425 ms fades still run (source read: no `matchMedia` in that class). The announcement autoplay is also not gated (unclear).

## 10. Accessibility, meta and extras

| Item | Finding | Evidence |
|---|---|---|
| Language | `lang="sv"` | measured |
| Landmarks | header 1, main 1, footer 1, **nav 0** | measured |
| Headings | No H1. Found: H3 cart, H3 search x3, H2 "Made by Ströms". The section strips are not headings. | measured |
| Skip link | "Hoppa till innehåll" to #MainContent, slides in on focus | measured / source read |
| Alt text | 138 images, 0 without an alt attribute, 93 with empty alt (decorative tiles), product images carry names | measured |
| aria-hidden | 196 elements | measured |
| Keyboard focus | 1 px ring #1e242a, shown only after the first Tab press | measured / source read |
| Mega menu keys | Arrows, Escape, focus return | source read |
| Dark mode | None. No `prefers-color-scheme` rules; body background stays transparent on a dark scheme | measured |
| Forced colours | A `forced-colors: active` media query exists | source read |
| Contrast | see below | measured |
| Meta | `<meta name="viewport" content="width=device-width,initial-scale=1">`, description (Swedish, mentions 1 to 3 days delivery), canonical https://stroms.com/pages/man, Open Graph title, description, url, type, site_name (no og:image found, no Twitter card), empty `theme-color`, favicon STROMS-FAVICON.png, 3 JSON-LD blocks | measured (probe.json meta) and source read |
| Title | "Ströms Man - Herr - Kläder & accessoarer - Tidlös stil | Ströms" | measured |
| Cookie banner | `cookie-banner-stacked-layout` (Shopify consent) | measured |
| Console | 403 and 404 on some resources, Shopify iframe blocked by frame-ancestors, loop warnings, Meta Pixel currency warning. No script errors. | measured |
| Bot protection | Some routes returned 429 "Just a moment" (a challenge page) or 500 or 503 to the crawler | measured (states.json) |

Contrast (a11y.json, ratios measured on the theme colour pairs, so some pairs are combinations the page does not actually use):

| Text | On | Ratio | Verdict |
|---|---|---|---|
| #231f20 | #fdfcfb | 15.91 | Pass (main body) |
| #231f20 | #efe9e3 | 13.53 | Pass (announcement bar) |
| #6c645c | #fdfcfb | 5.67 | Pass (sizes) |
| #6c645c | #efe9e3 | 4.82 | Pass |
| #a39c94 | #fdfcfb | 2.65 | **Fail** (unavailable sizes, struck prices, disabled) |
| #a39c94 | #efe9e3 | 2.25 | **Fail** |
| #fdfcfb | #efe9e3 | 1.18 | **Fail** (`--button-content` on `--button-bg` tokens; not seen used on the page) |
| #fdfcfb | #000000 | 20.49 | Pass |
| White caption text on photos | not measured | | Risk: no scrim, see section 4 |

Other extras: instant.page prefetch; lazy images (`loading="lazy"` on 40), 6 `fetchpriority="high"` preloads for first-screen images; `font-display: swap` on all four font faces; the section stylesheets load per section as `<link>` tags.

## 11. Page weight and cost

All figures uncompressed (weight.json), cloud connection.

| Type | Files | KB |
|---|---|---|
| Document | 6 | 83 |
| Stylesheet | 19 | 40 |
| Script | 44 | 1133 |
| Font | 2 | 75 |
| Image | 53 | 5135 |
| Fetch | 22 | 15 |
| Other | 64 | 747 |
| Ping | 20 | 0 |
| XHR | 1 | 0 |
| Total | 231 requests | about 7228 |

The total is my sum of the rows above.

| Timing (cloud, slow) | ms |
|---|---|
| First paint / first contentful paint | 3452 |
| DOMContentLoaded | 6221 |
| Load | 6765 |
| Frame rate at top of page | 61 fps (no WebGL, so not limited) |

Largest files: herr-800-business-formal-1.jpg 608 KB, a Barbour jacket image 422 KB, herr-800-business-casual-2.jpg 354 KB, then a run of 170 to 330 KB tile photos, then Google tag scripts (188, 162, 162 KB) and a Shopify checkout hydrate script (207 KB). Images are 71 percent of the weight. The captured asset folder holds 93 files (89 JPG, 4 PNG, 11 MB on disk). Theme CSS is small (40 KB across 19 files, per-section loading). Theme JS: global.min.js is 345,692 bytes and libs.min.js is 161,374 bytes on disk. (measured / source read)

## 12. What is worth porting, in order

1. Zero-gap photo grid with fixed aspect ratios (24:10 hero, 5:4 and 1:1 pairs, 4:5 strips) and a 5 percent hover zoom. Biggest visual return for the least code.
2. The colour and type discipline: one paper colour (#fdfcfb), one ink (#231f20), three greys, one warm accent (#9b6a45), one light grotesque at 14 px. No shadows, no gradients.
3. Product card with hover reveal and 4:5 images (sizes replace the name, dots and save icon fade in). Copy the behaviour, but fix the stray blue pager and add a text label for the save icon.
4. 4-up product slider with a draggable hairline scrollbar and arrows.
5. Hairline underline draw on header links and icons (0.3 s, one custom curve).
6. Fade-ins on scroll (IntersectionObserver at 0.15, 425 ms linear) and 200 ms page fades through View Transitions. Cheap polish; add a reduced-motion switch that this site lacks.
7. Shoppable lookbook with three hotspots and a one-product slider.
8. Mega menu with keyboard support. Only after the rest, because it is the costliest.
9. Sticky 50 px header with a 25 px scroll flag.

Do not copy: the missing scrim under photo captions, the blue pager, the missing H1 and nav landmark, the low-contrast greys on unavailable sizes, the ungated fades.

### Why this reference matters for a leather-bag store

- **Zero-gap 4:5 photo grid (sections 3 and 6).** Bags read best as tall, tactile close-ups. The grid shows how to run 4:5 tiles edge to edge with a small caption and a slow zoom on hover, without card borders or shadows.
- **Restrained neutral palette with one warm accent (section 4).** Paper, ink, three greys and a leather-brown accent (#9b6a45 here) let product photos carry the colour. That suits leather goods, where the material is the hero. Use the accent only for hover and active states.
- **One light grotesque at small sizes, no fluid type (section 5).** A single family in two weights at 14 px and 12 px keeps the page quiet and premium, and is cheap to load (75 KB for both files). Pick free lookalikes from recipes.md.
- **Product card that hides its detail until asked (section 6).** Sizes, colour dots and a save icon appear on hover or focus, with the same on keyboard focus and always visible on touch. For bags, swap sizes for colour and strap options, and keep the 4:5 image with a hairline pager.
- **Motion kept to fades and one underline (section 7).** 425 ms linear fades, a 200 ms page fade and a 0.3 s underline draw give polish with no scroll-jacking, which keeps the site fast and accessible. Add a reduced-motion switch and a scrim under captions to go one step better than this site (sections 9 and 10).
