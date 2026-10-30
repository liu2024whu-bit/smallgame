import {ease} from './shared.js';
import {pianoFlapMotion} from '../piano-flap-motion.js';
export const pianoMotion={
 capture(root){const world=root.querySelector('[data-piano-model]');return {opened:world?.dataset.pianoOpen==='true',present:!!world,fragments:[...root.querySelectorAll('[data-piano-fragment]')].map(el=>({id:el.dataset.pianoFragment,slot:el.dataset.pianoSlot,face:el.querySelector('[data-piano-face]').style.transform}))};},
 play(root,before){
  const world=root.querySelector('[data-piano-model]');if(world&&before.present&&!before.opened&&world.dataset.pianoOpen==='true')pianoFlapMotion(world);
  for(const el of root.querySelectorAll('[data-piano-fragment]')){
   const old=before.fragments.find(p=>p.id===el.dataset.pianoFragment);if(!old)continue;
   const face=el.querySelector('[data-piano-face]'),to=face.style.transform;
   if(old.face!==to)face.animate([{transform:old.face},{transform:to}],{duration:360,easing:ease});
   if(old.slot!==el.dataset.pianoSlot)el.animate([{translate:`${(Number(old.slot)-Number(el.dataset.pianoSlot))*184}px 0`},{translate:'0 0'}],{duration:300,easing:ease});
  }
 },
};
