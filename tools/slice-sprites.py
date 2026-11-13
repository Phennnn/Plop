# Turns an AI-made "pixel art" sheet (big, blurry, on a flat background) into a real pixel sprite sheet.
#   python tools/slice-sprites.py <sheet.jpg|png> [block] [name] [columns]
# Finds each frame, snaps it back onto its pixel grid, removes the background, shares one palette,
# and writes sprites/<name>.png (1px = 1 pixel; name defaults to plop-sheet), a big preview, and sprites/<name>.json:
# frame boxes, plus gx/gy = where the frame sat inside its grid cell, so animation frames can be lined up exactly.
import sys, json, os
from PIL import Image

src = sys.argv[1]
B = float(sys.argv[2]) if len(sys.argv) > 2 else 10.0      # size of one "pixel" in the source (may be fractional)
NAME = sys.argv[3] if len(sys.argv) > 3 else 'plop-sheet'
COLS = int(sys.argv[4]) if len(sys.argv) > 4 else 6
im = Image.open(src).convert('RGB'); W, H = im.size; px = im.load()
bg = px[5, 5]
dist = lambda c, d=bg: sum(abs(a - b) for a, b in zip(c, d))

# 1. frames: bands of rows with ink, then runs of columns inside each band
rows = [any(dist(px[x, y]) > 60 for x in range(0, W, 2)) for y in range(H)]
bands, on = [], None
for y, r in enumerate(rows + [False]):
    if r and on is None: on = y
    if not r and on is not None:
        if y - on > 20: bands.append((on, y))
        on = None
frames = []
if len(sys.argv) > 4:                                        # columns given: cut by grid cell (neighbours may touch)
    for y0, y1 in bands:
        for c in range(COLS):
            cx0, cx1 = int(c * W / COLS), int((c + 1) * W / COLS)
            xs = [x for x in range(cx0, cx1) if any(dist(px[x, y]) > 60 for y in range(y0, y1, 2))]
            if len(xs) > 30: frames.append((xs[0], y0, xs[-1] + 1, y1))
for y0, y1 in (bands if len(sys.argv) <= 4 else []):
    cols = [any(dist(px[x, y]) > 60 for y in range(y0, y1, 2)) for x in range(W)]
    on = last = None
    for x, c in enumerate(cols + [False] * 40):
        if c:
            on = x if on is None else on; last = x
        elif on is not None and x - last > 28:
            if last - on > 30: frames.append((on, y0, last + 1, y1))
            on = None

