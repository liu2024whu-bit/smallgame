export const SCENE_ART = Object.freeze({
  desk: 'assets/scenes/desk.webp',
  window: 'assets/scenes/window.webp',
  collection: 'assets/scenes/collection.webp',
  entry: 'assets/scenes/entry.webp',
});
export const ASSETS = Object.freeze({
  items: 'assets/illustrations/items.webp',
  motifs: 'assets/illustrations/motifs.webp',
  board: 'assets/illustrations/board.webp',
  skyBat: 'assets/illustrations/sky-bat.webp',
  skyKizuna: 'assets/illustrations/sky-kizuna.webp',
  skyBatInnocence: 'assets/illustrations/sky-bat-innocence.webp',
  skyKizunaInnocence: 'assets/illustrations/sky-kizuna-innocence.webp',
  pets: 'assets/illustrations/pets.webp',
  genshin: 'assets/illustrations/genshin.webp',
  hashira: 'assets/illustrations/hashira.webp',
  princeHei: 'assets/illustrations/prince-hei.webp',
  naruto: 'assets/illustrations/naruto.webp',
  hei2: 'assets/illustrations/hei2.webp',
  campuses: 'assets/illustrations/campuses.webp',
  gifts: 'assets/illustrations/gifts.webp',
});
export const MOTIFS = Object.freeze({ cloud: 0, star: 1, leaf: 2, rose: 3, paw: 4, moon: 5, daisy: 6, tulip: 7, lavender: 8, book: 9, envelope: 10, petal: 11 });
export const STAMP_MOTIFS = ['leaf', 'moon', 'star', 'rose', 'cloud'];

export const COLLECTIONS = Object.freeze({
  sky: { title: '一起经过云间', asset: 'skyBat', columns: 2, rows: 2, names: ['巫师帽', '正太', '正太', '樱花'], text: '巫师帽＋正太，正太＋樱花。两组熟悉的身影，仍然可以穿同样的斗篷。' },
  naruto: { title: '带土与卡卡西', asset: 'naruto', columns: 2, rows: 2, names: ['少年带土', '少年卡卡西', '带土', '卡卡西'], text: '喜欢的故事，值得被认真画下来。这里为漫画、明信片和挂件留了位置。' },
  hashira: { title: '九位柱的折屏', asset: 'hashira', columns: 3, rows: 3, names: ['富冈义勇', '胡蝶忍', '炼狱杏寿郎', '宇髄天元', '时透无一郎', '甘露寺蜜璃', '伊黑小芭内', '不死川实弥', '悲鸣屿行冥'], text: '大一、大二初期喜欢的故事。折屏的线路可以单独推理，不需要记角色知识。' },
  genshin: { title: '风经过的地方', asset: 'genshin', columns: 2, rows: 1, names: ['魈', '流浪者'], text: '高中喜欢过的两位角色。画页上的风，也可以继续吹到后来。' },
  hei: { title: '罗小黑战记Ⅱ', asset: 'hei2', columns: 3, rows: 2, names: ['小黑', '无限', '鹿野', '哪吒', '小黑与黑咻', '师徒同行'], text: '小黑、无限、鹿野、哪吒，还有会一起出发的故事。那次电影，是你喊我去看的，妹妹也一起。' },
  prince: { title: '小王子与玫瑰', asset: 'princeHei', columns: 2, rows: 2, names: ['小王子', '玫瑰', '小黑', '无限与小黑'], text: '送过小王子的书和画，也收到过小王子的笔记本与语录。有些喜欢，是会反复出现在礼物里的。' },
  cities: { title: '两座很好的城市', asset: 'campuses', columns: 2, rows: 1, names: ['武汉大学', '南京大学'], text: '武大的明信片与木书签，记得的是当时的愿望。南京大学留作一处喜欢的校园意象；大学的两次南京之行，也各有自己的记忆。' },
  gifts: { title: '一些收到过的礼物', asset: 'gifts', columns: 3, rows: 2, names: ['武大木书签', '武汉城市金属书签', '小王子笔记本', '白色小挂件', '四阶魔方', '放进书房的木书签'], text: '收到你送的礼物，就会很开心。这些只是其中的一小部分。纸套和刻线，是这间解谜书房加上的小机关。' },
});
