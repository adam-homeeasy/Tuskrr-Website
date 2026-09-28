# Tuskrr website

The Tuskrr one-page site, built on the drinkstill.nz teardown (`../01-teardown`)
and the Tuskrr brand world, The Entrance (branch `claude/ecstatic-cerf-eqi4ii`).
`SPEC.md` maps every STILL section and motion value to its Tuskrr counterpart.

## Open it

It's static. Serve the folder and open it in a browser:

```sh
cd site && python3 -m http.server 8000   # then open http://localhost:8000
```

Opening `index.html` straight from disk also works; the browser just logs two harmless font-preload warnings.

**One file:** `tuskrr.html` is the whole site in a single self-contained file (about 930 KB), with the CSS, JS, fonts and images inlined. It makes no requests, so you can email it, drop it on any host, or double-click it. `node site/src/build.mjs` regenerates it along with `index.html`.

## What's on the page

1. **Preloader.** Proof-point pills pop around the wordmark, a 000 to 100 counter, then the wordmark flies into the hero.
2. **Hero.** A dark lens follows the cursor over the giant wordmark and shows RIDGE in a door of light. Scrolling opens the lens to fill the screen and brings in "The idea".
3. **The collection.** Pinned. All six bags, one per snap, sliding in from alternating sides with their own glow and outlined number.
4. **Inside.** Pinned. The four confirmed promises (genuine leather, 3-year warranty, initials in 2 weeks, cash on delivery) with drawn icons and counters.
5. **The day.** Pinned. Five times of day, each a bag standing in the door of light.
6. **Where's that from?** Tuskrr's campaign lines and two marquees that speed up and lean when you scroll fast.
7. **Shop and gifting.** Gift occasions with a bag preview that follows the cursor, then six cards, a bag drawer and a notify form.

Phones (under 768 px) get swipe carousels instead of pins and no lens, as on STILL.
Reduced-motion settings are honoured; `?motion=off` and `?motion=force` override them.

## Edit it

Copy lives in `src/content.mjs`. After editing, rebuild the HTML:

```sh
node site/src/build.mjs
```

Styles are in `css/site.css`; motion is in `js/main.js`.

## Placeholders to replace before launch

- **Prices.** Cards say "Price at launch" and the ₹5,000 to ₹7,000 range.
- **Laptop sizes and the returns policy** are the brand world's sample values, marked "sample" on the page.
- **Checkout and sign-up forms** check the email and confirm on the page, but don't send anywhere yet.
- **Logo files** are traced from the supplied JPEGs (`src/tools/trace-logo.py`). Swap in the designer's vectors when they arrive.
- **Product images** are cut out of the supplied photos (`src/tools/cutouts.py`). CREST's source is the smallest (572 px), so it's the softest.
- **The day's scenes** are drawn in CSS. Swap in real photography when the shoot is done.

## Built with

Plain HTML, CSS and JS. GSAP 3.15 (ScrollTrigger, SplitText) and Lenis 1.3.26 are
in `vendor/`, and the fonts (Instrument Sans and Instrument Serif, OFL) are in
`assets/fonts/`, so the page makes no outside requests. Nothing from STILL's site
(images, model, fonts, copy) is used.
