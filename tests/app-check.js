// Checks the points, streak and stats logic in index.html.
// Run from the project folder:  node tests/app-check.js
const fs = require('fs'), path = require('path'), assert = require('assert');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const src = html.split('// ==LOGIC==')[1].split('// ==UI==')[0].split('\n').slice(1).join('\n');
const L = new Function(src + '; return { dkey, dayDiff, midnight, logPoints, streakBonus, earned, spent, balanceOf, currentStreak, counts, stats30, nextUnlock, sampleLogs, STARTER, doctorCheck, plopHealth, careEarned, bestStreak, stageOf, tummyAt, parseBackup, seasonOf, tagPatterns, weekTrend, questsFor, QUESTS, badges, chestEarned, gameEarned, TRICKS };')();

const at = (y, m, d, h = 8) => new Date(y, m - 1, d, h).getTime();
const log = (t, b = 4, n = '') => ({ t, b, n, d: 1 });

// points per log: 10 always, +15 for type 3-4, +5 for a note
assert.strictEqual(L.logPoints(log(0, 4)), 25);
assert.strictEqual(L.logPoints(log(0, 3, 'coffee')), 30);
assert.strictEqual(L.logPoints(log(0, 7, 'rough')), 15, 'a bad day still earns');
assert.strictEqual(L.logPoints(log(0, 1, '   ')), 10, 'whitespace is not a note');

// streak bonus: +50 per 7 consecutive days; two logs on one day count once; a gap resets
const week = (start, n) => Array.from({ length: n }, (_, i) => log(at(2026, 10, start + i)));
assert.strictEqual(L.streakBonus(week(1, 6)), 0);
assert.strictEqual(L.streakBonus(week(1, 7)), 50);
assert.strictEqual(L.streakBonus(week(1, 14)), 100);
assert.strictEqual(L.streakBonus(week(1, 7).concat(log(at(2026, 10, 3, 20)))), 50, 'same-day double log');
assert.strictEqual(L.streakBonus(week(1, 4).concat(week(6, 4))), 0, 'gap resets');
// across a daylight-saving change (US: 8 Mar 2026, EU: 29 Mar 2026), days are still consecutive
assert.strictEqual(L.streakBonus(Array.from({ length: 7 }, (_, i) => log(at(2026, 3, 5 + i)))), 50, 'US DST week');
assert.strictEqual(L.streakBonus(Array.from({ length: 7 }, (_, i) => log(at(2026, 3, 26 + i)))), 50, 'EU DST week');

// current streak survives until today is over
const now = at(2026, 10, 24, 12);
assert.strictEqual(L.currentStreak(week(18, 6), now), 6, 'logged through yesterday, nothing yet today');
assert.strictEqual(L.currentStreak(week(18, 7), now), 7, 'including today');
assert.strictEqual(L.currentStreak(week(15, 5), now), 0, 'broken two days ago');

// balance = earned - spent; deleting a log takes its points with it
const st = { logs: week(18, 7), owned: Object.assign({ 'hats:crown': 1 }, L.STARTER) };
assert.strictEqual(L.earned(st.logs), 7 * 25 + 50);
assert.strictEqual(L.balanceOf(st), 225 - 300, 'can go negative if logs are deleted after buying');

// counts and stats
const c = L.counts(week(18, 7), now);
assert.deepStrictEqual([c.today, c.week, c.month], [1, 7, 7]);
assert.strictEqual(c.perDay, 1);
const s = L.stats30([log(at(2026, 10, 20, 7), 4), log(at(2026, 10, 21, 9), 1), log(at(2026, 10, 22, 8), 3)], now);
assert.strictEqual(s.n, 3);
assert.strictEqual(Math.round(s.ideal * 100), 67);
assert.strictEqual(s.usual, 8 * 60, 'median hour');

// next unlock
assert.strictEqual(L.nextUnlock(L.STARTER, 50).item.name, 'DARK ROAST', 'cheapest item still out of reach (blush at 40 is already affordable)');
assert.strictEqual(L.nextUnlock(L.STARTER, 5000).afford, true);

