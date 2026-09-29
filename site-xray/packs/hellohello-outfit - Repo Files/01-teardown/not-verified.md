# OUTFIT by ++hellohello: not verified

Everything that could not be checked, why, and what would check it. Nothing here is guessed in `teardown.md` or `recipes.md`; where a value is missing it says so.

## Cloud limits that always apply

| Limit | Effect on this pack | What would check it |
|---|---|---|
| WebGL is software-rendered in cloud Chromium, so frame rates read low | This site has no canvas, so the 61 fps at the top of the page is not affected by WebGL. Any frame-rate number in the pack is a cloud number, not a device number | Run a real-device trace (Chrome DevTools performance panel on a mid-range phone) |
| Transfer sizes are uncompressed | `weight.json` KB values are raw sizes. The real download over the wire is smaller (gzip or brotli) | Read `content-length` and `content-encoding` headers, or run WebPageTest |
| Loader timings are slower than a real connection | The page took about 1.4 s to mount and `load` fired at 8.1 s. The GSAP sequence itself ran at true speed (see teardown 7.2 cross-check) | Test on a real connection and a cold cache |
| Fitted timings are good to about one frame and read 10 to 15 percent long | No timing here is fitted: all durations come from GSAP objects (measured) or the shipped code (source read) | Not needed. If a fitted value is ever added, remove 10 to 15 percent and re-time |

## Gaps in this capture

