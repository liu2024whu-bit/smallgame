import {storyPosition} from './story.js';
import {PUZZLES} from '../data/puzzles.js';

export const MAX_SAVE_SLOTS=32;
export const SLOT_ID=/^[a-zA-Z0-9-]{8,80}$/;
export function saveName(value,fallback='新的开始'){
 const name=typeof value==='string'?value.normalize('NFC').replace(/[\u0000-\u001f\u007f]/g,'').replace(/\s+/g,' ').trim():'';
 return Array.from(name||fallback).slice(0,32).join('');
}
export function uniqueSaveName(value,names){
 const base=saveName(value),used=new Set(names.map(n=>n.toLocaleLowerCase()));
 if(!used.has(base.toLocaleLowerCase()))return base;
 for(let n=2;n<=MAX_SAVE_SLOTS+1;n++){
  const name=Array.from(base).slice(0,26).join('')+`（${n}）`;
  if(!used.has(name.toLocaleLowerCase()))return name;
 }
 throw Error('No available save name');
}
export function summarizeSave(state){
 const {chapter,place}=storyPosition(state);
 return {scene:state.scene,place,chapter:state.begun?chapter:'还没进屋',begun:state.begun,ending:state.ending,solved:state.solved.length,total:PUZZLES.length,items:state.collected.length};
}
export function saveFolderName(name){
 let folder=saveName(name).replace(/[<>:"/\\|?*]/g,' ').replace(/[. ]+$/g,'').trim();
 if(!folder||/^(con|prn|aux|nul|com[0-9]|lpt[0-9])(?:\.|$)/i.test(folder))folder='小屋进度';
 return folder;
}
