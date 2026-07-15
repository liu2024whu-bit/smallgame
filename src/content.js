export const STORY = Object.freeze({
  version: '1.0.0',
  title: '写给第20圈的无地址信',
  shortTitle: '第20圈',
  subtitle: '从初三到大三，有些普通日子值得绕一点路再抵达。',
  recipient: Object.freeze({ initials: 'LXY', birthYear: 2006, birthday: '10月29日', age: 20 }),
  opening: Object.freeze([
    '桌上放着一封没有写地址的信，旁边是一册只装订到第十九页的记忆簿。',
    '它不要求你证明任何关系，只邀请你把散落在不同年份里的细节，重新放回原来的位置。',
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
    id: 'birth', order: 0, period: '序章', title: '高处与地面的两张吊牌', motif: '猫与狗', reward: '2006', flower: '雏菊',
    summary: '站得更高的先读。两张吊牌属于同一行。',
    hints: Object.freeze([
      '先分别调查猫和狗。它们所在的高度决定读取顺序。',
      '罗马数字按数值读取，空心圆不是字母。',
      '猫的“Ⅱ ○”在前，狗的“○ Ⅵ”在后，空心圆代表0。',
    ]),
  }),
  Object.freeze({
    id: 'stars', order: 1, period: '初三', title: '星光落在玫瑰以前', motif: '光遇、小王子与玫瑰', reward: '2020', flower: '樱花',
    summary: '四枚星章没有年份，却记得第一次相识的排列。',
    hints: Object.freeze([
      '玫瑰最后被玻璃罩保护；樱花在玫瑰之前。',
      '巫师帽在最前，光环紧跟在它后面。',
      '正确顺序是巫师帽、光环、樱花、玫瑰；读取星点数得到2020。',
    ]),
  }),
  Object.freeze({
    id: 'wind', order: 2, period: '高中', title: '风停在少年肩上', motif: '魈与流浪者的抽象风纹', reward: 'EAST', flower: '向日葵',
    summary: '四个风轮不画角色，只留下长枪、斗笠、羽毛与旧铃。',
    hints: Object.freeze([
      '上一章的年份不是答案，而是四个风轮各自的转动次数。',
      '把2020拆成2、0、2、0。',
      '四个窗口依次显示E、A、S、T。',
    ]),
  }),
  Object.freeze({
    id: 'breath', order: 3, period: '大一', title: '呼吸留下的颜色', motif: '水、风、蛇与紫藤', reward: 'BIRTHDAY', flower: '紫藤',
    summary: '四条呼吸纹路必须按关系排好，再朝东方读取。',
    hints: Object.freeze([
      '水纹在风痕之前；蛇线必须紧贴紫藤左边。',
      '风痕不在最后。上一章给出的EAST表示从左向右读取。',
      '顺序是水纹、风痕、蛇线、紫藤；字片组成BIRTHDAY。',
    ]),
  }),
  Object.freeze({
    id: 'film', order: 4, period: '大二', title: '104号底片', motif: '她的作品、带土、卡卡西与猫', reward: 'LXY', flower: '勿忘我',
    summary: '“104”不是直接密码，而是三次观察动作。',
    hints: Object.freeze([
      '1、0、4分别对应第一处红色、一次负片翻转、第四只猫。',
      '先在双人作品中找中央红色焦点，再翻转钥匙扣设计稿。',
      '最后按左上到右下的顺序选择第4只猫，得到L、X、Y。',
    ]),
  }),
  Object.freeze({
    id: 'cities', order: 5, period: '大三', title: '两座城市之间', motif: '武汉大学与南京大学', reward: '1029', flower: '桂花',
    summary: '两枚邮戳隔着红线相望，数字藏在植物朝向里。',
    hints: Object.freeze([
      '武汉邮戳的樱花应朝东，南京邮戳的梧桐应朝西。',
      '方向来自高中章节得到的EAST。',
      '对齐后武汉花窗显示10，南京花窗显示29。',
    ]),
  }),
  Object.freeze({
    id: 'rings', order: 6, period: '终章', title: '第20圈闭合以前', motif: '树根、枝条与树冠', reward: '20', flower: '桔梗',
    summary: '把三个年份放回树的不同位置，再计算两段距离。',
    hints: Object.freeze([
      '出生属于树根，相识属于枝条，现在属于树冠。',
      '先算2020−2006，再算2026−2020。',
      '14与6合在一起，正好是20。',
    ]),
  }),
  Object.freeze({
    id: 'gift', order: 7, period: '00:00', title: '封好的生日礼物', motif: '全部线索回收', reward: '祝福信', flower: '玫瑰',
    summary: '不再猜新答案，只把确认过的线索放回正确顺序。',
    hints: Object.freeze([
      '数字缎带由出生年份尾两位、月日和年龄组成。',
      '06 + 1029 + 20。',
      '最终填写06102920、LXY、BIRTHDAY。',
    ]),
  }),
]);

export const FUTURE_SLOTS = Object.freeze([
  Object.freeze({ id: 'photo', title: '相片枝条', note: '预留给真实照片、局部观察或遮罩拼图。' }),
  Object.freeze({ id: 'voice', title: '声音枝条', note: '预留给语音、节奏、波形或摩斯密码。' }),
  Object.freeze({ id: 'next-ring', title: '下一圈', note: '以后只需追加配置，不必推翻当前主线。' }),
]);

export const NOTEBOOK = Object.freeze({
  orange: Object.freeze(['spiral', 'clock', 'promise', 'mask']),
  silver: Object.freeze(['eye', 'lightning', 'page', 'paw']),
  tokens: Object.freeze({
    spiral: '橙色旋涡', clock: '迟到的钟', promise: '约定', mask: '面具',
    eye: '遮住的眼', lightning: '银色雷光', page: '旧书页', paw: '忍犬脚印',
  }),
});
