export const POSTAL_GRID = Object.freeze([[6, 1, 8, 3], [9, 4, 1, 7], [5, 7, 0, 6], [4, 3, 9, 1]]);
export const POSTMARKS = Object.freeze([
  { mark: '桥', row: 3, column: 0, card: 0 },
  { mark: '窗', row: 2, column: 1, card: 0 },
  { mark: '树', row: 0, column: 3, card: 1 },
  { mark: '雨', row: 1, column: 2, card: 1 },
]);
export const POSTAL_ORDER = ['桥', '树', '雨', '窗'];
export const POSTAL_CODE = POSTAL_ORDER.map(mark => { const tag = POSTMARKS.find(p => p.mark === mark); return POSTAL_GRID[tag.row][tag.column]; });

export const LETTER_GRID = ['ABCDE', 'FGHIK', 'LMNOP', 'QRSTU', 'VWXYZ'];
export const COLUMN_STRIP = [3, 5, 3, 3, 3];
export const ROW_STRIP = [4, 4, 3, 5, 5];
export const LETTER_CODE = COLUMN_STRIP.map((column, i) => LETTER_GRID[ROW_STRIP[i] - 1][column - 1]);
export const EVIDENCE_IDS = ['postal', 'alphabet', 'columns', 'rows'];
export const ITEM_EVIDENCE = Object.freeze({ board:'columns' });
export const EVIDENCE_TITLES = { postal: '分拣格', alphabet: '字表', columns: '托板背面', rows: '匣旁薄纸' };
