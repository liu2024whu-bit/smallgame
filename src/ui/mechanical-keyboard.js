import {KEYBOARD_KEYS,KEYBOARD_UNITS,letterKeyAction} from '../data/keyboard.js';
import {KEYBED_QUAD} from '../data/wordlock.js';
import {atlas,escape} from './dom.js';
import {matrixStyle,mappedPlaneStyle} from './raster-plane.js';

const frames=new Map([[1,1],[1.25,2],[1.5,3],[1.75,4],[2,5],[2.25,6],[2.75,7],[6.25,8]]);
function keyArt(key){
 if(key.h>1)return `<span class="mechanical-key-art tall-key" aria-hidden="true">${[10,11,12].map((frame,i)=>atlas('wordlockKeyParts',frame,{className:['tall-head','tall-middle','tall-foot'][i]})).join('')}</span>`;
 return `<span class="mechanical-key-art" aria-hidden="true">${atlas('wordlockKeyParts',frames.get(key.w)??1)}</span>`;
}
export function mechanicalKeyboard(progress,bedQuad,{passive=false}={}){
 const {width,height,unit}=KEYBOARD_UNITS;
 const keys=KEYBOARD_KEYS.map(key=>{
  const action=letterKeyAction(key.id,progress.cursor),tag=!passive&&action&&!progress.opened?'button':'span';
  const attrs=tag==='button'?`data-pmove='${JSON.stringify(action)}' data-mechanical-key="${escape(key.id)}" data-focus="mechanical-key-${escape(key.id)}" aria-label="${escape(key.label)}"`:'';
  return `<${tag} class="mechanical-key ${action?'input-key':''}" ${attrs} style="left:${key.x*unit}px;top:${key.y*unit}px;width:${key.w*unit}px;height:${key.h*unit}px">${keyArt(key)}<span class="mechanical-key-legend ${key.label.length>3?'small-legend':''}">${escape(key.label)}</span></${tag}>`;
 }).join('');
 return `<div class="mechanical-keyboard-projected" ${passive?'inert aria-hidden="true"':''}><div class="mechanical-keyboard-source" style="transform:${mappedPlaneStyle(KEYBED_QUAD,bedQuad)}">${atlas('wordlockKeyParts',0,{className:'mechanical-housing'})}</div><div class="mechanical-key-plane" style="width:${width*unit}px;height:${height*unit}px;transform:${matrixStyle(bedQuad,width*unit,height*unit)}">${keys}</div></div>`;
}
