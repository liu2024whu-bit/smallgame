import { character, escape, moveButton, shiftControls } from '../dom.js';

const PAGE_ART = [['princeHei', 0, 2, 2, '小王子'], ['skyBat', 1, 2, 2, '云间的身影'], ['naruto', 3, 2, 2, '卡卡西'], ['hei2', 0, 3, 2, '小黑']];
const PAGE_WORDS = ['被记得', '一起经过', '认真喜欢', '继续画下去'];

export function renderAlbum(progress) {
  return `<div class="album-workbench"><p class="hand-note">手账里的线索：云景给页序，胶片给朝向。</p><div class="album-layout">${progress.order.map((page, index) => `<div class="loose-page ${progress.faces[page] ? 'page-back' : ''}"><span class="page-letter">${String.fromCharCode(65 + page)}</span>${character(...PAGE_ART[page])}<p>${escape(PAGE_WORDS[page])}</p>${moveButton(progress.faces[page] ? '背面 · 翻页' : '正面 · 翻页', { type: 'flip', index: page }, { key: `album-face-${page}` })}${shiftControls(index, 4)}</div>`).join('')}</div></div>`;
}

const HOLES = [[17, 23], [39, 23], [61, 23], [83, 23], [17, 77], [39, 77], [61, 77], [83, 77]];
export function renderStitch(progress) {
  return `<div class="stitch-workbench"><div class="binding-pages">${['B', 'D', 'A', 'C'].map(page => `<div class="binding-page"><span>${page}</span></div>`).join('')}</div><svg class="stitch-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${progress.path.slice(1).map((hole, i) => `<line class="${i % 2 ? 'thread-back' : 'thread-front'}" x1="${HOLES[progress.path[i]][0]}" y1="${HOLES[progress.path[i]][1]}" x2="${HOLES[hole][0]}" y2="${HOLES[hole][1]}"/>`).join('')}</svg>${HOLES.map(([x, y], index) => `<div class="binding-hole ${progress.path.includes(index) ? 'has-thread' : ''}" style="left:${x}%;top:${y}%">${moveButton(`<span class="hole-dot"></span><small>${index}</small>`, { type: 'hole', index }, { key: `hole-${index}` }).replace('<button ', `<button aria-label="穿过第${index}孔" `)}</div>`).join('')}<p class="binding-rule">从左上起针　·　正面同列向下　·　背面向右上一孔</p><div class="binding-controls">${moveButton('退一针', { type: 'undo' })}</div></div>`;
}
