import { bounded, indexIn } from './common.js';

export function flipNeighbors(index) {
  const row = Math.floor(index / 3);
  const column = index % 3;
  return [index, ...(row > 0 ? [index - 3] : []), ...(row < 2 ? [index + 3] : []), ...(column > 0 ? [index - 1] : []), ...(column < 2 ? [index + 1] : [])];
}
export function toggleTiles(tiles, index) {
  const affected = flipNeighbors(index);
  return tiles.map((value, i) => affected.includes(i) ? 1 - value : value);
}
export const FLIP_SEED = [0, 2, 4, 7].reduce(toggleTiles, Array(9).fill(0));
export const flips = {
  create: () => ({ tiles: [...FLIP_SEED] }),
  valid: state => bounded(state?.tiles, 9, 2),
  move: (state, action) => action.type === 'flip' && indexIn(action.index, 9) ? { tiles: toggleTiles(state.tiles, action.index) } : state,
  solved: state => state.tiles.every(value => value === 0),
};
