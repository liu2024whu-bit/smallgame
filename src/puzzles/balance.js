import {bounded,indexIn} from './common.js';
import {balanceLoads} from '../data/balance-apparatus.js';

// Six places in the tray, three per pan. A drop never exchanges two objects.
export const balance={
 create:()=>({places:[0,1,2,3,4,5]}),
 valid:p=>bounded(p?.places,6,12)&&new Set(p.places).size===6,
 move(p,a){
  if(a.type!=='place'||!indexIn(a.index,6)||!indexIn(a.slot,12)||p.places.includes(a.slot))return p;
  return {places:p.places.map((slot,i)=>i===a.index?a.slot:slot)};
 },
 solved(p){const [a,b]=balanceLoads(p.places);return p.places.every(slot=>slot>=6)&&a===b;},
};
