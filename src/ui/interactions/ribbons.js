import { RIBBON_PATHS } from '../../data/birthday-workshop.js';
import { pointerSession } from './pointer.js';
import { blockedMove } from './feedback.js';
import { announce } from '../dom.js';

export function bindRibbons(root,progress,move) {
  const field=root.querySelector('[data-ribbon-field]');if(!field)return ()=>{};
  return pointerSession(root,{
    pick(event){const source=event.target.closest('[data-ribbon-tail]');if(!source)return null;const index=Number(source.dataset.ribbonTail),[a,b]=RIBBON_PATHS[Number(progress.back)][index];return {source,index,direction:[Math.sign(b[0]-a[0]),Math.sign(b[1]-a[1])],line:field.querySelector(`[data-ribbon-line="${index}"]`)};},
    move(gesture,event){const dx=event.clientX-gesture.x,dy=event.clientY-gesture.y;gesture.distance=dx*gesture.direction[0]+dy*gesture.direction[1];const pull=Math.max(-10,Math.min(24,gesture.distance));gesture.source.style.translate=`${pull*gesture.direction[0]}px ${pull*gesture.direction[1]}px`;gesture.line.style.opacity=String(1-Math.max(0,pull)/120);},
    end(gesture,_,cancelled){if(cancelled||gesture.distance<14)return;if(!move({type:'pull',index:gesture.index})){blockedMove(gesture.source);announce('还被别的纸带压着呢。');}},
    clear(){root.querySelectorAll('[data-ribbon-tail]').forEach(el=>el.style.removeProperty('translate'));field.querySelectorAll('[data-ribbon-line]').forEach(el=>el.style.removeProperty('opacity'));},
  });
}
