# Not verified

Every gap in this teardown, why it could not be checked, and what would check it.

## Cloud limits (always apply)

| Limit | Effect on this pack | What would check it |
|---|---|---|
| WebGL is software-rendered, so frame rates read low | `weight.json` `fpsAtTopCloud: 6` is not a real number. No WebGL is drawn on the home page anyway | Run the capture on a machine with a GPU |
| Transfer sizes are uncompressed | Section 11 weights (7.6 MB total) overstate what a real visitor downloads with gzip or brotli | Read `transferSize` with compression on, or use a real network trace |
| Loader timings are slower than a real connection | The 4.5 s loader total is from source (0.6 + 1.6 + 0.3 + 2 s). Cloud tween creation times (2828 to 4545 ms) include page load delay | Record the loader on a fast local connection |
| Fitted timings are good to about one frame and read 10 to 15 percent long | Any "fitted" number (for example the 424 ms hero card fade, the 969 ms carousel tail) is slightly long | Prefer the source-read values, which are exact |

## Failed or empty capture stages

| Gap | Why | What would check it |
|---|---|---|
| Only 5 section boxes were measured (header, layout, hero, footer, backdrop) | The map lists page-level boxes, not every row. Ranges for the intro, awards, carousel, clients, logo grid, decade text, video, statement and team rows are read off screenshots (scroll offset + y) or from `pointer.json`, so they are good to roughly 10 to 30 px | Extend the map script to list every `.module-row` and `.module-*` box |
| Layout height changed between reads: 4187 (probe, responsive, map section list) then 4997 (map page height); phone 15551 then 16039 | Content loaded late between reads. I read the 810 px desktop difference as a 16:9 full width video (arithmetic) and the 488 px phone difference as a portrait video (390 x 1.25 = 487.5, a guess). Footer top 3645 was measured before the growth, so 4455 is arithmetic | Re-run the map after all media settle, and list the video row box |
| Video row position | The Mux stream cannot play in this browser, so the row is empty paper in every shot and has no visible edges | Capture with a browser that has the HLS codecs |
| Footer theme values | Footer registers its own theme from CMS data (source read) but the values were not in the files I read. Background #1A1A1A and cream #F0EDE4 are measured pixels (cream is a blurred glyph edge under the cookie backdrop) | Read `global/footer` `theme` from the page data, or shoot the footer with the dialog closed |
| Scroll stop at 4097 (desktop) and 15195 (phone) | These are the last stops. The transition to the dark footer is measured only at that stop and the one before; the exact scroll where it flips is inferred from the midpoint rule | Sample every 50 px from 3900 to 4097 |
| Centre-column pixel samples | Cookie dialog covers the centre (75 percent sample is #CCCCCC in almost every row), so only the left edge is usable | Repeat with the dialog closed |
| Phone screenshots show no content below the hero | Lazy media and reveals had not fired, only paper, header and the cookie sheet are visible. Phone section ranges below the hero are therefore not available | Scroll slowly with waits, or force `loaded` and `is-seen` classes, then re-shoot |
| The home page is only seen behind a cookie dialog | Consent dialog covers `first_view.png` and blurs everything | Set consent cookie before capture, then re-shoot |
| Menu dropdown open state | All 6 menu clicks timed out (`states.json`) | Hover instead of click, then screenshot |
| Hover diffs | `pointer.json` shows empty `changes` for all 17 targets. Hovers in the teardown are source read only | Capture computed style before and after hover with a forced hover state |

## Values that are inferred or uncertain

| Item | Why | What would check it |
|---|---|---|
| Pointer `top` values read as document y | Values exceed the viewport height, so they cannot be viewport y, but the sampler's method was not documented | Read the stage script or re-measure with scroll offset added explicitly |
| Widget positions (newsletter submit at y 2971, "Our work" widget) | Widgets are moved by JS (`position: fixed` plus `translateY`), so their y is not a section anchor | Measure the row containers instead |
| Carousel slide height (arithmetic 700, screenshot about 690) and logo tile height (112 px) | Arithmetic from source CSS and the grid, cross-checked only against blurred screenshots | Add per-row boxes to the map |
| Type rows with no home element (h2, body-m, body-xs, number, loader line) | `tokens.json` only measures elements present at scroll 0. Values are source clamps resolved by arithmetic | Load a page that uses them, or measure the loader during load |
| Swiper major version (11) | Inferred from the class `swiper-slide-fully-visible` | Read the version string in the Swiper chunk |
| hls.js version 1.5.20 | Only a version-looking string in the Mux chunk | Read the hls.js banner |
| Nuxt version | Not present in shipped code | Read `package.json` if the repo is available |
| Font licence terms | I named the foundry (Pangram Pangram) from file names and noted them as commercial. I did not read a licence | Read the foundry licence |
| Sweep ease | Sampler said `linear`, shipped CSS says `ease-in-out`. I used the CSS | Read `getComputedStyle(el).animationTimingFunction` on `.sweep` |
| Background image hover scale | CSS transitions `scale` (1 s and .5 s) on the case teaser layers, but no scale target was found in CSS or JS | Hover a teaser in a live browser and read computed `scale` |
| `AnimatedHeadlineSimple` durations | Set through `--transition-duration` from JS that I did not fully trace. Not used on home | Read the component's prop defaults |
| Total loader length | 4.5 s is arithmetic from source values. The main timeline start also depends on when the layout mounts | Record a video of a fast local load |
| Nav link counts in `responsive.json` (3 to 1) | The sampler's definition of "visible nav link" is unknown. It changes between 1024 and 1280, which matches the 1200 breakpoint | Read the stage script |
| Page heights at 360 (14487) and 1024 (2744) | 360 is far out of pattern. 1024 shows 1 tween, so the loader probably did not run and the page may be mid-load | Re-run those two widths with a settle wait |
| Sampled (frame) values such as hero card fade, widget drift, sweep x | Frame sampling, several with `settled: false` | Use source-read values, or longer sampling |
| Reduced motion | `reducedMotion` test shows nothing changes and no `prefers-reduced-motion` exists in code. That is measured and source read, but I did not test a real user setting on every route | Test in a browser with the OS setting on |

## Files and code not in the pack

| Gap | Why | What would check it |
|---|---|---|
| Lazy chunks `BaZGfXvX.js` (infinite gallery) and `Bo7JC-W3.js` | Only 19 scripts were saved (`bundle: modules saved 0`) | Download them from the live site |
| Any shader code | `three.json` has 0 programs and 0 raw shader sources; three r149 and Spline are bundled but unused on home | Load a route that uses a Spline scene or the gallery |
| Fonts | Deliberately not downloaded (4 left out: Neue Montreal, Right Grotesk Compact Black, Supply Mono Light, a Roboto file) | Buy or license from the foundry |
| Icon SVGs | 18 requests to `/assets/icons/*.svg` returned 404, so `03-assets/svg/icons` is empty. The loader and cursor icons are inline in the CMS data | Copy inline SVG from `index.server.html` if needed |
| Video files | Mux HLS streams; the capture browser could not decode them (`manifestIncompatibleCodecsError`). Only poster thumbnails are saved in `03-assets/images/<playback id>/` | Capture with a browser that has the codecs |
| `catThumb.png` and other missing image | 404 | n/a |
| Routes not opened | `/page/approach`, `/page/culture`, `/page/join-us`, `/page/awards`, case pages, `/category/all`. Only 10 routes plus a 404 were captured | Extend the route list |
| Form submits, logins | Not done by rule | n/a |
| Shopify cart, product blocks | Code is bundled but no product page was captured | Capture a route with a product module |
| Contrast pairs | `a11y.json` `contrastPairs` is empty. The ratios in the teardown are my own arithmetic | Run an automated contrast checker on screenshots |
