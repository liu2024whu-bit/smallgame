import { character, escape, motif, moveButton, shiftControls } from '../dom.js';
import { BINDING_HOLES as HOLES } from '../../data/mechanism-layouts.js';
import { PAGE_MARKS } from '../../puzzles/album.js';

const PAGE_ART = [['princeHei', 0, 2, 2, '小王子'], ['skyClouds', 0, 1, 3, '光遇'], ['memoryNaruto', 0, 1, 1, '带土与卡卡西的画稿'], ['cinema', 0, 1, 1, '石桥上的小黑与伙伴']];
const PAGE_WORDS = ['玫瑰', '云', '画稿', '石桥'];

export function renderAlbum(progress) {
  return `<div class="album-workbench"><div class="album-layout">${progress.order.map((page, index) => `<div class="loose-page ${progress.faces[page] ? 'page-back' : ''}"><span class="page-letter">${String.fromCharCode(65 + page)}</span><span class="page-mark">${motif(PAGE_MARKS[page])}</span>${moveButton(`<span class="page-illustration">${character(...PAGE_ART[page])}</span><small>${progress.faces[page] ? '背' : '正'}</small>`, {type:'flip',index:page}, {key:`album-face-${page}`,className:'page-face'}).replace('<button ',`<button aria-label="翻动画页${String.fromCharCode(65+page)}，${escape(PAGE_WORDS[page])}" `)}${shiftControls(index, 4)}</div>`).join('')}</div><p class="input-note">画页能换位，也能翻面。</p></div>`;
}

export function renderStitch(progress) {
  return `<div class="stitch-workbench">${character('bindingBook', 0, 1, 1, '尚未缝线的画册与两道装订纸边', 'binding-background')}<div class="binding-pages">${[1,3,0,2].map(page => `<div class="binding-page"><span>${String.fromCharCode(65+page)}</span></div>`).join('')}</div><svg class="stitch-lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${progress.path.slice(1).map((hole, i) => `<line class="${i % 2 ? 'thread-back' : 'thread-front'}" x1="${HOLES[progress.path[i]][0]}" y1="${HOLES[progress.path[i]][1]}" x2="${HOLES[hole][0]}" y2="${HOLES[hole][1]}"/>`).join('')}</svg>${HOLES.map(([x, y], index) => `<div class="binding-hole ${index<4?'hole-upper':'hole-lower'} ${progress.path.includes(index) ? 'has-thread' : ''}" style="left:${x}%;top:${y}%">${moveButton(`<span class="hole-dot"></span><small>${index + 1}</small>`, { type: 'hole', index }, { key: `hole-${index}` }).replace('<button ', `<button aria-label="穿过第${index + 1}孔" `)}</div>`).join('')}<p class="binding-rule">${progress.path.length%2 ? '背面 ↗' : '正面 ↓'}</p></div><div class="binding-controls">${moveButton('退一针', { type: 'undo' })}</div>`;
}
