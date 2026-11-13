# Prompt for Gemini: room decor (for "decorate Plop's room with points")

Attach **`gemini-sheet-v2.jpg`** (the Plop sheet) and **`scene-room-src.jpg`** (his room) as style and scale references, then paste the box.
Download the result as a **PNG** if Gemini offers it. Save it as `sprites/gemini-decor-v1.png` and send it to me.

```
Pixel-art sprite sheet of furniture and decorations for a cute mobile game.
The first attached image shows the main character, Plop (a chubby, friendly poop
mascot). The second shows his room. Match their style exactly: same pixel size, same
chunky 1-pixel dark outline, same soft shading, same warm palette.

FORMAT (follow exactly):
- One image, 1920 x 1280 pixels: a grid of 6 columns x 4 rows, each cell 320 x 320.
- True pixel art: crisp square pixels, scaled up with nearest-neighbour. No blur, no
  anti-aliasing, no gradients, no glow, no noise.
- Background: one flat solid colour, pure magenta #FF00FF, in every cell. No floor,
  no wall, no shadows on the background, no grid lines, no borders.
- Each object is alone in its cell, centred, and fits inside the cell with a margin.
- Floor objects stand on the same baseline: 10 pixels above the bottom of their cell.
  Wall objects float in the middle of their cell.
- Front view, slightly from above, the same angle as the room.
- Palette: outline #2B1A10, cream #FFF8EC, shade #D9CDBB, wood #7A4A21,
  wood light #A9713A, gold #E0A32E, teal #2E7D72, red #D9553B, pink #E5576B,
  blue #6FB7D9, plant green #5E8C31, orange #E07B24, plus the browns of the room.
- No text, letters or numbers anywhere. No Plop in any cell.

SIZES (relative to Plop in the reference):
- Rugs: 2.5x Plop's width, flat on the floor.
- Bed and sofa: 2x Plop's width. Armchair and beanbag: 1.2x.
- Floor lamp and bookshelf: 1.6x Plop's height. Plants: 0.8 to 1.2x.
- Posters and frames: about Plop's height.

CELLS, left to right, top to bottom:
Row 1, RUGS AND SEATS: 1 round teal rug | 2 striped cream-and-red rug |
  3 fluffy pink rug | 4 cosy armchair | 5 squishy beanbag | 6 small sofa
Row 2, LIGHTS AND WALL: 7 floor lamp with a cream shade | 8 lava lamp |
  9 framed toilet-roll painting | 10 poster of a smiling broccoli |
  11 round wall clock | 12 string of warm fairy lights (wide, wall)
Row 3, BIG FURNITURE: 13 single bed with a teal blanket | 14 wooden bookshelf with
  books | 15 retro TV on a stand | 16 fish tank on a cabinet | 17 trophy shelf with
  3 empty spots | 18 record player on a small table
Row 4, PLANTS AND SEASONAL: 19 potted monstera | 20 small cactus | 21 hanging plant
  (wall) | 22 carved jack-o'-lantern | 23 friendly ghost lantern |
  24 snowy mini Christmas tree
```

## What I'll do with it
- Slice it with `tools/slice-sprites.py` (6 columns, like the props sheet).
- Add a **DECOR** tab to the Closet: each item costs points (rugs about 80, beds and sofas 250 to 400). It's the endless points sink from the QA review.
- Draw the items in his room on top of the picture room, in fixed spots (rug on the floor, lamp in the corner, poster on the wall).
