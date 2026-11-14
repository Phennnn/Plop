// Drives Plop's engine (from index.html) headlessly: every snack, action, idle animation and gesture.
// Run from the project folder:  node tests/plop-check.js
const fs = require('fs'), path = require('path'), assert = require('assert');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const A = '/* ---------------- Plop: pixel buddy on a low-res canvas ---------------- */', B = '/* ---------------- screens ---------------- */';
const src = html.slice(html.indexOf(A), html.indexOf(B));

let T = 1000, draws = 0;
global.performance = { now: () => T };
global.matchMedia = () => ({ matches: false });
global.setTimeout = () => 0; global.clearTimeout = () => {};
const ctx = () => ({ imageSmoothingEnabled: true, globalAlpha: 1, fillStyle: '', clearRect() {}, save() {}, restore() {}, translate() {}, scale() {}, drawImage() { draws++; },
  fillRect(x, y, w, h) { draws++; if (![x, y, w, h].every(Number.isFinite)) throw new Error('bad fillRect ' + [x, y, w, h]); } });
global.document = { createElement: () => ({ width: 0, height: 0, getContext: ctx }) };
const { Plop, FOOD, IDLE, SHEET, PROPS, SCENES, DECOR, MOTION, FX, TRICK } = new Function(src + '; return { Plop, FOOD, IDLE, SHEET, PROPS, SCENES, DECOR, MOTION, FX, TRICK };')();
const found = []; TRICK.on = (id) => found.push(id);
SHEET.ok = true; SHEET.img = { width: SHEET.CW * SHEET.f.length, height: SHEET.CH };   // Plop is drawn from the sprite sheet
PROPS.ok = true; PROPS.img = {};                                                     // ...and his bathroom from the props sheet
SCENES.ok = true; SCENES.potty = SCENES.bath = { width: 148, height: 200 };         // ...and the potty and bath trips get their own rooms

function make(cw, ch, px, big) {
  const cv = { width: 0, height: 0, getContext: ctx, getBoundingClientRect: () => ({ left: 0, top: 0, width: cw, height: ch }) };
  const el = { clientWidth: cw, clientHeight: ch, querySelector: (q) => (q === 'canvas' ? cv : q === 'button' ? { addEventListener() {} } : { textContent: '', hidden: true, style: {} }) };
  const p = new Plop({ set innerHTML(v) {}, firstElementChild: el }, big ? 0 : ch, px, '', big);
  const step = (n) => { for (let i = 0; i < n; i++) { T += 16.7; p.frame(T); } };
  const css = (lx, ly) => ({ clientX: lx * cw / cv.width, clientY: ly * ch / cv.height, pointerId: 1, currentTarget: { setPointerCapture() {} } });
  step(2);
  return { p, step, css, g: () => p.geo() };
}
const settle = (b, max) => { for (let i = 0; i < (max || 3000); i++) { b.step(1); const s = b.p.s; if (!b.p.act && !s.script && s.y === 0 && !s.vx && Math.abs(s.x - s.home) < 2) return i; } return -1; };

// ---- the big play-screen Plop ----
const big = make(390, 520, 4, true), p = big.p;
assert(big.g().ms >= 3, 'play screen Plop is drawn big (ms=' + big.g().ms + ')');

// eyes follow the pointer: far left, then far right (idles paused, so a random "look around" can't move his eyes mid-check)
p.s.nextIdle = Infinity;
p.look(0, 300); big.step(30); assert(p.s.lx < -0.8, 'looks left: ' + p.s.lx.toFixed(2));
p.look(390, 300); big.step(30); assert(p.s.lx > 0.8, 'looks right: ' + p.s.lx.toFixed(2));
p.look(195, 520, true); T += 3000; big.step(40); assert(Math.abs(p.s.lx) < 0.2, 'touch look resets to centre after the finger lifts');
p.s.nextIdle = 0;

