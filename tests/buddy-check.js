const fs = require('fs'), assert = require('assert');
const html = fs.readFileSync(process.argv[2], 'utf8');
const src = html.split('data-dc-script')[1].split('>').slice(1).join('>').split('</script>')[0];

let T = 1000, calls = 0, oob = 0;
global.performance = { now: () => T };
global.requestAnimationFrame = () => 1; global.cancelAnimationFrame = () => {};
global.window = { matchMedia: () => ({ matches: false }) };
const ctx2d = (cv) => ({ imageSmoothingEnabled: true, fillStyle: '', clearRect() {}, drawImage() { calls++; },
  fillRect(x, y, w, h) { calls++; if (![x, y, w, h].every(Number.isFinite)) throw new Error('non-finite fillRect ' + [x, y, w, h]); } });
global.document = { createElement: () => { const c = { width: 0, height: 0 }; c.getContext = () => ctx2d(c); return c; } };
class DCLogic { constructor(p) { this.props = p; } setState(o) { this.state = Object.assign({}, this.state, o); } }
global.DCLogic = DCLogic;
global.setTimeout = (f) => 0; global.clearTimeout = () => {};
const Component = new Function('DCLogic', src + '; return Component;')(DCLogic);

const cases = [
  { w: 390, h: 844, px: 6 },                                      // playground
  { w: 344, h: 214, px: 5, embed: 'yes', bubble: 'nothing yet today.' },
  { w: 344, h: 150, px: 5, embed: 'yes', mood: 7 },
  { w: 344, h: 270, px: 6, embed: 'yes' },
  { w: 342, h: 230, px: 5, embed: 'yes', scene: 'party', mood: 4 },
  { w: 300, h: 200, px: 4, scene: 'none', mood: 2 }
];
for (const props of cases) for (let mood = 0; mood <= 7; mood++) {
  const H = ['none','party','bow','cap','beanie','crown'], S = ['classic','roast','caramel','strawberry','mint','gold'], F = ['none','blush','stache','monocle','nerd','shades']; const P = Object.assign({ hat: H[mood % 6], skin: S[(mood + 2) % 6], face: F[(mood + 4) % 6] }, props, props.mood === undefined ? { mood } : {});
  const c = new Component(P);
  const v = c.renderVals();
  assert(v.lw > 0 && v.lh > 0, 'canvas size');
  const cv = { width: v.lw, height: v.lh, getBoundingClientRect: () => ({ left: 0, top: 0, width: P.w, height: P.h }) };
  cv.getContext = () => ctx2d(cv);
  v.setCanvas(cv); c.componentDidMount();
  const ev = (x, y) => ({ clientX: x, clientY: y, pointerId: 1, currentTarget: { setPointerCapture() {} }, detail: 1 });
  const step = (n) => { for (let i = 0; i < n; i++) { T += 16.7; c._frame(T); } };
  step(30);
  // body tap (center-bottom area), hold-charge jump, background tap, rapid boops for dizzy
  const g = c.geo(); const bx = g.cx * P.w / v.lw, by = (g.ground - 6 * g.ms) * P.h / v.lh;
  v.move(ev(bx, by)); v.down(ev(bx, by)); step(60); v.up(); step(120);
  v.down(ev(5, 5)); v.up(); step(10);
  for (let i = 0; i < 6; i++) { v.down(ev(bx, by)); v.up(); step(3); }
  step(200);
  // swat the fly where it currently is
  const f = c.sim.fly; if (f.state === 'alive') { v.down(ev(f.x * P.w / v.lw, f.y * P.h / v.lh)); v.up(); }
  step(50); v.click({ detail: 0 }); step(30);
  T += 10000; step(90);                                       // fall asleep
  assert(P.scene === 'party' || c.asleep(T), 'should nap when idle');
  v.move(ev(bx, by)); step(10);                                 // wake
  assert(!c.asleep(T), 'should wake on move');
  const vv = c.renderVals();
  assert(typeof vv.bubbleStyle === 'string' && /bottom: \d+px/.test(vv.bubbleStyle), 'bubble style');
  c.componentWillUnmount();
}
console.log('OK', cases.length * 8, 'runs,', calls, 'draw calls, no exceptions');
