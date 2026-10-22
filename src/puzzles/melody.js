import { bounded, indexIn, mod } from './common.js';

export const MELODY_TARGET = [0, 2, 1, 3, 2, 0];
export const melody = {
  create: () => ({ notes: [2, 2, 2, 2, 2, 2] }),
  valid: state => bounded(state?.notes, 6, 5),
  move: (state, action) => action.type === 'note' && indexIn(action.index, 6) && [-1, 1].includes(action.direction) ? { notes: state.notes.map((v, i) => i === action.index ? mod(v + action.direction, 5) : v) } : state,
  solved: state => state.notes[0] === 0 && state.notes[1] === state.notes[0] + 2 && state.notes[2] === state.notes[1] - 1 && state.notes[3] === state.notes[1] + 1 && state.notes[4] === state.notes[3] - 1 && state.notes[5] === state.notes[0],
};
