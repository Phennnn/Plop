# Prompt for Gemini (retry): Plop's puke and swim poses, on-model

The first try (`gemini-rainbow-v1.jpg`) gave Plop arms, longer legs and a rounder body. Its **rows 3–4 (rainbow stream, splashes, bubbles, whirlpools, puddle) are kept**, so this retry asks only for Plop's poses, with **no rainbow on him**: the app attaches the stream sprites to his mouth itself.

1. Attach **`plop-reference.png`** FIRST (4 big frames of the real Plop), then `gemini-sheet-v2.jpg`.
2. Paste the box.
3. If any frame grows arms or hands, say in the same chat: *"Frame N has arms. Redraw it with NO arms, exactly the reference outline."*
4. Download as **PNG**, save as `sprites/gemini-rainbow-poses-v1.png`, and send it to me.

```
Pixel-art sprite sheet of ONE existing character. The first attached image shows him:
Plop, a poop mascot. Copy his design EXACTLY. Do not redesign him.

PLOP'S DESIGN (must be identical in every frame):
- A wide, flat-bottomed TRIANGLE body: three stacked rounded tiers, the tip pointing
  STRAIGHT UP (not curled to the side).
- NO ARMS. NO HANDS. NO FINGERS. Nothing sticks out of his sides, ever.
- Only two tiny, short, square stub legs under his flat bottom. No feet.
- Same width, height, outline, brown shading and highlights as the reference.
  His outline must be traceable onto the reference with no difference except the face.
- Only his FACE, his colour (where stated) and a slight squash or tilt may change.

FORMAT (follow exactly):
- One image, 1920 x 640 pixels: a grid of 6 columns x 2 rows, each cell 320 x 320.
- Same pixel size as the reference. Crisp square pixels, nearest-neighbour. No blur,
  no anti-aliasing, no gradients, no glow, no ground shadows.
- Background: flat pure magenta #FF00FF in every cell. No floor, no borders.
- Plop is centred in each cell, his flat bottom on the same baseline, 10 pixels above
  the bottom of the cell, and he faces the viewer like the reference.
- NO rainbow, water, liquid or splash on or around him in any frame. Just Plop.
- No text, letters or numbers anywhere.

FRAMES, left to right:
Row 1, PUKING (face changes only):
  1 queasy: body tinted olive green like the reference's green frame, eyes squeezed,
    wavy mouth, a blue sweat drop
  2 wind-up: brown, cheeks puffed out wide, eyes shut tight, lips pressed together,
    body squashed 10% shorter and wider
  3 BLEH: brown, body stretched 10% taller, mouth open as WIDE as possible (a big
    dark oval in the lower middle of his face), eyes shut
  4 BLEH 2: same as 3 but eyes wide open in surprise
  5 dizzy: spiral eyes like the reference's dizzy frame, wavy mouth, tongue out
  6 relieved: big closed-eye smile, rosy cheeks, 4 small sparkle stars around him
Row 2, SWIMMING (he is bobbing in liquid that the game draws; just draw Plop):
  7 happy paddling: tilted 10 degrees left, big open smile, eyes happy arcs
  8 happy paddling: tilted 10 degrees right, same face
  9 floating calm: upright, eyes closed, gentle smile, blush
  10 excited: stretched taller, wide open "wheee" mouth, eyes wide
  11 sloshed: tilted 15 degrees, spiral eyes, tongue out
  12 gasping: cheeks puffed full of air, eyes wide, like holding his breath
```

## What I'll do with it
- Slice it to Plop's pixel size, and check that each outline matches his real frames.
- Puke sequence: frames 1 → 2 → 3/4 (with the rainbow stream sprites from v1 attached at his mouth) → 5 → 6.
- Swimming: frames 7/8 alternate as he paddles, 9 while he floats still, 10 when you tilt the phone hard, 11 after a shake, and 12 just as he goes under during a flush.
