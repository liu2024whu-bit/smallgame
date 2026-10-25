import {moveAdjacent,reorder,permutation,same} from './common.js';

export const BOOKS = ['绿山墙的安妮', '杀死一只知更鸟', '白夜行', '傲慢与偏见', '小王子'];
export function booksFit(order) {
  const position = id => order.indexOf(id);
  return position(4) > 0 && position(4) < 4 && position(2) - position(0) === 3 && position(1) === position(4) + 1 && position(3) < position(0);
}

export const books={
 create:()=>({order:[0,1,2,3,4],fitted:[false],opened:false,attempts:0}),
 valid:s=>permutation(s?.order,5)&&Array.isArray(s.fitted)&&s.fitted.length===1&&typeof s.fitted[0]==='boolean'&&typeof s.opened==='boolean'&&Number.isInteger(s.attempts)&&s.attempts>=0&&s.attempts<=999&&(!s.opened||!s.fitted[0]&&s.attempts>0&&booksFit(s.order)),
 move(state,action){
  if(state.opened)return state;
  if(action.type==='fit'&&action.index===0&&!state.fitted[0])return {...state,fitted:[true]};
  if(action.type==='unfit'&&action.index===0&&state.fitted[0])return {...state,fitted:[false]};
  if(action.type==='submit'){
   const opened=state.fitted[0]&&booksFit(state.order);
   return {...state,attempts:Math.min(999,state.attempts+1),opened,fitted:[opened?false:state.fitted[0]]};
  }
  if(!state.fitted[0])return state;
  const order=action.type==='reorder'?reorder(state.order,action.from,action.to):action.type==='shift'?moveAdjacent(state.order,action.index,action.direction):state.order;
  return same(order,state.order)?state:{...state,order};
 },
 solved:state=>state.opened&&booksFit(state.order),
};
