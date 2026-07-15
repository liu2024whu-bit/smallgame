export function shiftLetters(value, offset) {
  return value
    .split('')
    .map((char) => {
      const code = char.charCodeAt(0);
      if (code < 65 || code > 90) return char;
      return String.fromCharCode(((code - 65 + offset + 26) % 26) + 65);
    })
    .join('');
}

export function pickByPositions(value, positions) {
  return positions.map((position) => value[position - 1] ?? '').join('');
}

export function rotateArray(items, amount) {
  const size = items.length;
  if (!size) return [];
  const offset = ((amount % size) + size) % size;
  return [...items.slice(offset), ...items.slice(0, offset)];
}
