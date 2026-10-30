import {ASSETS} from '../data/assets.js';
let promise;
export const cottonTexture=()=>promise??=new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>{promise=null;reject(new Error('Cotton texture did not load'));};image.src=ASSETS.beltCotton;});
// Geometry places bitmap fiber samples; no stroked line is part of the picture.
export function drawCotton(ctx,image,points,{width=10,offset=0}={}){
 let distance=offset;
 for(let i=1;i<points.length;i++){
  const a=points[i-1],b=points[i],length=Math.hypot(b[0]-a[0],b[1]-a[1]);if(!length)continue;
  const sample=distance*12%470;ctx.save();ctx.translate(a[0],a[1]);ctx.rotate(Math.atan2(b[1]-a[1],b[0]-a[0]));
  ctx.drawImage(image,300+sample,225,Math.min(42,Math.max(1,length*12+8)),120,-.4,-width/2,length+.8,width);ctx.restore();distance+=length;
 }
}
