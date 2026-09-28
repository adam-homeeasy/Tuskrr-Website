# drinkstill.nz, component source notes

Design tokens found in CSS (0lwsapzrpp55y.css):
- `--color-ink:#1a1b1d`, `--color-bone:#efede6`, `--color-mist:#6a6965`, `--color-alpine:#1e423e`, `--color-clear:#bcd3d8`
- `--nav-h:56px` on small screens, `56px` inside one media query, `72px` inside a wider one (mobile 56px, desktop 72px)
- `--font-display:"Tiempos Headline","Times New Roman",Georgia,serif`
- `--font-serif:"Tiempos Text","Times New Roman",Georgia,serif`
- `--font-sans:"Söhne",-apple-system,BlinkMacSystemFont,"Segoe UI",system-ui,sans-serif`
- `--font-wordmark:"Söhne Breit","Söhne",-apple-system,BlinkMacSystemFont,sans-serif`
- `--font-mono` unused in these components.

Flavor bloom colours (from flavors.js): Clear `#bcd3d8`, Dawn `#e8c9a0`, Dusk `#c9b5c8`.
Ingredient halo colours (Inside.js `f` array): L-Theanine `#BCD3D8`, Lion's Mane `#D4B896`, Rhodiola `#C9B5C8`, Bacopa `#B5C8B0`.

Hero.js already analysed, skipped. CustomCursor.js analysis skipped per instructions (only referenced below where other components touch it).

---

## Nav.js

Renders a fixed top nav plus a full-screen mobile menu, plus a cart button badge.

