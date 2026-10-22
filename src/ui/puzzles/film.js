import { PAGE_IDS } from '../../data/items.js';
import { FRAME_PERFORATIONS } from '../../puzzles/film.js';
import { character, motif, moveButton, shiftControls, escape } from '../dom.js';

const FRAME_NOTES = ['把C翻到和此刻的A同一面。', '翻过A，再翻过B。', '再翻一次B，D跟着B朝同一面。'];
const FRAME_PETALS = [54, 12, 83];

export function renderFilm(progress) {
  return `<div class="film-workbench"><p class="film-opening">开场时，A、B、C、D都正面朝外。</p><div class="film-strip">${progress.order.map((frame, index) => `<div class="film-frame"><small class="frame-number">${['Ⅰ', 'Ⅱ', 'Ⅲ'][frame]}</small><div class="film-still">${character('filmScenes', frame, 3, 1, ['小黑', '无限', '鹿野'][frame])}<span class="falling-petal" style="top:${FRAME_PETALS[frame]}%">${motif('petal')}</span></div><p>${escape(FRAME_NOTES[frame])}</p><div class="film-perforations" aria-label="下沿${FRAME_PERFORATIONS[frame]}个孔">${Array.from({ length: FRAME_PERFORATIONS[frame] }, () => '<i></i>').join('')}</div>${shiftControls(index, 3)}</div>`).join('')}</div><div class="face-selectors">${PAGE_IDS.map((_, index) => moveButton(`<b>${String.fromCharCode(65 + index)}</b><span>${progress.faces[index] ? '背面' : '正面'}</span>`, { type: 'flip', index }, { className: progress.faces[index] ? 'flipped-paper' : '', key: `film-page-${index}` })).join('')}</div><p class="film-margin-note">胶片排好以后，下沿的孔数就是三盆花从左到右的高低。页边另记着一句话：雏菊的那页，要放在玫瑰后面。</p></div>`;
}
