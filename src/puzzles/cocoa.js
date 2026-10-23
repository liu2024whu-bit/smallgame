import { indexIn, same } from './common.js';
import { COCOA_CAPACITIES, COCOA_GOAL } from '../data/birthday.js';

export function pourAmount(levels,from,to) {
  return indexIn(from,3)&&indexIn(to,3)&&from!==to ? Math.min(levels[from],COCOA_CAPACITIES[to]-levels[to]) : 0;
}
export const cocoa = {
  create:()=>({levels:[8,0,0]}),
  valid:state=>Array.isArray(state?.levels)&&state.levels.length===3&&state.levels.every((level,i)=>Number.isInteger(level)&&level>=0&&level<=COCOA_CAPACITIES[i])&&state.levels.reduce((a,b)=>a+b,0)===8,
  move(state,action) {
    if(action.type!=='pour')return state;
    const amount=pourAmount(state.levels,action.from,action.to);
    if(!amount)return state;
    const levels=[...state.levels];levels[action.from]-=amount;levels[action.to]+=amount;
    return {levels};
  },
  solved:state=>same(state.levels,COCOA_GOAL),
};