// sample data is stable and gives the demo a live streak
const a = L.sampleLogs(now), b = L.sampleLogs(now);
assert.deepStrictEqual(a, b, 'deterministic');
assert(L.currentStreak(a, now) >= 9, 'demo has a streak');
assert(a.every((e) => e.t < L.midnight(now)), 'sample leaves today empty to log');

// Dr. Plop: when he pops up, and how worried he is
const doc = (logs) => L.doctorCheck(logs, now);
const ago = (days, h = 8, b = 4) => log(L.midnight(now, days) + h * 3600e3, b);
assert.strictEqual(doc([]).level, 'ok', 'no logs, no doctor');
assert.strictEqual(doc([ago(0), ago(1), ago(2), ago(3)]).level, 'ok', 'a good week');
assert.deepStrictEqual([doc([ago(0, 8, 1), ago(1, 8, 2), ago(2, 8, 4)]).level, doc([ago(0, 8, 1), ago(1, 8, 2), ago(2, 8, 4)]).kind], ['tip', 'hard'], '2 of last 3 hard');
assert.strictEqual(doc([ago(0, 8, 1), ago(1, 8, 4), ago(2, 8, 4)]).level, 'ok', 'one hard log is not a pattern');
assert.strictEqual(doc([log(now - 1e6, 7), log(now - 2e6, 6), log(now - 3e6, 7)]).kind, 'loose', '3 loose in 24h');
const looseRun = doc([ago(0, 8, 7), ago(1, 8, 6), ago(2, 8, 7)]);
assert.deepStrictEqual([looseRun.level, looseRun.days], ['doctor', 3], 'loose 3 days running: see a doctor (NIDDK: >2 days)');
assert.strictEqual(doc([ago(1, 8, 7), ago(2, 8, 6), ago(4, 8, 7)]).level, 'tip', 'loose but with a gap: tips, not doctor');
const threeWeeks = Array.from({ length: 12 }, (_, i) => ago(i * 1.7 | 0, 8, i % 4 === 0 ? 4 : 1));
const pw = doc(threeWeeks);
assert.deepStrictEqual([pw.level, pw.kind], ['doctor', 'hard'], '3 weeks mostly hard: see a doctor (NHS: change lasting 3 weeks)');
assert.strictEqual(doc([ago(1), ago(10), ago(11), ago(12), ago(13)]).kind, 'rare', 'regular logger, only 1 this week');
assert.strictEqual(doc([ago(20), ago(21)]).level, 'ok', 'stopped using the app: no nagging');
assert.notStrictEqual(doc(a).level, 'doctor', 'the demo data is not a doctor case');

// Plop's health: good weeks make him thrive, Dr. Plop's patterns cap the hearts
const hp = (logs) => { const h = L.plopHealth(logs, now); return h.hearts + ' ' + h.state; };
assert.strictEqual(hp([]), '3 ok', 'no logs this week: neutral, not punished');
assert.strictEqual(hp([ago(0), ago(1), ago(2), ago(3), ago(4)]), '5 thriving', 'a week of type 4s');
assert.strictEqual(hp([ago(0), ago(1, 8, 5), ago(2, 8, 5), ago(3, 8, 5)]), '2 ok', 'mostly type 5: fewer hearts, but nothing to worry about');
assert.strictEqual(hp([ago(0), ago(1)]), '5 ok', 'two great logs is not enough data to thrive');
assert.strictEqual(hp([ago(0, 8, 1), ago(1, 8, 2), ago(2, 8, 4)]), '2 hard', 'backed up caps at 2');
assert.strictEqual(hp([ago(0, 8, 7), ago(1, 8, 6), ago(2, 8, 7)]), '1 sick', 'doctor-level: 1 heart');
assert.strictEqual(L.plopHealth(a, now).state, 'thriving', 'the demo shows a thriving Plop');

// Plop's needs: points per tap up to each day's goal, never beyond; cleaning is +10 a day
assert.strictEqual(L.careEarned({}), 0);
assert.strictEqual(L.careEarned({ '2026-10-24': { water: 3, fibre: 1, move: 1 } }), 3 + 2 + 10);
assert.strictEqual(L.careEarned({ '2026-10-24': { water: 20, fibre: 9, move: 4 } }), 8 + 10 + 10, 'capped at the daily goal');
assert.strictEqual(L.careEarned({ '2026-10-23': { water: 8 }, '2026-10-24': { water: 8 } }), 16, 'each day has its own goal');
assert.strictEqual(L.balanceOf({ logs: [], owned: L.STARTER, care: { '2026-10-24': { move: 1 } }, cleaned: ['2026-10-24'] }), 20, 'care and cleaning spend like log points');
assert.strictEqual(L.balanceOf({ logs: [], owned: L.STARTER }), 0, 'older saves without care still work');

