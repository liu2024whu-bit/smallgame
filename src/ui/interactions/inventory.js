import { pointerSession, dragGhost } from './pointer.js';
import { itemSprite } from '../dom.js';
import { ITEMS } from '../../data/items.js';
import { ROOM_TOOL_TARGETS, toolFor } from '../../data/tool-uses.js';

export function bindInventoryUse(root,{scene,owns,use}) {
  let target;
  const clear=()=>{target?.classList.remove('tool-drop-ready','tool-drop-wrong');target=null;};
  return pointerSession(root,{
    pick(event){const source=event.target.closest('[data-inventory-drag]');const id=source?.dataset.inventoryDrag;return id&&owns(id)?{source,id}:null;},
    start(gesture){gesture.ghost=dragGhost(itemSprite(ITEMS[gesture.id].sprite),'inventory-ghost');},
    move(gesture,event){gesture.ghost.style.left=`${event.clientX-45}px`;gesture.ghost.style.top=`${event.clientY-45}px`;clear();const under=document.elementFromPoint(event.clientX,event.clientY);target=under?.closest('[data-tool-target],.hotspot');gesture.target=target?.dataset.toolTarget||ROOM_TOOL_TARGETS[`${scene()}:${target?.dataset.id}`];if(target)target.classList.add(toolFor(gesture.target)===gesture.id?'tool-drop-ready':'tool-drop-wrong');},
    end(gesture,_,cancelled){if(!cancelled&&gesture.target)use(gesture.id,gesture.target);},
    clear,
  });
}
