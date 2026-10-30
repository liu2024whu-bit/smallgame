import {WORD_NOTEBOOK} from '../data/wordlock.js';
import {worldQuad} from '../puzzles/word-geometry.js';
import {atlas} from './dom.js';
import {matrixStyle} from './raster-plane.js';
import {wordApparatus} from './wordlock-apparatus.js';
import {wordNotebook} from './wordlock-papers.js';

function backdropFace(index,w,h,quad){return `<div class="word-backdrop-face" style="width:${w}px;height:${h}px;transform:${matrixStyle(quad,w,h)}">${atlas('wordlockNear',index,{className:'word-face-paint'})}</div>`;}
export function wordDeskBackdrop(camera){
 return backdropFace(2,1000,178,worldQuad([[-900,620,500],[900,620,500],[900,620,0],[-900,620,0]],camera))+
  backdropFace(1,1000,650,worldQuad([[-900,620,0],[900,620,0],[900,-100,0],[-900,-100,0]],camera));
}
export function wordDesk(state,camera,{passive=false,controls='whole',contents='',notebook=true}={}){
 return (notebook?wordNotebook({quad:worldQuad(WORD_NOTEBOOK,camera),passive:true}):'')+wordApparatus(state.progress.wordlock,camera,{passive,controls,contents});
}
export function wordAssemblyReady(state){return state.progress.wordlock.opened&&['board','pageA','pageB','pageC','pageD'].every(id=>state.collected.includes(id));}
