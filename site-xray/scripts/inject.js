// Site X-Ray: runs before any page script. Records how the page animates.
(() => {
  const X = (window.__xr = {
    t0: performance.now(),
    io: [], listeners: {}, animate: [], canvases: [], shaders: [], programs: [],
    uniformNames: {}, uniformWrites: {}, draws: 0, rafCalls: 0, three: [],
    viewTransitions: 0, audio: 0, media: [], errors: [],
  });
  const now = () => Math.round(performance.now() - X.t0);
  const sel = (el) => {
    if (!el || !el.tagName) return String(el && el.constructor && el.constructor.name);
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id;
    const c = (el.getAttribute && el.getAttribute('class')) || '';
    if (c) s += '.' + c.trim().split(/\s+/).slice(0, 3).join('.');
    return s;
  };
  X.sel = sel;

  // requestAnimationFrame: count frames that run code
  const raf = window.requestAnimationFrame.bind(window);
  window.requestAnimationFrame = (cb) => { X.rafCalls++; return raf(cb); };

  // IntersectionObserver: list every scroll trigger and its thresholds
  const IO = window.IntersectionObserver;
  if (IO) {
    window.IntersectionObserver = function (cb, opts) {
      const rec = { t: now(), rootMargin: opts && opts.rootMargin, threshold: opts && opts.threshold, targets: [] };
      X.io.push(rec);
      const o = new IO(cb, opts);
      const obs = o.observe.bind(o);
      o.observe = (el) => { if (rec.targets.length < 40) rec.targets.push(sel(el)); return obs(el); };
      return o;
    };
    window.IntersectionObserver.prototype = IO.prototype;
  }

  // Event listeners: what reacts to scroll, mouse, touch, tilt
  const watch = new Set(['scroll', 'wheel', 'mousemove', 'pointermove', 'pointerdown', 'pointerenter', 'pointerleave', 'mouseenter', 'mouseleave', 'mouseover', 'touchstart', 'touchmove', 'resize', 'deviceorientation', 'devicemotion', 'keydown', 'click', 'visibilitychange']);
  const add = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function (type, fn, o) {
    if (watch.has(type)) {
      const k = type + ' @ ' + (this === window ? 'window' : this === document ? 'document' : sel(this));
      X.listeners[k] = (X.listeners[k] || 0) + 1;
    }
    return add.call(this, type, fn, o);
  };

  // Web Animations API
  const anim = Element.prototype.animate;
  Element.prototype.animate = function (kf, opts) {
    if (X.animate.length < 300) X.animate.push({ t: now(), el: sel(this), kf: JSON.stringify(kf).slice(0, 300), opts: JSON.stringify(opts).slice(0, 200) });
    return anim.call(this, kf, opts);
  };

  // View transitions
  if (document.startViewTransition) {
    const svt = document.startViewTransition.bind(document);
    document.startViewTransition = (...a) => { X.viewTransitions++; return svt(...a); };
  }

  // Audio
  const AC = window.AudioContext;
  if (AC) window.AudioContext = function (...a) { X.audio++; return new AC(...a); };

  // Canvas and WebGL: shaders, uniforms, draw calls
  const gc = HTMLCanvasElement.prototype.getContext;
  const hooked = new WeakSet();
  HTMLCanvasElement.prototype.getContext = function (type, attrs) {
    const ctx = gc.call(this, type, attrs);
    if (ctx && !hooked.has(ctx)) {
      hooked.add(ctx);
      X.canvases.push({ t: now(), type, w: this.width, h: this.height, el: sel(this), attrs: JSON.stringify(attrs || {}) });
      if (/webgl/.test(type)) {
        const P = Object.getPrototypeOf(ctx);
        const ss = P.shaderSource;
        ctx.shaderSource = function (sh, src) {
          if (X.shaders.length < 200) X.shaders.push({ t: now(), type: this.getShaderParameter ? null : null, len: src.length, src });
          return ss.call(this, sh, src);
        };
        const gul = P.getUniformLocation;
        const locName = new WeakMap();
        ctx.getUniformLocation = function (p, name) {
          const l = gul.call(this, p, name);
          if (l) locName.set(l, name);
          return l;
        };
        for (const m of Object.getOwnPropertyNames(P)) {
          if (/^uniform(1|2|3|4|Matrix)/.test(m)) {
            const f = P[m];
            ctx[m] = function (loc, ...v) {
              const n = locName.get(loc) || '?';
              const r = X.uniformWrites[n] || (X.uniformWrites[n] = { count: 0, first: null, last: null, distinct: 0, _prev: null });
              r.count++;
              const val = v[0] && v[0].length ? Array.from(v[0]).slice(0, 4).map((x) => +x.toFixed(4)).join(',') : v.map((x) => +(+x).toFixed(4)).join(',');
              if (r.first === null) r.first = val;
              if (val !== r._prev) r.distinct++;
              r._prev = val; r.last = val;
              return f.call(this, loc, ...v);
            };
          }
        }
        for (const m of ['drawArrays', 'drawElements', 'drawArraysInstanced', 'drawElementsInstanced']) {
          const f = P[m];
          if (f) ctx[m] = function (...a) { X.draws++; return f.apply(this, a); };
        }
      }
    }
    return ctx;
  };

  // three.js announces every Scene and Renderer to this devtools hook
  const dt = new EventTarget();
  dt.addEventListener('observe', (e) => { X.three.push(e.detail); });
  window.__THREE_DEVTOOLS__ = dt;

  // Video and audio elements
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function () {
    X.media.push({ t: now(), el: sel(this), src: (this.currentSrc || this.src || '').slice(-80), loop: this.loop, muted: this.muted });
    return play.call(this);
  };

  // GSAP: catch every tween and timeline as it's built, even when gsap isn't global.
  // Tweens set this._targets and timelines set this.smoothChildTiming in their constructors.
  X.tweens = []; X.timelines = [];
  const cap = (name, fn) => Object.defineProperty(Object.prototype, name, {
    configurable: true, enumerable: false,
    get() { return undefined; },
    set(v) { Object.defineProperty(this, name, { value: v, writable: true, configurable: true, enumerable: true }); try { fn(this, v); } catch (e) {} },
  });
  cap('_targets', (tw) => { if (tw && tw.vars && X.tweens.length < 3000) { tw.__xr_t = now(); tw.__xr_y = Math.round(window.scrollY); X.tweens.push(tw); } });
  cap('smoothChildTiming', (tl) => { if (tl && tl.vars && X.timelines.length < 500) { tl.__xr_t = now(); X.timelines.push(tl); } });

  // Lenis: its constructor assigns this.options = {lerp, smoothWheel, wheelMultiplier, ...}. Keep the instance.
  cap('options', (obj, v) => { if (v && typeof v === 'object' && 'smoothWheel' in v && 'lerp' in v && 'wheelMultiplier' in v) { window.__xrLenis = obj; } });

  window.addEventListener('error', (e) => X.errors.push(String(e.message).slice(0, 200)));
})();
