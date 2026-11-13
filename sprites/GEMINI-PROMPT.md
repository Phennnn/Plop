# Prompt for Gemini: Plop sprite sheet v2

Paste everything in the box into Gemini (an image model: "Nano Banana" / Imagen). Attach `gemini-sheet-v1.jpg` as the style reference.
Then put the result in this folder and run:

```
python tools/slice-sprites.py sprites/gemini-sheet-v2.png 10
```

(`10` = the size of one pixel in the image. If you get a 1920×1280 image back, it's 10.)

```
Pixel-art sprite sheet for a cute mobile game mascot named Plop: a chubby, friendly
poop character with a three-tier swirl body, a pointed tip, big simple eyes, a small
mouth and two short stubby legs. Use the attached image as the style reference
(same character, same proportions, same brown colours).

FORMAT (follow exactly):
- One image, 1920 x 1280 pixels: a grid of 6 columns x 4 rows. Each cell is 320 x 320.
- True pixel art: draw each frame at 32 x 32 pixels, then scale it up 10x with
  nearest-neighbour. Every "pixel" is a crisp 10 x 10 square. No blur, no anti-aliasing,
  no gradients, no soft shading, no glow, no noise.
- Background: one flat solid colour, pure magenta #FF00FF, in every cell. No floor,
  no shadows, no grid lines, no borders between cells.
- Plop is the same size in every frame, centred in his cell, facing the viewer, with his
  feet on the same row (3 pixels above the bottom of the cell). He has both legs in every
  frame, except where a frame says otherwise.
- Palette, use only these colours: outline #2B1A10, body #7A4A21, light #A9713A,
  dark #5A3415, eye white #FFF8EC, pupils #2B1A10, mouth/tongue #E98A7A,
  tears/sweat #6FB7D9, sick green #9AAA5C. 1-pixel dark outline around everything.
- No text, letters or numbers anywhere. No Zzz, no motion lines, no toilets, no props
  (the game draws those itself).

FRAMES, left to right, top to bottom:
Row 1: 1 idle (eyes open, gentle smile) | 2 blink (eyes closed lines, same smile) |
       3 looking left (pupils at the left of the eyes) | 4 looking right |
       5 happy (eyes closed upward arcs, big smile) | 6 laughing (mouth open, eyes squeezed)
Row 2: 7 walk step A (left foot forward) | 8 walk step B (right foot forward) |
       9 jump (body stretched taller, legs tucked) | 10 land (body squashed wide and short) |
       11 eating, mouth wide open | 12 eating, mouth closed and cheeks puffed
Row 3: 13 sleeping (eyes closed, small "o" mouth, slightly slumped) | 14 grumpy (angry
       brows, frown) | 15 crying (tears streaming) | 16 shocked (huge round eyes, open mouth) |
       17 dizzy (spiral eyes, wobbly mouth) | 18 cheering (both stubby arms raised)
Row 4: 19 straining / backed up (eyes squeezed shut, gritted teeth, a few dry cracks on the
       body) | 20 queasy (sick-green cheeks, sweat drop, wavy mouth) | 21 sick (droopy eyes,
       thermometer in mouth, faint green tint) | 22 glowing and thriving (sparkle in each
       eye, rosy cheeks, small shine marks) | 23 dancing (leaning left, one leg up) |
       24 dancing (leaning right, other leg up)
```

## Why each rule is there (from checking v1)

| v1 problem | Rule that fixes it |
|---|---|
| Fake pixel art: 25×25 drawn at 10× and blurred by JPEG | "draw at 32×32, scale 10× nearest-neighbour" |
| Row 2 has no legs, so Plop "sits down" whenever his face changes | "same size, feet on the same row, legs in every frame" |
| Zzz, sweat, motion lines, toilets and the text "PlOP!" are baked into frames | "no text, no Zzz, no motion lines, no props" |
| Beige background is close to Plop's own colours | "flat magenta #FF00FF" |
| About 20 slightly different browns | the fixed palette |
| No walking, eating or dancing frames; 5 near-identical idles | the frame list |

**v2 result:** it followed the layout, magenta background, legs and no text, but drew each pixel 6.72 image pixels wide (not 10) and drew both 'look' frames facing right. Always measure the pixel size before slicing; the slicer accepts fractional sizes.

Image models don't follow layouts perfectly. Ask for one row at a time if a full sheet comes out messy, and expect to regenerate a few frames.
