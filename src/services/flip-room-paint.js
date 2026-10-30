import {ASSETS} from '../data/assets.js';
import {FLIP_FACES,FLIP_QUADS} from '../data/flip-apparatus.js';
const images=new Map(),painted=new Map();
function image(asset){if(!images.has(asset))images.set(asset,new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=reject;img.src=new URL(ASSETS[asset],new URL('../../',import.meta.url)).href;}));return images.get(asset);}
const canvas=size=>{const c=document.createElement('canvas');c.width=c.height=size;return c;};
function triangle(ctx,img,frame,source,target){
 const [p,q,r]=source,[a,b,c]=target,det=(q[0]-p[0])*(r[1]-p[1])-(r[0]-p[0])*(q[1]-p[1]);
 const ax=((b[0]-a[0])*(r[1]-p[1])-(c[0]-a[0])*(q[1]-p[1]))/det,ay=((c[0]-a[0])*(q[0]-p[0])-(b[0]-a[0])*(r[0]-p[0]))/det;
 const bx=((b[1]-a[1])*(r[1]-p[1])-(c[1]-a[1])*(q[1]-p[1]))/det,by=((c[1]-a[1])*(q[0]-p[0])-(b[1]-a[1])*(r[0]-p[0]))/det;
 ctx.save();ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.lineTo(...c);ctx.closePath();ctx.clip();ctx.transform(ax,bx,ay,by,a[0]-ax*p[0]-ay*p[1],a[1]-bx*p[0]-by*p[1]);ctx.drawImage(img,...frame,0,0,frame[2],frame[3]);ctx.restore();
}
export async function composeFlipThumbnail(key){
 const [body,faces]=await Promise.all([image('flipCase'),image('flipFaces')]),full=canvas(1254),ctx=full.getContext('2d');ctx.drawImage(body,0,0);
 FLIP_QUADS.forEach((quad,index)=>{const frame=FLIP_FACES.frames[key[index]==='1'?9:index],w=frame[2],h=frame[3];triangle(ctx,faces,frame,[[0,0],[w,0],[w,h]],[quad[0],quad[1],quad[2]]);triangle(ctx,faces,frame,[[0,0],[w,h],[0,h]],[quad[0],quad[2],quad[3]]);});
 let reduced=full;for(const size of[627,314,256]){const next=canvas(size),out=next.getContext('2d');out.imageSmoothingQuality='high';out.drawImage(reduced,0,0,size,size);reduced=next;}return reduced;
}
export function hydrateFlipRoom(root){
 for(const field of root.querySelectorAll('[data-flip-room]')){
  const key=field.dataset.flipRoom;if(!painted.has(key)){if(painted.size>=12)painted.delete(painted.keys().next().value);painted.set(key,composeFlipThumbnail(key).then(c=>c.toDataURL('image/webp',.95)));}
  painted.get(key).then(url=>{if(!field.isConnected||field.dataset.flipRoom!==key)return;field.style.backgroundImage=`url("${url}")`;field.previousElementSibling?.remove();}).catch(()=>painted.delete(key));
 }
}
