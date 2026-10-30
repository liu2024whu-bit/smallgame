import {bounded,indexIn} from './common.js';
import {SUGARS,SUGAR_GRID,sweetsGroup} from '../data/sweets.js';

export function sugarGroups(cuts){
 const groups=Array.from({length:4},()=>Array(5).fill(0));
 for(const sugar of SUGARS)groups[sweetsGroup(sugar,cuts)][sugar.type]++;
 return groups;
}
export const sweetsFit=cuts=>sugarGroups(cuts).every(group=>group.every(value=>value===1));
export const sweets={
 create:()=>({cuts:[4,4,4],served:false}),
 valid:p=>bounded(p?.cuts,3,SUGAR_GRID)&&p.cuts.every(value=>value>0)&&typeof p.served==='boolean'&&(!p.served||sweetsFit(p.cuts)),
 move(p,a){
  if(p.served)return p;
  if(a.type==='serve')return sweetsFit(p.cuts)?{...p,served:true}:p;
  if(a.type!=='cut'||!indexIn(a.index,3)||!Number.isInteger(a.value)||a.value<1||a.value>=SUGAR_GRID||a.value===p.cuts[a.index])return p;
  return {...p,cuts:p.cuts.map((value,index)=>index===a.index?a.value:value)};
 },
 solved:p=>p.served&&sweetsFit(p.cuts),
};
