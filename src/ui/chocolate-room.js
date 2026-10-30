import {ASSETS,SCENE_ART} from '../data/assets.js';
import {CHOCOLATE_CUPS,CHOCOLATE_SPOTS,CHOCOLATE_ROOM_BOX,CHOCOLATE_ROOM_FLOOR,CHOCOLATE_GRID_QUAD,CHOCOLATE_PLATE_QUAD,CHOCOLATE_ROOM_PLATE,CHOCOLATE_ROOM_LID,CHOCOLATE_DRAWER_QUAD,CHOCOLATE_ROOM_DRAWER} from '../data/chocolate.js';
import {atlas} from './dom.js';
import {mappedPlaneStyle,mappedPlaneMatrix,projectedPoint,matrixStyle} from './raster-plane.js';
import {rasterStage} from './raster-stage.js';
import {paintMask} from '../data/scene-changes.js';
import {bonbon,chocolateLidSample,chocolateDrawer} from './puzzles/chocolate.js';

const location=([x,y],content,size=100)=>`<span class="choc-room-piece" style="left:${x-size/2}px;top:${y-size/2}px;width:${size}px;height:${size}px">${content}</span>`;
export function chocolateRoom(state){
 if(state.scene!=='birthday')return '';
 const p=state.progress.chocolate;
 const [x,y,w,h]=CHOCOLATE_ROOM_BOX;
 const cups=p.opened?CHOCOLATE_CUPS.map(point=>location(point,atlas('chocolateParts',4))).join(''):'';
 const pieces=area=>{const matrix=mappedPlaneMatrix(area?CHOCOLATE_PLATE_QUAD:CHOCOLATE_GRID_QUAD,area?CHOCOLATE_ROOM_PLATE:CHOCOLATE_ROOM_FLOOR);return p.places.map((slot,piece)=>{if((slot>=25)!==area)return '';const point=CHOCOLATE_SPOTS[slot],[cx,cy]=projectedPoint(matrix,point),edge=projectedPoint(matrix,[point[0]+76,point[1]]),width=Math.hypot(edge[0]-cx,edge[1]-cy),height=width*.65;return `<span class="choc-room-bonbon" style="left:${cx-width/2}px;top:${cy-height+3}px;width:${width}px;height:${height}px">${bonbon(piece)}</span>`;}).join('');};
 const drawer=`<div class="choc-room-plane" style="transform:${mappedPlaneStyle(CHOCOLATE_DRAWER_QUAD,CHOCOLATE_ROOM_DRAWER)}">${chocolateDrawer(p,{passive:true,collected:state.collected.includes('matches')})}</div>`;
 const body=p.opened?`<img class="choc-room-box" src="${ASSETS.chocolateRoomBox}" alt="" draggable="false" style="left:${x}px;top:${y}px;width:${w}px;height:${h}px"><div class="choc-room-plane" style="transform:${mappedPlaneStyle(CHOCOLATE_GRID_QUAD,CHOCOLATE_ROOM_FLOOR)}">${cups}</div>${pieces(false)}<div class="choc-room-lid-ink" style="transform:${matrixStyle(CHOCOLATE_ROOM_LID,650,575)}">${chocolateLidSample()}</div>`:'';
 const closed=p.opened?'':`<img class="scene-change" src="${SCENE_ART.birthday}" alt="" aria-hidden="true" style="animation:none;mask-image:${paintMask([28.6,59.5,17.3,11.8])}" draggable="false">`;
 const plate=pieces(true);
 return `${closed}<div class="world-birthday-chocolate" inert aria-hidden="true" data-choc-room-pieces="${p.places.join(',')}" data-choc-room-drawer="${p.drawer}" data-choc-room-matches="${!state.collected.includes('matches')}">${rasterStage(body+plate+drawer,1672,941)}</div>`;
}
