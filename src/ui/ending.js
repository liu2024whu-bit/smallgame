import { FLOWERS } from '../data/clues.js';
import { ENDING } from '../data/memories.js';
import { atlas,motif,escape,icon } from './dom.js';

export function endingPanel(selected='rose',view={}){
  const wish=FLOWERS.find(f=>f.id===selected)??FLOWERS[3];
  return {title:'生日快乐',className:'ending-dialog',html:`<div class="ending-scene">${atlas('candleFlames',0,{className:'ending-table'})}<span class="ending-lamplight" aria-hidden="true"></span><span class="ending-date">10 / 29 · 2006 — 2026</span></div><div class="ending-page"><p class="eyebrow">A LITTLE ROOM, FOR YOU</p><h2>Happy birthday,<br><span>LXY.</span></h2>${ENDING.map(line=>`<p class="birthday-letter">${escape(line)}</p>`).join('')}<div class="ending-wish-card">${motif(wish.id)}<p>${escape(wish.wish)}</p><button class="text-button" data-action="flowers">换朵花</button></div><button class="ending-last-page ${view.lastPage?'page-turned':''}" data-action="ending-page" aria-expanded="${Boolean(view.lastPage)}"><span class="ending-page-front" aria-hidden="${Boolean(view.lastPage)}">下一页 ${icon('right')}</span><span class="ending-page-back" aria-hidden="${!view.lastPage}">还空着呢。<small>以后，慢慢写。</small></span></button><button class="primary-button" data-action="close">再坐一会儿${icon('moon')}</button></div>`};
}
