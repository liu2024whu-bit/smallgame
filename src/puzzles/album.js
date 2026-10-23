import { bounded, enumeratePermutations, indexIn, moveAdjacent, reorder, permutation, same } from './common.js';
import { PAGE_FACES } from './film.js';

export const PAGE_MARKS = ['rose', 'cloud', 'daisy', 'star'];
export function pageOrderFits(order) {
  const cloud = order.indexOf(1), rose = order.indexOf(0), star = order.indexOf(3), daisy = order.indexOf(2);
  return rose === cloud + 2 && star === cloud + 1 && daisy > rose;
}
export const PAGE_ORDER = enumeratePermutations([0, 1, 2, 3]).find(pageOrderFits);
export const album = {
  create: () => ({ order: [0, 1, 2, 3], faces: [0, 0, 0, 0] }),
  valid: state => permutation(state?.order, 4) && bounded(state.faces, 4, 2),
  move(state, action) {
    if (action.type === 'reorder') return { ...state, order: reorder(state.order, action.from, action.to) };
    if (action.type === 'shift') return { ...state, order: moveAdjacent(state.order, action.index, action.direction) };
    if (action.type === 'flip' && indexIn(action.index, 4)) return { ...state, faces: state.faces.map((v, i) => i === action.index ? 1 - v : v) };
    return state;
  },
  solved: state => pageOrderFits(state.order) && same(state.faces, PAGE_FACES),
};

export function validStitch(path) {
  if (path.length !== 8 || path[0] !== 0 || path.at(-1) !== 7) return false;
  return path.slice(1).every((node, i) => {
    const previous = path[i];
    if (i % 2 === 0) return previous < 4 && node === previous + 4;
    return previous >= 4 && node === previous - 3;
  });
}

export const stitch = {
  create: () => ({ path: [] }),
  valid: state => Array.isArray(state?.path) && state.path.length <= 8 && state.path.every(v => indexIn(v, 8)) && new Set(state.path).size === state.path.length,
  move(state, action) {
    if (action.type === 'undo') return { path: state.path.slice(0, -1) };
    if (action.type === 'trace') {
      if (!Array.isArray(action.nodes) || !action.nodes.length || action.nodes.length > 8) return state;
      let next = state;
      for (const index of action.nodes) { const step = stitch.move(next,{type:'hole',index}); if (step === next) return state; next = step; }
      return next;
    }
    if (action.type !== 'hole' || !indexIn(action.index, 8) || state.path.includes(action.index)) return state;
    if (!state.path.length && action.index !== 0) return state;
    return { path: [...state.path, action.index] };
  },
  solved: state => validStitch(state.path),
};
