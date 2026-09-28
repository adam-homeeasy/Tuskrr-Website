# Reference DNA: Tuskrr website references

Read on 28 Sep 2026. Eight sites supplied by the client.

## How these numbers were taken, and what they cannot show

- **Method: source read.** `read-source.py` fetched each page's shipped HTML and
  every linked stylesheet (curl, no browser) and counted the declared values.
  The raw counts are in `<slug>/source.json`. Counts are **declarations in the
  CSS**, not the number of elements that use them.
- **No live browser pass yet.** The cloud Chromium could not open HTTPS pages in
  this session, so `measure.mjs` (computed styles, mid-entrance from-states,
  screenshots at 1440 and 390) did not run. Run it on a normal machine:
  `node brand-world/references/measure.mjs`.
- **Not proven, so not claimed:** travel distances measured mid-flight, the
  from-state of any JavaScript-driven reveal, blur amounts on reveals, colours
  per surface as rendered, and the contrast of any pairing. Keyframes quoted
  below are the only from-states that are proven, because the CSS writes them
  out.
- **Brunello Cucinelli** returned HTTP 403 (Akamai bot wall on the site, not our
  network). Its entry comes from the published case study and press, and has
  no numbers.
- Take the pacing and structure. Never take the contrast: our palettes are
  solved separately.

---

## springsummer.dk (Spring/Summer, Copenhagen agency)

| field | value | evidence |
|---|---|---|
| stack | Nuxt (Vue), Sanity, Swiper | script paths `/_nuxt/`, class names |
| easing | `ease-in-out` 21, `ease` 15, `ease-out` 8; custom curves 1 to 2 each | declaration counts |
| durations | .2s 29, .5s 22, .3s 17, .4s 6, .6s 6, 1s 3 | declaration counts |
| common pairs | `transform .2s` (10), `opacity .5s ease-in-out` (9), `background-size .5s` (8) | declarations |
| theme swap | `--theme-transition: .4s ease-out` on background and text colour | custom property |
| entrance keyframe | `slide-enter`: opacity 0, translateY(-50%) to opacity 1, translateY(0) | keyframe text |
| horizontal rows | `sweep`: translateX to the row's overflow, `calc(var(--width)*4ms)`, alternate, ease-in-out | keyframe + declaration |
| layout | fixed sidebar `12.5rem`, header `2.6rem`, grid margin 1rem (2.7rem wide), gap 1rem | custom properties |
| display type | H1 `clamp(2.7rem, 10.5vw, 12.5rem)`; "exception" headline `34 x grid-vw` (a word that fills the column) | custom properties |
| fonts | Grotesk (display), Montreal (sans), Supply (mono) | @font-face |
| palette | black, white, beige `hsl(43 49% 90%)`, grey `hsl(0 0% 21%)`, yellow `hsl(56 100% 50%)` | custom properties |
| UI glass | `backdrop-filter: blur(10px)` 16 times; 20px, 60px, 100px twice each | declarations |
| media | 3 self-hosted MP4 loops in HTML, 22 Vimeo references, 46 inline SVGs | HTML |
| image ratios | 1/1.25, 5/9, 8/5, 4/5, 16/9 | aspect-ratio |
| unknown | reveal travel, whether the theme swap is scroll-driven or route-driven | |

## basicagency.com (BASIC/DEPT)

