// Shared by the printed clues, physical apparatus and pure puzzle rules.
export const SUGAR_NAMES = ['星星饼干','草莓心','巧克力','樱桃','雏菊糖'];
export const SUGARS = Object.freeze([
  [2,3,0],[0,3,1],[2,0,2],[2,1,3],[1,2,4],
  [2,6,0],[2,5,1],[1,7,2],[1,6,3],[2,7,4],
  [5,4,0],[3,1,1],[5,2,2],[5,3,3],[4,0,4],
  [4,6,0],[7,6,1],[5,6,2],[5,7,3],[4,7,4],
].map(([row,column,type])=>Object.freeze({row,column,type})));
export const SUGAR_GRID = 8;
// Source pixels; the close-ups and room miniatures use these same rectangles.
export const PARTY_FRAME = {width:1536,height:1024};
export const SWEET_CROP = [140,205,710,650];
export const BOX_CROP = [840,185,600,660];
export const OPEN_BOX_CROP = [830,160,620,690];
export const CAKE_GRID = [319,374,360,300];
export const SWEET_PLATES = [[268,308],[741,309],[249,744],[747,733]];
export const BOX_LID = [897,249,460,390];
export const LOCK_WINDOWS = [[1057,660,29,49],[1097,660,29,49],[1136,660,29,49],[1175,660,29,49]];
export const LOCK_LATCH = [1211,666,45,40];
export const OPEN_LOCK_WINDOWS = [[1059,303,25,33],[1092,306,24,34],[1125,309,24,34],[1158,312,25,34]];

export const RIBBON_COLORS = ['#b47d72','#b6a163','#8b9d83','#8a9ba8','#a08baf','#ba9973'];
export const RIBBON_NAMES = [...SUGAR_NAMES,'蝴蝶结'];
export const RIBBON_LAYERS = [0,1,4,2,3,5]; // Bottom to top, on both sides of the box.
export const RIBBON_TAIL_SIDES = [0,1,0,1,1,0];
export const RIBBON_PATHS = [
  [[[18,30],[62,30]],[[30,18],[30,82]],[[40,48],[83,48]],[[50,18],[50,58]],[[18,66],[83,66]],[[70,38],[70,82]]],
  [[[16,30],[44,30]],[[70,16],[70,44]],[[56,30],[84,30]],[[50,52],[50,82]],[[35,66],[65,66]],[[30,16],[30,44]]],
];
export function crossing(a,b) {
  const [[ax,ay],[bx,by]]=a,[[cx,cy],[dx,dy]]=b;
  const det=(bx-ax)*(dy-cy)-(by-ay)*(dx-cx);
  if(!det)return null;
  const t=((cx-ax)*(dy-cy)-(cy-ay)*(dx-cx))/det;
  const u=((cx-ax)*(by-ay)-(cy-ay)*(bx-ax))/det;
  return t>0&&t<1&&u>0&&u<1?[ax+t*(bx-ax),ay+t*(by-ay)]:null;
}
export function ribbonBlockers(index) {
  const rank=RIBBON_LAYERS.indexOf(index);
  return RIBBON_LAYERS.slice(rank+1).filter(other=>RIBBON_PATHS.some(face=>crossing(face[index],face[other])));
}

export const BIRTHDAY_GRID = [[9,8,0,4],[2,7,1,6],[6,5,2,6],[3,0,8,1]];
export const BIRTHDAY_HOLES = [1,3,0,1];
export const BIRTHDAY_CODE = BIRTHDAY_HOLES.map((row,column)=>BIRTHDAY_GRID[row][column]);
export const BIRTHDAY_INPUTS = ['birthdayCard','birthdayRibbon','mirror'];
export const birthdayCell=(row,column)=>[80+column*80,35+row*30];
export function ribbonHoles(turned) {
  return turned?BIRTHDAY_HOLES.toReversed().map(row=>3-row):BIRTHDAY_HOLES;
}
