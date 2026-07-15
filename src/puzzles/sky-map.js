export const skyMapPuzzle = Object.freeze({
  id: 'sky-map',
  chapter: '高中',
  theme: '风与旅途',
  inputs: ['feather', 'mask', 'wind_direction', 'memory_star'],
  rules: [
    '风向决定读取方向',
    '羽毛数量决定移动步数',
    '面具缺口决定起点'
  ],
  reward: 'EAST'
});
