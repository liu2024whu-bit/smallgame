import { ASSETS, MOTIFS, MOTIF_LABELS } from '../data/assets.js';
import { ASSET_LAYOUTS } from '../data/asset-layouts.js';

export const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

const ICONS = {
  left: 'm14 6-6 6 6 6', right: 'm10 6 6 6-6 6', close: 'm6 6 12 12M18 6 6 18',
  book: 'M12 6C8 3 4 4 3 5v14c3-2 6-2 9 0 3-2 6-2 9 0V5c-3-2-6-2-9 1v13',
  sound: 'm4 9 4 0 5-4v14l-5-4H4zM17 8q5 4 0 8', mute: 'm4 9 4 0 5-4v14l-5-4H4zM17 9l5 6m0-6-5 6',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17m10-10 1.4-1.4',
  hint: 'M9 17h6m-5 3h4M8 14a6 6 0 1 1 8 0l-1 3H9z',
  full: 'M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6',
  undo: 'm9 5-5 5 5 5M4 10h10a6 6 0 0 1 0 12', check: 'm5 12 4 4L20 5',
  reset: 'M4 10a8 8 0 1 1 1 8M4 4v6h6', download: 'M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4',
};

export function icon(name, className = '') {
  return `<svg class="icon ${escape(className)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[name] ?? ICONS.hint}"/></svg>`;
}

export function moveButton(label, move, { className = '', disabled = false, key = '' } = {}) {
  return `<button type="button" class="puzzle-control ${escape(className)}" data-pmove="${escape(JSON.stringify(move))}" data-focus="${escape(key || JSON.stringify(move))}" ${disabled ? 'disabled' : ''}>${label}</button>`;
}

export function atlas(asset, index, { columns = 4, rows = 3, label = '', className = '', style = '' } = {}) {
  const column = index % columns;
  const row = Math.floor(index / columns);
  const layout = ASSET_LAYOUTS[asset];
  const frame = layout?.frames?.[index];
  const ratio = frame ? frame[2] / frame[3] : layout ? (layout.width / columns) / (layout.height / rows) : 1;
  const sizeX = frame ? layout.width / frame[2] * 100 : columns * 100;
  const sizeY = frame ? layout.height / frame[3] * 100 : rows * 100;
  const positionX = frame ? layout.width === frame[2] ? 0 : frame[0] / (layout.width - frame[2]) * 100 : columns > 1 ? column * 100 / (columns - 1) : 0;
  const positionY = frame ? layout.height === frame[3] ? 0 : frame[1] / (layout.height - frame[3]) * 100 : rows > 1 ? row * 100 / (rows - 1) : 0;
  const url = new URL(ASSETS[asset], new URL('../../', import.meta.url)).href;
  const clip = layout?.clips?.[index] ? `clip-path:${layout.clips[index]};` : '';
  return `<span class="raster-sprite ${escape(className)}" role="img" aria-label="${escape(label)}" style="--sprite:url('${url}');--size-x:${sizeX}%;--size-y:${sizeY}%;--pos-x:${positionX}%;--pos-y:${positionY}%;--ratio:${ratio};${clip}${escape(style)}"></span>`;
}

export const motif = (id, className = '') => atlas('motifs', MOTIFS[id] ?? 0, { label: MOTIF_LABELS[id] ?? '', className: `motif ${className}` });
export const itemSprite = (index, className = '') => index === 0 ? atlas('bookmarkFull', 0, { columns: 1, rows: 1, label: '木书签', className: `item-art ${className}` }) : atlas('items', index, { className: `item-art ${className}` });
export function character(asset, index, columns, rows, label, className = '') {
  return atlas(asset, index, { columns, rows, label, className: `character-art ${className}` });
}

export function shiftControls(index, count) {
  return `<div class="shift-controls">${moveButton(icon('left'), { type: 'shift', index, direction: -1 }, { disabled: index === 0, key: `shift-${index}-left` }).replace('<button ', `<button aria-label="将第${index + 1}件向左移动" `)}${moveButton(icon('right'), { type: 'shift', index, direction: 1 }, { disabled: index === count - 1, key: `shift-${index}-right` }).replace('<button ', `<button aria-label="将第${index + 1}件向右移动" `)}</div>`;
}

export function dial(index, value, label, count = 4) {
  const face = moveButton(`${itemSprite(6)}<b>${value}</b>`,{type:'turn',index,direction:1},{key:`dial-${index}`,className:'dial-face'}).replace('<button ',`<button aria-label="拖动旋转${escape(label)}，当前${value}" data-dial="${index}" data-count="${count}" style="--turn:${value * 360 / count}deg" `);
  return `<div class="dial"><span class="dial-name">${escape(label)}</span><div class="dial-controls">${moveButton(icon('left'), { type: 'turn', index, direction: -1 }).replace('<button ', `<button aria-label="${escape(label)}逆转一格" `)}${face}${moveButton(icon('right'), { type: 'turn', index, direction: 1 }).replace('<button ', `<button aria-label="${escape(label)}正转一格" `)}</div></div>`;
}

export function announce(message) {
  const live = document.querySelector('#live-region');
  if (live) live.textContent = message;
}
