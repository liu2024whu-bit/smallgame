import {cottonTexture as sources,drawCotton} from '../raster-cotton.js';
import {beltCordPoints} from '../../puzzles/belt-geometry.js';
const caches=new WeakMap();
// Painted cotton samples follow rim tangencies, never a visible vector stroke
// or center-to-center diagram. A cached spool path leaves only the loose tail
// to repaint during a pointer move between two guides.
const brush=(ctx,image,points)=>drawCotton(ctx,image,points);
export async function paintBeltCord(field,p,tail=null){
 const canvas=field.querySelector('.belt-cord');if(!canvas)return;
 const ticket=(canvas._paintTicket??0)+1;canvas._paintTicket=ticket;
 let image;try{image=await sources();}catch{return;}
 if(!canvas.isConnected||canvas._paintTicket!==ticket)return;
 const key=JSON.stringify([p.route,p.crossed,p.fitted[0]]);let cache=caches.get(canvas);
 if(cache?.key!==key){
  const layer=document.createElement('canvas');layer.width=1536;layer.height=1024;
  const points=p.fitted[0]?p.route.length?beltCordPoints(p.route,p.crossed):beltCordPoints([0],false,[423,650]):[];brush(layer.getContext('2d'),image,points);
  cache={key,layer,points};caches.set(canvas,cache);
 }
 const ctx=canvas.getContext('2d');ctx.clearRect(0,0,1536,1024);ctx.drawImage(cache.layer,0,0);
 if(tail&&cache.points.length&&p.route.length<7){
  const end=cache.points.at(-1),points=[end],sag=Math.min(35,Math.hypot(tail[0]-end[0],tail[1]-end[1])*.14);
  for(let i=1;i<=30;i++){const t=i/30;points.push([end[0]+(tail[0]-end[0])*t,end[1]+(tail[1]-end[1])*t+Math.sin(t*Math.PI)*sag]);}brush(ctx,image,points);
 }
}
