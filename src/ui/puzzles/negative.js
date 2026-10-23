import { GAP_TARGET, cloudReadings } from '../../puzzles/rotors.js';
import { STAMP_MOTIFS } from '../../data/assets.js';
import { character, motif, moveButton, icon } from '../dom.js';

export function shadowWindows(values) {
  const readings=cloudReadings(values,true);
  return readings.map((reading,index)=>`<div class="negative-reading"><span class="pencil-label">${['Ⅰ','Ⅱ','Ⅲ'][index]}</span><span class="negative-cutout">${motif(STAMP_MOTIFS[reading])}</span><span class="negative-target">${motif(STAMP_MOTIFS[GAP_TARGET[index]])}</span></div>`).join('');
}

export function renderNegative(progress) {
  return `<div class="negative-workbench"><div class="negative-board">${character('skyClouds',2,1,3,'纸景背后的透片与绳路')}<div class="negative-windows" data-shadow-windows>${shadowWindows(progress.values)}</div></div><div class="shadow-rails">${progress.values.map((value,index)=>`<div class="shadow-row"><span>${['Ⅰ','Ⅱ','Ⅲ'][index]}</span>${moveButton(icon('left'),{type:'turn',index,direction:-1})}<div class="shadow-track" data-shadow-track="${index}"><span class="shadow-ticks">${[0,1,2,3].map(tick=>`<small>${tick}</small>`).join('')}</span>${moveButton('<i></i>',{type:'turn',index,direction:1},{key:`shadow-${index}`,className:'shadow-tab'}).replace('<button ',`<button data-shadow="${index}" style="--slide:${value}" aria-label="移动第${index+1}片，当前${value}格" `)}</div>${moveButton(icon('right'),{type:'turn',index,direction:1})}</div>`).join('')}</div><p class="hand-note">透片拉开，空白也要对上。</p></div>`;
}
