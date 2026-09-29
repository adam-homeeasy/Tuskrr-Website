# Teardown: UNIMATIC Impronte Collection page

## 1 Header

| Item | Value |
|---|---|
| Site | https://www.unimaticwatches.com/pages/impronte-collection |
| Captured | 2026-09-29, cloud Chromium (headless), 1440x900 desktop and 390x844 phone |
| Fresh loads at 8 widths | 360, 390, 768, 820, 1024, 1280, 1440, 1920 |
| Live resize path | 1440, 1024, 800, 760, 390, 760, 800, 1440 |
| Page height | 5801 px at 1440, 5684 px at 390 |
| Screens | 18 desktop shots, 8 phone shots, 4 contact sheets, 24 state files, 1 video (not viewable by this pass) |

Evidence labels used on every value:

- **measured**: read from the running page (computed styles, layout boxes, hover diffs, pixel samples).
- **source read**: copied from shipped CSS, HTML or JS in 04-code.
- **fitted**: worked out from frame samples. Only one thing was sampled (the accent dot). Its fit is not trusted, see section 7.
- **inferred**: read from screenshots or by reasoning. The reason is given each time.

**Read this first: the brief and the page do not match.** The task notes expected GSAP, Lenis, Barba page transitions, a parallax keyframe in use, tickers and filmstrips on this page. The capture shows none of that at work:

- `gsap`, `ScrollTrigger`, `Lenis`, `Barba`, `swup`, `THREE`, `Webflow`, `Framer` are all `undefined` on the page (measured, probe.json globals). motion_gsap.json holds 0 tweens, 0 timelines, 0 triggers, no Lenis. No canvas is on the page. View transitions: 0.
- The CSS variables `--filmstrip-speed`, `--ease-scroll`, `--ticker-speed`, `--reveal-speed`, `--ease-reveal`, `--cat-hover-speed` and the `pdp-edi-parallasse` keyframe exist in the shared theme CSS, but the components that use them (`pdp-feature`, `pdp-ticker`, `pdp-notify`, `prodrow`, `pdp-edi`, `collection-cats`) are not in this page's rendered HTML (source read, grep of index.rendered.html). They belong to product and collection pages. Exact values are still listed in section 7 so a builder has them.
- "Barba" only matched the country name Barbados in the footer select.

So this page is a nearly static Shopify page: native scroll, CSS sticky, CSS transitions, one CSS blink loop, and a few small web components. That is the honest spec below.

## 2 Summary

**What it is.** The launch page for the Impronte Collection of UNIMATIC Watches (Milan): ten limited-edition references (Modello Uno, Tre, Quattro) in two colourways each (source read, HTML). Page flow: photo hero, a product slider, a photo band with a glass caption card, three stacking "Highlights" cards, three reassurance columns, a photo footer with a newsletter card, and a footer with a live Milan clock and weather.

**Built with.**

| Layer | What | Evidence |
|---|---|---|
| Platform | Shopify storefront, custom theme `unimaticwatches/main`, schema name "Unimatich", schema version 1.0.0, not a store theme (`theme_store_id` null) | source read |
| Theme code | Hand-written web components (`slider-component`, cart drawer, header script) built on a shared `Component` base class loaded through an import map (`@theme/component`, `@theme/morph`, `@theme/utilities`). Native `<dialog>` for drawers. No framework | source read |
| Motion libraries | None. No GSAP, Lenis, Barba, Three, Lottie | measured |
| Smooth scroll | None, native browser scroll | measured |
| Page transitions | None, normal full page loads | measured |
| Third-party scripts | Klaviyo (newsletter form, reviews, analytics), Wishlist Engine app, Globo form builder ("Powerful Contact Form Builder" console banner), a page-lock app (`wlm`, passcode form hidden), Shopify web pixels, trekkie, Shop Pay loader, Google tag (two ids seen), Shopify perf-kit 3.9.4 | source read. Only perf-kit shows a version number. Other versions are content hashes |
| Live data | Footer weather from the open-meteo API (Milan, 45.4642, 9.19) | source read |
| Analytics detail | A 0.5-threshold IntersectionObserver on the product cards belongs to the Shopify web pixel (impression tracking), not to the design | source read |

**Fonts and licence.**

| Font | Weights loaded | Where it comes from | Licence status |
|---|---|---|---|
| Helvetica Neue | 400 and 700 | Self-hosted woff2 in the theme assets | PAID. Commercial typeface (Linotype/Monotype). Files not included in this pack. Whether UNIMATIC holds a web licence is unknown |
| JetBrains Mono | 400 loaded, 700 declared but unloaded | Self-hosted woff2, with a fonts.gstatic.com copy also requested | FREE (open source, SIL OFL). Files not included |
| IBM Plex Mono | many weights, all "unloaded" | Declared by the Klaviyo form CSS, never fetched on this page | FREE (OFL). Ignore |

**Page height.** 5801 px at 1440 wide (measured).

**Top 5 signature effects, ranked by how much they add.**

