const fs = require('fs'), assert = require('assert');
const load = (f) => { const h = fs.readFileSync(f, 'utf8'); return h.split('data-dc-script')[1].split('>').slice(1).join('>').split('</script>')[0]; };
class DCLogic { constructor(p) { this.props = p || {}; } setState(o) { this.state = Object.assign({}, this.state, o); } }
const Closet = new Function('DCLogic', load(process.argv[2]) + '; return Component;')(DCLogic);
const c = new Closet({});
const v = () => c.renderVals();
const pick = (name) => { const it = v().items.find((i) => i.name === name); assert(it, 'no item ' + name); it.pick(); };

let r = v();
assert.strictEqual(r.pts, '425', 'starts at 425 (400 + the 25 just earned)');
for (const tab of ['tabHats', 'tabSkins', 'tabFace']) { v()[tab](); for (const it of v().items) assert.strictEqual(it.cells.length, 48, it.name + ' icon is 8x6'); }
v().tabHats();
assert.strictEqual(v().actLabel, 'WEARING IT', 'party hat worn at start');
pick('CROWN');                     r = v(); assert.strictEqual(r.actLabel, 'BUY FOR 300'); assert.strictEqual(r.phat, 'crown', 'preview shows crown');
r.act();                           r = v(); assert.strictEqual(r.pts, '125'); assert.strictEqual(r.actLabel, 'WEARING IT');
v().tabSkins(); pick('24K GOLD');  r = v(); assert.strictEqual(r.actLabel, 'NEED 125 MORE'); assert.strictEqual(r.pskin, 'gold');
r.act();                           r = v(); assert.strictEqual(r.pts, '125', 'cannot overspend'); assert.strictEqual(r.pmood, 2, 'Plop is sad');
pick('DARK ROAST'); v().act();     r = v(); assert.strictEqual(r.pts, '65'); assert.strictEqual(r.pskin, 'roast');
pick('CLASSIC');                   r = v(); assert.strictEqual(r.actLabel, 'WEAR IT', 'owned item offers wear, not buy');
r.act();                           r = v(); assert.strictEqual(r.pts, '65', 'wearing is free'); assert.strictEqual(r.pskin, 'classic');
v().tabHats();                     r = v(); assert.strictEqual(r.phat, 'crown', 'crown stays worn across tabs');
assert(!v().items.find((i) => i.name === 'CROWN').tag.includes('PTS'), 'bought item no longer shows a price');
console.log('closet OK: 425 -> crown 125 -> gold refused -> roast 65 -> classic re-worn free');
