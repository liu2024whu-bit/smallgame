import { moveAdjacent, reorder, permutation, same } from './common.js';

export const OPERATIONS = ['翻面', '左移一格', '交换第2、4格'];
export const STAMPS = ['叶', '月', '星', '花', '云'];
export const PAPER_SEED = [0, 1, 2, 3, 4];
export const BACK_ORIGINAL = [3, 0, 4, 1, 2];
export const BACK_OPERATIONS = [2, 0, 1];

export function operate(values, operation) {
  const result = [...values];
  if (operation === 0) return result.reverse();
  if (operation === 1) return [...result.slice(1), result[0]];
  if (operation === 2) [result[1], result[3]] = [result[3], result[1]];
  return result;
}

export const applyOperations = (values, operations) => operations.reduce(operate, values);
export const PAPER_TARGET = applyOperations(PAPER_SEED, [0, 1, 2]);
export const BACK_TARGET = applyOperations(BACK_ORIGINAL, BACK_OPERATIONS);

export const paper = {
  create: () => ({ order: [2, 0, 1] }),
  valid: state => permutation(state?.order, 3),
  move: (state, action) => action.type === 'reorder' ? { order: reorder(state.order, action.from, action.to) } : action.type === 'shift' ? { order: moveAdjacent(state.order, action.index, action.direction) } : state,
  solved: state => same(applyOperations(PAPER_SEED, state.order), PAPER_TARGET),
};

export const paperBack = {
  create: () => ({ order: [...PAPER_SEED] }),
  valid: state => permutation(state?.order, 5),
  move: (state, action) => action.type === 'reorder' ? { order: reorder(state.order, action.from, action.to) } : action.type === 'shift' ? { order: moveAdjacent(state.order, action.index, action.direction) } : state,
  solved: state => same(applyOperations(state.order, BACK_OPERATIONS), BACK_TARGET),
};
