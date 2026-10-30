import {decoderModel} from './decoder-props.js';
export function decoderRoom(state){
 if(!state.solved.includes('ribbons'))return '';
 return `<div class="decoder-room" style="left:${760/1536*100}%;top:0;width:${760/1536*100}%;height:100%" aria-hidden="true"><div class="decoder-room-world">${decoderModel(state.progress.birthdayLock,{back:state.progress.ribbons.back,passive:true})}</div></div>`;
}