// growing up: by the best streak ever, so a broken streak never shrinks him
assert.strictEqual(L.bestStreak(week(1, 4).concat(week(10, 9))), 9);
assert.deepStrictEqual([0, 6, 7, 29, 30].map(L.stageOf), ['baby', 'baby', 'adult', 'adult', 'king']);
assert.strictEqual(L.stageOf(L.bestStreak(week(1, 8).concat(week(20, 2)))), 'adult', 'still grown up after the streak breaks');

// Plop's tummy empties by 1 point every 6 seconds and never below 0; a new Plop starts at 30
assert.strictEqual(L.tummyAt(undefined, 0), 30);
assert.strictEqual(L.tummyAt({ v: 90, t: 0 }, 60000), 80);
assert.strictEqual(L.tummyAt({ v: 10, t: 0 }, 3600000), 0);

// backups: a full BACKUP file restores everything; the older COPY DATA list restores logs; junk is refused
const full = L.parseBackup(JSON.stringify({ app: 'plop', v: 1, state: { logs: [log(at(2026, 10, 1)), { t: 'x', b: 9 }], owned: { 'hats:crown': 1 } } }));
assert.strictEqual(full.state.logs.length, 1, 'bad rows dropped'); assert.strictEqual(full.state.owned['hats:crown'], 1, 'closet comes back too');
const list = L.parseBackup(JSON.stringify([{ when: '2026-10-01T08:00:00.000Z', type: 4, note: 'coffee' }, { when: 'nope', type: 4 }]));
assert.deepStrictEqual([list.logs.length, list.logs[0].b, list.logs[0].n], [1, 4, 'coffee'], 'COPY DATA format restores its logs');
for (const junk of ['{}', '[]', '"hi"', 'not json', JSON.stringify({ app: 'other', state: { logs: [] } })]) assert.throws(() => L.parseBackup(junk), junk);

// blood tagged in the last 7 days: Dr. Ploopy's urgent advice straight away, whatever the types
const blood = Object.assign(ago(1), { tags: ['blood'] });
assert.deepStrictEqual([doc([blood]).level, doc([blood]).kind], ['doctor', 'blood'], 'blood is a red flag on its own');
assert.notStrictEqual(doc([Object.assign(ago(9), { tags: ['blood'] }), ago(1)]).kind, 'blood', 'blood over a week ago is no longer flagged');

// food patterns: coffee logs mostly loose, the rest fine; one-off tags are ignored
const fp = [0, 1, 2, 3].map((i) => Object.assign(ago(i, 8, 6), { tags: ['coffee'] })).concat([4, 5, 6, 7].map((i) => ago(i)));
assert.deepStrictEqual(L.tagPatterns(fp, now).map((x) => x.k), ['coffee']);
assert.strictEqual(L.tagPatterns(fp.slice(2), now).length, 0, 'under 3 tagged logs: no pattern');

// this week vs last week
const tw = L.weekTrend([ago(0), ago(2, 8, 1), ago(8), ago(9), ago(20)], now);
assert.deepStrictEqual([tw.now.n, tw.now.ideal, tw.last.n, tw.last.ideal], [2, 0.5, 2, 1]);

// quests: always 'log today' plus 2 different ones, the same all day
const q1 = L.questsFor('2026-10-29');
assert.strictEqual(q1[0].id, 'log'); assert.strictEqual(new Set(q1.map((q) => q.id)).size, 3);
assert.deepStrictEqual(L.questsFor('2026-10-29').map((q) => q.id), q1.map((q) => q.id), 'stable for the day');
assert(new Set(Array.from({ length: 30 }, (_, i) => L.questsFor('2026-11-' + (i + 1)).map((q) => q.id).join())).size > 5, 'they vary day to day');
assert.strictEqual(L.QUESTS.find((q) => q.id === 'water').done({ logs: [], care: { '2026-10-29': { water: 8 } } }, '2026-10-29'), true);

