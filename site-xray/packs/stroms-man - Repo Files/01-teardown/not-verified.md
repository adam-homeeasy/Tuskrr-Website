# Ströms Man: what is not verified

Each row: the gap, why it could not be checked, and what would check it.

## Cloud limits (always apply)

| Limit | Effect on this pack | What would check it |
|---|---|---|
| WebGL is software-rendered in the cloud | Frame rates read low. Here it does not matter much: the page has no canvas or 3D, and the 61 fps reading at the top of the page is CPU-rendered. | Run the weight and frame test on a real GPU laptop. |
| Transfer sizes are uncompressed | The 7228 KB total and every per-file KB in weight.json are raw sizes. Real download sizes over gzip or brotli, and served as WebP or AVIF by Shopify's CDN, will be smaller. | Read the "transferred" column in Chrome DevTools on a normal connection. |
| Loader timings are slower than a real connection | First paint 3452 ms, DOMContentLoaded 6221 ms and load 6765 ms come from a slow cloud link. The site has no preloader, so nothing else is affected, but the times are not what a shopper sees. | Lighthouse or WebPageTest from a chosen city and device profile. |
| Fitted timings are good to about one frame and read 10 to 15 percent long | The only fit is the scroll fade-in: 438 ms measured against 425 ms in the code (3 percent long, one sample step is 17 ms). Rms 0.037, under the 0.05 limit. The source value is the one to use. | Nothing needed for the value; the code is the truth. |

## Design and behaviour gaps

