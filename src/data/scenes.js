const puzzle = (id, label, x, y, width, height, extra = {}) => ({ id: `p-${id}`, kind: 'puzzle', target: id, label, x, y, width, height, ...extra });
const inspect = (id, label, target, x, y, width, height) => ({ id, kind: 'collection', target, label, x, y, width, height });

export const SCENES = Object.freeze([
  { id: 'desk', title: '书桌', subtitle: '有些东西，值得慢慢翻开。', hotspots: [
    { id: 'take-bookmark', kind: 'pickup', target: 'bookmark', label: '木书签', x: 60.7, y: 56.4, width: 5.8, height: 6.5, sprite: true },
    { id: 'take-thread', kind: 'pickup', target: 'thread', label: '一卷棉线', x: 55.3, y: 54.3, width: 4.2, height: 6.5, sprite: true },
    puzzle('paper', '往返稿盒', 52.7, 51.8, 12.8, 15, { revisit: 'paperBack', revisitAfter: 'flowers' }),
    puzzle('calibration', '台灯', 62.8, 44.6, 14, 26),
    puzzle('books', '借阅书架', 87.5, 38, 17, 33),
    puzzle('belt', '小放映机', 87.5, 59.7, 14, 18, { revisit: 'film', revisitAfter: 'belt' }),
    { id: 'album-desk', kind: 'album', label: '尚未装订的画册', x: 40.4, y: 56, width: 19, height: 12 },
    inspect('desk-rose', '小王子的玫瑰', 'prince', 24.5, 45, 8, 21),
    { id: 'cat', kind: 'pet', target: 'cat', label: '睡着的小猫', x: 9, y: 82, width: 15, height: 16 },
  ] },
  { id: 'window', title: '窗边', subtitle: '光线换个方向，空白也会说话。', hotspots: [
    puzzle('cloud', '双面云景', 29.5, 55.3, 19, 24, { revisit: 'cloudGap', revisitAfter: 'flowers' }),
    puzzle('flowers', '联动花架', 83.5, 47, 21, 38),
    inspect('window-rose', '玫瑰与玻璃罩', 'prince', 50.5, 55, 10, 23),
    inspect('sky-figures', '云间的两个人', 'sky', 31, 38, 19, 12),
    inspect('postcards', '书里的明信片', 'cities', 63, 64, 16, 11),
  ] },
  { id: 'collection', title: '收藏柜', subtitle: '喜欢的故事，也有自己的位置。', hotspots: [
    puzzle('screen', '九扇人物折屏', 53.5, 57, 22, 19),
    puzzle('maze', '旋转迷宫盒', 69, 58, 8.5, 15),
    puzzle('balance', '平衡摆件', 34, 55, 10, 20),
    puzzle('melody', '钉轮音乐盒', 79, 58, 10, 16),
    inspect('naruto-board', '带土与卡卡西的创作角', 'naruto', 21.4, 34.5, 14, 32),
    inspect('genshin-prints', '魈与流浪者', 'genshin', 61.2, 14, 8, 18),
    inspect('genshin-second', '流浪者与魈的立牌', 'genshin', 83.5, 14, 10, 18),
    inspect('hei-tickets', '罗小黑战记Ⅱ票夹', 'hei', 85.5, 34, 11, 15),
    { id: 'reading-list', kind: 'reading', label: '推荐过的书与电影', x: 54.5, y: 18, width: 10, height: 16 },
    { id: 'interests', kind: 'interests', label: '游戏与小小的日常', x: 87, y: 57, width: 12, height: 16 },
  ] },
  { id: 'entry', title: '门边', subtitle: '先坐一会儿，生日还很长。', hotspots: [
    puzzle('packing', '异形木拼框', 60, 72, 9, 10),
    puzzle('flips', '联动翻片盒', 70, 72, 8, 11),
    puzzle('drawers', '互锁抽屉', 80.5, 72, 8, 11),
    { id: 'ring-lamp', kind: 'ending', label: '年轮灯', x: 60, y: 44, width: 15, height: 26 },
    { id: 'dog', kind: 'pet', target: 'dog', label: '打盹的小狗', x: 39.5, y: 76, width: 21, height: 18 },
    { id: 'birthday-gift', kind: 'birthday', label: '10月29日的小礼物', x: 74, y: 50, width: 10, height: 11 },
  ] },
]);

export const SCENE_BY_ID = Object.freeze(Object.fromEntries(SCENES.map(scene => [scene.id, scene])));
