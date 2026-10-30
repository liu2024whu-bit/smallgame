export const CHOCOLATE_SIZE = 5;
// Row/column runs determine this star uniquely; blank notes are optional.
export const CHOCOLATE_PATTERN = ['00100', '11111', '01110', '01010', '10001'].flatMap(row => [...row].map(Number));
export function runs(line) { return line.join('').split('0').filter(Boolean).map(group => group.length); }
export const CHOCOLATE_ROWS = Array.from({length:5}, (_, row) => runs(CHOCOLATE_PATTERN.slice(row*5,row*5+5)));
export const CHOCOLATE_COLUMNS = Array.from({length:5}, (_, column) => runs(Array.from({length:5},(_,row)=>CHOCOLATE_PATTERN[row*5+column])));
