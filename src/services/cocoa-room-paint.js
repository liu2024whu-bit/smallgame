import {ASSETS} from '../data/assets.js';
import {COCOA_VESSELS,COCOA_PARTS,COCOA_MATERIALS,COCOA_CAPACITIES,COCOA_TRAY_QUAD,COCOA_ROOM_TRAY} from '../data/cocoa.js';
import {mappedPlaneMatrix,projectedPoint} from '../ui/raster-plane.js';
import {cocoaLiquidStyles} from '../ui/cocoa-props.js';
import {cocoaFluid} from './cocoa-geometry.js';

let pending;
const ready=()=>pending??=(Promise.all(['cocoaVessels','cocoaMaterials'].map(async key=>{const im=new Image();im.src=new URL('../../'+ASSETS[key],import.meta.url);await im.decode();return im;})).catch(error=>{pending=null;throw error;}));
const path=(ctx,points)=>{ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();};
function paint(canvas,levels,[props,materials]){
 const ctx=canvas.getContext('2d'),matrix=mappedPlaneMatrix(COCOA_TRAY_QUAD,COCOA_ROOM_TRAY);ctx.clearRect(0,0,1672,941);ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 const poses=COCOA_VESSELS.map(v=>{const floor=[v.x+v.base[0]*v.scale,v.y+v.base[1]*v.scale],point=projectedPoint(matrix,floor),edge=projectedPoint(matrix,[floor[0]+100,floor[1]]);return {point,scale:v.scale*Math.hypot(edge[0]-point[0],edge[1]-point[1])/100};});
 poses.forEach(({point,scale},i)=>{const w=(i>=3?375:300)*scale,h=45*scale;ctx.globalAlpha=.45;ctx.drawImage(materials,...COCOA_MATERIALS.frames[4],point[0]-w/2,point[1]-h*.4-3*scale,w,h);ctx.globalAlpha=1;});
 COCOA_VESSELS.forEach((v,i)=>{
  const {point,scale}=poses[i],[,,w,h]=COCOA_PARTS.frames[i],fluid=cocoaLiquidStyles(i,levels[i]);
  const art=()=>ctx.drawImage(props,...COCOA_PARTS.frames[i],0,0,w,h);
  ctx.save();ctx.translate(point[0]-v.base[0]*scale,point[1]-v.base[1]*scale);ctx.scale(scale,scale);art();
  if(levels[i]){
   ctx.save();ctx.filter='saturate(.68) brightness(.83)';
   if(i<3){ctx.save();path(ctx,cocoaFluid(i,levels[i]).points);ctx.clip();ctx.drawImage(materials,...COCOA_MATERIALS.frames[0],0,0,w,h);ctx.restore();}
   else{ctx.beginPath();ctx.ellipse(...v.opening,0,0,Math.PI*2);ctx.clip();}
   const [x,y,fw,fh]=fluid.surface;ctx.drawImage(materials,...COCOA_MATERIALS.frames[1],x-fw/2,y-fh/2,fw,fh);ctx.restore();
  }
  ctx.save();if(v.opening){const [x,y,rx,ry]=v.opening;ctx.beginPath();ctx.rect(0,0,w,h);ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.clip('evenodd');}art();ctx.restore();
  if(i<3){ctx.fillStyle='#6c6553aa';ctx.font='37px Georgia';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(COCOA_CAPACITIES[i],...v.mark);}
  ctx.restore();
 });
}
// The same raster frames and cavity geometry are minified once, rather than
// repeatedly resampling nested CSS background sprites in the distant room.
export function hydrateCocoaRoom(root){
 const targets=[...root.querySelectorAll('[data-cocoa-room-paint]')];if(!targets.length)return;
 ready().then(images=>{for(const target of targets)if(target.isConnected){paint(target,target.dataset.cocoaRoomPaint.split(',').map(Number),images);target.dataset.ready='true';target.previousElementSibling?.remove();}}).catch(()=>{for(const target of targets)if(target.isConnected){target.hidden=true;target.dataset.failed='true';}});
}
