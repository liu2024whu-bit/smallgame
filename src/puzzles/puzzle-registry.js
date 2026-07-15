export const PUZZLE_REGISTRY = Object.freeze([
  { id: 'birth-2006', chapter: '初三', reward: '2006' },
  { id: 'sky-map', chapter: '初三', reward: 'memory-star' },
  { id: 'breathing', chapter: '大一', reward: 'birthday-word' },
  { id: 'film-104', chapter: '大二', reward: 'LXY' },
  { id: 'university-post', chapter: '大三', reward: '1029' },
  { id: 'ring-20', chapter: '终章', reward: '20' },
]);

export function getPuzzle(id) {
  return PUZZLE_REGISTRY.find((item) => item.id === id) ?? null;
}
