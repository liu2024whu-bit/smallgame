import {ease,turnDelta,motionAllowed} from './shared.js';
const fieldOf=root=>root.matches?.('.cloud-case')?root:root.querySelector('.cloud-case');
export const cloudDegrees=el=>parseFloat(getComputedStyle(el).rotate.match(/-?[\d.]+deg/)?.[0])||0;
export function captureCloud(root){
 const field=fieldOf(root);if(!field)return null;
 return {values:field.dataset.cloudValues.split(',').map(Number),preview:field.hasAttribute('data-cloud-preview')?Number(field.dataset.cloudPreview):null,
  face:cloudDegrees(field.querySelector('.cloud-turntable')),
  rotors:new Map([...field.querySelectorAll('[data-cloud-rotor]')].map(el=>[el.dataset.cloudRotor,cloudDegrees(el)])),
  phases:new Map([...field.querySelectorAll('[data-cloud-rotor]')].map(el=>[el.dataset.cloudRotor,parseFloat(el.style.rotate)||0])),
  wings:new Map([...field.querySelectorAll('[data-cloud-wing]')].map(el=>[el.dataset.cloudWing,cloudDegrees(el)]))};
}
export function settleCloudRotors(field,before,{preview=false,input=null,duration=380}={}){
 if(!before||!motionAllowed())return;
 const values=field.dataset.cloudValues.split(',').map(Number);
 for(const el of field.querySelectorAll('[data-cloud-rotor]')){
  const old=before.rotors.get(el.dataset.cloudRotor);if(old===undefined)continue;
  const canonical=parseFloat(el.style.rotate)||0,index=Number(el.dataset.cloudInput);
  if(input!==null&&input!==index)continue;
  let change=((values[index]-before.values[index]+2)%4+4)%4-2;if(change===-2)change=2;
  const step=change*Number(el.dataset.cloudStep)*90,hand=preview||before.preview===index;
  // Keep accumulated turns through quick taps and view changes; modulo angles
  // would make a fourth clockwise tap suddenly unwind toward zero.
  const target=hand?canonical:(before.phases.get(el.dataset.cloudRotor)??canonical-step)+step;
  const from=hand?target+turnDelta(old,target):old;
  el.style.rotate=target+'deg';
  if(Math.abs(from-target)>.05)el.animate([{rotate:from+'deg'},{rotate:target+'deg'}],{duration,easing:ease});
 }
}
export function settleCloudFace(table,from,target,duration=600){
 if(!motionAllowed())return;
 const start=target+turnDelta(from,target);
 if(Math.abs(start-target)>.05)table.animate([{rotate:'y '+start+'deg'},{rotate:'y '+target+'deg'}],{duration,easing:ease});
}
export const cloudMotion={
 capture:captureCloud,
 play(root,before){
  const field=fieldOf(root);if(!field||!before)return;
  settleCloudRotors(field,before);
  const target=Number(field.dataset.cloudSide)<0?180:0;
  settleCloudFace(field.querySelector('.cloud-turntable'),before.face,target,Math.max(180,Math.min(640,Math.abs(turnDelta(before.face,target))/180*640)));
  const values=field.dataset.cloudValues.split(',').map(Number);
  for(const el of field.querySelectorAll('[data-cloud-winder]')){
   const index=Number(el.dataset.cloudWinder);if(values[index]===before.values[index])continue;
   el.querySelector('.cloud-loop')?.animate([{opacity:before.preview===index?1:0},{opacity:1,offset:.18},{opacity:1,offset:.65},{opacity:0}],{duration:500,easing:'ease-out'});
  }
  for(const wing of field.querySelectorAll('[data-cloud-wing]')){
   const old=before.wings.get(wing.dataset.cloudWing),next=parseFloat(wing.style.rotate.match(/-?[\d.]+deg/)?.[0])||0;
   if(old!==undefined&&Math.abs(old-next)>.05)wing.animate([{rotate:'y '+old+'deg'},{rotate:'y '+next+'deg'}],{duration:720,delay:180,fill:'backwards',easing:ease});
  }
 }
};
