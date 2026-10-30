import {ribbonRoom} from './ribbon-room.js';
import {decoderRoom} from './decoder-room.js';
import {sweetsRoom} from './sweets-room.js';

export function partyRoom(state,{exclude=[]}={}){
 if(state.scene!=='party')return '';
 return `${exclude.includes('sweets')?'':sweetsRoom(state)}${exclude.includes('ribbons')?'':ribbonRoom(state)}${exclude.includes('birthdayLock')||exclude.includes('ribbons')?'':decoderRoom(state)}`;
}
