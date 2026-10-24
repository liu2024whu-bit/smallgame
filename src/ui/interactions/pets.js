import { motionAllowed } from '../../services/motion.js';

export function bindPetting(root,{touch,complete}){
  const corner=root.querySelector('[data-pet-corner]'),area=corner?.querySelector('.pet-stroke-area');
  if(!area)return ()=>{};
  const trace=corner.querySelector('.pet-soft-trace'),abort=new AbortController();
  let gesture=null;
  const release=()=>{
    if(!gesture)return;
    if(area.hasPointerCapture(gesture.id))area.releasePointerCapture(gesture.id);
    const moved=gesture.moved;gesture=null;trace.style.opacity='0';if(moved)complete();
  };
  area.addEventListener('pointerdown',event=>{
    if(event.button!==0)return;
    gesture={id:event.pointerId,x:event.clientX,y:event.clientY,distance:0};
    area.setPointerCapture(event.pointerId);
  },{signal:abort.signal});
  area.addEventListener('pointermove',event=>{
    if(!gesture||gesture.id!==event.pointerId)return;
    gesture.distance+=Math.hypot(event.clientX-gesture.x,event.clientY-gesture.y);
    gesture.x=event.clientX;gesture.y=event.clientY;
    const box=corner.getBoundingClientRect();
    trace.style.left=(event.clientX-box.left)+'px';trace.style.top=(event.clientY-box.top)+'px';trace.style.opacity=motionAllowed()?'.6':'0';
    if(gesture.distance>26){gesture.distance=0;gesture.moved=true;touch();}
  },{signal:abort.signal});
  area.addEventListener('pointerup',release,{signal:abort.signal});
  area.addEventListener('pointercancel',()=>{gesture=null;trace.style.opacity='0';},{signal:abort.signal});
  return ()=>{if(gesture&&area.hasPointerCapture(gesture.id))area.releasePointerCapture(gesture.id);gesture=null;trace.style.opacity='0';abort.abort();};
}
