import { SUGARS, SUGAR_NAMES, SUGAR_GRID, SWEET_CROP, CAKE_GRID, SWEET_PLATES } from '../../data/birthday-workshop.js';
import { sugarGroups } from '../../puzzles/sweets.js';
import { character, icon } from '../dom.js';

import { sugarArt, cropPosition } from '../workshop-props.js';
export function sugarPieces() {
  return SUGARS.map(sugar=>`<span class="sugar-piece" style="left:${(sugar.column+.5)/SUGAR_GRID*100}%;top:${(sugar.row+.5)/SUGAR_GRID*100}%">${sugarArt(sugar.type)}</span>`).join('');
}
export function renderSweets(progress) {
  const [x,y]=cropPosition(CAKE_GRID,SWEET_CROP);
  return `<div class="sweets-table">${character('sweetsTable',0,1,1,'夹着生日分糖卡与四只小碟的桌面','workshop-painting')}<div class="sugar-grid" data-sugar-grid style="left:${x}%;top:${y}%;width:${CAKE_GRID[2]/SWEET_CROP[2]*100}%;height:${CAKE_GRID[3]/SWEET_CROP[3]*100}%">${sugarPieces()}<svg class="sugar-guides" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path data-sugar-line="0" d="M-5 ${progress.cuts[0]/8*100}H105"/><path data-sugar-line="1" d="M${progress.cuts[1]/8*100} -5V105"/></svg>${[0,1].map(index=>`<button class="sugar-grip sugar-grip-${index}" data-sugar-cut="${index}" data-focus="sugar-cut-${index}" role="slider" aria-label="${index?'竖线右移列数':'横线下移排数'}" aria-valuemin="1" aria-valuemax="7" aria-valuenow="${progress.cuts[index]}" style="${index?'left':'top'}:${progress.cuts[index]/8*100}%"><span aria-hidden="true">${icon(index?'left':'right')}</span></button>`).join('')}</div>${sugarShares(progress.cuts,SWEET_CROP)}<span class="sweet-card-tab" aria-hidden="true">${icon('moon')}20</span></div><p class="workshop-caption">四份，都尝到五种甜。</p><span class="sr-only">细线的把手可以拖动，也可以用方向键挪一格，Home和End移到两端。</span>`;
}

export function sugarShares(cuts,crop) {
  const groups=sugarGroups(cuts);
  return SWEET_PLATES.map((point,index)=>{const [left,top]=cropPosition(point,crop);return `<div class="sweet-share ${groups[index].every(n=>n===1)?'share-even':''}" style="left:${left}%;top:${top}%;width:${85/crop[2]*100}%;height:${78/crop[3]*100}%;padding:${11.3/crop[2]*100}%" aria-label="第${index+1}份：${groups[index].map((n,i)=>`${SUGAR_NAMES[i]}${n}颗`).join('，')}">${groups[index].map((n,i)=>`<span class="share-sugar ${n?'':'share-missing'} ${n>1?'share-extra':''}">${sugarArt(i)}${n>1?`<small>${n}</small>`:''}</span>`).join('')}</div>`;}).join('');
}
