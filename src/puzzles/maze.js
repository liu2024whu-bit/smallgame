import { bounded, indexIn, mod } from './common.js';

export const RING_ARCS = [
  [[0, 1], [1, 2], [3, 4]],
  [[0, 1], [2, 3], [3, 4], [4, 5]],
  [[0, 1], [1, 2], [2, 3], [4, 5]],
];
export const RING_BRIDGES = [[2, 4], [1, 5]];
export const MAZE_STARS = [8, 17];

export function mazeEdges(turns) {
  const edges = [];
  RING_ARCS.forEach((arcs, ring) => arcs.forEach(([a, b]) => edges.push([ring * 6 + mod(a + turns[ring], 6), ring * 6 + mod(b + turns[ring], 6)])));
  RING_BRIDGES.forEach((angles, ring) => angles.forEach(angle => {
    const position = mod(angle + turns[ring], 6);
    edges.push([ring * 6 + position, (ring + 1) * 6 + position]);
  }));
  return edges;
}

export function mazePath(turns) {
  const edges = mazeEdges(turns);
  function search(path) {
    const node = path.at(-1);
    if (node === 15) return MAZE_STARS.every(star => path.includes(star)) ? path : null;
    for (const edge of edges) {
      const next = edge[0] === node ? edge[1] : edge[1] === node ? edge[0] : -1;
      if (next < 0 || path.includes(next)) continue;
      const found = search([...path, next]);
      if (found) return found;
    }
    return null;
  }
  return search([0]);
}

export const maze = {
  create: () => ({ turns: [3, 4, 0] }),
  valid: state => bounded(state?.turns, 3, 6),
  move(state, action) {
    if (action.type === 'set-turn' && indexIn(action.index, 3) && indexIn(action.value, 6)) return { turns:state.turns.map((v,i) => i === action.index ? action.value : v) };
    return action.type === 'turn' && indexIn(action.index, 3) && [-1,1].includes(action.direction) ? { turns:state.turns.map((v,i) => i === action.index ? mod(v + action.direction,6) : v) } : state;
  },
  solved: state => Boolean(mazePath(state.turns)),
};
