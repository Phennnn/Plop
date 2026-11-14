# Prompt for Gemini: Plop animation sheet v3 (24 new poses)

Attach **two** images as references: `plop-sheet-preview.png` (his 24 current frames) and `plop-reference.png`.
Save the result here as `gemini-anim-v3.png` (PNG, not JPG), then tell Claude "sheet is in".

```
Pixel-art sprite sheet of NEW poses for an existing mobile game mascot named Plop:
a chubby, friendly poop character with a three-tier swirl body, a pointed tip, big
simple eyes, a small mouth, two short stubby legs and two tiny stubby arms.

The attached images show Plop exactly as he already exists in the game. Copy him
EXACTLY: same body shape, same three tiers, same size, same eye style, same browns,
same 1-pixel dark outline. Do not redesign him. Only the pose and face change.

FORMAT (follow exactly):
- One image, 1920 x 1280 pixels: a grid of 6 columns x 4 rows. Each cell is 320 x 320.
- True pixel art: draw each frame at 32 x 32 pixels, then scale it up 10x with
  nearest-neighbour. Every "pixel" is a crisp square. No blur, no anti-aliasing,
  no gradients, no soft shading, no glow, no noise.
- Background: one flat solid colour, pure magenta #FF00FF, in every cell. No floor,
  no shadows, no grid lines, no borders between cells.
- Plop is the same size in every frame and centred in his cell, with his feet (or his
  bottom, when sitting or lying) on the same row, 3 pixels above the bottom of the cell.
- Palette, use only these colours: outline #2B1A10, body #7A4A21, light #A9713A,
  dark #5A3415, eye white #FFF8EC, pupils #2B1A10, mouth/tongue #E98A7A,
  blush/hearts #E5576B, tears/drool #6FB7D9.
- No text, letters or numbers. No Zzz, no motion lines, no sparkles, no props, no
  furniture, no food (the game draws those itself). Just Plop.

FRAMES, left to right, top to bottom:
Row 1 (hello): 1 waving, right arm raised high, hand tilted left, big smile |
       2 waving, same arm raised, hand tilted right | 3 pointing to the right with one
       arm stretched out sideways, looking right, smiling | 4 pointing straight up with
       one arm, looking up | 5 thumbs up with one arm, one eye winking |
       6 both arms held wide open for a hug, eyes closed happy arcs
Row 2 (feelings): 7 in love: both eyes are pink hearts, open smile | 8 shy: looking
       down to one side, pink blush on both cheeks, tiny smile, arms behind his back |
       9 thinking: eyes looking up, one arm touching his chin, small flat mouth |
       10 proud: eyes closed, smug smile, both arms on his hips | 11 scared: huge eyes,
       tiny pupils, wobbly mouth, both arms up by his mouth | 12 cheeky: one eye
       winking, tongue sticking out
Row 3 (positions): 13 sitting down, facing the viewer, both legs sticking out forward,
       arms resting at his sides, calm smile | 14 sitting the same way, eyes closed,
       content smile | 15 lying down asleep, body tipped over flat on its side, eyes
       closed, small "o" mouth | 16 seen from behind: back view, no face, standing |
       17 side view facing left, walking, front leg forward | 18 side view facing left,
       walking, back leg forward
Row 4 (actions): 19 hungry: both arms on his tummy, pleading eyes, a single blue drool
       drop at the mouth | 20 clapping, arms apart, happy closed eyes | 21 clapping, arms
       together in front, happy closed eyes | 22 flexing both arms up like a strongman,
       determined grin | 23 about to sneeze: head tilted back, eyes squeezed shut, mouth
       wide open | 24 cold: hugging himself with both arms, wavy mouth, eyes squeezed
```

## If the full sheet comes out messy

Ask for **one row at a time**: keep everything above the frame list, change the format line to
"One image, 1920 x 320 pixels: 6 cells in a single row", and paste only that row. Save as
`gemini-anim-v3-row1.png` … `row4.png`.

## What each frame turns into in the app

| Frames | Animation | Where it shows |
|---|---|---|
| 1–2 | Wave hello / goodbye | Greeting when you open the app, "you came back!!" |
| 3–4 | Pointing | He points at LOG IT when you haven't logged, at the chest when it's ready, in the tour |
| 5, 20–21 | Thumbs up, clapping | Reward screen, quests done, badge earned |
| 6–8 | Hug, heart eyes, shy | Boops, favourite snacks, compliments, Plop-iversary |
| 9 | Thinking | Stats screen, Dr. Ploopy "hmm...", picking a type on the log screen |
| 10, 22 | Proud, flex | Streak milestones, after moving 30 minutes |
| 11, 24 | Scared, cold | Halloween, thrown at a wall, December |
| 12 | Cheeky | Idle, after a fart |
| 13–14 | Sitting | On the sofa, armchair and beanbag (today he stands on them) |
| 15 | Lying asleep | Night sleep and naps on the bed |
| 16 | Back view | Watching the TV, the fish tank and the window |
| 17–18 | Side walk | Walking across the room (today he shuffles facing you) |
| 19 | Hungry | When his tummy is low |
| 23 | Sneeze wind-up | The idle sneeze gets a proper build-up |

## Checks before slicing (lessons from v1, v2 and the rainbow poses)

- **Is it still Plop?** Three tiers, same eye size, stubby legs. The rainbow poses failed here, so reject and regenerate off-model frames.
- **Measure the pixel size** (v2 came back at 6.72, not 10). The slicer takes fractions.
- **Feet on one row**, or he jumps when the frame changes.
- No baked-in text, sparkles or props.

## Side walk, try 2 (after `gemini-sidewalk-v1.jpg`)

Try 1 read well as a side view, but at Plop's pixel scale it came out about 40% taller than him with long legs
(see `sidewalk-compare.png`), so he would grow every time he walked. Attach `plop-sheet-preview.png` and use Gemini chat:

```
Pixel-art sprite sheet: 4 frames of the attached mascot, Plop, walking in SIDE VIEW.

Copy the attached character exactly: same squat body, same browns, same 1-pixel dark
outline, same chunky pixel size as the attached frames. He is as WIDE as he is TALL
(a squat blob, not a tall cone). His legs are tiny stubs: only 2 pixels tall, barely
visible under the body, exactly like the attached frames. Do not make him taller,
do not give him long legs, do not add arms.

FORMAT (follow exactly):
- One image, 1280 x 320 pixels: 4 cells in a single row, each 320 x 320.
- True pixel art: each frame drawn at 32 x 32 pixels, scaled up 10x nearest-neighbour.
  Crisp squares, no blur, no anti-aliasing, no gradients.
- Background: flat pure magenta #FF00FF. No floor, no shadows, no text.
- Same size in every frame, feet on the same row, 3 pixels above the bottom of the cell.

FRAMES, all facing RIGHT (one eye visible, small mouth on the right edge):
1 standing, both stub legs together | 2 walking, front stub leg forward |
3 standing, both stub legs together (same as 1, body 1 pixel lower) |
4 walking, back stub leg forward
```
