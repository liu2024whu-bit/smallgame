import { pointerSession } from './pointer.js';
import { blockedMove } from './feedback.js';

export function bindDrawers(root,progress,move) {
  return pointerSession(root,{
    pick(event){const source=event.target.closest('.drawer-unit button');if(!source)return null;const index=[...root.querySelectorAll('.drawer-unit button')].indexOf(source);return {source,index,opened:!!progress.open[index]};},
    move(gesture,event){const distance=Math.max(-14,Math.min(14,event.clientY-gesture.y));gesture.distance=distance;gesture.source.style.translate=`0 ${distance}px`;},
    end(gesture,_,cancelled){if(cancelled)return;const outward=gesture.distance>8,inward=gesture.distance< -8;if((!gesture.opened&&outward)||(gesture.opened&&inward))if(!move({type:'drawer',index:gesture.index}))blockedMove(gesture.source);},
    clear(){root.querySelectorAll('.drawer-unit button').forEach(el=>el.style.removeProperty('translate'));},
  });
}