| field | value | evidence |
|---|---|---|
| stack | Next.js, Sanity (video on `cdn.sanity.io`) | script paths |
| easing tokens | `--ease-out: cubic-bezier(0.28,0.44,0.49,1)`, `--ease-out-soft: (0.28,0,0.49,1)`, `--ease-in-out-soft: (0.72,0,0.28,1)`, `--ease-in-out-hard: (0.77,0,0.175,1)`, `--ease-garret: (0.5,0,0,1)` | custom properties |
| duration scale | 0.1, 0.13, 0.15, 0.2, 0.25, 0.35, 0.5, 0.55, 0.65, 0.75, 1s | `--bd-time-transition-*` |
| delay scale | 0.03, 0.1, 0.2, 0.25, 0.35, 0.38, 0.5, 0.6, 0.75, 1s; first-load delay 0.5s | `--bd-time-delay-*` |
| masked line reveal | `translate-up-0-masked`: translateY(103%) to 0 | keyframe |
| image wipe | `wipe-in`: scale(1.75) translateX(-100%) to scale(1) translateX(0) | keyframe |
| common pairs | `transform 250ms ease-out-soft`, `transform 1s ease-in-out-hard`, `opacity 350ms` | declarations |
| type | SctoGroteskA 300/400/700; `text-transform: uppercase` 113 times; tracking -.02em (27), -.035em, -.05em | declarations |
| palette | dark `#252422`, light `#f4f4f4`, pink `#f9cdcd`, white, footer `#191918` / `#eaeaea` | custom properties |
| structure | reel video hero, awards, one-line mission, "See The Work", numbered drag carousel (00/05), news list, offices | HTML |
| unknown | reel autoplay behaviour, cursor states | |

## outfit.hellohello.is (OUTFIT by ++hellohello)

| field | value | evidence |
|---|---|---|
| stack | Next.js (Turbopack), Tailwind 4, Shopify storefront | script paths, tokens |
| easing | default `cubic-bezier(.4,0,.2,1)` at .15s; `--ease` curves incl. (.76,0,.24,1), (.16,1,.3,1), (.22,1,.36,1) | custom properties |
| motion | `fadeIn` .4s ease-in-out; `transform .5s var(--ease)`; delays .5s | declarations |
| palette | "white" is warm `#ede4dd`; black `#000`; red `#ff0001` accent | custom properties |
| grid | 16 columns, also 8 and 10 | grid-template-columns |
| blend | `mix-blend-mode: difference` and `multiply` | declarations |
| structure | preloader of six images, one line of intent, 12 product cards (name, price, second image on hover), footer | HTML + page read |
| voice | "Made to be worn. Or judged. Or both." Product names are jokes: "Whitespace Matters", "Off by Design" | page read |
| unknown | preloader timing, hover swap timing | |

## stroms.com/pages/man (Ströms, Stockholm menswear)

| field | value | evidence |
|---|---|---|
| stack | Shopify, Swiper | script paths |
| easing | `ease-in-out` 43, `ease` 33, `ease-in` 16, `ease-out` 10 | declaration counts |
| durations | .3s 36, .2s 34, .25s 15, .5s 8 | declaration counts |
| common pair | `opacity .25s ease-in-out` (12) | declarations |
| entrance keyframe | `ScaleIn`: opacity 0, scale(96%) to 1, 100% | keyframe |
| page transitions | view-transition fades `.2s` | `vt-fade-in/out` |
| image ratio | `4/5` in 84 declarations. Portrait is the house format | aspect-ratio |
| palette | ground `#fdfcfb`, second ground `#efe9e3`, ink `#231f20`, accent brown `#9b6a45`, deep brown `#664638`, greys `#6c645c` `#a39c94` `#d3ccc4`, blue `#015881` | custom properties |
| structure | promo bar, deep category menu, landscape editorial tiles with text over, "The Brown Edit", own label "Made by Ströms", service promises | HTML + page read |
| unknown | reveal from-states beyond `ScaleIn` | |

## shop.brunellocucinelli.com/en-gb/ai (Brunello Cucinelli, "Callimacus")

| field | value | evidence |
|---|---|---|
| access | HTTP 403 from the site's Akamai bot wall, from curl and from a fetch service | response |
| what it is | a "pageless" shop: over 30 interface blocks that reassemble in real time around what the visitor seems to want | makemepulse case study |
| intent | three "receptors": product-driven, discovery-led, inspirational | case study |
| input | a contextual prompt bar with subtle cues | case study |
| look | frosted glass, soft blur, hand-drawn sketch details | case study, press |
| built by | Solomei AI (agentic platform), makemepulse (design) | press |
| unknown | every number. Measure on a machine that can open the page | |