| Rank | Effect | Why it matters | Rebuild cost |
|---|---|---|---|
| 1 | Frosted glass panels over photography: white at 60 percent plus backdrop blur, at 15, 30 and 60 px depending on size (nav pills, mega menu, caption card, highlight cards, newsletter) | It is the whole visual voice. UI floats over the watch photos and never boxes them in | Low in CSS. Medium in art direction, because legibility depends on the photo behind |
| 2 | Stacking "Highlights" cards: three viewport-tall entries that each stick at 60 px and are covered by the next as you scroll | The longest section of the page (2573 px) reads as a deck of cards with zero JavaScript | Low. Pure `position: sticky` |
| 3 | Dark photo band, light page, dark photo band rhythm, with a glass caption card that sticks inside the second band | Gives the long scroll pacing and lets the product packshots sit on calm #F6F6F6 | Low to medium. Needs good macro photography |
| 4 | Product card packshot to wrist-shot swap on hover, with tiny mono spec tags and hairline-divided rows | Adds life to a static grid, 220 ms cross-fade, no layout shift | Low. Two stacked images and an opacity transition |
| 5 | Type system: bold Helvetica with tight tracking against uppercase JetBrains Mono labels, plus a lime accent dot that blinks with a glow | The dot is the only continuous animation and the only colour on the site | Low. One keyframe and a licensed neo-grotesque plus a free mono |

## 3 Page map

Positions are measured at 1440x900 (scroll-map.json, map_desktop-1440.json). The header is fixed, so it takes no height in flow.

| # | Section | Top to bottom (px) | Height | Background | Pinned or sticky | What it is |
|---|---|---|---|---|---|---|
| 0 | Header: logo, nav pill, actions pill | fixed, pill at top 16, height 36 | overlay | glass white 60 percent | Fixed | Logo uses `mix-blend-mode: difference`. Nav pill 533 px min width, actions pill 330 px |
| 1 | Hero (`page-hero`) | 0 to 532 | 532 | Photo, plus flat #000 scrim at 0.4 opacity | Not pinned | Breadcrumb at top 69, headline block at top 99, 330 px wide, left 24 |
| 2 | Product carousel ("Meet the collection") | 532 to 1255 | 723 | #F6F6F6 | Not pinned | Scroll-snap slider, 10 cards, 4 visible plus a peek of the fifth |
| 3 | Media band | 1255 to 2109 | 854 | Photo (ratio 1440 / 854) | Caption card is sticky inside the band | Glass card, 349 px wide, sticks at 64 px |
| 4 | About timeline ("Highlights") | 2109 to 4682 | 2573 | #F6F6F6 | Each entry is sticky at 60 px | Three full-height stacked cards, image left, glass card right |
| 5 | Collection USP | 4682 to 4927 | 245 | #F6F6F6 | No | Hairline rule plus 3 reassurance columns |
| 6 | Footer banner | 4927 to 5365 | 438 | #000 with photo | No | Photo with the newsletter glass card at bottom right |
| 7 | Footer | 5365 to 5642 | 277 | #F6F6F6 | No | 4 link columns |
| 8 | Footer utilities bar | 5642 to 5801 | 159 (derived) | #F6F6F6 plus D9D9D9 at 20 percent | No | Milan clock, moon and weather, legal links, country select, payment icons |

Section 8 height is derived from the page height (5801) minus the footer end (5642), and matches `min-height: 15.9rem` in source. Phone equivalents (measured, 390 wide): hero 0 to 421, carousel 421 to 973, media band 973 to 1585, timeline 1585 to 3658, USP 3658 to 4127, footer banner 4127 to 5024 (897 tall), footer 5024 to 5448, utilities to 5684.

**Colour rhythm, read from pixel data (map_desktop-1440.json).** Each row samples the left edge pixel and the centre pixel at 10, 25, 50, 75 and 97 percent of the viewport height.

| Scroll Y | What the samples show |
|---|---|
| 0 | Edge #000000, #010101, #020202 (hero) then #f6f6f6 at 75 and 97 percent (carousel starts at 532). Centre at 10 percent #151619 (dark photo) |
| 300 | Dark to #f6f6f6 by the 50 percent line |
| 600 | #f6f6f6 down to the 50 percent line, then #000000 at 75 percent (media band begins at 1255) |
| 900 to 1200 | #000000 through the whole viewport, centre swings between #000000 and #a8a8ac (photo highlights) |
| 1500 | Edge turns to #f6f6f6 at 75 percent (timeline begins at 2109) |
| 1800 to 4200 | Edge stays #f6f6f6 the whole time. The centre pixel moves through photo greys (#292929, #6f6f6d, #dddddd, #484848, #42414a), which is the stacked photo cards on the light canvas |
| 4500 | Edge #535257 at 50 percent, then photo tones (footer banner is a mid-grey macro, not pure black) |
| 4800 to 4901 | Edge #59575f, #9c9ba2, #5b5a5f (photo), then #f6f6f6 and #f0f0f0 at the bottom (footer) |