// points: chests add 30, treats are spent
assert.strictEqual(L.balanceOf({ logs: [], owned: L.STARTER, chests: ['2026-10-28', '2026-10-29'], snackSpent: 4 }), 56);
assert.strictEqual(L.gameEarned({ '2026-10-28': 35, '2026-10-29': 7 }), 27, 'Fibre Catch: best score a day, capped at 20');

// badges never come from nothing, and a textbook week earns one
const got = (st) => L.badges(Object.assign({ owned: L.STARTER }, st)).filter((b) => b.got).map((b) => b.id);
assert.deepStrictEqual(got({ logs: [] }), []);
assert.deepStrictEqual(got({ logs: week(1, 7) }), ['first', 'textbook']);
assert(got({ logs: week(1, 2).concat(week(10, 1)) }).includes('back'), 'comeback after a gap');

// Halloween closet: 20 Oct - 2 Nov only, and seasonal items are never the "next unlock"
assert.deepStrictEqual([at(2026, 10, 19), at(2026, 10, 20), at(2026, 10, 31), at(2026, 11, 2), at(2026, 11, 3)].map(L.seasonOf), ['', 'halloween', 'halloween', 'halloween', '']);

// QA #2: only the first 3 logs of a day earn; logs entered over a week late earn nothing (but still count for health)
const spam = Array.from({ length: 20 }, (_, i) => ({ t: at(2026, 10, 20, 8) + i * 60e3, c: at(2026, 10, 20, 9), b: 4, d: 1, n: '' }));
assert.strictEqual(L.earned(spam), 3 * 25, 'quick-log spam: 20 logs, 3 paid');
const late = { t: at(2026, 9, 1), c: at(2026, 10, 20), b: 4, d: 1, n: '' };
assert.strictEqual(L.earned([late]), 0, 'backfilled 7 weeks later: no points');
assert.strictEqual(L.earned([Object.assign({}, late, { c: at(2026, 9, 3) })]), 25, 'two days late is fine');
assert.strictEqual(L.earned([{ t: at(2026, 9, 1), b: 4, d: 1, n: '' }]), 25, 'old saves without an entered-at time keep their points');
assert.strictEqual(L.plopHealth([Object.assign({}, late, { t: now - 3600e3 })], now).week, 1, 'unpaid logs still count for his health');

// streak shields: a covered day keeps the streak (and its bonus) going; shields cost 150 each
const gap = week(1, 3).concat(week(5, 4));                      // day 4 missed
assert.strictEqual(L.streakBonus(gap), 0); assert.strictEqual(L.streakBonus(gap, ['2026-10-04']), 50, 'shielded day bridges the gap');
assert.strictEqual(L.currentStreak(gap, at(2026, 10, 8, 12), ['2026-10-04']), 8, 'days 1-3, the shielded 4th, 5-8');
assert.strictEqual(L.balanceOf({ logs: [], owned: L.STARTER, shields: 1 }), -150);

// mystery chests keep the amount they rolled (older saves: 30); chest furniture is free
assert.strictEqual(L.balanceOf({ logs: [], owned: L.STARTER, chests: ['a', 'b'], chestPts: { a: 60 } }), 90);
assert.strictEqual(L.balanceOf({ logs: [], owned: Object.assign({ 'decor:fish': 1 }, L.STARTER), gifts: ['decor:fish'] }), 0, 'a won fish tank costs nothing');

// all 10 tricks found: TRICKSTER badge
assert(got({ logs: [], tricks: Object.fromEntries(L.TRICKS.map((t) => [t.id, 1])) }).includes('tricks'));
assert(!got({ logs: [], tricks: { tickle: 1 } }).includes('tricks'));

{ const r = L.parseBackup(JSON.stringify({ app: 'plop', state: { logs: [{ t: '1790000000000', b: '4' }] } })).state.logs[0]; assert(r.b === 4 && r.t === 1790000000000, 'restored logs get real numbers'); }

console.log('app OK: points, streaks (incl. DST), balance, stats, unlocks, sample data, tags, quests, badges, Halloween, point caps, shields, chests | sample: ' + a.length + ' logs, ' + L.earned(a) + ' pts');
