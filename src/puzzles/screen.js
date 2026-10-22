import { bounded, indexIn } from './common.js';

export const HASHIRA = ['富冈义勇', '胡蝶忍', '炼狱杏寿郎', '宇髄天元', '时透无一郎', '甘露寺蜜璃', '伊黑小芭内', '不死川实弥', '悲鸣屿行冥'];
export const PORTS = [
  [[1, 3], [1, 2]], [[2, 0], [2, 3]], [[0, 0], [0, 3]],
  [[3, 0], [3, 1]], [[1, 3], [2, 3]], [[3, 2], [3, 0]],
  [[1, 3], [2, 0]], [[0, 1], [3, 1]], [[1, 2], [1, 0]],
];
export const screenPorts = flips => flips.map((face, index) => PORTS[index][face]);
export const screen = {
  create: () => ({ flips: Array(9).fill(0) }),
  valid: state => bounded(state?.flips, 9, 2),
  move: (state, action) => action.type === 'flip' && indexIn(action.index, 9) ? { flips: state.flips.map((v, i) => i === action.index ? 1 - v : v) } : state,
  solved(state) {
    const ports = screenPorts(state.flips);
    return ports[0][0] === 1 && ports.at(-1)[1] === 0 && ports.slice(1).every((port, i) => ports[i][1] === port[0]);
  },
};
