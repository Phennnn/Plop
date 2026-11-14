# Plop: poop tracker

(Called *Regular* until October 2026. Saved data still uses the `regular-v1` key, so nothing was lost in the rename.)

- **The app:** https://claude.ai/artifact/Pca5WksxXoDYXYVgxp7jDT (private, works on your phone)
- **Mockups** (hover a screen, then Play): https://claude.ai/artifact/LGWonEuKt6yc2b8vwD6ksu

| File | What it is | How to open it |
|---|---|---|
| `index.html` | **The real app.** Logging, points, closet, stats, history. Saves in your browser. | Double-click it |
| `poop-log.html` | The first, plain version of the tracker | Double-click it |
| `regular-wireframes.svg` | Grey wireframes of 6 screens | Drag into Figma |
| `mockups-source/` | Source of every canvas screen, including Plop (`Buddy.dc.html`) and the closet | Only runs inside the canvas link above |
| `tests/` | Checks for Plop's animation code and the closet's points math | See below |

## Run the tests

From this folder:

```
node tests/app-check.js
node tests/plop-check.js
node tests/closet-check.js mockups-source/Closet.dc.html
node tests/buddy-check.js mockups-source/Buddy.dc.html
```

Both print `OK` when everything works.

## Dr. Ploopy

Pops up on Today when the log shows a pattern. Every tip links to its source (NHS, NIH/NIDDK, published studies). He is general information, not a diagnosis.

| Pattern | What he says |
|---|---|
| 2 of the last 3 logs are type 1–2 | Tips for hard stools |
| 2 of the last 3 are type 6–7, or 3 loose in 24 hours | Tips for loose stools |
| Fewer than 3 this week, after logging last week | "3 a day to 3 a week is normal" plus tips |
| Loose (type 6–7) on 3 days in a row | See a doctor (NIDDK: diarrhoea past 2 days) |
| 3 weeks mostly outside types 3–4 | See a doctor (NHS: a change lasting 3 weeks) |

"Got it" hides him for a day. A new or worse pattern brings him back.

While a pattern is showing, Plop looks it: cracked and straining (hard or rare), melty and queasy with a puddle (loose), and olive with a thermometer when it's doctor-level.

## Plop's health

Today shows 1–5 hearts from your last 7 days: the more of your logs are type 3–4, the more hearts. Dr. Ploopy's patterns cap them (a tip caps at 2, doctor-level is 1). Tap the hearts to see all 5 states: THRIVING (sparkles, needs 4+ logs this week), HEALTHY, BACKED UP, QUEASY, SICK.

The whole app follows his state: sparkles in the background when he's thriving; stains, a buzzing fly and a wilted plant when he's backed up or queasy; cracks, cobwebs and three flies when he's sick. Only decoration changes, so text and buttons stay readable.

## Splash

A 10-second boot screen plays every time the app opens: looking down into the toilet, the water swirls, Plop rides the whirlpool up and splashes out. Tap anywhere to skip.

## Play

His bathroom is drawn from `sprites/props-sheet.png`, sliced from the Gemini sheet `sprites/gemini-props-v1.jpg` by `python tools/slice-sprites.py sprites/gemini-props-v1.jpg 6.72 props-sheet 6` (6 = grid columns, so frames that touch are still cut apart; each frame keeps its place in its grid cell so the animations line up).

- **Scenes**: on the big Play screen, POTTY and BATH wipe into their own room (`sprites/scene-potty.png`, `sprites/scene-bath.png`, from Gemini, snapped to their 10px pixel grid by `python tools/snap-scene.py <image> 10 scene-potty`), then wipe back. The script also records where each scene's floor starts (`sprites/scenes.json`) so it lines up with Plop's floor. If a trip is interrupted (he gets picked up, or the lights go off), he goes straight home.
- **POTTY** (or tap his toilet): he walks over, then sits and reads the paper, strains, and looks relieved. Then the flush swirl plays, and he walks home. The sit is longer when he's backed up.
- **BATH**: a shower (foam and bubbles) or a tub with the rubber duck, then wrapped in a towel.
- **Decor**: his main room has no bathroom furniture any more, since the toilet, bath and shower live in their own rooms. In the potty room the toilet sparkles when he's thriving and the roll is empty when he's backed up. His main room is `sprites/scene-room.png` (Gemini art, snapped at 8.35px by `tools/snap-scene.py`). It's the room box's CSS background (`cover`, anchored to the bottom), so the browser scales it crisply on every screen shape, and the canvas draws Plop, his rug, party bunting and unwell grime on top. The prompt is in `sprites/GEMINI-PROMPT-ROOM.md`.
- **Tummy** (Play): each snack fills it (broccoli/apple +15, water +6, chili +25, coffee +15), and it empties by 1 point every 6 seconds. Healthy snacks are free and stop at full, so they never cause an ache. Chili and coffee cost 2 points each and can overfill him: over 100 he gets a 15-second tummy ache (queasy face, grumbles, no more food until it passes).
- **Fibre Catch** (Play): a 30-second mini-game. Catch broccoli, apples and water (+1), dodge chili and coffee (-2); drops speed up as the clock runs down. Each day's best score becomes points, up to 20. The clock runs on game time, so a slow phone or a hidden tab doesn't lose the round.

