import {viewControl} from '../view-control.js';
import {ASSETS} from '../../data/assets.js';
import {inventory} from '../../core/state.js';
import {GARDEN_CENTERS as CENTERS,GARDEN_LEVELS as LEVELS,GARDEN_CRANKS as CRANKS,GARDEN_SLOTS as SLOTS,GARDEN_CAMERAS as CAMERAS,GARDEN_NAMES,GARDEN_PAIRS} from '../../data/garden.js';
import {FLOWER_LINKS} from '../../puzzles/flowers.js';
import {FILM_ORDER} from '../../puzzles/film.js';
import {plant,bookFigure,drawer,gardenNote,sprite} from './garden-art.js';

const act=action=>`data-pmove='${JSON.stringify(action)}'`;
function gardenArt(p,{owned=[],holding=false,camera=CAMERAS.whole,order=FILM_ORDER}={}){
 const focus=['left','middle','right'].findIndex(key=>camera===CAMERAS[key]);
 return `<img class="garden-body" src="${ASSETS.gardenBody}" alt="四档木轨、成对花纹、三只摇柄和底座小屉" draggable="false">
 ${CENTERS.map((x,i)=>`<span class="garden-scale" style="left:${x-35}px" aria-hidden="true">${LEVELS.map((y,n)=>`<small class="${p.heights[i]===n?'current-level':''}" style="top:${y-12}px">${n}</small>`).join('')}</span>`).join('')}
 ${p.heights.map((h,i)=>plant(i,h)).join('')}${gardenNote(order,focus>0)}${p.pin>=0?bookFigure(p.pin,{hit:focus<0||focus===p.pin}):''}
 ${CRANKS.map(([x,y],i)=>`<span class="garden-crank" style="left:${x}px;top:${y}px"><span class="garden-crank-art" data-crank-art="${i}" style="rotate:${p.turns[i]*90}deg">${sprite('parts',3)}</span><button data-garden-crank="${i}" data-flower-links="${FLOWER_LINKS[i]}" data-focus="garden-crank-${i}" ${act({type:'crank',index:i})} aria-label="${GARDEN_PAIRS[i]}花盆的摇柄，可正反转" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown" ${p.opened||holding||focus>=0&&focus!==i?'disabled':''}></button></span>`).join('')}
 ${SLOTS.map(([x,y],i)=>`<button class="garden-slot ${p.pin===i?'occupied':''}" data-slot="${i}" data-tool-target="flower-pin:${i}" data-action="use-direct" data-id="bookmark" data-focus="garden-slot-${i}" aria-label="把木书签放进${['左','中','右'][i]}槽" style="left:${x}px;top:${y}px" ${!holding||!owned.includes('bookmark')||focus>=0&&focus!==i?'disabled':''}></button>`).join('')}
 ${drawer(Number(p.opened),owned.includes('board'),camera,p.opened)}`;
}
export function renderFlowers(p,{state,view={}}){
 const mode=Object.hasOwn(CAMERAS,view.gardenView)?view.gardenView:'whole',camera=CAMERAS[mode],owned=inventory(state),holding=state.selected==='bookmark'&&p.pin<0;
 const status=p.opened?(owned.includes('board')?'小屉空了。':'托板还在屉里。'):p.attempts?'还卡着呢。':'';
 return `<div class="flowers-workbench" data-garden-mode="${mode}"><div class="garden-viewport" style="--garden-aspect:${camera[2]/camera[3]}"><div class="garden-world ${holding?'holding-bookmark':''}" data-source-camera="${camera}" data-flower-pin="${p.pin}" data-garden-open="${p.opened}"><img class="garden-environment" src="${ASSETS.gardenNook}" alt="" draggable="false">${gardenArt(p,{owned,holding,camera,order:state.progress.film.order})}</div></div>
 <nav class="garden-navigation" aria-label="花架取景">${Object.keys(CAMERAS).map((id,i)=>`${viewControl(`${['架上','雏菊','郁金香','薰衣草'][i]}`,`data-action="garden-view" data-id="${id}" aria-current="${id===mode}"`)}`).join('')}</nav><output class="garden-reply" role="status">${status}</output>
 <output class="sr-only" data-garden-status>${p.heights.map((h,i)=>GARDEN_NAMES[i]+'在第'+h+'格').join('，')}${p.pin>=0?'；'+GARDEN_NAMES[p.pin]+'暂时停住了':''}</output><span class="sr-only">摇柄旁两枚花纹对应一起升降的花盆。拖转或方向键可正反转，端点会停。木书签可以向上拔出，再放进另一条窄槽。下屉可拖拉或按回车试开。</span></div>`;
}
export const flowerNotePanel=state=>({title:'检片小样',className:'inspect-dialog garden-note-dialog',html:`<div class="garden-note-closeup">${gardenNote(state.progress.film.order,true)}</div>`});
