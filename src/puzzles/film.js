import { bounded, indexIn, moveAdjacent, reorder, permutation, same } from './common.js';

export const FILM_ORDER = [1, 0, 2];
export const FRAME_EVENTS = [
  [{ type: 'match', target: 2, source: 0 }],
  [{ type: 'flip', index: 0 }, { type: 'flip', index: 1 }],
  [{ type: 'flip', index: 1 }, { type: 'match', target: 3, source: 1 }],
];
export const FRAME_PERFORATIONS = [2, 3, 1];
export function replayFilm(order) {
  const faces = [0, 0, 0, 0];
  for (const frame of order) for (const event of FRAME_EVENTS[frame]) {
    if (event.type === 'flip') faces[event.index] = 1 - faces[event.index];
    else faces[event.target] = faces[event.source];
  }
  return faces;
}
export const filmHeights = order => order.map(frame => FRAME_PERFORATIONS[frame]);
export const PAGE_FACES = replayFilm(FILM_ORDER);
export const film = {
  create: () => ({ order: [2, 0, 1], faces: [0, 0, 0, 0], frame: 0 }),
  valid: state => permutation(state?.order, 3) && bounded(state.faces, 4, 2) && indexIn(state.frame, 3),
  move(state, action) {
    if (action.type === 'reorder') return { ...state, order: reorder(state.order, action.from, action.to) };
    if (action.type === 'shift') return { ...state, order: moveAdjacent(state.order, action.index, action.direction) };
    if (action.type === 'frame') return { ...state, frame: indexIn(action.index,3) ? action.index : (state.frame + 1) % 3 };
    if (action.type === 'flip' && indexIn(action.index, 4)) return { ...state, faces: state.faces.map((v, i) => i === action.index ? 1 - v : v) };
    return state;
  },
  solved: state => same(state.order, FILM_ORDER) && same(state.faces, PAGE_FACES),
};
