"""Reads each reference site's shipped HTML and CSS (no browser) and counts the
declared design values: easings, durations, delays, keyframes, colours, fonts,
custom properties, media and libraries. Run: python3 brand-world/references/read-source.py

This is design-dna step 3 (read the declarations). It cannot give from-states,
travel distances or computed colours per surface; those need a live browser
(measure.mjs) and are recorded as unknown until measured.
"""
import collections, json, os, re, subprocess, sys, urllib.parse, datetime

HERE = os.path.dirname(os.path.abspath(__file__))
SITES = [
    ('springsummer', 'https://springsummer.dk/'),
    ('basic-agency', 'https://www.basicagency.com/'),
    ('hellohello-outfit', 'https://outfit.hellohello.is/'),
    ('stroms-man', 'https://stroms.com/pages/man'),
    ('brunello-cucinelli-ai', 'https://shop.brunellocucinelli.com/en-gb/ai'),
    ('bread-and-boxers', 'https://breadandboxers.com/se'),
    ('offform', 'https://offform.net/'),
    ('unimatic-impronte', 'https://www.unimaticwatches.com/pages/impronte-collection'),
]
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36'


def get(url, limit=6_000_000):
    r = subprocess.run(['curl', '-sSL', '--compressed', '--max-time', '40', '-A', UA, '-H', 'Accept-Language: en-GB,en;q=0.9',
                        '-w', '\n__STATUS__%{http_code}', url], capture_output=True)
    body = r.stdout[:limit].decode('utf8', 'replace')
    m = re.search(r'\n__STATUS__(\d+)$', body)
    status = int(m.group(1)) if m else 0
    return status, body[:m.start()] if m else body


def top(counter, n=12):
    return counter.most_common(n)


def hexnorm(h):
    h = h.lower()
    if len(h) == 4:
        h = '#' + ''.join(c * 2 for c in h[1:])
    return h[:7]


