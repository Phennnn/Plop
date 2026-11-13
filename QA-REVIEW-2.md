# Plop: senior QA review #2 (10 Nov 2026, Version 24)

Tested on a 375×812 phone screen as a new user, a sample-data user and a player trying to break the economy. Automated sweeps covered every screen, plus code review of the points, sample, backup and rainbow paths.

## Status: all fixed in Version 25 ✅
Bugs 1–5 and polish 8–11 are fixed and verified in the browser; bug 6 is kept on purpose; bug 7 has the drag fallback (real tilt needs the public version). All 5 fun upgrades are built.

## Verified working ✅
- **0 JavaScript errors** across every screen, the tour, dialogs, the mini-game and the rainbow flood.
- **0 layout overflow** on any screen; all 10 tour steps land on a real target.
- **Notes are escaped**: an HTML/script note shows as plain text.
- Future times are refused (new logs and edits).
- The weekly card draws with 0 logs and with 36.
- The doctor report refuses to run with no logs, with a helpful message.
- Backups keep the whole state (decor, chests, games…).
- Decor preview resets when you leave the Closet. Escape closes Fibre Catch, and the settings dialog opens and closes.
- **Performance:** a flooded rainbow frame takes 1.7 ms (budget 16 ms); an idle frame takes under 0.1 ms.

## Bugs

| # | Severity | Bug | Steps to reproduce | Fix |
|---|---|---|---|---|
| 1 | 🔴 High | **Quick-log farming:** every tap earns +25, with no limit | Log once, then tap "Quick log" 20 times → **+500 pts in about 10 seconds** (the whole decor shop in a few minutes) | Only the **first 3 logs of a day** earn points. 3 a day is the top of the normal range, so honest users never notice |
| 2 | 🔴 High | **Clearing sample data leaves free furniture,** and a new user starts below zero | Try sample → buy a sofa and fish tank → feed coffee → CLEAR IT → sofa and fish tank still in his room, not owned; balance **−2** | CLEAR IT also resets the room decor, snack spending, chests and Fibre Catch scores from the sample session |
| 3 | 🟠 Medium | **Backdating earns unlimited points and streak bonuses** | Log 30 days into the past → about +750 log points plus +200 streak bonus | Old logs still save and count for health, but logs dated **more than 7 days back earn no points** |
| 4 | 🟠 Medium | **Negative points with no warning** | Buy items → delete logs → Today shows **"−1060 PTS"**, the Closet says "NEED 1140 MORE" for an 80-pt rug | Before a delete that drops points below 0, say so ("This takes you to −40 pts"). Show negatives in red with a one-line explanation |
| 5 | 🟠 Medium | **Closet help text is wrong** | Closet says "You never lose points" and lists only log points | Rewrite: list every way to earn (logs, needs, cleaning, chests, Fibre Catch) and spend (closet, decor, treats) |
| 6 | 🟡 Low | A quest chest stays claimed after the logs that completed it are deleted | Finish quests → open chest → delete today's logs → still +30 | Fine to keep (it was earned when opened). Noted only |
| 7 | 🟡 Low | Phone tilt doesn't reach the app inside claude.ai | Platform limit (sandboxed frame) | Drag-to-slosh fallback shipped in v24. Real tilt needs the public version |

## Polish and accessibility

| # | Issue | Evidence | Fix |
|---|---|---|---|
| 8 | Tap targets under 44 px | History days 39×40, month arrows 36×36, PTS chip 95×34, needs "+" 44×36 | Grow to 44 px minimum |
| 9 | 9 px text | Closet item names, the "2 PTS" snack label | 10 px minimum, like the rest of the app |
| 10 | The tour is out of date | Covers the 10 original steps; never mentions quests, decor, Fibre Catch or the rainbow | Add 3 steps (quests, Closet → Decor, Play tricks) |
| 11 | Today is long | About 9 sections; quests and needs are below the fold on a phone | Collapse needs and quests into one "TODAY" card with tabs, or move quests to the top once you've logged |

## Is it fun? (playtest)

**What's fun now** 🎉
- **Plop's personality** carries the app: his faces, voice lines, sick and thriving looks, the potty trip and the rainbow puke are genuinely delightful.
- **Rainbow puke is the best moment in the app.** It's secret, physical and silly.
- **Decor** finally gives points a purpose, and seeing his room fill up is satisfying.
- **Daily quests** give each day a small, clear goal.

**What drags** 😐
- **The rewards are predictable.** Every chest is always +30 and every log always +25, so after week 2 there's no surprise.
- **Play's best toys are hidden.** Throwing, tickling, shaking, rainbows and five-boop dizziness are explained in one grey paragraph nobody reads.
- **Furniture is just decoration.** Plop never sits on the sofa, watches the TV or looks at the fish.
- **Fibre Catch is one-and-done:** no best score shown, no combo, no reason to replay once the 20 points are in.
- **Streaks are fragile.** One missed day wipes a 25-day streak, and that's where habit apps lose people.

**Fun upgrades, ranked by joy per hour of work**
1. **Mystery chests:** random contents (10–60 pts, sometimes a rare decor item or hat). Variable rewards are the strongest habit hook there is.
2. **A tricks book (Play):** a list of secrets, shown as ??? until found (throw, tickle, dizzy, rainbow, lights off…). Finding them all earns a badge.
3. **Plop uses his furniture:** he naps on the bed or beanbag, sits on the sofa, flickers in front of the TV, and stares at the fish. This reuses his existing frames.
4. **Fibre Catch combos and best score:** catch 5 in a row for ×2; a golden broccoli worth 5; your best score shown on the button.
5. **Streak shield (150 pts):** protects one missed day. It's a points sink and a kindness at the same time.