# 2. snap each frame to its pixel grid (best offset), sample block centres, drop background.
#    B can be fractional: image models often scale by 6.72x rather than a whole number.
def grid(box):
    x0, y0, x1, y1 = box
    w, h = int((x1 - x0) / B) + 3, int((y1 - y0) / B) + 3
    at = lambda x, y: px[min(W - 1, max(0, int(x))), min(H - 1, max(0, int(y)))]
    centre = lambda ox, oy, i, j: (x0 - B + ox + (i + 0.5) * B, y0 - B + oy + (j + 0.5) * B)
    best, steps = None, [k * 0.5 for k in range(int(B * 2))]
    for ox in steps:                                    # aligned grid = flat colour inside each block
        for oy in steps:
            err = 0
            for j in range(0, h, 3):
                for i in range(0, w, 3):
                    cx, cy = centre(ox, oy, i, j)
                    err += dist(at(cx - B * 0.3, cy - B * 0.3), at(cx + B * 0.3, cy + B * 0.3))
            if best is None or err < best[0]: best = (err, ox, oy)
    _, ox, oy = best
    r = max(1, int(B * 0.22))
    out = []
    for j in range(h):
        row = []
        for i in range(w):
            cx, cy = centre(ox, oy, i, j)
            ss = [at(cx + u, cy + v) for u in range(-r, r + 1) for v in range(-r, r + 1)]
            c = tuple(sorted(q[k] for q in ss)[len(ss) // 2] for k in range(3))   # per-channel median: ignores JPEG fringes
            row.append(None if dist(c) < 90 else c)
        out.append(row)
    # despeckle: a lone pixel with no neighbours is a JPEG fringe, not art
    lone = lambda j, i: not any(0 <= j + v < len(out) and 0 <= i + u < len(out[0]) and out[j + v][i + u] for u, v in ((1, 0), (-1, 0), (0, 1), (0, -1)))
    out = [[None if c and lone(j, i) else c for i, c in enumerate(row)] for j, row in enumerate(out)]
    # trim empty edges (remembering where the art starts in the source image)
    top = 0
    while out and all(c is None for c in out[0]): out.pop(0); top += 1
    while out and all(c is None for c in out[-1]): out.pop()
    l = min(next(i for i, c in enumerate(r) if c) for r in out if any(r))
    r_ = max(len(r) - next(i for i, c in enumerate(reversed(r)) if c) for r in out if any(r))
    return [r[l:r_] for r in out], x0 - B + ox + l * B, y0 - B + oy + top * B

snapped = [grid(f) for f in frames]
sprites = [g[0] for g in snapped]
cellW, cellH = W / COLS, H / len(bands)
band_of = lambda f: next(i for i, (y0, y1) in enumerate(bands) if y0 == f[1])

# 3. one shared palette for every frame
cells = [c for s in sprites for r in s for c in r if c]
strip = Image.new('RGB', (len(cells), 1)); strip.putdata(cells)
pal = strip.quantize(colors=20, method=Image.Quantize.MEDIANCUT)
palette = pal.getpalette()[:20 * 3]
P = [tuple(palette[i:i + 3]) for i in range(0, len(palette), 3)]
# rare accents that median cut merges into the browns: eye white, tears/sweat, tongue/blush, sick greens, thermometer red, sparkle gold
P += [(0xFF, 0xF8, 0xEC), (0x6F, 0xB7, 0xD9), (0xE9, 0x8A, 0x7A), (0x9A, 0xAA, 0x5C), (0x6E, 0x7F, 0x3A), (0x8A, 0x7D, 0x3A), (0xD9, 0x55, 0x3B), (0xF2, 0xC8, 0x8B),
      (0xA9, 0x71, 0x3A), (0x96, 0x60, 0x30),   # ...and Plop's own highlight browns, so they don't snap to the sick olive
      (0xFF, 0xFF, 0xFF), (0xD9, 0xCD, 0xBB), (0xC9, 0xD6, 0xDE), (0x8F, 0xA3, 0xAD), (0x9C, 0xCF, 0xE0), (0x2E, 0x7D, 0x72),   # props: foam, porcelain shade, chrome, light water, towel teal
      (0xF2, 0xC8, 0x4B), (0xE0, 0x7B, 0x2E), (0x5E, 0x8C, 0x31), (0x7A, 0x4A, 0x21), (0xE0, 0xA3, 0x2E)]                          # duck, beak, plant, wood, gold
snap = lambda c: min(P, key=lambda p: sum((a - b) ** 2 for a, b in zip(c, p)))

# 4. pack into equal cells, feet on the cell floor, centred
CW = max(len(s[0]) for s in sprites) + 2; CH = max(len(s) for s in sprites) + 2
sheet = Image.new('RGBA', (CW * len(sprites), CH), (0, 0, 0, 0))
meta = []
for k, s in enumerate(sprites):
    h, w = len(s), len(s[0]); ox = k * CW + (CW - w) // 2; oy = CH - h
    top = next(j for j, r in enumerate(s) if any(r))
    xs = [i for i, c in enumerate(s[top]) if c]
    for j, r in enumerate(s):
        for i, c in enumerate(r):
            if c: sheet.putpixel((ox + i, oy + j), snap(c) + (255,))
    _, sx, sy = snapped[k]; col = int((sx + w * B / 2) // cellW); row = band_of(frames[k])
    meta.append({'i': k, 'x': ox, 'y': oy, 'w': w, 'h': h, 'headX': ox + (xs[0] + xs[-1]) / 2 - k * CW, 'headY': oy + top,
                 'gx': round((sx - col * cellW) / B), 'gy': round((sy - row * cellH) / B)})

os.makedirs('sprites', exist_ok=True)
sheet.save('sprites/%s.png' % NAME)
sheet.resize((sheet.width * 8, sheet.height * 8), Image.NEAREST).save('sprites/%s-preview.png' % NAME)
json.dump({'cell': [CW, CH], 'grid': [round(cellW / B), round(cellH / B)], 'frames': meta, 'palette': ['#%02X%02X%02X' % p for p in P]}, open('sprites/%s.json' % NAME, 'w'), indent=1)
print(len(sprites), 'frames, cell', CW, 'x', CH, '| palette', len(P), '| sheet', sheet.size)
