export const ringPuzzle = Object.freeze({
  id: 'ring-20',
  chapter: '终章',
  theme: '第20圈闭合以前',
  years: {
    root: 2006,
    branch: 2020,
    canopy: 2026
  },
  calculate(first, second) {
    return (second - first) + (2026 - second);
  },
  reward: '20'
});
