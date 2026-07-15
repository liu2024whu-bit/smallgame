const STORAGE_KEY = 'smallgame.addressless-letter.v1';

const DEFAULT_STATE = Object.freeze({
  version: 1,
  active: 'birth',
  solved: Object.freeze({}),
  discoveries: Object.freeze({ cat: false, dog: false }),
  starOrder: Object.freeze(['rose', 'hat', 'blossom', 'halo']),
  windClues: Object.freeze([false, false, false, false]),
  windRotations: Object.freeze([0, 0, 0, 0]),
  breathOrder: Object.freeze(['wisteria', 'water', 'serpent', 'wind']),
  filmSteps: Object.freeze({ red: false, invert: false, cat: false }),
  postmarks: Object.freeze({ wuhan: 0, nanjing: 0 }),
  rings: Object.freeze({ root: '', branch: '', crown: '' }),
  notebook: Object.freeze({ orange: ['clock', 'mask', 'spiral', 'promise'], silver: ['page', 'eye', 'paw', 'lightning'] }),
  notebookSolved: false,
  hintLevels: Object.freeze({}),
  ending: null,
  sound: true,
});

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function storageGet(key) { try { return localStorage.getItem(key); } catch { return null; } }
function storageSet(key, value) { try { localStorage.setItem(key, value); } catch { /* storage can be blocked */ } }
function storageRemove(key) { try { localStorage.removeItem(key); } catch { /* storage can be blocked */ } }

function hydrate() {
  const fallback = clone(DEFAULT_STATE);
  try {
    const parsed = JSON.parse(storageGet(STORAGE_KEY) || 'null');
    if (!parsed || parsed.version !== 1) return fallback;
    return {
      ...fallback,
      ...parsed,
      solved: { ...fallback.solved, ...(parsed.solved ?? {}) },
      discoveries: { ...fallback.discoveries, ...(parsed.discoveries ?? {}) },
      windClues: Array.isArray(parsed.windClues) && parsed.windClues.length === 4 ? parsed.windClues.map(Boolean) : fallback.windClues,
      windRotations: Array.isArray(parsed.windRotations) && parsed.windRotations.length === 4 ? parsed.windRotations : fallback.windRotations,
      breathOrder: Array.isArray(parsed.breathOrder) ? parsed.breathOrder : fallback.breathOrder,
      starOrder: Array.isArray(parsed.starOrder) ? parsed.starOrder : fallback.starOrder,
      filmSteps: { ...fallback.filmSteps, ...(parsed.filmSteps ?? {}) },
      postmarks: { ...fallback.postmarks, ...(parsed.postmarks ?? {}) },
      rings: { ...fallback.rings, ...(parsed.rings ?? {}) },
      notebook: { ...fallback.notebook, ...(parsed.notebook ?? {}) },
      hintLevels: { ...fallback.hintLevels, ...(parsed.hintLevels ?? {}) },
    };
  } catch { return fallback; }
}

export function createStore() {
  let state = hydrate();
  const subscribers = new Set();
  function save() { storageSet(STORAGE_KEY, JSON.stringify(state)); }
  function emit() { save(); subscribers.forEach((fn) => fn(clone(state))); }
  return Object.freeze({
    get: () => clone(state),
    set(patch) { state = { ...state, ...patch }; emit(); },
    update(mutator) { const draft = clone(state); state = mutator(draft) || draft; emit(); },
    solve(id) { state = { ...state, solved: { ...state.solved, [id]: true } }; emit(); },
    subscribe(fn) { subscribers.add(fn); return () => subscribers.delete(fn); },
    reset() { state = clone(DEFAULT_STATE); storageRemove(STORAGE_KEY); emit(); },
  });
}
