import { READING } from './memories.js';

export const MEMORY_IDS = ['sky', 'naruto', 'hashira', 'genshin', 'hei', 'prince', 'cities'];
export const ACTIVITY_IDS = Object.freeze([
  'pet:cat', 'pet:dog', 'art:color', 'cinema:play',
  ...[0, 1, 2].map(index => `art:detail:${index}`),
  ...['rose', 'daisy', 'tulip', 'lavender'].map(id => `flower:${id}`),
  ...READING.map((_, index) => `reading:${index}`),
  ...MEMORY_IDS.map(id => `memory:${id}`),
]);

export const ACHIEVEMENTS = Object.freeze([
  { id: 'pets', title: '都摸摸', text: '猫和狗都醒过一小会儿。', keys: ['pet:cat', 'pet:dog'], motif: 'paw' },
  { id: 'flowers', title: '一小束', text: '四朵花，各有一句祝福。', keys: ['rose', 'daisy', 'tulip', 'lavender'].map(id => `flower:${id}`), motif: 'daisy' },
  { id: 'reading', title: '下一本', text: '推荐过的名字，都翻到了。', keys: READING.map((_, index) => `reading:${index}`), motif: 'book' },
  { id: 'sketch', title: '添点颜色', text: '画里有了颜色。', keys: ['art:color'], motif: 'leaf' },
  { id: 'details', title: '画出来的', text: '稿本、明信片，还有挂件。', keys: [0, 1, 2].map(index => `art:detail:${index}`), motif: 'envelope' },
  { id: 'cinema', title: '再放一遍', text: '灯暗下来，电影开场。', keys: ['cinema:play'], motif: 'moon' },
  { id: 'memories', title: '翻到这里', text: '那些喜欢的，都在。', keys: MEMORY_IDS.map(id => `memory:${id}`), motif: 'cloud' },
  { id: 'keepsakes', title: '好好留着', text: '送过的小东西，收进盒子里。', total: 14, motif: 'rose' },
]);
