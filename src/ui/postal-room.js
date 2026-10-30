import {POSTAL_ROOM_DIGITS,POSTAL_ROOM_SIGNS,POSTAL_ROOM_TICKET,POSTAL_ROOM_PIN} from '../data/postal.js';
import {POSTAL_ORDER} from '../data/ciphers.js';
import {inventory} from '../core/state.js';
import {postalCardFront,postalGrid,borrowingTicket} from './postal-papers.js';
import {rasterStage} from './raster-stage.js';
import {atlas} from './dom.js';

const rect=([x,y,w,h])=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px;`;
export function postalRoomDetails(state){
 const p=state.progress.postbox;
 const numbers=p.opened?'':p.values.map((value,i)=>`<span class="postal-room-digit" style="${rect(POSTAL_ROOM_DIGITS[i])}">${value}</span><span class="postal-room-sign" style="${rect(POSTAL_ROOM_SIGNS[i])}">${POSTAL_ORDER[i]}</span>`).join('');
 const ticket=p.opened&&!inventory(state).includes('borrowSlip')?`<span class="world-postal-ticket" style="${rect(POSTAL_ROOM_TICKET)}">${borrowingTicket()}</span><span class="world-postal-pin" style="${rect(POSTAL_ROOM_PIN)}">${atlas('postalProps',1,{label:'',className:'postal-room-pin-art'})}</span>`:'';
 // Furniture, the plant and the open door are painted with the room. Only
 // actual numbers, the pending ticket and the established paper clues are live.
 return `<div class="world-postal-ink" inert aria-hidden="true">${rasterStage(numbers+ticket,1672,941)}</div><div class="world-postal-grid" aria-hidden="true" inert>${postalGrid({paper:false})}</div>${[0,1].map(card=>`<span class="world-postal-card world-postal-card-${card}" aria-hidden="true" inert>${postalCardFront(card)}</span>`).join('')}`;
}
