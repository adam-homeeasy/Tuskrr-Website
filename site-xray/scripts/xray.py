#!/usr/bin/env python3
"""Site X-Ray: capture everything a live website does, for a teardown.

Usage:
  python3 xray.py all  <url> <out_dir>            # every stage, in order
  python3 xray.py <stage> <url> <out_dir>         # one stage
Stages: probe code bundle assets map phone motion three pointer states responsive a11y weight sheets build

Needs: playwright (Python) with Chromium, Pillow, ffmpeg (for frame strips). Cloud-safe: WebGL runs in software.
Every stage writes into <out_dir> using the reference-pack layout:
  02-data  03-assets  04-code  05-screens  06-raw
"""
import json, os, re, sys, time, math, glob, shutil, subprocess, urllib.parse, urllib.request
from playwright.sync_api import sync_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
INJECT = open(os.path.join(HERE, 'inject.js')).read()
DUMP_MOTION = open(os.path.join(HERE, 'dump_motion.js')).read()
DUMP_THREE = open(os.path.join(HERE, 'dump_three.js')).read()
SAMPLE = open(os.path.join(HERE, 'sample_motion.js')).read()
ARGS = ['--enable-unsafe-swiftshader', '--use-angle=swiftshader', '--ignore-gpu-blocklist', '--autoplay-policy=no-user-gesture-required']
UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36'


# ---------- helpers ----------
def P(out, *parts):
    p = os.path.join(out, *parts)
    os.makedirs(os.path.dirname(p), exist_ok=True)
    return p


def save(out, rel, data):
    with open(P(out, rel), 'w') as f:
        json.dump(data, f, indent=1, default=str)


def load(out, rel, default=None):
    p = os.path.join(out, rel)
    return json.load(open(p)) if os.path.exists(p) else default


def log(*a):
    print('[xray]', *a, flush=True)


def launch(pw, w=1440, h=900, **ctx):
    b = pw.chromium.launch(args=ARGS)
    ctx.setdefault('user_agent', UA)
    c = b.new_context(viewport={'width': w, 'height': h}, **ctx)
    c.add_init_script(INJECT)
    p = c.new_page()
    return b, c, p


CONSENT_SELECTORS = [
    '#CybotCookiebotDialogBodyButtonDecline', '#CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll',
    '#onetrust-reject-all-handler', 'button:has-text("Use necessary cookies only")', 'button:has-text("Only necessary")',
    'button:has-text("Reject all")', 'button:has-text("Decline")', 'button:has-text("Neka")', 'button:has-text("Endast nödvändiga")',
]


def dismiss_consent(p):
    """Cookie banners lock scrolling and hide the page. Choose the most restrictive option, never 'accept all'."""
    def try_once():
        for sel in CONSENT_SELECTORS:
            try:
                el = p.locator(sel).first
                if el.is_visible(timeout=300):
                    el.click(timeout=2000)
                    p.wait_for_timeout(800)
                    return sel
            except Exception:
                pass
        return None
    hit = try_once()
    if hit:
        return hit
    # Cookiebot hides 'Deny' until 'Customize' is opened. Customize is not consent.
    try:
        c = p.locator('#CybotCookiebotDialogBodyLevelButtonCustomize').first
        if c.is_visible(timeout=300):
            c.click(timeout=2000)
            p.wait_for_timeout(800)
            return try_once()
    except Exception:
        pass
    return None


def goto(p, url, settle=6000):
    p.goto(url, wait_until='load', timeout=90000)
    p.wait_for_timeout(settle)
    if dismiss_consent(p):
        p.wait_for_timeout(2500)


def scroll_to(p, y, wait=900):
    """Scroll through Lenis when it's there, else natively. Returns the REAL scrollY (snaps can move it)."""
    p.evaluate('y => { const L = window.__xrLenis || (window.lenis && window.lenis.scrollTo ? window.lenis : null); if (L) L.scrollTo(y, {immediate: true, force: true}); else window.scrollTo(0, y); }', y)
    p.wait_for_timeout(wait)
    return p.evaluate('Math.round(scrollY)')


def shot(p, path, **kw):
    try:
        p.screenshot(path=path, timeout=25000, **kw)
        return True
    except Exception as e:
        log('screenshot skipped', os.path.basename(path), str(e)[:60])
        return False


def fetch(url, dest):
    for i in range(4):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': UA})
            with urllib.request.urlopen(req, timeout=60) as r, open(dest, 'wb') as f:
                shutil.copyfileobj(r, f)
            return True
        except Exception as e:
            err = e
            time.sleep(1.5 * (i + 1))
    log('download failed', url, str(err)[:80])
    return False


def page_height(p):
    return p.evaluate('document.documentElement.scrollHeight')


# ---------- 1. probe: fingerprint the stack ----------
LIBS = ['gsap', 'ScrollTrigger', 'SplitText', 'DrawSVG', 'MorphSVG', 'Flip', 'ScrollSmoother', 'lenis', 'Lenis', 'locomotive', 'framer-motion', 'motion/react', 'useScroll', 'anime', 'lottie', 'rive', 'three', 'WebGLRenderer', 'ShaderMaterial', '@react-three', 'ogl', 'pixi', 'babylon', 'playcanvas', 'spline', 'unicorn', 'curtains', 'p5', 'barba', 'swup', 'swiper', 'splide', 'embla', 'flickity', 'keen-slider', 'startViewTransition', 'animation-timeline', 'IntersectionObserver', 'AudioContext', 'Howl', 'webgpu', 'navigator.gpu', 'matter-js', 'cannon', 'rapier']


def st_probe(url, out):
    with sync_playwright() as pw:
        b, c, p = launch(pw)
        logs = []
        p.on('console', lambda m: logs.append(m.type + ': ' + m.text[:200]))
        goto(p, url, 8000)
        d = p.evaluate(r"""() => { const X = window.__xr, sel = X.sel, de = document.documentElement;
          const g = {}; for (const k of ['gsap','ScrollTrigger','Lenis','lenis','lenisVersion','__THREE__','THREE','Webflow','Framer','__framer_importFromPackage','__NEXT_DATA__','__next_f','__NUXT__','Shopify','wixBiSession','Squarespace','jQuery','Barba','swup','lottie','rive','Spline']) g[k] = typeof window[k];
          const gen = document.querySelector('meta[name=generator]');
          return {title: document.title, generator: gen && gen.content, htmlClass: de.className, bodyClass: document.body.className, height: de.scrollHeight, globals: g, threeVer: window.__THREE__,
           framerNodes: document.querySelectorAll('[data-framer-name],[data-framer-component-type]').length, webflowIx: document.querySelectorAll('[data-w-id]').length,
           links: [...new Set([...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')))],
           canvases: [...document.querySelectorAll('canvas')].map(c => { const r = c.getBoundingClientRect(); return {w: c.width, h: c.height, top: Math.round(r.top + scrollY), cssW: Math.round(r.width), parent: sel(c.parentElement)}; }),
           io: X.io, listeners: X.listeners, animateCalls: X.animate.length, contexts: X.canvases, draws: X.draws, raf: X.rafCalls, viewTransitions: X.viewTransitions, audio: X.audio, media: X.media, errors: X.errors, tweensAtLoad: X.tweens.length,
           fonts: [...document.fonts].map(f => f.family + ' ' + f.weight + ' ' + f.style + ' ' + f.status),
           meta: [...document.querySelectorAll('meta[property^=og], meta[name=description], meta[name=theme-color], meta[name=generator], link[rel*=icon], link[rel=manifest]')].map(m => (m.getAttribute('property') || m.getAttribute('name') || m.rel) + ' = ' + (m.content || m.href || '').slice(0, 140)),
           scripts: [...document.scripts].map(s => s.src).filter(Boolean), styles: [...document.querySelectorAll('link[rel=stylesheet]')].map(l => l.href),
           resources: performance.getEntriesByType('resource').map(e => ({u: e.name, t: e.initiatorType, kb: Math.round((e.transferSize || e.encodedBodySize || 0) / 1024)}))}; }""")
        d['console'] = logs[:60]
        d['url'] = url
        save(out, '06-raw/probe.json', d)
        shot(p, P(out, '05-screens/states/first_view.png'))
        b.close()
    log('probe: height', d['height'], 'canvases', len(d['canvases']), 'tweens at load', d['tweensAtLoad'])


