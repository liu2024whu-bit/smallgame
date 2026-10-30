import {canOpenEncore} from '../core/achievements.js';
import {ASSETS} from '../data/assets.js';
import {ENCORE_HANDLE,encoreCrankPose} from '../data/mechanism-layouts.js';
import {atlas,character,itemSprite} from './dom.js';

export function encorePanel(context){
 if(!canOpenEncore(context.state))return {title:'这一页',className:'inspect-dialog',html:'<p class="empty-note">还没翻到这里。</p>'};
 const wind=Math.max(0,Math.min(720,context.view.wind??0)),ready=wind>=360,letter=!!context.view.letter&&ready,unsealed=letter||!!context.view.unsealed;
 const middle=unsealed?`<img class="theatre-open-envelope theatre-mid-envelope" src="${ASSETS.encoreMid}" alt="" aria-hidden="true" draggable="false">`:'';
 const theatre=`<div class="paper-theatre ${ready?'theatre-awake':''}" data-encore-wind="${wind}" style="--warm:${Math.min(1,wind/360)}"><img src="${ASSETS.encoreTheatre}" alt="窗边展开的纸艺花园" draggable="false">${unsealed?`<img class="theatre-open-envelope" src="${ASSETS.encoreOpen}" alt="已经打开的信封" draggable="false">`:''}${middle}<div class="theatre-light" aria-hidden="true"></div><button class="encore-handle" data-encore-handle data-action="encore-wind" data-focus="encore-handle" aria-label="转动纸景的摇柄，也可以拖动，或用左右方向键" style="left:${ENCORE_HANDLE.x}%;top:${ENCORE_HANDLE.y}%;width:${ENCORE_HANDLE.width}%;--pivot-x:${ENCORE_HANDLE.pivotX*100}%;--pivot-y:${ENCORE_HANDLE.pivotY*100}%;--crank-pose:${encoreCrankPose(wind)}">${itemSprite(3)}</button><button class="theatre-envelope" data-action="encore-letter" data-focus="encore-letter" aria-label="${letter?'合起信纸':ready?(unsealed?'再看信纸':'拆开信封'):'信封还封着'}" aria-expanded="${letter}" ${ready?'':'disabled'}></button>${ready?`<button class="theatre-cat" aria-label="花丛里的小黑">${character('heiCat',0,2,2,'小黑')}${character('heiCat',1,2,2,'眨眼的小黑','cat-blink')}</button>`:''}</div>`;
 const note=letter?`<div class="encore-letter" aria-live="polite">${atlas('pressParts',3,{className:'encore-letter-paper'})}<div class="encore-letter-ink"><p>都找到了呀。</p><p>小屋里的画，都收好了。<br>空着的几页，还可以慢慢画。</p><p>生日快乐。</p><button class="text-button" data-action="close">好</button></div></div>`:'';
 return {title:'下次见',className:'encore-dialog',html:`<div class="encore-layout ${letter?'encore-reading':''}">${theatre}${note}</div>`};
}
