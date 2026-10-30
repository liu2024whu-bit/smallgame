import { pointerSession, dragGhost } from './pointer.js';
const SELECTORS = { paper: '.operation-piece', paperBack: '.back-stamp', film: '.film-frame' };

export function bindReorder(root, id, move) {
  const selector = SELECTORS[id];
  if (!selector) return () => {};
  const pieces = [...root.querySelectorAll(selector)];
  pieces.forEach((piece, index) => { piece.dataset.reorder = index; piece.classList.add('can-drag'); });
  return pointerSession(root, {
    pick(event) {
      const button=event.target.closest('button');
      if (button && !button.matches('.film-inspect')) return null;
      const source = event.target.closest('[data-reorder]');
      return source && !source.closest('[inert]') && source.getAttribute('aria-disabled')!=='true' ? { source, from: Number(source.dataset.reorder) } : null;
    },
    start(gesture) {
      const box = gesture.source.getBoundingClientRect();
      gesture.boxes = pieces.map(piece => piece.getBoundingClientRect());
      gesture.positions=pieces.map(piece=>[piece.offsetLeft,piece.offsetTop]);
      gesture.grabX = gesture.x - box.left; gesture.grabY = gesture.y - box.top;
      gesture.ghost = dragGhost(gesture.source, `reorder-ghost ${gesture.source.className}`);
      gesture.ghost.style.width = `${box.width}px`;
      gesture.ghost.style.height = `${box.height}px`;
      gesture.source.classList.add('drag-source');
    },
    move(gesture, event) {
      gesture.ghost.style.left = `${event.clientX - gesture.grabX}px`;
      gesture.ghost.style.top = `${event.clientY - gesture.grabY}px`;
      const hit = gesture.boxes.findIndex(box => event.clientX >= box.left - 8 && event.clientX <= box.right + 8 && event.clientY >= box.top - 40 && event.clientY <= box.bottom + 40);
      gesture.to = hit < 0 ? null : hit;
      pieces.forEach((piece, index) => {
        piece.classList.toggle('drop-target', index === hit);
        const shifted = hit >= 0 && index !== gesture.from && (gesture.from < hit ? index > gesture.from && index <= hit : index >= hit && index < gesture.from);
        const destination=gesture.positions[shifted?index+(gesture.from<hit?-1:1):index],origin=gesture.positions[index];
        piece.style.translate = `${destination[0]-origin[0]}px ${destination[1]-origin[1]}px`;
      });
    },
    end(gesture, _, cancelled) { if (!cancelled && gesture.to !== null) move({ type: 'reorder', from: gesture.from, to: gesture.to }); else gesture.returnToSource=true; },
    clear() { pieces.forEach(piece => { piece.classList.remove('drag-source', 'drop-target'); piece.style.removeProperty('translate'); }); },
  });
}
