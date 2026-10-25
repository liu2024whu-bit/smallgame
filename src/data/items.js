export const ITEMS = Object.freeze({
  borrowSlip:{name:'借阅签',sprite:{asset:'postalSupports',index:4,print:'借阅签',note:'书架见。'},description:'纸角留着一枚小孔。书架旁，应该用得上。'},
  bookmark: { name: '木书签', sprite: 0, description: '棕色穗子，还系得好好的。' },
  thread: { name: '棉线', sprite: 1, description: '松松绕着的一卷棉线。' },
  mirror: { name: '小圆镜', sprite: 2, description: '镜框背后，有个小支架。' },
  crank: { name: '摇柄', sprite: 3, description: '黄铜的，底下是个方口。' },
  transparency: { name: '透片', sprite: 4, description: '角上四道记号，中间一扇小窗。' },
  needle: { name: '装订针', sprite: 5, description: '针头圆圆的，针眼很大。' },
  pulley: { name: '槽轮', sprite: 6, description: '边缘凹下去一圈。' },
  pageA: { name: '画页 A', sprite: 7, description: '页角有一朵玫瑰。' },
  pageB: { name: '画页 B', sprite: 8, description: '页角印着云。' },
  pageC: { name: '画页 C', sprite: 9, description: '页角有一朵雏菊。' },
  pageD: { name: '画页 D', sprite: 10, description: '页角有颗星。' },
  board: { name: '装订托板', sprite: 11, description: '四列小孔，刚好托住画页。' },
  birthdayCard: {name:'贺卡',sprite:{asset:'birthdayProps',index:6},description:'正面一弯月亮。背面，好像还有字。'},
  birthdayRibbon: {name:'孔带',sprite:{asset:'birthdayProps',index:7},description:'从匣子上抽下来的纸带，留着四个透光的小孔。'},
});

export const ITEM_IDS = Object.freeze(Object.keys(ITEMS));
export const PAGE_IDS = ['pageA', 'pageB', 'pageC', 'pageD'];
