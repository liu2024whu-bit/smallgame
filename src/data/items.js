export const ITEMS = Object.freeze({
  bookmark: { name: '木书签', sprite: 0, description: '武大木书签，系着棕色穗子。纸套边缘有刻线，可以量距离；抽出书签，也可以抵住薄薄的挡片。' },
  thread: { name: '棉线', sprite: 1, description: '柔软但结实。能牵引纸景、连接槽轮，也能把纸页缝在一起。' },
  mirror: { name: '小圆镜', sprite: 2, description: '镜框可以立起。看见背面，也能把光送去别处。' },
  crank: { name: '手摇柄', sprite: 3, description: '一个方形接口。房间里的几台小机器似乎使用同样的轴。' },
  transparency: { name: '定位透片', sprite: 4, description: '四角有定位标记。叠上去之后，实处和空处都值得看。' },
  needle: { name: '装订针', sprite: 5, description: '钝头大针眼。可以领着棉线穿过狭小的导孔。' },
  pulley: { name: '槽轮', sprite: 6, description: '边缘的凹槽，正好能留住一圈棉线。' },
  pageA: { name: '画页 A', sprite: 7, description: '关于被记得的一页。角落有小小的玫瑰印记。' },
  pageB: { name: '画页 B', sprite: 8, description: '关于一起经过的日常。云朵印记留在页边。' },
  pageC: { name: '画页 C', sprite: 9, description: '关于分享和创作。花朵印记与纸背的孔位相接。' },
  pageD: { name: '画页 D', sprite: 10, description: '关于可以继续画下去的以后。星星旁还有留白。' },
  board: { name: '装订托板', sprite: 11, description: '四列定位孔。先排好画页，再沿孔穿线。' },
});

export const ITEM_IDS = Object.freeze(Object.keys(ITEMS));
export const PAGE_IDS = ['pageA', 'pageB', 'pageC', 'pageD'];
