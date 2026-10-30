import {SWEETS_ROOM} from '../data/sweets.js';
import {sweetsModel} from './sweets-props.js';

export function sweetsRoom(state){
 const {x,y,scale}=SWEETS_ROOM,p=state.progress.sweets;
 return `<div class="world-party-sweets" inert aria-hidden="true" data-sweets-room="${p.cuts.join(',')}:${Number(p.served)}:${Number(state.collected.includes('birthdayCard'))}"><div class="sweets-room-world" data-source-camera="0,0,1536,1024"><div class="sweets-room-props" style="transform:translate(${x}px,${y}px) scale(${scale})">${sweetsModel(p,{passive:true,collected:state.collected.includes('birthdayCard')})}</div></div></div>`;
}
