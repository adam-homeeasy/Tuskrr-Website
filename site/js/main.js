/* Tuskrr site. Every duration, ease and offset below is from the drinkstill.nz
   teardown (01-teardown/teardown.md, 02-data/motion.json); SPEC.md maps each
   STILL zone to its Tuskrr counterpart. */
(() => {
  'use strict';
  const { gsap, ScrollTrigger, SplitText, Lenis } = window;
  const root = document.documentElement;
  if (!gsap || !ScrollTrigger) { root.classList.add('js-off'); document.body.classList.remove('is-loading'); return; }
  gsap.registerPlugin(ScrollTrigger, SplitText);

  const q = (s, el = document) => el.querySelector(s);
  const qa = (s, el = document) => Array.from(el.querySelectorAll(s));
  const clamp = (a, b, v) => Math.min(b, Math.max(a, v));
  const params = new URLSearchParams(location.search);
  const DESK = matchMedia('(min-width: 768px)').matches;
  const FINE = matchMedia('(pointer: fine)').matches;
  const REDUCE = params.get('motion') === 'off' || (params.get('motion') !== 'force' && matchMedia('(prefers-reduced-motion: reduce)').matches);

  // The layout is chosen once at load, like STILL. Crossing 768 px reloads
  // rather than trying to re-pin a live page (STILL's live resize broke).
  let wasDesk = DESK;
  addEventListener('resize', () => {
    const d = matchMedia('(min-width: 768px)').matches;
    if (d !== wasDesk) { wasDesk = d; location.reload(); }
  });

  /* ---------- smooth scroll: Lenis {lerp .1, smoothWheel} on GSAP's ticker ---------- */
  let lenis = null;
  if (Lenis && !REDUCE) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToY = (y, duration = 1.2) => (lenis ? lenis.scrollTo(y, { duration }) : scrollTo({ top: y, behavior: REDUCE ? 'auto' : 'smooth' }));
  const pinStart = {}; // section id -> ScrollTrigger, so nav links land on the pin start
  qa('[data-scroll]').forEach((a) => a.addEventListener('click', (e) => {
    const id = a.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    e.preventDefault();
    if (id === '#top') return scrollToY(0);
    const el = q(id);
    if (!el) return;
    const st = pinStart[id.slice(1)];
    const navH = DESK && !st ? 72 : 0;
    scrollToY(st ? st.start + 2 : el.getBoundingClientRect().top + scrollY - navH);
  }));

  /* ---------- text helpers (TextReveal) ---------- */
  function splitChars(el) {
    const s = SplitText.create(el, { type: 'chars', mask: 'chars', charsClass: 'ch' });
    return s.chars;
  }
  function splitLines(el) {
    const s = SplitText.create(el, { type: 'lines', mask: 'lines', linesClass: 'ln' });
    return s.lines;
  }

  /* ---------- preloader ---------- */
  const pre = q('[data-preloader]');
  function lockScroll(on) {
    root.classList.toggle('locked', on);
    if (lenis) on ? lenis.stop() : lenis.start();
  }
  const block = (e) => { e.preventDefault(); e.stopPropagation(); };

  function runPreloader(done) {
    if (!pre) return done();
    lockScroll(true);
    addEventListener('wheel', block, { passive: false, capture: true });
    addEventListener('touchmove', block, { passive: false, capture: true });
    scrollTo(0, 0);
    const inner = q('[data-pl-inner]');
    const mark = q('[data-pl-mark]');
    const count = q('[data-pl-count]');
    const bar = q('[data-pl-bar]');
    gsap.fromTo(inner, { y: '-0.6em', opacity: 0 }, { y: '0em', opacity: 1, duration: 0.45, ease: 'power2.out' });

    let pills = null;
    if (!REDUCE) {
      const els = qa('[data-pop]');
      pills = gsap.timeline({ repeat: -1, repeatDelay: 0.3, delay: 0.5 });
      els.forEach((p, n) => {
        const t = 0.42 * n, rot = n % 2 ? 3.5 : -3.5;
        pills.fromTo(p, { opacity: 0, scale: 0.55, y: 10, rotation: rot, filter: 'blur(8px)' },
          { opacity: 1, scale: 1, y: 0, rotation: 0, filter: 'blur(0px)', duration: 0.45, ease: 'back.out(1.6)' }, t)
          .to(p, { y: -6, duration: 0.95, ease: 'sine.inOut' }, t + 0.45)
          .to(p, { opacity: 0, y: -18, scale: 0.94, filter: 'blur(5px)', duration: 0.32, ease: 'power2.in' }, t + 1.4);
      });
    }

    // Progress: images in the first two sections plus fonts. Minimum 2.2 s, maximum 9 s.
    const MIN = REDUCE ? 0.4 : 2.2, MAX = 9;
    const imgs = qa('#hero img, #collection img');
    let loaded = 0;
    const total = imgs.length + 1;
    const tick = () => { loaded++; };
    imgs.forEach((im) => {
      if (im.complete) tick();
      else { im.loading = 'eager'; im.addEventListener('load', tick, { once: true }); im.addEventListener('error', tick, { once: true }); }
    });
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(tick);

    const t0 = performance.now();
    const shown = { v: 0 };
    let finished = false;
    const update = () => {
      const el = (performance.now() - t0) / 1000;
      const target = el > MAX ? 1 : Math.min(loaded / total, el / MIN);
      shown.v += (target - shown.v) * 0.12;
      if (target >= 1 && shown.v > 0.995) shown.v = 1;
      count.textContent = String(Math.round(shown.v * 100)).padStart(3, '0');
      bar.style.transform = `scaleX(${shown.v})`;
      if (shown.v === 1 && !finished) { finished = true; gsap.ticker.remove(update); handoff(); }
    };
    gsap.ticker.add(update);

    function handoff() {
      const tl = gsap.timeline({
        onComplete: () => {
          pills && pills.kill();
          pre.remove();
          removeEventListener('wheel', block, true);
          removeEventListener('touchmove', block, true);
          lockScroll(false);
          document.body.classList.remove('is-loading');
          ScrollTrigger.refresh();
        },
      });
      tl.to({}, { duration: 0.4 });
      tl.call(done);
      const target = q('[data-hero-mark] svg');
      if (DESK && target && !REDUCE) {
        tl.call(() => {
          const a = mark.getBoundingClientRect(), b = target.getBoundingClientRect();
          gsap.set(mark, { transformOrigin: '50% 50%' });
          gsap.to(mark, {
            x: `+=${b.left + b.width / 2 - (a.left + a.width / 2)}`,
            y: `+=${b.top + b.height / 2 - (a.top + a.height / 2)}`,
            scale: b.width / a.width, duration: 0.9, ease: 'power3.inOut',
          });
          gsap.to('.pl-pills, .pl-foot', { opacity: 0, duration: 0.3 });
        });
        tl.to({}, { duration: 0.9 });
        tl.to(pre, { opacity: 0, duration: 0.35, ease: 'power1.out' }, '-=0.35');
      } else {
        tl.to(mark, { scale: 1.6, duration: 0.55, ease: 'power2.in' });
        tl.to(pre, { opacity: 0, duration: 0.5, ease: 'power1.inOut' }, '<');
      }
    }
  }

  /* ---------- hero lens ---------- */
  const hero = q('[data-hero]');
  const heroDark = q('[data-hero-dark]');
  const heroLight = q('[data-hero-light]');
  const ring = q('[data-hero-ring]');
  const heroGlow = q('[data-hero-glow]');
  const heroBag = q('[data-hero-bag] img');
  const heroBox = q('[data-hero-bag]');
  const tilt = q('[data-tilt]');
  const bob = q('[data-bob]');
  const heroCol = q('[data-hero-col]');
  const L = { x: innerWidth * 0.5, y: innerHeight * 0.48, entrance: 0, swell: 0, breath: 0, scrollBoost: 0 };
  const H = { blend: 0, dolly: 1, mx: 0.5, my: 0.5, gx: 0, gy: 0, rx: 0, ry: 0, tx: 0, progress: 0 };
  let heroST = null;

  function heroEntrance() {
    if (!hero) return;
    if (REDUCE) { gsap.set(L, { entrance: 1 }); return; }
    gsap.to(L, { entrance: 1, duration: 1.2, delay: 0.15, ease: 'power2.inOut' });
    // The bag drops in over 1.6 s (STILL's can: from 4 units up, tipped forward, scale 0.8).
    gsap.fromTo(heroBag, { yPercent: -60, rotation: -14, scale: 0.8, opacity: 0 },
      { yPercent: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.6, ease: 'power4.out', clearProps: 'rotation' });
    gsap.to(bob, { y: -10, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: 1.6 });
  }

  function setupHero() {
    if (!hero) return;
    if (!DESK) {
      if (!REDUCE) gsap.to(bob, { y: -8, duration: 3, ease: 'sine.inOut', yoyo: true, repeat: -1 });
      return;
    }
    if (!REDUCE) gsap.to(L, { breath: 9, duration: 2.2, yoyo: true, repeat: -1, ease: 'sine.inOut' });
    const qx = gsap.quickTo(L, 'x', { duration: 0.62, ease: 'power2.out' });
    const qy = gsap.quickTo(L, 'y', { duration: 0.62, ease: 'power2.out' });
    let last = null, idle = null;
    addEventListener('pointermove', (e) => {
      H.mx = e.clientX / innerWidth; H.my = e.clientY / innerHeight;
      if (REDUCE || H.progress >= 1) return;
      qx(e.clientX); qy(e.clientY);
      const now = performance.now();
      if (last) {
        const dt = Math.max(16, now - last.t);
        const speed = Math.hypot(e.clientX - last.x, e.clientY - last.y) / dt * 1000;
        gsap.to(L, { swell: Math.min(130, speed / 2200 * 130), duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
        idle && idle.kill();
        idle = gsap.delayedCall(0.3, () => gsap.to(L, { swell: 0, duration: 1.1, ease: 'power2.out', overwrite: 'auto' }));
      }
      last = { x: e.clientX, y: e.clientY, t: now };
    });

    const R0 = 459 / 2;
    gsap.ticker.add(() => {
      if (H.progress >= 1) return;
      const r = 170 * L.entrance + L.swell + L.breath * L.entrance + L.scrollBoost;
      heroDark.style.clipPath = `circle(${r.toFixed(1)}px at ${L.x.toFixed(1)}px ${L.y.toFixed(1)}px)`;
      ring.style.transform = `translate(${(L.x - R0).toFixed(1)}px, ${(L.y - R0).toFixed(1)}px) scale(${(r / 170).toFixed(4)})`;
      ring.style.opacity = Math.max(0, L.entrance * (1 - L.scrollBoost / 240)).toFixed(3);
      // Glow drifts toward the pointer (0.85 of the distance, 0.06 per frame), fading out past 0.6.
      const drift = 1 - clamp(0, 1, (H.progress - 0.6) / 0.2);
      const tgx = (L.x - innerWidth * 0.5) * 0.85 * drift, tgy = (L.y - innerHeight * 0.48) * 0.85 * drift;
      H.gx += (tgx - H.gx) * 0.06; H.gy += (tgy - H.gy) * 0.06;
      heroGlow.style.transform = `translate(${H.gx.toFixed(1)}px, ${H.gy.toFixed(1)}px) scale(${H.dolly.toFixed(4)})`;
      // The bag turns toward the pointer; the follow fades out as blend goes 0 to 1 and it recentres.
      const f = REDUCE ? 0 : 1 - H.blend;
      H.ry += ((H.mx - 0.5) * 24 * f - H.ry) * 0.08;
      H.rx += (-(H.my - 0.5) * 10 * f - H.rx) * 0.08;
      H.tx += ((H.mx - 0.5) * 40 * f + H.blend * innerWidth * 0.1 - H.tx) * 0.08;
      heroBox.style.transform = `translate(calc(-50% + ${H.tx.toFixed(1)}px), -50%) scale(${H.dolly.toFixed(4)})`;
      tilt.style.transform = `rotateY(${H.ry.toFixed(2)}deg) rotateX(${H.rx.toFixed(2)}deg)`;
    });

    const colItems = heroCol.children;
    let colOn = false;
    const showCol = () => {
      colOn = true;
      gsap.killTweensOf(colItems);
      if (REDUCE) return gsap.set(colItems, { opacity: 1, y: 0 });
      gsap.fromTo(colItems, { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.55, stagger: 0.08, ease: 'power2.out' });
      gsap.fromTo(q('.rule', heroCol), { scaleX: 0 }, { scaleX: 1, duration: 0.55, delay: 0.16, ease: 'power2.out' });
    };
    const hideCol = () => { colOn = false; gsap.killTweensOf(colItems); gsap.to(colItems, { opacity: 0, duration: 0.25 }); };

    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to(L, { scrollBoost: () => 1.2 * Math.hypot(innerWidth, innerHeight), duration: 0.55, ease: 'power2.in' }, 0)
      .to(H, { blend: 1, duration: 0.6, ease: 'power1.inOut' }, 0)
      .to(H, { dolly: 1.09, duration: 1 }, 0)
      .to('[data-cue]', { opacity: 0, duration: 0.15, ease: 'power1.out' }, 0)
      .to(heroLight, { opacity: 0, duration: 0.15 }, 0.48);
    heroST = ScrollTrigger.create({
      trigger: hero, start: 'top top', end: '+=120%', pin: true, scrub: true, animation: tl,
      onUpdate: (self) => {
        H.progress = self.progress;
        if (self.progress > 0.58 && !colOn) showCol();
        else if (self.progress < 0.35 && colOn) hideCol();
      },
      onLeave: () => { heroDark.style.clipPath = 'none'; ring.style.opacity = 0; },
      onEnterBack: () => { H.progress = 0.999; },
    });
    pinStart.hero = heroST;

    // Scroll cue: the dot drops 19 px and fades, every 1.15 s with a 0.5 s pause.
    if (!REDUCE) {
      gsap.timeline({ repeat: -1, repeatDelay: 0.5 }).set('[data-cue-dot]', { y: 0, opacity: 0 })
        .to('[data-cue-dot]', { opacity: 1, duration: 0.25, ease: 'power1.out' })
        .to('[data-cue-dot]', { y: 19, duration: 1, ease: 'power2.inOut' }, 0.1)
        .to('[data-cue-dot]', { opacity: 0, duration: 0.3, ease: 'power1.in' }, 0.85);
    } else gsap.set('[data-cue-dot]', { opacity: 1, y: 9 });
  }

  /* ---------- pinned stage with snapping and hysteresis (Flavours, Inside) ---------- */
  function pinnedStage({ el, screens, onChange, snaps, indexAt, onProgress }) {
    let idx = 0;
    const st = ScrollTrigger.create({
      trigger: el, start: 'top top', end: () => `+=${screens * innerHeight}`, pin: true, scrub: 1,
      snap: { snapTo: snaps, duration: { min: 0.25, max: 0.55 }, ease: 'power2.inOut', delay: 0.1 },
      onUpdate: (self) => {
        onProgress && onProgress(self.progress);
        const next = indexAt(self.progress, idx);
        if (next !== idx) { const dir = next > idx ? 1 : -1; const prev = idx; idx = next; onChange(next, prev, dir); }
      },
    });
    return { st, get idx() { return idx; } };
  }
  // Switch only once progress is a margin past the boundary, so snap points never flicker.
  // STILL uses ±0.05 on thirds, i.e. 15% of a step.
  const hysteresis = (bounds, margin) => (p, cur) => {
    let target = 0;
    bounds.forEach((b) => { if (p >= b) target++; });
    if (target > cur && p < bounds[target - 1] + margin) return cur;
    if (target < cur && p > bounds[target] - margin) return cur;
    return target;
  };

  /* ---------- collection ---------- */
  function setupCollection() {
    const sec = q('[data-stage]');
    if (!sec) return;
    const stage = q('.stage', sec);
    const slides = qa('[data-slide]', sec);
    const N = slides.length;
    const title = q('[data-split-chars]', sec);

    if (!DESK) {
      reveal(qa('.stage-head > *', sec));
      return;
    }

    const glows = qa('[data-glow]', sec), ghosts = qa('[data-ghost]', sec), sides = qa('[data-side]', sec);
    const dots = qa('[data-dot]', sec), countEl = q('[data-count]', sec);
    const names = slides.map((s) => q('[data-name]', s));
    slides[0].classList.add('on'); dots[0].classList.add('on');

    // Heading: eyebrow rises from y 14; title characters rise from yPercent 115 at top 80%.
    if (!REDUCE) {
      const chars = splitChars(title);
      gsap.from(q('.eyebrow', sec), { y: 14, opacity: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: sec, start: 'top 80%', once: true } });
      gsap.from(chars, { yPercent: 115, duration: 0.8, stagger: 0.022, ease: 'power2.out', scrollTrigger: { trigger: sec, start: 'top 80%', once: true } });
      gsap.from([q('[data-copy]', slides[0]), q('.stage-count', sec), q('.stage-dots', sec)], { y: 70, opacity: 0, duration: 1, stagger: 0.12, ease: 'power2.out', scrollTrigger: { trigger: sec, start: 'top 55%', once: true } });
      gsap.from(q('.bag', slides[0]), { x: 220, rotation: -9, scale: 0.94, opacity: 0, duration: 0.85, ease: 'power2.out', scrollTrigger: { trigger: sec, start: 'top 55%', once: true } });
    }

    const nameChars = [];
    const change = (i, prev, dir) => {
      countEl.textContent = i + 1;
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
      const side = i % 2 === 0 ? 1 : -1; // right, left, right...
      const inS = slides[i], outS = slides[prev];
      inS.classList.add('on');
      if (REDUCE) {
        outS.classList.remove('on');
        glows.forEach((g, k) => gsap.set(g, { opacity: k === i ? 0.92 : 0 }));
        ghosts.forEach((g, k) => gsap.set(g, { opacity: k === i ? 1 : 0 }));
        sides.forEach((g, k) => gsap.set(g, { opacity: k === i ? 1 : 0 }));
        return;
      }
      const inBag = q('.bag', inS), outBag = q('.bag', outS);
      gsap.killTweensOf([inBag, outBag]);
      gsap.to(outBag, { x: -side * 160, y: -6, rotation: side * 8, scale: 0.94, opacity: 0, duration: 0.45, ease: 'power2.in' });
      gsap.fromTo(inBag, { x: side * 220, y: 8, rotation: -side * 9, scale: 0.94, opacity: 0 },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 0.85, delay: 0.1, ease: 'power2.out' });
      glows.forEach((g, k) => gsap.to(g, { opacity: k === i ? 0.92 : 0, duration: 0.8, ease: 'power2.inOut', overwrite: 'auto' }));
      ghosts.forEach((g, k) => {
        if (k === i) gsap.fromTo(g, { opacity: 0, y: dir * 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power2.inOut', overwrite: true });
        else gsap.to(g, { opacity: 0, y: k === prev ? -dir * 40 : 0, duration: 0.8, ease: 'power2.inOut', overwrite: true });
      });
      sides.forEach((g, k) => gsap.to(g, k === i ? { opacity: 1, duration: 0.45, delay: 0.25, overwrite: true } : { opacity: 0, duration: 0.25, overwrite: true }));
      // Copy: out to y -26 (0.25 s), then in from y 26 (0.45 s), lines 0.05 s apart; name characters re-rise.
      const outLines = qa('[data-line], [data-name]', outS);
      gsap.killTweensOf(outLines);
      gsap.to(outLines, { y: -26, opacity: 0, duration: 0.25, ease: 'power3.in', onComplete: () => { if (slides[ctl.idx] !== outS) outS.classList.remove('on'); } });
      const inLines = qa('[data-line], [data-name]', inS);
      gsap.killTweensOf(inLines);
      gsap.fromTo(inLines, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, delay: 0.25, stagger: 0.05, ease: 'power3.out' });
      if (!nameChars[i]) nameChars[i] = splitChars(names[i]);
      gsap.fromTo(nameChars[i], { yPercent: 108 }, { yPercent: 0, duration: 0.5, delay: 0.3, stagger: 0.02, ease: 'power2.out' });
    };
    const bounds = Array.from({ length: N - 1 }, (_, k) => (k + 0.5) / N);
    const snaps = Array.from({ length: N + 1 }, (_, k) => k / N);
    const ctl = pinnedStage({ el: stage, screens: N * 0.75, snaps, indexAt: hysteresis(bounds, 0.15 / N), onChange: change });
    pinStart.collection = ctl.st;
    dots.forEach((d, k) => d.addEventListener('click', () => {
      const st = ctl.st;
      scrollToY(st.start + (st.end - st.start) * (k / N) + 1, 1);
    }));
  }

  /* ---------- inside ---------- */
  const FMT = {
    leather: (v) => `${v} of 6`,
    warranty: (v) => v.toLocaleString('en-IN'),
    initials: (v) => `${v} days`,
    cod: (v) => `₹${v.toLocaleString('en-IN')}`,
  };
  function drawIcon(svg) {
    if (!svg || REDUCE) return;
    const paths = qa('path, circle', svg);
    paths.forEach((p) => { const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len; });
    gsap.to(paths, { strokeDashoffset: 0, duration: 0.9, stagger: 0.08, delay: 0.15, ease: 'power1.inOut', overwrite: 'auto' });
  }
  function runMeter(m, instant) {
    if (!m) return;
    const from = +m.dataset.from, to = +m.dataset.to, of = +m.dataset.of, fmt = FMT[m.dataset.fmt];
    const v = q('[data-meter-v]', m), bar = q('[data-meter-bar]', m);
    if (instant || REDUCE) { v.textContent = fmt(to); bar.style.transform = `scaleX(${to / of})`; return; }
    const o = { n: from };
    gsap.fromTo(bar, { scaleX: from / of }, { scaleX: to / of, duration: 0.8, delay: 0.25, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(o, { n: to, duration: 0.8, delay: 0.25, ease: 'power2.out', onUpdate: () => { v.textContent = fmt(Math.round(o.n)); } });
  }

  function setupInside() {
    const sec = q('[data-inside]');
    if (!sec) return;
    const stage = q('.in-stage', sec);
    const steps = qa('[data-step]', sec);
    const N = steps.length;
    const icons = steps.map((s) => q('[data-icon]', s));
    if (!REDUCE) icons.forEach((ic, k) => gsap.to(ic, { rotation: k % 2 ? 3.5 : -3.5, duration: 5, ease: 'sine.inOut', yoyo: true, repeat: -1 }));

    if (!DESK) {
      reveal(qa('.in-head > *', sec));
      return;
    }

    const pills = qa('[data-pill]', sec), halo = q('[data-halo]', sec);
    const names = steps.map((s) => q('[data-name]', s));
    const chars = [];
    steps[0].classList.add('on'); pills[0].classList.add('on');
    gsap.set(halo, { scale: 1.45 });
    let first = true;
    ScrollTrigger.create({ trigger: sec, start: 'top 60%', once: true, onEnter: () => { if (first) { first = false; drawIcon(icons[0]); runMeter(q('[data-meter]', steps[0])); } } });
    if (!REDUCE) gsap.from(qa('.in-head > *', sec), { y: 26, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out', scrollTrigger: { trigger: sec, start: 'top 70%', once: true } });

    const change = (i, prev, dir) => {
      pills.forEach((p, k) => p.classList.toggle('on', k === i));
      const inS = steps[i], outS = steps[prev];
      inS.classList.add('on');
      halo.style.setProperty('--c', inS.style.getPropertyValue('--c'));
      if (REDUCE) { outS.classList.remove('on'); runMeter(q('[data-meter]', inS), true); return; }
      gsap.fromTo(halo, { scale: 1.45 }, { scale: 1.6, duration: 0.9, ease: 'power2.out', yoyo: true, repeat: 1, overwrite: 'auto' });
      // The bag turns a quarter as it swaps, standing in for STILL's can rotating per step.
      const inBag = q('.bag', inS), outBag = q('.bag', outS);
      gsap.to(outBag, { rotationY: dir * 60, opacity: 0, scale: 0.94, duration: 0.45, ease: 'power2.in', overwrite: 'auto' });
      gsap.fromTo(inBag, { rotationY: -dir * 60, opacity: 0, scale: 0.94 }, { rotationY: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.1, ease: 'power2.out', overwrite: 'auto' });
      const outLines = qa('[data-line], [data-name], [data-icon]', outS);
      gsap.to(outLines, { y: -26, opacity: 0, duration: 0.22, ease: 'power3.in', overwrite: 'auto', onComplete: () => { if (steps[ctl.idx] !== outS) outS.classList.remove('on'); } });
      const inLines = qa('[data-line], [data-name], [data-icon]', inS);
      gsap.fromTo(inLines, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, delay: 0.22, stagger: 0.05, ease: 'power3.out', overwrite: 'auto' });
      if (!chars[i]) chars[i] = splitChars(names[i]);
      gsap.fromTo(chars[i], { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.55, delay: 0.25, stagger: 0.028, ease: 'power2.out' });
      drawIcon(icons[i]);
      runMeter(q('[data-meter]', inS));
    };
    const ctl = pinnedStage({
      el: stage, screens: N, snaps: [0, 0.25, 0.5, 0.75, 1],
      indexAt: hysteresis([0.25, 0.5, 0.75], 0.15 / N), onChange: change,
    });
    pinStart.inside = ctl.st;
    pills.forEach((p, k) => p.addEventListener('click', () => scrollToY(ctl.st.start + (ctl.st.end - ctl.st.start) * (k / N) + 2, 1)));
    // Hovering the name grows the halo and redraws the icon.
    names.forEach((n, k) => {
      n.addEventListener('mouseenter', () => { gsap.to(halo, { scale: 1.75, opacity: 0.7, duration: 0.5, overwrite: 'auto' }); drawIcon(icons[k]); });
      n.addEventListener('mouseleave', () => gsap.to(halo, { scale: 1.45, opacity: 0.4, duration: 0.6, overwrite: 'auto' }));
    });
  }

  /* ---------- the day (Story) ---------- */
  function illuminate(el) {
    if (!el || REDUCE) return;
    const s = SplitText.create(el, { type: 'words', wordsClass: 'w' });
    gsap.set(s.words, { opacity: 0.24 });
    gsap.to(s.words, { opacity: 1, stagger: 0.35, ease: 'none', scrollTrigger: { trigger: el, start: 'top 82%', end: DESK ? 'top 34%' : 'top 40%', scrub: true } });
  }
  function setupDay() {
    const sec = q('[data-day]');
    if (!sec) return;
    const story = q('.story', sec);
    const intro = q('[data-intro]', sec);
    const chapters = qa('[data-chapter]', sec);
    const N = chapters.length;
    lineReveal(q('[data-split-lines]', sec));
    if (!REDUCE) gsap.from(q('.eyebrow', intro), { y: 32, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: sec, start: 'top 80%', once: true } });

    if (!DESK) {
      illuminate(q('[data-illuminate]', sec));
      chapters.forEach((c) => {
        if (REDUCE) return;
        const frame = q('.frame', c);
        gsap.fromTo(frame, { clipPath: 'inset(0 0 92% 0)', scale: 1.12 }, { clipPath: 'inset(0 0 0% 0)', scale: 1, ease: 'none', scrollTrigger: { trigger: frame, start: 'top 95%', end: 'top 45%', scrub: true } });
        reveal(qa('[data-line]', c));
      });
      return;
    }
    // Pinned: the illuminate paragraph lights up as the section arrives, before the pin holds it.
    const lede = q('[data-illuminate]', sec);
    if (!REDUCE) {
      const s = SplitText.create(lede, { type: 'words', wordsClass: 'w' });
      gsap.set(s.words, { opacity: 0.24 });
      gsap.to(s.words, { opacity: 1, stagger: 0.35, ease: 'none', scrollTrigger: { trigger: sec, start: 'top 60%', end: 'top top', scrub: true } });
    }

    const ghosts = qa('[data-hour]', sec), rail = qa('[data-rail]', sec), fill = q('[data-rail-fill]', sec);
    const chapWrap = q('[data-chapters]', sec), railWrap = q('.st-rail', sec);
    chapters[0].classList.add('on'); rail[0].classList.add('on');
    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    tl.to(intro, { opacity: 0, y: -40, duration: 0.08 }, 0)
      .to([chapWrap, railWrap], { opacity: 1, duration: 0.08 }, 0.04)
      .fromTo(fill, { scaleY: 0 }, { scaleY: 1, duration: 0.9 }, 0.1)
      .to({}, { duration: 0 }, 1);
    gsap.set(ghosts[0], { opacity: 0 });
    tl.to(ghosts[0], { opacity: 1, duration: 0.08 }, 0.04);

    const change = (i, prev, dir) => {
      rail.forEach((r, k) => r.classList.toggle('on', k === i));
      const inC = chapters[i], outC = chapters[prev];
      inC.classList.add('on');
      if (REDUCE) { outC.classList.remove('on'); ghosts.forEach((g, k) => gsap.set(g, { opacity: k === i ? 1 : 0 })); return; }
      const inF = q('.frame', inC), outF = q('.frame', outC);
      gsap.to(outF, { scale: dir > 0 ? 1.14 : 0.86, y: -dir * 46, opacity: 0, duration: 0.6, ease: 'power2.in', overwrite: 'auto' });
      gsap.fromTo(inF, { scale: dir > 0 ? 0.86 : 1.14, y: dir * 46, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: 0.9, ease: 'power2.out', overwrite: 'auto' });
      ghosts.forEach((g, k) => gsap.to(g, k === i ? { opacity: 1, duration: 0.8, delay: 0.1, overwrite: true } : { opacity: 0, duration: 0.6, overwrite: true }));
      const outL = qa('[data-line], figcaption', outC);
      gsap.to(outL, { y: -26, opacity: 0, duration: 0.25, ease: 'power3.in', overwrite: 'auto', onComplete: () => { if (chapters[ctl.idx] !== outC) outC.classList.remove('on'); } });
      gsap.fromTo(qa('[data-line], figcaption', inC), { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, delay: 0.25, stagger: 0.05, ease: 'power3.out', overwrite: 'auto' });
    };
    // 6 snap points: 0 (the intro), then the five chapters spread between 0.1 and 1.
    const at = Array.from({ length: N }, (_, k) => 0.1 + k * (0.9 / (N - 1)));
    const bounds = at.slice(1).map((a, k) => (a + at[k]) / 2);
    // The intro fade, frame fade-in and rail fill are scrubbed straight off the pin's progress.
    tl.pause();
    const ctl = pinnedStage({ el: story, screens: 4.6, snaps: [0, ...at], indexAt: hysteresis(bounds, 0.15 * 0.225), onChange: change, onProgress: (p) => tl.progress(p) });
    pinStart.day = ctl.st;
  }

  /* ---------- lines (Press): quotes and scroll-speed marquees ---------- */
  function setupLines() {
    const sec = q('[data-lines]');
    if (!sec) return;
    lineReveal(q('.lines-title', sec));
    if (!REDUCE) {
      qa('[data-quote]', sec).forEach((f, k) => {
        const lines = splitLines(q('p', f));
        const trig = { trigger: q('.quotes', sec), start: 'top 85%', once: true };
        gsap.from(lines, { yPercent: 115, duration: 0.85, stagger: 0.09, delay: k * 0.12, ease: 'power2.out', scrollTrigger: trig });
        gsap.from(q('figcaption', f), { opacity: 0, duration: 0.6, delay: k * 0.12 + 0.45, scrollTrigger: trig });
      });
    }
    const tracks = qa('[data-track]', sec);
    if (REDUCE || !tracks.length) return;
    const a = gsap.to(tracks[0], { xPercent: -50, duration: 38, ease: 'none', repeat: -1 });
    const b = gsap.fromTo(tracks[1], { xPercent: -50 }, { xPercent: 0, duration: 52, ease: 'none', repeat: -1 });
    const skew = { v: 0 };
    const apply = () => tracks.forEach((t) => { t.parentElement.style.transform = `skewX(${skew.v.toFixed(2)}deg)`; });
    let back = null;
    ScrollTrigger.create({
      trigger: sec, start: 'top bottom', end: 'bottom top',
      onUpdate: (self) => {
        const v = self.getVelocity();
        skew.v = clamp(-6, 6, -v / 420); apply();
        gsap.to(skew, { v: 0, duration: 0.9, ease: 'power2.out', onUpdate: apply, overwrite: true });
        const factor = clamp(1, 4, 1 + Math.abs(v) / 1200);
        gsap.to([a, b], { timeScale: factor, duration: 0.4, overwrite: true });
        back && back.kill();
        back = gsap.delayedCall(0.4, () => gsap.to([a, b], { timeScale: 1, duration: 1.4, overwrite: true }));
      },
    });
  }

  /* ---------- shop: gift rows, preview, cards ---------- */
  function setupShop() {
    const sec = q('[data-shop]');
    if (!sec) return;
    lineReveal(q('.shop-title', sec));
    if (!REDUCE) {
      const k = DESK ? 1 : 0.7;
      gsap.from(qa('[data-gcol]', sec), { y: 60, opacity: 0, duration: 0.8 * k, stagger: 0.15 * k, ease: 'power3.out', scrollTrigger: { trigger: q('.gifts', sec), start: 'top 85%', once: true } });
      gsap.from(qa('[data-grow]', sec), { y: 12, opacity: 0, duration: 0.6 * k, stagger: 0.06 * k, delay: 0.2, ease: 'power2.out', scrollTrigger: { trigger: q('.gifts', sec), start: 'top 85%', once: true } });
      gsap.from(qa('[data-rule]', sec), { scaleX: 0, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: q('.or', sec), start: 'top 90%', once: true } });
      gsap.from(qa('.card', sec), { y: 80, scale: 0.96, opacity: 0, duration: 1, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: q('.cards', sec), start: 'top 85%', once: true } });
    }
    // Cursor-following bag preview on gift rows: 170 × 215, 26 px right and 200 px up.
    const box = q('[data-preview-box]', sec);
    if (DESK && FINE && box) {
      const imgs = qa('[data-pv]', box);
      const px = gsap.quickTo(box, 'x', { duration: 0.45, ease: 'power2.out' });
      const py = gsap.quickTo(box, 'y', { duration: 0.45, ease: 'power2.out' });
      qa('[data-preview]', sec).forEach((a) => {
        a.addEventListener('mouseenter', (e) => {
          imgs.forEach((im) => im.classList.toggle('on', im.dataset.pv === a.dataset.preview));
          gsap.set(box, { x: e.clientX + 26, y: e.clientY - 200 });
          gsap.to(box, { opacity: 1, scale: 1, duration: 0.3, overwrite: 'auto' });
        });
        a.addEventListener('mousemove', (e) => { px(e.clientX + 26); py(e.clientY - 200); });
        a.addEventListener('mouseleave', () => gsap.to(box, { opacity: 0, scale: 0.94, duration: 0.25, overwrite: 'auto' }));
      });
    }
    // Gift rows: jump to the bag's card, set it up as a gift with the note.
    qa('[data-gift]', sec).forEach((a) => a.addEventListener('click', (e) => {
      e.preventDefault();
      const wrap = q(`#buy-${a.dataset.gift}`);
      const card = q('.card', wrap);
      q('[data-card-note]', card).textContent = `Gift note: “${q('.g-n', a).textContent}”`;
      scrollToY(wrap.getBoundingClientRect().top + scrollY - (DESK ? 92 : 76));
      card.classList.remove('flash'); void card.offsetWidth; card.classList.add('flash');
      setTimeout(() => card.classList.remove('flash'), 1600);
    }));
    // Option toggles.
    qa('.toggle', sec).forEach((g) => {
      const btns = qa('button', g);
      btns.forEach((b) => b.addEventListener('click', () => {
        btns.forEach((x) => x.setAttribute('aria-checked', String(x === b)));
        const note = q('[data-card-note]', g.closest('.card'));
        if (!note.textContent.startsWith('Gift note')) note.textContent = b.dataset.opt === 'initials' ? 'Initials embossed. Ready in 2 weeks.' : 'Ships ready. Cash on delivery.';
      }));
    });
  }

  /* ---------- cart drawer and notify modal ---------- */
  const cart = [];
  const drawer = q('[data-drawer]'), scrim = q('[data-scrim]'), modal = q('[data-modal]');
  const countBadge = q('[data-cart-count]'), cartBtn = q('[data-cart-open]');
  let lastFocus = null;
  function renderCart() {
    const list = q('[data-items]');
    const n = cart.reduce((s, it) => s + it.qty, 0);
    countBadge.textContent = n;
    countBadge.classList.toggle('on', n > 0);
    cartBtn.setAttribute('aria-label', `Your bag, ${n} item${n === 1 ? '' : 's'}`);
    q('[data-empty]').hidden = n > 0;
    q('[data-checkout]').disabled = n === 0;
    list.innerHTML = cart.map((it, k) => `<li><img src="assets/img/${it.id}.webp" alt=""><div><p class="n">${it.id.toUpperCase()}</p><p class="o">${it.initials ? 'With initials, ready in 2 weeks' : 'As it is'}</p></div><div class="step-qty"><button type="button" data-q="${k}" data-d="-1" aria-label="One fewer ${it.id.toUpperCase()}">−</button><span>${it.qty}</span><button type="button" data-q="${k}" data-d="1" aria-label="One more ${it.id.toUpperCase()}">+</button></div></li>`).join('');
  }
  function openDrawer() {
    lastFocus = document.activeElement;
    scrim.hidden = false; requestAnimationFrame(() => scrim.classList.add('on'));
    drawer.classList.add('on'); drawer.setAttribute('aria-hidden', 'false');
    lenis && lenis.stop();
    setTimeout(() => q('[data-cart-close]').focus(), 50);
  }
  function closeDrawer() {
    scrim.classList.remove('on'); setTimeout(() => { scrim.hidden = true; }, 450);
    drawer.classList.remove('on'); drawer.setAttribute('aria-hidden', 'true');
    lenis && lenis.start();
    lastFocus && lastFocus.focus();
  }
  function openModal() {
    closeDrawer();
    modal.hidden = false; lenis && lenis.stop();
    gsap.fromTo(q('.m-box', modal), { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: 'power3.out' });
    setTimeout(() => q('input', modal).focus(), 60);
  }
  function closeModal() { modal.hidden = true; lenis && lenis.start(); cartBtn.focus(); }
  function setupCart() {
    renderCart();
    cartBtn.addEventListener('click', openDrawer);
    q('[data-cart-close]').addEventListener('click', closeDrawer);
    scrim.addEventListener('click', closeDrawer);
    q('[data-checkout]').addEventListener('click', openModal);
    q('[data-modal-close]').addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!modal.hidden) closeModal(); else if (drawer.classList.contains('on')) closeDrawer();
    });
    q('[data-items]').addEventListener('click', (e) => {
      const b = e.target.closest('[data-q]');
      if (!b) return;
      const it = cart[+b.dataset.q];
      it.qty += +b.dataset.d;
      if (it.qty <= 0) cart.splice(+b.dataset.q, 1);
      renderCart();
    });
    qa('[data-add]').forEach((b) => b.addEventListener('click', () => {
      const card = b.closest('.card');
      const initials = q('[data-opt="initials"]', card).getAttribute('aria-checked') === 'true';
      const found = cart.find((it) => it.id === b.dataset.add && it.initials === initials);
      found ? found.qty++ : cart.push({ id: b.dataset.add, initials, qty: 1 });
      renderCart();
      gsap.fromTo(countBadge, { scale: 1.4 }, { scale: 1, duration: 0.4, ease: 'power2.out' });
      b.classList.add('done');
      setTimeout(() => b.classList.remove('done'), 1500);
    }));
    // Notify forms: no endpoint yet, so they validate and confirm locally.
    qa('[data-notify]').forEach((f) => f.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = q('input', f), msg = q('[data-msg]', f);
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      msg.classList.toggle('err', !ok);
      msg.textContent = ok ? 'Done. You’ll hear from us first.' : 'That email doesn’t look right. Try again?';
      if (ok) input.value = '';
    }));
  }

  /* ---------- nav: frosted after 80 px, hides on scroll down past the hero ---------- */
  function setupNav() {
    const nav = q('[data-nav]');
    let lastY = scrollY;
    const onScroll = () => {
      const y = scrollY;
      nav.classList.toggle('scrolled', y > 80);
      const pastHero = heroST ? y > heroST.end : y > innerHeight;
      if (DESK && pastHero) nav.classList.toggle('hide', y > lastY + 2 ? true : y < lastY - 2 ? false : nav.classList.contains('hide'));
      else nav.classList.remove('hide');
      lastY = y;
    };
    lenis ? lenis.on('scroll', onScroll) : addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    // Magnetic links: lean toward the cursor (0.3 strength, 0.4 s power2.out).
    if (FINE && !REDUCE) qa('[data-magnetic]').forEach((a) => {
      a.addEventListener('mousemove', (e) => {
        const r = a.getBoundingClientRect();
        gsap.to(a, { x: (e.clientX - (r.left + r.width / 2)) * 0.3, y: (e.clientY - (r.top + r.height / 2)) * 0.3, duration: 0.4, ease: 'power2.out' });
      });
      a.addEventListener('mouseleave', () => gsap.to(a, { x: 0, y: 0, duration: 0.4, ease: 'power2.out' }));
    });
  }

  /* ---------- cursor: 6 px dot, 36 px ring, difference blend ---------- */
  function setupCursor() {
    if (!FINE || REDUCE) return;
    const dot = q('[data-c-dot]'), ringEl = q('[data-c-ring]');
    const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' }), dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    const rx = gsap.quickTo(ringEl, 'x', { duration: 0.45, ease: 'power2.out' }), ry = gsap.quickTo(ringEl, 'y', { duration: 0.45, ease: 'power2.out' });
    let shown = false;
    addEventListener('pointermove', (e) => {
      if (!shown) { shown = true; gsap.set([dot, ringEl], { x: e.clientX, y: e.clientY }); gsap.to([dot, ringEl], { opacity: 1, duration: 0.3 }); }
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    });
    document.addEventListener('mouseleave', () => { shown = false; gsap.to([dot, ringEl], { opacity: 0, duration: 0.3 }); });
    document.addEventListener('mouseover', (e) => {
      const hot = e.target.closest('a, button, [role="radio"]');
      gsap.to(ringEl, { width: hot ? 56 : 36, height: hot ? 56 : 36, margin: hot ? -28 : -18, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(dot, { scale: hot ? 0.5 : 1, duration: 0.3, overwrite: 'auto' });
    });
  }

  /* ---------- shared reveals (ScrollReveal, TextReveal) ---------- */
  function reveal(els) {
    if (REDUCE || !els || !els.length) return;
    els.forEach((el) => gsap.from(el, { opacity: 0, y: 12, duration: 0.6, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } }));
  }
  function lineReveal(el) {
    if (REDUCE || !el) return;
    const lines = splitLines(el);
    gsap.from(lines, { yPercent: 115, duration: 0.9, stagger: 0.09, ease: 'power2.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
  }

  /* ---------- boot ---------- */
  function boot() {
    setupHero();
    setupCollection();
    setupInside();
    setupDay();
    setupLines();
    setupShop();
    reveal(qa('[data-reveal]'));
    const ft = q('.f-title');
    lineReveal(ft);
    setupCart();
    setupNav();
    setupCursor();
    ScrollTrigger.refresh();
    runPreloader(heroEntrance);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
