import test from 'node:test';
import assert from 'node:assert/strict';
import { RULES } from '../src/puzzles/index.js';
import { enumeratePermutations } from '../src/puzzles/common.js';
import { mazePath, mazeEdges, mazeTrial } from '../src/puzzles/maze.js';
import { FILM_ORDER, filmHeights, PAGE_FACES, replayFilm } from '../src/puzzles/film.js';
import { pageOrderFits } from '../src/puzzles/album.js';
import { WITNESSES, solvedProgress } from './witnesses.mjs';

for (const [id, rule] of Object.entries(RULES)) {
  test(`${id}: legal controls reach a winning state without mutating previous state`, () => {
    let current = rule.create();
    assert.ok(rule.valid(current)); assert.equal(rule.solved(current), false);
    for (const move of WITNESSES[id]) {
      const before = JSON.stringify(current);
      const next = rule.move(current, move);
      assert.equal(JSON.stringify(current), before);
      assert.ok(rule.valid(next), `${id}: invalid state after ${JSON.stringify(move)}`);
      current = next;
    }
    assert.ok(rule.solved(current));
  });
  test(`${id}: malformed saved progress does not masquerade as valid state`, () => {
    for (const input of [null, false, 0, '', [], {}, { order: [0, 0, 0] }, { values: [NaN, 0, 0] }]) assert.equal(rule.valid(input), false);
    assert.deepEqual(rule.move(rule.create(), { type: 'unknown' }), rule.create());
  });
}