// every snack, every action, every idle animation
for (const k of Object.keys(FOOD)) { assert(p.feed(k), 'feed ' + k); assert(settle(big) >= 0, k + ' finishes and he is home'); }
for (const a of ['dance', 'bath']) { assert(p.perform(a)); assert(settle(big) >= 0, a + ' finishes'); }
for (const a of IDLE) { p.startAct(a, T); assert(settle(big) >= 0, a + ' finishes'); }

// coffee sends him to the toilet and back
p.feed('coffee'); let maxX = 0;
for (let i = 0; i < 3000 && (p.act || p.s.script || i < 5); i++) { big.step(1); maxX = Math.max(maxX, p.s.x); }
const seatX = (g0) => Math.round(g0.W / 2 + 18 * g0.k);                                // the toilet's middle in the potty room
assert(Math.abs(maxX - seatX(big.g())) < 3, 'climbed onto the toilet in the potty room (max x ' + maxX.toFixed(0) + ', seat ' + seatX(big.g()) + ')');
assert(settle(big) >= 0 && Math.abs(p.s.x - big.g().cx) < 2, 'came back home after the flush');

// POTTY (or tapping his toilet): same trip, no coffee needed; what he says after depends on his health
for (const viaTap of [false]) {                                      // (his room has no toilet to tap any more: POTTY only)
  p.glow = true;
  if (viaTap) { p.s.fly.state = 'gone'; p.s.fly.at = Infinity; const tg = big.g();   // no fly in the way: a tap on the fly swats it instead
  p.onDown(big.css(tg.tx, tg.ground - 20 * tg.k)); } else assert(p.perform('potty'), 'potty starts');
  assert(p.s.script, 'potty trip under way' + (viaTap ? ' (tapped his toilet)' : ''));
  let far = 0; const seen = new Set();
  for (let i = 0; i < 3000 && p.s.script; i++) {
    big.step(1); far = Math.max(far, p.s.x); seen.add(p.toiletFrame(T) + (p.propFrame(T) === -1 ? 'h' : ''));
    if (p.s.script && p.s.script.phase === 4 && p.line) assert.strictEqual(p.line, 'textbook. 10/10.');
  }
  assert(Math.abs(far - seatX(big.g())) < 3 && settle(big) >= 0, 'sat on his toilet and came home');
  assert.strictEqual(p.view, 'room', 'back in his room after the potty trip');
  for (const f of ['6h', '7h', '8h', '2', '3', '4', '5']) assert(seen.has(f), 'potty frame ' + f + ' shown (h = Plop hidden while sitting): ' + [...seen]);
  p.glow = false;
}

// pick him up, fling him left, he bonks, lands, walks home
let g = big.g();
p.onDown(big.css(p.s.x, g.ground - 7 * g.ms)); T += 16; p.onMove(big.css(p.s.x - 10, g.ground - 30));
for (let i = 0; i < 6; i++) { T += 16; p.onMove(big.css(p.s.x - 6 * (i + 1), g.ground - 40 - 3 * i)); }
assert(p.s.grabbed, 'drag picks him up'); p.onUp();
assert(!p.s.grabbed && p.s.vx < 0, 'released with leftward speed');
assert(settle(big) >= 0, 'thrown Plop lands and walks home');

// tickle: rub back and forth over him
g = big.g(); let x = p.s.x;
for (let i = 0; i < 10; i++) { x += i % 2 ? 4 : -4; T += 40; p.onMove(big.css(x, g.ground - 7 * g.ms)); }
assert(p.act && p.act.type === 'giggle', 'rubbing makes him giggle');
settle(big);

// shake him while holding: dizzy
g = big.g(); p.onDown(big.css(p.s.x, g.ground - 7 * g.ms)); T += 16; p.onMove(big.css(p.s.x, g.ground - 40));
for (let i = 0; i < 10; i++) { T += 40; p.onMove(big.css(p.s.x + (i % 2 ? 8 : -8), g.ground - 40)); }
assert(T < p.s.dizzyUntil, 'shaking him makes him dizzy'); p.onUp(); settle(big);