Structure:
- `<nav>` fixed, `height: var(--nav-h)`, z-50, transition on `background-color,backdrop-filter,border-color,transform`, duration 400ms ease-out.
- Wordmark link "STILL" (font-wordmark, 22px, weight 900, letter-spacing -0.5px) plus a small square dot, `bg-alpine`, 8x8px, marginLeft 2px.
- Desktop nav links (Flavors #flavors, Inside #inside, Story #story, Stockists #stockists), each wrapped in a `MagneticLink` (see below).
- "Shop" link with an arrow span that translates on hover (`group-hover:translate-x-1`, transition 250ms).
- Cart button (`h()` sub-component): SVG bag icon, badge count that pops with `gsap.fromTo(scale:1.4 -> 1, duration .35, ease power2.out)` whenever cart count increases (compares `e` vs previous ref).
- Mobile hamburger button (3 bars, 18x14px) opens a full-screen bone overlay menu (z-60), links at 32px font-sans weight 600, "Shop" link at 20px.

Nav show/hide and background logic (scroll handler on window scroll, passive):
- `scrolled` state true when `window.scrollY > 80` → nav background becomes `rgba(239, 237, 230, 0.92)` with `backdrop-filter: blur(20px)` and border `1px solid rgba(140, 139, 134, 0.4)`; otherwise transparent, no blur, transparent border.
- Nav auto-hide: tracked via a ref-based direction check against `#hero` element's bounding rect bottom (if hero bottom > 100px, nav always shown, direction-lock reset). Once past hero, nav translateY(-100%) hides on scroll (direction state `l`/`hidden`) unless mobile menu open or is mobile (`useIsMobile`).
- Nav transform: `translateY(0)` if not `hidden` OR mobile-menu-open OR `isMobile`; else `translateY(-100%)`.

Smooth-scroll link handler `v(target)`:
- Calls `getLenis()?.scrollTo(target, {duration: 1.2})`; falls back to `element.scrollIntoView({behavior:"smooth"})` if no Lenis instance. Closes mobile menu after click.
- Logo click also calls `lenis.scrollTo(0,{duration:1.2})` or `window.scrollTo({top:0,behavior:"smooth"})`.

Mobile menu open locks body scroll (`document.body.style.overflow = "hidden"`) while open, restored on close.

### MagneticLink (`a` component in Nav.js)
- Props: `strength=0.35` default (Nav passes 0.3), children, className.
- Guarded by `window.matchMedia("(pointer: fine)").matches` and NOT `prefers-reduced-motion: reduce` — disabled on touch/reduced-motion.
- Uses `gsap.quickTo(el,"x",{duration:.4,ease:"power2.out"})` and same for y.
- On `pointermove` (passive): offset = `(clientX - centerX) * strength`, `(clientY - centerY) * strength`.
- On `pointerleave`: animates back to `x:0, y:0`.

---

## SmoothScroll.js (Lenis wrapper)

```
lenis = createLenis()  // { lerp: 0.1, smoothWheel: true }
lenis.on("scroll", ScrollTrigger.update)
gsap.ticker.add(t => lenis.raf(1000 * t))
gsap.ticker.lagSmoothing(0)
```
On unmount: removes ticker callback, `lenis.destroy()`, `clearLenis(lenis)`.

### clearLenis.js (Lenis 1.3.23 core, options actually passed)
Only options explicitly passed at creation: `{ lerp: 0.1, smoothWheel: true }`. Everything else is Lenis defaults (not set by this app): `duration` unset (defaults ~1.2 via `h` default used only as scrollTo default), `easing` default, `orientation` default vertical, `gestureOrientation` default vertical, `touchMultiplier` default 1, `wheelMultiplier` default 1, `autoResize` true, `overscroll` true, `autoRaf` false (driven manually by gsap ticker instead), `anchors` false, `autoToggle` false, `syncTouch` not set (falsy), `infinite` not set.
- Module exposes `createLenis()`, `getLenis()`, `clearLenis(instance)` as a tiny singleton registry (`d` module-level var holds current instance).
- `scrollTo` default duration used elsewhere in the app is explicitly passed per call (1.2s for nav links, 1s for flavor/ingredient dot nav, 0.9–1.2s for story chapter nav).
- Touch handling: `onTouchMove` delta = `-(clientX - touchStart.x) * touchMultiplier` (mirrors direction).
- Wheel handling multiplies deltas by a line-height/page-height factor depending on `deltaMode`, then by `wheelMultiplier`.
- `onVirtualScroll`: computes velocity based touch inertia via `touchInertiaExponent` on touchend (`Math.sign(u) * Math.abs(velocity) ** touchInertiaExponent`).

---

## CartProvider.js / useCart

Context-based cart, no persistence (state is plain `useState`, not localStorage).
- `add(item)`: key = `${sku}-${packSize}-${subscription ? "sub" : "once"}`; if key exists increments qty by `item.qty ?? 1`, else pushes new line.
- `setQty(key, qty)`: qty<=0 removes the line, else updates.
- `remove(key)`, `clear()`.
- `count` = sum of qty. `subtotal` = sum of `unitPrice * qty`.
- `isOpen/open/close` control the cart drawer.

## FREE_SHIPPING_THRESHOLD.js
- `FREE_SHIPPING_THRESHOLD = 50` (NZD).
- `formatPrice(n)`: integer prices render without decimals, else `.toFixed(2)`.
- `subscriptionPrice(price) = Number((price * 0.85).toFixed(2))` — flat 15% subscription discount.
- `products` derived from `flavors` data: `{sku, number, name, flavor, description, accent, fourPack:24, twelvePack:66}` for all three flavors (fixed prices, not per-flavor).

## flavors.js (data)
Three flavors, each: `id, number (STILL.0N), skuNumber, name, descriptor, naturalFlavor, flavorPair, oneLiner, bloomColor, momentTag, pitch, leadIngredient`.
- Clear (`#bcd3d8`, cucumber & yuzu, lead l-theanine, "signature")
- Dawn (`#e8c9a0`, ginger & bergamot, lead rhodiola, "citrus")
- Dusk (`#c9b5c8`, blackcurrant & manuka, lead bacopa, "berry")

## ingredients.js (data)
4 ingredients with dosageMg: L-Theanine 200mg (Camellia sinensis, Shizuoka Japan), Lion's Mane 500mg (Hericium erinaceus, Marlborough NZ), Rhodiola Rosea 150mg (Altai mountains), Bacopa Monnieri 300mg (Kerala, India). Total blend = 1150mg (used everywhere as the "active blend" denominator).

---

## CartUI.js (cart drawer + demo checkout modal)

`FreeShippingBar` sub-component: `remaining = max(0, 50 - subtotal)`, `progress = min(1, subtotal/50)`. Text: "You have free shipping within New Zealand." once remaining<=0, else `"You are $X from free NZ shipping."`. Progress bar: 1px high track (`bg-ink/15`), fill `bg-alpine`, `transform: scaleX(progress)`, `transition: transform 0.4s ease-out`.

`CartLine` sub-component: 56x70px can thumbnail with radial-gradient accent behind `<img src="/images/cans/still-{sku}.png">` (scale 1.16). Quantity stepper buttons (32x30px, pill border-radius 18px). Remove link.

Main `CartUI`:
- Backdrop: fixed inset-0 z-70, `background rgba(26,27,29,0.32)`, opacity toggled, transition 400ms ease-out.
- Drawer `<aside>`: fixed right, z-71, width `min(420px, 100vw)`, border-left `1px solid rgba(140,139,134,0.4)`, box-shadow `-16px 0 48px rgba(26,27,29,0.1)`, transform `translateX(0/100%)`, transition 450ms ease-out.
- Empty state: "Your cart is empty." / "Quiet focus, by the case." + Continue button.
- Checkout button: height 50px, bg `var(--color-ink)`, hover swaps to `var(--color-alpine)` via inline mouseenter/leave handlers (not CSS `:hover`), letter-spacing 0.4em.
- "Checkout" opens a demo modal (since real checkout isn't live): copy "Shipping begins fall 2026." Explains STILL is stocked in NZ specialty grocers, online ordering opens fall 2026. Email capture form posts to `/api/notify` with `{email, source:"checkout-notify"}`. Button label toggles "Sending"/"Notify me". Error text colour `#9a4a3f`.
- Modal open/close animated only via CSS transitions (opacity + translateY(12px→0)), duration 300ms.
- Escape key closes whichever of modal/drawer is open (checked in that priority order).
- "Find a stockist near you" link scrolls to `#stockists` via Lenis (duration 1.2) then closes modal+drawer.
- Body scroll locked while drawer or modal open.

---

## Bloom.js

Radial gradient "glow" blob behind cans/flavor sections.
- Props: `color, size=480, className, intensity="strong"|other`.
- Continuous breathing animation: `gsap.to(el, {scale:1.05, opacity:1, duration:2, yoyo:true, repeat:-1, ease:"sine.inOut"})` (infinite, no ScrollTrigger — runs on mount).
- Base inline style: `transform: scale(0.95)`, opacity `0.92` if strong else `0.85`.
- Gradient stops, "strong": `radial-gradient(circle, {c} 0%, {c}ee 18%, {c}b3 35%, {c}66 55%, {c}26 75%, {c}00 92%)`.
- Gradient stops, non-strong: `radial-gradient(circle, {c} 0%, {c}cc 20%, {c}66 45%, {c}1f 65%, {c}00 80%)`.
- `filter: blur(2px)` for strong, `blur(6px)` otherwise.

## ScrollReveal.js
Simple fade+rise wrapper. `gsap.fromTo(el, {opacity:0,y:12}, {opacity:1,y:0,duration:.6,ease:"power2.out",delay,scrollTrigger:{trigger:el,start:"top 85%",toggleActions:"play none none none"}})`. No reduced-motion branch in this specific file (unlike TextReveal/ScrollIlluminate).

## TextReveal.js
Splits text via GSAP SplitText and reveals lines/words/chars upward.
- Props: `split="lines"|"words"|"chars"`, `start="top 85%"`, `stagger`, `duration`, `delay=0`.
- Reduced-motion branch: if `matchMedia(prefers-reduced-motion:reduce)` matches, just sets opacity 1 and skips animation entirely.
- Default stagger: chars=0.02, else (words/lines) 0.09. Default duration: chars=0.8, else 0.9.
- `SplitText.create(el,{type:split, mask:split, autoSplit: split==="lines"})`.
- Animation: `fromTo(target, {yPercent:115}, {yPercent:0, duration, ease:"power2.out", stagger, delay, scrollTrigger:{trigger:el, start, once:true}})`.

## ScrollIlluminate.js
Word-by-word "dim to lit" scrub effect tied to scroll position (not one-shot).
- Props: `dim=0.24`, `start="top 82%"`, `end="top 34%"`.
- Reduced-motion: sets opacity 1 immediately, skips.
- `SplitText.create(el,{type:"words"})`; words start at `opacity: dim`; then `gsap.to(words, {opacity:1, ease:"none", duration:1, stagger:.35, scrollTrigger:{trigger:el, start, end, scrub:true}})` — scrubbed directly to scroll position, stagger .35 between words.

## InlineCan.js
Small inline three.js canvas used for compact can renders (mobile flavor cards, WhereAvailable cursor-follow can, etc).
- `useInView("600px")` rootMargin — canvas only renders (`frameloop:"always"`) when in view AND `active` prop true, else `"never"`.
- `Canvas` props: `dpr = canvasDpr()`, `gl:{antialias:true, alpha:true, toneMapping: ACESFilmicToneMapping, toneMappingExposure:1.05}`, `camera:{position:[0,.3,7.6], fov:26}`.
- Lights: ambient intensity .2; directional `[4,6,5]` intensity 1.4 white; directional `[-4,2,3]` intensity .5 white; directional `[0,4,-5]` intensity 1.1 white.
- Two modes: if `spinPeriodSeconds` prop given, uses continuous `Can3D` auto-rotation (`rotationPeriodSeconds`, `initialRotationY`, `enableTilt:false`). Otherwise uses a controlled can: `controlledRotationY:0, controlledTiltX:.16, stageMotionRef`.
- `onFirstFrame` callback fires on the 2nd `useFrame` tick (via tiny helper component `u`), used by WhereAvailable to flag canvas readiness.

## canvasDpr.js (shared hooks)
- `canvasDpr()`: returns `[1,1.5]` if `matchMedia("(max-width:767px)")` else `[1,2]`.
- `useInView(rootMargin="200px")`: IntersectionObserver-based, default `inView=true` initially, updates via `isIntersecting`.
- `useIsMobile()`: `matchMedia("(max-width:767px)")`, `useSyncExternalStore`-style effect with a `change` listener; same 767px breakpoint used everywhere in these files (also Nav's mobile menu breakpoint at `md:` i.e. 768px in Tailwind terms).

## ContactShadows.js
Drei-style baked contact-shadow plane (blurred top-down render-to-texture of the scene).
- Blur is a two-pass box blur (9-tap Gaussian-ish weights: .051,.0918,.12245,.1531,.1633,.1531,.12245,.0918,.051) applied via a custom `v` (vertical) shader and a horizontal-pass depth shader.
- Depth material override: replaces MeshDepthMaterial's fragment output `vec4( vec3(1.0-fragCoordZ), opacity )` with `vec4( ucolor * fragCoordZ * 2.0, (1.0-fragCoordZ) * 1.0 )`, i.e. tints the depth shadow with a custom colour instead of grayscale.
- Default color prop `"#000000"`, but callers override: Inside.js/section usage passes `color:"#1a1b1d"` (ink), `opacity:.32`, `scale:4`, `blur:2`, `far:2`, `resolution:512`, `position:[0,-1.4,0]`.
- Renders scene twice per frame into ping-pong render targets (`frames` prop, default Infinity meaning every frame) and swaps `scene.overrideMaterial` to the tinted depth material during the shadow pass, hiding the shadow-plane mesh itself while capturing.
- Output mesh: rotated flat plane (`rotation:[-Math.PI/2,0,0]`, `scale:[1,-1,1]`) with `MeshBasicMaterial` using the baked shadow texture, `transparent:true`, configurable `opacity` and `depthWrite`.

## StudioEnvironment (from raw bundle, module 93964)
```
function StudioEnvironment(){
  return <Suspense fallback={null}>
    <Environment files="/hdri/studio_small_03_1k.hdr" background={false} />
  </Suspense>
}
```
Single fixed HDRI environment map, 1k resolution, background disabled (used only for lighting/reflections, not visible backdrop). No lightformers, no per-scene variation found in these files.

---

## Flavors.js

Two entry points chosen by `useIsMobile()`: desktop pinned-scroll stage (`M`) or mobile horizontal swipe carousel (`w`). Exported `Flavors` picks between them.

Shared helper `S` (desktop): a Canvas rendering all 3 `Can3D` instances stacked (one per flavor, `controlledRotationY:0, controlledTiltX:.16, targetHeight:2.55`, driven by per-flavor `stageMotionRef`s), same lighting rig as InlineCan (ambient .2; directional .4,6,5/1.4; -4,2,3/.5; 0,4,-5/1.1), `dpr=canvasDpr()`, `frameloop` gated by `useInView("1500px")`.

`A(leadId)` helper: reorders ingredients array putting the lead ingredient first.

### Desktop stage (`M`)
- Section pinned via `ScrollTrigger.create({trigger: pinTarget, start:"top top", end:()=>"+="+3*window.innerHeight, pin:true, pinSpacing:true, scrub:1, snap:{snapTo:[0,1/3,2/3,1], duration:{min:.25,max:.55}, ease:"power2.inOut", directional:false, delay:.1}, invalidateOnRefresh:true, refreshPriority:1})`.
- `onUpdate` maps scroll progress to a 0/1/2 active-flavor index with hysteresis bands around 1/6 and 0.45/0.55 (`n=1/6`), to avoid flicker at snap boundaries.
- Heading fade-in: `gsap.fromTo(eyebrowLabel, {y:14,opacity:0},{y:0,opacity:1,duration:.6,ease:"power2.out", immediateRender:true, scrollTrigger:{trigger:section, start:"top 80%", toggleActions:"play none none none"}})`.
- "Three formulations." headline: SplitText `words,chars` mask words; `gsap.fromTo(chars,{yPercent:115},{yPercent:0,duration:.8,ease:"power2.out",stagger:.022, scrollTrigger:{trigger:section,start:"top 80%",once:true}})`.
- Left copy block + progress counter fade+rise together: `fromTo([counterEl, copyBlockEl], {y:70,opacity:0},{y:0,opacity:1,duration:1,ease:"power2.out",stagger:.12, scrollTrigger:{trigger:section,start:"top 55%",once:true}})`.
- Can transform per flavor index (array `_=[1,-1,1]` alternates sign per index), driven imperatively per-frame via refs (`x.current` state objects), animated on index change:
  - Entering flavor: `fromTo({x:3*sign,y:.12,rotZ:-.16*sign,scale:.94,opacity:0},{x:0,y:0,rotZ:0,scale:1,opacity:1,duration:.85,ease:"power2.out",delay:.1,overwrite:"auto"})`.
  - Leaving flavor: `to({x:-2.2*sign,y:-.1,rotZ:.14*sign,scale:.94,opacity:0,duration:.45,ease:"power2.in",overwrite:"auto"})`.
- Background bloom-gradient div per flavor crossfades: `to({opacity:+(index===active),duration:.7,ease:"power2.inOut",overwrite:"auto"})`.
- `Bloom` glow div per flavor crossfades: duration .8, same ease.
- Giant ghost SKU-number watermark (`clamp(260px,26vw,430px)`, weight 800, `WebkitTextStroke:"1.5px rgba(26,27,29,0.08)"`, transparent fill) per flavor crossfades with vertical drift: `to({opacity:+(i===active), y: i===active?0:(goingForward?-40:40), duration:.8, ease:"power2.inOut", force3D:true})`.
- Progress counter text set directly (`"{n+1} / 3"`), no animation, updated in the same effect.
- Copy panel swap on index change: old panel exits `to({y:-26,opacity:0,duration:.25,ease:"power3.in"})` then swaps content; new panel enters `fromTo({y:26,opacity:0},{y:0,opacity:1,duration:.45,ease:"power3.out"})` with child `[data-stage-item]` elements staggered in: `fromTo({y:18,opacity:0},{y:0,opacity:1,duration:.45,ease:"power2.out",stagger:.05,delay:.05})`.
- Ghost SKU watermark font-size `clamp(260px, 26vw, 430px)`.
- Flavor name heading: `clamp(52px, min(7.6vw, 12vh), 128px)`, weight 300, line-height .92, a coloured period after the name (`B.bloomColor`).
- Section eyebrow index "02 / Three flavors". Headline "Three formulations." `clamp(32px, min(4.6vw, 6.5vh), 64px)`.
- Bottom nav dots (SKU numbers) click → `lenis.scrollTo(pinStart + (pinEnd-pinStart)*(index/3), {duration:1})`.
- Ingredient list under copy: shows all 4 ingredients reordered lead-first; lead ingredient highlighted (`text-ink` + "Lead" tag), dose shown in mg; "Active blend" total = 1150mg.

### Mobile carousel (`w`)
- Horizontal snap-scroll track (`snap-x snap-mandatory`, gap `5vw`, `82vw` wide cards), scrollbar hidden.
- Active-card detection: scroll handler (rAF-throttled) finds child whose center is closest to viewport center, sets active index.
- On enter (first `ScrollTrigger` at `top 85%`, once) and on index change, re-splits the active card's `<h3>` name via `SplitText` (`words,chars`, mask words) and animates chars `fromTo({yPercent:108},{yPercent:0,duration:.55,ease:"power2.out",stagger:.03})`; sibling `[data-card-item]` fields stagger in `fromTo({opacity:0,y:12},{opacity:1,y:0,duration:.45,ease:"power2.out",stagger:.05,delay:.1})`; leaving card's name+items fade out fast (`duration:.12,ease:"power1.out"`).
- Background bloom-tint div per card crossfades (`duration:.8,ease:"power2.inOut"`).
- Card uses `InlineCan` (targetHeight 2.7) + `Bloom` (size "72%") behind product copy.
- Dot nav below carousel scrolls the track via `element.scrollTo({left, behavior:"smooth"})` centering the target card.
- Below that, each flavor's `momentTag` rendered via `ScrollIlluminate` (`dim:.18, start:"top 88%", end:"top 52%"`), right-aligned, `clamp(26px,7.4vw,34px)`.
- Mobile heading "Three formulations." via `TextReveal` `split:"lines"`, `clamp(40px,11vw,56px)`.

---

## Inside.js

Ingredient "deck" section (`f` array, 4 entries) with per-ingredient icon glyphs (hand-drawn SVG paths keyed by stage index 0–3, drawn/undrawn via GSAP `drawSVG` plugin), matching the flavor pinned-stage pattern but with 4 steps instead of 3 and an interactive 3D can.

- Desktop: pinned scroll section, `ScrollTrigger.create({trigger:section, start:"top top", end:()=>"+="+4*window.innerHeight, pin:true, pinSpacing:true, scrub:1, snap:{snapTo:[0,.25,.5,.75,1], duration:{min:.2,max:.5}, ease:"power2.inOut", directional:false, delay:.1}, invalidateOnRefresh:true})`. Only attached if `matchMedia("min-width:768px")`.
- `onUpdate`: `activeIndex = clamp(0,3, floor(4*progress - 1e-4))`.
- Section heading "Inside." italic display font, `clamp(36px,4.4vw,56px)`, weight 300.
- Desktop pill nav (one button per ingredient) jumps to `pinStart + (pinEnd-pinStart)*(index/4)` via Lenis, duration 1.
- Ingredient name background halo div: colour crossfades to `f[index].haloColor` (`gsap.to(bg, {backgroundColor, duration:.5, ease:"power2.inOut"})`) — actual CSS colour transition via GSAP not native CSS transition.
- Ingredient heading (desktop) SplitText `type:"chars"`, entrance `fromTo({yPercent:22,opacity:0},{yPercent:0,opacity:1,duration:.8,ease:"power2.out",stagger:.022, scrollTrigger:{trigger:section,start:"top 75%",once:true}})`; on mobile (`matchMedia max-width:767px`) instead a simple `fromTo({y:22,opacity:0},{y:0,opacity:1,duration:.9,ease:"power2.out"})`. Reduced-motion: opacity set to 1 immediately, no animation.
- On stage change: outgoing name/counter/description group fades+rises out (`to({opacity:0,y:-26,duration:.22,ease:"power3.in"})`) then state swaps; incoming group fades+rises in (`fromTo({opacity:0,y:26},{opacity:1,y:0,duration:.45,delay:.1,ease:"power3.out",stagger:.05})`); the ingredient name additionally SplitText chars `fromTo({yPercent:60,opacity:0},{yPercent:0,opacity:1,duration:.55,ease:"power2.out",stagger:.028,delay:.12})` (skipped under reduced motion).
- Halo blob behind the can scales up: `fromTo({scale:1.45},{scale:1.6,duration:.9,ease:"power2.out"})` on every stage change (note: fromTo re-triggers scale 1.45→1.6 each time, not a persistent state).
- On hover over the ingredient name/icon (desktop): halo blob → `{opacity:.7, scale:1.75, duration:.6, ease:"power2.out"}`; on leave → `{opacity:.5, scale:1.6, duration:.7, ease:"power2.inOut"}`. Base non-hover halo opacity .5, scale 1.6 (consistent with the stage-change target above).
- SVG "molecule/bot" icon paths (`[data-bot]`) draw in on stage change via `gsap.fromTo(paths,{drawSVG:"0%"},{drawSVG:"100%",duration:.9,ease:"power1.inOut",stagger:.08,delay:.15})`; same paths also redraw on pointer-enter of the name (`duration:.7,stagger:.06`, no delay).
- Idle icon wobble: continuous `gsap.fromTo(svgIconGroup,{rotation:-3.5,transformOrigin:"50% 50%"},{rotation:3.5,duration:5,yoyo:true,repeat:-1,ease:"sine.inOut"})` (skipped under reduced motion).
- Dose bar: `gsap.fromTo(barFill,{scaleX:0},{scaleX: dosageMg/1150, duration:.8, delay:.25, ease:"power2.inOut"})` — 1150 = total blend mg across all 4 ingredients (matches Flavors' `y`).
- Dose counter: tweens a plain object `{val:0}` to `dosageMg` over .8s (delay .25, ease power2.out) each frame writing `Math.round(val)` into the counter `<span>` textContent (manual per-frame DOM write, not React state).
- Right info column ("Source", "Role", "Dose") static per ingredient, total denominator shown as `1150..toLocaleString()` i.e. `"1,150"`.

3D can panel (desktop only visually central column):
- `Canvas` `shadows:true`, `dpr=canvasDpr()`, `frameloop` gated by `useInView("1600px")`, `gl:{antialias:true,alpha:true,toneMapping:ACESFilmicToneMapping,toneMappingExposure:1.05}`, `camera:{position:[0,.4,7.2],fov:28}`.
- A tiny `g()` helper component calls `camera.lookAt(0,0,0)` once on mount.
- Lights: ambient .15; directional `[4,6,5]` intensity 1.4 white, `castShadow:true`, shadow map 1024x1024; directional `[-4,2,3]` intensity .5 (no shadow); directional `[0,4,-5]` intensity 1.2 (no shadow).
- `Can3D` (sku "01" fixed) driven by `controlledRotationY = (Math.PI/2) * activeIndex` (quarter-turn per ingredient step), `controlledTiltX:.2`, `enableParallax:true`.
- `ContactShadows` beneath: `position:[0,-1.4,0], opacity:.32, scale:4, blur:2, far:2, resolution:512, color:"#1a1b1d"`.

Mobile: horizontal snap carousel of 4 ingredient cards (same active-detection rAF pattern as Flavors mobile), name SplitText reveal identical pattern to Flavors mobile cards (`yPercent:108→0, duration:.5, stagger:.02`), dose bar width set directly via inline style (no GSAP) as `scaleX(dosageMg/1150)` with `transition-transform duration-700` (CSS transition, not GSAP tween, unlike desktop).

Footer line: "FOUR FUNCTIONAL INPUTS. CLINICAL DOSES. NOTHING ELSE." uppercase, letter-spacing .4em.

---

## Story.js

Timeline/chronicle section, 5 chapters (2021–2025), desktop = pinned horizontal-feel scroll with parallax photo stack; mobile = sticky vertical scroll-driven "photo reveal" sequence with clip-path wipe.

Data: `u` = 5 entries `{year, chapterTitle, paragraph, imageCaption, imageSrc}` covering founding (2021, Cuba Street) through 2025 (Melbourne launch, Monocle feature). `c = u.length = 5`.

### Intro (both breakpoints)
- Eyebrow "04 / STORY" fade group: `fromTo({y:32,opacity:0},{y:0,opacity:1,duration:.9,ease:"power3.out",stagger:.18, scrollTrigger:{trigger:section,start:"top 75%"}})`.
- Headline "Quietly built over five years." SplitText `words,chars` mask words: `fromTo(chars,{yPercent:115},{yPercent:0,duration:.8,ease:"power2.out",stagger:.016, scrollTrigger:{start:"top 75%",once:true}})`.
- Mobile-only lede paragraph rendered through `ScrollIlluminate` (default dim .24, default start/end).

### Desktop pinned stage
- `ScrollTrigger.create({trigger:stageEl, start:"top top", end:()=>"+="+window.innerHeight*(c-0.4), pin:true, pinSpacing:true, scrub:1, snap:{snapTo:[0, ...5 evenly-spaced points between .1 and 1], duration:{min:.25,max:.55}, ease:"power2.inOut"}, invalidateOnRefresh:true})` (only attached if `matchMedia(min-width:768px)`).
- `onUpdate`: intro overlay (eyebrow+headline+scroll-cue) fades out over the first 8% of progress (`opacity = 1 - min(1, progress/.08)`, `translateY(-40 * eased)`); a secondary "photo stack" wrapper fades in over the next 8% (`opacity = min(1, max(0, (progress-.04)/.08))`); a vertical timeline-rail fill scales in over the remaining 90% (`scaleY = min(1, max(0, (progress-.1)/.9))`); active chapter index derived with hysteresis bands of ±0.05 around each 1/(c-1) step boundary (same debounce technique as Flavors).
- Chapter photo stack: giant ghost 2-digit year watermark per chapter crossfades (font `clamp(340px,40vw,640px)`, weight 800, transparent + `WebkitTextStroke:"1.5px rgba(26,27,29,0.07)"`). Actual photo card (`aspect-ratio 4/5`, Next/Image `fill`) + caption "FIG. 0N · {caption}" crossfade/scale/slide on chapter change:
  - Entering: `fromTo({scale: forward?.86:1.14, opacity:0, y: forward?46:-46},{scale:1,opacity:1,y:0,duration:.9,ease:"power2.out",delay:.08, force3D:true})`.
  - Leaving: `to({scale: index<active?1.14:.86, opacity:0, y: index<active?-46:46, duration:.6, ease:"power2.in", force3D:true})`.
- Left-side chapter copy (year/title/rule/paragraph) exit/enter: exit `to({y:-24,opacity:0,duration:.22,ease:"power3.in"})` then swap; enter group `fromTo({y:24,opacity:0},{y:0,opacity:1,duration:.45,ease:"power3.out"})` with `[data-story-item]` children staggered `fromTo({y:16,opacity:0},{y:0,opacity:1,duration:.45,ease:"power2.out",stagger:.05,delay:.05})`.
- Right-side vertical year rail: 1px x 180px track, `scaleY` fill tied to scroll progress (origin top); year buttons jump via Lenis to `pinStart + (pinEnd-pinStart) * (0.1 + index/(c-1)*0.9)`, duration 1.2.

### Mobile sticky sequence
- Wrapper height `440svh`; inner `sticky top:0, h:100svh` viewport.
- `ScrollTrigger` (`start:"top top", end:"bottom bottom"`) drives a 5-step progress: `stepIndex = min(4, floor(5*progress))`, `stepLocalProgress = clamp01(5*progress - stepIndex)`.
- Per-frame helper `H()`: clips the current photo in from the bottom via `clip-path: inset(0% 0% {(1-min(1,localProgress/.42))*92}% 0%)` and fades opacity `.4 + .6*min(1,localProgress/.42)`; image itself scales down slightly as it reveals (`scale(1.12 - 0.12*min(1,localProgress/.55))`); paragraph words (pre-split, held at 0.24 opacity by default) light up progressively based on `(localProgress-.3)/.55` mapped across word count (same "illuminate" idea as ScrollIlluminate but hand-rolled per-frame instead of a scrub tween).
- Ghost year watermark per chapter: `min(60vw, 42svh)` font-size, same transparent+stroke treatment.
- Chapter change transition: incoming photo `fromTo({opacity:0, yPercent: 7*direction},{opacity:1, yPercent:0, duration:.6, ease:"power2.out"})`; outgoing photo/other photos fade `to({opacity:0,duration:.4,ease:"power2.in"})`; text block briefly fades `to({opacity:0,y:-12,duration:.16,ease:"power2.in"})` then swaps content and resets via SplitText re-split (title/paragraph get fresh word-split for the illuminate effect; title also gets a chars SplitText entrance `fromTo({yPercent:105},{yPercent:0,duration:.5,ease:"power2.out",stagger:.013})`, skipped under reduced motion).
- Bottom year-dot nav scrolls to `pinStart + (pinEnd-pinStart) * ((index+0.72)/5)` via Lenis, duration .9.

---

## Press.js

Dark section (`bg-ink`) with 3 pull-quotes + two counter-scrolling marquees of outlet names, marquee speed reactive to scroll velocity.

- Quote reveal: each quote's visible text (`[data-quote-visual]`) SplitText `type:"lines"`, mask lines, `autoSplit:true`: `fromTo(lines,{yPercent:115},{yPercent:0,duration:.85,ease:"power2.out",stagger:.09, delay:.12*index, scrollTrigger:{trigger:quoteEl,start:"top 85%",once:true}})`. A visually-hidden duplicate of the quote text exists for accessibility (`sr-only`) alongside the aria-hidden animated one.
- Figcaption (source) fades in separately: `fromTo({opacity:0,y:12},{opacity:1,y:0,duration:.6,ease:"power2.out", delay:.45+.12*index, scrollTrigger:{start:"top 85%",once:true}})`.
- Reduced-motion: SplitText/scroll entrance skipped entirely (quotes just set to opacity 1); marquees also skipped entirely when reduced-motion matches.
- Marquee 1 ("solid" outlet names row): `gsap.to(track,{xPercent:-50, duration:38, ease:"none", repeat:-1})` — continuous loop, duplicated content covers the -50% shift seamlessly.
- Marquee 2 ("outline" row, offset direction): `gsap.fromTo(track,{xPercent:-50},{xPercent:0, duration:52, ease:"none", repeat:-1})` — runs the opposite direction from marquee 1.
- Velocity-reactive skew + speed-up, tied to `ScrollTrigger.create({trigger:section, start:"top bottom", end:"bottom top", onUpdate:...})`:
  - Uses `st.getVelocity()`, clamps to skew degrees via `gsap.utils.clamp(-6,6)` on `-(velocity/420)`.
  - `quickSetter(marquee1TrackWrapper,"skewX","deg")` applied directly (`h(c.skew)`); when the new skew magnitude exceeds the currently-held one, animates the held skew value back to 0 over `duration:.9, ease:"power2.out"` (i.e. skew snaps toward the new value instantly then eases back to flat, re-triggered on stronger velocity).
  - Marquee timeScale reacts to `|velocity|`: `factor = clamp(1,4, 1 + |velocity|/1200)`; both marquee tweens get `timeScale: factor` over `duration:.4, ease:"power1.out"`, then eased back to `timeScale:1` over `duration:1.4, delay:.4, ease:"power2.out"` (overwrite:false so the reset doesn't cancel a fresh velocity spike).
- Outlet list: `["Meridian","The Long Lunch","Foldout","Salt Journal","Quiet Hours"]`. Solid row font `clamp(28px,3.4vw,50px)`, colour `rgba(239,237,230,0.85)`, separator dot 6px `#bcd3d8`. Outline row font `clamp(22px,2.6vw,38px)`, transparent fill with `WebkitTextStroke:"1px rgba(239,237,230,0.35)"`, separator dot 4px `rgba(188,211,216,0.5)`.
- Headline "Quietly noticed." via `TextReveal` `split:"lines"`, wordmark uppercase, `clamp(30px,4.2vw,56px)`, weight 900.

---

## WhereAvailable.js

Stockist directory (3 NZ cities) + "coming soon" city list + direct-order product cards, with a cursor-following can preview on desktop stockist hover.

Data: `m` = 3 cities (Wellington, Auckland, Christchurch), 5 named stockists each with address. `g` = coming-soon cities: Melbourne, Sydney, London, New York, Tokyo. `v = ["01","02","03"]` sku list for the cursor-follow can.

Entrance animations (all `scrollTrigger toggleActions:"play none none none"`, i.e. play once on enter, no reverse):
- Eyebrow "06 / Where available": `fromTo({y:40,opacity:0},{y:0,opacity:1,duration:.8,ease:"power3.out"}, start:"top 80%")`.
- Headline SplitText lines: `fromTo(lines,{yPercent:115},{yPercent:0,duration:.9,ease:"power2.out",stagger:.09, start:"top 80%", once:true})`.
- Each city column: column `fromTo({y:60,opacity:0},{y:0,opacity:1,duration:.8,ease:"power3.out", delay:.15*index*motionScale, start:"top 85%"})`; its `[data-stockist-item]` rows staggered `fromTo({y:12,opacity:0},{y:0,opacity:1,duration:.5,ease:"power2.out",stagger:.06*motionScale, delay:.15*index*motionScale+.25})`. `motionScale = matchMedia(max-width:767px) ? 0.7 : 1` (animation compressed on mobile).
- "COMING SOON" block: `fromTo({y:20,opacity:0},{y:0,opacity:1,duration:.8,ease:"power3.out", delay:.45*motionScale}, start:"top 90%")`.
- Divider rules (either side of "OR ORDER DIRECT"): `fromTo({scaleX:0},{scaleX:1,duration:.6,ease:"power3.out"}, start:"top 88%")`; the label text: `fromTo({opacity:0},{opacity:1,duration:.6,ease:"power3.out",delay:.15}, start:"top 88%")`.
- Direct-order product cards (desktop grid): `fromTo({y:80,opacity:0,scale:.96},{y:0,opacity:1,scale:1,duration:1,ease:"power3.out", delay:.2*index*motionScale}, start:"top 85%")`.

City accordion (mobile collapses to accordion, desktop always expanded via `md:pointer-events-none` on the toggle button): clicking a city header toggles `openCity` state; chevron rotates 180° when open (`transition-transform duration-300`). List rows have a hover "invert" effect: an absolutely-positioned `bg-ink` panel scales up from `scale-y-0` to `scale-y-100` on hover (`transition-transform duration-[350ms] ease-out`, `origin-bottom`), text colour flips to bone, row content translates `translate-x-3`, and a trailing arrow fades/slides in (`opacity-0 -translate-x-2` → `opacity-100 translate-x-0`).

Cursor-follow can preview (desktop only, `pointer:fine` gated):
- `gsap.quickTo(el,"x",{duration:.5,ease:"power2.out"})` / same for y, offset `clientX+26, clientY-200` (follows cursor, offset up-right).
- Preview box: `170px x 215px`, fixed, z-40, hidden on mobile.
- Visibility/scale: `gsap.to(el,{opacity:+!!show, scale: show?1:.92, duration:.4, ease:"power2.out"})` where `show = inView && hoveredCityIndex!=null && canReadyState[hoveredIndex]==="ready"`.
- Each city's preview stacks a `Bloom` glow (`size:"150%"`, colour = that index's flavor bloomColor) + an `InlineCan` (sku from `v[]`, `targetHeight:2.4`, `active:inView`) + caption `"Pouring in {city}"`.
- `InlineCan`'s `onFirstFrame` marks that city's can as `"ready"` in a 3-slot state array, gating the fade-in above (avoids showing an unrendered/blank canvas).

Product card (`f` component, shared between desktop grid, mobile modal, and mobile quick-add strip):
- 4-pack / 12-pack toggle buttons (pill, 36px tall, border `1px solid var(--color-ink)`, active = filled ink bg / bone text).
- Price shown as `$fourPack` or `$twelvePack` (24 / 66 NZD flat across all flavors), "Subscribe and save 15%" serif italic caption.
- "ADD TO CART" button: adds one-time-purchase line, opens cart, shows a 1500ms "ADDED" checkmark state (`window.setTimeout`), hover swaps `var(--color-ink)` → `var(--color-alpine)` via JS mouseenter/leave (not CSS hover).
- "Subscribe instead" link: adds subscription-priced line (`subscriptionPrice(unitPrice)`), opens cart, arrow nudges right on hover.
- Card hover: `hover:-translate-y-1` + `hover:scale-[1.04]` on the image wrapper, box-shadow set via JS mouseenter/leave to `0 12px 32px rgba(26,27,29,0.06)`.
- On city-open/close, `requestAnimationFrame` x2 then `ScrollTrigger.refresh()` (to recompute trigger positions after layout shift from accordion).
- Mobile product modal (`fitContent:true`) is a full-screen dialog when a product card is tapped from the quick-add strip; body scroll locked while open.

---

## Footer.js

- Newsletter form posts `{email, source:"footer newsletter"}` to `/api/notify`; states idle/sending/done/error; message text set via `aria-live="polite"`.
- Headline "Get notified when we ship to your city." via `TextReveal split:"lines"`, `clamp(30px,3.6vw,52px)`.
- Wordmark + coloured square dot uses `flavors[0].bloomColor` (Clear's `#bcd3d8`) as the accent, not a fixed brand colour.
- Site links: Flavors/Inside/Story/Stockists/Shop anchors; Legal: Privacy/Terms.
- Copyright line: `© {currentYear} STILL Beverages Ltd.` / `Made in Wellington, New Zealand.` — no animation, plain static text.
- No ScrollTrigger/GSAP entrance animations in this file beyond the `TextReveal` headline (everything else renders statically).

---

## Can3D (raw bundle, module 29083 — used by Hero, Flavors, Inside, InlineCan, WhereAvailable)

Model: `/models/can.glb`, preloaded via `useGLTF.preload` equivalent (`d6.preload`) at module load. Loaded once via `d6("/models/can.glb")`.

Fit/scale on load:
- Computes a `Box3` bounding box of the cloned scene, gets size/center.
- `fitScale = targetHeight / boxSize.y` (default `targetHeight=2.2`, overridden per caller: 2.55 in Flavors, 2.7 in InlineCan flavor cards, 2.5 default InlineCan prop, 2.4 WhereAvailable cursor can, 2.3 mobile quick-add).
- Applies `scene.scale.setScalar(fitScale)` and recenters via `position.set(-center.x*scale, -center.y*scale, -center.z*scale)`.
- Logs a one-time console.info of raw size/fitScale/mesh vertex counts (`pi` flag ensures once only) — dev/debug leftover.
- Picks the "body" mesh by name heuristic (`name.toLowerCase()` includes "body"/"label"/"main"/"side"/"cylinder") or falls back to the mesh with the most vertices, assigns it the label material; every other mesh gets the metal material. All meshes get `castShadow=true, receiveShadow=true`.

Materials:
- Metal/cap material `M`: `MeshStandardMaterial`-equivalent, `color:"#C8C8C8"`, `metalness:.95`, `roughness:.42`, `envMapIntensity:.85`, `transparent:true`, `opacity: !heroMotion` initial (1 unless in hero entrance mode, where it starts hidden and fades in).
- Label/body material `C`: same base but `map: labelTexture`, `color:"#ffffff"`, `metalness:.05`, `roughness:.65`, `envMapIntensity:.6`, same transparent/opacity logic.
- Label textures per flavour (loaded via a texture loader, `colorSpace: srgb`, `anisotropy:16`, `minFilter/magFilter` set, `flipY:false`, `center:(.5,.5)`, `offset:(-.14,-.34)`, no repeat/rotation change):
  - `"01"` → `/textures/labels/still-01-clear.png`
  - `"02"` → `/textures/labels/still-02-dawn.png`
  - `"03"` → `/textures/labels/still-03-dusk.png`
  - Default fallback is `"01"`'s texture.
- No per-flavor colour override on the materials themselves (colour comes entirely from the label PNG texture); no clearcoat used.

Tone mapping / exposure: not set inside Can3D itself — set by each parent `<Canvas gl={{toneMapping:ACESFilmicToneMapping, toneMappingExposure:1.05}}>` consistently across Hero, Flavors, Inside, InlineCan, WhereAvailable (every usage found uses exposure 1.05).

Idle / motion behaviour (per-frame in `useFrame`, mutually exclusive branches):
1. **Hero entrance mode** (`heroMotion:true`, driven separately in Hero.js — noted here only for the shared math): can drops in and settles over 1.6s using a custom ease blend (`easeOutQuart` for position/opacity, a quint in/out custom curve for rotation), starting `position.y:4`, `rotation.x: 35°`, `rotation.y: -540°`, `scale:0.8`, animating to `y:0, rot back to natural pose, scale:1`, materials fade opacity 0→1 over the same window. After settling, continuous idle bob: `position.y = 0.06 * sin(2π/6 * timeSincSettle)` (6-second idle bob period, amplitude 0.06 units), plus drag/pointer offsets layered on top (see below).
2. **Controlled mode** (`controlledRotationY` prop set — used by Inside/Flavors/InlineCan/WhereAvailable for section-driven poses): smoothly lerps current rotation.y toward the target: `rotY += (target - rotY) * 0.06` per frame (roughly a 1-pole low-pass, not frame-rate compensated beyond the 0.06 constant). If `enableParallax`, adds small pointer-parallax offsets: `zOffset += (0.15*pointer.x - zOffset)*0.05`, `xTiltOffset += (0.08*pointer.y - xTiltOffset)*0.05`, added to rotation y/x respectively; else parallax terms held at 0. `rotation.x = controlledTiltX + parallax`. If a `stageMotionRef` is supplied (Flavors' per-can stage state), it overrides position/rotation.z/scale/opacity directly from that ref's `{x,y,rotZ,scale,opacity}` each frame (used for the flavor-stage enter/exit choreography).
3. **Free/default mode** (no `controlledRotationY`, not hero): continuous auto-rotation `rotation.y += (2π / rotationPeriodSeconds) * delta`; if `enableTilt`, adds subtle pointer-reactive tilt: `targetTiltX = 0.05 - 0.1*pointer.y`, lerped in at 0.045; `targetTiltZ = 0.03*pointer.x`, lerped at 0.045.

Drag interaction (hero/interactive can only, `heroMotion` path — pointer handlers only wired when `heroMotion` true):
- `onPointerDown`: captures pointer, sets dragging flag, cursor→"grabbing" (routes through the custom cursor's `has-custom-cursor` class check, hiding the native cursor when the custom one is active).
- `onPointerMove` while dragging: `rotY = dragStartRotY + 0.005 * deltaX`; `tiltX = dragStartTiltX + 0.005 * deltaY` (i.e. drag sensitivity 0.005 rad/px on both axes).
- `onPointerUp`/`onPointerLeave`: releases capture, cursor→"grab" if still hovering else "auto".
- After release, momentum/pointer-follow blends back in via `pointerFollowRef`/`pointerRotYRef`/`lockBlendRef` (a "lock blend" factor `v` interpolates rotation speed between drag-follow and free spin: follow strength `0.055 + 0.1*lockBlend`).
- A secondary "kick" physics term (`W.current`, angular-velocity-like) is derived from the rate of change of the pointer-follow x-offset, clamped to ±0.22, smoothed at 0.075, and applied to `rotation.z` — a subtle wobble/inertia roll when the pointer swings the can quickly.
- `dollyRef` (if present) adds an extra multiplicative scale term: `scale *= 1 + dollyRef.current`.

Cursor handling: while custom cursor active (`document.documentElement.classList.contains("has-custom-cursor")`), Can3D never sets the native canvas cursor to anything but `"none"`; otherwise it sets `grab`/`grabbing`/`auto` on the WebGL canvas element directly.
