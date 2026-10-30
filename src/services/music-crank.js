import {motionAllowed} from './motion/shared.js';

const runs=new WeakMap();
const poses=crank=>[...crank.querySelectorAll('[data-music-crank-pose]')];
const weight=(degrees,index,count)=>{const phase=((degrees/360%1)+1)%1*count,distance=Math.abs(phase-index);return Math.max(0,1-Math.min(distance,count-distance));};

// Every painted socket is registered on the same horizontal axle.
// Adjacent views blend; no part is flattened into the plane of the picture.
export function setMusicCrank(crank,degrees=0){
 if(!crank)return;
 runs.get(crank)?.cancel();
 const frames=poses(crank);frames.forEach((el,i)=>{el.style.opacity=weight(degrees,i,frames.length);});
}
export function animateMusicCrank(crank,duration=2880){
 if(!crank)return null;
 setMusicCrank(crank);
 if(!motionAllowed())return null;
 const frames=poses(crank),steps=frames.length*2;
 const animations=frames.map((el,i)=>el.animate(Array.from({length:steps+1},(_,n)=>({offset:n/steps,opacity:weight(n/steps*720,i,frames.length)})),{duration,easing:'linear'}));
 const run={cancel(){if(runs.get(crank)!==run)return;runs.delete(crank);animations.forEach(a=>a.cancel());frames.forEach((el,i)=>{el.style.opacity=i===0?1:0;});}};
 runs.set(crank,run);
 Promise.allSettled(animations.map(a=>a.finished)).then(()=>run.cancel());
 return run;
}
