import {PACK_COLS,PACK_ROWS,pieceTiles,fitsPiece,pictureFits,visiblePackingTurn} from '../../puzzles/packing.js';
import {gripFraction,turnGrip} from '../../data/packing-apparatus.js';
import { miniature } from '../puzzles/packing.js';
import { announce } from '../dom.js';
import { pointerSession, dragGhost } from './pointer.js';
import { motionAllowed } from '../../services/motion.js';

export function bindPacking(root, progress, move) {
  const board = root.querySelector('.packing-grid');
  if (!board) return () => {};
  const cells = [...board.querySelectorAll('[data-pack-cell]')];
  const controller=new AbortController();
  const clear = () => {cells.forEach(cell => cell.classList.remove('drop-valid', 'drop-invalid', 'drag-source'));root.querySelectorAll('[data-pack-rack]').forEach(el=>el.classList.remove('drag-source'));};
  const update = (gesture, event) => {
    const box = board.getBoundingClientRect();
    const first = cells[0].getBoundingClientRect();
    const next = cells[1].getBoundingClientRect();
    const step = next.left - first.left;
    const column = Math.round((event.clientX-first.left)/step-gesture.grabColumn-gesture.u);
    const row = Math.round((event.clientY-first.top)/step-gesture.grabRow-gesture.v);
    gesture.inside = event.clientX >= box.left && event.clientX <= box.right && event.clientY >= box.top && event.clientY <= box.bottom;
    gesture.position = { row, column, turn: gesture.turn };
    gesture.valid = gesture.inside && fitsPiece(progress.placed, gesture.id, gesture.position);
    clear();
    if(gesture.fromBoard)cells.filter(cell => Number(cell.dataset.packId) === gesture.id).forEach(cell => cell.classList.add('drag-source'));
    else gesture.source.classList.add('drag-source');
    for (const tile of pieceTiles(gesture.id, gesture.turn)) {
      const r = tile.row + row, c = tile.column + column;
      if (r >= 0 && r < PACK_ROWS && c >= 0 && c < PACK_COLS) cells[r * PACK_COLS + c].classList.add(gesture.valid ? 'drop-valid' : 'drop-invalid');
    }
    gesture.ghost.style.setProperty('--unit', `${step}px`);
    gesture.ghost.style.left = `${event.clientX - (gesture.grabColumn + gesture.u) * step}px`;
    gesture.ghost.style.top = `${event.clientY - (gesture.grabRow + gesture.v) * step}px`;
    gesture.last = {clientX:event.clientX,clientY:event.clientY};
  };
  const dispose=pointerSession(root, {
    pick(event) {
      const source = event.target.closest('[data-pack-id]');
      if (!source || source.disabled) return null;
      const id = Number(source.dataset.packId);
      const position = progress.placed[id];
      if(position&&!source.hasAttribute('data-pack-cell'))return null;
      const index = Number(source.dataset.packCell);
      const turn = visiblePackingTurn(progress,id);
      let grabRow = source.hasAttribute('data-pack-cell') ? Math.floor(index / PACK_COLS) - position.row : 0;
      let grabColumn = source.hasAttribute('data-pack-cell') ? index % PACK_COLS - position.column : 0;
      const hit=event.target.closest('.mini-filled'),mini=hit?.parentElement;
      if(hit&&mini){const columns=Number(mini.style.getPropertyValue('--mini-cols')),cell=[...mini.children].indexOf(hit);grabRow=Math.floor(cell/columns);grabColumn=cell%columns;}
      const grabbed=pieceTiles(id,turn).find(tile=>tile.row===grabRow&&tile.column===grabColumn)??pieceTiles(id,turn)[0];
      grabRow=grabbed.row;grabColumn=grabbed.column;
      const grabPrint = grabbed.print;
      const rect=(source.hasAttribute('data-pack-cell')?source:hit)?.getBoundingClientRect();
      return { id, source, turn, grabRow, grabColumn, grabPrint, fromBoard: source.hasAttribute('data-pack-cell'),u:rect?gripFraction(event.clientX,rect.left,rect.width):.5,v:rect?gripFraction(event.clientY,rect.top,rect.height):.5 };
    },
    start(gesture) { gesture.ghost = dragGhost(miniature(pieceTiles(gesture.id, gesture.turn)), 'packing-ghost'); },
    move: update,
    key(gesture, event) {
      if (event.key.toLowerCase() !== 'r') return;
      event.preventDefault();
      const previous=gesture.ghost.querySelector('.piece-mini'),matrix=new DOMMatrix(getComputedStyle(previous).transform),angle=Math.atan2(matrix.b,matrix.a)*180/Math.PI;
      gesture.turn = (gesture.turn + 1) % 4;
      Object.assign(gesture,turnGrip(gesture));
      const grabbed = pieceTiles(gesture.id, gesture.turn).find(tile => tile.print === gesture.grabPrint);
      gesture.grabRow = grabbed.row; gesture.grabColumn = grabbed.column;
      gesture.ghost.innerHTML = miniature(pieceTiles(gesture.id, gesture.turn));
      update(gesture, gesture.last);
      if(motionAllowed()){const mini=gesture.ghost.querySelector('.piece-mini'),unit=parseFloat(gesture.ghost.style.getPropertyValue('--unit'));mini.style.transformOrigin=((gesture.grabColumn+gesture.u)*unit)+'px '+((gesture.grabRow+gesture.v)*unit)+'px';mini.animate([{transform:`rotate(${angle-90}deg)`},{transform:'rotate(0deg)'}],{duration:180,easing:'cubic-bezier(.2,.65,.25,1)'});}
    },
    end(gesture, _, cancelled) {
      if (cancelled) return;
      if (gesture.valid) {const placed=progress.placed.map((p,id)=>id===gesture.id?gesture.position:p);move({type:'drop',id:gesture.id,...gesture.position});if(placed.every(Boolean)&&!pictureFits(placed))announce('都放下了，画似乎还没接上。');}
      else if (!gesture.inside && gesture.fromBoard) move({ type: 'unplace', id: gesture.id });
      else { gesture.returnToSource=true;announce('这儿有点挤。'); if (motionAllowed()) board.animate([{ translate: '-2px' }, { translate: '2px' }, { translate: '0' }], { duration: 170 }); }
    },
    clear,
  });
  root.addEventListener('keydown',event=>{
    if(root.classList.contains('is-dragging')||event.ctrlKey||event.metaKey||event.altKey)return;
    const cell=event.target.closest('[data-pack-cell]');
    if(cell){const index=Number(cell.dataset.packCell),r=Math.floor(index/PACK_COLS),c=index%PACK_COLS,target={ArrowLeft:r*PACK_COLS+Math.max(0,c-1),ArrowRight:r*PACK_COLS+Math.min(PACK_COLS-1,c+1),ArrowUp:Math.max(0,r-1)*PACK_COLS+c,ArrowDown:Math.min(PACK_ROWS-1,r+1)*PACK_COLS+c,Home:r*PACK_COLS,End:r*PACK_COLS+PACK_COLS-1}[event.key];if(target!==undefined){event.preventDefault();cells[target].focus();return;}}
    if(event.key.toLowerCase()==='r'&&event.target.closest('.packing-workbench')){event.preventDefault();if(progress.placed[progress.selected])announce('拿近了，才好转身。');else move({type:'rotate'});}
  },{signal:controller.signal});
  return()=>{dispose();controller.abort();};
}
