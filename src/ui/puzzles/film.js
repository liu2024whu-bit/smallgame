import { PAGE_IDS } from '../../data/items.js';
import { character, motif, moveButton, shiftControls, escape } from '../dom.js';

const FRAME_NOTES = ['A翻向纸背；C与A同面。', 'A与C同面，花瓣刚刚离开上沿。', 'B、D的图案仍朝着观众。'];
const FRAME_PETALS = [54, 12, 83];

export function renderFilm(progress) {
  return `<div class="film-workbench"><div class="film-strip">${progress.order.map((frame, index) => `<div class="film-frame"><small class="frame-number">${['Ⅰ', 'Ⅱ', 'Ⅲ'][frame]}</small><div class="film-still">${character('hei2', frame, 3, 2, ['小黑', '无限', '鹿野'][frame])}<span class="falling-petal" style="top:${FRAME_PETALS[frame]}%">${motif('petal')}</span></div><p>${escape(FRAME_NOTES[frame])}</p>${shiftControls(index, 3)}</div>`).join('')}</div><p class="hand-note">按花瓣由高到低的先后排列。四张小纸片记录画页朝向。</p><div class="face-selectors">${PAGE_IDS.map((_, index) => moveButton(`<b>${String.fromCharCode(65 + index)}</b><span>${progress.faces[index] ? '背面' : '正面'}</span>`, { type: 'flip', index }, { className: progress.faces[index] ? 'flipped-paper' : '', key: `film-page-${index}` })).join('')}</div><p class="hand-note">三格对齐后，窗边应使用的角度会留在画页C。</p></div>`;
}
