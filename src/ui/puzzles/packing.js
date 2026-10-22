import { PACK_COLS, PACK_ROWS, pieceTiles } from '../../puzzles/packing.js';
import { moveButton, character } from '../dom.js';

function printTile(tile) {
  return `<span class="print-tile" aria-hidden="true" style="--print-x:${tile.print % PACK_COLS};--print-y:${Math.floor(tile.print / PACK_COLS)};--print-turn:${tile.turn * 90}deg"><span class="print-source">${character('packingPicture', 0, 1, 1, '')}</span></span>`;
}

export function miniature(tiles) {
  const rows = Math.max(...tiles.map(tile => tile.row)) + 1;
  const columns = Math.max(...tiles.map(tile => tile.column)) + 1;
  return `<span class="piece-mini" style="--mini-cols:${columns};--mini-rows:${rows}">${Array.from({ length: rows * columns }, (_, index) => {
    const tile = tiles.find(tile => index === tile.row * columns + tile.column);
    return `<i class="${tile ? 'mini-filled' : ''}">${tile ? printTile(tile) : ''}</i>`;
  }).join('')}</span>`;
}

export function renderPacking(progress) {
  const occupied = new Map();
  progress.placed.forEach((position, id) => {
    if (position) pieceTiles(id, position.turn).forEach((tile, index) => occupied.set((tile.row + position.row) * PACK_COLS + tile.column + position.column, { ...tile, id, label: index === 0 }));
  });
  return `<div class="packing-workbench"><div class="packing-table"><div class="packing-grid" style="--pack-cols:${PACK_COLS}">${Array.from({ length: PACK_ROWS * PACK_COLS }, (_, index) => {
    const tile = occupied.get(index);
    const row = Math.floor(index / PACK_COLS), column = index % PACK_COLS;
    const edges = tile ? [[row > 0 ? index - PACK_COLS : -1, 'top'], [column < PACK_COLS - 1 ? index + 1 : -1, 'right'], [row < PACK_ROWS - 1 ? index + PACK_COLS : -1, 'bottom'], [column > 0 ? index - 1 : -1, 'left']].filter(([next]) => occupied.get(next)?.id !== tile.id).map(([, side]) => `cut-${side}`).join(' ') : '';
    return moveButton(tile ? `${printTile(tile)}${tile.label ? `<small>${String.fromCharCode(65 + tile.id)}</small>` : ''}` : '<span class="empty-grain"></span>', { type: 'cell', index }, { className: `packing-cell ${tile ? `printed-cell ${edges}` : ''}`, key: `pack-cell-${index}` }).replace('<button ', `<button data-pack-cell="${index}" ${tile ? `data-pack-id="${tile.id}"` : ''} aria-label="第${row + 1}行、第${column + 1}列${tile ? `，木片${String.fromCharCode(65 + tile.id)}` : '，空着'}" `);
  }).join('')}</div><div class="selected-cutout" data-pack-id="${progress.selected}"><span class="pencil-label">木片 ${String.fromCharCode(65 + progress.selected)}</span>${miniature(pieceTiles(progress.selected, progress.turn))}</div></div><div class="piece-rack">${progress.placed.map((position, id) => moveButton(`${miniature(pieceTiles(id, id === progress.selected ? progress.turn : position?.turn ?? 0))}<span>${String.fromCharCode(65 + id)}${position ? ' · 已放' : ''}</span>`, { type: 'select', index: id }, { className: progress.selected === id ? 'selected-piece' : '', key: `pack-piece-${id}` }).replace('<button ', `<button data-pack-id="${id}" `)).join('')}</div><div class="mechanical-controls">${moveButton('转一转', { type: 'rotate' })}${moveButton('取回来', { type: 'remove' })}</div><p class="hand-note">拖进木框，接成一幅画。拖着时按 R 旋转，Esc 放手。</p><span class="sr-only">也可以先选木片，再用转一转和格子按钮放置。</span></div>`;
}
