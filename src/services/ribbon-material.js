import {ASSETS} from '../data/assets.js';
import {RIBBON_TEXTURES,RIBBON_PAPER} from '../data/ribbons.js';
import {BIRTHDAY_HOLES,birthdayCell} from '../data/birthday-lock.js';

let materials;
function prepare(){
 return materials??=new Promise((resolve,reject)=>{
  const img=new Image();img.onload=()=>{
   const textures=RIBBON_TEXTURES.map(([x,y,w,h])=>{const c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(img,x,y,w,h,0,0,w,h);return c.toDataURL();});
   const paper=document.createElement('canvas');paper.width=800;paper.height=320;
   const ctx=paper.getContext('2d'),[x,y,w,h]=RIBBON_PAPER.frames[0];ctx.drawImage(img,x,y,w,h,0,0,800,320);
   // Apertures are registered to the real paper grid, not a visible vector prop.
   for(const [column,row] of BIRTHDAY_HOLES.entries()){const [cx,cy]=birthdayCell(row,column);ctx.clearRect((cx-24)*2,(cy-11)*2,96,44);}
   ctx.font='28px Georgia';ctx.textAlign='center';ctx.fillStyle='#86765c';for(let i=0;i<4;i++)ctx.fillText(['I','II','III','IV'][i],birthdayCell(0,i)[0]*2,301);
   resolve({textures,paper});
  };img.onerror=reject;img.src=ASSETS.ribbonParts;
 });
}
export function hydrateRibbonMaterial(root){
 const tapes=[...root.querySelectorAll('[data-ribbon-texture]')],papers=[...root.querySelectorAll('[data-ribbon-paper]')];
 if(!tapes.length&&!papers.length)return;
 prepare().then(({textures,paper})=>{
  for(const el of tapes)if(el.isConnected){el.style.backgroundImage='url("'+textures[Number(el.dataset.ribbonTexture)]+'")';el.classList.add('ribbon-texture-ready');}
  for(const el of papers)if(el.isConnected){const c=el.querySelector('canvas'),ctx=c.getContext('2d');ctx.clearRect(0,0,800,320);ctx.save();if(el.dataset.turned==='true'){ctx.translate(800,320);ctx.rotate(Math.PI);}if(el.dataset.verso==='true'){ctx.translate(800,0);ctx.scale(-1,1);}ctx.drawImage(paper,0,0);ctx.restore();el.classList.add('ribbon-paper-ready');}
 }).catch(()=>{});
}
