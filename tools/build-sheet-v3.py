# Appends the 24 v3 poses (sprites/plop-anim.png) to Plop's sheet, in wider 56x50 cells, and re-embeds it in index.html.
import io, re, base64, json
from PIL import Image
import numpy as np
from scipy import ndimage
src = io.open('index.html', encoding='utf-8', newline='').read()
m = re.search(r"SHEET\.img\.src = 'data:image/png;base64,([^']+)'", src)
old = Image.open(io.BytesIO(base64.b64decode(m.group(1)))).convert('RGBA')
fm = re.search(r"(const SHEET = \{ CW: )48(, CH: 50, w: 42, h: 44, PAD: 14, z: 2, ok: false, img: null, f: )(\[\[.*?\]\])( \};)", src)
oldf = json.loads(fm.group(3)); assert len(oldf) == 24 and old.size == (1152, 50), (len(oldf), old.size)
new = Image.open('sprites/plop-anim.png').convert('RGBA'); NC, NH = 53, 46
CW, CH, N = 56, 50, 48
pal = np.array(sorted({p[:3] for p in old.getdata() if p[3] > 0}), dtype=int)
out = Image.new('RGBA', (CW * N, CH), (0, 0, 0, 0)); f = []
for i, (x, y, w, h, hx, hy) in enumerate(oldf):
    out.paste(old.crop((i * 48, 0, i * 48 + 48, 50)), (i * CW + 4, 0)); f.append([x + i * 8 + 4, y, w, h, hx + 4, hy])
for j in range(24):
    a = np.array(new.crop((j * NC, 0, j * NC + NC, NH)))
    lab, n = ndimage.label(a[:, :, 3] > 0, structure=np.ones((3, 3)))
    big = 1 + int(np.argmax(ndimage.sum(a[:, :, 3] > 0, lab, range(1, n + 1))))
    a[lab != big] = 0                                           # stray specks and neighbour bleed go
    ys, xs = np.where(a[:, :, 3] > 0); x0, x1, y0, y1 = xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    a = a[y0:y1, x0:x1]; h, w = a.shape[:2]
    rgb = a[:, :, :3].astype(int); d = np.abs(rgb[:, :, None, :] - pal[None, None, :, :]).sum(axis=3); near = d.argmin(axis=2)
    close = (d.min(axis=2) < 36) & (a[:, :, 3] > 0); a[:, :, :3][close] = pal[near[close]]   # same browns as his old frames
    top = np.where(a[0, :, 3] > 0)[0]; tip = (top.min() + top.max() + 1) / 2
    lying = h < 40
    px = int(round(CW / 2 - (w / 2 if lying else tip))); px = max(0, min(CW - w, px))
    i = 24 + j
    out.paste(Image.fromarray(a), (i * CW + px, CH - h))
    f.append([i * CW + px, CH - h, int(w), int(h), round(px + (w / 2 if lying else tip), 1), CH - h])
    print(i, 'w', w, 'h', h, 'x', px, 'head', f[-1][4])
out.save('sprites/plop-sheet.png'); out.resize((CW * N // 2 * 4 // 2, CH * 2), Image.NEAREST)
buf = io.BytesIO(); out.save(buf, 'PNG', optimize=True)
src = src.replace(m.group(0), "SHEET.img.src = 'data:image/png;base64," + base64.b64encode(buf.getvalue()).decode() + "'")
src = src.replace(fm.group(0), fm.group(1) + '56' + fm.group(2) + json.dumps(f, separators=(',', ':')) + fm.group(4))
io.open('index.html', 'w', encoding='utf-8', newline='').write(src)
json.dump({'cell': [CW, CH], 'frames': [dict(i=i, x=v[0], y=v[1], w=v[2], h=v[3], headX=v[4], headY=v[5]) for i, v in enumerate(f)]}, open('sprites/plop-sheet.json', 'w'))
# preview of the new half, 4x
pv = out.crop((24 * CW, 0, 48 * CW, CH)); big = Image.new('RGB', (12 * CW * 3, 2 * CH * 3), (244, 233, 216))
for i in range(24):
    t = pv.crop((i * CW, 0, i * CW + CW, CH)).resize((CW * 3, CH * 3), Image.NEAREST); big.paste(t, ((i % 12) * CW * 3, (i // 12) * CH * 3), t)
big.save('sprites/plop-anim-preview.png'); print('png bytes', len(buf.getvalue()))
