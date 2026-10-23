import { bounded, indexIn, mod, same } from './common.js';
import { FILM_ORDER, filmHeights } from './film.js';

export const FLOWER_LINKS = [[0, 1], [1, 2], [0, 2]];
export const FLOWER_TARGET = filmHeights(FILM_ORDER);
export const flowers = {
  create: () => ({ heights: [0, 1, 2], pin: -1 }),
  valid: state => bounded(state?.heights, 3, 4) && Number.isInteger(state.pin) && state.pin >= -1 && state.pin < 3,
  move(state, action) {
    if (action.type === 'set-pin' && Number.isInteger(action.index) && action.index >= -1 && action.index < 3) return { ...state,pin:action.index };
    if (action.type === 'pin' && indexIn(action.index, 3)) return { ...state, pin: state.pin === action.index ? -1 : action.index };
    if (action.type !== 'crank' || !indexIn(action.index, 3)) return state;
    const heights = state.heights.map((height, i) => FLOWER_LINKS[action.index].includes(i) && i !== state.pin ? mod(height + 1, 4) : height);
    return { heights, pin: same(heights, FLOWER_TARGET) ? -1 : state.pin };
  },
  solved: state => same(state.heights, FLOWER_TARGET),
};
