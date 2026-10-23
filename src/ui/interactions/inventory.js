import { pointerSession, dragGhost } from './pointer.js';
import { itemSprite } from '../dom.js';
import { ITEMS } from '../../data/items.js';
import { roomToolTarget, toolFor } from '../../data/tool-uses.js';

export function bindInventoryUse(root,{scene,owns,use}) {
  let target;
  const clear=()=>{target?.classList.remove('tool-drop-ready','tool-drop-wrong');target=null;};
  const destination=(element,item)=>element?.dataset.toolTarget||roomToolTarget(scene(),element?.dataset.id,item);
  return pointerSession(root,{
    pick(event){const source=event.target.closest('[data-inventory-drag]');const id=source?.dataset.inventoryDrag;return id&&owns(id)?{source,id}:null;},
    start(gesture){gesture.ghost=dragGhost(itemSprite(ITEMS[gesture.id].sprite),'inventory-ghost');},
    move(gesture,event){
      gesture.ghost.style.left=`${event.clientX-45}px`;gesture.ghost.style.top=`${event.clientY-45}px`;clear();
      const candidates=[];let under=document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-tool-target],.hotspot');
      while(under){candidates.push(under);under=under.parentElement?.closest('[data-tool-target],.hotspot');}
      target=candidates.find(el=>toolFor(destination(el,gesture.id))===gesture.id)??candidates[0];gesture.target=destination(target,gesture.id);
      if(target)target.classList.add(toolFor(gesture.target)===gesture.id?'tool-drop-ready':'tool-drop-wrong');
    },
    end(gesture,_,cancelled){if(cancelled)return;if(!gesture.target||toolFor(gesture.target)!==gesture.id)gesture.returnToSource=true;if(gesture.target)use(gesture.id,gesture.target);},
    clear,
  });
}
