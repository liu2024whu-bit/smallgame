import { pointerSession, dragGhost } from './pointer.js';

export function bindObjects(root, id, move) {
  if (id === 'balance') return bindWeights(root, move);
  if (id === 'melody') return bindPins(root, move);
  if (id === 'flowers') return bindBookmark(root, move);
  return () => {};
}

function bindBookmark(root, move) {
  const zones=[...root.querySelectorAll('.flower-column')];
  return pointerSession(root,{
    pick(event){const source=event.target.closest('[data-bookmark-grab]');return source?{source,index:-1}:null;},
    start(gesture){gesture.ghost=dragGhost(gesture.source,'bookmark-ghost');},
    move(gesture,event){
      gesture.ghost.style.left=`${event.clientX-15}px`;gesture.ghost.style.top=`${event.clientY-35}px`;
      gesture.index=zones.findIndex(zone=>{const b=zone.getBoundingClientRect();return event.clientX>=b.left&&event.clientX<=b.right&&event.clientY>=b.top&&event.clientY<=b.bottom;});
      zones.forEach((zone,index)=>zone.classList.toggle('drop-target',index===gesture.index));
    },
    end(gesture,_,cancelled){if(!cancelled)move({type:'set-pin',index:gesture.index});},
    clear(){zones.forEach(zone=>zone.classList.remove('drop-target'));},
  });
}

function bindWeights(root, move) {
  const weights = [...root.querySelectorAll('.weight-tray button')];
  const zones = [...root.querySelectorAll('[data-pan]')];
  weights.forEach((weight, index) => { weight.dataset.weight = index; });
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

function bindPins(root, move) {
  const original = [...root.querySelectorAll('.music-pin')].map(pin => [pin, pin.style.getPropertyValue('--note')]);
  return pointerSession(root, {
    pick(event) {
      const track = event.target.closest('.music-pin-track');
      return track ? { track, index: [...root.querySelectorAll('.music-pin-track')].indexOf(track) } : null;
    },
    move(gesture, event) {
      const box = gesture.track.getBoundingClientRect();
      gesture.note = Math.min(4, Math.max(0, Math.round((box.bottom - event.clientY - 12) / 30)));
      gesture.track.querySelector('.music-pin').style.setProperty('--note', gesture.note);
    },
    end(gesture, _, cancelled) { if (!cancelled) move({ type: 'set-note', index: gesture.index, note: gesture.note }); },
    clear() { original.forEach(([pin, note]) => pin.style.setProperty('--note', note)); },
  });
}
