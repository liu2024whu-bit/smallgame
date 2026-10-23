import { pointerSession, dragGhost } from './pointer.js';

const SELECTORS = { paper: '.operation-piece', paperBack: '.loose-stamp', books: '.book-slot', film: '.film-frame', album: '.loose-page' };

export function bindReorder(root, id, move) {
  const selector = SELECTORS[id];
  if (!selector) return () => {};
  const pieces = [...root.querySelectorAll(selector)];
  pieces.forEach((piece, index) => { piece.dataset.reorder = index; piece.classList.add('can-drag'); });
  return pointerSession(root, {
    pick(event) {
      const button=event.target.closest('button');
      if (button && !button.matches('.film-inspect, .page-face')) return null;
      const source = event.target.closest('[data-reorder]');
      return source ? { source, from: Number(source.dataset.reorder) } : null;
    },
    start(gesture) {
      const box = gesture.source.getBoundingClientRect();
      gesture.ghost = dragGhost(gesture.source, `reorder-ghost ${gesture.source.className}`);
      gesture.ghost.style.width = `${box.width}px`;
      gesture.ghost.style.height = `${box.height}px`;
      gesture.source.classList.add('drag-source');
    },
    move(gesture, event) {
      gesture.ghost.style.left = `${event.clientX - gesture.ghost.offsetWidth / 2}px`;
      gesture.ghost.style.top = `${event.clientY - 35}px`;
      const hit = pieces.find(piece => { const box = piece.getBoundingClientRect(); return event.clientX >= box.left - 8 && event.clientX <= box.right + 8 && event.clientY >= box.top - 40 && event.clientY <= box.bottom + 40; });
      gesture.to = hit ? Number(hit.dataset.reorder) : null;
      pieces.forEach(piece => piece.classList.toggle('drop-target', piece === hit));
    },
    end(gesture, _, cancelled) { if (!cancelled && gesture.to !== null) move({ type: 'reorder', from: gesture.from, to: gesture.to }); },
    clear() { pieces.forEach(piece => piece.classList.remove('drag-source', 'drop-target')); },
  });
}
