import {settleDial} from './dials.js';
const turns=root=>[...root.querySelectorAll('.dial-face')].map(el=>parseFloat(el.style.getPropertyValue('--turn'))||0);
export const mechanismMotion={
 capture:root=>({dials:turns(root)}),
 play(root,before){
  const next=turns(root);
  root.querySelectorAll('.dial-face').forEach((el,i)=>{if(before.dials[i]!==undefined&&before.dials[i]!==next[i])settleDial(el,before.dials[i],next[i]);});
 },
};
