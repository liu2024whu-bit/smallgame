import {mod} from '../../puzzles/common.js';
import {ease} from './shared.js';
export const captureNumberStrips=(root,selector)=>[...root?.querySelectorAll(selector)??[]].map(el=>-new DOMMatrix(getComputedStyle(el).transform).m42/el.clientHeight-10);
// The measured fractional detent keeps rapid presses and a released drag continuous.
export function playNumberStrips(root,selector,before){
 const next=captureNumberStrips(root,selector);
 root?.querySelectorAll(selector).forEach((el,i)=>{
  if(!Number.isFinite(before[i]))return;
  const to=next[i],from=to+mod(before[i]-to+5,10)-5;
  if(Math.abs(from-to)<.001)return;
  el.animate([{transform:`translateY(${-(10+from)*100}%)`},{transform:`translateY(${-(10+to)*100}%)`}],{duration:210,easing:ease});
 });
}