// lights off: asleep, won't eat; lights on: awake
p.setDark(true); big.step(30);
assert(p.asleep(T) && !p.feed('apple'), 'asleep in the dark and refuses snacks');
p.setDark(false); big.step(5); assert(!p.asleep(T), 'wakes when the lights come on');

// ---- the small embedded Plops still work (Today, Log, Closet, Reward) ----
for (const [w, h, px] of [[344, 214, 5], [344, 150, 5], [344, 270, 6], [342, 230, 5]]) {
  const e = make(w, h, px, false);
  for (let m = 0; m <= 7; m++) { e.p.mood = m; e.step(60); }
  e.p.mood = 0; e.p.scene = 'party'; e.step(60);
  const eg = e.g(); e.p.onDown(e.css(e.p.s.x, eg.ground - 6)); T += 300; e.p.onUp(); e.step(120);
  assert.strictEqual(e.p.s.x, eg.cx, 'embedded Plop never leaves home');
}

// ---- Dr. Plop: no room, head mirror, stethoscope, nerd glasses, in the small widget and the big sheet ----
for (const [w, h, px] of [[78, 84, 3], [392, 140, 5]]) {
  const d = make(w, h, px, false);
  d.p.scene = 'none'; d.p.wear({ hats: 'doctor', skins: 'classic', face: 'nerd' });
  const flyBefore = d.p.s.fly.x;
  d.step(400);
  assert.strictEqual(d.p.s.fly.x, flyBefore, 'no fly buzzing around the doctor once the room is gone');
}
// ---- unwell Plop (from Dr. Plop's check): cracks, melt, puddle, thermometer all draw on every screen size, and boops still work ----
for (const ill of [{ kind: 'hard', sick: false }, { kind: 'loose', sick: false }, { kind: 'loose', sick: true }, { kind: 'hard', sick: true }]) {
  const e = make(344, 214, 5, false);
  e.p.ill = ill; e.step(300);
  p.ill = ill; p.boop(T); big.step(300);
  assert(!/PLOP!|hehe|BOOP/.test(p.line), 'unwell Plop says unwell things: ' + p.line);
}
p.ill = null; settle(big);

