import {moveAdjacent,reorder,permutation,same} from './common.js';
import {PAPER_SEED,applyOperations} from './paper.js';

export const BACK_ORIGINAL=[3,0,4,1,2];
export const BACK_OPERATIONS=[2,0,1];
export const BACK_TARGET=applyOperations(BACK_ORIGINAL,BACK_OPERATIONS);
export const paperBackFits=order=>permutation(order,5)&&same(applyOperations(order,BACK_OPERATIONS),BACK_TARGET);

export const paperBack={
 create:()=>({order:[...PAPER_SEED],fitted:[false],opened:false,attempts:0}),
 valid:p=>permutation(p?.order,5)&&Array.isArray(p.fitted)&&p.fitted.length===1&&typeof p.fitted[0]==='boolean'&&typeof p.opened==='boolean'&&Number.isInteger(p.attempts)&&p.attempts>=0&&p.attempts<=999&&(!p.opened||p.attempts>0&&paperBackFits(p.order)),
 move(p,a){
  if(['fit','unfit'].includes(a.type)&&a.index===0)return {...p,fitted:[a.type==='fit']};
  if(p.opened)return p;
  if(a.type==='reorder')return {...p,order:reorder(p.order,a.from,a.to)};
  if(a.type==='shift')return {...p,order:moveAdjacent(p.order,a.index,a.direction)};
  if(a.type==='submit')return {...p,attempts:Math.min(999,p.attempts+1),opened:paperBackFits(p.order)};
  return p;
 },
 solved:p=>p.opened===true&&p.attempts>0&&paperBackFits(p.order),
};
