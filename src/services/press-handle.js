import {motionAllowed} from './motion/shared.js';

const runs=new WeakMap();
const poses=arm=>[...arm.querySelectorAll('[data-press-pose]')];
const weight=(stroke,index,count)=>Math.max(0,1-Math.abs(stroke*(count-1)-index));
export function readPressStroke(arm){
 if(!arm)return 0;
 const frames=poses(arm);return frames.reduce((sum,el,i)=>sum+Number(getComputedStyle(el).opacity)*i/(frames.length-1),0);
}
export function setPressStroke(arm,stroke){
 if(!arm)return;
 runs.get(arm)?.forEach(a=>a.cancel());runs.delete(arm);
 const frames=poses(arm),value=Math.max(0,Math.min(1,stroke));
 frames.forEach((el,i)=>{el.style.opacity=weight(value,i,frames.length);});
}
// The illustrated hub is registered in every pose. Only opacity changes;
// the handle never rotates as a flat card around the wrong camera axis.
export function animatePressHandle(arm,points,duration){
 if(!arm)return;
 const final=points.at(-1)[1];setPressStroke(arm,final);
 if(!motionAllowed())return;
 const frames=poses(arm),samples=[points[0]];
 for(let n=1;n<points.length;n++){
  const [a,from]=points[n-1],[b,to]=points[n];
  if(from!==to){
   const between=frames.map((_,i)=>i/(frames.length-1)).filter(v=>v>Math.min(from,to)&&v<Math.max(from,to));
   between.sort((x,y)=>from<to?x-y:y-x);
   for(const value of between)samples.push([a+(b-a)*(value-from)/(to-from),value]);
  }
  samples.push(points[n]);
 }
 const animations=frames.map((el,i)=>el.animate(samples.map(([offset,stroke])=>({offset,opacity:weight(stroke,i,frames.length)})),{duration,easing:'linear'}));
 runs.set(arm,animations);
 Promise.allSettled(animations.map(a=>a.finished)).then(()=>{if(runs.get(arm)!==animations)return;runs.delete(arm);animations.forEach(a=>a.cancel());});
}
