# Plop: QA and playtest review (28 Oct 2026, Version 17)

Tested as a new user and as a daily user on a 375×812 phone screen. Notes for our brainstorm.

## Bugs and friction (fix first)

| # | Finding | Evidence | Suggested fix |
|---|---|---|---|
| 1 | ✅ FIXED (v18): LOG IT now sits right under Plop (bottom at 382px). Was: **LOG IT is hidden below the tab bar** on a phone. The app's main action needs a scroll | Button top at 817px, tab bar top at 745px | Move LOG IT right under Plop, or make it a floating button |
| 2 | ✅ FIXED (v18): pixel text is 10px minimum (closet names 9px), snack labels use Pixelify 12px, and no text overflows on any screen. Was: **8–9px pixel-font text** is hard to read on a phone | "THRIVING", "WATER 0/8", "PLOP'S NEEDS TODAY" are 8–9px | Pixel font 10px minimum. Use Pixelify Sans for small labels |
| 3 | ✅ FIXED (v19): BACKUP saves everything as a JSON file (or copies it if files are blocked), RESTORE loads it back with UNDO and also accepts COPY DATA lists, and History shows when you last backed up. Was: **Your logs live only in this browser.** Clear browsing data or switch phones and they're gone. There's COPY DATA but no way to load it back | No import or backup | Add RESTORE (paste or file), or cloud save |
| 4 | ✅ FIXED (v19): the full 10-second show plays once, then every launch is a 2.6-second version from the splash moment, with no TAP TO START. Was: **The 10-second splash runs on every open,** plus TAP TO START on most phones | A daily habit app costs 2 taps and 10 s each time | Full splash on first launch only, about 2 s after |
| 5 | ✅ FIXED (v19): "Quick log: type N again" under LOG IT logs the same type and time spent in one tap, with UNDO. Was: **Logging takes about 5 steps** (LOG IT → type → time → note → SAVE → reward → back) | It's the action people repeat every day | "Same as last time" quick-log, or long-press LOG IT |
| 6 | ✅ FIXED (v19): a pencil on each History row opens EDIT LOG; saving changes it in place and points follow. Was: **You can't edit a log,** only delete it and add it again | History list | Tap a log to edit its type, time or note |
| 7 | ✅ FIXED (v19): a gear opens Sound settings with separate effects and music volume and 3 music tracks of 64 steps (PLOP THEME, LAZY SUNDAY, DISCO PLOP). Was: **Sound is only on or off,** and the music loop is 7 seconds long | | A volume slider and a longer track (or 2–3 tracks) |

## Balance (game feel)

- ✅ DONE (v21): room decor, about 4,300 points of furniture. **The closet runs out in about 4 weeks.** Everything costs 1,730 pts and a good day earns about 65, so after a month points have nothing to buy. Sample data (955 pts) buys half of it instantly.
- ✅ DONE (v20): healthy snacks are free and stop at full; chili and coffee cost 2 and can give him an ache. Was: **Snacks are free and unlimited.**
- ✅ DONE (v20): daily quests tie logging, needs and Play together with one chest. Was: **Hearts, tummy and needs are 3 separate meters** with no shared reward. It's not obvious what "doing well today" means.

## Ideas (for the brainstorm)

**Game loops**
1. ✅ v21. **Decorate Plop's room with points:** rugs, lamps, posters and beds as Gemini sprites. That's an endless points sink, and it reuses the new room.
2. ✅ v20. **Daily quests + a treasure chest:** "log before 10 am", "8 waters", "scrub the house". Finish 3 to open the chest.
3. ✅ v20 (shelf on Stats; a shelf in his room comes with decor). **Badges** (*Textbook Week*, *Hydration Hero*, *Fibre Fiend*, *Comeback Kid*), plus a badge shelf in his room.
4. ✅ v20. **Snacks cost a few points,** and healthy ones fill his tummy without an ache. Choices start to matter.
5. ✅ v20. **Mini-game:** *Fibre Catch*, where Plop catches falling fruit and veg and dodges junk food (pixel, 30 s rounds).

**Health value**
1. ✅ v20. **Symptom tags** on a log (bloating, pain, urgency, blood). Blood triggers Dr. Ploopy's urgent advice straight away.
2. ✅ v20. **Food and drink tags,** so Dr. Ploopy can spot patterns ("type 5–6 often follows your coffee days").
3. ✅ v20 (a printable page: Print → Save as PDF). **A doctor-visit PDF:** 30 days of logs, a type chart and flagged symptoms, to bring to an appointment.
4. ✅ v20 (trend; the calendar stays by count). **Week-over-week trend** on Stats (this week vs last week), and a type-coloured calendar.

**Seasonal and social**
1. ✅ v20. **A Halloween event (31 Oct is in 3 days):** a pumpkin hat, a ghost Plop skin, a spooky room overlay.
2. ⏳ After hosting (only matters for the home-screen icon and real notifications). **Discreet mode:** a neutral app name and icon, and reminders that don't say "poop" on the lock screen.
3. ⏳ After hosting. **Buddy streaks** with a friend (needs the public version and a shared database).
4. ⏳ After hosting. **Home-screen app (PWA)** once it's on Vercel: offline, an icon, and real reminders.

## What already works well
- The **Plop character and the reactions** (log faces, sick and thriving looks, the potty and bath scenes) are the app's identity and very charming.
- **Dr. Ploopy's sourced notes** and the AI chat give it real health value, not just a gimmick.
- **The tests** caught real bugs throughout (layout overlaps, a fidget during the wipe, toilet spacing).