# ---------- 2. code: HTML, CSS, JS as shipped ----------
def st_code(url, out):
    pr = load(out, '06-raw/probe.json', {})
    base = url.rstrip('/')
    fetch(url, P(out, '04-code/html/index.server.html'))
    for u in pr.get('styles', []):
        fetch(u, P(out, '04-code/css', re.sub(r'[^\w.~-]', '_', os.path.basename(urllib.parse.urlparse(u).path)) or 'style.css'))
    js = [r['u'] for r in pr.get('resources', []) if r['t'] == 'script'] + pr.get('scripts', [])
    for u in sorted(set(js)):
        if urllib.parse.urlparse(u).netloc and urllib.parse.urlparse(u).netloc not in urllib.parse.urlparse(url).netloc and not any(k in u for k in ['framer', 'webflow', 'cdn']):
            continue  # skip third-party trackers
        fetch(u, P(out, '04-code/js', re.sub(r'[^\w.~-]', '_', os.path.basename(urllib.parse.urlparse(u).path)) or 'script.js'))
    with sync_playwright() as pw:
        b, c, p = launch(pw)
        goto(p, url, 7000)
        open(P(out, '04-code/html/index.rendered.html'), 'w').write(p.content())
        b.close()
    log('code: saved', len(glob.glob(P(out, '04-code/js/x')[:-1] + '*')), 'scripts')


# ---------- 3. bundle: split minified bundles into readable modules ----------
def st_bundle(url, out):
    """Turbopack/Next.js: modules look like  N,e=>{"use strict"; ... e.s(["Name",0,fn])}.
    Webpack: {12345:function(e,t,n){...}} or (e,t,n)=>{...}. We save any module that exports a named symbol,
    plus a keyword index so per-frame maths can be found fast."""
    files = glob.glob(P(out, '04-code/js/x')[:-1] + '*.js')
    made, index = 0, {}
    KEYS = ['clipPath', 'quickTo', 'ScrollTrigger.create', 'scrollTrigger', 'SplitText', 'useFrame', 'requestAnimationFrame', 'pointermove', 'mousemove', 'getVelocity', 'lerp', 'matchMedia', 'prefers-reduced-motion', 'ShaderMaterial', 'fragmentShader', 'drawSVG', 'IntersectionObserver', 'startViewTransition', 'animation-timeline']
    for f in files:
        s = open(f, errors='ignore').read()
        for m in re.finditer(r'e\.s\(\[("[A-Za-z_$][\w$]*")', s):
            name = m.group(1).strip('"')
            ms = s.rfind('e=>{"use strict";', 0, m.start())
            nxt = s.find('e=>{"use strict";', m.start())
            body = s[ms if ms >= 0 else max(0, m.start() - 20000): nxt if nxt > 0 else m.start() + 30000]
            if len(body) > 250000:
                continue
            dest = P(out, '04-code/components', name + '.js')
            if not os.path.exists(dest) or os.path.getsize(dest) < len(body):
                open(dest, 'w').write(re.sub(r'"[^"]{400,}"', '"<long string>"', body))
                made += 1
        for k in KEYS:
            n = s.count(k)
            if n:
                index.setdefault(k, []).append([os.path.basename(f), n])
    # Webpack-style fallback: pull out any module that mentions animation keywords
    if made == 0:
        for f in files:
            s = open(f, errors='ignore').read()
            for m in re.finditer(r'(\d{2,6}):(?:function\s*\([\w$,]*\)|\([\w$,]*\)\s*=>)\s*\{', s):
                chunk = s[m.start(): m.start() + 20000]
                if any(k in chunk for k in ['gsap', 'ScrollTrigger', 'useFrame', 'clipPath', 'requestAnimationFrame', 'framer-motion']):
                    open(P(out, '04-code/components', f'module_{m.group(1)}.js'), 'w').write(chunk)
                    made += 1
    save(out, '06-raw/bundle_index.json', index)
    log('bundle: modules saved', made)


# ---------- 4. assets: everything visual the site loads (fonts excluded) ----------
EXTS = r'png|jpe?g|webp|avif|gif|svg|mp4|webm|mov|glb|gltf|bin|hdr|exr|ktx2|basis|riv|lottie|mp3|wav|ogg|json'
ASSET_EXT = r'\.(' + EXTS + r')(\?|$)'


def st_assets(url, out):
    pr = load(out, '06-raw/probe.json', {})
    origin = '{0.scheme}://{0.netloc}'.format(urllib.parse.urlparse(url))
    seen = {}
    with sync_playwright() as pw:
        b, c, p = launch(pw)
        p.on('response', lambda r: seen.setdefault(r.url.split('#')[0], r.request.resource_type))
        goto(p, url, 6000)
        H = page_height(p)
        y = 0
        while y < H:
            y += 500; scroll_to(p, y, 250); H = page_height(p)
        p.wait_for_timeout(2000)
        imgs = p.evaluate("() => [...document.images].map(i => i.currentSrc || i.src).concat([...document.querySelectorAll('video source, video[src], [style*=url]')].map(e => e.src || (getComputedStyle(e).backgroundImage.match(/url\\(\"?([^\")]+)/) || [])[1]).filter(Boolean))")
        for u in imgs: seen.setdefault(u, 'image')
        b.close()
    # also string paths found in the bundles
    for f in glob.glob(P(out, '04-code/js/x')[:-1] + '*.js'):
        for m in re.finditer(r'"(/[\w./-]+\.(?:' + EXTS + r'))"', open(f, errors='ignore').read()):
            seen.setdefault(origin + m.group(1), 'bundle')
    got, fonts, skipped = [], [], []
    for u, t in seen.items():
        path = urllib.parse.urlparse(u).path
        if re.search(r'\.(woff2?|ttf|otf|eot)(\?|$)', u) or t == 'font':
            fonts.append(u); continue
        # Next.js image optimiser: grab the original instead
        q = urllib.parse.parse_qs(urllib.parse.urlparse(u).query)
        if '/_next/image' in path and 'url' in q:
            u = urllib.parse.urljoin(origin, q['url'][0]); path = urllib.parse.urlparse(u).path
        if not re.search(ASSET_EXT, path) or '/_next/static/' in path or 'manifest' in path:
            skipped.append(u); continue
        ext = path.rsplit('.', 1)[-1].lower()
        kind = {'glb': 'models', 'gltf': 'models', 'bin': 'models', 'hdr': 'hdri', 'exr': 'hdri', 'ktx2': 'textures', 'basis': 'textures', 'mp4': 'video', 'webm': 'video', 'mov': 'video', 'riv': 'rive', 'lottie': 'lottie', 'json': 'lottie', 'mp3': 'audio', 'wav': 'audio', 'ogg': 'audio', 'svg': 'svg'}.get(ext, 'images')
        if kind == 'lottie' and ext == 'json' and not re.search(r'lottie|anim|bodymovin', u, re.I):
            skipped.append(u); continue
        parts = [x for x in path.strip('/').split('/')[:-1] if x not in ('_next', 'static', 'media', 'assets', 'public')]
        if parts and parts[0] == kind: parts = parts[1:]
        dest = P(out, '03-assets', kind, *parts[-3:], os.path.basename(path))
        if not os.path.exists(dest) and fetch(u, dest):
            got.append({'url': u, 'file': os.path.relpath(dest, out), 'kb': round(os.path.getsize(dest) / 1024)})
    for m in pr.get('meta', []):
        if m.startswith(('og:image =', 'icon =', 'apple-touch-icon =')):
            u = m.split(' = ', 1)[1]
            dest = P(out, '03-assets/brand', os.path.basename(urllib.parse.urlparse(u).path) or 'icon')
            if fetch(u, dest): got.append({'url': u, 'file': os.path.relpath(dest, out)})
    save(out, '06-raw/assets.json', {'downloaded': got, 'fontsNotDownloaded': sorted(set(fonts)), 'skipped': sorted(set(skipped))[:300]})
    log('assets:', len(got), 'files,', len(set(fonts)), 'fonts left out')


