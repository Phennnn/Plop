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
