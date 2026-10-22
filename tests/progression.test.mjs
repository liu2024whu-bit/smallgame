import test from 'node:test';
import assert from 'node:assert/strict';
import { createState, reduce, inventory, access, normalizeState, serializable } from '../src/core/state.js';
import { MAIN_IDS } from '../src/data/puzzles.js';
import { createStore } from '../src/core/store.js';
import { SAVE_KEY, BACKUP_KEY, parseSave, loadSave, writeSave } from '../src/core/storage.js';
import { WITNESSES, solvedProgress } from './witnesses.mjs';

export const memoryStorage = () => {
  const data = new Map();
  return { data, getItem: key => data.get(key) ?? null, setItem: (key, value) => data.set(key, value) };
};
function start() { let state = reduce(createState(), { type: 'start' }); for (const id of ['bookmark', 'thread']) state = reduce(state, { type: 'pickup', id }); return state; }
function finish(state, id) { return WITNESSES[id].reduce((s, move) => reduce(s, { type: 'move', id, move }), state); }

test('full main journey reaches the birthday with all reusable tools and no side puzzles', () => {
  let state = start();
  for (const id of MAIN_IDS) {
    assert.ok(access(state, id).ready, `${id} was unreachable`);
    state = finish(state, id); assert.ok(state.solved.includes(id), id);
    state = parseSave(JSON.stringify(serializable(state))); // Every chapter also survives a reload.
  }
  assert.deepEqual(state.solved, MAIN_IDS);
  for (const id of ['bookmark', 'thread', 'mirror', 'crank', 'transparency', 'needle', 'pulley', 'board', 'pageA', 'pageB', 'pageC', 'pageD']) assert.ok(inventory(state).includes(id));
  state = reduce(state, { type: 'ending' }); assert.equal(state.ending, true);
  assert.equal(normalizeState(serializable(state)).ending, true);
});
test('the two branches can be completed in a different order', () => {
  let state = start();
  for (const id of ['cloud', 'paper', 'calibration', 'screen', 'books', 'belt', 'film', 'flowers', 'cloudGap', 'paperBack', 'album', 'stitch']) state = finish(state, id);
  assert.ok(state.solved.includes('stitch'));
});
test('optional puzzles can all be completed before touching the main chain', () => {
  let state = start();
  for (const id of Object.keys(WITNESSES).filter(id => !MAIN_IDS.includes(id))) { assert.ok(access(state, id).ready); state = finish(state, id); assert.ok(state.solved.includes(id), id); }
  assert.equal(state.solved.length, 6);
});
test('locked and already completed puzzles cannot advance or issue rewards twice', () => {
  let state = start();
  assert.equal(reduce(state, { type: 'move', id: 'album', move: WITNESSES.album[0] }), state);
  assert.equal(reduce(state, { type: 'ending' }), state);
  state = finish(state, 'paper'); const before = state;
  assert.equal(reduce(state, { type: 'move', id: 'paper', move: WITNESSES.paper[0] }), before);
  assert.equal(inventory(state).filter(id => id === 'transparency').length, 1);
});
test('undo and reset restore real state and never remove earned tools', () => {
  let state = start(), initial = state.progress.paper;
  state = reduce(state, { type: 'move', id: 'paper', move: WITNESSES.paper[0] });
  assert.notDeepEqual(state.progress.paper, initial);
  state = reduce(state, { type: 'undo', id: 'paper' }); assert.deepEqual(state.progress.paper, initial);
  state = reduce(state, { type: 'move', id: 'paper', move: WITNESSES.paper[0] });
  state = reduce(state, { type: 'reset', id: 'paper' }); assert.deepEqual(state.progress.paper, initial);
  assert.ok(inventory(state).includes('bookmark'));
});
test('forged completion, inventory, invalid settings and malformed arrays grant nothing', () => {
  const forged = { ...createState(), begun: true, collected: ['board', 'pageA', 'bookmark'], solved: MAIN_IDS, ending: true, progress: { ...createState().progress, paper: { order: [0, 0, 0] } }, settings: { volume: 200, skyCapeLeft: 'evil', sound: 'yes' } };
  const restored = normalizeState(forged);
  assert.deepEqual(restored.collected, ['bookmark']); assert.deepEqual(restored.solved, []); assert.equal(restored.ending, false);
  assert.equal(restored.settings.volume, 1); assert.equal(restored.settings.skyCapeLeft, 'bat'); assert.equal(restored.settings.sound, true);
  forged.progress.stitch = solvedProgress('stitch'); assert.deepEqual(normalizeState(forged).solved, []);
});
test('corrupt saves recover the last valid backup, and invalid imports preserve active state', () => {
  const storage = memoryStorage(); let state = start(); writeSave(storage, state);
  state = finish(state, 'paper'); writeSave(storage, state);
  assert.ok(storage.getItem(BACKUP_KEY)); storage.setItem(SAVE_KEY, '{broken');
  assert.deepEqual(loadSave(storage).state.collected, ['bookmark', 'thread']);
  assert.match(loadSave(storage).notice, /恢复/);
  const store = createStore(storage), previous = store.get();
  assert.throws(() => store.replace({ version: 1 })); assert.equal(store.get(), previous);
  assert.throws(() => parseSave('x'.repeat(200001)));
});
test('blocked browser storage permits play and export without erasing V1 keys', () => {
  const storage = { getItem() { throw new Error('Blocked'); }, setItem() { throw new Error('Blocked'); } };
  const store = createStore(storage); store.dispatch({ type: 'start' }); store.dispatch({ type: 'pickup', id: 'bookmark' });
  assert.equal(store.writable(), false); assert.ok(serializable(store.get()).collected.includes('bookmark'));
  const local = memoryStorage(); local.setItem('smallgame:v1', 'keep'); writeSave(local, start());
  assert.equal(local.getItem('smallgame:v1'), 'keep');
});
test('independent sky cape and mask changes survive a save without changing puzzle state', () => {
  let state = start();
  state = reduce(state, { type: 'setting', key: 'skyCapeLeft', value: 'kizuna' });
  state = reduce(state, { type: 'setting', key: 'skyMask', value: 'innocence' });
  const restored = parseSave(JSON.stringify(serializable(state)));
  assert.equal(restored.settings.skyCapeLeft, 'kizuna'); assert.equal(restored.settings.skyCapeRight, 'bat'); assert.equal(restored.settings.skyMask, 'innocence');
  assert.deepEqual(restored.progress.cloud, createState().progress.cloud);
});
