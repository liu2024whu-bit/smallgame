import { indexIn } from './common.js';

export const PULLEYS = ['摇柄', '张力轮', '左导轮', '挡光轮', '下导轮', '上导轮', '胶片轮'];
export const BELT_EDGES = [[0, 1], [0, 2], [1, 2], [1, 3], [1, 4], [2, 4], [2, 5], [3, 4], [3, 5], [4, 5], [4, 6], [5, 6]];
export const isBeltEdge = (a, b) => BELT_EDGES.some(([x, y]) => x === a && y === b || x === b && y === a);

export const belt = {
  create: () => ({ route: [], crossed: false, ratio: 0 }),
  valid: state => Array.isArray(state?.route) && state.route.length <= 7 && new Set(state.route).size === state.route.length && state.route.every(v => indexIn(v, 7)) && typeof state.crossed === 'boolean' && indexIn(state.ratio, 3),
  move(state, action) {
    if (action.type === 'trace') {
      if (!Array.isArray(action.nodes) || !action.nodes.length || action.nodes.length > 7) return state;
      let next = state;
      for (const index of action.nodes) { const step = belt.move(next,{type:'node',index}); if (step === next) return state; next = step; }
      return next;
    }
    if (action.type === 'undo') return { ...state, route: state.route.slice(0, -1) };
    if (action.type === 'cross') return { ...state, crossed: !state.crossed };
    if (action.type === 'ratio') return { ...state, ratio: (state.ratio + 1) % 3 };
    if (action.type !== 'node' || !indexIn(action.index, 7) || state.route.includes(action.index)) return state;
    if (!state.route.length && action.index !== 0) return state;
    if (state.route.length && !isBeltEdge(state.route.at(-1), action.index)) return state;
    return { ...state, route: [...state.route, action.index] };
  },
  solved({ route, crossed, ratio }) {
    const p = id => route.indexOf(id);
    return route.length === 7 && route[0] === 0 && route.at(-1) === 6 && route.slice(1).every((node, i) => isBeltEdge(route[i], node)) && p(2) < p(1) && p(1) < p(4) && p(4) < p(3) && p(3) < p(5) && crossed && ratio === 2;
  },
};