| Gap | Why it could not be checked | What would check it |
|---|---|---|
| Mega menu when open (Man, Woman, Om oss): column spacing, card copy, the look of the 3 levels | Hover on "Man" produced no measured style change (pointer.json), and no screenshot of the open panel exists. The layout is read from desktop-menu.css and the header script only. | Hover each top item and screenshot at 1440 and 1920. Also press Tab and the arrow keys. |
| Mobile menu drawer (open) and the tab bar inside it | The state run only opened Search; the other seven "open" clicks timed out (states.json, "Växla favorit"). | Open the hamburger on a 390 wide load and screenshot each level. |
| Cart drawer contents, quick-add drawer, size drawer, notify-me drawer | Not opened in the capture. Only their CSS was read. | Add an item and open each drawer. |
| Header appearance at scroll 0 versus scrolled | The header has classes `Header--Transparent` and `Header--Scrolled` toggled at 25 px, but no shipped rule changes its background, and screenshots at 0 and 2100 look the same. The tokens `--header-is-transparent: 1` and `--header-tx-color: transparent` may be a theme setting that is not applied on this page. | Compare computed background at scrollY 0 and 30. |
| Hover zoom on photo tiles, hover underline on nav links | These are done on a child image or a pseudo-element, which the hover diff tool does not read (pointer.json shows "no changes" for them). Values come from CSS. | Record a hover video, or read `getComputedStyle` on the `img` and `::before`. |
| Solid button hover fill | Tokens give hover text and border colours, and only the quick-add button has an explicit `background: transparent` on hover. The general rule was not found in the shipped CSS. | Hover a Primary button (for example "Fortsätt handla" in the cart) and read the computed style. |
| Announcement bar rotation | With one message the console shows Swiper "not enough slides for loop" and the bar does not rotate. If the client adds more messages the settings (10000 ms delay, 600 ms fade) apply, but that was not seen. | Add a second message in a test store. |
| Whether the scroll fades run under reduced motion | The code has no reduced-motion check on that class, so they should run. The reduced-motion screenshot was taken after settling, so it cannot show it. | Emulate reduced motion and record the first 1 second of load. |
| Dead setting: "elementFromLeft" on the slider heading | Reading the code shows it is never observed. Not proved on the live page. | Scroll to the slider on a fresh load and watch the heading. |
| "NYHET" chip text colour | The theme token says #ffffff; the inline style says #231f20 and the screenshot shows dark text. The inline style is taken as the truth. | Read the computed colour on the chip. |
| Contrast of white captions on photos | No scrim exists, but the ratio depends on each photo region and was not measured. | Sample the pixels behind each caption and compute the ratio. |
| Contrast pairs in a11y.json | They are combinations of theme colours, not necessarily pairs the page uses (for example #fdfcfb on #efe9e3 fails but the page does not seem to use it). | Audit the real text and background pairs per element. |
| Tile height extras | The two 5:4 gallery rows measure 594 and 586 px, but 712 px wide at 5:4 gives 570 px. The extra height is probably top padding (the CSS has 24 px on desktop and 8 px on phone) but that was not confirmed per section. | Read the padding on the gallery wrappers. |
| Layout at 1025 to 1295 px | The brand strip should wrap 3 + 1 because `minmax(324px, 1fr)` needs 1296 px for four tiles. Only the height at 1280 (6297) hints at it; no screenshot at 1280. | Screenshot the fresh load at 1280 and 1100. |
| Above 1440 | The page grows to 7378 px at 1920. It is not known whether images stay full-bleed or hit a cap (`--section_max_width` is 1440 px). | Screenshot at 1920 and 2560. |
| Live resize versus fresh height mismatch | 1024: 18383 live against 18233 fresh; 390: 8321 live against 8171 fresh (about 150 px each). Cause unknown, probably lazy image settling. | Repeat with all images forced loaded. |
| Responsive detector flags | The tool reports "hamburger true, 0 visible nav links, h1 null, no breakpoints found" at every width, including 1440 where the text nav is plainly visible. These fields are the detector's limits. | Use the screenshots and CSS instead (as the teardown does). |
| Header height | tokens.json (measured) says 50 px; the served HTML sets `--header-height: 54px` and `--submenu-position: 54px`. Measured 50 px is used; the 54 px offset is likely the header plus border spacing for the mega menu. | Read the mega menu top edge against the header bottom edge. |
| Hotspot and slider behaviour on phone | Only read from code. Phone screenshots show the dots but not clicks. | Tap each dot on a 390 wide load. |
| Video file load_pointer_scroll.webm | Cannot be played in this cloud tool. Only its time marks (loaded 9.1 s, circle 12.3 s, flick 13.9 s, scroll 19.4 s) were read. | Watch it and note anything the frame samples missed. |
| Swiper version | No version string in the bundle. "Swiper 8" is inferred from features (Lazy module, `loopAddBlankSlides`). | Ask the theme maker, or diff the bundle against Swiper 8 builds. |
| Font licence status | Marked paid from general knowledge of Akzidenz-Grotesk (Berthold). The pack has no licence text, and the font files were left out. | Check the licence with Berthold / Monotype or the site owner. |
| Font glyph and faux bold | The footer headings ask for 700 while only Regular and Light load, so the browser fakes the bold. Inferred, not compared against a real bold. | Zoom in on "OM OSS" and compare to a true bold. |
| Lookalike fonts | Hanken Grotesk, Switzer, Public Sans and General Sans are suggested by visual similarity only. Nothing was measured. | Set the copy in each and overlay a screenshot. |

## Routes that failed in the state run (states.json)

| Route | Result | Reason |
|---|---|---|
| /collections/accessoarer-herr | 429 "Just a moment" | Bot check (challenge page) |
| /collections/brown-edit-herr | 500 | Server error for the crawler |
| /collections/made-by-stroms-herr | 500 | Server error for the crawler |
| /collections/skor-herr | 503 | Server error for the crawler |

Working routes captured: /pages/valj-avdelning, /collections/nyheter-herr, /collections/klader-herr, /collections/edits-herr, /collections/trojor-herr, /pages/varumarken-herr and the 404 page. Their screenshots are in 05-screens/states, but none were analysed beyond a look at the contact sheet: collection grid, filters, breadcrumb, product grid and the 404 page were **not** torn down.

## Not part of this capture

- Product detail pages, checkout, account, cart page, blog: not visited. The cart and checkout scripts are only listed.
- No forms were submitted and nothing was logged into.
- Third-party scripts (Google tag, Meta Pixel, trekkie, perf kit) were listed, not read in depth.