## offform.net (OFFFORM, talent agency)

| field | value | evidence |
|---|---|---|
| stack | WordPress, jQuery, Lenis smooth scroll, 15 canvas elements | script paths, HTML |
| hero reveal | `offform-hero-reveal`: clip-path inset(0 0 100% 0) to inset(0), .65s `cubic-bezier(0.76,0,0.24,1)` | keyframe + declaration |
| phone hero | `offform-mobile-hero-image-loop`: 9s linear, three images, each fades in over 4% (0.36s), holds to 29%, out by 33.3% | keyframe |
| UI motion | transform and width .35s `cubic-bezier(0.22,1,0.36,1)` (18 declarations); colour .22s ease | declarations |
| stagger | delays .04, .08, .12, .16, .20, .24s: a 0.04s grid | declarations |
| type | Courier New / IBM Plex Mono, 9px (28) and 10px (21), uppercase, tracking .045em | declarations |
| palette | ground `#0b0b0b`, white, hot pink `#ff4fd8` (56 declarations) | custom properties |
| structure | about, featured talents, talent index, services (headings split mid-word: "REPRESE NTATION"), campaigns, partners, contact, directory | HTML headings |
| unknown | what the canvases draw; talent hover behaviour | |

## unimaticwatches.com/pages/impronte-collection (UNIMATIC, "Impronte")

| field | value | evidence |
|---|---|---|
| stack | Shopify, Barba page transitions | script paths |
| base transition | `--transition: 220ms ease` on opacity, transform and colour | custom property |
| reveal | `--reveal-speed: 450ms`, `--ease-reveal: cubic-bezier(0.64,0,0.78,0)`, an ease-in: it accelerates and lands hard | custom properties |
| filmstrip | `--filmstrip-speed: 1000ms`, `--ease-scroll: cubic-bezier(1,0,0,1)` | custom properties |
| ticker | `--ticker-speed: 28s` linear | custom property |
| parallax | `pdp-edi-parallasse`: object-position center 25% to center 75%, scroll-linked | keyframe |
| glass | `--blur-glass: 30px` (3rem wide), white glass at 80, 60, 40, 30, 10% | custom properties |
| palette | ground `#F6F6F6`, ink `#000`, media placeholder `#D9D9D9`, accent lime `#AFFF00`; ink tints at 70, 50, 40, 30, 15, 5% | custom properties |
| type | Helvetica Neue 400/700, JetBrains Mono 400/700; uppercase 90 times | @font-face |
| radius | 4, 6, 8px | custom properties |
| story | "Every object carries the memory of how it was made. Pressure, contact and repetition leave traces." Details: "Black, in relief", "Contrast in material", "Time through crystal" | page read |
| structure | full-bleed hero, short essay, "Meet the collection", 10 limited cards with edition size, alternating detail bands, three service columns | page read |

## breadandboxers.com/se (Bread & Boxers, Stockholm basics)

| field | value | evidence |
|---|---|---|
| stack | Nuxt (Vue), Tailwind, Klaviyo, Optimizely | script paths |
| easing | `cubic-bezier(.4,0,.2,1)` 12, linear 5 | declaration counts |
| durations | .15s 8, .3s 5, .4s 4 | declaration counts |
| ticker | `runningText` 50s linear infinite | declaration |
| entrance keyframes | `fadeInUp`: opacity 0, translate3d(0,100%,0) to none; `fadeInDown` mirrored | keyframe |
| drawer | transform .1s, height .4s, opacity .4s | declaration |
| type | Heldane Display 400 (serif) with Helvetica LT Pro 300/400 | @font-face |
| palette | white, warm grey `#eae9e6`, near-black `#0f0f0e`, Tailwind greys | declarations |
| structure | proof ticker (delivery, free shipping threshold, 30-day returns), model hero banners, product rails, "AW26 IS HERE", "Back to the basics", newsletter | page read |
| note | the site leads with bundle discounts. Tuskrr's voice rules forbid a discount story | |
