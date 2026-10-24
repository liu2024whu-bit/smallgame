import { GAP_TARGET, cloudReadings } from '../../puzzles/rotors.js';
import { STAMP_MOTIFS, MOTIFS, MOTIF_LABELS, ASSETS } from '../../data/assets.js';
import { ASSET_LAYOUTS } from '../../data/asset-layouts.js';
import { character, motif, moveButton, icon } from '../dom.js';

export function shadowWindows(values) {
  const readings=cloudReadings(values,true);
  return readings.map((reading,index)=>`<div class="negative-reading"><span class="pencil-label">${['Ⅰ','Ⅱ','Ⅲ'][index]}</span>${cutPaper(STAMP_MOTIFS[reading],index)}<span class="negative-target">${motif(STAMP_MOTIFS[GAP_TARGET[index]])}</span></div>`).join('');
}

// The existing painted silhouette cuts an actual hole in the paper. No replacement drawing.
function cutPaper(mark,index) {
  const layout=ASSET_LAYOUTS.motifs,frame=layout.frames[MOTIFS[mark]],id=`gap-cut-${index}`;
  return `<svg class="negative-cutout" viewBox="0 0 100 100" role="img" aria-label="${MOTIF_LABELS[mark]}形的留白"><defs><filter id="${id}-ink" color-interpolation-filters="sRGB"><feComponentTransfer><feFuncA type="discrete" tableValues="0 0 1 1"/></feComponentTransfer><feColorMatrix values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/></filter><mask id="${id}" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100" style="mask-type:luminance"><rect width="100" height="100" fill="white"/><svg x="18" y="16" width="64" height="68" viewBox="${frame.join(' ')}"><image href="${ASSETS.motifs}" width="${layout.width}" height="${layout.height}" filter="url(#${id}-ink)"/></svg></mask></defs><rect class="cut-paper" x="1" y="1" width="98" height="98" rx="2" mask="url(#${id})"/><path class="paper-edge" d="M2 3H97V97H3Z"/></svg>`;
}

export function renderNegative(progress) {
  return `<div class="negative-workbench"><div class="negative-board">${character('cloudBack',0,1,1,'同一只云景背板，覆着三片透纸')}<div class="negative-windows" data-shadow-windows>${shadowWindows(progress.values)}</div></div><div class="shadow-rails">${progress.values.map((value,index)=>`<div class="shadow-row"><span>${['Ⅰ','Ⅱ','Ⅲ'][index]}</span>${moveButton(icon('left'),{type:'turn',index,direction:-1})}<div class="shadow-track" data-shadow-track="${index}"><span class="shadow-ticks">${[0,1,2,3].map(tick=>`<small>${tick}</small>`).join('')}</span>${moveButton('<i></i>',{type:'turn',index,direction:1},{key:`shadow-${index}`,className:'shadow-tab'}).replace('<button ',`<button data-shadow="${index}" style="--slide:${value}" aria-label="移动第${index+1}片，当前${value}格" `)}</div>${moveButton(icon('right'),{type:'turn',index,direction:1})}</div>`).join('')}</div><p class="hand-note">漏进来的光，也有形状。</p></div>`;
}
