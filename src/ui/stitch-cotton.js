import {cottonTexture,drawCotton} from './raster-cotton.js';
import {stitchPoint,stitchNeedlePoint,needleBack} from '../data/stitch.js';

export function cottonCurve(a,b,sag=12){return Array.from({length:41},(_,i)=>{const t=i/40;return [a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t+Math.sin(t*Math.PI)*sag];});}
const bases=new WeakMap();
function seamLayer(canvas,image,p,back,tight){
 const key=JSON.stringify([p.path,p.tied]),cached=bases.get(canvas);if(!tight&&cached?.key===key)return cached.layer;
 const layer=document.createElement('canvas');layer.width=1536;layer.height=1024;const ctx=layer.getContext('2d');
 for(let i=1;i<p.path.length;i++)if(back===(i%2===1)){
  const a=stitchPoint(p.path[i-1],back),b=stitchPoint(p.path[i],back),sag=p.tied?2:Math.min(14,Math.hypot(b[0]-a[0],b[1]-a[1])*.045)*(1-tight);
  drawCotton(ctx,image,cottonCurve(a,b,sag),{width:12});
 }
 if(!tight)bases.set(canvas,{key,layer});return layer;
}
export async function paintStitchCotton(field,p,{tail=null,tight=0}={}){
 const canvases=[...field.querySelectorAll('[data-stitch-cotton]')],tickets=canvases.map(c=>c._paintTicket=(c._paintTicket??0)+1);
 let image;try{image=await cottonTexture();}catch{return;}
 canvases.forEach((canvas,k)=>{
  if(!canvas.isConnected||canvas._paintTicket!==tickets[k])return;
  const ctx=canvas.getContext('2d'),back=canvas.dataset.stitchCotton==='true';if(tail&&back!==needleBack(p))return;
  ctx.clearRect(0,0,1536,1024);ctx.drawImage(seamLayer(canvas,image,p,back,tight),0,0);
  if(p.finished)return;
  if(!p.path.length){if(p.fitted.every(Boolean)&&back===needleBack(p)){const tip=tail??stitchNeedlePoint(p,back),eye=tip.map((v,i)=>v+(i?-180:0));drawCotton(ctx,image,cottonCurve([tip[0]+35,tip[1]+55],eye,40),{width:11});}return;}
  if(!back){const a=stitchPoint(0,false);drawCotton(ctx,image,cottonCurve([a[0]-32,a[1]-7],a,5),{width:13});}
  if(back===needleBack(p)&&!p.tied){
   const a=stitchPoint(p.path.at(-1),back),b=tail?tail.map((v,i)=>v+(i? -180:0)):stitchNeedlePoint(p,back).map((v,i)=>v+(i?-180:0));
   drawCotton(ctx,image,cottonCurve(a,b,28),{width:11});
  }
 });
}
export function hydrateStitchCotton(root){root.querySelectorAll('[data-stitch-state]').forEach(field=>paintStitchCotton(field,JSON.parse(field.dataset.stitchState)));}
