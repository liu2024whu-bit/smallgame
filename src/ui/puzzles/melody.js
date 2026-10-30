import {MUSIC_CAMERA} from '../../data/melody-apparatus.js';
import {musicModel} from '../melody-props.js';

export function renderMelody(p,{state}){
 const done=state.solved.includes('melody');
 return `<div class="melody-workbench"><div class="melody-viewport"><div class="music-apparatus" data-source-camera="${MUSIC_CAMERA}" data-music-pose="${p.notes.join(',')}">${musicModel(p,{done})}</div></div><span class="sr-only">盒盖的两张纸笺记着六个音钉的高低关系。音钉可轻拖，也可点槽，方向键上下挪一格。右侧的摇柄可以轻点或转一转来试听；声音不影响判断。${done?'风铃在盒子的左手边，可以拿近看。':''}</span></div>`;
}
