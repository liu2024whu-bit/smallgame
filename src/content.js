export const STORY = Object.freeze({
  version: '1.1.0',
  title: '写给第20圈的无地址信',
  shortTitle: '第20圈',
  subtitle: '从初三到大三，有些普通日子值得绕一点路再抵达。',
  recipient: Object.freeze({ initials: 'LXY', birthYear: 2006, birthday: '10月29日', age: 20 }),
  opening: Object.freeze([
    '桌上放着一封没有写地址的信，旁边是一册只装订到第十九页的记忆簿。',
    '散落的照片来自不同年份，背面留下的字、方向和缺口，似乎都在指向同一件礼物。',
    '猫守着高处，狗伏在桌边。一根很细的红线，从初三一直穿过今天。',
  ]),
  finalLetter: Object.freeze([
    'LXY：',
    '我把一些年份藏成机关，不是因为回忆需要被证明，只是觉得，值得记住的东西，不必总放在最显眼的位置。',
    '从初三到大三，时间把许多事情改了名字。那些没有被写进卡片的普通日子，也没有因此变得不重要。',
    '武汉的樱花与南京的梧桐之间，隔着各自正在发生的生活。它们不必被画成同一条路；回头时仍能认出一起见过的星光，就已经很好。',
    '二十岁不是答案，只是新一页的页码。愿你继续画喜欢的东西，遇见温柔的风，照顾好猫狗，也允许未来保留尚未完成的空白。',
    '生日快乐。愿新的年轮，向你自己选择的方向生长。',
  ]),
  signature: '—— 一个从初三认识你、一直记得1029的朋友',
});

export const CHAPTERS = Object.freeze([
  Object.freeze({
    id: 'birth', order: 0, period: '序章', title: '高处与地面的两张吊牌', motif: '窗边的猫 · 桌旁的小狗', reward: '2006', flower: '雏菊',
    summary: '两张吊牌被分开保存，读法藏在它们所在的位置里。',
    hints: Object.freeze([
      '先分别调查窗边和桌边，注意谁的位置更高。',
      '吊牌上的罗马数字按数值读取，空心圆留下的是数字空位。',
      '先读高处的“Ⅱ ○”，再读地面的“○ Ⅵ”。',
    ]),
  }),
  Object.freeze({
    id: 'stars', order: 1, period: '初三', title: '星光落在玫瑰以前', motif: '巫师帽 · 短发光环 · 樱花 · 玫瑰', reward: '2020', flower: '樱花',
    summary: '四张照片背面的星点，记着第一次相识的年份。',
    hints: Object.freeze([
      '照片不是按颜色排序。先寻找文字中明确的先后与相邻关系。',
      '帽檐最早出现，光环紧随其后；樱花在玫瑰之前。',
      '顺序为巫师帽、短发光环、樱花、玫瑰。',
    ]),
  }),
  Object.freeze({
    id: 'wind', order: 2, period: '高中', title: '风停在少年肩上', motif: '魈 · 流浪者 · 四扇风窗', reward: 'EAST', flower: '向日葵',
    summary: '两张角色立绘之间有四枚转盘，上一页的年份决定各自转动的距离。',
    hints: Object.freeze([
      '转盘旁没有新的四位数，只有上一页留下的年份。',
      '把2020看成四个独立的步数，而不是一次计算。',
      '四枚转盘依次转2、0、2、0格。',
    ]),
  }),
  Object.freeze({
    id: 'breath', order: 3, period: '大一', title: '呼吸留下的颜色', motif: '富冈义勇 · 不死川实弥 · 伊黑小芭内 · 紫藤', reward: 'BIRTHDAY', flower: '紫藤',
    summary: '四张图背后的字片只有在正确的相邻关系中才会成为一句祝福。',
    hints: Object.freeze([
      '先确定蛇柱与紫藤这组不可拆开的相邻关系。',
      '水柱早于风柱，风柱不能站在最后；高中页给出的方向决定读取端。',
      '顺序为水柱、风柱、蛇柱、紫藤。',
    ]),
  }),
  Object.freeze({
    id: 'film', order: 4, period: '大二', title: '104号底片', motif: '带土与卡卡西 · 钥匙扣 · 猫咪动作稿', reward: 'LXY', flower: '勿忘我',
    summary: '暗房记录里的104被拆成三次观察，答案藏在她自己的画稿里。',
    hints: Object.freeze([
      '把1、0、4看成三个动作，不要直接输入它们。',
      '1指向第一处仍醒着的红色；0意味着一次负片翻转。',
      '最后从左上向右下寻找第四组猫咪动作。',
    ]),
  }),
  Object.freeze({
    id: 'cities', order: 5, period: '大三', title: '两座城市之间', motif: '珞珈樱花 · 南京长路 · 双城邮戳', reward: '1029', flower: '桂花',
    summary: '两张校园照片被红线缝在一起，日期藏在邮戳转向后的花窗里。',
    hints: Object.freeze([
      '高中页得到的英文方向仍在这一页生效。',
      '武汉照片向东，南京照片需要与它相望。',
      '武汉转到东，南京转到西，花窗分别出现10和29。',
    ]),
  }),
  Object.freeze({
    id: 'rings', order: 6, period: '终章', title: '第20圈闭合以前', motif: '真实年轮 · 三张年份卡', reward: '20', flower: '桔梗',
    summary: '出生、相识和现在各有位置，年龄来自两段时间的距离。',
    hints: Object.freeze([
      '出生属于树根，相识属于枝条，现在属于树冠。',
      '先计算相识与出生的距离，再计算现在与相识的距离。',
      '2020−2006＝14，2026−2020＝6。',
    ]),
  }),
  Object.freeze({
    id: 'gift', order: 7, period: '00:00', title: '封好的生日礼物', motif: '花束 · 信封 · 三重锁', reward: '祝福信', flower: '玫瑰',
    summary: '最后一把锁只回收已经确认过的线索。',
    hints: Object.freeze([
      '数字缎带由三段数字依时间顺序缝合。',
      '出生年份只取尾两位，随后放入月日和年龄。',
      '最终填写06102920、LXY、BIRTHDAY。',
    ]),
  }),
]);

export const FUTURE_SLOTS = Object.freeze([
  Object.freeze({ id: 'photo', title: '相片枝条', note: '用于加入真实照片、局部观察、遮罩或拼图。' }),
  Object.freeze({ id: 'voice', title: '声音枝条', note: '用于加入语音、节奏、波形或摩斯密码。' }),
  Object.freeze({ id: 'next-ring', title: '下一圈', note: '以后可以追加新的年份章节，保留现有主线。' }),
]);

export const NOTEBOOK = Object.freeze({
  orange: Object.freeze(['spiral', 'clock', 'promise', 'mask']),
  silver: Object.freeze(['eye', 'lightning', 'page', 'paw']),
  tokens: Object.freeze({
    spiral: '橙色旋涡', clock: '迟到的钟', promise: '约定', mask: '面具',
    eye: '遮住的眼', lightning: '银色雷光', page: '旧书页', paw: '忍犬脚印',
  }),
});
