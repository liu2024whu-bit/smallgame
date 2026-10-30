import { bounded, enumeratePermutations, indexIn, moveAdjacent, reorder, permutation, same } from './common.js';
import { PAGE_FACES } from './film.js';
export function pageOrderFits(order) {
  const cloud = order.indexOf(1), rose = order.indexOf(0), star = order.indexOf(3), daisy = order.indexOf(2);
  return rose === cloud + 2 && star === cloud + 1 && daisy > rose;
}
export const PAGE_ORDER = enumeratePermutations([0, 1, 2, 3]).find(pageOrderFits);
export const album = {
  create: () => ({ order: [0, 1, 2, 3], faces: [0, 0, 0, 0] }),
  valid: state => permutation(state?.order, 4) && bounded(state.faces, 4, 2),
  move(state, action) {
    if(action.type==='swap'){
      if(!indexIn(action.from,4)||!indexIn(action.to,4)||action.from===action.to)return state;
      const order=[...state.order];[order[action.from],order[action.to]]=[order[action.to],order[action.from]];
      return {...state,order};
    }
    if (action.type === 'reorder') return { ...state, order: reorder(state.order, action.from, action.to) };
    if (action.type === 'shift') return { ...state, order: moveAdjacent(state.order, action.index, action.direction) };
    if (action.type === 'flip' && indexIn(action.index, 4)) return { ...state, faces: state.faces.map((v, i) => i === action.index ? 1 - v : v) };
    return state;
  },
  solved: state => pageOrderFits(state.order) && same(state.faces, PAGE_FACES),
};
