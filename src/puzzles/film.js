import { bounded, indexIn, moveAdjacent, permutation, same } from './common.js';

export const FILM_ORDER = [1, 0, 2];
export const PAGE_FACES = [1, 0, 1, 0];
export const film = {
  create: () => ({ order: [2, 0, 1], faces: [0, 0, 0, 0], frame: 0 }),
  valid: state => permutation(state?.order, 3) && bounded(state.faces, 4, 2) && indexIn(state.frame, 3),
  move(state, action) {
    if (action.type === 'shift') return { ...state, order: moveAdjacent(state.order, action.index, action.direction) };
    if (action.type === 'frame') return { ...state, frame: (state.frame + 1) % 3 };
    if (action.type === 'flip' && indexIn(action.index, 4)) return { ...state, faces: state.faces.map((v, i) => i === action.index ? 1 - v : v) };
    return state;
  },
  solved: state => same(state.order, FILM_ORDER) && same(state.faces, PAGE_FACES),
};
