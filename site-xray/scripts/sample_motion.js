// Library-free motion sampler. Records transform, opacity, clip-path and filter of
// visible elements every frame for `ms` milliseconds, then returns only the ones that moved.
// Used when a site animates without GSAP (Framer, Webflow, CSS, custom rAF code).
async ({ ms, maxEls }) => {
  const sel = window.__xr ? window.__xr.sel : (el) => el.tagName.toLowerCase();
  const vh = innerHeight, vw = innerWidth;
  const cands = [];
  for (const el of document.querySelectorAll('body *')) {
    if (cands.length >= (maxEls || 400)) break;
    const r = el.getBoundingClientRect();
    if (r.bottom < -vh * 0.5 || r.top > vh * 1.5 || r.width < 2 || r.height < 2) continue;
    const st = el.getAttribute('style') || '';
    const cs = getComputedStyle(el);
    if (/transform|opacity|clip-path|filter|translate|scale|rotate/.test(st) || cs.willChange !== 'auto' || cs.transform !== 'none' || +cs.opacity < 1 || cs.clipPath !== 'none' || el.hasAttribute('data-framer-appear-id') || el.getAnimations().length) cands.push(el);
  }
  const read = (el) => {
    const cs = getComputedStyle(el);
    let tx = 0, ty = 0, sc = 1, rot = 0;
    if (cs.transform && cs.transform !== 'none') {
      const m = new DOMMatrixReadOnly(cs.transform);
      tx = m.m41; ty = m.m42; sc = Math.hypot(m.m11, m.m12); rot = Math.atan2(m.m12, m.m11) * 180 / Math.PI;
    }
    const r = el.getBoundingClientRect();
    return [+tx.toFixed(2), +ty.toFixed(2), +sc.toFixed(4), +rot.toFixed(2), +(+cs.opacity).toFixed(3), cs.clipPath === 'none' ? '' : cs.clipPath, cs.filter === 'none' ? '' : cs.filter, Math.round(r.top), Math.round(r.height)];
  };
  const series = cands.map(() => []);
  const t0 = performance.now();
  await new Promise((res) => {
    const tick = () => {
      const t = Math.round(performance.now() - t0);
      cands.forEach((el, i) => series[i].push([t, ...read(el)]));
      if (t < ms) requestAnimationFrame(tick); else res();
    };
    requestAnimationFrame(tick);
  });
  const out = [];
  cands.forEach((el, i) => {
    const s = series[i];
    const first = JSON.stringify(s[0].slice(1, 8)), last = JSON.stringify(s[s.length - 1].slice(1, 8));
    const changed = s.some((row) => JSON.stringify(row.slice(1, 8)) !== first);
    if (!changed) return;
    const anims = el.getAnimations().map((a) => ({ name: a.animationName || a.id || a.constructor.name, dur: a.effect && a.effect.getTiming().duration, ease: a.effect && a.effect.getTiming().easing, delay: a.effect && a.effect.getTiming().delay }));
    out.push({ el: sel(el), text: (el.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40), framer: el.getAttribute('data-framer-name') || null, cssAnimations: anims, samples: s, endsDifferent: first !== last });
  });
  return { scrollY: Math.round(scrollY), candidates: cands.length, moving: out };
}