| # | Gap | Why it could not be checked | What would check it |
|---|---|---|---|
| 1 | Hover values (link underline, product hover flip, theme dot scale, arrow button) are source read, not measured | `pointer.json` recorded 0 style changes for all 10 hover targets. The effects live on `::after`, on a second image and on `group-hover` classes, which the hover diff does not read | Hover each target in a real browser and record the computed style of the pseudo-element and the child image; or record a video and step through frames |
| 2 | The custom cursor was not seen in action | `cursorFollowers` was 0 (the cursor moves with `gsap.to`, not a follower loop the detector knows). The pointer video `load_pointer_scroll.webm` exists but I did not review video | Watch the video, or record a screenshot with the mouse over a product tile |
| 3 | Whether the native cursor is hidden | The `<html>` gets `has-custom-cursor` but no CSS rule for that class (or `cursor:none`) was found in the inline stylesheet or chunks | Check computed `cursor` on `body` in a desktop browser |
| 4 | Mobile menu overlay was never captured open | `states.json` shows `opened: 0`. The menu numbers in teardown 7.8 are source read from `MenuOverlay.js` | Tap Menu at 390 px and screenshot before and after; measure the timeline |
| 5 | Page-transition curtain was not captured live | All 11 route shots are fresh loads and show the preloader. The curtain values are source read from `Providers.js` | Click an internal link with a screen recording; read the `#layer` and `#page` tweens |
| 6 | Route screenshots show only the preloader | Each route capture was taken while the preloader was still playing (`05-screens/states/route_*.png` show the black panel, the wordmark and the photos). Bag, shipping and product pages were therefore never seen in their final state; their layout comes from server HTML and code only | Re-shoot each route after `html.loaded` is set (the loader needs about 4.8 s from mount) |
| 7 | Product page and bag page motion | Page code is source read only. No hover, add-to-bag, quantity or delete action was run (forms were not submitted, by rule) | Run in a browser with a test cart |
| 8 | The empty-bag Screensaver | Its chunk `98234aa923caeedb.js` is not in `04-code/js` (lazy, never loaded during capture). It is a full-screen fixed layer rendered client-side only. What it draws and how it moves is unknown | Open `/bag` in a browser with an empty cart and inspect the layer |
| 9 | Row edges for product rows 2 to 4 | `scroll-map.json` has only 5 sections. Row 1 and the wrapper have ranges; the three later rows do not | Add bounding-box sampling for each `.mb-34` row |
| 10 | Footer sub-block positions | Same reason: the footer has one range (3331 to 4022) and no sub-blocks | Sample each footer child's bounding box |
| 11 | Why only 1 ScrollTrigger was alive | The source creates one per product tile (13), each `once: true`. The capture recorded 1. Probably the others were killed after firing, but not checked | Log `ScrollTrigger.getAll()` before scrolling and after |
| 12 | Whether tile reveals repeat on re-entry | The `Reveal` component is partly truncated in the pack (`<long string>` placeholders). The `onEnter` returns a cleanup function; whether the observer stops after the first entry is not shown | Scroll a tile out and back in and watch for a replay |
| 13 | Horizontal overflow at 800 px live-resize | `responsive.json` shows `overflowX: true` at 800 both times, but not at fresh 768 or 820. Cause not found | Resize a real window to 800 px and find the overflowing element |
| 14 | 6637 px page height at 760 px live-resize | Far taller than fresh 768 (3769). Explanation (mobile grid at wide width) is inferred, not measured | Fresh-load at 760 and screenshot |
| 15 | Tween count grows on resize (281 to 338) | Cause not found (contexts may be re-created without full revert). Not checked whether it leaks memory | Log `gsap.globalTimeline.getChildren().length` across repeated resizes |
| 16 | No fitted timing exists | `motion_sampled.json` found 0 moving elements in the load sequence and at 10 scroll stops, so there are no fitted values. Timings are GSAP values instead, which is the required source when GSAP is present | Not needed |
| 17 | `pointer.json` hover coverage | Only 10 targets were hovered, and theme dots and cursor states were not among them | Extend the hover list |
| 18 | Light and dark theme visuals | Colours come from the class list and CSS. No screenshot of `data-theme="light"` or `"dark"` exists | Click the dots and screenshot both themes |
| 19 | Hamburger detector said `false` | The mobile menu is a text "Menu" button, so the checker missed it. Confirmed only by source | Screenshot at 390 px with the header visible (`phone-390/000_0.png` does show "Menu") |
| 20 | Font weight actually drawn by `font-medium` | The CSS declares 400, 700 and 800 faces only. `font-medium` (500) probably draws the regular file by CSS matching, but no computed font check was made | Read the rendered font with the browser's font inspector on the product title |
| 21 | Exact wordmark rendered height | Computed from the viewBox ratio (296 px at 1392 px wide), not measured | Read the SVG bounding box |
| 22 | Contrast of the focus ring (about 2.06:1) and grey text (about 5.5:1) | Computed by me from `#a1a1a1`, `#5A5A5A` and `#ede4dd`; the pack only holds the 9 contrast pairs in `a11y.json` | Run a contrast checker on the real rendered ring |
| 23 | Version of NumberFlow, Sonner, Tailwind, Shopify API | Not printed in the shipped code | Read `package.json` of the original (not available) |
| 24 | `next-transition-router` identity | Name is inferred from the shape of the code, not from a package banner | Not important for rebuilds |
| 25 | Initial-load `DOMContentLoaded` 8121 ms | Very high against a first contentful paint of 400 ms. Likely cloud proxy and Tag Manager. Not investigated | Compare against a real-network trace |
| 26 | GTM container contents | Only the container id GTM-M68G69KW is known. What tags it fires is not | Inspect the container in Tag Manager (needs access) |
| 27 | Dark-theme preloader | Source says the preloader turns cream with black text in the dark theme. Only the default red-theme preloader was seen | Load once with `localStorage.theme = "dark"` |
| 28 | Video review | `05-screens/video/load_pointer_scroll.webm` was not played. `videoMarks` (loaded 8.5, circle 12.5, flick 15.8, scroll 24.5 s) are the capture script's markers | Review the video against those marks |
| 29 | Copy, imagery and prices | Product names, prices and photos are content, not design, and are not analysed | Not needed |
| 30 | Shopify data shape | Cart actions (`redirectToCheckout`, `removeItem`, `updateItemQuantity`) exist as server actions; their behaviour was not exercised | Use a test store |
