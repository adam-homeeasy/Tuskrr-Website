"""Downloads the chosen stock clips, trims and compresses them for embedding, and
cuts stills. Writes brand-world/sites/media/<id>.mp4, <id>-poster.jpg, stills
<id>-<n>.jpg and credits.json.

Run: python3 brand-world/sites/src/media.py CANDIDATE_DIR
CANDIDATE_DIR holds the JSON written by stock-search.py.
"""
import json, os, subprocess, sys, io
import imageio_ffmpeg
from PIL import Image

FF = imageio_ffmpeg.get_ffmpeg_exe()
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, '..', 'media')
RAW = os.path.join(os.environ.get('TMPDIR_MEDIA', '/tmp'), 'tuskrr-raw')

# id: (candidate file, index, clip start s, clip length s, still times s)
CLIPS = {
    'door':       ('coverr-door', 6, 1.0, 7, [3.0, 7.0]),
    'enters':     ('coverr-businessman', 7, 0.5, 6, [2.0]),
    'rooftop':    ('mk-businessman', 0, 0.5, 7, [2.0, 6.0]),
    'jacket':     ('mk-businessman', 10, 0.5, 6, [2.5]),
    'corridor':   ('mk-corridor', 4, 0.5, 6, [3.0]),
    'citynight':  ('coverr-city-night', 0, 1.0, 8, [4.0]),
    'traffic':    ('mk-light', 18, 0.5, 7, [3.0]),
    'tunnel':     ('mk-light', 13, 0.5, 6, [3.0]),
    'bw-walk':    ('coverr-businesswoman', 0, 0.5, 7, [2.0, 6.0]),
    'bw-work':    ('coverr-businesswoman', 2, 1.0, 7, [3.0, 9.0]),
    'bw-profile': ('coverr-businesswoman', 9, 1.0, 6, [3.0, 8.0]),
    'bw-phone':   ('coverr-businesswoman', 6, 1.0, 6, [4.0]),
    'bw-think':   ('coverr-businesswoman', 1, 1.0, 6, [5.0]),
    'departures': ('coverr-airport', 6, 0.5, 6, [3.0]),
    'boarding':   ('coverr-airport', 0, 1.0, 6, [4.0]),
    'office':     ('coverr-walking-office', 4, 0.5, 7, [3.0]),
    'ridge':      ('coverr-mountain-ridge', 5, 1.0, 8, [4.0]),
    'trail':      ('coverr-trail', 7, 2.0, 8, [6.0, 20.0]),
    'hikers':     ('coverr-trail', 8, 1.0, 7, [4.0]),
    'strata':     ('coverr-rock', 15, 1.0, 8, [4.0]),
    'crest':      ('coverr-waves', 1, 1.0, 8, [4.0]),
    'axis':       ('coverr-river-aerial', 6, 1.0, 8, [4.0]),
    'contour':    ('coverr-river-aerial', 1, 1.0, 8, [4.0]),
    'leather':    ('mk-leather', 0, 0.2, 7, [1.0, 5.0]),
    'tannery':    ('mk-leather', 1, 0.5, 6, [2.0, 5.0]),
    'gift':       ('coverr-gift', 0, 0.5, 6, [3.0]),
    'gift-box':   ('coverr-gift', 3, 0.5, 6, [3.0]),
    'study':      ('mk-corridor', 7, 0.5, 6, [2.0]),
    'writer':     ('mk-business-woman', 3, 0.5, 6, [2.0]),
    'caller':     ('mk-business-woman', 12, 0.5, 6, [2.0]),
}

# Photos from Burst (Shopify's free stock), by candidate index.
PHOTOS = {
    'p-phone-man': ('burst-indian-man', 15),
    'p-portrait-man': ('burst-indian-man', 6),
    'p-gift-man': ('burst-indian-man', 17),
    'p-smile-man': ('burst-indian-man', 18),
    'p-arches': ('burst-indian-man', 5),
}


def run(args):
    r = subprocess.run(args, capture_output=True)
    if r.returncode:
        raise RuntimeError(r.stderr.decode()[-600:])


def get(url, path):
    if not os.path.exists(path) or os.path.getsize(path) < 1000:
        run(['curl', '-sSL', '--max-time', '180', '-A', 'Mozilla/5.0', '-o', path, url])


def still(src, t, path, width=1600, q=74):
    tmp = path + '.png'
    run([FF, '-y', '-loglevel', 'error', '-ss', str(t), '-i', src, '-frames:v', '1', tmp])
    im = Image.open(tmp).convert('RGB')
    im.thumbnail((width, width))
    im.save(path, 'JPEG', quality=q, optimize=True, progressive=True)
    os.remove(tmp)


def main(cand):
    os.makedirs(OUT, exist_ok=True)
    os.makedirs(RAW, exist_ok=True)
    credits = {}
    for cid, (f, i, start, dur, stills) in CLIPS.items():
        it = json.load(open(os.path.join(cand, f + '.json')))[i]
        raw = os.path.join(RAW, cid + '.mp4')
        get(it['url'], raw)
        out = os.path.join(OUT, cid + '.mp4')
        if not os.path.exists(out):
            run([FF, '-y', '-loglevel', 'error', '-ss', str(start), '-i', raw, '-t', str(dur), '-an',
                 '-vf', 'scale=1280:-2:flags=lanczos,fps=25', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30',
                 '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out])
        still(out, 0.2, os.path.join(OUT, cid + '-poster.jpg'), width=1280, q=70)
        for n, t in enumerate(stills):
            still(raw, t, os.path.join(OUT, f'{cid}-{n}.jpg'))
        credits[cid] = {'kind': 'video', 'title': it['title'], 'source': it['src'], 'page': it['page'], 'license': it['license'], 'creator': it['creator']}
        print(cid, f"{os.path.getsize(out) / 1e6:.2f} MB", it['title'])
    for pid, (f, i) in PHOTOS.items():
        it = json.load(open(os.path.join(cand, f + '.json')))[i]
        raw = os.path.join(RAW, pid + '.jpg')
        get(it['url'], raw)
        im = Image.open(raw).convert('RGB')
        im.thumbnail((1600, 1600))
        im.save(os.path.join(OUT, pid + '.jpg'), 'JPEG', quality=74, optimize=True, progressive=True)
        credits[pid] = {'kind': 'photo', 'title': it['title'], 'source': it['src'], 'page': it['page'], 'license': it['license'], 'creator': it['creator']}
        print(pid, it['title'])
    json.dump(credits, open(os.path.join(OUT, 'credits.json'), 'w'), indent=1)


if __name__ == '__main__':
    main(sys.argv[1])
