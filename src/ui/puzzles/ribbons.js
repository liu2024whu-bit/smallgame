import { RIBBON_PATHS, RIBBON_LAYERS, RIBBON_COLORS, RIBBON_NAMES, RIBBON_TAIL_SIDES, BOX_CROP, BOX_LID } from '../../data/birthday-workshop.js';
import { cropPosition, sugarArt } from '../workshop-props.js';
import { character, moveButton, icon } from '../dom.js';

export function ribbonLines(progress) {
  const paths=RIBBON_PATHS[Number(progress.back)];
  return `<svg class="ribbon-connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${RIBBON_LAYERS.filter(index=>!progress.removed.includes(index)).map(index=>{const [a,b]=paths[index],d=`M${a.join(' ')}L${b.join(' ')}`;return `<g data-ribbon-line="${index}" style="--ribbon:${RIBBON_COLORS[index]}"><path class="ribbon-shadow" d="${d}"/><path class="ribbon-cloth" d="${d}"/><path class="ribbon-stitch" d="${d}"/></g>`;}).join('')}</svg>`;
}
export function renderRibbons(progress) {
  const face=Number(progress.back),[x,y]=cropPosition(BOX_LID,BOX_CROP);
  return `<div class="ribbon-box ${progress.back?'box-verso':''}" data-ribbon-side="${Number(progress.back)}">${character('ribbonBox',0,1,1,progress.back?'生日匣的背面':'缎带缠着的生日匣','workshop-painting')}<div class="ribbon-field" data-ribbon-field style="left:${x}%;top:${y}%;width:${BOX_LID[2]/BOX_CROP[2]*100}%;height:${BOX_LID[3]/BOX_CROP[3]*100}%">${ribbonLines(progress)}${RIBBON_PATHS[face].map(([a,b],index)=>progress.removed.includes(index)?'':RIBBON_TAIL_SIDES[index]===face?moveButton(sugarArt(index),{type:'pull',index},{className:'ribbon-tail',key:`ribbon-tail-${index}`}).replace('<button ',`<button data-ribbon-tail="${index}" aria-label="抽出${RIBBON_NAMES[index]}纸带" style="left:${b[0]}%;top:${b[1]}%;--ribbon:${RIBBON_COLORS[index]}" `):`<span class="ribbon-loop" style="left:${b[0]}%;top:${b[1]}%;--ribbon:${RIBBON_COLORS[index]}" aria-hidden="true">${sugarArt(index)}</span>`).join('')}</div><span class="box-side-label">${progress.back?'背面':'正面'}</span><span class="ribbon-pockets" aria-label="已抽出${progress.removed.length}根">${progress.removed.map(index=>sugarArt(index)).join('')}</span></div><div class="workshop-turn">${moveButton(`${icon('undo')}翻过来`,{type:'flip'},{key:'ribbon-flip',className:'quiet-button'})}</div><span class="sr-only">纸带从两面交错穿过。尾端的糖果小签可以向外抽，也可以按回车；合着的环在另一面开口。</span>`;
}
