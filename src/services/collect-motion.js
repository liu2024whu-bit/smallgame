import {motionAllowed} from './motion/shared.js';

export function capturePickup(source){
 const art=source?.querySelector('.item-art');if(!art)return null;
 const box=art.getBoundingClientRect();if(!box.width||!box.height)return null;
 return {html:art.outerHTML,x:box.x,y:box.y,width:box.width,height:box.height};
}
export function playPickup(root,from){
 if(!from||!motionAllowed())return;
 const target=root.querySelector('.tools-fold summary')??root.querySelector('.dialog-header h2');if(!target)return;
 const to=target.getBoundingClientRect(),ghost=document.createElement('span');
 ghost.className='pickup-flight';ghost.setAttribute('aria-hidden','true');ghost.innerHTML=from.html;
 const width=Math.min(100,from.width),height=from.height*width/from.width;
 const x=from.x+from.width/2-width/2,y=from.y+from.height/2-height/2,dx=to.x+to.width/2-x-width/2,dy=to.y+to.height/2-y-height/2;
 ghost.style.cssText=`left:${x}px;top:${y}px;width:${width}px;height:${height}px;`;
 root.append(ghost);
 const movement=ghost.animate([{translate:'0 0',scale:1,opacity:.95},{translate:`${dx*.55}px ${dy*.55-25}px`,scale:.7,opacity:.8},{translate:`${dx}px ${dy}px`,scale:.2,opacity:0}],{duration:490,easing:'cubic-bezier(.22,.75,.3,1)',fill:'forwards'});
 movement.finished.catch(()=>{}).finally(()=>ghost.remove());
}
