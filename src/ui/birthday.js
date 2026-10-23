import { SCENE_BY_ID } from '../data/scenes.js';
import { ASSETS } from '../data/assets.js';
import { character, itemSprite } from './dom.js';

export function passagePanel(id,context) {
  const scene=SCENE_BY_ID[id];
  const handleReady=id==='birthday'&&context.state.solved.includes('stitch');
  return {title:scene.title,className:'passage-dialog',html:`<div class="passage-picture" ${handleReady?'data-tool-target="birthday-door"':''}>${character('thresholds',scene.door,3,1,scene.title+'的门')}${handleReady?'<button class="handle-socket" data-action="use-direct" data-id="crank" data-tool-target="birthday-door" aria-label="把摇柄装进方口"></button>':''}</div><p class="hand-note">${handleReady?'方口还空着。':scene.closed}</p>${handleReady?`<div class="tool-dock"><button data-action="arm-tool" data-id="crank" data-inventory-drag="crank" aria-label="拿起摇柄">${itemSprite(3)}<span>摇柄</span></button></div>`:''}<button class="text-button passage-return" data-action="close">再看看</button>`};
}

export function birthdayNotePanel(id,context) {
  if(id==='fries')return {title:'脆脆的',className:'birthday-note-dialog',html:`<div class="birthday-note-art">${character('birthdayDetails',0,2,1,'拆开的薯条纸袋')}</div><p class="memory-caption">咔嚓。先吃一点，慢慢想。</p><p class="recipe-slip">倒到空，或倒到满。<br>不添，也不倒掉。</p><button class="text-button" data-action="close">放在手边</button>`};
  const open=context.state.activities.includes('birthday:unwrap');
  return {title:open?'给你的小兔':'留给你',className:'birthday-note-dialog',html:`<div class="birthday-note-art ${open?'parcel-open':'parcel-wrapped'}">${open?`<img src="${ASSETS.bunnyParcel}" alt="为这次生日准备的米色Yummy甜美小兔" draggable="false">`:character('birthdayDetails',1,2,1,'尚未拆开的礼物袋')}</div><p class="memory-caption">${open?'今年给你准备的，米色小兔。':'还有一份，留给你。'}</p>${!open&&context.state.ending?'<button class="text-button" data-action="birthday-unwrap">拆开看看</button>':'<button class="text-button" data-action="close">先放在这儿</button>'}`};
}
