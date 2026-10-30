import {ASSETS} from '../data/assets.js';
import {DRAWER_FRONT,DRAWER_BODY_PARTS,DRAWER_RECTS,DRAWER_SIZE,DRAWER_TRAVEL} from '../data/drawer-apparatus.js';

let prepared;
const thumbnails=new Map();
function resources(){
 if(!prepared)prepared=Promise.all(['drawerFront','drawerBodyParts'].map(name=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=reject;image.src=new URL('../../'+ASSETS[name],import.meta.url).href;})));
 return prepared;
}
function miniature(open,[front,parts]){
 const key=open.join();if(thumbnails.has(key))return thumbnails.get(key);
 const picture=document.createElement('canvas');[picture.width,picture.height]=DRAWER_SIZE.map(Math.ceil);const c=picture.getContext('2d');c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';
 c.drawImage(front,...DRAWER_FRONT.frames[0],0,0,...DRAWER_SIZE);
 for(const r of DRAWER_RECTS)c.drawImage(parts,...DRAWER_BODY_PARTS.frames[1],...r);
 const order=[0,1,2,3].sort((a,b)=>(open[a]?40-a:5+a)-(open[b]?40-b:5+b));
 for(const i of order){const [x,y,w,h]=DRAWER_RECTS[i],scale=1+open[i]*.012;c.drawImage(front,...DRAWER_FRONT.frames[i+1],x+(w-w*scale)/2,y+open[i]*DRAWER_TRAVEL,w*scale,h*scale);}
 // Repeated downsampling keeps fine pencil grain quiet in the room miniature.
 let previous=picture;
 while(previous.width>128){const next=document.createElement('canvas');next.width=Math.ceil(previous.width/2);next.height=Math.ceil(previous.height/2);const ctx=next.getContext('2d');ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';ctx.drawImage(previous,0,0,next.width,next.height);previous=next;}
 thumbnails.set(key,previous);return previous;
}
export function hydrateDrawerRoom(root){
 const fields=[...root.querySelectorAll('canvas[data-drawer-room]')].filter(el=>!el.dataset.drawerReady);if(!fields.length)return;
 fields.forEach(el=>el.dataset.drawerReady='loading');
 resources().then(images=>{for(const el of fields){if(!el.isConnected)continue;const source=miniature(el.dataset.drawerRoom.split(',').map(Number),images),box=el.getBoundingClientRect(),ratio=Math.min(2,devicePixelRatio||1);el.width=Math.max(90,Math.ceil(box.width*ratio));el.height=Math.ceil(el.width*DRAWER_SIZE[1]/DRAWER_SIZE[0]);const c=el.getContext('2d');c.imageSmoothingEnabled=true;c.imageSmoothingQuality='high';c.drawImage(source,0,0,el.width,el.height);el.dataset.drawerReady='true';el.previousElementSibling?.remove();}}).catch(()=>{prepared=null;fields.forEach(el=>delete el.dataset.drawerReady);});
}
