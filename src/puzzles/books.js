import { moveAdjacent, permutation } from './common.js';

export const BOOKS = ['绿山墙的安妮', '杀死一只知更鸟', '白夜行', '傲慢与偏见', '小王子'];
export const BOOK_CLUES = [
  '《小王子》不在两端。',
  '《安妮》与《白夜行》中间隔着两本。安妮在左。',
  '《知更鸟》紧接在《小王子》右边。',
  '《傲慢与偏见》在《安妮》左边。',
];

export function booksFit(order) {
  const position = id => order.indexOf(id);
  return position(4) > 0 && position(4) < 4 && position(2) - position(0) === 3 && position(1) === position(4) + 1 && position(3) < position(0);
}

export const books = {
  create: () => ({ order: [0, 1, 2, 3, 4] }),
  valid: state => permutation(state?.order, 5),
  move: (state, action) => action.type === 'shift' ? { order: moveAdjacent(state.order, action.index, action.direction) } : state,
  solved: state => booksFit(state.order),
};
