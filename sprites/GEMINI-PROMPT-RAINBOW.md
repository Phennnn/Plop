# Prompt for Gemini: Plop pukes a rainbow, then swims in it

Attach **`gemini-sheet-v2.jpg`** (the Plop sheet) as the style and scale reference, then paste the box.
Download the result as a **PNG** if Gemini offers it. Save it as `sprites/gemini-rainbow-v1.png` and send it to me.

The rainbow flood itself (the liquid that fills the room, tilts with your phone and flushes away) stays drawn in code, so it can fill any room shape. These sprites are for **Plop's poses** and the **rainbow stream** coming out of his mouth.

```
Pixel-art sprite sheet for a cute mobile game. The attached image shows the main
character, Plop (a chubby, friendly poop mascot). Match its style exactly: same pixel
size, same chunky 1-pixel dark outline, same soft shading, same proportions. Plop must
be the same size in every frame as in the attached sheet.

FORMAT (follow exactly):
- One image, 1920 x 1280 pixels: a grid of 6 columns x 4 rows, each cell 320 x 320.
- True pixel art: crisp square pixels, scaled up with nearest-neighbour. No blur, no
  anti-aliasing, no gradients, no glow, no noise, no drop shadows.
- Background: one flat solid colour, pure magenta #FF00FF, in every cell. No floor,
  no ground shadow, no grid lines, no borders.
- Plop faces RIGHT in every frame. Standing frames: his feet on the same baseline,
  10 pixels above the bottom of the cell. Plop stays in the same place and size
  across frames of the same row; only his pose changes.
- The rainbow has exactly 6 flat bands, top to bottom: red #E5576B, orange #E07B24,
  yellow #F2C84B, green #5E8C31, blue #6FB7D9, purple #8A6BBE, with a 1-pixel dark
  outline #2B1A10 along its outer edges. Never use magenta in the rainbow.
- No text, letters or numbers anywhere.

FRAMES, left to right, top to bottom:
Row 1, PUKING (a cute cartoon "rainbow sneeze", clearly coming OUT OF HIS MOUTH,
  nothing comes from his bottom):
  1 queasy: green-tinged cheeks puffed out, eyes squeezed shut, wobbly
  2 wind-up: leaning back, mouth tightly closed, cheeks bulging
  3 BLEH: leaning forward, mouth wide open, a short rainbow blob bursting out of
    his mouth to the right
  4 a full rainbow stream arcing out of his open mouth to the right edge of the cell
  5 the stream thinning to a trickle from his mouth, eyes spiral-dizzy
  6 relieved: wiping his mouth with one hand, sparkles around him, big happy smile
Row 2, SWIMMING (drawn complete, head to feet; the game covers his lower half
  with the rainbow liquid itself):
  7 doggy paddle A: arms forward, happy face, little splash pixels at his sides
  8 doggy paddle B: arms back
  9 doggy paddle C: arms to the sides
  10 floating on his back, eyes closed, blissful smile
  11 riding the rainbow like a surfer, arms out, excited open-mouth smile
  12 dizzy and sloshed, swirly eyes, tongue out, bobbing
Row 3, RAINBOW STREAM PIECES (no Plop; flat horizontal rainbow ribbon, 6 bands):
  13 the start of the stream: a round rainbow burst, as if just leaving a mouth
  14 stream segment A, a straight horizontal ribbon that tiles seamlessly left to
     right (its left and right ends match exactly, cut straight)
  15 stream segment B, same as 14 with the band edges wiggled one pixel (animation)
  16 stream segment C, wiggled the other way (animation)
  17 splash A: where the stream hits a pool, rainbow droplets flying up
  18 splash B: the next splash frame, droplets higher and more spread out
Row 4, EFFECTS (no Plop):
  19 rainbow bubbles: 5 round bubbles of different sizes, each one band colour, with
     a white 1-pixel shine
  20 sparkles: 6 small 4-point stars in white and yellow
  21 flush whirlpool A: a top-down rainbow swirl spiralling to a dark centre
  22 flush whirlpool B: the same swirl rotated a quarter turn
  23 a small rainbow puddle on the floor, flat oval
  24 Plop standing, soaking wet and proud: dripping rainbow drops, thumbs up
```

## What I'll do with it
- Slice it with `tools/slice-sprites.py` (6 columns), like the decor sheet.
- Row 1 replaces the placeholder puke, and row 2 replaces his bobbing while he swims.
- The stream pieces tile along the arc from his mouth, and the splash sits where it lands.
- The whirlpool frames play when you shake your phone (or tap FLUSH) to drain it.
