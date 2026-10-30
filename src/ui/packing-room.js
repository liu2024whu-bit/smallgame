import {PACKING_ROOM} from '../data/packing-apparatus.js';
import {matrixStyle} from './raster-plane.js';
import {rasterStage} from './raster-stage.js';
export function packingRoom(state){
 const key=JSON.stringify(state.progress.packing.placed);
 return `<span class="world-packing-top" ${state.solved.includes('packing')?'data-world-change="packing"':''} inert aria-hidden="true">${rasterStage(`<span class="packing-room-bitmap" data-packing-room='${key}' style="transform:${matrixStyle(PACKING_ROOM.floor,250,200)}"></span>`,...PACKING_ROOM.size)}</span>`;
}
