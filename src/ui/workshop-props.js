import { SUGAR_NAMES, OPEN_LOCK_WINDOWS } from '../data/birthday-workshop.js';
import { character } from './dom.js';

export const sugarArt=(type,className='')=>character('birthdayProps',type,3,3,SUGAR_NAMES[type]??'蝴蝶结',className);
export const cropPosition=(point,crop)=>[(point[0]-crop[0])/crop[2]*100,(point[1]-crop[1])/crop[3]*100];
export function openBoxNumbers(values,crop) {
  return OPEN_LOCK_WINDOWS.map((rect,index)=>{const [x,y]=cropPosition(rect,crop);return `<span class="open-lock-number" aria-hidden="true" style="left:${x}%;top:${y}%;width:${rect[2]/crop[2]*100}%;height:${rect[3]/crop[3]*100}%"><b>${values[index]}</b></span>`;}).join('');
}
