import {pointerSession} from './pointer.js';
import {paperBackFits} from '../../puzzles/paper-back.js';
import {motionAllowed} from '../../services/motion/shared.js';

export const floorPose=amount=>`translateY(${-Math.max(0,Math.min(1,amount))*100}%)`;
export function bindPressBack(root,p,{move}){
 const world=root.querySelector('.back-world');if(!world)return ()=>{};
 const controller=new AbortController();
 world.addEventListener('pointerdown',event=>{if(event.target.closest('[data-back-stamp],[data-back-slide]'))world.getAnimations({subtree:true}).forEach(a=>a.finish());},{signal:controller.signal});
 world.addEventListener('keydown',event=>{
  const stamp=event.target.closest('[data-back-stamp]');if(!stamp||p.opened||event.ctrlKey||event.metaKey||event.altKey)return;
  const from=Number(stamp.dataset.backIndex),delta={ArrowLeft:-1,ArrowRight:1,ArrowUp:-1,ArrowDown:1}[event.key];
  const to=event.key==='Home'?0:event.key==='End'?4:delta===undefined?null:Math.max(0,Math.min(4,from+delta));
  if(to===null)return;event.preventDefault();event.stopPropagation();move({type:'reorder',from,to});
 },{signal:controller.signal});
 const floor=world.querySelector('[data-back-floor]');let preview=null,committing=false;
 const stop=pointerSession(root,{
  pick(event){const source=event.target.closest('[data-back-slide]');return source&&!source.disabled?{source}:null;},
  start(g){floor.getAnimations().forEach(a=>a.finish());g.distance=Math.max(42,floor.getBoundingClientRect().width*.23);g.free=paperBackFits(p.order);},
  move(g,event){g.amount=Math.max(0,Math.min(1,(g.y-event.clientY)/g.distance));preview=g.amount*(g.free?1:.07);floor.style.transform=floorPose(preview);},
  end(g,_,cancelled){if(!cancelled&&g.amount>=.55){committing=true;if(!move({type:'submit'}))committing=false;}},
  clear(){if(committing||!floor.isConnected)return;const from=getComputedStyle(floor).transform;floor.style.transform=floorPose(Number(p.opened));if(preview!==null&&motionAllowed())floor.animate([{transform:from},{transform:floor.style.transform}],{duration:220,easing:'ease-out'});preview=null;},
 });
 return ()=>{stop();controller.abort();};
}
export function preparePressBackMove(root,move,arrival){
 const world=root.querySelector('.back-world');
 if(world&&move.type==='fit'&&arrival)world.dataset.backArrival=JSON.stringify(arrival);
}
