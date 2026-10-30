import { moveAdjacent, reorder, permutation, same } from './common.js';

export const STAMPS = ['叶', '月', '星', '花', '云'];
export const PAPER_SEED = [0, 1, 2, 3, 4];

export function operate(values, operation) {
  const result = [...values];
  if (operation === 0) return result.reverse();
  if (operation === 1) return [...result.slice(1), result[0]];
  if (operation === 2) [result[1], result[3]] = [result[3], result[1]];
  return result;
}

export const applyOperations = (values, operations) => operations.reduce(operate, values);
export const PAPER_TARGET = applyOperations(PAPER_SEED, [0, 1, 2]);

export const paper = {
  create: () => ({order:[2,0,1],opened:false,proof:null,presses:0}),
  valid: state => permutation(state?.order,3)&&typeof state.opened==='boolean'&&
    (state.proof===null||permutation(state.proof,3))&&Number.isInteger(state.presses)&&state.presses>=0&&state.presses<65536&&
    (state.opened||state.proof===null&&state.presses===0),
  move(state,action){
    if(action.type==='open')return {...state,opened:true};
    if(!state.opened)return state;
    if(action.type==='print')return {...state,proof:[...state.order],presses:(state.presses+1)%65536};
    if(action.type==='reorder')return {...state,order:reorder(state.order,action.from,action.to)};
    if(action.type==='shift')return {...state,order:moveAdjacent(state.order,action.index,action.direction)};
    return state;
  },
  solved: state => permutation(state?.proof,3)&&same(applyOperations(PAPER_SEED,state.proof),PAPER_TARGET),
};
