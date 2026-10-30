import {CLOUD_GEOMETRY as G} from '../data/cloud.js';
import {cottonTexture,drawCotton} from './raster-cotton.js';

// Closed cotton loops follow the two rim tangencies, not the axle centres.
function loop(a,b,r){
 const angle=Math.atan2(b.y-a.y,b.x-a.x)+Math.PI/2;
 const at=(p,t)=>[p.x+Math.cos(t)*r,p.y+Math.sin(t)*r];
 return [at(a,angle+Math.PI),...Array.from({length:33},(_,i)=>at(b,angle+Math.PI+i*Math.PI/32)),...Array.from({length:33},(_,i)=>at(a,angle+i*Math.PI/32))];
}
export async function hydrateCloudMaterial(root){
 const canvases=[...root.querySelectorAll('[data-cloud-belt],[data-cloud-loop]')];if(!canvases.length)return;
 let image;try{image=await cottonTexture();}catch{return;}
 for(const canvas of canvases){
  if(!canvas.isConnected||canvas.dataset.cloudPainted)continue;
  const ctx=canvas.getContext('2d');
  if(canvas.hasAttribute('data-cloud-belt')){
   const {small,shaft}=G.drive,a={x:G.spindles[2],y:G.spindleY};
   for(const points of [loop(a,shaft,shaft.outer),loop(small,shaft,shaft.inner)])drawCotton(ctx,image,points,{width:5});
  }else{
   const points=Array.from({length:97},(_,i)=>{const t=i/96,angle=.8*Math.PI+t*2.15*Math.PI,r=36-t*4;return[(49+Math.cos(angle)*r)*2.56,(52+Math.sin(angle)*r)*2.56];});
   drawCotton(ctx,image,points,{width:6});
  }
  canvas.dataset.cloudPainted='true';
 }
}
