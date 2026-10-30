import { indexIn } from './common.js';
import { RIBBON_TAIL_SIDES, ribbonBlockers } from '../data/ribbons.js';

export const ribbonFree=(state,index)=>ribbonBlockers(index).every(other=>state.removed.includes(other));
export const ribbons = {
  create:()=>({removed:[],back:false}),
  valid(state) {
    if(!state||!Array.isArray(state.removed)||state.removed.length>6||new Set(state.removed).size!==state.removed.length||typeof state.back!=='boolean')return false;
    return state.removed.every((index,step)=>indexIn(index,6)&&ribbonFree({removed:state.removed.slice(0,step)},index));
  },
  move(state,action) {
    if(action.type==='flip')return {...state,back:!state.back};
    const index=action.index;
    if(action.type!=='pull'||!indexIn(index,6)||state.removed.includes(index)||RIBBON_TAIL_SIDES[index]!==Number(state.back)||!ribbonFree(state,index))return state;
    return {...state,removed:[...state.removed,index]};
  },
  solved:state=>state.removed.length===6,
};
