import {FLIP_QUADS,FLIP_BLESSINGS} from '../data/flip-apparatus.js';
import {atlas} from './dom.js';
import {matrixStyle} from './raster-plane.js';
export function flipModel(p,{done=false,passive=false,flower=-1}={}){
 return atlas('flipCase',0,{className:'flip-case-paint'})+p.tiles.map((back,index)=>{
  const active=!passive&&(flower<0||flower===index),tag=active?'button':'span',name=FLIP_BLESSINGS[index][0];
  const action=!active?'inert aria-hidden="true"':done?`data-flower-look="${index}" aria-label="靠近看看${name}"`:`data-pmove='{"type":"flip","index":${index}}' aria-label="翻动第${index+1}片，当前${back?'叶背':name}" aria-keyshortcuts="Enter Space"`;
  return `<span class="flip-mount" style="transform:${matrixStyle(FLIP_QUADS[index],256,256)}"><${tag} class="flip-tile" ${active?`data-focus="flip-${index}"`:''} ${action}><span class="flip-turn" data-flip-face="${index}" style="transform:perspective(900px) rotateY(${back*180}deg)"><span class="flip-face-front">${atlas('flipFaces',index)}</span><span class="flip-face-back">${atlas('flipFaces',9)}</span></span></${tag}></span>`;
 }).join('');
}
