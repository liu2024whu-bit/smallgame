import {mazeMaterial,mazeLidAngle} from '../maze-material.js';
import {mazeJourney} from '../../data/maze-travel.js';

export function routeMeasure(points){
 let total=0;const lengths=points.map((point,i)=>total+=i?Math.hypot(point[0]-points[i-1][0],point[1]-points[i-1][1]):0);
 return {total,offsets:lengths.map(n=>total?n/total:0)};
}
export const mazeMotion={
 capture(root){
  const model=root.querySelector('[data-maze-model]'),world=model?.closest('.maze-world');if(!world)return null;
  return {pose:mazeMaterial(model)?.snapshot(),camera:world.dataset.sourceCamera,box:world.getBoundingClientRect()};
 },
 play(root,old){
  const model=root.querySelector('[data-maze-model]'),world=model?.closest('.maze-world');if(!old?.pose||!world)return;
  const p=JSON.parse(model.dataset.mazePose),next=mazeMaterial(model);if(!next)return;
  const route=mazeJourney(old.pose.p,p,old.pose.ball),{total}=routeMeasure(route),camera=old.camera!==world.dataset.sourceCamera;
  const structural=total>1||old.pose.lid!==mazeLidAngle(p);
  if(camera){const b=world.parentElement.getBoundingClientRect();world.animate([{transform:`translate(${old.box.left-b.left}px,${old.box.top-b.top}px) scale(${old.box.width/1254})`},{transform:world.style.transform}],{duration:380,easing:'cubic-bezier(.22,.75,.3,1)'}).finished.catch(()=>{});}
  next.animate(old.pose,p,route,{duration:camera?390:total>1?Math.min(2200,Math.max(230,total*.85)):300,blocking:structural||camera});
 },
};
