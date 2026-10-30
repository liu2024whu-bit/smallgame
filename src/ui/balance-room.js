import {BALANCE_ROOM} from '../data/balance-apparatus.js';
import {balanceModel,balanceNote} from './balance-props.js';

export function balanceRoom(state){
 const {origin,scale,table,note}=BALANCE_ROOM;
 return `<span class="world-balance-mechanism" aria-hidden="true"><span class="balance-room-coordinate"><span class="balance-room-world" style="transform:translate(${origin[0]}px,${origin[1]}px) scale(${scale})">${balanceModel(state.progress.balance,{passive:true,table})}</span>${balanceNote(note)}</span></span>`;
}
