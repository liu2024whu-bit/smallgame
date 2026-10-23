import { pointerSession, dragGhost } from './pointer.js';
import { bindMusic } from './music.js';

export function bindObjects(root, id, move, progress) {
  if (id === 'balance') return bindWeights(root, move);
  if (id === 'melody') return bindMusic(root, progress, move);
  if (id === 'flowers') return bindBookmark(root, move);
  return () => {};
}

function bindBookmark(root, move) {
  const zones=[...root.querySelectorAll('.flower-column-foot')],columns=[...root.querySelectorAll('.flower-column')],abort=new AbortController();
  const clearLinks=()=>columns.forEach(column=>column.classList.remove('flower-will-move'));
  const showLinks=event=>{const crank=event.target.closest('[data-flower-links]');if(!crank)return;const links=crank.dataset.flowerLinks.split(',').map(Number);columns.forEach((column,i)=>column.classList.toggle('flower-will-move',links.includes(i)&&!column.querySelector('.pinned')));};
  for(const type of ['pointerover','focusin'])root.addEventListener(type,showLinks,{signal:abort.signal});
  for(const type of ['pointerout','focusout'])root.addEventListener(type,clearLinks,{signal:abort.signal});
  const stop=pointerSession(root,{
    pick(event){const source=event.target.closest('[data-bookmark-grab]');return source?{source,index:-1}:null;},
    start(gesture){gesture.ghost=dragGhost(gesture.source,'bookmark-ghost');},
    move(gesture,event){
      gesture.ghost.style.left=`${event.clientX-15}px`;gesture.ghost.style.top=`${event.clientY-35}px`;
      gesture.index=zones.findIndex(zone=>{const b=zone.getBoundingClientRect();return event.clientX>=b.left-12&&event.clientX<=b.right+12&&event.clientY>=b.top-12&&event.clientY<=b.bottom+12;});
      zones.forEach((zone,index)=>zone.classList.toggle('drop-target',index===gesture.index));
    },
    end(gesture,_,cancelled){if(!cancelled)move({type:'set-pin',index:gesture.index});},
    clear(){zones.forEach(zone=>zone.classList.remove('drop-target'));},
  });
  return ()=>{stop();clearLinks();abort.abort();};
}

function bindWeights(root, move) {
  const zones = [...root.querySelectorAll('[data-pan]')];
  return pointerSession(root, {
    pick(event) { const source = event.target.closest('[data-weight]'); return source ? { source, index: Number(source.dataset.weight) } : null; },
    start(gesture) { gesture.ghost = dragGhost(gesture.source, 'weight-ghost'); },
    move(gesture, event) {
      gesture.ghost.style.left = `${event.clientX - 30}px`; gesture.ghost.style.top = `${event.clientY - 30}px`;
      const target = zones.find(zone => { const b = zone.getBoundingClientRect(); return event.clientX >= b.left && event.clientX <= b.right && event.clientY >= b.top && event.clientY <= b.bottom; });
      gesture.pan = target ? Number(target.dataset.pan) : null;
      zones.forEach(zone => zone.classList.toggle('drop-target', zone === target));
    },
    end(gesture, _, cancelled) { if (!cancelled && gesture.pan !== null) move({ type: 'place', index: gesture.index, pan: gesture.pan }); },
    clear() { zones.forEach(zone => zone.classList.remove('drop-target')); },
  });
}
