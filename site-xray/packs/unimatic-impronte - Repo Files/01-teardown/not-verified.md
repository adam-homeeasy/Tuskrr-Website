# Not verified

Every gap in this pack, why it could not be checked, and what would check it.

## Standing cloud limits

| Limit | Effect |
|---|---|
| WebGL is software-rendered in the cloud browser | Frame rates read low. On this page there is no WebGL, and the 61 fps at the top of the page is a cloud number only |
| Transfer sizes are uncompressed | The 3583 KB total in weight.json is larger than what a real browser downloads with gzip or brotli |
| Loader timings are slower than a real connection | First paint 2988 ms, first contentful paint 3188 ms, DOMContentLoaded 3938 ms and load 6000 ms are cloud numbers. There is no loader, but these timings still apply to when the hero shows |
| Fitted timings are good to about one frame and read 10 to 15 percent long | Only the accent dot was sampled and its fit is not trusted (see below). Use the CSS source values |

## Brief versus capture

| Gap | Why | What would check it |
|---|---|---|
| The brief expected GSAP, Lenis, Barba, a glass/parallax set of effects and a ticker on this page. None are present | Globals are undefined, 0 tweens, 0 triggers, no Lenis, no canvas, no view transitions. The CSS variables for filmstrip, ticker, reveal and the `pdp-edi-parallasse` keyframe are defined but only used by product-page and collection-page components that are not in this page's HTML | Capture a product page such as /products/uwk-uc1 (its server HTML is in 04-code/html) with the motion probe, to measure the filmstrip, ticker, notify reveal and phone parallax at work |
| The first probe's transient 503 ("Something went wrong") | Not in this pack. Only the recapture is here, with title "Impronte Collection" and height 5801. No stage in the pack looks like an error page | Ask for the first probe file. The console in probe.json holds a 429 (Too Many Requests) on an unnamed resource and a refused web pixel script, not a 503 |
| Which resource returned the 429 | Console text does not include the URL | Re-run with network logging turned on for status codes |

## Motion

| Gap | Why | What would check it |
|---|---|---|
| Accent dot frame fit | motion.json fx001 to fx014 give durations of 1600 to 4513 ms, `settled: false`, and no rms error. Treated as inferred, not trusted. The real values (0.8s, ease-in-out, opacity 1 to .25) come from source | Not needed. Source is authoritative |
| Interaction motion timing on real hardware | Hover fades are 220 ms from source, but only start and end opacity were measured (pointer.json), not per-frame curves | Frame sampling of a product card hover and the slider Next click |
| Slider smooth-scroll duration | `scroll-behavior: smooth` uses the browser's own duration, which was not sampled | Sample `scrollLeft` per frame after a Next click |
| Mega menu open and switch motion | Values are from source (220 ms opacity, scrim `menu-scrim`). The open state was screenshotted only, not sampled | Sample panel and scrim opacity per frame after a click |
| Promo slider in the mega menu | The code exists (dots, pause on hover and focus, `data-interval`) but no `<promo-slider>` is in this page's HTML, so the interval and slide count are unknown | Capture a page where the element is present, or read the header section markup |
| Mobile header hide on scroll | Source is clear (`y > 120`, move of 8 px, 220 ms) but was not exercised in the phone capture | Scroll the phone page down and up with class logging |
| Cart drawer open animation | Source only. It was not opened in the states run | Click Cart and record frames |
| The screen recording (05-screens/video/load_pointer_scroll.webm) | This pass could not play video. pointer.json has marks at 8.4 s, 11.9 s, 13.6 s and 19.0 s but their meaning is not labelled | Watch the video |
| Auto-open drawer rule (`data-autoopen`, `data-delay`, `data-frequency`, localStorage key `unimatic:autoopen:*`) | The code exists but no element on this page uses it | Check the cart and product templates |

## Layout and responsive