## Plop's look

Plop is drawn from `sprites/plop-sheet.png` (24 frames), sliced from the Gemini sheet `sprites/gemini-sheet-v2.jpg` by `tools/slice-sprites.py sprites/gemini-sheet-v2.jpg 6.72` (Gemini drew each pixel 6.72 image pixels wide, not the 10 it was asked for). Plop's canvases run at 2-3x pixel density, so the 42px-wide frames keep their detail while the room looks unchanged. Looking left is the look-right frame mirrored. The engine picks a frame for each mood: sleeping, dizzy, crying, straining, cheering, and so on. Skins are recoloured, and hats and face items are drawn on top, anchored to his head tip and eyes. The old hand-drawn classic look has been removed. To make a better sheet, see `sprites/GEMINI-PROMPT.md`.

## Dr. Ploopy, AI edition

Inside Dr. Ploopy's sheet (Stats → ASK DR. PLOOPY, or tap him when he pops up) there's a chat: ask anything about poop, gut health, food and the digestive system. Questions go to Claude through the artifact's `sample` capability, on the viewer's own Claude account. The first question asks the viewer's permission. Each question sends his standing rules (stay on digestion, no diagnoses or medicine doses, flag red-flag symptoms early, no made-up studies or links, plain short answers), a one-line summary of the last 7 days (counts by Bristol type, health state, today's needs; never notes), and the last 10 messages. Opened as a plain file outside Claude, the chat hides itself and says where it works.

## Dr. Ploopy's tour

The first time someone taps START FRESH or TRY WITH SAMPLE DATA, Dr. Ploopy gives a 10-step tour. He flies to each part of the app (Plop, hearts, needs, LOG IT, the Bristol picker, Save, the Closet, Stats, Play, the tabs) while a spotlight dims everything else. Skip, Back and Next are on the card, and the arrow keys and Escape also work. Replay it from Stats: "Take Dr. Ploopy's tour again".

## Care, cleaning, growing up, weekly card, reminders

- **Plop's needs (Today):** tap + for each glass of water (goal 8, +1 each), portion of fruit, veg or wholegrains (goal 5, +2 each), and 30 minutes of moving (goal 1, +10). No points past the goal.
- **Cleaning:** when his house is grubby, "Scrub it clean?" opens a game. Rub the stains, tap the flies. +10, once a day, and the grime is gone until tomorrow (his health look stays).
- **Growing up:** a bonnet as Baby Plop, grown up at a 7-day best streak, a crown and sparkles as King Plop at 30. It uses your best streak ever, so he never shrinks back.
- **Weekly card (Stats):** a 1080x1920 story-sized picture of your week to save or share: his mood's colour sunburst, a big Plop, a mood ribbon and hearts, stat stickers, Dr. Ploopy's line (wrapped to fit), and the type mix.
- **Reminder:** once a day, if you're 2+ hours past your usual time and haven't logged, Plop asks. This only works while the app is open. Real phone notifications need the app hosted publicly.

## Room decor and rainbows

