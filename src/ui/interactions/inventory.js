import { pointerSession, dragGhost } from './pointer.js';
import { itemSprite } from '../dom.js';
import { ITEMS } from '../../data/items.js';
import { roomToolTarget, toolFor } from '../../data/tool-uses.js';

export function bindInventoryUse(root,{getState,owns,use}) {
  let target;
  const clear=()=>{target?.classList.remove('tool-drop-ready','tool-drop-wrong');target=null;};
  const destination=(element,item)=>element?.dataset.toolTarget||roomToolTarget(getState(),element?.dataset.id,item);
  function locate(event,item){
    clear();const candidates=[];
    let under=event&&document.elementFromPoint(event.clientX,event.clientY)?.closest('[data-tool-target],.hotspot');
    // Explicit transparent mounting sockets may overlap at a small scale.
    // Search that declared group only; solid covers still block the drop.
    if(under?.hasAttribute('data-tool-overlap'))for(const element of document.elementsFromPoint(event.clientX,event.clientY)){
      const socket=element.closest('[data-tool-overlap][data-tool-target]');if(socket&&!candidates.includes(socket))candidates.push(socket);
    }
    while(under){candidates.push(under);under=under.parentElement?.closest('[data-tool-target],.hotspot');}
    target=candidates.find(el=>toolFor(destination(el,item))===item)??candidates[0];
    if(toolFor(destination(target,item))!==item){
      const scope=root.querySelector('dialog[open]')??root,near=[];
      for(const el of scope.querySelectorAll('[data-tool-target]')){
        if(el.disabled||el.closest('[inert],[hidden],[data-inventory-drag]')||toolFor(destination(el,item))!==item)continue;
        const box=el.getBoundingClientRect();if(!box.width||!box.height||getComputedStyle(el).visibility==='hidden')continue;
        let left=Math.max(0,box.left),right=Math.min(innerWidth,box.right),top=Math.max(0,box.top),bottom=Math.min(innerHeight,box.bottom);
        for(let parent=el.parentElement;parent&&parent!==scope.parentElement;parent=parent.parentElement){const s=getComputedStyle(parent),b=parent.getBoundingClientRect();if(['hidden','clip','auto','scroll'].includes(s.overflowX)){left=Math.max(left,b.left);right=Math.min(right,b.right);}if(['hidden','clip','auto','scroll'].includes(s.overflowY)){top=Math.max(top,b.top);bottom=Math.min(bottom,b.bottom);}}
        if(right<=left||bottom<=top)continue;
        const distance=Math.hypot(Math.max(left-event.clientX,0,event.clientX-right),Math.max(top-event.clientY,0,event.clientY-bottom));
        // A narrow edge allowance helps a real drag land, without reaching
        // through an opaque cover or seeking a target elsewhere on screen.
        if(distance>0&&distance<=12)near.push({el,distance});
      }
      near.sort((a,b)=>a.distance-b.distance);if(near.length&&(near.length===1||near[1].distance-near[0].distance>2))target=near[0].el;
    }
    const place=destination(target,item);if(target)target.classList.add(toolFor(place)===item?'tool-drop-ready':'tool-drop-wrong');
    return place;
  }
  return pointerSession(root,{
    pick(event){const source=event.target.closest('[data-inventory-drag]'),id=source?.dataset.inventoryDrag;if(!id||!owns(id))return null;const box=(source.querySelector('.item-art')??source).getBoundingClientRect();const onArt=event.clientX>=box.left&&event.clientX<=box.right&&event.clientY>=box.top&&event.clientY<=box.bottom;return {source,id,box,grab:onArt?[(event.clientX-box.left)/box.width,(event.clientY-box.top)/box.height]:[.5,.5]};},
    start(gesture){
      gesture.ghost=dragGhost(itemSprite(ITEMS[gesture.id].sprite),'inventory-ghost');root.dataset.dragItem=gesture.id;
      const scale=90/Math.max(gesture.box.width,gesture.box.height);gesture.size=[gesture.box.width*scale,gesture.box.height*scale];
      gesture.ghost.style.width=gesture.size[0]+'px';gesture.ghost.style.height=gesture.size[1]+'px';
      const art=gesture.ghost.firstElementChild;art.style.width='100%';art.style.height='100%';art.style.maxHeight='none';
    },
    move(gesture,event){
      gesture.ghost.style.left=`${event.clientX-gesture.grab[0]*gesture.size[0]}px`;gesture.ghost.style.top=`${event.clientY-gesture.grab[1]*gesture.size[1]}px`;
      locate(event,gesture.id);
    },
    end(gesture,event,cancelled){if(cancelled)return;const place=locate(event,gesture.id);if(!place||toolFor(place)!==gesture.id)gesture.returnToSource=true;if(place){const b=gesture.ghost.getBoundingClientRect();use(gesture.id,place,{left:b.left,top:b.top,width:b.width,height:b.height,grab:[...gesture.grab]});}},
    clear(){clear();delete root.dataset.dragItem;},
  });
}
