import {LIGHT_FILM_SURFACE} from '../data/light.js';
import { ASSETS, MOTIFS, MOTIF_LABELS } from '../data/assets.js';
import { ASSET_LAYOUTS } from '../data/asset-layouts.js';

export const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);

const ICONS = {
  daisy:'M12 7c-4-7-8-1-4 2-7 0-6 7 0 5-2 7 5 8 6 2 6 4 10-2 4-5 7-2 2-8-2-5M12 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6M12 17v6',
  tulip:'M6 6q0 8 6 8t6-8l-4 3-2-6-2 6ZM12 14v9m0-4q-5 1-6-3m6 5q4 0 6-3',
  lavender:'M12 3v20M12 6q-7-5-6 0l6 4q7-5 6-8m-6 10q-8-5-7 0l7 4q8-4 7-8m-7 12q-6-3-6-6m6 8q6-1 6-5',
  left: 'm14 6-6 6 6 6', right: 'm10 6 6 6-6 6', close: 'm6 6 12 12M18 6 6 18',
  book: 'M12 6C8 3 4 4 3 5v14c3-2 6-2 9 0 3-2 6-2 9 0V5c-3-2-6-2-9 1v13',
  sound: 'm4 9 4 0 5-4v14l-5-4H4zM17 8q5 4 0 8', mute: 'm4 9 4 0 5-4v14l-5-4H4zM17 9l5 6m0-6-5 6',
  settings: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 3v2m0 14v2M3 12h2m14 0h2M5.6 5.6 7 7m10 10 1.4 1.4M5.6 18.4 7 17m10-10 1.4-1.4',
  hint: 'M17 15A7 7 0 0 1 9 4a8 8 0 1 0 8 11M18 3v4m-2-2h4',
  star: 'm12 3 2.7 5.8 6.3.8-4.6 4.4 1.1 6.3-5.5-3-5.5 3 1.1-6.3L3 9.6l6.3-.8z',
  cloud:'M6 18a4 4 0 1 1 1-7 6 6 0 0 1 11-1 4 4 0 1 1 0 8Z',
  leaf:'M20 3C9 2 3 8 4 15c8 5 14-1 16-12M5 19 17 6M10 13l-4-1m7-2 1-4',
  moon: 'M19 15A8 8 0 0 1 9 4a8.5 8.5 0 1 0 10 11',
  rainbow: ['M3 19v-5a9 9 0 0 1 18 0v5','M6 19v-5a6 6 0 0 1 12 0v5','M9 19v-5a3 3 0 0 1 6 0v5'],
  feather: 'M5 20 16 7M4 17C1 8 15 1 20 3c1 6-5 16-12 13m0-4 5 1',
  play: 'm9 5 10 7-10 7z', pause:'M8 5v14M16 5v14',
  music:'M9 17V5l11-2v12M9 7l11-2M9 17a3 2 0 1 1-6 0 3 2 0 1 1 6 0M20 15a3 2 0 1 1-6 0 3 2 0 1 1 6 0',
  next:'m5 5 10 7-10 7zM19 5v14',repeat:'M4 8h13l-3-3m3 3-3 3M20 16H7l3 3m-3-3 3-3',
  'zoom-in':'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6M7 10h6m-3-3v6',
  'zoom-out':'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6M7 10h6',
  upload: 'M12 16V4m-4 4 4-4 4 4M4 17v4h16v-4',
  full: 'M3 9V3h6m6 0h6v6M3 15v6h6m6 0h6v-6',
  undo: 'm9 5-5 5 5 5M4 10h10a6 6 0 0 1 0 12', check: 'm5 12 4 4L20 5',
  reset: 'M4 10a8 8 0 1 1 1 8M4 4v6h6', download: 'M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4',
  lock:'M7 11V7a5 5 0 0 1 10 0v4M5 11h14v10H5zM12 15v3',
};

export function icon(name, className = '') {
  const paths = [ICONS[name] ?? ICONS.hint].flat();
  return `<svg class="icon icon-${escape(name)} ${escape(className)}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths.map(path=>`<path d="${path}"/>`).join('')}</svg>`;
}

export function moveButton(label, move, { className = '', disabled = false, key = '', toolTarget = '' } = {}) {
  return `<button type="button" class="puzzle-control ${escape(className)}" data-pmove="${escape(JSON.stringify(move))}" data-focus="${escape(key || JSON.stringify(move))}" ${toolTarget?`data-tool-target="${escape(toolTarget)}"`:''} ${disabled ? 'disabled' : ''}>${label}</button>`;
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
export function itemSprite(index,className=''){
 if(typeof index==='object')return atlas(index.asset,index.index,{...index,className:`item-art ${className}`});
 if(index===0)return atlas('bookmarkFull',0,{columns:1,rows:1,label:'木书签',className:`item-art ${className}`});
 if(index!==4)return atlas('items',index,{className:`item-art ${className}`});
 const surface=LIGHT_FILM_SURFACE,frame=ASSET_LAYOUTS.lightFilm.frames[0];
 const drawing=`<img class="transparency-print" src="${ASSETS.lightPrint}" alt="" draggable="false" style="left:${(surface.x-frame[0])/frame[2]*100}%;top:${(surface.y-frame[1])/frame[3]*100}%;width:${surface.width/frame[2]*100}%;height:${surface.height/frame[3]*100}%">`;
 return atlas('lightFilm',0,{label:'角上有四道记号的雨窗透片',className:`item-art transparency-prop ${className}`}).replace('</span>',drawing+'</span>');
}
export function character(asset, index, columns, rows, label, className = '') {
  return atlas(asset, index, { columns, rows, label, className: `character-art ${className}` });
}

export function shiftControls(index, count) {
  return `<div class="shift-controls">${moveButton(icon('left'), { type: 'shift', index, direction: -1 }, { disabled: index === 0, key: `shift-${index}-left` }).replace('<button ', `<button aria-label="将第${index + 1}件向左移动" `)}${moveButton(icon('right'), { type: 'shift', index, direction: 1 }, { disabled: index === count - 1, key: `shift-${index}-right` }).replace('<button ', `<button aria-label="将第${index + 1}件向右移动" `)}</div>`;
}

export function dial(index, value, label, count = 4) {
  const face = moveButton(`${itemSprite(6)}<b aria-hidden="true">${value}</b>`,{type:'turn',index,direction:1},{key:`dial-${index}`,className:'dial-face'}).replace('<button ',`<button role="slider" aria-label="${escape(label)}" aria-valuemin="0" aria-valuemax="${count-1}" aria-valuenow="${value}" data-dial="${index}" data-count="${count}" style="--turn:${value * 360 / count}deg" `);
  return `<div class="dial"><span class="dial-name">${escape(label)}</span><div class="dial-controls">${moveButton(icon('left'), { type: 'turn', index, direction: -1 }).replace('<button ', `<button aria-label="${escape(label)}逆转一格" `)}${face}${moveButton(icon('right'), { type: 'turn', index, direction: 1 }).replace('<button ', `<button aria-label="${escape(label)}正转一格" `)}</div></div>`;
}

export function announce(message) {
  const live = document.querySelector('#live-region');
  if (live) live.textContent = message;
}
