import { createState, reduce, normalizeState } from './state.js';
import { loadSave, writeSave } from './storage.js';

export function createStore(storage) {
  const loaded = loadSave(storage);
  let state = loaded.state;
  let writable = true;
  const listeners = new Set();
  function update(next,options) {
    if (next === state) return false;
    const previous = state;
    state = next;
    writable = writeSave(storage, state,options);
    for (const listener of listeners) listener(state, previous);
    return true;
  }
  return {
    get: () => state,
    notice: loaded.notice,
    writable: () => writable,
    dispatch: action => update(reduce(state, action)),
    replace: raw => update(normalizeState(raw)),
    restart: () => update({...createState(),settings:{...state.settings}},{fresh:true}),
    subscribe(listener) { listeners.add(listener); return () => listeners.delete(listener); },
  };
}
