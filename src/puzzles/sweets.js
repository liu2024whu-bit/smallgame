import { bounded, indexIn } from './common.js';
import { SUGARS, SUGAR_GRID } from '../data/birthday-workshop.js';

export function sugarGroups(cuts) {
  const groups=Array.from({length:4},()=>Array(5).fill(0));
  for(const sugar of SUGARS)groups[(sugar.row>=cuts[0]?2:0)+(sugar.column>=cuts[1]?1:0)][sugar.type]++;
  return groups;
}
export const sweets = {
  create:()=>({cuts:[4,4]}),
  valid:state=>bounded(state?.cuts,2,SUGAR_GRID)&&state.cuts.every(value=>value>0),
  move(state,action) {
    if(action.type!=='cut'||!indexIn(action.index,2)||!Number.isInteger(action.value)||action.value<1||action.value>=SUGAR_GRID)return state;
    return {...state,cuts:state.cuts.map((value,index)=>index===action.index?action.value:value)};
  },
  solved:state=>sugarGroups(state.cuts).every(group=>group.every(value=>value===1)),
};
