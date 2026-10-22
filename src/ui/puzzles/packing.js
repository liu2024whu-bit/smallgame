import { PACK_COLS, PACK_ROWS, occupiedCells, pieceCells } from '../../puzzles/packing.js';
import { moveButton, escape } from '../dom.js';

function miniature(cells, id) {
  const rows = Math.max(...cells.map(([r]) => r)) + 1;
  const columns = Math.max(...cells.map(([, c]) => c)) + 1;
  return `<span class="piece-mini" style="--mini-cols:${columns};--mini-rows:${rows}">${Array.from({ length: rows * columns }, (_, index) => `<i class="${cells.some(([r, c]) => index === r * columns + c) ? `mini-filled piece-color-${id}` : ''}"></i>`).join('')}</span>`;
}

export function renderPacking(progress) {
  const occupied = new Map();
  progress.placed.forEach((position, id) => {
    if (position) pieceCells(id, position.turn).forEach(([r, c]) => occupied.set((r + position.row) * PACK_COLS + c + position.column, id));
  });
  return `<div class="packing-workbench"><div class="packing-grid" style="--pack-cols:${PACK_COLS}">${Array.from({ length: PACK_ROWS * PACK_COLS }, (_, index) => moveButton(occupied.has(index) ? String.fromCharCode(65 + occupied.get(index)) : '<span class="empty-grain"></span>', { type: 'cell', index }, { className: `packing-cell ${occupied.has(index) ? `piece-color-${occupied.get(index)}` : ''}`, key: `pack-cell-${index}` }).replace('<button ', `<button aria-label="放在第${Math.floor(index / PACK_COLS) + 1}行、第${index % PACK_COLS + 1}列" `)).join('')}</div><div class="piece-rack">${progress.placed.map((position, id) => moveButton(`${miniature(pieceCells(id, id === progress.selected ? progress.turn : position?.turn ?? 0), id)}<span>${String.fromCharCode(65 + id)}${position ? ' · 已放' : ''}</span>`, { type: 'select', index: id }, { className: progress.selected === id ? 'selected-piece' : '', key: `pack-piece-${id}` })).join('')}</div><div class="mechanical-controls">${moveButton('旋转选中木片', { type: 'rotate' })}${moveButton('取回选中木片', { type: 'remove' })}</div><p class="hand-note">当前选中 ${escape(String.fromCharCode(65 + progress.selected))}。点击棋盘格作为木片外框的左上角。</p></div>`;
}
