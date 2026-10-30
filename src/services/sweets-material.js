import {ASSETS} from '../data/assets.js';
import {SWEETS_PARTS} from '../data/sweets.js';

let texture;
function cordTexture(){
 return texture??=new Promise((resolve,reject)=>{
  const image=new Image();image.onload=()=>{
   const [x,y,w,h]=SWEETS_PARTS.frames[2],canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;
   canvas.getContext('2d').drawImage(image,x,y,w,h,0,0,w,h);resolve(canvas.toDataURL());
  };image.onerror=reject;image.src=ASSETS.sweetsParts;
 });
}
// Repeat the painted fibres at constant thickness rather than stretching a
// short braid into a long one. The fallback remains until the bitmap is ready.
export function hydrateSweetsMaterial(root){
 const targets=[...root.querySelectorAll('.sweet-cord')];if(!targets.length)return;
 cordTexture().then(url=>targets.forEach(el=>{if(!el.isConnected)return;el.style.backgroundImage=`url("${url}")`;el.classList.add('sweet-cord-ready');})).catch(()=>{texture=null;});
}
