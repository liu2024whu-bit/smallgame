import {pointerSession} from './pointer.js';

export function bindPetting(root,{touch,complete}){
 const area=root.querySelector('.pet-stroke-area');if(!area)return ()=>{};
 const inside=event=>{const b=area.getBoundingClientRect();return event.clientX>=b.left&&event.clientX<=b.right&&event.clientY>=b.top&&event.clientY<=b.bottom;};
 return pointerSession(root,{
  pick(event){if(!event.target.closest('.pet-stroke-area'))return;return {source:area,lastX:event.clientX,lastY:event.clientY,distance:0};},
  move(g,event){const distance=Math.hypot(event.clientX-g.lastX,event.clientY-g.lastY);g.lastX=event.clientX;g.lastY=event.clientY;if(!inside(event))return;g.distance+=distance;if(g.distance>26){g.distance=0;g.moved=true;touch();}},
  end(g,event,cancelled){if(!cancelled&&g.moved&&inside(event))complete();},
 });
}
