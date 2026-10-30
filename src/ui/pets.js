import { atlas,icon } from './dom.js';

export function petPanel(id,awake=false) {
  const cat=id==='cat',name=cat?'小猫':'小狗',frame=cat?0:2;
  return {title:name,className:'pet-dialog',html:`<div class="pet-corner ${awake?'is-awake':''}" data-pet-corner data-pet="${id}"><div class="pet-corner-painting" aria-hidden="true">${atlas('petCorners',frame,{className:'pet-sleep'})}${atlas('petMiddle',frame,{className:'pet-drowse'})}${atlas('petMiddle',frame+1,{className:'pet-stretch'})}${atlas('petCorners',frame+1,{className:'pet-wake'})}</div><button class="pet-stroke-area" data-action="pet-touch" aria-label="摸摸${name}">${icon('feather')}</button></div><p class="pet-murmur" role="status">${awake?cat?'嗯——再伸个懒腰。':'尾巴倒是没闲着。':cat?'留了半个垫子给你。':'听到脚步，耳朵动了一下。'}</p><div class="pet-options"><button class="text-button" data-action="pet-touch">${awake?'再摸摸':'摸摸'}${icon('feather')}</button><button class="text-button" data-action="flowers">窗边的花${icon('right')}</button></div>`};
}
