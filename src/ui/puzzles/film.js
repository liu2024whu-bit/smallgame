import { PAGE_IDS } from '../../data/items.js';
import { FRAME_PERFORATIONS } from '../../puzzles/film.js';
import { character, motif, moveButton, shiftControls, icon } from '../dom.js';

export const FRAME_SIGNS = ['C ⇐ A', 'A ↺  B ↺', 'B ↺  D ⇐ B'];
export const FRAME_PETALS = [47, 12, 77];

export function renderFilm(progress) {
  const frame=progress.frame;
  return `<div class="film-workbench"><p class="film-opening">开场　A · B · C · D　正面</p><div class="film-viewer">${character('cinema',0,1,1,'石桥上的三格胶片')}<span class="film-view-petal" style="top:${FRAME_PETALS[frame]}%">${motif('petal')}</span><span class="film-view-number">${['Ⅰ','Ⅱ','Ⅲ'][frame]}</span><span class="film-event">${FRAME_SIGNS[frame]}</span></div><div class="film-transport"><button class="film-play-button" data-film-play aria-pressed="false">${icon('play')}<span>放映</span></button><span>↺ 翻面　⇐ 同面</span></div><div class="film-strip">${progress.order.map((id,index)=>`<div class="film-frame ${id===frame?'frame-inspecting':''}"><small class="frame-number">${['Ⅰ','Ⅱ','Ⅲ'][id]}</small>${moveButton(`<span class="film-contact">${character('cinema',0,1,1,'停格')}<i style="top:${FRAME_PETALS[id]}%">${motif('petal')}</i></span>`,{type:'frame',index:id},{key:`inspect-frame-${id}`,className:'film-inspect'})}<p class="film-mark">${FRAME_SIGNS[id]}</p><div class="film-perforations" aria-label="下沿${FRAME_PERFORATIONS[id]}个孔">${Array.from({length:FRAME_PERFORATIONS[id]},()=>'<i></i>').join('')}</div>${shiftControls(index,3)}</div>`).join('')}</div><div class="face-selectors">${PAGE_IDS.map((_,index)=>moveButton(`<b>${String.fromCharCode(65+index)}</b><span>${progress.faces[index]?'背':'正'}</span>`,{type:'flip',index},{className:progress.faces[index]?'flipped-paper':'',key:`film-page-${index}`})).join('')}</div><div class="film-edge-note"><span>孔 · 高</span><span>雏菊在玫瑰之后。</span></div></div>`;
}
