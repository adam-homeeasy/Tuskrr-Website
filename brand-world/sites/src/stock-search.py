"""Stock search for the direction sites. Queries Coverr (video), Burst by Shopify
(photos) and Openverse (Creative Commons photos, commercial use and
modification allowed), then writes numbered contact sheets for picking.

Run: python3 brand-world/sites/src/stock-search.py OUTDIR "coverr:city night" "burst:leather" "ov:mumbai street"
Writes OUTDIR/<source>-<query>.json and .jpg (contact sheet).
"""
import io, json, os, re, subprocess, sys, urllib.parse
from concurrent.futures import ThreadPoolExecutor
from PIL import Image, ImageDraw

UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140 Safari/537.36'


def fetch(url, binary=False, t=40):
    r = subprocess.run(['curl', '-sSL', '--max-time', str(t), '-A', UA, url], capture_output=True)
    return r.stdout if binary else r.stdout.decode('utf8', 'replace')


def coverr(q):
    j = json.loads(fetch('https://coverr.co/api/videos?query=' + urllib.parse.quote(q)))
    out = []
    for h in j.get('hits', []):
        if h.get('is_premium') or h.get('is_ai_generated'):
            continue
        out.append({'src': 'coverr', 'kind': 'video', 'title': h['title'].strip(), 'desc': (h.get('description') or '')[:140],
                    'thumb': h['thumbnail'], 'poster': h['poster'], 'duration': float(h.get('duration') or 0),
                    'vertical': h.get('is_vertical'), 'ratio': h.get('aspect_ratio'),
                    'url': f"https://cdn.coverr.co/videos/{h['base_filename']}/720p.mp4",
                    'page': f"https://coverr.co/videos/{h.get('slug', '')}", 'license': 'Coverr license (free for commercial use)', 'creator': 'Coverr'})
    return out


def mixkit(q):
    html = fetch('https://mixkit.co/free-stock-video/' + re.sub(r'[^a-z0-9]+', '-', q.lower()).strip('-') + '/')
    out = []
    for vid, alt in re.findall(r'<img src="https://assets\.mixkit\.co/videos/(\d+)/\1-thumb-360-0\.jpg"[^>]*alt="([^"]*)"', html):
        out.append({'src': 'mixkit', 'kind': 'video', 'title': alt[:80], 'thumb': f'https://assets.mixkit.co/videos/{vid}/{vid}-thumb-360-0.jpg',
                    'poster': f'https://assets.mixkit.co/videos/{vid}/{vid}-thumb-720-0.jpg', 'url': f'https://assets.mixkit.co/videos/{vid}/{vid}-720.mp4',
                    'page': f'https://mixkit.co/free-stock-video/{vid}/', 'license': 'Mixkit Stock Video Free License', 'creator': 'Mixkit', 'id': vid})
    return list({o['id']: o for o in out}.values())


def burst(q):
    html = fetch('https://burst.shopify.com/photos/search?q=' + urllib.parse.quote_plus(q))
    urls = list(dict.fromkeys(re.findall(r'https://burst\.shopifycdn\.com/photos/[a-z0-9-]+\.jpg', html)))
    return [{'src': 'burst', 'kind': 'image', 'title': u.rsplit('/', 1)[1][:-4].replace('-', ' '), 'thumb': u + '?width=400',
             'url': u + '?width=2000', 'page': 'https://burst.shopify.com/photos/' + u.rsplit('/', 1)[1][:-4],
             'license': 'Burst (Shopify) free license, commercial use', 'creator': 'Burst'} for u in urls[:24]]


def openverse(q):
    u = 'https://api.openverse.org/v1/images/?' + urllib.parse.urlencode({'q': q, 'license_type': 'commercial,modification', 'page_size': 20, 'size': 'large', 'category': 'photograph', 'mature': 'false'})
    j = json.loads(fetch(u))
    return [{'src': 'openverse', 'kind': 'image', 'title': (r.get('title') or '')[:80], 'thumb': r.get('thumbnail') or r['url'], 'url': r['url'],
             'page': r.get('foreign_landing_url'), 'license': f"CC {r.get('license', '').upper()} {r.get('license_version', '')}".strip(),
             'creator': r.get('creator') or 'unknown', 'w': r.get('width'), 'h': r.get('height')} for r in j.get('results', [])]


def sheet(items, path, cols=5, tw=300, th=190):
    def load(it):
        try:
            im = Image.open(io.BytesIO(fetch(it['thumb'], binary=True, t=25))).convert('RGB')
            im.thumbnail((tw, th))
            return im
        except Exception:
            return None
    with ThreadPoolExecutor(8) as ex:
        ims = list(ex.map(load, items))
    rows = (len(items) + cols - 1) // cols
    S = Image.new('RGB', (cols * tw, rows * (th + 18)), (30, 30, 30))
    d = ImageDraw.Draw(S)
    for i, (it, im) in enumerate(zip(items, ims)):
        x, y = (i % cols) * tw, (i // cols) * (th + 18)
        if im:
            S.paste(im, (x + (tw - im.width) // 2, y))
        d.rectangle([x, y + th, x + tw, y + th + 18], fill=(0, 0, 0))
        label = f"{i} {it['title'][:34]}" + (f" {it['duration']:.0f}s" if it.get('duration') else '')
        d.text((x + 4, y + th + 3), label, fill=(255, 255, 0))
    S.save(path, quality=80)


if __name__ == '__main__':
    out = sys.argv[1]
    os.makedirs(out, exist_ok=True)
    for arg in sys.argv[2:]:
        src, q = arg.split(':', 1)
        items = {'coverr': coverr, 'burst': burst, 'ov': openverse, 'mk': mixkit}[src](q)
        slug = f"{src}-{re.sub(r'[^a-z0-9]+', '-', q.lower()).strip('-')}"
        json.dump(items, open(os.path.join(out, slug + '.json'), 'w'), indent=1)
        if items:
            sheet(items[:20], os.path.join(out, slug + '.jpg'))
        print(slug, len(items))
