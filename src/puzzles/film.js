import {bounded,indexIn,moveAdjacent,reorder,permutation,same} from './common.js';

// Fixed photographs: feeding from the other end reads the same poses backwards.
// Reordering never executes instructions hidden in a photographed frame.
export const FILM_START=Object.freeze([0,0,0,0]);
export const FILM_RECORDINGS=Object.freeze([
 {before:[1,1,0,0],after:[1,1,1,0],time:[.35,.68],turns:[[2,.28,.7]]},
 {before:[0,0,0,0],after:[1,1,0,0],time:[0,.35],turns:[[0,.15,.55],[1,.38,.82]]},
 {before:[1,1,1,0],after:[1,0,1,0],time:[.68,1],turns:[[1,.22,.78]]},
]);
export const FILM_ORDER=Object.freeze([1,0,2]);
export const FRAME_PERFORATIONS=Object.freeze([2,3,1]);
export function filmEnds(id,reverse=false){const clip=FILM_RECORDINGS[id];return reverse?{before:clip.after,after:clip.before}:{before:clip.before,after:clip.after};}
export function filmContinuity(order,reverse=[false,false,false]){
 let pose=FILM_START;const joins=[];
 for(const id of order){const ends=filmEnds(id,reverse[id]);joins.push(same(pose,ends.before));pose=ends.after;}
 return {joins,end:[...pose],complete:joins.every(Boolean)};
}
export const replayFilm=(order,reverse)=>filmContinuity(order,reverse).end;
export const filmHeights=order=>order.map(id=>FRAME_PERFORATIONS[id]);
export const PAGE_FACES=Object.freeze(replayFilm(FILM_ORDER));
export const filmConfigured=state=>filmContinuity(state.order,state.reverse).complete&&same(state.faces,PAGE_FACES);
const booleans=(values,count)=>Array.isArray(values)&&values.length===count&&values.every(v=>typeof v==='boolean');
export const film={
 create:()=>({order:[2,0,1],reverse:[true,false,true],faces:[0,0,0,0],fitted:[false],opened:false,attempts:0}),
 valid(state){return permutation(state?.order,3)&&bounded(state.faces,4,2)&&booleans(state.reverse,3)&&booleans(state.fitted,1)&&typeof state.opened==='boolean'&&Number.isInteger(state.attempts)&&state.attempts>=0&&state.attempts<=999&&(!state.opened||state.attempts>0&&filmConfigured(state));},
 move(state,action){
  if(action.type==='unfit'&&action.index===0)return {...state,fitted:[false]};
  if(action.type==='fit'&&action.index===0)return {...state,fitted:[true]};
  if(state.opened)return state;
  if(action.type==='flip'&&indexIn(action.index,4))return {...state,faces:state.faces.map((v,i)=>i===action.index?1-v:v)};
  if(action.type==='submit')return {...state,opened:state.fitted[0]&&filmConfigured(state),attempts:Math.min(999,state.attempts+1)};
  if(!state.fitted[0])return state;
  if(action.type==='reorder')return {...state,order:reorder(state.order,action.from,action.to)};
  if(action.type==='shift')return {...state,order:moveAdjacent(state.order,action.index,action.direction)};
  if(action.type==='reverse'&&indexIn(action.index,3))return {...state,reverse:state.reverse.map((v,i)=>i===action.index?!v:v)};
  return state;
 },
 solved:state=>state.opened&&filmConfigured(state),
};
