// Regions include the whole changed object and a quiet feathered margin.
// Each completed mechanism reveals only its own paint; unrelated puzzles stay intact.
export const SCENE_CHANGES=Object.freeze([
  {scene:'desk',puzzle:'belt',asset:'deskAfter',region:[80,50,16,18],alt:'放映机的侧板敞着，线已经绕好'},
  {scene:'desk',puzzle:'stitch',asset:'deskAfter',region:[30,48,21,14],alt:'画册已经装订好'},
  {scene:'collection',puzzle:'screen',asset:'collectionAfter',region:[41,45,25,20],alt:'折屏上的画连在一起了'},
  {scene:'collection',puzzle:'maze',asset:'collectionAfter',region:[64,47,10,20],alt:'迷宫盒的盖子打开了'},
  {scene:'collection',puzzle:'melody',asset:'collectionAfter',region:[74,47,11,19],alt:'音乐盒打开了，音钉停在曲谱的高低上'},
  {scene:'entry',puzzle:'packing',asset:'entryAfter',region:[55,66,10,13],alt:'木框里拼好了整幅画'},
  {scene:'entry',puzzle:'flips',asset:'entryAfter',region:[66,63,9,17],alt:'翻花盒开着，九格都开了花'},
  {scene:'entry',puzzle:'drawers',asset:'entryAfter',region:[76,64,11,16],alt:'下面两格小抽屉拉开了'},
  {scene:'atelier',puzzle:'wordlock',asset:'atelierAfter',region:[41,35,20,18],alt:'字匣里的小抽屉滑了出来'},
  {scene:'birthday',puzzle:'chocolate',asset:'birthdayAfter',region:[27,47,22,25],alt:'巧克力盒开着，空位留成了一颗星'},
  {scene:'birthday',puzzle:'cocoa',asset:'birthdayAfter',region:[51.5,49,19.5,22],alt:'两份可可已经分好，小壶空着'},
  {scene:'birthday',activity:'birthday:unwrap',asset:'birthdayUnwrapped',region:[74,32,14,33],alt:'礼物袋拆开了，米色小兔露出头来'},
]);

export const sceneChanges=state=>SCENE_CHANGES.filter(change=>change.scene===state.scene&&(change.activity?state.activities.includes(change.activity):state.solved.includes(change.puzzle)));
export function paintMask([x,y,width,height]) {
  const feather=.6;
  return `linear-gradient(to right,transparent ${x}%,#000 ${x+feather}%,#000 ${x+width-feather}%,transparent ${x+width}%),linear-gradient(to bottom,transparent ${y}%,#000 ${y+feather}%,#000 ${y+height-feather}%,transparent ${y+height}%)`;
}
