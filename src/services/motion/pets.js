import {motionAllowed} from './shared.js';

const duration=1000,selectors=['.pet-sleep','.pet-drowse','.pet-stretch','.pet-wake'];
const poses=[[0,[1,0,0,0]],[.1,[0,1,0,0]],[.28,[0,1,0,0]],[.45,[0,0,1,0]],[.65,[0,0,1,0]],[.84,[0,0,0,1]],[1,[0,0,0,1]]];
function opacityAt(t,index){for(let i=1;i<poses.length;i++)if(t<=poses[i][0]){const [start,a]=poses[i-1],[end,b]=poses[i],fraction=(t-start)/(end-start);return a[index]+(b[index]-a[index])*fraction;}return poses.at(-1)[1][index];}
export function playPetWake(corner,from=0){
 if(!corner||!motionAllowed()||from>=1)return;
 corner.dataset.petWakeStart=performance.now()-from*duration;
 const animations=selectors.map((selector,index)=>{
  const el=corner.querySelector(selector),frames=[{opacity:opacityAt(from,index),offset:0},...poses.filter(([t])=>t>from).map(([t,values])=>({opacity:values[index],offset:(t-from)/(1-from)}))];
  const animation=el.animate(frames,{duration:duration*(1-from),easing:'linear'});animation.id='pet-wake';return animation;
 });
 const settle=()=>animations.forEach(a=>{try{a.finish();}catch{a.cancel();}});window.addEventListener('resize',settle,{once:true});
 Promise.allSettled(animations.map(a=>a.finished)).then(()=>window.removeEventListener('resize',settle));
}
export function wakePet(corner){if(!corner||corner.classList.contains('is-awake'))return;corner.classList.add('is-awake');playPetWake(corner);}
export const petsMotion={
 capture(root){const el=root.querySelector('[data-pet-corner]');return el?{pet:el.dataset.pet,awake:el.classList.contains('is-awake'),from:el.getAnimations({subtree:true}).some(a=>a.id==='pet-wake'&&a.playState==='running')?Math.min(1,(performance.now()-Number(el.dataset.petWakeStart))/duration):1}:null;},
 play(root,before){const el=root.querySelector('[data-pet-corner]');if(el&&before?.pet===el.dataset.pet&&before.awake&&before.from<1)playPetWake(el,before.from);},
};