# ---------- 5. map: sections, tokens, screenshots, colour rhythm ----------
TOKENS_JS = r"""() => {
 const sel = window.__xr.sel;
 const rgb = new Map(), fonts = new Map(), radii = new Map(), shadows = new Map(), blends = new Map(), filters = new Map();
 const bump = (m, k, ex) => { if (!k) return; const r = m.get(k) || {n: 0, ex: []}; r.n++; if (r.ex.length < 3 && ex) r.ex.push(ex); m.set(k, r); };
 for (const el of document.querySelectorAll('body *')) {
   const cs = getComputedStyle(el); if (cs.display === 'none') continue;
   const s = sel(el).slice(0, 70);
   if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') bump(rgb, 'bg ' + cs.backgroundColor, s);
   if (cs.backgroundImage !== 'none' && !cs.backgroundImage.startsWith('url')) bump(rgb, 'grad ' + cs.backgroundImage.slice(0, 200), s);
   if ([...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())) {
     bump(rgb, 'text ' + cs.color, s);
     bump(fonts, [cs.fontFamily.split(',')[0].replace(/"/g, ''), cs.fontWeight, cs.fontStyle === 'italic' ? 'i' : '', cs.fontSize, cs.lineHeight, cs.letterSpacing, cs.textTransform === 'uppercase' ? 'UP' : ''].join(' | '), s + ' "' + (el.innerText || el.textContent || '').trim().slice(0, 30) + '"');
   }
   if (cs.borderTopWidth !== '0px' && cs.borderTopStyle !== 'none') bump(rgb, 'border ' + cs.borderTopWidth + ' ' + cs.borderTopColor, s);
   if (cs.borderRadius !== '0px') bump(radii, cs.borderRadius, s);
   if (cs.boxShadow !== 'none') bump(shadows, cs.boxShadow, s);
   if (cs.mixBlendMode !== 'normal') bump(blends, cs.mixBlendMode, s);
   if (cs.filter !== 'none') bump(filters, 'filter ' + cs.filter, s);
   if (cs.backdropFilter && cs.backdropFilter !== 'none') bump(filters, 'backdrop ' + cs.backdropFilter, s);
   if (cs.clipPath && cs.clipPath !== 'none') bump(filters, 'clip ' + cs.clipPath.slice(0, 90), s);
   if (cs.maskImage && cs.maskImage !== 'none') bump(filters, 'mask ' + cs.maskImage.slice(0, 90), s);
   if (cs.webkitTextStroke && !/^0px/.test(cs.webkitTextStrokeWidth || '0px')) bump(filters, 'text-stroke ' + cs.webkitTextStrokeWidth + ' ' + cs.webkitTextStrokeColor, s);
 }
 // CSS variables and @font-face, walking INTO @layer / @media / @supports (Tailwind v4 hides :root inside @layer)
 const vars = {}, faces = [], media = new Set(), keyframes = [];
 const walk = (rules) => { for (const r of rules) {
   if (r.media) media.add(r.media.mediaText);
   if (r.constructor.name === 'CSSFontFaceRule') faces.push(r.style.getPropertyValue('font-family') + ' ' + r.style.getPropertyValue('font-weight') + ' ' + r.style.getPropertyValue('src').slice(0, 120));
   else if (r.constructor.name === 'CSSKeyframesRule') keyframes.push(r.name + ': ' + [...r.cssRules].map(k => k.keyText + '{' + k.style.cssText.slice(0, 120) + '}').join(' ').slice(0, 400));
   else if (r.style && r.selectorText && /(^|,)\s*(:root|html|:host)/.test(r.selectorText)) for (const p of r.style) if (p.startsWith('--')) vars[p] = r.style.getPropertyValue(p).trim();
   if (r.cssRules) walk(r.cssRules);
 } };
 for (const sh of document.styleSheets) { try { walk(sh.cssRules); } catch (e) {} }
 const o = (m) => [...m.entries()].sort((a, b) => b[1].n - a[1].n).map(([k, v]) => ({k, n: v.n, ex: v.ex}));
 return {colors: o(rgb), type: o(fonts), radii: o(radii), shadows: o(shadows), blends: o(blends), filters: o(filters), vars, faces, media: [...media], keyframes: keyframes.slice(0, 60)};
}"""

SECTIONS_JS = r"""() => { const sel = window.__xr.sel;
 let list = [...document.querySelectorAll('body section, body header, body footer, body nav, body main > *, body [data-framer-name]')].filter(el => el.getBoundingClientRect().height > 200 || /^(NAV|HEADER|FOOTER)$/.test(el.tagName));
 const seen = new Set(); list = list.filter(el => { const r = el.getBoundingClientRect(); const k = Math.round(r.top + scrollY) + ':' + Math.round(r.height); if (seen.has(k)) return false; seen.add(k); return true; });
 return list.slice(0, 80).map(el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); const h = el.querySelector('h1,h2,h3');
  return {sel: sel(el), id: el.id, framer: el.getAttribute('data-framer-name'), top: Math.round(r.top + scrollY), h: Math.round(r.height), bg: cs.backgroundColor, pos: cs.position, pad: cs.padding, heading: h ? (h.innerText || h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 70) : ''}; }); }"""


