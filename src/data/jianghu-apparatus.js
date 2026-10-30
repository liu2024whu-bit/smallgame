import {ASSETS} from './assets.js';

// The five painted fronts share one drawer rail and a fixed desk edge.
// Source rectangles follow the actual wooden front, not the whole scene.
export const JIANGHU_EDGE=314;
export const JIANGHU_POSES=Object.freeze([
 {src:ASSETS.jianghuClosed,front:[124,316,1282,194]},
 {src:ASSETS.jianghuQuarter,front:[70,446,1398,184]},
 {src:ASSETS.jianghuMid,front:[17,544,1500,199]},
 {src:ASSETS.jianghuThreeQuarter,front:[3,657,1530,198]},
 {src:ASSETS.jianghuDrawer,front:[0,779,1536,202]},
]);
export function drawerPose(position){
 const p=Math.max(0,Math.min(1,position)),index=Math.min(3,Math.floor(p*4)),mix=p*4-index;
 const a=JIANGHU_POSES[index],b=JIANGHU_POSES[index+1];
 return {index,mix,front:a.front.map((v,i)=>v+(b.front[i]-v)*mix)};
}
