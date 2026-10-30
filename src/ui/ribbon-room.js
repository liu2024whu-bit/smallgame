import {ribbonModel} from './ribbon-props.js';
import {RIBBON_ROOM,RIBBON_WORLD} from '../data/ribbons.js';
export function ribbonRoom(state){
 return `<div class="ribbon-room" style="left:${RIBBON_ROOM[0]/1536*100}%;top:${RIBBON_ROOM[1]/1024*100}%;width:${RIBBON_WORLD[0]/1536*100}%;height:${RIBBON_WORLD[1]/1024*100}%" aria-hidden="true"><div class="ribbon-room-world">${ribbonModel(state.progress.ribbons,{passive:true,collected:state.collected.includes('birthdayRibbon'),body:!state.solved.includes('ribbons')})}</div></div>`;
}
