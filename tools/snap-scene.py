# Turns an AI-made "pixel art" background (big, blurry) back into real pixel art at its true resolution.
#   python tools/snap-scene.py <scene.jpg|png> <block> <name>
# block = the size of one "pixel" in the source (may be fractional). Writes sprites/<name>.png and records,
# in sprites/scenes.json, where the floor starts (as a share of the height) so the app can line it up with Plop's floor.
import sys, json, os
from PIL import Image

src, B, name = sys.argv[1], float(sys.argv[2]), sys.argv[3]
im = Image.open(src).convert('RGB'); W, H = im.size; px = im.load()
dist = lambda a, b: sum(abs(x - y) for x, y in zip(a, b))
at = lambda x, y: px[min(W - 1, max(0, int(x))), min(H - 1, max(0, int(y)))]

# best grid offset: blocks should be flat inside
best = None
for ox in [k * 0.5 for k in range(int(B * 2))]:
    for oy in [k * 0.5 for k in range(int(B * 2))]:
        err = 0
        for j in range(2, int(H / B) - 2, 4):
            for i in range(2, int(W / B) - 2, 4):
                cx, cy = ox + (i + 0.5) * B, oy + (j + 0.5) * B
                err += dist(at(cx - B * 0.3, cy - B * 0.3), at(cx + B * 0.3, cy + B * 0.3))
        if best is None or err < best[0]: best = (err, ox, oy)
_, ox, oy = best
w, h = int((W - ox) / B), int((H - oy) / B)
r = max(1, int(B * 0.22))
out = Image.new('RGB', (w, h))
for j in range(h):
    for i in range(w):
        cx, cy = ox + (i + 0.5) * B, oy + (j + 0.5) * B
        ss = [at(cx + u, cy + v) for u in range(-r, r + 1) for v in range(-r, r + 1)]
        out.putpixel((i, j), tuple(sorted(q[k] for q in ss)[len(ss) // 2] for k in range(3)))   # per-channel median: ignores JPEG fringes
out = out.quantize(colors=128, method=Image.Quantize.MEDIANCUT).convert('RGB')                    # a tidy palette (128: small accents like a plant keep their colour)

# the floor starts at the darkest long horizontal line in the middle of the picture, between 55% and 90% down
op = out.load()
def darkness(y): return sum(1 for x in range(w // 4, 3 * w // 4) if sum(op[x, y]) < 150)
floor_row = max(range(int(h * 0.55), int(h * 0.9)), key=darkness)
os.makedirs('sprites', exist_ok=True)
out.save('sprites/%s.png' % name)
out.resize((w * 4, h * 4), Image.NEAREST).save('sprites/%s-preview.png' % name)
meta_path = 'sprites/scenes.json'
meta = json.load(open(meta_path)) if os.path.exists(meta_path) else {'floor': {}}
meta['floor'][name.replace('scene-', '')] = round((floor_row + 1) / h, 3)
json.dump(meta, open(meta_path, 'w'), indent=1)
print(name, 'size', (w, h), 'offset', (ox, oy), 'floor row', floor_row, '=', meta['floor'][name.replace('scene-', '')])
