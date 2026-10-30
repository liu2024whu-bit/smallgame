import {MUSIC_LID_SOURCE,MUSIC_LID_ROOM,MUSIC_PLATE_SOURCE,MUSIC_PLATE_ROOM} from '../data/melody-apparatus.js';
import {musicPins,musicPapers} from './melody-props.js';
import {rasterStage} from './raster-stage.js';
import {mazeModel} from './maze-props.js';
import {MAZE_ROOM_FACE,MAZE_SOURCE_FACE} from '../data/maze-apparatus.js';
import {mappedPlaneStyle} from './raster-plane.js';

export function cabinetMechanisms(state){
 if(state.scene!=='collection')return '';
 const music=state.solved.includes('melody')?`<span class="world-music-parts" inert aria-hidden="true">${rasterStage(`<span class="world-music-source" style="transform:${mappedPlaneStyle(MUSIC_PLATE_SOURCE,MUSIC_PLATE_ROOM)}">${musicPins(state.progress.melody,{passive:true})}</span><span class="world-music-source" style="transform:${mappedPlaneStyle(MUSIC_LID_SOURCE,MUSIC_LID_ROOM)}">${musicPapers({paint:true})}</span>`,1672,941)}</span>`:'';
 const maze=`<span class="world-maze-mechanism" aria-hidden="true"><span class="maze-room-coordinate"><span class="maze-room-world" style="transform:${mappedPlaneStyle(MAZE_SOURCE_FACE,MAZE_ROOM_FACE)}">${mazeModel(state.progress.maze,{passive:true})}</span></span></span>`;
 return music+maze;
}