| Gap | Why | What would check it |
|---|---|---|
| Exact width where the desktop header becomes the mobile header | Source says 1099 / 1100, but fresh loads were taken at 1024 and 1280 only, so nothing between them was sampled | Add fresh loads at 1099 and 1100 |
| Live resize at 1024 gives 5330 px but a fresh load at 1024 gives 4934 px | Cause unknown. Possibly lazy images or the touch flag differing (fresh 1024 was non-touch, the 768 and 820 loads were touch) | Re-run both at 1024 with element boxes logged |
| Height at 760 (7354 px) is larger than at 390 (5684 px) | Which sections grow was not logged, so the reason in teardown section 9 is inferred | Log section heights at 760 |
| Responsive tool reported no breakpoints | The check only tracks H1 size, link count, canvases and overflow, so it missed structure changes. The 767 and 1099 breakpoints come from source, and the H1 size change between 760 and 768 is measured | Add section-level layout checks to the probe |
| Product card width | Source formula gives 330 px at 1440 (page margin becomes 24 px at 768 and up). That matches the screenshots. tokens.json shows the base `:root` value of 12 px, which applies only below 768 | Log `getBoundingClientRect` of a card at each width |
| Widths at 1920 | Page grows to 6267 px. The content cap is 1920, but the layout at exactly the cap was not compared against a wider screen | Fresh load at 2560 |
| Tablet layout (768 to 1099) | No screenshots at these widths in 05-screens (only 1440 and 390 sets). Layout is described from source | Take screenshots at 820 and 1024 |

## Accessibility and content

| Gap | Why | What would check it |
|---|---|---|
| Real contrast of text at low alpha | The contrast pairs in a11y.json are a cross of page colours, not actual text on actual backgrounds. Text at 30, 40, 50 and 54 percent ink on glass over photos, and white at 70 percent on the hero photo with a 40 percent scrim, were not measured | Sample rendered pixels behind each text box and compute ratios |
| Screen reader output | No assistive-tech run | Test with VoiceOver or NVDA |
| Structured data | The HTML holds one `application/ld+json` block, not read | Read the block in 04-code/html/index.rendered.html |
| Keyboard tab order and menu keyboard behaviour | Only one focus screenshot (keyboard_focus.png) and the computed focus style. Arrow-key behaviour in the menu is not in source | Tab through the page with a recording |
| Invalid H1 markup | A `<p>` is inside the `<h1>` (source read). How screen readers treat it was not tested | Screen reader test |
| Google Tag ids | Two different ids appear (GT and G) and it was not checked which is live | Read the tag configuration |
| Fonts licensing | Helvetica Neue is a commercial typeface. The site self-hosts woff2 files. Whether UNIMATIC holds a web licence is unknown | Ask the client or the foundry |

## Assets and code

| Gap | Why | What would check it |
|---|---|---|
| Fonts | Four font files were deliberately left out of 03-assets (assets.json `fontsNotDownloaded`) | Not needed. Use the lookalikes in recipes.md |
| 191 network requests skipped | Third-party tracking, analytics and app calls were not saved (assets.json `skipped`) | Not needed for the design |
| `@theme/component` and `@theme/utilities` sources | Imported by the theme scripts (import map) but not saved in 04-code/js, so the base `Component` class and the exact `prefersReducedMotion()` helper are unread. Presumably it wraps `matchMedia("(prefers-reduced-motion: reduce)")` | Fetch component.js and utilities.js from the theme assets |
| Klaviyo form code | Vendor code, minified. The style overrides in the page HTML were read, the form logic was not | Not needed |
| Weather and clock widgets | Source read only. Their live output was seen in the footer screenshots, not tested for failure states | Block the open-meteo host and reload |
| Sections not on the page but in the shared CSS | Most of `styles.css` (167 KB) styles other templates (for example product pages, articles, quiz, collaboration bands). Only classes present in this page's HTML are documented | Not needed |
| Wishlist, search, cart, classic collection, product pages | Screenshots and server HTML were saved, but only this page is torn down | Run a separate pack per template |
