import { SCENE_BY_ID } from '../data/scenes.js';
import { ASSETS } from '../data/assets.js';
import { birthdayReady } from '../core/exploration.js';
import { character, itemSprite, icon } from './dom.js';

export function candlePanel(context) {
  if(!birthdayReady(context.state))return {title:'蛋糕',className:'inspect-dialog',html:'<p class="empty-note">可可还没有分好。</p>'};
  const lights=(context.view.candles??0)&3,ready=lights===3;
  return {title:'许愿的时候',className:'candle-dialog',html:`<div class="candle-table ${ready?'candles-ready':''}">${character('candleTable',0,1,1,'桌上的雏菊蛋糕和二十岁蜡烛','candle-base')}${[0,1].map(index=>`${lights&(1<<index)?`<span class="candle-light flame-${index}" aria-hidden="true">${character('candleFlames',0,1,1,'')}</span>`:''}<button class="candle-wick wick-${index}" data-action="candle-light" data-index="${index}" data-focus="candle-${index}" aria-label="点亮${index?'0':'2'}上的烛芯" aria-pressed="${!!(lights&(1<<index))}"><span class="wick-ring" aria-hidden="true"></span></button>`).join('')}</div><div class="candle-afterword" aria-live="polite"><p>${ready?'愿望，小声说就好。':'还有两点烛光。'}</p>${ready?`<button class="primary-button" data-action="birthday-wish">${icon('star','button-stamp')}愿望收好了${icon('right')}</button>`:''}</div>`};
}

export function passagePanel(id,context) {
  const scene=SCENE_BY_ID[id];
  const handleReady=scene.tool==='birthday-door'&&context.state.solved.includes('stitch');
  return {title:scene.title,className:'passage-dialog',html:`<div class="passage-picture" ${handleReady?'data-tool-target="birthday-door"':''}>${character('thresholds',scene.door,3,1,scene.title+'的门')}${handleReady?'<button class="handle-socket" data-action="use-direct" data-id="crank" data-tool-target="birthday-door" aria-label="把摇柄装进方口"></button>':''}</div><p class="hand-note">${handleReady?'方口还空着。':scene.closed}</p>${handleReady?`<div class="tool-dock"><button data-action="arm-tool" data-id="crank" data-inventory-drag="crank" aria-label="拿起摇柄">${itemSprite(3)}<span>摇柄</span></button></div>`:''}<button class="text-button passage-return" data-action="close">再看看</button>`};
}

export function birthdayNotePanel(id,context) {
  if(id==='fries')return {title:'脆脆的',className:'birthday-note-dialog',html:`<div class="birthday-note-art">${character('birthdayDetails',0,2,1,'拆开的薯条纸袋')}</div><p class="memory-caption">咔嚓。脑袋还在想，手已经伸过去了。</p><p class="recipe-slip">倒到空，或倒到满。<br>不添，也不倒掉。</p><button class="text-button" data-action="close">放在手边</button>`};
  const open=context.state.activities.includes('birthday:unwrap');
  return {title:open?'给你的小兔':'留给你',className:'birthday-note-dialog',html:`<div class="birthday-note-art ${open?'parcel-open':'parcel-wrapped'}">${open?`<img src="${ASSETS.bunnyParcel}" alt="为这次生日准备的米色Yummy甜美小兔" draggable="false">`:character('birthdayDetails',1,2,1,'尚未拆开的礼物袋')}</div><p class="memory-caption">${open?'今年给你准备的，米色小兔。':'还有一份，留给你。'}</p>${!open&&context.state.ending?'<button class="text-button" data-action="birthday-unwrap">拆开看看</button>':'<button class="text-button" data-action="close">先放在这儿</button>'}`};
}
