import { indexIn } from './common.js';

export const PACK_ROWS = 4;
export const PACK_COLS = 5;
export const PIECES = [
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [0, 1], [0, 2], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 0], [0, 1], [1, 1], [1, 2]],
];

// Fixed picture fragments rotate with their piece, independently of placement.
const PRINTS = [[0, 1, 2, 3], [4, 9, 14, 8], [17, 16, 15, 11], [7, 6, 5, 10], [12, 13, 18, 19]];
const PRINT_TURNS = [0, 1, 2, 1, 0];

export function pieceCells(id, turns = 0) {
  let cells = PIECES[id].map(cell => [...cell]);
  for (let i = 0; i < turns; i++) cells = cells.map(([r, c]) => [c, -r]);
  const minRow = Math.min(...cells.map(([r]) => r));
  const minColumn = Math.min(...cells.map(([, c]) => c));
  return cells.map(([r, c]) => [r - minRow, c - minColumn]);
}

export function occupiedCells(placed, skip = -1) {
  return placed.flatMap((position, id) => !position || id === skip ? [] : pieceCells(id, position.turn).map(([r, c]) => [r + position.row, c + position.column]));
}

export function pieceTiles(id, turns = 0) {
  return pieceCells(id, turns).map(([row, column], index) => ({ row, column, print: PRINTS[id][index], turn: (turns - PRINT_TURNS[id] + 4) % 4 }));
}

export function pictureFits(placed) {
  return placed.every((position, id) => position && pieceTiles(id, position.turn).every(tile => tile.turn === 0 && tile.print === (tile.row + position.row) * PACK_COLS + tile.column + position.column));
}

export function fitsPiece(placed, id, position) {
  const others = new Set(occupiedCells(placed, id).map(([r, c]) => r * PACK_COLS + c));
  return pieceCells(id, position.turn).every(([r, c]) => {
    const row = r + position.row;
    const column = c + position.column;
    return indexIn(row, PACK_ROWS) && indexIn(column, PACK_COLS) && !others.has(row * PACK_COLS + column);
  });
}

export const packing = {
  create: () => ({ selected: 0, turn: 0, placed: Array(5).fill(null) }),
  valid(state) {
    return indexIn(state?.selected, 5) && indexIn(state.turn, 4) && Array.isArray(state.placed) && state.placed.length === 5 && state.placed.every((position, id) => position === null || indexIn(position.row, PACK_ROWS) && indexIn(position.column, PACK_COLS) && indexIn(position.turn, 4) && fitsPiece(state.placed, id, position));
  },
  move(state, action) {
    if (action.type === 'unplace' && indexIn(action.id, 5)) return { ...state, selected: action.id, turn: state.placed[action.id]?.turn ?? state.turn, placed: state.placed.map((value, id) => id === action.id ? null : value) };
    if (action.type === 'drop') {
      if (!indexIn(action.id, 5) || !indexIn(action.turn, 4)) return state;
      const position = { row: action.row, column: action.column, turn: action.turn };
      if (!indexIn(position.row, PACK_ROWS) || !indexIn(position.column, PACK_COLS) || !fitsPiece(state.placed, action.id, position)) return state;
      return { ...state, selected: action.id, turn: action.turn, placed: state.placed.map((value, id) => id === action.id ? position : value) };
    }
    if (action.type === 'select' && indexIn(action.index, 5)) return { ...state, selected: action.index, turn: state.placed[action.index]?.turn ?? 0 };
    if (action.type === 'rotate') return { ...state, turn: (state.turn + 1) % 4 };
    if (action.type === 'remove') return { ...state, placed: state.placed.map((v, i) => i === state.selected ? null : v) };
    if (action.type !== 'cell' || !indexIn(action.index, PACK_ROWS * PACK_COLS)) return state;
    const position = { row: Math.floor(action.index / PACK_COLS), column: action.index % PACK_COLS, turn: state.turn };
    if (!fitsPiece(state.placed, state.selected, position)) return state;
    return { ...state, placed: state.placed.map((v, i) => i === state.selected ? position : v) };
  },
  solved: state => state.placed.every(Boolean) && occupiedCells(state.placed).length === PACK_ROWS * PACK_COLS && state.placed.every((position, id) => fitsPiece(state.placed, id, position)) && pictureFits(state.placed),
};
