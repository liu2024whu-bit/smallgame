import { FRAME_PERFORATIONS } from '../../puzzles/film.js';
import { FLOWER_LINKS } from '../../puzzles/flowers.js';
import { GARDEN,GARDEN_WORLD,GARDEN_PLANTS as PLANTS,GARDEN_NAMES,GARDEN_PAIRS } from '../../data/garden.js';
import { character,motif,moveButton,atlas,icon } from '../dom.js';

function filmNote(order,large=false){
  const content=`<small>孔 <span aria-hidden="true">↔</span> 高</small><div>${order.map((frame,index)=>`<span><b>${['Ⅰ','Ⅱ','Ⅲ'][frame]}</b><span class="garden-frame">${character('cinema',0,1,1,'胶片')}${motif('petal')}</span><i class="garden-perforations">${Array.from({length:FRAME_PERFORATIONS[frame]},()=>'<i></i>').join('')}</i>${motif(PLANTS[index])}</span>`).join('')}</div>`;
  return large?`<div class="garden-note-closeup">${content}</div>`:`<button class="garden-film" data-action="flower-note" aria-label="拿近看看胶片纸条">${content}</button>`;
}
export const flowerNotePanel=state=>({title:'胶片纸条',className:'inspect-dialog',html:filmNote(state.progress.film.order,true)});

function column(height,index,pin,miniature=false,g=GARDEN){
  return `<div class="flower-column ${pin===index?'rail-braked':''}" style="--center:${g.centers[index]}%" data-flower-column="${index}" data-tool-target="flower-pin:${index}"><div class="height-scale" aria-hidden="true">${[3,2,1,0].map(level=>`<span class="${height===level?'current-level':''}" style="top:${g.levels[level]}%">${level}</span>`).join('')}</div><div class="flower-pot" style="top:${g.levels[height]}%"><span class="flower-platform"></span>${motif(PLANTS[index])}<span class="platform-collar"></span><i class="carriage-brake" aria-hidden="true"></i></div><div class="flower-column-foot" style="left:${g.slotCenters?.[index]??g.centers[index]}%;top:${g.slot}%;">${miniature?'':moveButton('<i class="pin-mouth" aria-hidden="true"></i>',{type:'pin',index},{className:pin===index?'pinned':'',key:`pin-${index}`,toolTarget:`flower-pin:${index}`}).replace('<button ',`<button aria-label="${pin===index?'取回':'把书签放进'}${['左','中','右'][index]}槽" `)}</div></div>`;
}
function crank(index,turn,holding,miniature=false,g=GARDEN){
  const arcs='<svg class="garden-turn-arcs" viewBox="0 0 100 100" aria-hidden="true"><path d="M22 37a31 31 0 0 1 51-12m-3-8 5 10-11 1M78 63a31 31 0 0 1-51 12m3 8-5-10 11-1"/></svg>';
  const art=`${atlas('gardenCrank',0,{className:'garden-handle'})}${arcs}<span class="linked-pots" aria-hidden="true">${FLOWER_LINKS[index].map(i=>icon(PLANTS[i])).join('')}</span>`;
  if(miniature)return `<span class="garden-crank puzzle-control" style="left:${(g.crankCenters??g.centers)[index]}%;top:${g.crank}%;--garden-turn:${turn*90}deg;">${art}</span>`;
  return moveButton(art,{type:'crank',index},{className:'garden-crank',disabled:holding,key:`flower-crank-${index}`}).replace('<button ',`<button style="left:${(g.crankCenters??g.centers)[index]}%;top:${g.crank}%;--garden-turn:${turn*90}deg;" data-garden-crank="${index}" data-flower-links="${FLOWER_LINKS[index].join(',')}" aria-label="${GARDEN_PAIRS[index]}花盆的摇柄，可正反转；方向键也能转" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown" `);
}
function bookmark(pin,miniature=false,g=GARDEN){
  const placed=pin>=0;
  const tag=miniature?'span':'button';
  return `<${tag} class="garden-wedge ${placed?'wedge-in':'wedge-rest'}" style="width:${g.bookmarkWidth}%;left:${placed?(g.slotCenters??g.centers)[pin]:g.bookmarkRest[0]}%;top:${placed?g.slot:g.bookmarkRest[1]}%;" ${miniature?'':'data-bookmark-grab data-focus="garden-bookmark"'} ${miniature?'':placed?'data-pmove=\'{"type":"set-pin","index":-1}\'':'data-action="arm-tool" data-id="bookmark"'} aria-label="${placed?'取回木书签，也可以拖出来':'拿起木书签，可以拖进窄槽'}">${atlas('gardenBookmark',0,{className:'wedge-art',label:'侧面的木书签与棕色穗子'})}</${tag}>`;
}
export function gardenMiniature(progress,done){
  return `<div class="world-garden" aria-hidden="true" inert><div class="garden-lift ${done?'garden-awake':''}">${character('gardenBody',0,1,1,'')}${progress.heights.map((h,i)=>column(h,i,progress.pin,true,GARDEN_WORLD)).join('')}${[0,1,2].map(i=>crank(i,progress.turns?.[i]??0,false,true,GARDEN_WORLD)).join('')}${bookmark(progress.pin,true,GARDEN_WORLD)}</div></div>`;
}
export function renderFlowers(progress,context){
  const done=context.state.solved.includes('flowers');
  return `<div class="flowers-workbench"><div class="garden-lift ${context.state.selected==='bookmark'?'holding-bookmark':''} ${done?'garden-awake':''}" data-flower-pin="${progress.pin}">${character('garden',0,1,1,'有四档木轨、三枚摇柄和书签窄槽的花架')}<span class="garden-windowlight" aria-hidden="true"></span>${filmNote(context.state.progress.film.order)}${progress.heights.map((h,i)=>column(h,i,progress.pin)).join('')}${[0,1,2].map(i=>crank(i,progress.turns?.[i]??0,context.state.selected==='bookmark')).join('')}${bookmark(progress.pin)}<span class="garden-knock" role="status"></span><output class="sr-only" data-garden-status>${progress.heights.map((h,i)=>GARDEN_NAMES[i]+'在第'+h+'格').join('，')}${progress.pin>=0?'；'+GARDEN_NAMES[progress.pin]+'暂时停住了':''}</output></div><span class="sr-only">摇柄旁的两枚花纹对应一起升降的花盆。正反拖转，或用方向键调节。到头会停住。木书签可以暂时抵住一盆；拖出来或再点一下就能取回。</span></div>`;
}
