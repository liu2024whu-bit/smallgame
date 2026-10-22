import { bounded, indexIn } from './common.js';

export const WEIGHTS = [2, 3, 4, 5];
export const WEIGHT_LABELS = ['猫爪', '星星', '花朵', '月亮'];
export function panWeights(places) {
  return [1, 2].map(pan => places.reduce((sum, location, index) => sum + (location === pan ? WEIGHTS[index] : 0), 0));
}
export const balance = {
  create: () => ({ places: [0, 0, 0, 0] }),
  valid: state => bounded(state?.places, 4, 3),
  move: (state, action) => action.type === 'place' && indexIn(action.index, 4) && (action.pan === undefined || indexIn(action.pan, 3)) ? { places: state.places.map((v, i) => i === action.index ? action.pan ?? (v + 1) % 3 : v) } : state,
  solved(state) {
    const [left, right] = panWeights(state.places);
    return state.places.filter(v => v === 1).length === 2 && state.places.filter(v => v === 2).length === 2 && left === right;
  },
};
