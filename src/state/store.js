// Single source of truth for game state.

const initialState = {
  chapter: 'birth-2006',
  completed: [],
  memories: [],
  inventory: [],
  version: 1,
};

let state = structuredClone(initialState);

export function getState() {
  return structuredClone(state);
}

export function updateState(patch) {
  state = { ...state, ...patch };
  return getState();
}

export function completeChapter(id) {
  if (!state.completed.includes(id)) {
    state.completed = [...state.completed, id];
  }
  return getState();
}

export function resetState() {
  state = structuredClone(initialState);
  return getState();
}
