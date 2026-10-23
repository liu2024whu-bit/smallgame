import { PACK_COLS, PACK_ROWS, pieceTiles, fitsPiece } from '../../puzzles/packing.js';
import { miniature } from '../puzzles/packing.js';
import { announce } from '../dom.js';
import { pointerSession, dragGhost } from './pointer.js';
import { motionAllowed } from '../../services/motion.js';

export function bindPacking(root, progress, move) {
  const board = root.querySelector('.packing-grid');
  if (!board) return () => {};
  const cells = [...board.querySelectorAll('[data-pack-cell]')];
  const clear = () => cells.forEach(cell => cell.classList.remove('drop-valid', 'drop-invalid', 'drag-source'));
  const update = (gesture, event) => {
    const box = board.getBoundingClientRect();
    const first = cells[0].getBoundingClientRect();
    const next = cells[1].getBoundingClientRect();
    const step = next.left - first.left;
    const column = Math.floor((event.clientX - first.left) / step) - gesture.grabColumn;
    const row = Math.floor((event.clientY - first.top) / step) - gesture.grabRow;
    gesture.inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    gesture.position = { row, column, turn: gesture.turn };
    gesture.valid = gesture.inside && fitsPiece(progress.placed, gesture.id, gesture.position);
    clear();
    cells.filter(cell => Number(cell.dataset.packId) === gesture.id).forEach(cell => cell.classList.add('drag-source'));
    for (const tile of pieceTiles(gesture.id, gesture.turn)) {
      const r = tile.row + row, c = tile.column + column;
      if (r >= 0 && r < PACK_ROWS && c >= 0 && c < PACK_COLS) cells[r * PACK_COLS + c].classList.add(gesture.valid ? 'drop-valid' : 'drop-invalid');
    }
    gesture.ghost.style.setProperty('--unit', `${step}px`);
    gesture.ghost.style.left = `${event.clientX - (gesture.grabColumn + .5) * step}px`;
    gesture.ghost.style.top = `${event.clientY - (gesture.grabRow + .5) * step}px`;
    gesture.last = event;
  };
  return pointerSession(root, {
    pick(event) {
      const source = event.target.closest('[data-pack-id]');
      if (!source || source.disabled) return null;
      const id = Number(source.dataset.packId);
      const position = progress.placed[id];
      const index = Number(source.dataset.packCell);
      const turn = id === progress.selected ? progress.turn : position?.turn ?? 0;
      let grabRow = source.hasAttribute('data-pack-cell') ? Math.floor(index / PACK_COLS) - position.row : 0;
      let grabColumn = source.hasAttribute('data-pack-cell') ? index % PACK_COLS - position.column : 0;
      const hit=event.target.closest('.mini-filled'),mini=hit?.parentElement;
      if(hit&&mini){const columns=Number(mini.style.getPropertyValue('--mini-cols')),cell=[...mini.children].indexOf(hit);grabRow=Math.floor(cell/columns);grabColumn=cell%columns;}
      const grabbed=pieceTiles(id,turn).find(tile=>tile.row===grabRow&&tile.column===grabColumn)??pieceTiles(id,turn)[0];
      grabRow=grabbed.row;grabColumn=grabbed.column;
      const grabPrint = grabbed.print;
      return { id, source, turn, grabRow, grabColumn, grabPrint, fromBoard: source.hasAttribute('data-pack-cell') };
    },
    start(gesture) { gesture.ghost = dragGhost(miniature(pieceTiles(gesture.id, gesture.turn)), 'packing-ghost'); },
    move: update,
    key(gesture, event) {
      if (event.key.toLowerCase() !== 'r') return;
      event.preventDefault();
      gesture.turn = (gesture.turn + 1) % 4;
      const grabbed = pieceTiles(gesture.id, gesture.turn).find(tile => tile.print === gesture.grabPrint);
      gesture.grabRow = grabbed.row; gesture.grabColumn = grabbed.column;
      gesture.ghost.innerHTML = miniature(pieceTiles(gesture.id, gesture.turn));
      update(gesture, gesture.last);
    },
    end(gesture, _, cancelled) {
      if (cancelled) return;
      if (gesture.valid) move({ type: 'drop', id: gesture.id, ...gesture.position });
      else if (!gesture.inside && gesture.fromBoard) move({ type: 'unplace', id: gesture.id });
      else { gesture.returnToSource=true;announce('好像挤不进去。'); if (motionAllowed()) board.animate([{ translate: '-3px' }, { translate: '3px' }, { translate: '0' }], { duration: 180 }); }
    },
    clear,
  });
}
