import {ASSET_LAYOUTS} from '../data/asset-layouts.js';
import { PRINCE_COMPANION as prince } from '../data/companions.js';
import { character,icon,atlas } from './dom.js';

export function roomCompanions(scene){
  if(scene==='collection')return `<button class="room-mascot" data-action="hei-greet" aria-label="和罗小黑打个招呼"><span class="mascot-base">${[0,1].map(frame=>character('heiCat',frame,2,2,'',`mascot-frame frame-${frame}`)).join('')}</span>${[0,1,2,3,4,5].map(frame=>atlas('heiGreeting',frame,{className:'greeting-frame',style:`--foot-x:${ASSET_LAYOUTS.heiGreeting.anchors[frame]};`})).join('')}</button>`;
  if(scene===prince.scene)return `<button class="painted-companion" data-action="prince-greet" aria-label="${prince.label}" style="left:${prince.x}%;top:${prince.y}%;width:${prince.width}%;height:${prince.height}%"><span class="companion-reply" aria-hidden="true">${icon('star')}</span></button>`;
  return '';
}
