import { bounded, indexIn, mod, same } from './common.js';
import { POSTAL_CODE, LETTER_CODE } from '../data/ciphers.js';

function lock(code, count, seed) {
  const size = code.length;
  return {
    create: () => ({ values: Array(size).fill(seed), cursor: 0, attempts: 0, opened: false }),
    valid: state => bounded(state?.values, size, count + (seed === count ? 1 : 0)) && indexIn(state.cursor, size) && Number.isInteger(state.attempts) && state.attempts >= 0 && state.attempts < 100 && typeof state.opened === 'boolean' && (!state.opened || same(state.values, code)),
    move(state, action) {
      if (state.opened) return state;
      if (action.type === 'submit') return { ...state, attempts: (state.attempts + 1) % 100, opened: same(state.values, code) };
      if (action.type === 'cursor' && indexIn(action.index, size)) return { ...state, cursor: action.index };
      if (action.type === 'turn' && indexIn(action.index, size) && [-1, 1].includes(action.direction)) return { ...state, values: state.values.map((value, i) => i === action.index ? mod(value + action.direction, count) : value), cursor: action.index, attempts: 0 };
      if (action.type === 'set' && indexIn(action.index, size) && indexIn(action.value, count)) return { ...state, values: state.values.map((value, i) => i === action.index ? action.value : value), cursor: Math.min(size - 1, action.index + 1), attempts: 0 };
      if (action.type === 'key' && indexIn(action.value, count)) return { ...state, values: state.values.map((value, i) => i === state.cursor ? action.value : value), cursor: Math.min(size - 1, state.cursor + 1), attempts: 0 };
      if (action.type === 'erase') {
        const cursor = state.values[state.cursor] === seed && state.cursor > 0 ? state.cursor - 1 : state.cursor;
        return { ...state, cursor, values: state.values.map((value, i) => i === cursor ? seed : value), attempts: 0 };
      }
      return state;
    },
    solved: state => state.opened && same(state.values, code),
  };
}

export const postbox = lock(POSTAL_CODE, 10, 0);
export const wordlock = lock(LETTER_CODE.map(letter => letter.charCodeAt(0) - 65), 26, 26);
