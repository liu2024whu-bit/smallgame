/**
 * 这里是初版最重要的“可修改区”。
 * 后续补真实回忆时，优先修改这个文件，不需要改谜题引擎。
 */

export const STORY = Object.freeze({
  title: '1029 · 第20圈年轮',
  shortTitle: '第20圈年轮',
  subtitle: '从初三到大三，一棵树替我们记住时间。',
  recipient: Object.freeze({
    initials: 'LXY',
    displayName: 'LXY',
    birthdayLabel: '10 月 29 日',
    turningAge: 20,
  }),
  senderLine: '—— 一个从初三认识你、一直记得 1029 的朋友',
  intro:
    '这棵树有十九圈完整年轮。第20圈只差最后一小段，而补完它的人，必须先找回日期、名字和一路开过的花。',
  finalLetter: Object.freeze([
    'LXY：',
    '从初三到大三，我们都走了很远。很多细节没有被写进游戏，不是因为它们不重要，而是因为真正属于我们的回忆，不该被一个初版替你定义。',
    '这棵树的前十九圈来自过去，第20圈属于现在，也属于你还没看见的以后。愿你在20岁之后，仍然会遇见鲜花、猫狗、喜欢的故事，也一直有勇气长成自己想成为的人。',
    '生日快乐。愿新的年轮从今天开始，向有光的地方生长。',
  ]),
  futureBuds: Object.freeze(['待续', '待续', '待续']),
});

export const TIMELINE_CARDS = Object.freeze([
  Object.freeze({ id: 'junior3', stage: '初三', flower: '雏菊', glyph: '✿', letter: 'A', note: '故事从还没有把未来想清楚的年纪开始。' }),
  Object.freeze({ id: 'senior1', stage: '高一', flower: '新叶', glyph: '❧', letter: 'L', note: '新的校服、新的日常，旧的称呼还在。' }),
  Object.freeze({ id: 'senior2', stage: '高二', flower: '桔梗', glyph: '♧', letter: 'R', note: '忙碌变多，小事仍值得被分享。' }),
  Object.freeze({ id: 'senior3', stage: '高三', flower: '木棉', glyph: '✣', letter: 'B', note: '各自奔向考场，也记得替对方说一句加油。' }),
  Object.freeze({ id: 'college1', stage: '大一', flower: '勿忘我', glyph: '❉', letter: 'X', note: '城市和生活变远，熟悉没有完全消失。' }),
  Object.freeze({ id: 'college2', stage: '大二', flower: '向日葵', glyph: '☼', letter: 'D', note: '我们渐渐学会，把关心放进普通的问候里。' }),
  Object.freeze({ id: 'college3', stage: '大三', flower: '新芽', glyph: '✦', letter: 'Y', note: '她站在20岁的门口，未来仍有很多空白。' }),
]);

export const FLOWERS = Object.freeze([
  Object.freeze({ id: 'daisy', name: '雏菊', meaning: '初见', glyph: '✿', pair: 'BI' }),
  Object.freeze({ id: 'forget', name: '勿忘我', meaning: '记得', glyph: '❉', pair: 'RT' }),
  Object.freeze({ id: 'sunflower', name: '向日葵', meaning: '向光', glyph: '☼', pair: 'HD' }),
  Object.freeze({ id: 'bellflower', name: '桔梗', meaning: '守约', glyph: '♧', pair: 'AY' }),
  Object.freeze({ id: 'rose', name: '玫瑰', meaning: '祝福', glyph: '❀', pair: '??' }),
]);

export const PUZZLE = Object.freeze({
  rootCode: '1029',
  timelineOrder: Object.freeze(TIMELINE_CARDS.map((card) => card.id)),
  timelineInitialOrder: Object.freeze(['college1', 'senior1', 'college3', 'junior3', 'senior3', 'senior2', 'college2']),
  extractPositions: Object.freeze([2, 5, 7]),
  monogram: STORY.recipient.initials,
  flowerSequence: Object.freeze(['daisy', 'forget', 'sunflower', 'bellflower']),
  age: String(STORY.recipient.turningAge),
  keyword: 'BIRTHDAY',
  gift: Object.freeze({ date: '1029', name: STORY.recipient.initials, age: String(STORY.recipient.turningAge), word: 'BIRTHDAY' }),
  bondAssignments: Object.freeze({ spiral: 'obito', lateClock: 'obito', lightning: 'kakashi', coveredEye: 'kakashi' }),
});

export const BOND_TOKENS = Object.freeze([
  Object.freeze({ id: 'spiral', glyph: '◉', label: '橙色旋涡' }),
  Object.freeze({ id: 'lightning', glyph: 'ϟ', label: '银色雷光' }),
  Object.freeze({ id: 'lateClock', glyph: '◷', label: '迟到的钟' }),
  Object.freeze({ id: 'coveredEye', glyph: '◒', label: '遮住的眼' }),
]);

export const ENDING_COPY = Object.freeze({
  future: Object.freeze({ id: 'future', title: '新芽结局｜向未来生长', body: '你把种子埋在第20圈年轮旁。树没有立刻长高，只在枝头多出三个写着“待续”的花苞。过去被好好记住，未来也没有被提前写完。' }),
  keepsake: Object.freeze({ id: 'keepsake', title: '书页结局｜把花留在今天', body: '你把最后一朵花压进纪念册。它不会永远保持原来的颜色，但每次翻到这一页，仍能知道：在她20岁这一年，有人认真为她准备过一份祝福。' }),
  sideBySide: Object.freeze({ id: 'side-by-side', title: '并肩结局｜不同路，也记得彼此', body: '橙色旋涡与银色雷光落在同一片叶子上。同行不一定意味着永远走同一条路，而是隔着不同的生活，也仍愿意为对方留一盏灯。猫趴在枝头，狗守在树根，第20圈年轮完整闭合。' }),
});
