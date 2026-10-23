import { RULES } from '../src/puzzles/index.js';

function arrange(seed, goal) {
  const order = [...seed], moves = [];
  for (let i = 0; i < goal.length; i++) {
    let position = order.indexOf(goal[i]);
    while (position > i) {
      moves.push({ type: 'shift', index: position, direction: -1 });
      [order[position - 1], order[position]] = [order[position], order[position - 1]];
      position--;
    }
  }
  return moves;
}
const turns = (seed, goal, count, type = 'turn') => goal.flatMap((value, index) => Array.from({ length: (value - seed[index] + count) % count }, () => ({ type, index, direction: 1 })));
const flip = indexes => indexes.map(index => ({ type: 'flip', index }));
const packing = [];
for (const [id, [row, column, turn]] of [[0, 0, 0], [0, 3, 1], [2, 0, 2], [1, 0, 1], [2, 2, 0]].entries()) {
  packing.push({ type: 'select', index: id }, ...Array.from({ length: turn }, () => ({ type: 'rotate' })), { type: 'cell', index: row * 5 + column });
}

export const WITNESSES = {
  paper: arrange([2, 0, 1], [0, 1, 2]),
  cloud: turns([0, 0, 0], [3, 2, 2], 4),
  calibration: turns([0, 0, 0], [2, 1, 3], 4),
  postbox: [...[1, 0, 2, 9].map((value, index) => ({ type: 'set', index, value })), { type:'submit' }],
  books: arrange([0, 1, 2, 3, 4], [3, 0, 4, 1, 2]),
  screen: flip([0, 2, 3, 6, 8]),
  belt: [...[0, 2, 1, 4, 3, 5, 6].map(index => ({ type: 'node', index })), { type: 'cross' }, { type: 'ratio' }, { type: 'ratio' }],
  film: [...arrange([2, 0, 1], [1, 0, 2]), ...flip([0, 2])],
  flowers: [{ type: 'crank', index: 0 }, { type: 'pin', index: 1 }, { type: 'crank', index: 1 }, { type: 'crank', index: 2 }, { type: 'crank', index: 2 }],
  paperBack: arrange([0, 1, 2, 3, 4], [3, 0, 4, 1, 2]),
  cloudGap: turns([3, 2, 2], [1, 3, 2], 4),
  wordlock: [...'LXYXX'].map(letter => ({ type:'key', value:letter.charCodeAt(0) - 65 })).concat({ type:'submit' }),
  album: [...arrange([0, 1, 2, 3], [1, 3, 0, 2]), ...flip([0, 2])],
  stitch: [0, 4, 1, 5, 2, 6, 3, 7].map(index => ({ type: 'hole', index })),
  maze: turns([3, 4, 0], [0, 0, 2], 6),
  balance: [{ type: 'place', index: 0 }, { type: 'place', index: 3 }, { type: 'place', index: 1 }, { type: 'place', index: 1 }, { type: 'place', index: 2 }, { type: 'place', index: 2 }],
  drawers: [0, 1, 0, 2, 0, 1, 0, 3].map(index => ({ type: 'drawer', index })),
  flips: flip([0, 2, 4, 7]),
  packing,
  melody: turns([2, 2, 2, 2, 2, 2], [0, 2, 1, 3, 2, 0], 5, 'note'),
};
export function solvedProgress(id) { return WITNESSES[id].reduce((state, move) => RULES[id].move(state, move), RULES[id].create()); }
