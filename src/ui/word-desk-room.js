import {WORD_ROOM_CAMERA,WORD_ROOM_NOTEBOOK,WORD_ROOM_DRAWER_FLOOR} from '../data/wordlock.js';
import {drawerFloor,worldQuad} from '../puzzles/word-geometry.js';
import {wordRoomFascia} from './wordlock-apparatus.js';
import {wordNotebook} from './wordlock-papers.js';
import {wordAssemblyReady} from './word-desk.js';
import {wordAssemblyContents} from './word-assembly.js';
import {rasterStage} from './raster-stage.js';
import {mappedPlaneStyle,polygon} from './raster-plane.js';

export function wordRoomDetails(state){
 const contents=wordAssemblyReady(state)?`<div class="word-room-drawer" style="clip-path:${polygon(WORD_ROOM_DRAWER_FLOOR)}"><div class="word-room-drawer-plane" style="transform:${mappedPlaneStyle(worldQuad(drawerFloor(1),WORD_ROOM_CAMERA),WORD_ROOM_DRAWER_FLOOR)}">${wordAssemblyContents(state,WORD_ROOM_CAMERA)}</div></div>`:'';
 const ink=wordRoomFascia(state.progress.wordlock,WORD_ROOM_CAMERA)+wordNotebook({quad:WORD_ROOM_NOTEBOOK,passive:true,inkOnly:true});
 // The cabinet, keycaps, notebook edges and their shadows are already painted
 // into the room. Only actual variable ink and owned paper remain live here.
 return `<div class="world-word-desk word-room-ink" inert aria-hidden="true">${rasterStage(ink+contents,1672,941)}</div>`;
}