- **Decor** (Closet → DECOR): 21 items plus seasonal ones (jack-o-lantern and ghost lantern for Halloween, a mini tree in December), 66 to 450 points. One item per spot: rug (replaces his gold mat), seat (back left), side (back right), wall, and the front corner. Sliced from `sprites/gemini-decor-v1.jpg` by `python tools/slice-sprites.py sprites/gemini-decor-v1.jpg 5.87 decor-sheet 6`, with the leftover magenta shadows cleared. Small rooms (Today) use a half-size copy made when the sheet loads: each 2x2 block keeps its most common colour, so it stays crisp.
- **Rainbow puke** (any room): pick Plop up and keep shaking. The first shake makes him dizzy; shake again within 3 seconds and a 6-band rainbow arcs out of his mouth and floods his space. It stays until you drain it:
  - **Tilt your phone** and the flood stays level with the real world, deeper on the low side, and Plop swims downhill. Landscape works too.
  - **Shake your phone** (or tap **FLUSH**) to drain a quarter each time. Nobody flushes for a minute and it drains by itself.
  - Motion needs a phone that lets the page read it (iPhones ask once, on the first FLUSH tap). Everywhere else, FLUSH does the job.
  - **Poses** are his own v2 frames, so he stays on-model: queasy (19) → cheeks puffed (11) → BLEH (10/15) → dizzy (16) → sparkly (21), then paddling (22/23), floating (12), wheee when tilted hard (15), and holding his breath during a flush (11). Two Gemini retries for new poses kept redrawing him with arms, so they're unused (`gemini-rainbow-v1.jpg` rows 1–2, `GEMINI-PROMPT-RAINBOW-POSES.md`).
  - **Effects** are rows 3–4 of `sprites/gemini-rainbow-v1.jpg`, sliced at Plop's own pixel size (`python tools/slice-sprites.py sprites/gemini-rainbow-fx-src.png 6.71 rainbow-fx 6`): the ribbon is drawn one pixel column at a time along the arc from his mouth (burst first, then 3 wiggle frames), with a splash where it lands, rising bubbles, a whirlpool on each flush, sparkles, and a puddle that fades after it drains. The flood itself is drawn in code so it fits any room.

## Plop feels alive

- **Hello:** once per part of the day (morning, afternoon, evening, night), by name if you set one in ⚙️ (WHAT SHOULD PLOP CALL YOU?). Back after 3+ days away: "you came back!! i missed you". Every 30 days together: a Plop-iversary.
- **Chatter** on Today every so often, about your actual day: water so far, fibre, your streak, how he feels, bedtime.
- **"better than last time!!"** when a type 3–4 follows an off log.

## Decor placement and furniture activities

