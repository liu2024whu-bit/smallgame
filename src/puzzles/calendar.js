import {numberLock} from './locks.js';
import {DATE_CODE} from '../data/calendar.js';

const lock=numberLock(DATE_CODE);
export const calendar={
 create:()=>({...lock.create(),shut:true,stamped:false}),
 valid:s=>lock.valid(s)&&typeof s.shut==='boolean'&&typeof s.stamped==='boolean'&&(s.opened||s.shut&&!s.stamped),
 move(s,a){
  if(s.opened){
   if(a.type==='drawer')return {...s,shut:!s.shut};
   if(a.type==='stamp'&&!s.shut&&!s.stamped)return {...s,stamped:true};
   return s;
  }
  const next=lock.move(s,a);
  return next.opened?{...next,shut:false}:next;
 },
 solved:lock.solved,
};
