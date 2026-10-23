import { panWeights, WEIGHT_LABELS } from '../../puzzles/balance.js';
import { DRAWER_CONDITIONS, drawerEnabled } from '../../puzzles/drawers.js';
import { flipNeighbors } from '../../puzzles/flips.js';
import { DRAWER_RECTS, FLIP_RECT } from '../../data/mechanism-layouts.js';
import { character, escape, motif, moveButton } from '../dom.js';

export function renderBalance(progress) {
  const [left,right]=panWeights(progress.places),lean=Math.sign(left-right)*6,motifs=['paw','star','rose','moon'];
  const weight = (i, place) => moveButton(motif(motifs[i]), {type:'place',index:i}, {key:`pan-weight-${i}`,className:'pan-weight'}).replace('<button ', `<button data-weight="${i}" aria-label="拿起${WEIGHT_LABELS[i]}，在${place===1?'左':'右'}盘" `);
  return `<div class="balance-workbench"><div class="weight-examples"><p>${motif('paw')}＝${motif('leaf')}${motif('leaf')}</p><p>${motif('star')}＝${motif('paw')}＋${motif('leaf')}</p><p>${motif('rose')}＝${motif('star')}＋${motif('leaf')}</p><p>${motif('moon')}＝${motif('rose')}＋${motif('leaf')}</p></div><div class="scale-apparatus" style="--lean:${lean}deg">${character('balanceScale',0,1,1,'小天平的猫形底座','scale-fixed')}<div class="scale-moving">${character('balanceScale',0,1,1,'天平横梁与托盘','scale-swing')}<div class="scale-pan left-pan" data-pan="1">${progress.places.map((place,i)=>place===1?weight(i,1):'').join('')}</div><div class="scale-pan right-pan" data-pan="2">${progress.places.map((place,i)=>place===2?weight(i,2):'').join('')}</div></div></div><div class="weight-tray" data-pan="0">${progress.places.map((place,index)=>moveButton(`${motif(motifs[index])}<span>${escape(WEIGHT_LABELS[index])}</span><small>${['桌上','左盘','右盘'][place]}</small>`,{type:'place',index},{key:`weight-${index}`,className:place?'weight-away':''}).replace('<button ', `<button data-weight="${index}" `)).join('')}</div><p class="balance-goal">一边两枚</p><span class="sr-only">拖到托盘里，也可以点摆件换一边。</span></div>`;
}

export function renderDrawers(progress,context) {
  const back=context.view.back ?? false;
  const backboard=`<div class="drawer-backboard">${DRAWER_CONDITIONS.map((condition,index)=>`<div class="drawer-link ${drawerEnabled(progress.open,index)?'link-free':''}"><b>${String.fromCharCode(65+index)}</b><span class="wooden-slide ${progress.open[index]?'slide-out':''}"><i></i></span><p>${escape(condition)}</p></div>`).join('')}</div>`;
  return `<div class="drawers-workbench">${back?backboard:`<div class="drawer-chest">${character('apparatus', 3, 3, 2, '小狗抽屉柜', 'chest-painting')}${progress.open.map((open, index) => `<div style="left:${DRAWER_RECTS[index][0]}%;top:${DRAWER_RECTS[index][1]}%;width:${DRAWER_RECTS[index][2]}%;height:${DRAWER_RECTS[index][3]}%;--face-offset:${-DRAWER_RECTS[index][1]/DRAWER_RECTS[index][3]*100}%" class="drawer-unit ${open ? 'drawer-open' : ''} ${drawerEnabled(progress.open, index) ? 'drawer-free' : ''}">${moveButton(`<span class="drawer-face" style="--drawer:${index}">${character('apparatus', 3, 3, 2, '')}</span><span class="drawer-letter">${String.fromCharCode(65 + index)}</span><span class="drawer-handle"></span><span class="sr-only">${open?'已打开':'合着'}</span>`, { type: 'drawer', index }, { key: `drawer-${index}` })}</div>`).join('')}</div>`}<div class="drawer-goal" aria-label="目标A关B关C开D开">${['合','合','开','开'].map((face,index)=>`<span>${String.fromCharCode(65+index)}<small>${face}</small></span>`).join('')}</div><button class="text-button drawer-turn" data-action="mechanism-back">${back?'转回正面':'看看背板'}</button></div>`;
}

export function renderFlips(progress) {
  return `<div class="flips-workbench"><div class="flip-box">${character('apparatus', 4, 3, 2, '翻片木盒')}<div class="flip-grid" style="left:${FLIP_RECT[0]}%;top:${FLIP_RECT[1]}%;width:${FLIP_RECT[2]}%;height:${FLIP_RECT[3]}%">${progress.tiles.map((tile, index) => moveButton(tile ? motif('leaf') : motif('rose'), { type: 'flip', index }, { className: `flip-tile ${tile ? 'tile-back' : 'tile-flower'}`, key: `flip-${index}` }).replace('<button ', `<button aria-label="翻动第${index + 1}格，并带动相邻格" data-neighbors="${flipNeighbors(index).join(',')}" `)).join('')}</div></div><p class="hand-note">九朵花，还差几朵呢？</p></div>`;
}
