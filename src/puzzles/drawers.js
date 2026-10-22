import { bounded, indexIn, same } from './common.js';

export const DRAWER_TARGET = [0, 0, 1, 1];
export const DRAWER_CONDITIONS = ['D关着时，A可以移动。', 'A打开时，B可以移动。', 'B开着、A关着时，C可以移动。', 'C开着、B关着时，D可以移动。'];
export function drawerEnabled(open, index) {
  return [!open[3], Boolean(open[0]), Boolean(open[1]) && !open[0], Boolean(open[2]) && !open[1]][index];
}
export const drawers = {
  create: () => ({ open: [0, 0, 0, 0] }),
  valid: state => bounded(state?.open, 4, 2),
  move: (state, action) => action.type === 'drawer' && indexIn(action.index, 4) && drawerEnabled(state.open, action.index) ? { open: state.open.map((v, i) => i === action.index ? 1 - v : v) } : state,
  solved: state => same(state.open, DRAWER_TARGET),
};
