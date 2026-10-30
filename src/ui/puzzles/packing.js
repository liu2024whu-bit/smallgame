import {PACK_COLS,PACK_ROWS,pieceTiles,visiblePackingTurn,pictureFits} from '../../puzzles/packing.js';
import {PACKING_TRAY} from '../../data/packing-apparatus.js';
import {ASSETS} from '../../data/assets.js';
import {moveButton,character,icon} from '../dom.js';

function printTile(tile) {
  return `<span class="packing-fragment" data-pack-print="${tile.print}" data-pack-turn="${tile.turn}" aria-hidden="true"><span class="print-tile" style="--print-x:${tile.print % PACK_COLS};--print-y:${Math.floor(tile.print / PACK_COLS)};--print-turn:${tile.turn * 90}deg"><span class="print-source">${character('packingPicture', 0, 1, 1, '')}</span></span></span>`;
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
    if (position) pieceTiles(id, position.turn).forEach(tile => occupied.set((tile.row + position.row) * PACK_COLS + tile.column + position.column, { ...tile, id }));
  });
  const [x,y,w,h]=PACKING_TRAY.opening;
  const done=progress.placed.every(Boolean)&&pictureFits(progress.placed);
  const trayStyle=`--tray-ratio:${PACK_COLS/PACK_ROWS*(h/PACKING_TRAY.height)/(w/PACKING_TRAY.width)};--grid-left:${x/PACKING_TRAY.width*100}%;--grid-top:${y/PACKING_TRAY.height*100}%;--grid-width:${w/PACKING_TRAY.width*100}%;--grid-height:${h/PACKING_TRAY.height*100}%`;
  return `<div class="packing-workbench"><div class="packing-tray" style="${trayStyle}"><img class="packing-tray-art" src="${ASSETS.packingTray}" alt="" draggable="false"><div class="packing-grid" style="--pack-cols:${PACK_COLS}" role="group" aria-label="木托盘，四行五列">${done?`<img class="packing-finished-art" src="${ASSETS.packingPicture}" alt="小王子和玫瑰的画拼好了" draggable="false">`:Array.from({ length: PACK_ROWS * PACK_COLS }, (_, index) => {
    const tile = occupied.get(index);
    const row = Math.floor(index / PACK_COLS), column = index % PACK_COLS;
    const edges = tile ? [[row > 0 ? index - PACK_COLS : -1, 'top'], [column < PACK_COLS - 1 ? index + 1 : -1, 'right'], [row < PACK_ROWS - 1 ? index + PACK_COLS : -1, 'bottom'], [column > 0 ? index - 1 : -1, 'left']].filter(([next]) => occupied.get(next)?.id !== tile.id).map(([, side]) => `cut-${side}`).join(' ') : '';
    return moveButton(tile ? printTile(tile) : '', { type: 'cell', index }, { className: `packing-cell ${tile ? `printed-cell ${edges}` : ''} ${tile?.id===progress.selected?'selected-wood':''}`, key: `pack-cell-${index}` }).replace('<button ', `<button data-pack-cell="${index}" ${tile ? `data-pack-id="${tile.id}"` : ''} aria-label="第${row + 1}行、第${column + 1}列${tile ? `，木片${String.fromCharCode(65 + tile.id)}` : '，空着'}" `);
  }).join('')}</div></div><aside class="packing-side"><div class="piece-rack" role="group" aria-label="手边的木片">${progress.placed.map((position, id) => moveButton(`${position?`<span class="pack-vacancy" aria-hidden="true">${String.fromCharCode(65+id)}</span>`:miniature(pieceTiles(id,visiblePackingTurn(progress,id)))}<span class="pack-tag">${String.fromCharCode(65 + id)}${position ? ' · 画里' : ''}</span>`, { type: 'select', index: id }, { className: (progress.selected===id?'selected-piece ':'')+(position?'piece-in-picture':''), key: `pack-piece-${id}` }).replace('<button ', `<button data-pack-rack data-pack-id="${id}" aria-pressed="${progress.selected===id}" aria-label="木片${String.fromCharCode(65+id)}${position?'，在画里':''}" `)).join('')}</div><div class="packing-tools">${moveButton(icon('reset')+'<span>转转</span>',{type:'rotate'},{disabled:!!progress.placed[progress.selected],key:'pack-rotate'})}${moveButton(icon('undo')+'<span>拿回</span>',{type:'remove'},{disabled:!progress.placed[progress.selected],key:'pack-remove'})}</div><p class="hand-note">R 转转 · Esc 放手</p></aside><span class="sr-only">木片能拖进托盘，也能先选一块，再点击空处放下。拿在手里时可以转动；托盘中的木片拿回后也能再转。方向键可以在托盘中移动焦点。</span></div>`;
}
