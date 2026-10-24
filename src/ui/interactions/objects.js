import { pointerSession, dragGhost } from './pointer.js';
import { bindMusic } from './music.js';

export function bindObjects(root, id, move, progress) {
  if (id === 'balance') return bindWeights(root, move);
  if (id === 'melody') return bindMusic(root, progress, move);
  return () => {};
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
