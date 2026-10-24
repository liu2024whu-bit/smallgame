import test from 'node:test';
import assert from 'node:assert/strict';
import { RULES } from '../src/puzzles/index.js';
import { createState, reduce, serializable, normalizeState } from '../src/core/state.js';
import { achievements, canOpenEncore } from '../src/core/achievements.js';
import { ACTIVITY_IDS } from '../src/data/activities.js';
import { WITNESSES } from './witnesses.mjs';

test('a wood-piece drag is one undoable placement, including moves and returns', () => {
  let state = reduce(createState(), { type: 'start' });
  const start = structuredClone(state.progress.packing);
  state = reduce(state, { type: 'move', id: 'packing', move: { type: 'drop', id: 0, row: 0, column: 0, turn: 0 } });
  assert.equal(state.history.packing.length, 1);
  const placed = structuredClone(state.progress.packing);
  assert.equal(reduce(state, { type: 'move', id: 'packing', move: { type: 'drop', id: 1, row: 0, column: 0, turn: 0 } }), state);
  assert.deepEqual(reduce(state, { type: 'undo', id: 'packing' }).progress.packing, start);
  state = reduce(state, { type: 'move', id: 'packing', move: { type: 'drop', id: 0, row: 1, column: 0, turn: 0 } });
  assert.deepEqual(reduce(state, { type: 'undo', id: 'packing' }).progress.packing, placed);
  state = reduce(state, { type: 'move', id: 'packing', move: { type: 'unplace', id: 0 } });
  assert.equal(state.progress.packing.placed[0], null);
  assert.equal(reduce(state, { type: 'move', id: 'packing', move: { type: 'drop', id: 0, row: -1, column: 0, turn: 0 } }), state);
});

test('the same printed picture can be completed with five direct drags', () => {
  let state = RULES.packing.create();
  for (const [id, [row, column, turn]] of [[0, 0, 0], [0, 3, 1], [2, 0, 2], [1, 0, 1], [2, 2, 0]].entries()) {
    state = RULES.packing.move(state, { type: 'drop', id, row, column, turn });
    assert.ok(RULES.packing.valid(state));
  }
  assert.ok(RULES.packing.solved(state));
});

test('reordering a whole book or page preserves its identity and attached face', () => {
  for (const id of ['paper', 'paperBack', 'books', 'film', 'album']) {
    const seed = RULES[id].create();
    const initial = id==='paper'?RULES[id].move(seed,{type:'open'}):seed;
    const moved = RULES[id].move(initial, { type: 'reorder', from: 0, to: initial.order.length - 1 });
    assert.ok(RULES[id].valid(moved));
    assert.deepEqual(moved.order, [...initial.order.slice(1), initial.order[0]]);
    if (initial.faces) assert.deepEqual(moved.faces, initial.faces);
    assert.deepEqual(RULES[id].move(initial, { type: 'reorder', from: -1, to: 0 }), initial);
    assert.deepEqual(RULES[id].move(initial, { type: 'reorder', from: 0, to: 99 }), initial);
  }
});

test('pins and weights accept precise drop destinations and reject out-of-range drops', () => {
  let notes = RULES.melody.create();
  [0, 2, 1, 3, 2, 0].forEach((note, index) => { notes = RULES.melody.move(notes, { type: 'set-note', index, note }); });
  assert.ok(RULES.melody.solved(notes));
  assert.equal(RULES.melody.move(notes, { type: 'set-note', index: 0, note: 5 }), notes);
  let weights = RULES.balance.create();
  [1, 2, 2, 1].forEach((pan, index) => { weights = RULES.balance.move(weights, { type: 'place', index, pan }); });
  assert.ok(RULES.balance.solved(weights));
  assert.equal(RULES.balance.move(weights, { type: 'place', index: 0, pan: 3 }), weights);
});

test('optional activity records persist without changing puzzles or granting gifts', () => {
  let state = createState();
  assert.equal(reduce(state, { type: 'activity', id: 'art:color' }), state);
  state = reduce(state, { type: 'start' });
  for (const id of ACTIVITY_IDS) state = reduce(state, { type: 'activity', id });
  assert.deepEqual(state.solved, []);
  assert.equal(achievements(state).find(entry => entry.id === 'keepsakes').count, 0);
  assert.equal(canOpenEncore(state), false);
  assert.deepEqual(normalizeState({ ...serializable(state), activities: [...ACTIVITY_IDS, 'unknown', 'art:color'], achievements: ['keepsakes'] }).activities, ACTIVITY_IDS.filter(id=>id!=='birthday:unwrap'));
  const old = serializable(state); delete old.activities;
  assert.deepEqual(normalizeState(old).activities, []);
});

test('the extra page requires the birthday, all activities and the real collected gifts', () => {
  let state = reduce(createState(), { type: 'start' });
  for (const id of ['bookmark', 'thread']) state = reduce(state, { type: 'pickup', id });
  for (const [id, moves] of Object.entries(WITNESSES)) {
    if(id==='chocolate')state=reduce(state,{type:'use-tool',item:'crank',target:'birthday-door'});
    for (const move of moves) state = reduce(state, { type: 'move', id, move });
  }
  for (const id of ACTIVITY_IDS) state = reduce(state, { type: 'activity', id });
  assert.ok(achievements(state).filter(entry=>entry.id!=='birthday').every(entry => entry.complete));
  assert.equal(canOpenEncore(state), false);
  state = reduce(state, { type: 'ending' });
  assert.equal(canOpenEncore(state),false);
  state=reduce(state,{type:'activity',id:'birthday:unwrap'});
  assert.equal(canOpenEncore(state), true);
  assert.equal(canOpenEncore(normalizeState(serializable(state))), true);
});
