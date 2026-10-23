import { READING } from './memories.js';
import { EVIDENCE_IDS } from './ciphers.js';

export const MEMORY_IDS = ['sky', 'naruto', 'hashira', 'genshin', 'hei', 'prince', 'cities'];
export const ACTIVITY_IDS = Object.freeze([
  'pet:cat', 'pet:dog', 'art:color', 'cinema:play',
  'birthday:fries', 'birthday:unwrap',
  ...EVIDENCE_IDS.map(id => `evidence:${id}`),
  'campus:whu', 'campus:nju',
  'campus:duxia', 'campus:plum',
  'campus:desk',
  ...[0, 1, 2].map(index => `art:detail:${index}`),
  ...['rose', 'daisy', 'tulip', 'lavender'].map(id => `flower:${id}`),
  ...READING.map((_, index) => `reading:${index}`),
  ...MEMORY_IDS.map(id => `memory:${id}`),
]);

export const ACHIEVEMENTS = Object.freeze([
  {id:'party',title:'偷偷准备的',intro:'一点甜，一点小心思。',hint:'准备台的两边，都还留着小机关。',text:'生日匣也打开了。',puzzles:['sweets','ribbons','birthdayLock'],motif:'star'},
  { id:'xianlin', title:'课本之外', intro:'书看到这儿，窗外也刚好有光。', hint:'仙林的折页里，还夹着一张拓纸。', text:'窗边多了一张拓印。', keys:['campus:duxia','campus:plum','campus:desk'], motif:'leaf' },
  { id:'campuses', title:'两枚邮戳', intro:'纸上也能逛校园。', hint:'两张折页里，还有地方没走到。', text:'两张折页，都盖好印了。', keys:['campus:whu','campus:nju'], motif:'envelope' },
  { id:'pets', title:'毛茸茸的', intro:'解谜先歇会儿？这边有毛茸茸的。', hint:'屋里还睡着另一只。', text:'猫和狗都醒过一小会儿。', keys:['pet:cat','pet:dog'], motif:'paw' },
  { id:'flowers', title:'一小束', intro:'每朵花，都有一句祝福。', hint:'还可以换一朵看看。', text:'四朵花，都挑过了。', keys:['rose','daisy','tulip','lavender'].map(id=>`flower:${id}`), motif:'daisy' },
  { id:'reading', title:'下一本', intro:'你推荐的，留着慢慢看。', hint:'书脊上还有没翻开的名字。', text:'书和电影的名字，都翻到了。', keys:READING.map((_,index)=>`reading:${index}`), motif:'book' },
  { id:'sketch', title:'添点颜色', intro:'这张画，还差一点颜色。', hint:'铅笔就搁在画边呢。', text:'画里有了颜色。', keys:['art:color'], motif:'leaf' },
  { id:'details', title:'画出来的', intro:'从纸上，变成拿在手里的东西。', hint:'画稿旁边，还有几样。', text:'稿本、明信片，还有挂件。', keys:[0,1,2].map(index=>`art:detail:${index}`), motif:'envelope' },
  { id:'cinema', title:'再放一遍', intro:'灯暗下来，电影就要开场。', hint:'票夹里留着那一晚。', text:'又看了一小段。', keys:['cinema:play'], motif:'moon' },
  { id:'memories', title:'翻到这里', intro:'那些喜欢的，偶尔也会换一换。', hint:'柜子和窗边，好像还有没翻开的。', text:'熟悉的身影，都见到了。', keys:MEMORY_IDS.map(id=>`memory:${id}`), motif:'cloud' },
  { id:'keepsakes', title:'一直留着', intro:'有些小东西，一直在。', hint:'还有几样，藏在这些小机关里。', text:'都收进盒子里了。', total:14, motif:'rose', hideCount:true },
  { id:'birthday', title:'留给今天', intro:'有脆脆的，也有软乎乎的。', hint:'蛋糕旁边，还有一份等着拆。', text:'薯条和小兔，都在这里。', keys:['birthday:fries','birthday:unwrap'], motif:'star' },
]);