function product(count, length) {
  return Array.from({ length: count ** length }, (_, number) => Array.from({ length }, (_, i) => Math.floor(number / count ** i) % count));
}
test('paper operations and inverse, book ordering, film and album have unique solutions', () => {
  for (const id of ['paper', 'paperBack', 'books']) {
    const initial = RULES[id].create();
    assert.equal(enumeratePermutations(initial.order).filter(order => RULES[id].solved(id==='paper'?{...initial,opened:true,order,proof:order,presses:1}:{order})).length, 1, id);
  }
  for (const id of ['film', 'album']) {
    const seed = RULES[id].create();
    const winners = enumeratePermutations(seed.order).flatMap(order => product(2, 4).filter(faces => RULES[id].solved({ ...seed, order, faces })));
    assert.equal(winners.length, 1, id);
  }
});
test('both cloud systems and side light each have one joint solution, not independent window guesses', () => {
  for (const id of ['cloud', 'cloudGap', 'calibration']) assert.equal(product(4, 3).filter(values => RULES[id].solved({ values, back: false })).length, 1, id);
});
test('all nine paper-screen seams yield one solution', () => {
  const winners = product(2, 9).filter(flips => RULES.screen.solved({ flips }));
  assert.deepEqual(winners, [solvedProgress('screen').flips]);
});
test('mechanical belt has one route, direction and gear solution', () => {
  const winners = enumeratePermutations([0, 1, 2, 3, 4, 5, 6]).flatMap(route => [false, true].flatMap(crossed => [0, 1, 2].filter(ratio => RULES.belt.solved({ route, crossed, ratio })).map(ratio => ({ route, crossed, ratio }))));
  assert.deepEqual(winners, [solvedProgress('belt')]);
});
test('the flower lock is necessary and the bookmark releases at the target', () => {
  const seed = RULES.flowers.create(), queue = [seed], seen = new Set([JSON.stringify(seed.heights)]);
  for (let i = 0; i < queue.length; i++) for (let index = 0; index < 3; index++) {
    const next = RULES.flowers.move(queue[i], { type: 'crank', index });
    assert.equal(RULES.flowers.solved(next), false);
    const key = JSON.stringify(next.heights); if (!seen.has(key)) { seen.add(key); queue.push(next); }
  }
  assert.equal(solvedProgress('flowers').pin, -1);
});
test('the ring maze accepts exactly its two equivalent legal orientations', () => {
  const winners = product(6, 3).filter(turns => RULES.maze.solved({ turns }));
  assert.deepEqual(winners, [[0, 0, 2], [0, 0, 3]]);
  for (const turns of winners) { const path = mazePath(turns); assert.ok(path.includes(8) && path.includes(17)); }
});
test('every maze trial follows only the visible grooves and never changes ring angles',()=>{
  for(const turns of product(6,3)){
    const before=[...turns],path=mazeTrial(turns),edges=mazeEdges(turns);
    assert.equal(path[0],0);assert.equal(new Set(path).size,path.length);
    assert.ok(!path.slice(0,-1).includes(15));
    for(let i=1;i<path.length;i++)assert.ok(edges.some(([a,b])=>a===path[i-1]&&b===path[i]||b===path[i-1]&&a===path[i]));
    assert.deepEqual(turns,before);
    if(mazePath(turns))assert.deepEqual(path,mazePath(turns));
  }
});
test('balance accepts either side, and neither empty pans nor equal counts alone', () => {
  assert.equal(product(3, 4).filter(places => RULES.balance.solved({ places })).length, 2);
  assert.equal(RULES.balance.solved({ places: [0, 0, 0, 0] }), false);
});
test('stitch rules have one eight-hole route', () => {
  assert.equal(enumeratePermutations([0, 1, 2, 3, 4, 5, 6, 7]).filter(path => RULES.stitch.solved({ path })).length, 1);
});
test('interlocking drawers can always recover to the start from reachable configurations', () => {
  const queue = [RULES.drawers.create()], seen = new Map([[JSON.stringify(queue[0]), queue[0]]]), edges = [];
  for (let i = 0; i < queue.length; i++) for (let index = 0; index < 4; index++) {
    const next = RULES.drawers.move(queue[i], { type: 'drawer', index });
    const key = JSON.stringify(next), previous = JSON.stringify(queue[i]);
    edges.push([previous, key]);
    if (!seen.has(key)) { seen.set(key, next); queue.push(next); }
  }
  for (const [from, to] of edges) assert.ok(edges.some(([a, b]) => a === to && b === from));
});
test('flower tiles are reversible, and music pins have one solution', () => {
  for (let index = 0; index < 9; index++) { const initial = RULES.flips.create(); assert.deepEqual(RULES.flips.move(RULES.flips.move(initial, { type: 'flip', index }), { type: 'flip', index }), initial); }
  assert.equal(product(5, 6).filter(notes => RULES.melody.solved({ notes })).length, 1);
});
test('packing refuses overlap and off-board pieces while allowing removal', () => {
  let state = RULES.packing.create();
  assert.deepEqual(RULES.packing.move(state, { type: 'cell', index: 4 }), state);
  state = RULES.packing.move(state, { type: 'cell', index: 0 });
  state = RULES.packing.move(state, { type: 'select', index: 1 });
  assert.deepEqual(RULES.packing.move(state, { type: 'cell', index: 0 }), state);
  const completed = solvedProgress('packing'); assert.ok(RULES.packing.solved(completed));
  assert.equal(RULES.packing.solved(RULES.packing.move(completed, { type: 'remove' })), false);
});

test('film actions must be read in time order, and perforations carry the flower clue', () => {
  assert.deepEqual(replayFilm(FILM_ORDER), PAGE_FACES);
  assert.deepEqual(PAGE_FACES, [1, 0, 1, 0]);
  assert.notDeepEqual(replayFilm([0, 1, 2]), PAGE_FACES);
  assert.deepEqual(filmHeights(FILM_ORDER), [3, 2, 1]);
});

test('album needs the relation from the film as well as the two cloud relations', () => {
  const partial = enumeratePermutations([0, 1, 2, 3]).filter(order => order.indexOf(0) === order.indexOf(1) + 2 && order.indexOf(3) === order.indexOf(1) + 1);
  assert.equal(partial.length, 2);
  assert.deepEqual(partial.filter(pageOrderFits), [[1, 3, 0, 2]]);
});

test('a full wood frame with the T pieces swapped is not a completed picture', () => {
  const state = solvedProgress('packing');
  [state.placed[1], state.placed[2]] = [state.placed[2], state.placed[1]];
  assert.ok(RULES.packing.valid(state));
  assert.equal(RULES.packing.solved(state), false);
  state.placed[0].turn = 2;
  assert.ok(RULES.packing.valid(state));
  assert.equal(RULES.packing.solved(state), false);
});
