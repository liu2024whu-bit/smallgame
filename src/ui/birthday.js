import { SCENE_BY_ID } from '../data/scenes.js';
import { ASSETS } from '../data/assets.js';
import { birthdayReady } from '../core/exploration.js';
import { character, itemSprite, icon } from './dom.js';
import {sceneSource} from './scene-source.js';
import {renderScenePicture} from './room.js';
import {candleFlame} from './birthday-flame.js';
import {CANDLE_LIGHTS,PARCEL_REVEAL_REGION} from '../data/birthday-presentation.js';
import {paintMask} from '../data/scene-changes.js';

export function birthdayWaitPanel({state}){
 const message=!state.solved.includes('chocolate')?'巧克力盒的夹层，还没打开。'
  :!state.collected.includes('matches')?'火柴还在盒底呢。'
  :!state.solved.includes('cocoa')?'两杯可可还没分好，隔壁也有几样没准备完。'
  :!state.solved.includes('sweets')?'隔壁的甜点，还没给大家分好。'
  :'隔壁的生日匣，还留着一点小秘密。';
 return {title:'蛋糕',className:'inspect-dialog',html:`<div class="short-note"><p>${message}</p><button class="text-button" data-action="close">再看看</button></div>`};
}

export function candlePanel(context) {
  if(!birthdayReady(context.state))return {title:'蛋糕',className:'inspect-dialog',html:'<p class="empty-note">桌边还差一点准备。</p>'};
  const lights=(context.view.candles??0)&3,ready=lights===3;
  const picture=context.sourcePicture?.([],'birthday')??renderScenePicture({...context.state,scene:'birthday'});
  const table=sceneSource(picture,{left:575/1672*100,top:285/941*100,width:560/1672*100,height:380/941*100});
  return {title:'许愿的时候',className:'candle-dialog',html:`<div class="candle-table ${ready?'candles-ready':''}">${table}${CANDLE_LIGHTS.map((point,index)=>`${lights&(1<<index)?candleFlame(index):''}<button class="candle-wick" style="left:${point.x}%" data-action="candle-light" data-index="${index}" data-tool-target="birthday-wick:${index}" data-focus="candle-${index}" aria-label="点亮${index?'0':'2'}上的烛芯" aria-pressed="${!!(lights&(1<<index))}"><span class="wick-ring" aria-hidden="true"></span></button>`).join('')}</div><button class="candle-matches" data-action="arm-tool" data-id="matches" data-inventory-drag="matches" aria-label="火柴盒" aria-pressed="${context.state.selected==='matches'}">${itemSprite({asset:'chocolateRewardParts',index:2})}<span>火柴盒</span></button><div class="candle-afterword" aria-live="polite"><p>${ready?'愿望，小声说就好。':lights?'还差一点。':'还有两点烛光。'}</p>${ready?`<button class="primary-button" data-action="birthday-wish">${icon('star','button-stamp')}许好了${icon('right')}</button>`:''}</div>`};
}

export function passagePanel(id,context) {
  const scene=SCENE_BY_ID[id];
  const handleReady=scene.tool==='birthday-door'&&context.state.solved.includes('stitch');
  return {title:scene.title,className:'passage-dialog',html:`<div class="passage-picture" ${handleReady?'data-tool-target="birthday-door"':''}>${character('thresholds',scene.door,3,1,scene.title+'的门')}${handleReady?'<button class="handle-socket" data-action="use-direct" data-id="crank" data-tool-target="birthday-door" aria-label="把摇柄装进方口"></button>':''}</div><p class="hand-note">${handleReady?'方口还空着。':scene.closed}</p>${handleReady?`<div class="tool-dock"><button data-action="arm-tool" data-id="crank" data-inventory-drag="crank" aria-label="拿起摇柄">${itemSprite(3)}<span>摇柄</span></button></div>`:''}<button class="text-button passage-return" data-action="close">再看看</button>`};
}

export function birthdayNotePanel(id,context) {
  if(id==='fries')return {title:'脆脆的',className:'birthday-note-dialog',html:`<div class="birthday-note-art">${character('birthdayDetails',0,2,1,'拆开的薯条纸袋')}</div><p class="memory-caption">咔嚓。脑袋还在想，手已经伸过去了。</p><p class="recipe-slip">倒到空，或倒到满。<br>不添，也不倒掉。</p><button class="text-button" data-action="close">放在手边</button>`};
  const open=context.state.activities.includes('birthday:unwrap');
  return {title:open?'给你的小兔':'留给你',className:'birthday-note-dialog parcel-dialog',html:`<div class="birthday-parcel-stage" data-parcel-open="${open}"><img src="${ASSETS.parcelClosed}" alt="${open?'同一个礼物袋，米色Yummy甜美小兔从薄纸后露出来':'薄纸还盖着的礼物袋'}" draggable="false"><img class="parcel-revealed" src="${ASSETS.bunnyParcel}" alt="" aria-hidden="true" draggable="false" style="mask-image:${paintMask(PARCEL_REVEAL_REGION)}"><img class="parcel-opening" src="${ASSETS.parcelMid}" alt="" aria-hidden="true" draggable="false" style="mask-image:${paintMask(PARCEL_REVEAL_REGION)}"></div><p class="memory-caption">${open?'这只小兔，等着见你。':'还有一份，留给你。'}</p>${!open&&context.state.ending?'<button class="text-button" data-action="birthday-unwrap">拆开看看</button>':'<button class="text-button" data-action="close">先放在这儿</button>'}`};
}
