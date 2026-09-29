() => {
  const X = window.__xr, sel = X.sel;
  const RESERVED = new Set(['duration','delay','ease','stagger','repeat','repeatDelay','yoyo','scrollTrigger','onComplete','onStart','onUpdate','onRepeat','onReverseComplete','immediateRender','runBackwards','startAt','overwrite','lazy','id','paused','reversed','inherit','data','callbackScope','keyframes','parent','defaults','autoRevert','onInterrupt','yoyoEase','onCompleteParams','onUpdateParams','onStartParams','smoothChildTiming','autoRemoveChildren','sortChildren','zIndex']);
  const ctx = (el) => {
    if (!el || !el.closest) return null;
    const s = el.closest('section,[id],header,footer');
    const h = s && s.querySelector('h1,h2,h3');
    return (s ? sel(s) : '') + (h ? ' | ' + h.innerText.trim().replace(/\s+/g,' ').slice(0, 50) : '');
  };
  const txt = (el) => el && el.innerText ? el.innerText.trim().replace(/\s+/g, ' ').slice(0, 40) : '';
  const val = (v) => typeof v === 'function' ? 'fn:' + String(v).slice(0, 120) : (typeof v === 'object' && v ? JSON.stringify(v).slice(0, 200) : v);
  const easeName = (e) => e == null ? '(default)' : typeof e === 'string' ? e : 'fn:' + String(e).slice(0, 80);
  const props = (vars) => { const o = {}; for (const k in vars) if (!RESERVED.has(k)) o[k] = val(vars[k]); return o; };
  const stInfo = (st) => st ? ({ trigger: sel(st.trigger), triggerCtx: ctx(st.trigger), start: st.vars.start, end: typeof st.vars.end === 'function' ? 'fn:' + String(st.vars.end).slice(0, 80) : st.vars.end, startPx: Math.round(st.start), endPx: Math.round(st.end), scrub: st.vars.scrub, pin: st.vars.pin ? (st.vars.pin === true ? 'trigger' : sel(st.pin)) : false, pinSpacing: st.vars.pinSpacing, snap: val(st.vars.snap), once: st.vars.once, toggleActions: st.vars.toggleActions, onUpdate: st.vars.onUpdate ? String(st.vars.onUpdate).slice(0, 400) : null, onEnter: st.vars.onEnter ? String(st.vars.onEnter).slice(0, 200) : null }) : null;

  const tweens = X.tweens.map((tw, i) => {
    const t = tw._targets || [];
    const first = t[0];
    return {
      i, createdMs: tw.__xr_t, createdAtScroll: tw.__xr_y, kind: tw.vars.startAt ? 'fromTo' : tw.vars.runBackwards ? 'from' : 'to',
      targets: t.length, target: first && first.tagName ? sel(first) : (first ? 'obj:' + Object.keys(first).slice(0, 6).join(',') : null),
      text: txt(first), ctx: ctx(first), parentOfTarget: first && first.parentElement ? sel(first.parentElement) : null,
      duration: tw._dur !== undefined ? +tw._dur.toFixed(3) : tw.vars.duration, delay: tw._delay !== undefined ? +tw._delay.toFixed(3) : tw.vars.delay,
      ease: easeName(tw.vars.ease), stagger: val(tw.vars.stagger), repeat: tw.vars.repeat, yoyo: tw.vars.yoyo,
      from: tw.vars.startAt ? props(tw.vars.startAt) : (tw.vars.runBackwards ? props(tw.vars) : null),
      to: tw.vars.runBackwards && !tw.vars.startAt ? '(element natural state)' : props(tw.vars),
      inTimeline: tw.parent && tw.parent.vars && tw.parent.vars.id !== 'root' ? (tw.parent.__xr_idx ?? 'tl') : null,
      startTimeInParent: tw._start !== undefined ? +tw._start.toFixed(3) : null,
      scrollTrigger: stInfo(tw.scrollTrigger),
    };
  });
  X.timelines.forEach((tl, i) => tl.__xr_idx = i);
  const timelines = X.timelines.filter(tl => tl.vars.id !== 'root').map((tl, i) => ({ idx: tl.__xr_idx, createdMs: tl.__xr_t, duration: tl._dur !== undefined ? +tl._dur.toFixed(3) : null, defaults: val(tl.vars.defaults), repeat: tl.vars.repeat, scrollTrigger: stInfo(tl.scrollTrigger), children: (() => { const a = []; let c = tl._first; while (c && a.length < 40) { a.push({ start: +(c._start || 0).toFixed(3), dur: +(c._dur || 0).toFixed(3), target: c._targets && c._targets[0] ? sel(c._targets[0]) : null, props: c.vars ? Object.keys(props(c.vars)).join(',') : '', ease: c.vars ? easeName(c.vars.ease) : '' }); c = c._next; } return a; })() }));

  let ST = null;
  for (const tw of X.tweens) if (tw.scrollTrigger) { ST = tw.scrollTrigger.constructor; break; }
  const triggers = ST && ST.getAll ? ST.getAll().map(stInfo) : [];
  const L = window.__xrLenis || window.lenis;
  const lopt = {}; try { const o = L && (L.options || L._options || {}); for (const k in o) { const v = o[k]; lopt[k] = v instanceof Node ? sel(v) : v === window ? 'window' : typeof v === 'function' ? 'fn:' + String(v).slice(0, 80) : (typeof v === 'object' && v ? '[obj]' : v); } } catch (e) { lopt.err = String(e); }
  const lenis = L ? { version: window.lenisVersion, options: lopt, keys: Object.keys(L).slice(0, 40) } : null;
  return { tweenCount: X.tweens.length, timelineCount: X.timelines.length, tweens, timelines, triggers, lenis, stFound: !!ST };
}