def analyse(slug, url):
    out = {'url': url, 'read': datetime.date.today().isoformat(), 'method': 'source read (HTML + linked CSS), no browser'}
    status, html = get(url)
    out['status'] = status
    out['htmlBytes'] = len(html)
    if status >= 400 or len(html) < 500:
        out['error'] = f'HTTP {status}, {len(html)} bytes'
        out['htmlHead'] = html[:600]
        return out
    base = url
    css_urls = re.findall(r'<link[^>]+rel=["\']?(?:stylesheet|preload)["\']?[^>]*href=["\']([^"\']+\.css[^"\']*)', html, re.I)
    css_urls += re.findall(r'<link[^>]+href=["\']([^"\']+\.css[^"\']*)["\'][^>]*rel=["\']?stylesheet', html, re.I)
    css = '\n'.join(re.findall(r'<style[^>]*>([\s\S]*?)</style>', html, re.I))
    inline_style = ' '.join(re.findall(r'style="([^"]*)"', html))
    fetched = []
    for u in dict.fromkeys(css_urls):
        full = urllib.parse.urljoin(base, u.replace('&amp;', '&'))
        s, body = get(full)
        fetched.append([full[:140], s, len(body)])
        if s < 400:
            css += '\n' + body
    out['css'] = {'files': fetched, 'bytes': len(css)}
    allcss = css + '\n' + inline_style

    # motion declarations
    easings = collections.Counter(re.findall(r'cubic-bezier\([^)]*\)', allcss.replace(' ', '')))
    for kw in ['ease-in-out', 'ease-out', 'ease-in', 'linear', 'ease']:
        n = len(re.findall(r'(?:transition|animation)[^;{}]*\b' + kw + r'\b(?!-)', allcss))
        if n:
            easings[kw] += n
    out['easings'] = top(easings, 14)
    trans = re.findall(r'transition(?:-duration)?\s*:\s*([^;}]+)', allcss)
    durs = collections.Counter()
    for t in trans:
        for d in re.findall(r'(?<![\w.-])(\d*\.?\d+m?s)\b', t):
            durs[d] += 1
    out['transitionDurations'] = top(durs, 14)
    out['transitionDecls'] = top(collections.Counter(t.strip()[:110] for t in trans), 14)
    delays = collections.Counter(d.strip() for d in re.findall(r'(?:transition|animation)-delay\s*:\s*([^;}]+)', allcss))
    out['delays'] = top(delays, 16)
    anims = re.findall(r'animation\s*:\s*([^;}]+)', allcss)
    out['animationDecls'] = top(collections.Counter(a.strip()[:110] for a in anims), 12)
    kf = re.findall(r'@(?:-webkit-)?keyframes\s+([\w-]+)\s*\{((?:[^{}]*\{[^{}]*\})*[^{}]*)\}', allcss)
    out['keyframes'] = [[n, re.sub(r'\s+', ' ', b)[:260]] for n, b in kf][:24]
    trf = collections.Counter(re.findall(r'translate(?:3d|Y|X)?\([^)]*\)', allcss))
    out['translates'] = top(trf, 14)

    # colour and type
    hexes = collections.Counter(hexnorm(h) for h in re.findall(r'#[0-9a-fA-F]{6}\b|#[0-9a-fA-F]{3}\b', allcss))
    out['hexColours'] = top(hexes, 20)
    rgbs = collections.Counter(re.sub(r'\s', '', r) for r in re.findall(r'rgba?\([^)]*\)', allcss))
    out['rgbColours'] = top(rgbs, 12)
    out['customProps'] = [[k, v.strip()[:80]] for k, v in re.findall(r'(--[\w-]+)\s*:\s*([^;}]+)', allcss)
                          if re.search(r'#|rgb|hsl|cubic|ms\b|\ds\b|font|px|rem|vw|clamp', v)][:70]
    faces = re.findall(r'@font-face\s*\{([^}]*)\}', allcss)
    fam = collections.Counter()
    for f in faces:
        m = re.search(r'font-family\s*:\s*["\']?([^;"\']+)', f)
        w = re.search(r'font-weight\s*:\s*([^;]+)', f)
        st = re.search(r'font-style\s*:\s*([^;]+)', f)
        if m:
            fam[f"{m.group(1).strip()} {w.group(1).strip() if w else ''} {st.group(1).strip() if st and 'italic' in st.group(1) else ''}".strip()] += 1
    out['fontFaces'] = top(fam, 20)
    out['fontFamilies'] = top(collections.Counter(f.strip()[:70] for f in re.findall(r'font-family\s*:\s*([^;}]+)', allcss)), 12)
    out['fontSizes'] = top(collections.Counter(re.findall(r'font-size\s*:\s*([^;}!]+)', allcss)), 16)
    out['letterSpacing'] = top(collections.Counter(re.findall(r'letter-spacing\s*:\s*([^;}!]+)', allcss)), 10)
    out['textTransform'] = top(collections.Counter(re.findall(r'text-transform\s*:\s*([^;}!]+)', allcss)), 5)
    out['blend'] = top(collections.Counter(re.findall(r'mix-blend-mode\s*:\s*([^;}!]+)', allcss)), 5)
    out['backdrop'] = top(collections.Counter(re.findall(r'backdrop-filter\s*:\s*([^;}!]+)', allcss)), 5)
    out['gradients'] = top(collections.Counter(g[:160] for g in re.findall(r'(?:linear|radial)-gradient\((?:[^()]|\([^)]*\))*\)', allcss)), 8)
    out['aspectRatios'] = top(collections.Counter(re.findall(r'aspect-ratio\s*:\s*([^;}!]+)', allcss)), 10)
    out['gridCols'] = top(collections.Counter(re.findall(r'grid-template-columns\s*:\s*([^;}!]+)', allcss)), 10)
    out['radius'] = top(collections.Counter(re.findall(r'border-radius\s*:\s*([^;}!]+)', allcss)), 8)

    # page content and media
    out['title'] = (re.search(r'<title[^>]*>([\s\S]*?)</title>', html, re.I) or [None, ''])[1].strip()[:120]
    out['metaDescription'] = (re.search(r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)', html, re.I) or [None, ''])[1][:220]
    out['headings'] = [re.sub(r'<[^>]+>|\s+', ' ', h).strip()[:100] for h in re.findall(r'<h[1-3][^>]*>([\s\S]*?)</h[1-3]>', html, re.I)][:24]
    out['navLinks'] = list(dict.fromkeys(re.sub(r'<[^>]+>|\s+', ' ', a).strip() for a in re.findall(r'<a[^>]*>([\s\S]{1,120}?)</a>', html, re.I)))[:60]
    vids = re.findall(r'<video[\s\S]*?</video>|<video[^>]*>', html, re.I)
    out['videos'] = [{'attrs': ' '.join(sorted(set(re.findall(r'\b(autoplay|loop|muted|playsinline|controls)\b', v)))),
                      'src': (re.findall(r'(?:src|data-src)=["\']([^"\']+)', v) or [''])[0][:140]} for v in vids][:20]
    out['videoUrls'] = list(dict.fromkeys(re.findall(r'https?:[^"\'\s)]+\.(?:mp4|webm|m3u8)', html)))[:20]
    out['vimeoYoutube'] = len(re.findall(r'vimeo\.com|youtube\.com/embed|player\.vimeo|mux\.com|stream\.mux', html))
    out['imgTags'] = len(re.findall(r'<img\b', html, re.I))
    out['pictureTags'] = len(re.findall(r'<picture\b', html, re.I))
    out['svgTags'] = len(re.findall(r'<svg\b', html, re.I))
    out['canvasTags'] = len(re.findall(r'<canvas\b', html, re.I))
    out['sections'] = len(re.findall(r'<section\b', html, re.I))
    words = re.sub(r'<script[\s\S]*?</script>|<style[\s\S]*?</style>|<[^>]+>', ' ', html)
    out['visibleWords'] = len(re.findall(r'\w+', words))
    scripts = re.findall(r'<script[^>]+src=["\']([^"\']+)', html, re.I)
    out['scripts'] = [s.split('?')[0][-90:] for s in scripts][:40]
    blob = html + ' '.join(scripts)
    libs = {
        'gsap': r'gsap', 'ScrollTrigger': r'ScrollTrigger', 'lenis': r'lenis', 'locomotive': r'locomotive',
        'three.js': r'three(\.module)?(\.min)?\.js|THREE\.', 'swiper': r'swiper', 'barba': r'barba', 'swup': r'swup',
        'shopify': r'cdn\.shopify|Shopify\.', 'next.js': r'_next/|__NEXT_DATA__', 'nuxt': r'_nuxt/|__NUXT__',
        'framer': r'framerusercontent|data-framer', 'webflow': r'webflow', 'sanity': r'sanity', 'prismic': r'prismic',
        'splide': r'splide', 'flickity': r'flickity', 'astro': r'astro', 'wordpress': r'wp-content', 'sfcc': r'demandware|/on/demandware',
        'vue': r'vue(\.runtime)?(\.min)?\.js|data-v-', 'react': r'react', 'hls': r'hls\.js|\.m3u8', 'rive': r'rive', 'lottie': r'lottie',
    }
    out['libs'] = [k for k, v in libs.items() if re.search(v, blob, re.I)]
    return out


if __name__ == '__main__':
    only = sys.argv[1:]
    for slug, url in SITES:
        if only and slug not in only:
            continue
        d = os.path.join(HERE, slug)
        os.makedirs(d, exist_ok=True)
        res = analyse(slug, url)
        with open(os.path.join(d, 'source.json'), 'w') as f:
            json.dump(res, f, indent=1, ensure_ascii=False)
        print(slug, res.get('status'), res.get('error') or f"css={res['css']['bytes']} easings={res['easings'][:3]} libs={res['libs']}")