So the rhythm is: dark hero, light shelf, dark photo band, a long light stretch carrying mid-grey photo cards, a mid-grey photo footer, then a light footer. Only two flat colours carry the page (#000 and #F6F6F6); the rest is photography.

## 4 Colours

All values are source read from the `:root` block, and the counts are measured from computed styles (tokens.json).

| Token | Value | Used for |
|---|---|---|
| `--color-bg` and `--color-surface-page` | #F6F6F6 | Page background, timeline, footer, carousel section, skip-link background |
| `--color-ink` | #000000 | Body text, primary button, slider control hover fill, focus outline |
| `--color-accent` | #AFFF00 | The blinking dot only (3 uses) |
| `--color-white` | #FFFFFF | Text on black, hero copy base |
| `--color-media` | #D9D9D9 | Placeholder behind media (`media-frame`), and footer utilities bar at 20 percent |
| `--color-tag-ink` | #222222 | Product tags (at opacity .3), tag chips |
| `--color-ink-70` | ink at 70 percent | Most text (116 uses), card titles, footer links |
| `--color-ink-50` | ink at 50 percent | USP text, breadcrumb (light pages), section labels |
| `--color-ink-40` | ink at 40 percent | Timeline year chip text |
| `--color-ink-30` | ink at 30 percent | Slider count "4/10", ghost button outline |
| `--color-hairline` | ink at 15 percent | Dividers in product cards, USP rule, timeline and footer rules |
| `--color-border` | ink at 20 percent | Slider control border, pill outlines |
| `--color-surface` | ink at 5 percent | Product card media background (13 uses) |
| `--color-scrim` | ink at 60 percent | Behind cart drawer and mobile menu |
| `--color-scrim-soft` | ink at 35 percent | Behind an open desktop mega menu (fades in 220 ms) |
| `--color-white-70` | white at 70 percent | Hero headline, hero body, hero breadcrumb |
| `--color-white-54` | white at 54 percent | Hero widgets (not used on this page) |
| `--color-footer-bar` | #D9D9D9 at 20 percent | Footer utilities bar |
| Glass base | #FFFFFF | Glass at 80, 60, 40, 30, 10 percent (`--color-glass-80/60/40/30/10`) |
| Hero scrim | #000000 at opacity 0.4 | Inline style on the hero scrim div |
| Swatches | #292929 (black) and #DDDEDF (aluminium) | Product card colour dots, 8 px |
| Text alphas on the media band | heading and body at .54 opacity, eyebrow at .3, tag at #222 | Caption card copy |

**Glow and gradient recipes.**

- Accent dot glow (source read): `box-shadow: 0 0 6px 2px color-mix(in srgb, #AFFF00 70%, transparent)`, 7 px circle, `animation: blink 0.8s ease-in-out infinite`.
- Glass recipe (source read): `background: rgba(255,255,255,.6); backdrop-filter: blur(30px); border-radius: 8px`. Variants (measured counts): blur 15 px on the nav pills (10 uses, half of 30), blur 30 px on 17 elements (mega menu, buttons, drawers, inputs), blur 60 px on the media band card (double), 2 px on tiny tags (30 divided by 15).
- There are no gradients on the page (none in tokens.json). The dark look on photos is a flat 40 percent black scrim on the hero only.
- Radii (measured): 4 px (controls, chips), 6 px (small pills, buttons, inputs), 8 px (large pills, cards, media), 50 percent (dots).

## 5 Type

Root font size is 10px, so 1rem is 10px (source read). There is no `clamp()` anywhere in the shipped CSS. Sizes are fixed tokens, and the phone change is one media query.

**Desktop scale (1440).**

| Role | Class | Font | Size | Line height | Tracking | Notes |
|---|---|---|---|---|---|---|
| Title L | `t-title-l` | Helvetica Neue 700 | 24px (2.4rem, no clamp) | 1.221, measured 29.304px | -0.02em, measured -0.48px | Hero headline, media band heading |
| Subtitle | `t-subtitle` | Helvetica Neue 700 | 16px (1.6rem) | 1.221, measured 19.536px | -0.02em, measured -0.32px | "Meet the collection", "Highlights", card titles, USP titles |
| Body | `t-body` | Helvetica Neue 400 | 12px (1.2rem) | 1.221, measured 14.652px | 0 | Hero body, timeline body, USP text, header action labels |
| Product row | `t-product` | Helvetica Neue 400 | 12px | 2.6rem (26px fixed) | 0 | Name, price, subtitle, edition in cards |
| Mono | `t-mono` | JetBrains Mono 400 | 12px | 1.32, measured 15.84px | 0 | Nav links, timeline year chip. Uppercase |
| Eyebrow | `t-eyebrow` | JetBrains Mono 400 | 10px (1.0rem) | 1.32, measured 13.2px | 0 | Breadcrumb, slider controls, count, product tags, footer legal. Uppercase (291 uses) |
| Tag | `t-tag` | JetBrains Mono 400 | 8px (0.8rem) | 1.32 | 0 | Uppercase, `font-feature-settings: "zero" 1` (slashed zero). Media band tag uses the eyebrow size |
| Newsletter label | Klaviyo override | JetBrains Mono 400 | 10px | normal | 0 | Uppercase |
| Newsletter button | Klaviyo override | Helvetica Neue 400 | 12px | normal | 0 | White on black at 70 percent |

The team measured `normal` line height at 1.1875 for Helvetica Neue and 1.29 for the mono in Chrome, then fixed the tokens at 1.221 and 1.32 to match the Figma (source read, code comment). Copy this: set line heights explicitly.

**Phone differences (390, from map_phone-390.json and the `@media screen and (max-width: 767px)` root block).**

| Role | Desktop | Phone | Evidence |
|---|---|---|---|
| Title L | 24px, 29.304 line, -0.48px | 18px, 21.978 line, -0.36px | measured and source read (`--fs-title-l: 1.8rem`) |
| Subtitle | 16px, 19.536 line, -0.32px | 14px, 17.094 line, -0.28px | measured and source read (`--fs-subtitle: 1.4rem`) |
| Product tag | 10px, 13.2 line | 8px, 10.56 line | measured (`--fs-tag`) |
| Nav, body, product rows, eyebrow | unchanged | unchanged | measured |
| Page margin | 24px | 12px | source read (`--page-margin`) |

The site spelling of nav labels is uppercase by CSS. In the DOM they are sentence case ("New in"), so the text stays accessible and copyable.

## 6 Components

Transition default is `--transition: 220ms ease` (source read). Hover diffs come from pointer.json (measured) and are marked. Anything without a measured diff is labelled source read.

**Header nav pill (desktop, 1100 px and up).**

| State | What happens |
|---|---|
| Default | Glass 60 percent, blur 15 px, radius 8, padding 10px 20px, mono 12px uppercase, min width 533px. Sits at top 16 |
| Hover on a link | Opacity stays 1, and a 4 px-radius chip fades in behind the label (`::before`, inset -7px -12px, glass 30 percent, 220 ms). Source read. The probe recorded no property change on the link itself, which agrees |
| Expanded (click, `aria-expanded=true`) | Chip turns glass 60 percent. Mega menu panel fades in 220 ms (`display` uses `allow-discrete`). A #000 35 percent scrim fades in over the page (`menu-scrim`, 220 ms). Source read. See screenshot open_00_WATCHES.png |
| Switching between panels | Transition is removed (`is-switching`), so the swap is instant. Source read |
| Close | Escape, pointer down outside, any scroll, or re-click the trigger. Focus returns to the trigger if it was inside. Source read (header.js) |
| Focus | Global rule: 2px solid #000 outline, 2px offset, plus a 4px #F6F6F6 ring. Measured on `a.nav-pill__link` |

**Header actions pill (Search, Account, Wishlist, Cart).** Glass 60, blur 15, radius 6, min width 330px. Hover: opacity 1 to 0.6 (measured, cart link). The green dot next to CART keeps blinking (its opacity read 0.68 to 0.25 in the hover sample, which is the blink loop, not a hover effect).

**Logo.** Fixed, top 24, left 24, height 19px, `mix-blend-mode: difference`, z-index 120 (source read). It reads white on dark photos and dark on the light page. No hover change (measured).

**Mega menu dropdown.** Grid of 15.1rem, 53.3rem, 1fr, 33rem. Dropdown column 2 has padding 8px, radius 8, glass 60 with blur 30. Rows: mono uppercase, padding 10px 12px, radius 6, ink 70 percent. Row hover or focus: background glass 40 percent and ink at 100 percent, 220 ms (source read). Footer button "All watches" is a primary block button: black, white 19px dot, blur 30. A promo slider component exists in JS (fades slides in 220 ms, dots, pauses on hover and focus, off with reduced motion) but no `<promo-slider>` element is in this page's HTML.

**Mobile header and menu (1099 px and down).** Two pills (Menu, Cart) at top max(safe area, 64px). On scroll down past 120 px with a move of at least 8 px they slide up (`translateY(-200%)`) and fade in 220 ms, and come back on scroll up. The logo fades out with them. Menu opens a full-screen `<dialog>` with drill-down views, breadcrumb trail and Back button. All source read.

**Hero (`page-hero`).** Full-bleed image, `object-fit: cover`, 40 percent black scrim, breadcrumb (mono, white 70 percent), headline (title L, white 70 percent), body (12px). No states. The headline is a `<p>` inside an `<h1>`, which is invalid HTML (source read).

**Slider head and controls.**

| State | Look |
|---|---|
| Default | 4px radius, 1px border ink 20 percent, padding 3px 14px, mono 10px uppercase |
| Hover | Fill #000, text #FFF, 220 ms (measured on "View all": background transparent to #000, colour #000 to #FFF) |
| Disabled | Opacity .35, no pointer events. "Prev" is disabled at the start |
| Focus | Global outline |
| Count | "4/10" at ink 30 percent, updated on scroll |

Layout: a 4-column grid, title in column 1, count in 2, "View all" in 3, Prev and Next in column 4 (start and end aligned). Below 768 the head becomes a flex row and Prev/Next stay visible.

**Product card.**

| State | Look |
|---|---|
| Default | Media box aspect 330 by 500, radius 8, ink 5 percent background. Two tags top left (mono 10px, #222 at opacity .3, padding 2px 8px). Packshot image shown. Info below: name and price row, hairline, subtitle row, hairline, edition text and two swatches. Rows are 26px high |
| Hover (768 and up) | Packshot opacity 1 to 0 and wrist shot 0 to 1, 220 ms ease (measured on `article.product-card` and `a.product-card__media`) |
| Hover on swatches | The swap is suppressed while the pointer is over the swatch group |
| Name link hover | No change (measured) |
| Swatch | 8px circle. Colours #292929 and #DDDEDF. Current colour has a 1px outline ink 30 percent at 1.5px offset. Hover on the link swatch gives the same outline. Hover colour swap script (`card-swatch.js`) exists but these swatches are plain links to the sibling product |
| Phone (767 and down) | Card width 293px, media ratio 293 by 344, both images become a swipe strip with scroll snap, no hover swap |
| Focus | Global outline |

**Media band caption card (`glass`).** Sticks at 64px inside the band, 349px wide, top offset 32px, padding 12px, glass 60 with blur 60, radius 8. Contents: tag chip (glass 40, mono 10px, #222), eyebrow line (subtitle at .3 opacity), heading (title L at ink 70 and .54 opacity), note (mono 10px uppercase, .54). Static, no states.

**Timeline entry.** Grid 982fr 394fr, gap 16, padding 16 and 24. Height `min(824px, 100svh - 60px)`. Image is radius 8, `object-position: 50% 38%`. Card is glass 60, padding 12, min height 264, holds a year chip (mono 12px, glass 40, text ink 40 percent), a subtitle title and a body at .54 opacity. Phone: one column, static, image ratio 351 by 358 below the card.

**USP column.** Centre-aligned title (subtitle, ink 70) and text (body, ink 50), 18px gap. Phone: stacked with hairlines between.

**Newsletter card (Klaviyo form restyled).** 8px padding, radius 8, white 60 percent, blur 30. Inputs 39px high, radius 6, white 30 percent, placeholder at 40 percent. Button: black at 70 percent, hover to #000 (measured, `background: rgba(0,0,0,0.7)` to `rgb(0,0,0)`), with a white dot. The Klaviyo panel is styled through `!important` overrides (source read).

**Footer.** Four columns (Watches, Brand, Service, Social). Titles 53px tall, ink 70 percent. Links plain, no hover diff measured (`a "Classic"` showed none). Utilities bar: uppercase mono at ink 70 percent, a live clock, a moon phase, a weather line, country select, payment icons at 22px, credit "Design & dev by: Evolve" at .4 opacity.

**Cart drawer (dialog, hidden).** Fixed, top 60, right 24, 330px wide (full width below 768), glass 60 with blur 30, radius 8. Opens with opacity 0 to 1 and `translateY(-8px)` to 0 over 220 ms, with a #000 60 percent scrim behind. Escape or outside click closes it. Cart link clicks are intercepted to toggle it. Source read.

**Skip link.** `a.skip-to-content` hidden until focus, then fixed at 8px, 8px with bg #F6F6F6.

## 7 Motion, section by section

**Summary of what exists.** There are no GSAP tweens, no ScrollTrigger, no pins by script, no scrub, no snap by library, no cursor followers (pointer.json: 0), no marquee running on this page, no loader. Everything below is CSS or small vanilla JS.

**Smooth scroll setup.** None. Native scroll (Lenis is `undefined`, scroll-map `lenis: null`, motion_gsap `lenis: null`). Measured.

**Loader and preloader.** None in the DOM. On load, the only moving element found in 35 candidates is the accent dot (motion_sampled.json loadSequence). Cloud timings for reference (measured, slower than a real connection): first paint 2988 ms, first contentful paint 3188 ms, DOMContentLoaded 3938 ms, load 6000 ms. The hero image loads eagerly with `fetchpriority="high"`. Other images use `loading="lazy"`.

**Page transitions.** None. Links do normal navigation. No Barba, no swup, no View Transitions API (`viewTransitions: 0`). The morph helper in morph.js only patches cart and section HTML after fetches.

**Accent dot blink (all sections).**

| Property | Value | Evidence |
|---|---|---|
| Keyframes | `0%, 100% { opacity: 1 } 50% { opacity: .25 }` | source read |
| Duration | 0.8s (`--blink-speed`) | source read |
| Easing | `ease-in-out`, infinite | source read |
| Reduced motion | `animation: none` | source read |
| Sampled range | Opacity min about 0.25, max about 1.0, minimum reached at roughly 800 ms spacing across samples | measured |

The frame fit in motion.json (effects fx001 to fx014) reports `settled: false` and durations of 1600 to 4513 ms with no rms error. Those are loop artefacts, so they are treated as **inferred, not trusted**. Use the source values.

**Hero.** No motion. Static image, scrim and text.

**Product carousel.**

| Behaviour | Detail | Evidence |
|---|---|---|
| Scroll mechanism | Native horizontal scroll: `overflow-x: auto; scroll-snap-type: x mandatory; scroll-behavior: smooth; scrollbar-width: none`. Cards `scroll-snap-align: start` | source read |
| Card width | `--col = (min(100vw,1920px) - 2*24 - 3*24) / 4` = 330px at 1440, gap 12px (24px when fewer than 5 cards) | source read, and 330 measured from screenshot spacing (inferred) |
| Prev and Next | `scrollBy({ left: step * dir, behavior: smooth })` where `step = cells[1].offsetLeft - cells[0].offsetLeft` (342px at 1440). Reduced motion uses `behavior: auto` | source read |
| Button disabled | Prev disabled when `abs(scrollLeft) <= 8`. Next disabled when `scrollLeft >= scrollWidth - clientWidth - 8`. If a disabled button had focus, focus jumps to its twin | source read |
| Counter | `perView = max(1, floor((clientWidth + gap) / step))`, `current = min(cells, round(scrollLeft / step) + perView)`, text `current + "/" + total`. At load: 4/10 | source read, matches measured "4/10" |
| Update timing | Scroll and ResizeObserver events go through one `requestAnimationFrame` gate | source read |
| Keyboard | When Prev/Next are hidden (phone) the track gets `tabindex=0`, `role=group`, and `aria-labelledby` pointing at the heading | source read |

There is no drag, no inertia script, no lerp.

**Media band.** No motion except the caption card's `position: sticky; top: 64px` inside an overlay that ends 64px above the band bottom. The card starts 32px down (`--milan-card-offset`). Between 768 and 1099 the sticky top becomes `max(safe-area-top, 64px) + 40px`. Phone: card offset 254px (default of `--milan-card-offset-mobile`, not overridden). Source read.

**About timeline (stacking cards).**

| Item | Value | Evidence |
|---|---|---|
| Mechanism | `.about-timeline__stack > .shopify-block { position: sticky; top: var(--about-timeline-top) }` | source read |
| Sticky top | 60px = `--drawer-top-base` = 1.6 + 2 x 1.0 + 1.6 + 0.8 rem | source read (derived from tokens) |
| Entry height | `min(824px, 100svh - 60px)`, so 824px at 900 tall viewport (840 available) | source read |
| Cover effect | Each entry has an opaque #F6F6F6 background, so the next one slides over the previous | source read |
| Pin, snap, scrub, once | None. It is CSS sticky only. No scroll snap on the page, no scrubbed tween, nothing fires once | measured (0 triggers) |
| Tablet | Sticky top `max(safe-area, 64px) + 40px` from 768 to 1099 | source read |
| Phone | `position: static`, cards just stack in flow | source read |

Check: head (49px top pad plus title and 32px margin) plus 3 x 824 = section height 2573 (measured), so the numbers reconcile.

**USP, footer banner, footer.** No motion.

**Footer widgets (JS, not visual motion).**

| Item | Value | Evidence |
|---|---|---|
| Clock | `Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Rome", hour12: false })`, ticked by `setInterval(1000)`, cleared when the tab is hidden | source read |
| Moon phase | Synodic 29.53058867 days from a known new moon of 2000-01-06 18:14 UTC, mapped to 6 labels | source read |
| Weather | fetch `api.open-meteo.com/v1/forecast?latitude=45.4642&longitude=9.19&current_weather=true`, 5s timeout, cached in `sessionStorage` for 600000 ms, run in `requestIdleCallback`, hidden on failure | source read |

**Values that exist in the CSS but are not used on this page** (listed so nothing is silent):

| Token or keyframe | Value | Used by | Evidence |
|---|---|---|---|
| `--filmstrip-speed` | 1000ms | `pdp-feature`, `prodrow` transforms and opacity | source read |
| `--ease-scroll` | `cubic-bezier(1, 0, 0, 1)` | same as above | source read |
| `--ticker-speed` | 28s, `ticker` keyframe `translate(0)` to `translate(-50%)`, linear infinite | `.pdp-ticker__track` | source read |
| `--reveal-speed` | 450ms | `pdp-notify` | source read |
| `--ease-reveal` | `cubic-bezier(0.64, 0, 0.78, 0)` | `pdp-notify` | source read |
| `--cat-hover-speed` | 300ms ease-in on image opacity | `collection-cats` | source read |
| `pdp-edi-parallasse` | `object-position: center 25%` to `center 75%`, `linear both`, `animation-timeline: view()`, `animation-range: cover 0% cover 100%`, phone only, inside `@supports (animation-timeline: view())`, off for reduced motion | `.pdp-edi__img--after` on product pages | source read |

**Pointer, cursor and mouse effects.** No custom cursor, no followers (pointer.json `cursorFollowers: []`, responsive `customCursor: false`). The `mousemove` listeners found belong to Shopify perf-kit and the wlm app, not to visuals.

**Per-frame formulas found in code.** Only the slider counter above and the header scroll rule: on scroll (rAF-gated), if `abs(y - lastY) >= 8` then toggle `is-scrolled-down` when `y > lastY && y > 120`. That class only changes the mobile header (1099 px and down). A `.feature` element check for hiding the desktop nav (`is-nav-hidden` when the feature's top is at or above 60 and its bottom at or below 60) exists but there is no `.feature` on this page.

## 8 3D

None. No canvas element (probe `canvases: []`), no WebGL, no Three (`THREE` undefined, three.json "skipped: no canvas on page", scene-3d.json skipped). One off-screen 2D canvas of 200x50 was created at about 1.9 s by a third-party script (probably fingerprinting or captcha, not visual). The "3D" look comes from macro photography.

## 9 Responsive

**Breakpoints in source (source read).**

| Width | What changes |
|---|---|
| 767 and down (`max-width: 767px`) | Title L 18px, subtitle 14px, page margin 12px (below 768 only). Hero height 421px and intro width auto. Slider cards 293px, Prev/Next kept. Product image strip becomes swipe. Media band ratio 375 by 588 with card offset 254px. Timeline entries become static, single column. USP stacks. Footer banner becomes 897 tall and newsletter fills width. Footer columns become 2 by 2. Drawers full width |
| 768 and up | Page margin 24px, spacing scale 1 (below 768 it is 0.7), hover swap on cards |
| 1099 and down | Desktop nav and actions pills hidden. Mobile Menu and Cart pills with hide-on-scroll. Menu is a full-screen dialog. Drawer top `max(safe-area, 64px) + 40px`. Sticky tops for media card and timeline use the same offset from 768 |
| 1100 and up | Full desktop header |
| Content cap | `--page-content-width: 1920px`; layout grows to 1920 wide then centres |

Other media queries in the CSS (700, 1000, 600, 448 px) belong to Klaviyo, Shop Pay and the wallet widgets.

**Fresh loads (measured, responsive.json).**

| Width | Page height | H1 size | Visible nav links (probe count) | Touch |
|---|---|---|---|---|
| 360 | 5545 | 18px | 26 | yes |
| 390 | 5684 | 18px | 26 | yes |
| 768 | 5255 | 24px | 26 | yes |
| 820 | 5260 | 24px | 26 | yes |
| 1024 | 4934 | 24px | 26 | no |
| 1280 | 5393 | 24px | 30 | no |
| 1440 | 5801 | 24px | 30 | no |
| 1920 | 6267 | 24px | 30 | no |

The tool's summary said "no layout change found across widths" and `breakpointsFound: []`. That is a limit of the check (it tracks H1 size, link counts, canvases and overflow). The measured H1 change between 760 (18px) and 768 (24px) matches the source breakpoint at 767. The link count rising from 26 to 30 between 1024 and 1280 is consistent with the 1099 header switch, but the exact width is not sampled. No horizontal overflow at any width, no hamburger flag (the check looks for a different selector), pin spacers 0, tweens 0.

**Live resize (measured).**

| Step | Width | Height |
|---|---|---|
| 1 | 1440 | 5801 |
| 2 | 1024 | 5330 |
| 3 | 800 | 5157 |
| 4 | 760 | 7354 |
| 5 | 390 | 5684 |
| 6 | 760 | 7354 |
| 7 | 800 | 5157 |
| 8 | 1440 | 5801 |

Going down and back up gives the same heights at 760, 800 and 1440, so there is no stuck state. One mismatch: 1024 reads 5330 in live resize but 4934 on a fresh load (see not-verified). At 760 the page is tallest (7354), taller than at 390 (5684). Inferred: the phone layout applies at 760 but its image-led blocks (band, cards) keep width-based heights, so the stack grows. Not confirmed with element boxes.

**Reduced motion.** The capture ran a reduced-motion load: same height 5801, no change to layout. Source read of what switches off: accent dot animation, slider smooth scroll (becomes auto), drawer, mega menu and scrim transitions, mobile header slide, logo fade, promo slider autoplay, cat hover fade, the PDP parallax. The product card hover fade and button transitions have no reduced-motion rule (source read). See states/reduced_motion_top.png.

## 10 Accessibility, meta and extras

| Item | Result | Evidence |
|---|---|---|
| Dark mode | None. No `prefers-color-scheme` rules. Body stays rgb(246, 246, 246) | measured |
| Contrast | The tool's pair list is a cross of colours on the page, not real text pairs. Real pairs that pass by maths: #000 on #F6F6F6 and #FFF on #000 (21:1 for the latter). Text at 30, 40, 50 or 54 percent alpha, and white 70 percent on photos, was not measured | measured (pairs), see not-verified |
| Keyboard focus | Visible on every element: 2px solid #000, offset 2px, plus 4px #F6F6F6 ring | measured |
| Skip link | Present, targets `#MainContent` | measured |
| Landmarks | header 1, nav 8, main 1, footer 1 | measured |
| Headings | H1 hero, H2 "Meet the collection", H2 media band heading, H3 for footer columns. "Highlights" and the entry titles are `<p>`, so the timeline has no heading structure | measured |
| Language | `lang="en"` | measured |
| Images | 28 images, 0 without alt, 1 with empty alt (the decorative media band photo). Hero alt "IMPRONTE COLLECTION". Footer banner alt is "footer banda" (weak). Timeline images reuse their title as alt | measured |
| Screen-reader helpers | 2 `visually-hidden` elements, 17 `aria-hidden` | measured |
| Slider a11y | Buttons disable at the ends, group label added on phone, focus rescue on disable | source read |
| Meta | Title "Impronte Collection" plus site name. Description about ten limited-edition references. Canonical set. OG: site_name, url, title, type website, description, image Sharing.png 1080x608. Twitter card summary_large_image. Google site verification. Favicon 32x32 | source read |
| Structured data | One JSON-LD block is in the HTML. Its content was not read in this pass | see not-verified |
| Unusual | The header pill labels are uppercased by CSS, text in DOM is sentence case. Live Milan clock and moon phase in the footer. Console showed one 429 (Too Many Requests) on a resource and a web pixel script refused for wrong MIME type (analytics only) | measured |

**Was an error page captured?** No stage of this pack shows an error page. The probe title is "Impronte Collection" with height 5801 and no 503 in the console. The console holds a 429 and a refused pixel script, not a 503. The transient 503 mentioned in the brief is not in this pack. The states run recorded a redirect on /account (screenshot shows the sign-in page) and the expected 404 on the made-up path.

## 11 Page weight and cost

Uncompressed sizes measured on the cloud run (weight.json).

| Type | Files | KB |
|---|---|---|
| Document | 4 | 63 |
| Stylesheet | 6 | 66 |
| Script | 90 | 1442 |
| Font | 4 | 132 |
| Image | 27 | 1063 |
| Fetch | 28 | 8 |
| XHR | 5 | 9 |
| Ping | 20 | 0 |
| Other | 71 | 800 |
| **Total** | **255** | **3583** |

- Timing (measured, slow cloud connection): first paint 2988 ms, first contentful paint 3188 ms, DOMContentLoaded 3938 ms, load 6000 ms.
- Frame rate at top: 61 fps (cloud, software rendered, so a low-cost page reads full speed here).
- Biggest single file: `footer-banda.jpg` at 246 KB. Next are Shopify checkout hydration (207 KB) and Google tag files (193 KB, 193 KB, 150 KB).
- Script weight is almost all third party (Klaviyo, Google tag, Shopify, apps). The theme's own JS in 04-code (header, slider, drawer, cart, card-swatch, widgets, wishlist, promo-slider, morph) totals about 47 KB of source across header, slider, drawer, cart, card-swatch, widgets, wishlist, promo-slider, morph, standard-actions and country-select (source read, file sizes).
- Images: hero served at width 3000, footer banner at 2400, product cards at 900, timeline at 2000 (`srcset` sizes in HTML).

## 12 What is worth porting, in order

1. **Glass token set** (section 4): white at 60 percent, blur 30, 15 and 60, radii 4, 6, 8. It is the identity, and costs a few lines of CSS.
2. **Colour discipline**: #F6F6F6, #000, ink at fixed alphas, one accent (#AFFF00 there). Two flats plus photography.
3. **Type pairing and explicit line heights** (section 5): bold neo-grotesque with -0.02em tracking, uppercase mono labels at 10 to 12px.
4. **Sticky stacking cards** (section 7): pure CSS, tall, opaque backgrounds, one image plus one glass card per entry.
5. **Sticky caption card inside a photo band** (section 7).
6. **Product card**: fixed-ratio media box, two-image hover swap, hairline rows, tiny swatches (section 6).
7. **Native scroll-snap slider with count and disabled ends**, rAF gated (section 7).
8. **Header**: fixed glass pills, blend-mode logo, click-open mega menu with Escape, outside-click and scroll close, mobile pills that hide on scroll down.
9. **Focus ring** recipe: 2px outline plus 4px page-colour ring (works on light and dark).
10. **Reduced-motion coverage** on every custom transition.
11. Skip: the footer clock, moon and weather widget (nice but not needed), and every GSAP-style idea, because this site has none.

### Why this reference matters for a leather-bag store

- **Photography carries the brand, UI stays quiet** (sections 3 and 4): let macro shots of grain, stitching and hardware fill full-bleed bands, with #F6F6F6-style calm light shelves between them for product packshots. Copy the dark band, light shelf pacing.
- **Frosted glass captions over photos** (sections 4, 6): put story copy and nav on glass panels over leather close-ups. It keeps text off busy grain without hiding the material. Check contrast per photo, since the source never measured it.
- **Two-image product card hover** (section 6): packshot to in-use shot (bag on a shoulder or on a table) with a 220 ms cross-fade and no layout shift. It is cheap and shows scale and drape.
- **Stacking material-detail cards** (section 7): one full-height card per craft detail (hide, edge paint, stitching, hardware) using plain CSS sticky. Reads as a considered tour and needs no scroll library, so it stays fast and accessible.
- **Restrained type and accessible defaults** (sections 5, 9, 10): one bold sans plus a small uppercase mono for spec labels (dimensions, leather type), explicit line heights, a visible focus ring, a skip link, reduced-motion switches, and native scroll. Improve on it by keeping text at full ink on glass instead of the 30 to 54 percent alphas used here, and by giving images better alt text than the footer's "footer banda".
