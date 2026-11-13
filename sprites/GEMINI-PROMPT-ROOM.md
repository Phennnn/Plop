# Prompt for Gemini: Plop's main room

Plop's home room shows behind him on **every** screen (Today, Log, Closet, the reward screen, Play). Those screens are very different shapes: Log's window is a wide strip, and Play's is tall. So this background is **one wide picture whose important parts sit in the middle**, and the app crops it to fit each screen.

Attach `gemini-sheet-v2.jpg` and `scene-potty-src.jpg` as style references (so it matches Plop and the potty room). Download as **PNG** if you can. Save it as `sprites/scene-room-src.png` and send it to me.

```
Pixel-art background scene for a cute mobile game, matching the style of the attached
images exactly: same pixel size, same chunky dark outlines, same soft shading, same
warm palette.

SCENE: "Plop's cozy room", the little home of a friendly poop mascot, seen straight
from the front like a stage. NOT a bathroom: no toilet, no bathtub, no shower, no sink.
Warm cream wallpaper with a very subtle pattern of tiny swirls, a brown wooden lower
wall panel, a round window with a soft blue sky and one fluffy cloud, a small bookshelf
with a few colourful books and a tiny plant, a framed picture of a smiling poop, a
string of warm fairy lights along the top of the wall, a potted plant in one corner.
Calm, cozy, a little silly. Uncluttered.

RULES (follow exactly):
- One image, 2400 x 1500 pixels (wide, 16:10). True pixel art: crisp square pixels,
  scaled up with nearest-neighbour. No blur, no gradients, no glow, no noise.
- The floor starts at 66% of the image height and runs to the bottom: brown checker
  tiles, flat front view (no perspective lines).
- Keep the MIDDLE of the floor EMPTY (the middle 50% of the width, from 45% of the
  height down): no furniture, no rug, no objects there. The game places the character
  and his rug in that space.
- Put the most important decorations (window, picture, bookshelf) in the MIDDLE 50% of
  the width, above the floor, because the sides get cropped on phones. The far left and
  right edges can hold simple extras (a plant, a lamp) that are fine to lose.
- Nothing important in the top 12% of the image (it gets cropped on wide screens).
- No characters, no text, letters or numbers anywhere.
- Palette: outline #2B1A10, cream #F4E9D8, wall pattern #E4D3B9, wood #7A4A21,
  wood light #A9713A, wood dark #5A3415, floor #8E5A2B and #A9713A, sky #9CCFE0,
  gold #E0A32E, teal #2E7D72, pink #E98A7A, plant green #5E8C31, white #FFF8EC.
```

## Why these rules
| Rule | Why |
|---|---|
| Wide 16:10, important things in the middle | One picture has to work cropped tall (Play), wide (Today) and very wide (Log) |
| Floor at 66%, middle of the floor empty | Plop's floor line is at 66%. He and his rug stand in the middle |
| Nothing important in the top 12% | Very wide screens crop the top |
| No bathroom furniture | The toilet, bath and shower live in their own rooms now |
