import {GARDEN_ROOM_SIZE,GARDEN_ROOM_SLOTS,GARDEN_ROOM_BOARD,GARDEN_ROOM_PAPER_SCALE as scale,GARDEN_SLOTS,gardenRoomPlantBox} from '../data/garden.js';
import {inventory} from '../core/state.js';
import {atlas} from './dom.js';
import {rasterStage} from './raster-stage.js';
import {bookFigure,gardenNote,plane} from './puzzles/garden-art.js';

const box=([x,y,w,h])=>`left:${x}px;top:${y}px;width:${w}px;height:${h}px;`;
function bookmark(pin){
 if(pin<0)return '';
 const [x,y]=GARDEN_ROOM_SLOTS[pin],[sx,sy]=GARDEN_SLOTS[pin];
 return `<div class="garden-room-book" style="left:${x-sx*scale}px;top:${y-sy*scale}px;transform:scale(${scale})">${bookFigure(pin,{hit:false})}</div>`;
}
export function gardenRoomDetails(state){
 const p=state.progress.flowers;
 const note=`<div class="garden-room-note" style="left:${1178-242*scale}px;top:${444-496*scale}px;transform:scale(${scale})">${gardenNote(state.progress.film.order,true)}</div>`;
 const plants=p.heights.map((height,i)=>`<span class="garden-room-plant" data-room-plant="${i}" data-room-height="${height}" style="${box(gardenRoomPlantBox(i,height))}">${atlas('gardenRoomPlants',i)}</span>`).join('');
 const board=p.opened&&!inventory(state).includes('board')?`<span class="garden-room-board">${plane('board',0,GARDEN_ROOM_BOARD,'room-board')}</span>`:'';
 // The fixed rails, base, cranks and open drawer belong to the room painting.
 // Only the actual lift positions, paper, bookmark and unclaimed board vary.
 return `<div class="world-garden" inert aria-hidden="true">${rasterStage(note+plants+bookmark(p.pin)+board,...GARDEN_ROOM_SIZE)}</div>`;
}
