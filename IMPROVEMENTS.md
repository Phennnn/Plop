# Plop: what to improve (13 Nov 2026, after Version 28)

Ranked inside each group by value for the effort. Ticked items are done (groups 1 and 2 in Version 29).

## 1. Check first (Version 28 loose ends)
- [x] Look at the four poses that were wired but not seen live: sitting on the sofa, hungry on Play, clapping on the reward screen, Dr. Ploopy thinking.
- [x] README: add a Version 28 section (22 new poses, `strike(name, ms)`).
- [x] Side walk: built from his own frames in Version 30 (he looks where he walks). No sprites needed from Gemini.

## 2. The tracker itself
- [x] **Needs have no minus button.** A mis-tap on water or fibre can only be undone in the 4.5-second toast.
- [x] **No "last went" anywhere.** Time since the last log is the most useful number in a bowel tracker. Show it on Today.
- [x] **Logs per day is missing from Stats.** The app already works it out and never shows it.
- [x] **Custom tags.** Only 8 fixed tags; people will want their own foods (gluten, beans, a medicine).
- [x] ~~Doctor report on a phone~~: not needed. It already saves as a file, which works on phones.
- [x] **Backup reminder.** Logs live only in the browser. Nudge once a month if there is no recent backup.

## 3. Plop as the mascot
- [x] **Stats and History have no Plop.** A small Plop reacting to your week (thinking, proud, hungry) on both screens.
- [x] **Drawing attention to LOG IT and the chest.** Done differently: LOG IT pulses and Plop announces the chest. His sheet has no pointing-down pose, and both buttons sit below him.
- [x] **The speech bubble covers the wall picture.** Move the wall slot or shift the bubble.
- [x] **A sound per pose.** New poses are silent; a tiny cue each makes them read as character.
- [x] **Tricks list spoils the secrets.** Hints show for tricks not found yet. Show "???" only, with a hint after a few days.

## 4. Mobile and polish
- [x] **Closet is the longest screen** (about 1,680 px). Fold the streak-shield box or make the grid scroll inside its panel.
- [x] **First-open splash is 10 seconds.** Skippable, but long for a first impression. Cut to about 4.
- [x] **The tour is 11 steps.** Trim to 5 and let the rest be discovered.
- [x] **Font: "5" reads as "S"** in body text ("5–15 min"). Use the pixel font for numbers.
- [x] ~~Three decor pieces crowd a phone-width room~~ (left as is: moving Plop off-centre would unbalance every other room).
  Original note: **Three decor pieces crowd a phone-width room.** Plop stands in front of the side piece. Consider letting him stand left of centre when a side piece is placed.

## 5. Needs the public version (only on "yes, deploy")
- [ ] Home-screen icon and full screen (installable app).
- [ ] Real notifications for the daily nudge.
- [ ] Real phone tilt for the rainbow.
- [ ] Buddy streaks with your girlfriend (needs a small backend).
- [ ] Discreet mode: neutral icon and name on the home screen.

## 6. Code health
- [ ] `index.html` is about 550 KB in one file; half is embedded sprites. Fine for the artifact, split for the public version.
- [x] Two old test files (`buddy-check.js`, `closet-check.js`) are not part of the routine. Run or delete them.
- [x] The project is not in git. One `git init` gives undo for every future change.

## Found while testing
- [x] A toast can sit on top of the pinned SAVE ENTRY button for a few seconds. Move toasts above it on the log screen.
- [ ] The engine test failed once in 108 runs and never again; cause not found. Watch for it.

# Round 2 (15 Nov 2026): senior app/game dev review. Nothing here is built yet.

## A. Points feel too far away (measured)
Shop: 35 items, 5,760 pts in total, median 120, dearest 450. A casual day earns about 20-40, so a sofa is 8-15 days and the full shop 5-9 months.
- [ ] Same points for every honest log (25), whatever the type. Today a type 1 or 6 earns 10 and a type 4 earns 25: that pays for health, not for the habit.
- [ ] Welcome gift of 100 pts so the first purchase happens in the first session.
- [ ] Daily streak bonus (+2 per streak day, capped at +20) instead of +50 every 7th day.
- [ ] "Next unlock" bar on Today (it only shows on the reward screen).
- [ ] One discounted item a day (30% off) in the Closet.

## B. The tracker
- [ ] "Nothing today" check-in that keeps the streak. Today a day without a poop breaks it, which punishes constipation.
- [ ] Habit insights: how water, fibre and moving relate to the next day's type (the data is already saved).
- [ ] Sunday recap: the weekly card offered automatically, with Plop's verdict.
- [ ] Ask "what brings you here?" on first open and tune the quests to it.

## C. Plop and the game
- [ ] Plop's wish of the day: he asks for one specific thing (a snack, a game, a bath) for a small bonus.
- [ ] Bond level: a friendship meter that grows with care and unlocks new lines, poses and tricks.
- [ ] Room themes: wallpaper and floor colours as a new thing to buy.
- [ ] A second mini-game with a weekly best score.
- [ ] Photo mode: save a picture of his room to share.

## D. Simplify
- [ ] Today shows streak, points, stage, last, health, quests, needs: hide the streak shield and stage chip until they matter.
