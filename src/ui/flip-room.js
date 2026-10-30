import {FLIP_TOP_SOURCE,FLIP_TOP_ROOM} from '../data/flip-apparatus.js';
import {mappedPlaneStyle,polygon} from './raster-plane.js';
import {rasterStage} from './raster-stage.js';
import {flipModel} from './flip-props.js';
export function flipRoom(state){return `<span class="world-flip-top" ${state.solved.includes('flips')?'data-world-change="flips"':''} inert aria-hidden="true">${rasterStage(`<span class="world-flip-plane" style="transform:${mappedPlaneStyle(FLIP_TOP_SOURCE,FLIP_TOP_ROOM)};clip-path:${polygon(FLIP_TOP_SOURCE)}"><span class="flip-room-fallback">${flipModel(state.progress.flips,{passive:true})}</span><span class="flip-room-bitmap" data-flip-room="${state.progress.flips.tiles.join('')}"></span></span>`,1672,941)}</span>`;}
