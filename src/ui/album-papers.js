import {ALBUM_NAMES,ALBUM_PAGE_SIZE,ALBUM_PLACES} from '../data/album.js';
import {atlas,escape} from './dom.js';

function face(page,back,visible){
 const letter=String.fromCharCode(65+page);
 return `<span class="album-paper-face ${back?'album-paper-verso':''}" ${visible?'':'data-copy-hidden'} aria-hidden="true">${atlas('albumPages',page+(back?4:0),{className:'album-paper-art'})}<span class="album-inscription">${letter}<small>${back?'背':'正'}</small></span></span>`;
}
export function albumPapers(progress,{passive=false}={}){
 return `<div class="album-workbench"><div class="album-layout" aria-label="托板上的四张画页" style="--album-leaf-width:${ALBUM_PAGE_SIZE[0]}px;--album-leaf-height:${ALBUM_PAGE_SIZE[1]}px"><div class="album-place-marks" data-copy-group aria-hidden="true">${ALBUM_PLACES.map(([x,y],i)=>`<span style="left:${x}px;top:${y}px">${['Ⅰ','Ⅱ','Ⅲ','Ⅳ'][i]}</span>`).join('')}</div>${progress.order.map((page,slot)=>{
  const back=progress.faces[page],letter=String.fromCharCode(65+page),tag=passive?'span':'button';
  return `<div class="loose-page" data-album-page="${page}" data-album-slot="${slot}" data-album-face="${back}"><${tag} class="album-page-handle" ${passive?'':`type="button" data-album-handle="${page}" data-focus="album-page-${page}" data-pmove="${escape(JSON.stringify({type:'flip',index:page}))}" aria-label="${ALBUM_NAMES[page]}画页${letter}，${back?'背面':'正面'}" aria-describedby="album-keys" aria-keyshortcuts="ArrowLeft ArrowRight ArrowUp ArrowDown Space Enter"`}><span class="album-paper-turn" style="transform:rotateY(${back*180}deg)">${face(page,false,!back)}${face(page,true,!!back)}</span></${tag}></div>`;
 }).join('')}</div>${passive?'':'<span id="album-keys" class="sr-only">画页可以拿起换位，也能翻过来。方向键与相邻画页换位，空格或回车翻面。</span>'}</div>`;
}
