import {ease} from './shared.js';
import {captureNumberStrips,playNumberStrips} from './number-strips.js';
const pose=root=>{
 const camera=root.querySelector('.postal-camera'),door=root.querySelector('.postal-door'),card=root.querySelector('.postal-card-leaf'),view=root.querySelector('.postal-cabinet,.postal-paper-desk');
 return {top:root.getBoundingClientRect().top,width:view?.getBoundingClientRect().width,height:view?.getBoundingClientRect().height,camera:camera?getComputedStyle(camera).transform:null,door:door?getComputedStyle(door).transform:null,card:card?getComputedStyle(card).transform:null,attempts:Number(root.querySelector('[data-postal-cabinet]')?.dataset.attempts??0),digits:captureNumberStrips(root,'.postal-cabinet .postal-drum-strip'),paper:!!root.querySelector('[data-postal-desk]')};
};
export const postalMotion={
 capture:pose,
 play(root,before){
  const next=pose(root);
  const view=root.querySelector('.postal-cabinet,.postal-paper-desk');
  if(view&&Number.isFinite(before.height)){
   if(!before.paper&&!next.paper&&(Math.abs(before.height-next.height)>1||Math.abs(before.width-next.width)>1))view.animate([{width:before.width+'px',height:before.height+'px'},{width:next.width+'px',height:next.height+'px'}],{duration:440,easing:ease});
   const shift=before.top-root.getBoundingClientRect().top;
   if(Math.abs(shift)>1)root.animate([{translate:`0 ${shift}px`},{translate:'0 0'}],{duration:440,easing:ease});
  }
  for(const [selector,key,duration]of [['.postal-camera','camera',440],['.postal-door','door',680],['.postal-card-leaf','card',440]]){
   const el=root.querySelector(selector);if(el&&before[key]!==null&&before[key]!==next[key])el.animate([{transform:before[key]},{transform:next[key]}],{duration,easing:ease});
  }
  playNumberStrips(root,'.postal-cabinet .postal-drum-strip',before.digits);
  if(next.attempts>0&&next.attempts!==before.attempts)root.querySelector('[data-postal-latch]')?.animate([{rotate:'0deg'},{rotate:'-13deg',offset:.45},{rotate:'0deg'}],{duration:300,easing:ease});
  if(next.paper!==before.paper)root.querySelector('.postal-paper-desk,.postal-cabinet')?.animate([{opacity:.5,translate:'0 5px'},{opacity:1,translate:'0 0'}],{duration:220,easing:ease});
 }
};