// thriving Plop sparkles and says happy things
p.glow = true; p.s.taps = []; p.wake(T); p.boop(T);
assert(/GREAT|fibre|textbook|regular|GLOWING/.test(p.line), 'thriving Plop says thriving things: ' + p.line);
let sparkled = false;
for (let i = 0; i < 300 && !sparkled; i++) { big.step(1); sparkled = p.s.parts.some((q) => q.type === 'spark'); }
assert(sparkled, 'thriving Plop sparkles');
p.glow = false;
// ---- NEW LOOK: the drawn sprite sheet. Each state picks the right face; skins, hats and sickness all draw. ----
assert.strictEqual(SHEET.f.length, 48, '24 frames from the Gemini v2 sheet + 24 poses from v3');
{ const q = make(300, 200, 5).p; q.strike('think', 5000); assert.strictEqual(q.frameFor({}, T), 32, 'a held pose shows its frame');
  q.strike('wave', 5000); assert([24, 25].includes(q.frameFor({}, T)), 'waving flips between its two frames');
  q.posed = null; q.dark = true; assert.strictEqual(q.frameFor({ sleep: true }, T), 38, 'lights off: he lies down'); }
{
  const e = make(344, 214, 5, false), q = e.p, fr = () => q.frameFor(q.pose(T, e.g()), T);
  q.wear({ hats: 'crown', skins: 'mint', face: 'none' }); e.step(30);
  assert(e.g().head < e.g().ground - 20, 'the new look is taller, so his speech bubble sits higher');
  q.dark = true; e.step(2); assert.strictEqual(fr(), 38, 'asleep in the dark: lying down'); q.dark = false;
  q.s.dizzyUntil = T + 1e4; e.step(1); assert.strictEqual(fr(), 16, 'dizzy: spiral eyes'); q.s.dizzyUntil = 0;
  q.ill = { kind: 'loose', sick: true }; q.s.lastAct = T; e.step(1); assert.strictEqual(fr(), 20, 'sick: thermometer');
  q.ill = { kind: 'loose', sick: false }; e.step(1); assert.strictEqual(fr(), 19, 'queasy: green and sweaty');
  q.ill = null; q.mood = 1; e.step(1); assert.strictEqual(fr(), 18, 'type 1 on the log screen: straining');
  q.mood = 7; e.step(1); assert.strictEqual(fr(), 15, 'type 7: shocked'); q.mood = 0;
  q.ill = { kind: 'hard', sick: true }; e.step(200); q.ill = null; q.glow = true; e.step(200);
  q.ill = null; q.glow = false; q.s.dizzyUntil = 0; q.s.lookAt = T; q.s.lx = -0.9; q.s.tx = -0.9; q.s.blinkUntil = 0; q.s.blinkAt = T + 1e9;
  assert.strictEqual(fr(), 2, 'looking left uses the look frame...'); assert.strictEqual(q.flip, true, '...mirrored');
  q.s.lx = 0.9; fr(); assert.strictEqual(q.flip, false, 'looking right: not mirrored');
}
// every face item and hat draws on the new sprites without crashing (Dr. Plop wears the doctor kit + nerd glasses)
{
  const e = make(344, 214, 5, false);
  for (const face of ['none', 'shades', 'nerd', 'monocle', 'stache', 'blush']) for (const hats of ['none', 'party', 'bow', 'cap', 'beanie', 'crown', 'doctor', 'pumpkin']) { e.p.wear({ hats, skins: face === 'none' ? 'ghost' : 'gold', face }); e.step(3); }
}
// BATH: shower or tub, then the towel; his own sprite steps aside while a props frame shows him
for (const tub of [false, true]) {
  p.perform('bath'); const frames = new Set(), views = new Set();
  for (let i = 0; i < 60 && !(p.act && p.act.type === 'bath'); i++) { big.step(1); views.add(p.view); }   // the wipe into the bath room comes first
  p.act.tub = tub;
  for (let i = 0; i < 400 && p.act; i++) { big.step(1); views.add(p.view); const f = p.propFrame(T); if (f !== null) frames.add(f); }
  for (let i = 0; i < 80; i++) { big.step(1); views.add(p.view); }
  assert(views.has('bath') && p.view === 'room', 'bath happens in the bath room, then he is home: ' + [...views] + ' -> ' + p.view);
  const want = tub ? [20, 18] : [12, 16, 17, 18];
  for (const f of want) assert(frames.has(f), (tub ? 'tub' : 'shower') + ' frame ' + f + ' shown: ' + [...frames]);
  settle(big);
}
// tummy ache: queasy face over everything except what you're doing to him
p.ache = T + 5000; big.step(5); assert.strictEqual(p.frameFor(p.pose(T, big.g()), T), 19, 'tummy ache: queasy'); p.ache = 0;
// the picture room (behind the canvas) with every overlay: unwell grime, party bunting, the rug
SCENES.room = { width: 238, height: 133 }; SCENES.roomURL = 'data:x';
for (const [w, h, px] of [[344, 214, 5], [344, 150, 5]]) {
  const e = make(w, h, px, false); e.p.ill = { kind: 'hard', sick: true }; e.step(20); e.p.scene = 'party'; e.p.ill = null; e.step(20);
}
// keep shaking: a rainbow pours out of his mouth and floods the room; he swims, tilting drifts him, flushing drains it
g = big.g(); p.onDown(big.css(p.s.x, g.ground - 7 * g.ms)); T += 16; p.onMove(big.css(p.s.x, g.ground - 40));
for (let i = 0; i < 60; i++) { T += 40; p.onMove(big.css(p.s.x + (i % 2 ? 8 : -8), g.ground - 40)); }
assert(p.rain, 'shaken twice in a row: rainbow'); p.onUp();
FX.ok = true; FX.img = {}; p.rain.t0 = p.rain.last = T;                               // the rainbow effects sheet; watch the sequence from its start
const seq = []; for (let i = 0; i < 300; i++) { big.step(1); seq.push(p.rainFrame(T)); }
assert(seq.includes(19) && seq.includes(11) && seq.includes(10) && seq.includes(16) && seq.includes(21), 'puke sequence: queasy, puffed, BLEH, dizzy, relieved (his own frames)');
big.step(100); assert(p.rain && p.rain.lv > 0.5 && p.lift > 0 && [22, 23, 12, 15].includes(p.rainFrame(T)), 'it floods and stays until flushed; he swims');
const x0 = p.s.x; MOTION.tilt = 0.5; big.step(120); assert(p.s.x > x0 + 5, 'tilt the phone: he drifts downhill'); MOTION.tilt = 0;
for (let i = 0; i < 4; i++) p.flush(T);
big.step(120); assert(!p.rain && p.puddle, 'four flushes drain it, leaving a puddle'); assert(settle(big) >= 0, 'then he goes home');

