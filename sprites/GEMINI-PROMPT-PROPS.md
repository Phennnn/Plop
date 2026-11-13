# Prompt for Gemini: bathroom props + bath and potty animations

Attach **`gemini-sheet-v2.jpg`** (the Plop sheet) as the style and scale reference, then paste the box.
Download the result as a **PNG** if Gemini offers it (JPEG adds blurry fringes). Save it as `sprites/gemini-props-v1.png` and send it to me.

```
Pixel-art sprite sheet of bathroom props and animations for a cute mobile game.
The attached image shows the main character, Plop (a chubby, friendly poop
mascot). Match its style exactly: same pixel size, same chunky 1-pixel dark outline,
same soft shading. Wherever Plop appears below, he must be the same size and look as
in the attached sheet.

FORMAT (follow exactly):
- One image, 1920 x 1280 pixels: a grid of 6 columns x 4 rows, each cell 320 x 320.
- True pixel art: crisp square pixels, scaled up with nearest-neighbour. No blur, no
  anti-aliasing, no gradients, no glow, no noise.
- Background: one flat solid colour, pure magenta #FF00FF, in every cell. No floor,
  no wall, no shadows on the background, no grid lines, no borders.
- Floor objects (toilet, bathtub, Plop) stand on the same baseline: 10 pixels above
  the bottom of their cell. Wall objects (shower head, sink, shelf, roll) float in the
  middle of their cell.
- Animation frames in the same row must line up exactly: the object stays in the same
  place and size, and only the moving part changes.
- Palette, use only: outline #2B1A10, porcelain #FFF8EC, porcelain shade #D9CDBB,
  chrome #C9D6DE, chrome shade #8FA3AD, water #6FB7D9, light water #9CCFE0,
  foam #FFFFFF, wood #7A4A21, wood light #A9713A, gold #E0A32E, teal #2E7D72,
  duck yellow #F2C84B, duck beak #E07B2E, pink #E98A7A, plant green #5E8C31,
  plus Plop's own browns from the reference.
- No text, letters or numbers anywhere.

SIZES (relative to Plop in the reference):
- Toilet: 1.4x Plop's height, front view, tank at the back, seat and bowl in front.
- Bathtub: 2x Plop's width.
- Shower head on its pipe: about half Plop's width.

FRAMES, left to right, top to bottom:
Row 1, TOILET (identical toilet in every frame):
  1 toilet, lid up, empty | 2 lid down | 3 flushing A: handle pressed, small water
  swirl rising out of the bowl | 4 flushing B: big swirl splash | 5 flushing C: last
  droplets falling back | 6 sparkling clean toilet with two small shine marks
Row 2, POTTY TIME (same toilet, same place as row 1):
  7 Plop sitting on the toilet, relaxed, reading a tiny newspaper (squiggle lines,
  no text) | 8 Plop sitting, straining (eyes squeezed, red cheeks) | 9 Plop sitting,
  relieved (happy closed eyes) | 10 Plop hopping off the toilet | 11 toilet paper roll
  on its wall holder, full | 12 the same holder, empty cardboard tube
Row 3, SHOWER:
  13 shower head on a bent pipe, water off | 14 a column of falling water drops only
  (no shower head), frame A | 15 water drops, frame B (drops shifted down to loop) |
  16 water drops, frame C | 17 Plop showering: eyes closed, smiling, drops on him,
  foam on his head | 18 Plop showering B: more foam, two soap bubbles floating up
Row 4, BATH AND DECOR:
  19 Plop wrapped in a teal towel, happy | 20 white clawfoot bathtub full of foam,
  empty | 21 the same bathtub with Plop in the foam, a rubber duck beside him |
  22 rubber duck on its own | 23 small sink with a round mirror above it |
  24 wooden wall shelf with a soap bottle, a toothbrush cup and a tiny plant
```

## What I need from any Gemini sprite sheet

| Need | Why |
|---|---|
| Flat magenta `#FF00FF` background | My slicer cuts each frame out by that colour. Beige or white blends into porcelain |
| PNG, not JPEG | JPEG smears pixel edges, so I have to clean up fringes |
| A fixed grid (6×4 cells, one item per cell) | The slicer finds frames by the gaps between them |
| Frames in a row line up exactly | Otherwise the toilet jumps around while it flushes |
| Shared baseline for floor objects | Plop, the toilet and the tub stand on the same floor |
| Moving parts drawn separately (water drops apart from the shower head) | So I can loop the water while the head stays still |
| Same pixel size as the Plop sheet (attach it) | So props and Plop look like one game, not two |
| No text | Gemini misspells it ("PlOP!" in v1), and the app draws its own |

**v1 result:** the same 6.72 pixel size as the Plop sheet (good), a magenta background, toilet frames that line up, and floor items on one baseline. But it drew the shower head into every shower frame, put Plop in frame 13, and drew frame 15's water as a U shape, so the app makes its own water drops instead. Two pairs of frames touch across their cell borders, so slice with the column count.

Gemini won't get every rule right. Expect a different pixel size (v2 used 6.72, not 10) and a frame or two in the wrong order. I measure and fix those when slicing. If the sheet comes back messy, ask for one row at a time.
