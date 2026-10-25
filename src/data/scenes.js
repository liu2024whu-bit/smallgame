const puzzle = (id, label, x, y, width, height, extra = {}) => ({ id: `p-${id}`, kind: 'puzzle', target: id, label, x, y, width, height, ...extra });
const inspect = (id, label, target, x, y, width, height) => ({ id, kind: 'collection', target, label, x, y, width, height });

export const SCENES = Object.freeze([
  { id: 'desk', title: '书桌', hotspots: [
    puzzle('calendar','日历',18.3,52.8,6.8,10.8),
    { id: 'take-bookmark', kind: 'pickup', target: 'bookmark', label: '木书签', x: 60.7, y: 56.4, width: 5.8, height: 6.5, sprite: true },
    { id: 'take-thread', kind: 'pickup', target: 'thread', label: '一卷棉线', x: 55.3, y: 54.3, width: 4.2, height: 6.5, sprite: true },
    {...puzzle('calibration','台灯',58.4,39.5,7.4,29),id:'p-calibration-lamp'},
    puzzle('paper', '纸盒', 52.7, 51.8, 12.8, 15, { revisit: 'paperBack', revisitAfter: 'flowers' }),
    puzzle('calibration', '光影小桌', 67, 50.5, 12, 19),
    puzzle('books', '借阅书架', 87.5, 38, 17, 33),
    puzzle('belt', '小放映机', 87.5, 59.7, 14, 18, { revisit: 'film', revisitAfter: 'belt' }),
    { id: 'album-desk', kind: 'album', label: '画册', x: 40.4, y: 56, width: 19, height: 12 },
    inspect('desk-rose', '小王子的玫瑰', 'prince', 24.5, 45, 8, 21),
    { id: 'cat', kind: 'pet', target: 'cat', label: '睡着的小猫', x: 9, y: 82, width: 15, height: 16 },
  ] },
  { id: 'window', title: '窗边', hotspots: [
    puzzle('cloud', '双面云景', 30.9, 55.6, 22.4, 20.5, { revisit: 'cloudGap', revisitAfter: 'flowers' }),
    puzzle('flowers', '花架', 83.5, 47, 21, 38),
    inspect('window-rose', '玫瑰与玻璃罩', 'prince', 50.5, 55, 10, 23),
    {...inspect('sky-figures', '戴巫师帽的那位', 'sky', 21.8, 56.5, 4, 8),hideAfter:'cloud'},
    {...inspect('sky-figures-right', '矮一点的那位', 'sky', 40.2, 57.7, 4, 6),hideAfter:'cloud'},
    inspect('postcards', '书里的明信片', 'cities', 63, 64, 16, 11),
  ] },
  { id: 'collection', title: '收藏柜', hotspots: [
    puzzle('screen', '纸屏', 53.5, 57, 22, 19),
    puzzle('maze', '旋转迷宫盒', 69, 58, 8.5, 15),
    puzzle('balance', '平衡摆件', 34, 55, 10, 20),
    puzzle('melody', '钉轮音乐盒', 79, 58, 10, 16),
    inspect('naruto-board', '带土与卡卡西', 'naruto', 21.4, 34.5, 14, 32),
    inspect('genshin-prints', '魈与流浪者', 'genshin', 61.2, 14, 8, 18),
    inspect('hei-tickets', '罗小黑战记Ⅱ票夹', 'hei', 85.5, 34, 11, 15),
    { id: 'reading-list', kind: 'reading', label: '推荐过的书与电影', x: 54.5, y: 18, width: 10, height: 16 },
    { id: 'interests', kind: 'interests', label: '游戏与小小的日常', x: 87, y: 57, width: 12, height: 16 },
  ] },
  { id: 'entry', title: '门边', hotspots: [
    puzzle('packing', '异形木拼框', 60, 72, 9, 10),
    puzzle('flips', '翻花盒', 70, 72, 8, 11),
    puzzle('drawers', '小抽屉', 80.5, 72, 8, 11),
    { id: 'ring-lamp', kind: 'ending', label: '年轮灯', x: 60, y: 44, width: 15, height: 26 },
    { id: 'dog', kind: 'pet', target: 'dog', label: '打盹的小狗', x: 39.5, y: 76, width: 21, height: 18 },
    { id: 'birthday-gift', kind: 'birthday', label: '10月29日的小礼物', x: 74, y: 50, width: 10, height: 11 },
  ] },
  { id: 'rain', title: '雨廊', requires:['calibration'], door:0, closed:'门缝里，还漏着一线光。', unlocked:'外面有雨声。', hotspots: [
    puzzle('postbox', '邮匣', 69, 62.5, 19, 34),
    inspect('rain-postcards', '两张明信片', 'cities', 48, 52, 10, 7),
    { id: 'postal-grid', kind: 'evidence', target: 'postal', label: '墙上的分拣格', x: 81.4, y: 21.5, width: 8, height: 18 },
    { id: 'rain-bell', kind: 'ambient', target: 'rain', label: '听雨', x: 23.5, y: 20.5, width: 4, height: 7 },
  ] },
  { id: 'atelier', title: '画桌', requires:['flowers'], door:1, closed:'花架后面，好像还有一扇门。', unlocked:'花架后面，露出了一扇窄门。', hotspots: [
    puzzle('wordlock', '五格字匣', 51, 46.5, 19, 19),
    { id: 'alphabet-grid', kind: 'evidence', target: 'alphabet', label: '字表', x: 65.5, y: 53, width: 10, height: 9 },
    inspect('atelier-drawings', '画稿', 'naruto', 13, 48, 20, 46),
    inspect('atelier-sketch', '添点颜色', 'genshin', 33, 43, 10, 13),
  ] },
  { id:'birthday',title:'生日桌',requires:['stitch'],tool:'birthday-door',door:2,closed:'门边留着一本画册的位置。',unlocked:'里间的门开了，桌上还留着几样东西。',hotspots:[
    puzzle('chocolate','巧克力盒',37,65,18,13),
    puzzle('cocoa','分可可',60,61,14,18),
    {id:'birthday-cake',kind:'ending',label:'生日蛋糕',x:50,y:52,width:14,height:26},
    {id:'birthday-fries',kind:'birthday-note',target:'fries',label:'拆一包薯条',x:72,y:60,width:9,height:17},
    {id:'birthday-parcel',kind:'birthday-note',target:'parcel',label:'留给你的',x:81,y:50,width:13,height:29},
  ]},
  {id:'party',title:'准备台',requires:['stitch'],tool:'birthday-door',door:2,closed:'里间还有一张小桌。',unlocked:'桌边的纸带还没有理好。',hotspots:[
    puzzle('sweets','二十颗糖',33,51,43,61),
    puzzle('ribbons','缎带下的生日匣',74,50,38,61,{revisit:'birthdayLock',revisitAfter:'ribbons'}),
  ]},
]);

export const SCENE_BY_ID = Object.freeze(Object.fromEntries(SCENES.map(scene => [scene.id, scene])));
