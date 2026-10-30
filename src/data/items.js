export const ITEMS = Object.freeze({
  matches:{name:'火柴盒',sprite:{asset:'chocolateRewardParts',index:1},description:'纸盒侧边，有一片粗糙的棕色。'},
  filmStrip:{name:'三格胶片',sprite:{asset:'filmParts',index:2},description:'片头夹着一枚小铜夹。'},
  borrowSlip:{name:'借阅签',sprite:{asset:'postalSupports',index:4,print:'借阅签',note:'书架见。'},description:'纸角打着一个小孔，和书架边的挂钩差不多大。'},
  bookmark: { name: '木书签', sprite: 0, description: '棕色穗子，还系得好好的。' },
  thread: { name: '棉线', sprite: 1, description: '松松绕着的一卷棉线。' },
  mirror: { name: '小圆镜', sprite: 2, description: '镜框背后，有个小支架。' },
  crank: { name: '摇柄', sprite: 3, description: '黄铜的，底下是个方口。' },
  transparency: { name: '透片', sprite: 4, description: '角上四道记号，中间一扇小窗。' },
  needle: { name: '装订针', sprite: 5, description: '针头圆圆的，针眼很大。' },
  pulley: { name: '槽轮', sprite: 6, description: '边缘凹下去一圈。' },
  pageA: { name: '画页 A', sprite: 7, description: '页角有一朵玫瑰。' },
  pageB: { name: '画页 B', sprite: 8, description: '页角印着云。' },
  pageC: { name: '画页 C', sprite: 9, description: '这一页，是小雏菊。' },
  pageD: { name: '画页 D', sprite: 10, description: '页角有颗星。' },
  board: { name: '装订托板', sprite: 11, description: '四角的小木桩，刚好拦住画页。' },
  birthdayCard: {name:'贺卡',sprite:{asset:'giftCard',index:0},description:'两道折痕之间，印着一弯月亮。'},
  birthdayRibbon: {name:'孔带',sprite:{asset:'ribbonStencil',index:0},description:'盒底纸套里的一张薄纸，角边留着小星星。'},
});

export const ITEM_IDS = Object.freeze(Object.keys(ITEMS));
export const PAGE_IDS = ['pageA', 'pageB', 'pageC', 'pageD'];
