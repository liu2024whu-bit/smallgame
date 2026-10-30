import {COCOA_VESSELS,COCOA_TRAY_QUAD,COCOA_ROOM_TRAY} from '../data/cocoa.js';
import {ASSETS} from '../data/assets.js';
import {mappedPlaneMatrix,projectedPoint} from './raster-plane.js';
import {cocoaVessel} from './cocoa-props.js';

export function cocoaRoom(state){
 if(state.scene!=='birthday')return '';
 const matrix=mappedPlaneMatrix(COCOA_TRAY_QUAD,COCOA_ROOM_TRAY),tray=`<img class="cocoa-room-tray" src="${ASSETS.cocoaTray}" alt="" draggable="false" style="transform:matrix3d(${matrix.join(',')})">`;
 const props=COCOA_VESSELS.map((v,i)=>{
  const floor=[v.x+v.base[0]*v.scale,v.y+v.base[1]*v.scale],point=projectedPoint(matrix,floor),edge=projectedPoint(matrix,[floor[0]+100,floor[1]]),scale=v.scale*Math.hypot(edge[0]-point[0],edge[1]-point[1])/100;
  return cocoaVessel(i,state.progress.cocoa.levels[i],{passive:true,pose:{x:point[0]-v.base[0]*scale,y:point[1]-v.base[1]*scale,scale}});
 }).join('');
 return `<div class="world-birthday-cocoa" inert aria-hidden="true" data-cocoa-room-levels="${state.progress.cocoa.levels.join(',')}"><div class="cocoa-room-world" data-source-camera="0,0,1672,941">${tray}<div class="cocoa-room-fallback">${props}</div><canvas class="cocoa-room-paint" width="1672" height="941" data-cocoa-room-paint="${state.progress.cocoa.levels.join(',')}"></canvas></div></div>`;
}
