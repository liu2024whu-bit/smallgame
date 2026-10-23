import { bounded, indexIn } from './common.js';
import { CHOCOLATE_PATTERN } from '../data/birthday.js';

export const chocolate = {
  create:()=>({cells:Array(25).fill(1),tool:0,covered:false}),
  valid:state=>bounded(state?.cells,25,2)&&[0,1].includes(state.tool)&&typeof state.covered==='boolean',
  move(state,action) {
    if(action.type==='cover')return {...state,covered:!state.covered};
    if(state.covered)return state;
    if(action.type==='tool'&&[0,1].includes(action.value))return {...state,tool:action.value};
    if(action.type==='mark'&&indexIn(action.index,25)) {
      const value=action.value??state.tool;
      if(![0,1].includes(value))return state;
      return {...state,cells:state.cells.map((cell,i)=>i===action.index?value:cell)};
    }
    if(action.type==='paint'&&Array.isArray(action.indexes)&&action.indexes.length>0&&action.indexes.length<=25&&action.indexes.every(i=>indexIn(i,25))&&[0,1].includes(action.value)) {
      const selected=new Set(action.indexes);
      return {...state,cells:state.cells.map((cell,i)=>selected.has(i)?action.value:cell)};
    }
    return state;
  },
  solved:state=>state.covered&&state.cells.every((cell,i)=>(cell===0?1:0)===CHOCOLATE_PATTERN[i]),
};