- Decor is drawn at Plop's own pixel size, over the room picture's painted furniture (positions are in the picture's 238×133 pixels): the wall piece over the framed picture, the seat back-left, the big piece back-right, the corner piece front-right over the lamp, and the rug under him.
- **Tap a piece:** seats = nap (Play) or a yawn, TV = giggles at his show, records = dance, fish tank = says hi to the fish, bookshelf = reads, lamp = lights off/on, lava lamp, trophy shelf, clock (tells the time), art, lights, plants, seasonal pieces and rugs all have their own lines.

## Snacks

11 snacks: broccoli, apple, water, kiwi, banana and oats are free (and can't cause a tummy ache); chili and coffee (2 pts), soda (2), cake and pizza (3) are treats with their own reactions (spicy, coffee trip, *BUUURP*, sugar-rush dance, cheesy giggle). Fibre Catch drops the healthy ones to catch and the treats to dodge.

## Tricks and naps

- **Tricks (Play):** 10 secrets, shown as ??? until found: tickle, dizzy, shake, bonk, rainbow, nap time, tummy ache, potty, bath, disco. Finding them all earns the TRICKSTER badge.
- **Naps:** with a seat in his room (armchair, beanbag, sofa or bed), Plop sometimes hops over and naps up on the cushion on the big Play screen.
- **Fibre Catch:** 5 good catches in a row doubles them, a golden broccoli is worth 5, and a treat or a dropped snack breaks the combo. The button shows today's best.

## Tags, quests, badges, trends

- **Tags** (Log it): BLOATING, PAIN, URGENCY, BLOOD, and what you had: COFFEE, SPICY, DAIRY, ALCOHOL. **Blood** opens Dr. Ploopy's urgent advice straight away and flags him at doctor level for 7 days (NHS: blood in your poo needs an urgent appointment).
- **Food patterns** (Stats): a food tag on 3+ logs in 30 days whose logs are outside type 3–4 at least 25 points more often than the rest. Shown as a pattern, not proof.
- **This week vs last week** (Stats): logs and % type 3–4 side by side.
- **Daily quests** (Today): "log today" plus 2 picked by the date (note, food tag, water, fibre, moving, a healthy snack). All 3 opens a chest: +30.
- **Badges** (Stats): First Flush, Textbook Week, Hydration Hero, Fibre Fiend, Comeback Kid, Clean Freak, Quest Hunter, Throne King. Worked out from your data, so they can't be lost.
- **Doctor report** (Stats): the last 30 days as a printable page (summary, type mix, tags, the app's flag, every entry). Open it, then Print → Save as PDF.
- **Halloween** (20 Oct–2 Nov): bats and pumpkins along the top, a pumpkin hat (66) and a see-through ghost skin (99) in the Closet. They only show in season, or once you own them.

## Your data

- **Backup** (History): saves the whole app (logs, closet, care, settings) as `plop-backup-<date>.json`. In claude.ai it asks to save the file; where saving is blocked it copies the backup instead. History shows how long ago you last backed up.
- **Restore** (History): pick a backup file. A full backup replaces everything (with UNDO). An older COPY DATA list adds its logs. Anything else is refused.
- **Edit**: the pencil on a History row opens EDIT LOG. **Quick log** under LOG IT repeats your last type and time spent in one tap.

## Sounds

All sounds are synthesised in the browser with Web Audio, so there are no sound files. The gear opens Sound settings: effects volume, music volume, and 3 music tracks. The speaker and note buttons on Today and Play turn effects and music on and off. Music is off by default, and browsers only start it after your first tap. The splash has its own soundtrack (flush, whirlpool, splash, title tune). If the browser hasn't allowed sound yet, the splash waits on TAP TO START.

## Points rules

- Your **first 3 logs a day** earn: +10 each, +15 for type 3 or 4, +5 for a note (more still save and count for Plop's health)
- Logs entered **more than 7 days** after they happened earn nothing (no backfilling a month for points)
- +50 for every 7-day streak. A **streak shield** (150 pts, hold up to 2) covers one missed day by itself
- **Mystery chest** (all 3 daily quests): 10–60 pts, and 1 time in 5 a free piece of furniture
- Needs: +1 a glass of water, +2 a portion of fibre, +10 for moving (up to each day's goal)
- +10 for scrubbing his house (once a day), +30 for a quest chest, up to +20 from Fibre Catch
- Spent on: closet items, and 2 a treat snack
- Deleting a log takes its points back; going below 0 gets a warning and shows in red

## Version 27: audit fixes and upgrades
- **Decor:** a corner piece no longer hides the big piece beside it (the side piece slides left).
- **Log screen:** SAVE ENTRY stays pinned at the bottom of the screen, so logging needs no scrolling.
- **Play is shorter on phones:** the tricks list folds away (tap TRICKS to open); help text matches today's snacks.
- **Plop sleeps at night** (23:00 to 05:00) on Today: lights off, "zzz...". One tap wakes him.
- **Plop notices gaps:** "it's been 3 days..." when the last log is 2+ days old; he says when he's hungry.
- **Coming back to an open tab** (after midnight) refreshes his health and Dr. Ploopy's check too.
- **Backups:** restored logs always get real numbers for time and type.

## Version 28: 22 new poses
- `sprites/gemini-anim-v3.jpg` sliced at 6.71 and appended to Plop's sheet as frames 24-47 (cells widened from 48 to 56 px so arms fit). Built by `tools/build-sheet-v3.py` (one-off: it expects the old 24-frame sheet).
- `strike(name, ms)` holds a pose (`POSES` in the engine): wave, point, up, thumbs, hug, love, shy, think, proud, scared, cheeky, back, hungry, clap, flex, cold.
- He sits on his seat, lies down with the lights off, turns his back to watch the TV and fish. Frames 40-41 (side walk) are unused: Gemini drew front views.

## Version 29: the tracker itself
- **Needs have a minus button** for mis-taps (the points go with it).
- **LAST: 14H AGO** chip on Today; red from 3 days.
- **Your own tags** on the log screen (up to 6, 12 characters, letters and numbers). Saved on logs as `c:name`, shown in History and the doctor report, and counted in Food patterns.
- **Stats:** logs per day and best streak tiles.
- **Backup reminder:** once a month, if there are 10+ real logs and no backup in 30 days.

## Version 30: he looks where he walks
- Frames 40-41 are now his walk steps with the eyes of the looking-right frame (`tools/build-walk-frames.py`); the engine mirrors them when he heads left. Before, he always glanced left.
- A true side view was dropped: three image-model tries (`sprites/gemini-sidewalk-v1.jpg`, `-v2.jpg`) drew a different character or the wrong size.
