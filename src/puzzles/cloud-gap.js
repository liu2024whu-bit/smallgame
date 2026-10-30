import {bounded,indexIn,same} from './common.js';

export const GAP_GOAL=Object.freeze([0,3,1]);
export const GAP_SEED=Object.freeze([3,0,3]);
export const GAP_STEP=32;
export const gapAligned=values=>same(values,GAP_GOAL);
export const cloudGap={
 create:()=>({values:[...GAP_SEED]}),
 valid:p=>bounded(p?.values,3,4)&&!Object.hasOwn(p,'back'),
 move(p,a){
  if(!indexIn(a.index,3))return p;
  const value=a.type==='set-slide'?a.value:a.type==='slide'&&[-1,1].includes(a.direction)?Math.max(0,Math.min(3,p.values[a.index]+a.direction)):null;
  if(!indexIn(value,4)||value===p.values[a.index])return p;
  return {values:p.values.map((v,i)=>i===a.index?value:v)};
 },
 solved:p=>gapAligned(p.values),
};
