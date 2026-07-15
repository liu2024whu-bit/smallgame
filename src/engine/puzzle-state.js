const initialState = {
  version: 1,
  chapter: 'birth',
  solved: [],
  inventory: [],
  memories: [],
};

export function createState() {
  return structuredClone(initialState);
}

export function unlock(state, id) {
  if (!state.solved.includes(id)) {
    state.solved.push(id);
  }
  return state;
}
