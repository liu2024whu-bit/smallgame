import {ASSET_LAYOUTS} from '../data/asset-layouts.js';
import { PRINCE_COMPANION as prince } from '../data/companions.js';
import { character,atlas } from './dom.js';

export function roomCompanions(scene){
  if(scene==='collection')return `<button class="room-mascot" data-action="hei-greet" aria-label="和罗小黑打个招呼"><span class="mascot-base">${[0,1].map(frame=>character('heiCat',frame,2,2,'',`mascot-frame frame-${frame}`)).join('')}</span>${[0,1,2,3,4,5].map(frame=>atlas('heiGreeting',frame,{className:'greeting-frame',style:`--foot-x:${ASSET_LAYOUTS.heiGreeting.anchors[frame]};`})).join('')}</button>`;
  if(scene===prince.scene)return `<button class="painted-companion" data-action="prince-greet" aria-label="${prince.label}" style="left:${prince.x}%;top:${prince.y}%;width:${prince.width}%;height:${prince.height}%"><span class="prince-light" aria-hidden="true" style="left:${(prince.star.x-prince.x)/prince.width*100}%;top:${(prince.star.y-prince.y)/prince.height*100}%;width:${prince.star.width/prince.width*100}%">${[0,1,2,3].map(frame=>atlas('princeLight',frame,{className:'prince-light-frame'})).join('')}</span></button>`;
  return '';
}
