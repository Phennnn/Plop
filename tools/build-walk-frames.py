# Builds Plop's "walking, looking where he goes" frames (40 and 41) from his own frames:
# the walk steps (6 and 7) with the eyes of the looking-right frame (2). The engine mirrors them for walking left.
# Image models kept drawing a different character for a true side view (sprites/gemini-sidewalk-v1/v2.jpg), so this stays on-model.
#   python tools/build-walk-frames.py        (rewrites sprites/plop-sheet.png and the sheet embedded in index.html)
import io, re, base64, json
from PIL import Image
import numpy as np

src = io.open('index.html', encoding='utf-8', newline='').read()
m = re.search(r"SHEET\.img\.src = 'data:image/png;base64,([^']+)'", src)
sheet = np.array(Image.open(io.BytesIO(base64.b64decode(m.group(1)))).convert('RGBA'))
fm = re.search(r"(const SHEET = \{ CW: 56, CH: 50, [^\[]*f: )(\[\[.*?\]\])( \};)", src)
f = json.loads(fm.group(2)); CW = 56
assert len(f) == 48 and sheet.shape[1] == CW * 48, (len(f), sheet.shape)
cell = lambda i: sheet[:, i * CW:(i + 1) * CW]

look = cell(2).astype(int)
eye = (look[..., 3] > 0) & ((look[..., :3].min(axis=2) > 200) | (look[..., :3].max(axis=2) < 70))   # eye whites and pupils
eye[:16] = False; eye[34:] = False                           # only the face rows: not the outline, not the feet
inner = np.zeros_like(eye); inner[1:-1, 8:-8] = eye[1:-1, 8:-8]                                    # and not the dark outline at the sides
ys, xs = np.where(inner); y0, y1, x0, x1 = ys.min() - 1, ys.max() + 2, xs.min() - 1, xs.max() + 2
print('eye box rows', y0, y1, 'cols', x0, x1)
for dst, step in ((40, 6), (41, 7)):
    c = cell(step).copy(); c[y0:y1, x0:x1] = cell(2)[y0:y1, x0:x1]
    sheet[:, dst * CW:(dst + 1) * CW] = c
    x, y, w, h, hx, hy = f[step]; f[dst] = [x + (dst - step) * CW, y, w, h, hx, hy]

out = Image.fromarray(sheet); out.save('sprites/plop-sheet.png')
buf = io.BytesIO(); out.save(buf, 'PNG', optimize=True)
src = src.replace(m.group(0), "SHEET.img.src = 'data:image/png;base64," + base64.b64encode(buf.getvalue()).decode() + "'")
src = src.replace(fm.group(0), fm.group(1) + json.dumps(f, separators=(',', ':')) + fm.group(3))
io.open('index.html', 'w', encoding='utf-8', newline='').write(src)
Z = 6; pv = Image.new('RGB', (5 * CW * Z, 50 * Z), (244, 233, 216))
for n, i in enumerate((6, 7, 2, 40, 41)):
    t = out.crop((i * CW, 0, (i + 1) * CW, 50)).resize((CW * Z, 50 * Z), Image.NEAREST); pv.paste(t, (n * CW * Z, 0), t)
pv.save('sprites/walk-frames-preview.png'); print('done')
