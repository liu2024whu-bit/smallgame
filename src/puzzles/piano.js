import {bounded,indexIn,permutation,reorder,same} from './common.js';
import {PIANO_FRAGMENTS,PIANO_ORDER,PIANO_RESPONSE} from '../data/piano.js';

export const pianoScoreFits=state=>same(state.order,PIANO_ORDER)&&state.faces.every((face,id)=>face===PIANO_FRAGMENTS[id].face);
export const piano={
 create:()=>({order:[0,1,2,3],faces:[0,0,0,0],played:[],attempts:0,opened:false}),
 valid:s=>permutation(s?.order,4)&&bounded(s.faces,4,2)&&Array.isArray(s.played)&&s.played.length<=8&&s.played.every(n=>indexIn(n,25))&&Number.isSafeInteger(s.attempts)&&s.attempts>=0&&typeof s.opened==='boolean'&&(!s.opened||pianoScoreFits(s)&&same(s.played,PIANO_RESPONSE)),
 move(s,a){
  if(s.opened)return s;
  if(a.type==='reorder'&&indexIn(a.from,4)&&indexIn(a.to,4)&&a.from!==a.to)return {...s,order:reorder(s.order,a.from,a.to)};
  if(a.type==='flip'&&indexIn(a.index,4))return {...s,faces:s.faces.map((v,i)=>i===a.index?1-v:v)};
  if(a.type==='play'&&indexIn(a.note,25))return {...s,played:[...s.played,a.note].slice(-8)};
  if(a.type==='clear'&&s.played.length)return {...s,played:[]};
  if(a.type==='submit')return {...s,attempts:Math.min(Number.MAX_SAFE_INTEGER,s.attempts+1),opened:pianoScoreFits(s)&&same(s.played,PIANO_RESPONSE)};
  return s;
 },
 solved:s=>s.opened,
};
