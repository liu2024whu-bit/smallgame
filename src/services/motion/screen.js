import {ease,motionAllowed} from './shared.js';
import {captureNumberStrips,playNumberStrips} from './number-strips.js';
const main=root=>root.querySelector('.screen-viewport [data-screen-case]');
const pose=root=>{
 const el=main(root),bench=root.querySelector('[data-screen-view]');
 return {mode:bench?.dataset.screenView,group:bench?.dataset.screenFocus,world:root.querySelector('.screen-world')?.getBoundingClientRect(),backing:el?getComputedStyle(el.querySelector('.screen-backing')).transform:null,grips:new Map([...el?.querySelectorAll('.screen-carrier-grip')??[]].map(e=>[e.dataset.screenGroup,{rect:e.getBoundingClientRect(),clip:getComputedStyle(e).clipPath}])),leaves:new Map([...el?.querySelectorAll('[data-screen-leaf]')??[]].map(e=>[e.dataset.screenLeaf,getComputedStyle(e.firstElementChild).transform])),shutter:el?getComputedStyle(el.querySelector('.screen-shutter')).transform:null,digits:captureNumberStrips(el,'.screen-drum-strip'),attempts:Number(el?.dataset.attempts),opened:el?.dataset.screenOpen==='true'};
};
export const screenMotion={
 capture:pose,
 play(root,before){
  const el=main(root);if(!el)return;
  const next=pose(root);
  playNumberStrips(el,'.screen-drum-strip',before.digits);
  if(before.backing&&before.backing!==next.backing)el.querySelector('.screen-backing').animate([{transform:before.backing},{transform:next.backing}],{duration:360,easing:ease});
  if(before.mode===next.mode&&before.group===next.group)for(const grip of el.querySelectorAll('.screen-carrier-grip')){
   const old=before.grips?.get(grip.dataset.screenGroup),now=next.grips.get(grip.dataset.screenGroup);if(old&&now)settleGrip(grip,old,now,360);
  }
  for(const button of el.querySelectorAll('[data-screen-leaf]')){
   const leaf=button.firstElementChild,old=before.leaves.get(button.dataset.screenLeaf),now=getComputedStyle(leaf).transform;
   if(old&&old!==now)leaf.animate([{transform:old},{transform:now}],{duration:360,easing:ease});
  }
  const shutter=el.querySelector('.screen-shutter');
  if(before.shutter&&before.shutter!==next.shutter)shutter.animate([{transform:before.shutter},{transform:next.shutter}],{duration:560,easing:ease});
  if(before.mode&&(before.mode!==next.mode||before.group!==next.group)&&before.world){
   const world=root.querySelector('.screen-world'),after=world.getBoundingClientRect(),scale=before.world.width/after.width;
   world.animate([{transformOrigin:'0 0',transform:`translate(${before.world.left-after.left}px,${before.world.top-after.top}px) scale(${scale})`},{transformOrigin:'0 0',transform:'none'}],{duration:360,easing:ease});
  }
  if(next.attempts>before.attempts&&!next.opened)el.querySelector('.screen-latch')?.animate([{rotate:'0deg'},{rotate:'-12deg',offset:.35},{rotate:'0deg'}],{duration:240,easing:ease});
 }
};
export function settleScreenLeaf(leaf){
 if(!leaf?.isConnected)return;
 const before=getComputedStyle(leaf).transform;leaf.style.transform=leaf.dataset.restTransform;
 const after=getComputedStyle(leaf).transform;
 if(before!==after&&motionAllowed())leaf.animate([{transform:before},{transform:after}],{duration:180,easing:ease});
}
export function settleScreenBacking(paper){
 if(!paper?.isConnected)return;
 const before=getComputedStyle(paper).transform;paper.style.removeProperty('transform');const after=getComputedStyle(paper).transform;
 if(before!==after&&motionAllowed())paper.animate([{transform:before},{transform:after}],{duration:180,easing:ease});
}
function settleGrip(grip,before,after,duration){
 const dx=before.rect.left-after.rect.left,dy=before.rect.top-after.rect.top;
 if(dx||dy||before.clip!==after.clip)grip.animate([{translate:`${dx}px ${dy}px`,clipPath:before.clip},{translate:'0 0',clipPath:after.clip}],{duration,easing:ease});
}
export function settleScreenGrip(grip,clip){
 if(!grip?.isConnected)return;
 const before={rect:grip.getBoundingClientRect(),clip:getComputedStyle(grip).clipPath};grip.style.removeProperty('translate');grip.style.clipPath=clip;
 if(motionAllowed())settleGrip(grip,before,{rect:grip.getBoundingClientRect(),clip},180);
}