def pixel_rhythm(shot_dir, H):
    from PIL import Image
    rows, prev = [], None
    for f in sorted(glob.glob(os.path.join(shot_dir, '*.png'))):
        try:
            im = Image.open(f).convert('RGB')
        except Exception:
            continue
        y = int(os.path.basename(f).split('_')[1].split('.')[0])
        cols = []
        for fy in (0.1, 0.25, 0.5, 0.75, 0.97):
            px = [im.getpixel((x, int(im.height * fy))) for x in (20, im.width // 2, im.width - 20)]
            cols.append('#%02x%02x%02x' % px[0] + '|' + '#%02x%02x%02x' % px[1])
        sig = ' '.join(cols)
        rows.append({'scrollY': y, 'edge|centre at 10/25/50/75/97% of viewport': cols})
    return rows


def st_map(url, out, w=1440, h=900, step=None, mobile=False):
    tag = 'phone-%d' % w if mobile else 'desktop-%d' % w
    step = step or (700 if mobile else 300)
    sdir = P(out, '05-screens', tag, 'x')[:-2]
    shutil.rmtree(sdir, ignore_errors=True); os.makedirs(sdir, exist_ok=True)
    with sync_playwright() as pw:
        kw = {'is_mobile': True, 'has_touch': True, 'device_scale_factor': 1} if mobile else {}
        b, c, p = launch(pw, w, h, **kw)
        goto(p, url, 6000)
        tokens = p.evaluate(TOKENS_JS)
        secs = p.evaluate(SECTIONS_JS)
        H = page_height(p)
        stops, y, k = [], 0, 0
        while y <= H - h + step:
            real = scroll_to(p, y, 1100)          # 1.1 s lets scrub:1 timelines settle
            shot(p, os.path.join(sdir, '%03d_%d.png' % (k, real)))
            stops.append(real)
            y += step; k += 1; H = page_height(p)
            if real + h >= H - 1:
                break
        b.close()
    save(out, f'06-raw/map_{tag}.json', {'w': w, 'h': h, 'height': H, 'sections': secs, 'tokens': tokens, 'stops': stops, 'pixelRhythm': pixel_rhythm(sdir, H)})
    log('map', tag, 'height', H, 'sections', len(secs), 'shots', len(stops))


# ---------- 6. motion: GSAP when it's there, frame sampling when it isn't ----------
NAMED_EASES = {
    'linear': (0, 0, 1, 1), 'power1.in / sine-ish': (0.47, 0, 0.745, 0.715), 'power1.out': (0.39, 0.575, 0.565, 1), 'power1.inOut': (0.445, 0.05, 0.55, 0.95),
    'power2.in': (0.55, 0.085, 0.68, 0.53), 'power2.out': (0.25, 0.46, 0.45, 0.94), 'power2.inOut': (0.455, 0.03, 0.515, 0.955),
    'power3.in': (0.55, 0.055, 0.675, 0.19), 'power3.out': (0.215, 0.61, 0.355, 1), 'power3.inOut': (0.645, 0.045, 0.355, 1),
    'power4.in': (0.895, 0.03, 0.685, 0.22), 'power4.out': (0.165, 0.84, 0.44, 1), 'power4.inOut': (0.77, 0, 0.175, 1),
    'expo.out': (0.19, 1, 0.22, 1), 'expo.inOut': (1, 0, 0, 1), 'css ease': (0.25, 0.1, 0.25, 1), 'css ease-out': (0, 0, 0.58, 1), 'css ease-in-out': (0.42, 0, 0.58, 1),
    'back.out(1.7)': (0.175, 0.885, 0.32, 1.275), 'framer default spring-ish': (0.44, 0, 0.56, 1),
}


def bez(x1, y1, x2, y2, x):
    """y at x for a CSS cubic-bezier, by bisection on the x curve."""
    lo, hi = 0.0, 1.0
    for _ in range(30):
        t = (lo + hi) / 2
        bx = 3 * (1 - t) ** 2 * t * x1 + 3 * (1 - t) * t ** 2 * x2 + t ** 3
        if bx < x: lo = t
        else: hi = t
    t = (lo + hi) / 2
    return 3 * (1 - t) ** 2 * t * y1 + 3 * (1 - t) * t ** 2 * y2 + t ** 3


def fit_ease(ts, ps):
    """Fit a cubic-bezier to normalised (time, progress) samples. Nelder-Mead, no scipy needed."""
    def err(v):
        x1, y1, x2, y2 = v
        if not (0 <= x1 <= 1 and 0 <= x2 <= 1): return 9
        return sum((bez(x1, y1, x2, y2, t) - p) ** 2 for t, p in zip(ts, ps)) / len(ts)
    best = min(NAMED_EASES.items(), key=lambda kv: err(kv[1]))
    simplex = [list(best[1])] + [[a + (0.1 if i == j else 0) for j, a in enumerate(best[1])] for i in range(4)]
    for _ in range(250):
        simplex.sort(key=err)
        c = [sum(v[i] for v in simplex[:-1]) / 4 for i in range(4)]
        w = simplex[-1]
        r = [c[i] + (c[i] - w[i]) for i in range(4)]
        if err(r) < err(simplex[0]):
            e = [c[i] + 2 * (c[i] - w[i]) for i in range(4)]
            simplex[-1] = e if err(e) < err(r) else r
        elif err(r) < err(simplex[-2]):
            simplex[-1] = r
        else:
            k = [c[i] + 0.5 * (w[i] - c[i]) for i in range(4)]
            if err(k) < err(w): simplex[-1] = k
            else: simplex = [simplex[0]] + [[simplex[0][i] + 0.5 * (v[i] - simplex[0][i]) for i in range(4)] for v in simplex[1:]]
    simplex.sort(key=err)
    v = [round(a, 3) for a in simplex[0]]
    nearest = min(NAMED_EASES.items(), key=lambda kv: err(kv[1]))
    return {'cubicBezier': v, 'rmsError': round(math.sqrt(err(v)), 4), 'nearestNamed': nearest[0], 'nearestRms': round(math.sqrt(err(nearest[1])), 4)}


def analyse_series(item):
    """Turn raw frame samples of one element into from/to, start, duration and a fitted ease per property."""
    s = item['samples']
    names = ['x', 'y', 'scale', 'rotate', 'opacity']
    out = {}
    for i, n in enumerate(names):
        vals = [row[i + 1] for row in s]
        if max(vals) - min(vals) < (0.01 if n in ('scale', 'opacity') else 0.5):
            continue
        a, z = vals[0], vals[-1]
        span = z - a
        moving = [j for j in range(1, len(vals)) if abs(vals[j] - vals[j - 1]) > 1e-4]
        if not moving:
            continue
        j0, j1 = max(0, moving[0] - 1), moving[-1]
        t0, t1 = s[j0][0], s[j1][0]
        dts = sorted(s[k + 1][0] - s[k][0] for k in range(len(s) - 1)) or [16]
        rec = {'from': a, 'to': z, 'startMs': t0, 'durationMs': t1 - t0, 'accuracyMs': dts[len(dts) // 2], 'settled': j1 < len(vals) - 3}
        if abs(span) > 1e-6 and t1 > t0 and len(range(j0, j1 + 1)) >= 6 and rec['settled']:
            ts = [(s[j][0] - t0) / (t1 - t0) for j in range(j0, j1 + 1)]
            ps = [(vals[j] - a) / span for j in range(j0, j1 + 1)]
            if max(ps) <= 1.35 and min(ps) >= -0.35:
                rec['ease'] = fit_ease(ts, ps)
        else:
            rec['note'] = 'loop, still running, or too few frames to fit'
        out[n] = rec
    if any(r[6] for r in s) and s[0][6] != s[-1][6]:
        out['clipPath'] = {'from': s[0][6], 'to': s[-1][6]}
    if s[0][7] != s[-1][7]:
        out['filter'] = {'from': s[0][7], 'to': s[-1][7]}
    return out


def st_motion(url, out):
    with sync_playwright() as pw:
        b, c, p = launch(pw)
        # A. load sequence, sampled from the very start
        p.goto(url, wait_until='domcontentloaded', timeout=90000)
        load_seq = p.evaluate(SAMPLE, {'ms': 4500, 'maxEls': 400})
        p.wait_for_timeout(3000)
        H = page_height(p)
        # B. slow wheel pass like a real visitor, so every once-trigger fires
        while True:
            p.mouse.wheel(0, 300); p.wait_for_timeout(120)
            if p.evaluate('scrollY + innerHeight >= document.documentElement.scrollHeight - 2'): break
            if p.evaluate('scrollY') > 60000: break
        p.wait_for_timeout(2500)
        g = p.evaluate(DUMP_MOTION)
        gsap_found = g['tweenCount'] > 5
        # C. frame sampling at scroll stops (always run: catches non-GSAP motion on GSAP sites too)
        scroll_to(p, 0, 1500)
        vh = p.evaluate('innerHeight')
        stops, y = [], 0
        H = page_height(p)
        while y < H:
            real = scroll_to(p, y, 60)
            r = p.evaluate(SAMPLE, {'ms': 1600, 'maxEls': 350})
            r['requestedY'] = y
            stops.append(r)
            y += int(vh * 0.5)
            H = page_height(p)
        # D. scroll-linked check: same element, value vs scroll position with time held still
        b.close()
    for st in stops:
        for m in st['moving']:
            m['analysis'] = analyse_series(m)
            m['samples'] = m['samples'][::3]  # thin the raw frames for storage
    for m in load_seq['moving']:
        m['analysis'] = analyse_series(m)
        m['samples'] = m['samples'][::3]
    save(out, '06-raw/motion_gsap.json', g)
    save(out, '06-raw/motion_sampled.json', {'gsapFound': gsap_found, 'loadSequence': load_seq, 'scrollStops': stops})
    log('motion: gsap tweens', g['tweenCount'], 'triggers', len(g['triggers']), '| sampled moving elements', sum(len(s['moving']) for s in stops), '+ load', len(load_seq['moving']))


# ---------- 7. three: scene graphs, cameras, shaders ----------
STATE_JS = r"""() => { const X = window.__xr; const r3 = v => v ? [v.x, v.y, v.z].map(n => +(+n).toFixed(3)) : null;
 return X.three.filter(o => o && o.domElement && o.render).map(r => { const c = r.__xrCam, s = r.__xrScene; const rect = r.domElement.getBoundingClientRect();
  const kids = []; if (s) s.traverse(n => { if (kids.length < 14 && n !== s && (n.isMesh || n.isGroup || n.isPoints)) kids.push((n.name || n.type) + ' p' + JSON.stringify(r3(n.position)) + ' r' + JSON.stringify(r3(n.rotation)) + ' s' + JSON.stringify(r3(n.scale)) + (n.material && n.material.opacity < 1 ? ' o' + n.material.opacity.toFixed(2) : '')); });
  return {viewTop: Math.round(rect.top), frames: r.__xrFrames || 0, cam: c && {pos: r3(c.position), rot: r3(c.rotation), fov: c.fov && +c.fov.toFixed(2), zoom: c.zoom}, kids}; }); }"""


def st_three(url, out):
    pr = load(out, '06-raw/probe.json', {})
    if not pr.get('canvases') and not pr.get('threeVer'):
        log('three: no canvases, skipped'); save(out, '06-raw/three.json', {'skipped': 'no canvas on page'}); return
    with sync_playwright() as pw:
        b, c, p = launch(pw)
        goto(p, url, 7000)
        p.evaluate(DUMP_THREE)  # installs the render hooks
        tops = sorted(set([x['top'] for x in pr.get('canvases', [])]))
        for t in tops:           # draw each scene once before reading it
            scroll_to(p, max(0, t - 200), 1600)
        scroll_to(p, 0, 1500)
        d = p.evaluate(DUMP_THREE)
        for i, s in enumerate(d.get('shaders', [])):
            n = re.sub(r'[^\w-]', '_', f"{i:02d}_{s['owner']}_{s['type']}")[:60]
            open(P(out, '06-raw/shaders', n + '.vert'), 'w').write(s['vertex'] or '')
            open(P(out, '06-raw/shaders', n + '.frag'), 'w').write(s['fragment'] or '')
            s['vertex'] = s['fragment'] = 'shaders/' + n
        # raw WebGL shader sources caught by the hook (custom ones only, three.js chunks filtered)
        # every compiled program; keep custom ones (non-three, or three ShaderMaterial that isn't a built-in helper)
        allsrc = p.evaluate("() => (window.__xr.shaders || []).map(s => s.src)")
        builtin = re.compile(r'#define SHADER_TYPE (Mesh\w+|Line\w+|Points\w+|Sprite\w+|Shadow\w+)|#define SHADER_NAME (EquirectangularToCubeUV|PMREM\w+|CubemapToCubeUV|BackgroundMaterial|BackgroundCubeMaterial)')
        raw = [s for s in dict.fromkeys(allsrc) if not builtin.search(s) and len(s) < 80000]
        for i, src in enumerate(raw[:40]):
            kind = 'frag' if re.search(r'gl_FragColor|out\s+(highp\s+)?vec4\s+\w+\s*;|pc_fragColor', src) and 'gl_Position' not in src else 'vert'
            open(P(out, '06-raw/shaders', f'custom_{i:02d}.{kind}.glsl'), 'w').write(src)
        log('three: compiled programs', len(allsrc), 'custom kept', len(raw))
        samples = []
        H = page_height(p)
        for y in list(range(0, min(H, 2400), 300)) + [max(0, t - 900) + k for t in tops for k in (0, 450, 900, 1350)]:
            real = scroll_to(p, y, 1200)
            samples.append({'y': real, 'state': p.evaluate(STATE_JS)})
        scroll_to(p, 0, 1200)
        mouse = []
        for (mx, my) in [(720, 450), (100, 100), (1340, 100), (1340, 800), (100, 800), (720, 450)]:
            p.mouse.move(mx, my, steps=8); p.wait_for_timeout(900)
            st = p.evaluate(STATE_JS)
            mouse.append({'mouse': [mx, my], 'state': st[0] if st else None})
        d['scrollSamples'] = samples; d['mouseSamples'] = mouse
        save(out, '06-raw/three.json', d)
        b.close()
    log('three: renderers', len(d.get('renderers', [])), 'material shaders', len(d.get('shaders', [])))


# ---------- 8. pointer: video, cursor, hovers ----------
HOVER_JS = r"""(sel) => { const el = document.querySelector(sel); if (!el) return null; const out = []; let n = el, i = 0;
 while (n && i < 4) { const cs = getComputedStyle(n); out.push({sel: window.__xr.sel(n), transform: cs.transform, opacity: cs.opacity, color: cs.color, bg: cs.backgroundColor, border: cs.borderColor, shadow: cs.boxShadow, filter: cs.filter, clip: cs.clipPath, textDecoration: cs.textDecorationLine}); n = n.parentElement; i++; }
 const kids = [...el.querySelectorAll('*')].slice(0, 12).map(k => { const cs = getComputedStyle(k); return {sel: window.__xr.sel(k), transform: cs.transform, opacity: cs.opacity, color: cs.color, bg: cs.backgroundColor}; });
 return {chain: out, kids}; }"""

FOLLOWERS_JS = r"""() => [...document.querySelectorAll('body *')].filter(el => { const cs = getComputedStyle(el); return (cs.position === 'fixed' || cs.position === 'absolute') && cs.pointerEvents === 'none' && el.getBoundingClientRect().width < 260; }).slice(0, 200).map(el => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return {sel: window.__xr.sel(el), x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2), w: Math.round(r.width), blend: cs.mixBlendMode, opacity: cs.opacity}; })"""


def st_pointer(url, out):
    R = {}
    with sync_playwright() as pw:
        # A. load + pointer + scroll on video
        vdir = P(out, '06-raw/video_tmp/x')[:-2]
        b = pw.chromium.launch(args=ARGS)
        c = b.new_context(viewport={'width': 1440, 'height': 900}, record_video_dir=vdir, record_video_size={'width': 960, 'height': 600}, user_agent=UA)
        c.add_init_script(INJECT)
        p = c.new_page()
        t0 = time.time()
        p.goto(url, wait_until='commit', timeout=90000)
        p.wait_for_timeout(8000)
        marks = {'loaded': round(time.time() - t0, 1)}
        before = p.evaluate(FOLLOWERS_JS)
        for i in range(40):
            a = i / 40 * 2 * math.pi
            p.mouse.move(720 + 300 * math.cos(a), 430 + 200 * math.sin(a)); p.wait_for_timeout(40)
        p.mouse.move(1000, 300); p.wait_for_timeout(700)
        after = p.evaluate(FOLLOWERS_JS)
        # things that ended up near the pointer = cursor followers
        R['cursorFollowers'] = [a for a in after if abs(a['x'] - 1000) < 90 and abs(a['y'] - 300) < 90 and not any(bb['sel'] == a['sel'] and abs(bb['x'] - a['x']) < 5 for bb in before)]
        marks['circle'] = round(time.time() - t0, 1)
        p.mouse.move(200, 200, steps=2); p.mouse.move(1250, 700, steps=3); p.wait_for_timeout(1500)
        marks['flick'] = round(time.time() - t0, 1)
        for k in range(14):
            p.mouse.wheel(0, 120); p.wait_for_timeout(350)
        marks['scroll'] = round(time.time() - t0, 1)
        R['videoMarks'] = marks
        c.close(); b.close()
        v = glob.glob(vdir + '/*.webm')
        if v:
            shutil.move(v[0], P(out, '05-screens/video/load_pointer_scroll.webm'))
        shutil.rmtree(vdir, ignore_errors=True)
        # B. hover diffs on interactive elements
        b, c, p = launch(pw)
        goto(p, url, 7000)
        scroll_to(p, 1, 400)
        targets = p.evaluate(r"""() => { const seen = new Set(); const out = [];
          for (const el of document.querySelectorAll('nav a, header a, button, a[class], [role=button], article, li a, [data-cursor], [data-cursor-label]')) {
            const r = el.getBoundingClientRect(); if (r.width < 8 || r.height < 8) continue;
            const k = el.tagName + (el.getAttribute('class') || '').slice(0, 60); if (seen.has(k)) continue; seen.add(k);
            el.setAttribute('data-xr-hover', out.length); out.push({i: out.length, sel: window.__xr.sel(el), text: (el.innerText || el.textContent || '').trim().slice(0, 30), top: Math.round(r.top + scrollY)}); if (out.length >= 24) break; }
          return out; }""")
        hovers = []
        for t in targets:
            s = f'[data-xr-hover="{t["i"]}"]'
            try:
                real = scroll_to(p, max(0, t['top'] - 300), 600)
                p.mouse.move(5, 5); p.wait_for_timeout(300)
                a = p.evaluate(HOVER_JS, s)
                el = p.locator(s).first
                bb = el.bounding_box()
                if not bb: continue
                cx, cy = bb['x'] + bb['width'] / 2, bb['y'] + bb['height'] / 2
                p.mouse.move(cx - 6, cy - 3, steps=3); p.mouse.move(cx + 8, cy + 4, steps=4); p.wait_for_timeout(900)
                z = p.evaluate(HOVER_JS, s)
                diff = []
                for x, y2 in zip(a['chain'] + a['kids'], z['chain'] + z['kids']):
                    ch = {k: [x[k], y2[k]] for k in x if k != 'sel' and x[k] != y2[k]}
                    if ch: diff.append({'sel': x['sel'], 'changes': ch})
                if diff:
                    clip = {'x': max(0, bb['x'] - 60), 'y': max(0, bb['y'] - 60), 'width': min(1440, bb['width'] + 120), 'height': min(900, bb['height'] + 120)}
                    shot(p, P(out, '05-screens/states', f'hover_{t["i"]:02d}.png'), clip=clip)
                hovers.append({**t, 'changes': diff})
            except Exception as e:
                hovers.append({**t, 'error': str(e)[:100]})
        R['hovers'] = hovers
        b.close()
    save(out, '06-raw/pointer.json', R)
    log('pointer: cursor followers', len(R['cursorFollowers']), 'hover targets', len(R['hovers']), 'with changes', sum(1 for h in R['hovers'] if h.get('changes')))


# ---------- 9. states: menus, drawers, modals, other pages, 404 ----------
def st_states(url, out):
    pr = load(out, '06-raw/probe.json', {})
    R = {'routes': {}, 'opened': []}
    origin = '{0.scheme}://{0.netloc}'.format(urllib.parse.urlparse(url))
    with sync_playwright() as pw:
        b, c, p = launch(pw)
        goto(p, url, 7000)
        cands = p.evaluate(r"""() => [...document.querySelectorAll('button, [aria-haspopup], [aria-expanded], [aria-controls]')].filter(el => { const r = el.getBoundingClientRect(); return r.width > 6 && /menu|cart|bag|search|open|nav|close|filter|toggle|more/i.test((el.getAttribute('aria-label') || '') + ' ' + (el.innerText || '') + ' ' + (el.getAttribute('class') || '')); }).slice(0, 8).map((el, i) => { el.setAttribute('data-xr-open', i); return {i, label: (el.getAttribute('aria-label') || el.innerText || '').trim().slice(0, 40)}; })""")
        for cd in cands:
            try:
                p.locator(f'[data-xr-open="{cd["i"]}"]').first.click(timeout=4000)
                p.wait_for_timeout(1300)
                f = f'open_{cd["i"]:02d}_' + re.sub(r'\W+', '_', cd['label'])[:24] + '.png'
                shot(p, P(out, '05-screens/states', f))
                R['opened'].append({**cd, 'shot': f})
                p.keyboard.press('Escape'); p.wait_for_timeout(600)
            except Exception as e:
                R['opened'].append({**cd, 'error': str(e)[:80]})
        b.close()
        b, c, p = launch(pw)
        internal = []
        for h in pr.get('links', []):
            if not h or h.startswith(('#', 'mailto:', 'tel:', 'javascript:')): continue
            u = urllib.parse.urljoin(url, h)
            if u.startswith(origin) and u.rstrip('/') != url.rstrip('/') and u not in internal: internal.append(u)
        for u in internal[:10] + [origin + '/xray-page-that-does-not-exist']:
            try:
                r = p.goto(u, wait_until='load', timeout=60000); p.wait_for_timeout(3500)
                name = urllib.parse.urlparse(u).path.strip('/').replace('/', '_') or 'home'
                shot(p, P(out, '05-screens/states', 'route_' + name[:40] + '.png'))
                fetch(u, P(out, '04-code/html', name[:40] + '.server.html'))
                R['routes'][u] = {'status': r.status if r else None, 'title': p.title(), 'height': page_height(p)}
            except Exception as e:
                R['routes'][u] = {'error': str(e)[:80]}
        b.close()
    save(out, '06-raw/states.json', R)
    log('states: opened', len(R['opened']), 'routes', len(R['routes']))


# ---------- 10. responsive: fresh loads per width, live-resize test, reduced motion ----------
SIG_JS = r"""() => { const q = s => document.querySelector(s); const vis = el => el && getComputedStyle(el).display !== 'none' && el.getBoundingClientRect().width > 0;
 const h1 = q('h1'); const navLinks = [...document.querySelectorAll('nav a, header a')].filter(vis).length;
 return {height: document.documentElement.scrollHeight, h1: h1 ? getComputedStyle(h1).fontSize : null, visibleNavLinks: navLinks, hamburger: !!q('[aria-label*=menu i], [class*=burger], [class*=hamburger]'), canvases: document.querySelectorAll('canvas').length,
  overflowX: document.documentElement.scrollWidth > innerWidth + 1, customCursor: /cursor/.test(document.documentElement.className), pinSpacers: document.querySelectorAll('.pin-spacer').length, tweens: window.__xr ? window.__xr.tweens.length : null}; }"""


def st_responsive(url, out):
    R = {'fresh': [], 'liveResize': [], 'reducedMotion': None}
    with sync_playwright() as pw:
        for w, h, mob in [(360, 780, True), (390, 844, True), (768, 1024, True), (820, 1180, True), (1024, 768, False), (1280, 800, False), (1440, 900, False), (1920, 1080, False)]:
            kw = {'is_mobile': True, 'has_touch': True} if mob else {}
            for attempt in range(3):   # blank loads happen under software WebGL; retry them
                b, c, p = launch(pw, w, h, **kw)
                try:
                    goto(p, url, 6000)
                    s = p.evaluate(SIG_JS); s['w'] = w; s['touch'] = mob; s['attempt'] = attempt + 1
                except Exception as e:
                    s = {'w': w, 'error': str(e)[:80], 'height': 0}
                b.close()
                if s.get('height', 0) > h + 50: break
            R['fresh'].append(s)
        # live resize is a separate check: does the page survive crossing breakpoints without a reload?
        b, c, p = launch(pw, 1440, 900)
        goto(p, url, 6000)
        for w in [1440, 1024, 800, 760, 390, 760, 800, 1440]:
            p.set_viewport_size({'width': w, 'height': 900}); p.wait_for_timeout(1200)
            s = p.evaluate(SIG_JS); s['w'] = w; R['liveResize'].append(s)
        b.close()
        b, c, p = launch(pw, 1440, 900, reduced_motion='reduce')
        goto(p, url, 7000)
        R['reducedMotion'] = p.evaluate(SIG_JS)
        shot(p, P(out, '05-screens/states/reduced_motion_top.png'))
        b.close()
    # breakpoints = widths where the fresh-load signature changes
    bp, prev = [], None
    for s in R['fresh']:
        # layout signature only: nav collapse and pinned sections. Cursor/touch differences come from device emulation, reported separately.
        sig = ((s.get('visibleNavLinks') or 0) >= 4, (s.get('pinSpacers') or 0) > 0)
        if prev and sig != prev[1]:
            bp.append(f"layout changes between {prev[0]} and {s['w']} px")
        prev = (s['w'], sig)
    R['breakpointsFound'] = bp
    save(out, '06-raw/responsive.json', R)
    log('responsive:', '; '.join(bp) or 'no layout change found across widths')


# ---------- 11. a11y + meta ----------
def contrast(a, b):
    def L(c):
        c = [x / 255 for x in c]
        c = [x / 12.92 if x <= 0.03928 else ((x + 0.055) / 1.055) ** 2.4 for x in c]
        return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]
    la, lb = sorted([L(a), L(b)], reverse=True)
    return round((la + 0.05) / (lb + 0.05), 2)


def st_a11y(url, out):
    with sync_playwright() as pw:
        b, c, p = launch(pw, color_scheme='dark')
        goto(p, url, 7000)
        r = p.evaluate(r"""() => ({darkBodyBg: getComputedStyle(document.body).backgroundColor, prefersDarkRules: [...document.styleSheets].some(s => { try { return [...s.cssRules].some(x => x.media && /prefers-color-scheme/.test(x.media.mediaText)); } catch (e) { return false; } }),
          imgs: document.images.length, noAlt: [...document.images].filter(i => !i.hasAttribute('alt')).length, emptyAlt: [...document.images].filter(i => i.getAttribute('alt') === '').length,
          srOnly: document.querySelectorAll('.sr-only, .visually-hidden').length, ariaHidden: document.querySelectorAll('[aria-hidden=true]').length, skipLink: !!document.querySelector('a[href="#main"], a[href="#content"], [class*=skip]'),
          lang: document.documentElement.lang, landmarks: ['header', 'nav', 'main', 'footer'].map(t => t + ':' + document.querySelectorAll(t).length).join(' '),
          headings: [...document.querySelectorAll('h1,h2,h3')].map(h => h.tagName + ' ' + (h.innerText || h.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 60)).slice(0, 40)})""")
        p.keyboard.press('Tab'); p.wait_for_timeout(300); p.keyboard.press('Tab'); p.wait_for_timeout(400)
        r['focus'] = p.evaluate("() => { const a = document.activeElement; const cs = getComputedStyle(a); return {el: window.__xr.sel(a), outline: cs.outline, outlineOffset: cs.outlineOffset, boxShadow: cs.boxShadow}; }")
        shot(p, P(out, '05-screens/states/keyboard_focus.png'), clip={'x': 0, 'y': 0, 'width': 1440, 'height': 160})
        b.close()
    m = load(out, '06-raw/map_desktop-1440.json', {})
    cols = [x['k'] for x in m.get('tokens', {}).get('colors', [])]
    rgbs = lambda k: tuple(int(v) for v in re.findall(r'[\d.]+', k)[:3]) if 'rgb(' in k else None
    texts = [rgbs(k[5:]) for k in cols if k.startswith('text rgb(')][:6]
    bgs = [rgbs(k[3:]) for k in cols if k.startswith('bg rgb(')][:4]
    r['contrastPairs'] = [{'text': '#%02x%02x%02x' % t, 'bg': '#%02x%02x%02x' % g, 'ratio': contrast(t, g)} for t in texts if t for g in bgs if g and t != g]
    save(out, '06-raw/a11y.json', r)
    log('a11y: images without alt', r['noAlt'], 'contrast pairs', len(r['contrastPairs']))


# ---------- 12. weight ----------
def st_weight(url, out):
    tot, big = {}, []
    with sync_playwright() as pw:
        b, c, p = launch(pw)
        def onresp(r):
            try:
                t = r.request.resource_type
                size = int(r.headers.get('content-length') or 0)
                if not size:
                    try: size = len(r.body())
                    except Exception: size = 0
                tot.setdefault(t, [0, 0]); tot[t][0] += 1; tot[t][1] += size
                if size > 150000: big.append([r.url.split('?')[0][-90:], t, round(size / 1024)])
            except Exception:
                pass
        p.on('response', onresp)
        goto(p, url, 6000)
        H = page_height(p)
        for y in range(0, H, 1200): scroll_to(p, y, 400)
        p.wait_for_timeout(2000)
        timing = p.evaluate("() => { const n = performance.getEntriesByType('navigation')[0]; return {domContentLoadedMs: Math.round(n.domContentLoadedEventEnd), loadMs: Math.round(n.loadEventEnd), paints: performance.getEntriesByType('paint').map(x => x.name + ':' + Math.round(x.startTime))}; }")
        fps = p.evaluate("() => new Promise(res => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 2000) requestAnimationFrame(f); else res(Math.round(n / 2)); }; requestAnimationFrame(f); })")
        b.close()
    save(out, '06-raw/weight.json', {'note': 'uncompressed sizes; fps is cloud software rendering', 'byType': {k: {'files': v[0], 'kb': round(v[1] / 1024)} for k, v in tot.items()}, 'biggest': sorted(big, key=lambda x: -x[2])[:25], 'timing': timing, 'fpsAtTopCloud': fps})
    log('weight:', {k: round(v[1] / 1024) for k, v in tot.items()}, 'fps', fps)


# ---------- 13. sheets: contact sheets + frame strip ----------
def sheet(src_glob, dest, cols=4, tw=360, start=0, count=16):
    from PIL import Image, ImageDraw
    files = sorted(glob.glob(src_glob))[start:start + count]
    if not files: return None
    ims = [Image.open(f).convert('RGB') for f in files]
    th = int(ims[0].height * tw / ims[0].width)
    rows = (len(ims) + cols - 1) // cols
    S = Image.new('RGB', (cols * tw, rows * (th + 16)), 'white')
    d = ImageDraw.Draw(S)
    for i, (f, im) in enumerate(zip(files, ims)):
        x, y = (i % cols) * tw, (i // cols) * (th + 16)
        S.paste(im.resize((tw, int(im.height * tw / im.width))), (x, y + 16))
        d.text((x + 4, y + 2), os.path.basename(f), fill='red')
    S.save(dest)
    return dest


def st_sheets(url, out):
    made = []
    for tag in sorted(os.listdir(P(out, '05-screens/x')[:-2])):
        d = P(out, '05-screens', tag, 'x')[:-2]
        n = len(glob.glob(d + '/*.png'))
        if tag in ('sheets', 'video', 'states') or not n: continue
        for i in range(0, n, 16):
            made.append(sheet(d + '/*.png', P(out, '05-screens/sheets', f'{tag}_{i // 16}.png'), 4 if 'desktop' in tag else 6, 360 if 'desktop' in tag else 200, i, 16))
    made.append(sheet(P(out, '05-screens/states/x')[:-2] + '/*.png', P(out, '05-screens/sheets', 'states.png'), 3, 480, 0, 24))
    v = glob.glob(P(out, '05-screens/video/x')[:-2] + '/*.webm')
    if v and shutil.which('ffmpeg'):
        fd = P(out, '06-raw/frames/x')[:-2]
        os.makedirs(fd, exist_ok=True)
        for t in [0.5, 1.5, 2.5, 3.5, 5, 6.5, 8, 10, 14, 20, 28, 36, 40, 42, 44, 47, 50, 54]:
            subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-ss', str(t), '-i', v[0], '-frames:v', '1', '-vf', 'scale=480:-1', f'{fd}/f_{t:05.1f}.png'])
        made.append(sheet(fd + '/*.png', P(out, '05-screens/sheets', 'video_strip.png'), 6, 320, 0, 18))
    log('sheets:', len([m for m in made if m]))


# ---------- 14. build: the 02-data files ----------
def st_build(url, out):
    g = load(out, '06-raw/motion_gsap.json', {'tweens': [], 'triggers': [], 'timelines': []})
    sm = load(out, '06-raw/motion_sampled.json', {'scrollStops': [], 'loadSequence': {'moving': []}})
    m = load(out, '06-raw/map_desktop-1440.json', {})
    th = load(out, '06-raw/three.json', {})
    effects, seen = [], set()
    for t in g.get('tweens', []):
        if not t['duration'] or (t['target'] or '').startswith('obj') or '+=' in json.dumps(t['to']): continue
        key = (t['ctx'], json.dumps(t['from']), json.dumps(t['to']), t['ease'])
        if key in seen: continue
        seen.add(key)
        st = t['scrollTrigger']
        effects.append({'source': 'gsap', 'evidence': 'measured', 'section': (t['ctx'] or '').split(' | ')[0], 'heading': (t['ctx'] or ' | ').split(' | ')[-1], 'element': t['target'], 'sampleText': t['text'], 'targets': t['targets'], 'kind': t['kind'], 'from': t['from'], 'to': t['to'], 'durationS': t['duration'], 'delayS': t['delay'], 'ease': t['ease'], 'stagger': t['stagger'], 'repeat': t['repeat'], 'yoyo': t['yoyo'], 'trigger': (f"scroll {st['start']}" + (' scrub' if st['scrub'] else ' once' if st['once'] else ' play')) if st else 'load, state change or parent timeline'})
    seen_el = set()
    for block, where in [(sm['loadSequence'], 'on load'), *[(s, f"after scrolling to {s['scrollY']}") for s in sm['scrollStops']]]:
        for it in block.get('moving', []):
            a = it.get('analysis') or {}
            if not a: continue
            k = (it['el'], json.dumps({p: (v.get('from'), v.get('to')) for p, v in a.items()}))
            if k in seen_el: continue
            seen_el.add(k)
            effects.append({'source': 'frame sampling', 'evidence': 'fitted' if any('ease' in v for v in a.values() if isinstance(v, dict)) else 'inferred', 'when': where, 'element': it['el'], 'sampleText': it['text'], 'framerName': it.get('framer'), 'cssAnimations': it.get('cssAnimations'), 'properties': a})
    for i, e in enumerate(effects): e['id'] = f'fx{i + 1:03d}'
    save(out, '02-data/motion.json', {'site': url, 'viewport': '1440x900', 'gsapFound': bool(g.get('tweens')), 'effects': effects})
    save(out, '02-data/scroll-map.json', {'pageHeight1440': m.get('height'), 'sections1440': m.get('sections'), 'pixelRhythm1440': m.get('pixelRhythm'), 'lenis': g.get('lenis'), 'triggers': g.get('triggers', [])})
    t = m.get('tokens', {})
    save(out, '02-data/tokens.json', {'cssVariables': t.get('vars'), 'fontFaces': t.get('faces'), 'mediaQueries': t.get('media'), 'keyframes': t.get('keyframes'), 'colors': t.get('colors', [])[:80], 'typeScale1440': t.get('type', [])[:60], 'radii': t.get('radii'), 'shadows': t.get('shadows'), 'blendModes': t.get('blends'), 'filtersClipsMasks': t.get('filters'), 'phone': (load(out, '06-raw/map_phone-390.json', {}) or {}).get('tokens', {}).get('type', [])[:40]})
    save(out, '02-data/scene-3d.json', th)
    save(out, '02-data/interactions-and-responsive.json', {'pointer': load(out, '06-raw/pointer.json'), 'states': load(out, '06-raw/states.json'), 'responsive': load(out, '06-raw/responsive.json'), 'a11y': load(out, '06-raw/a11y.json'), 'weight': load(out, '06-raw/weight.json'), 'assets': load(out, '06-raw/assets.json')})
    log('build: effects', len(effects), '(gsap', sum(1 for e in effects if e['source'] == 'gsap'), ', sampled', sum(1 for e in effects if e['source'] != 'gsap'), ')')


STAGES = ['probe', 'code', 'bundle', 'assets', 'map', 'phone', 'motion', 'three', 'pointer', 'states', 'responsive', 'a11y', 'weight', 'sheets', 'build']


def run(stage, url, out):
    t = time.time()
    try:
        if stage == 'phone': st_map(url, out, 390, 844, None, True)
        else: globals()['st_' + stage](url, out)
    except Exception as e:
        log(f'STAGE FAILED: {stage}: {str(e)[:300]}')
        with open(P(out, '06-raw/failures.txt'), 'a') as f: f.write(f'{stage}: {e}\n')
    log(f'{stage} done in {round(time.time() - t)} s')


if __name__ == '__main__':
    if len(sys.argv) < 4:
        print(__doc__); sys.exit(1)
    stage, url, out = sys.argv[1], sys.argv[2], sys.argv[3]
    os.makedirs(out, exist_ok=True)
    for s in (STAGES if stage == 'all' else stage.split(',')):
        run(s, url, out)
