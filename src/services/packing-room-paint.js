import {ASSETS} from '../data/assets.js';
import {pieceTiles,PACK_COLS} from '../puzzles/packing.js';
const cache=new Map();let picture;
function source(){return picture??=new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve(img);img.onerror=()=>{picture=null;reject(new Error('Picture unavailable'));};img.src=new URL(ASSETS.packingPicture,new URL('../../',import.meta.url)).href;});}
export async function composePackingThumbnail(placed){
 const img=await source(),large=document.createElement('canvas');large.width=500;large.height=400;
 const ctx=large.getContext('2d'),unit=100;
 placed.forEach((position,id)=>{if(!position)return;for(const tile of pieceTiles(id,position.turn)){ctx.save();ctx.translate((position.column+tile.column+.5)*unit,(position.row+tile.row+.5)*unit);ctx.rotate(tile.turn*Math.PI/2);ctx.drawImage(img,tile.print%PACK_COLS*img.width/5,Math.floor(tile.print/PACK_COLS)*img.height/4,img.width/5,img.height/4,-unit/2,-unit/2,unit,unit);ctx.restore();}});
 const small=document.createElement('canvas');small.width=250;small.height=200;small.getContext('2d').drawImage(large,0,0,250,200);return small;
}
export function hydratePackingRoom(root){
 for(const field of root.querySelectorAll('[data-packing-room]')){
  const key=field.dataset.packingRoom;if(!cache.has(key)){if(cache.size>=12)cache.delete(cache.keys().next().value);cache.set(key,composePackingThumbnail(JSON.parse(key)).then(c=>c.toDataURL('image/png')));}
  cache.get(key).then(url=>{if(field.isConnected&&field.dataset.packingRoom===key)field.style.backgroundImage=`url("${url}")`;}).catch(()=>cache.delete(key));
 }
}
