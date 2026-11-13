# Prompt for Gemini: separate potty and bath scenes

When Plop goes to the potty or has a bath, the Play room switches to its own scene. The app draws the toilet, the tub, the shower and Plop **on top of** these backgrounds, so the backgrounds must leave the middle of the floor **empty**.

Make **two images, one prompt each** (one scene per image follows the rules better). Attach both `gemini-sheet-v2.jpg` and `gemini-props-v1.jpg` as style references. Download as **PNG** if you can, and save them as `sprites/scene-potty.png` and `sprites/scene-bath.png`.

## Scene 1: potty

```
Pixel-art background scene for a cute mobile game, matching the style of the attached
sprite sheets exactly: same pixel size, same chunky dark outlines, same soft shading.

SCENE: a small, cozy toilet room seen straight from the front, like a stage.
Back wall with cream square tiles and a brown wooden lower panel, a small round window
with a soft blue sky, a framed picture, a little shelf with a candle and a plant, a
wooden door on the left side wall slightly open. Warm, calm, slightly funny mood.

RULES (follow exactly):
- One image, 1200 x 1600 pixels (portrait, 3:4). True pixel art: crisp square pixels,
  scaled up with nearest-neighbour. No blur, no gradients, no glow, no noise.
- The floor starts at 68% of the image height and runs to the bottom: brown checker
  tiles, flat front view.
- Leave the CENTRE of the floor and the wall just above it EMPTY (the middle 60% of the
  width, from 40% to 100% of the height): no toilet, no furniture, no rug there. The game
  places its own toilet and character in that space.
- No characters, no toilet, no text, letters or numbers anywhere.
- Palette: outline #2B1A10, cream #F4E9D8, tile line #E4D3B9, wood #7A4A21,
  wood light #A9713A, wood dark #5A3415, floor #8E5A2B and #A9713A, sky #9CCFE0,
  gold #E0A32E, plant green #5E8C31, white #FFF8EC.
```

## Scene 2: bath

```
Pixel-art background scene for a cute mobile game, matching the style of the attached
sprite sheets exactly: same pixel size, same chunky dark outlines, same soft shading.

SCENE: a bright bathroom bath corner seen straight from the front, like a stage.
Back wall with light-blue square tiles, a shower curtain with a playful pattern pulled
open to the left side, a towel rail with a teal towel on the right side wall, a small
frosted window high up with a little steam, a few soap bubbles floating near the ceiling.
Fresh, clean, happy mood.

RULES (follow exactly):
- One image, 1200 x 1600 pixels (portrait, 3:4). True pixel art: crisp square pixels,
  scaled up with nearest-neighbour. No blur, no gradients, no glow, no noise.
- The floor starts at 68% of the image height and runs to the bottom: white and light
  blue checker tiles, flat front view.
- Leave the CENTRE of the floor and the wall just above it EMPTY (the middle 60% of the
  width, from 40% to 100% of the height): no bathtub, no shower, no mat there. The game
  places its own bathtub, shower and character in that space.
- No characters, no bathtub, no shower head, no text, letters or numbers anywhere.
- Palette: outline #2B1A10, tile #CFE8F2, tile line #9CCFE0, white #FFF8EC, foam #FFFFFF,
  chrome #C9D6DE, chrome shade #8FA3AD, teal #2E7D72, curtain pink #E98A7A,
  gold #E0A32E, floor #FFF8EC and #CFE8F2.
```

## Why these rules
| Rule | Why |
|---|---|
| Middle of the floor left empty | The app's own toilet, tub, shower and Plop go there, and they animate |
| Floor starts at 68% | Matches where Plop's room floor begins, so he stands on it, not on the wall |
| Portrait 3:4 | The Play room is taller than wide on phones. The app crops the sides on wider screens |
| No characters or text | Gemini misspells text, and Plop is animated separately |
