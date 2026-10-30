import {FLOWERS} from '../data/clues.js';
import {ENDING} from '../data/memories.js';
import {atlas,motif,escape,icon} from './dom.js';
import {sceneSource} from './scene-source.js';
import {renderScenePicture} from './room.js';

export function endingPanel(context){
 const {state,view={},flower:selected='rose'}=context;
 const wish=FLOWERS.find(f=>f.id===selected)??FLOWERS[3],turned=!!view.lastPage;
 const picture=context.sourcePicture?.([],'birthday')??renderScenePicture({...state,scene:'birthday'});
 const table=sceneSource(picture,{left:575/1672*100,top:285/941*100,width:560/1672*100,height:380/941*100});
 const face=(side,html)=>`<span class="ending-page-${side}" aria-hidden="${side==='front'?turned:!turned}">${atlas('pressParts',3,{className:'ending-leaf-paper'})}<span>${html}</span></span>`;
 const leaf=`<button class="ending-last-page ${turned?'page-turned':''}" data-action="ending-page" aria-expanded="${turned}">${face('front','下一页 '+icon('right'))}${face('back','还空着呢。<small>以后，慢慢写。</small>')}</button>`;
 return {title:'生日快乐',className:'ending-dialog',html:`<div class="ending-layout"><section class="ending-card"><div class="ending-scene">${table}<span class="ending-lamplight" aria-hidden="true"></span></div><span class="ending-date">A DAY IN JUNE</span><p class="eyebrow">A LITTLE ROOM, FOR YOU</p><h2>Happy birthday,<br><span>dear you.</span></h2></section><div class="ending-page">${ENDING.map(line=>`<p class="birthday-letter">${escape(line)}</p>`).join('')}<div class="ending-wish-card">${motif(wish.id)}<p>${escape(wish.wish)}</p><button class="text-button" data-action="flowers">换朵花</button></div><div class="ending-actions">${leaf}<button class="primary-button" data-action="close">再坐一会儿${icon('moon')}</button></div></div></div>`};
}