// room decor: one item per spot, drawn from the decor sheet; a rug replaces his mat
DECOR.ok = true; DECOR.img = {};
global.DECOR_BY = { 'rug-teal': { id: 'rug-teal', slot: 'rug', i: 0 }, sofa: { id: 'sofa', slot: 'seat', i: 5 }, tv: { id: 'tv', slot: 'side', i: 14 }, records: { id: 'records', slot: 'side', i: 17 }, clock: { id: 'clock', slot: 'wall', i: 10 }, cactus: { id: 'cactus', slot: 'corner', i: 19 } };
p.decor = { rug: 'rug-teal', seat: 'sofa', side: 'tv', wall: 'clock', corner: 'cactus' };
const before = draws; big.step(5); assert(draws > before, 'decor draws');
// with a seat he sometimes naps on it: hops over, sleeps up on the cushion, then comes back
assert(p.seatX, 'the seat spot is known'); const mid = p.s.home;
p.nap = { until: T + 8000, home: mid }; p.s.home = p.seatX; big.step(240);
assert(Math.abs(p.s.x - p.seatX) < 3 && p.asleep(T) && p.lift > 0, 'asleep on his seat');
p.decor = {}; big.step(500);                                                            // seat gone, so no second nap
// tap his furniture: the record player makes him dance
p.decor = { side: 'records' }; settle(big); big.step(2);
const rec = p.decorHit.find((r) => r.it.id === 'records');
p.onDown(big.css((rec.x0 + rec.x1) / 2, (rec.y0 + rec.y1) / 2)); p.onUp();
assert(p.act && p.act.type === 'dance', 'tap the record player: he dances'); p.decor = {}; settle(big);
// the 6 new snacks all go down, with their own reactions
for (const k of ['kiwi', 'banana', 'oats', 'soda', 'cake', 'pizza']) { assert(FOOD[k], k); p.ache = 0; if (p.feed(k)) settle(big); }
assert(!p.nap && Math.abs(p.s.x - mid) < 3, 'back home after the nap');
assert(['tickle', 'shake', 'rainbow'].every((t) => found.includes(t)), 'tricks report themselves: ' + found.join());

// asleep at night (Today sets dark + night): one tap wakes him, after that taps are normal
p.dark = p.night = true; p.wake(T); assert(!p.dark && !p.night, 'a tap wakes him from his night sleep');

// walking: he looks where he's going (frames 40/41 look right, mirrored when he heads left)
{ const q = make(300, 200, 5).p; q.s.walkHop = true; q.s.vx = -1; assert([40, 41].includes(q.frameFor({}, T)) && q.flip, 'walking left: mirrored');
  q.s.vx = 1; q.frameFor({}, T); assert(!q.flip, 'walking right: as drawn'); }

console.log('plop OK: rainbow puke, decor, eyes track left/right/reset, 5 snacks, coffee trip, throw + walk home, tickle, shake, lights, embeds, unwell looks | ' + draws + ' draw calls');
