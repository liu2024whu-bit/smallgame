export const mod = (value, base) => ((value % base) + base) % base;
export const same = (left, right) => JSON.stringify(left) === JSON.stringify(right);
export const indexIn = (value, count) => Number.isInteger(value) && value >= 0 && value < count;
export const bounded = (list, length, bound) => Array.isArray(list) && list.length === length && list.every(value => indexIn(value, bound));
export const permutation = (list, length) => bounded(list, length, length) && new Set(list).size === length;

export function moveAdjacent(list, index, direction) {
  if (!indexIn(index, list.length) || ![-1, 1].includes(direction)) return list;
  const next = index + direction;
  if (!indexIn(next, list.length)) return list;
  const result = [...list];
  [result[index], result[next]] = [result[next], result[index]];
  return result;
}

export function enumeratePermutations(values) {
  if (!values.length) return [[]];
  return values.flatMap((value, index) => enumeratePermutations(values.filter((_, i) => i !== index)).map(tail => [value, ...tail]));
}
